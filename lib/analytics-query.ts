import {supabaseAdmin} from "@/lib/supabase_client";
import {DEVICE_LABELS, isDevice, type AnalyticsEventName} from "@/lib/analytics-events";

/**
 * Agrégation des statistiques d'audience pour l'admin.
 *
 * Les événements sont rapatriés puis agrégés en mémoire plutôt qu'en SQL.
 * À l'échelle du site — quelques milliers de lignes par mois — c'est
 * instantané, et cela évite d'entretenir des fonctions SQL côté Supabase pour
 * des regroupements qui tiennent en dix lignes de TypeScript. Si le volume
 * venait à croître d'un ordre de grandeur, c'est ici qu'il faudrait basculer
 * sur des vues agrégées.
 */

/** Plafond de sécurité : au-delà, les chiffres affichés seraient tronqués. */
const MAX_ROWS = 50_000;

export const PERIODS = [7, 30, 90] as const;
export type Period = (typeof PERIODS)[number];

export const DEFAULT_PERIOD: Period = 30;

export function isPeriod(value: unknown): value is Period {
    return PERIODS.includes(Number(value) as Period);
}

/* -------------------------------------------------------------------------
 * Jours civils
 *
 * `occurred_at` est un instant UTC ; l'exploitant, lui, raisonne en journées
 * françaises. Découper en UTC décalerait chaque soirée sur le lendemain (Paris
 * est en avance d'une à deux heures), ce qui rend une sélection de jour et une
 * répartition horaire tout simplement fausses.
 * ---------------------------------------------------------------------- */

const TIME_ZONE = "Europe/Paris";

const PARIS_PARTS = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
});

function parisParts(at: Date) {
    const parts: Record<string, string> = {};
    for (const part of PARIS_PARTS.formatToParts(at)) {
        if (part.type !== "literal") parts[part.type] = part.value;
    }

    return {
        day: `${parts.year}-${parts.month}-${parts.day}`,
        hour: Number(parts.hour),
        iso: `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`,
    };
}

/** Décalage de Paris sur UTC à cet instant, changements d'heure compris. */
function parisOffsetMs(at: Date): number {
    return Date.parse(`${parisParts(at).iso}Z`) - at.getTime();
}

/**
 * Instant UTC correspondant à minuit, heure de Paris, du jour donné.
 *
 * En deux passes : le décalage dépend de l'instant, et l'instant du décalage.
 * La première approximation part du décalage en vigueur à la même heure UTC,
 * la seconde le réévalue à l'instant candidat. Sans cette reprise, les deux
 * journées de changement d'heure sont décalées d'une heure entière — c'est
 * précisément à leur frontière que le calcul naïf se trompe.
 */
function parisMidnight(day: string): Date {
    const naive = Date.parse(`${day}T00:00:00Z`);
    const approx = naive - parisOffsetMs(new Date(naive));

    return new Date(naive - parisOffsetMs(new Date(approx)));
}

/** Arithmétique sur un jour civil `AAAA-MM-JJ`, indépendante du fuseau. */
export function shiftDay(day: string, delta: number): string {
    const date = new Date(`${day}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + delta);

    return date.toISOString().slice(0, 10);
}

/** Jour courant à Paris. */
export function today(): string {
    return parisParts(new Date()).day;
}

/**
 * Valide un jour venu de l'URL. Le format ne suffit pas : `2026-02-31` le
 * respecte sans exister, et un jour futur produirait un écran vide sans que
 * l'on comprenne pourquoi.
 */
export function isDay(value: unknown): value is string {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

    const parsed = Date.parse(`${value}T00:00:00Z`);
    if (Number.isNaN(parsed)) return false;

    return new Date(parsed).toISOString().slice(0, 10) === value && value <= today();
}

/* ---------------------------------------------------------------------- */

/** Fenêtre analysée : soit les N derniers jours, soit une seule journée. */
export type Range =
    | {kind: "period"; days: Period}
    | {kind: "day"; day: string};

/**
 * Lit la fenêtre depuis les paramètres d'URL. `periode` reste porté même
 * lorsqu'un jour est sélectionné : il détermine l'étendue du graphique de
 * fréquentation, qui sert justement de sélecteur de jour.
 */
export function parseRange(periode: unknown, jour: unknown): Range {
    if (isDay(jour)) return {kind: "day", day: jour};

    return {kind: "period", days: isPeriod(periode) ? (Number(periode) as Period) : DEFAULT_PERIOD};
}

export function parsePeriod(periode: unknown): Period {
    return isPeriod(periode) ? (Number(periode) as Period) : DEFAULT_PERIOD;
}

/** Bornes UTC `[from, to[` de la fenêtre, en jours civils français. */
export function rangeBounds(range: Range): {from: Date; to: Date} {
    const last = range.kind === "day" ? range.day : today();
    const first = range.kind === "day" ? range.day : shiftDay(last, -(range.days - 1));

    return {from: parisMidnight(first), to: parisMidnight(shiftDay(last, 1))};
}

interface EventRow {
    occurred_at: string;
    name: string;
    path: string | null;
    referrer_host: string | null;
    device: string | null;
    os: string | null;
    browser: string | null;
    props: Record<string, string> | null;
}

/** Ligne enrichie de son jour et de son heure locale, calculés une seule fois. */
interface DatedRow extends EventRow {
    day: string;
    hour: number;
}

export interface Count {
    label: string;
    value: number;
}

export interface FunnelStep {
    label: string;
    value: number;
    /** Part des visiteurs encore présents, rapportée au sommet de l'entonnoir. */
    share: number;
}

export interface AnalyticsSummary {
    /** `true` si le plafond de lignes a été atteint : chiffres sous-estimés. */
    truncated: boolean;
    pageViews: number;
    formViews: number;
    submissions: number;
    /** Envois rapportés aux vues du formulaire, en pourcentage. */
    conversionRate: number;
    topPages: Count[];
    referrers: Count[];
    devices: Count[];
    systems: Count[];
    browsers: Count[];
    /** Pages vues par heure locale : 24 entrées, de « 00 h » à « 23 h ». */
    hourly: Count[];
    /** Pages vues par jour de la semaine, du lundi au dimanche. Vide sur une journée. */
    weekdays: Count[];
    ctaSources: Count[];
    /** Clics sur un contact direct, par canal. Conversions hors entonnoir. */
    contactClicks: Count[];
    funnel: FunnelStep[];
    formErrors: Count[];
    faqQuestions: Count[];
}

/** Agrège par clé, trie par fréquence décroissante et ne garde que le haut du panier. */
function tally(values: (string | null | undefined)[], limit = 8): Count[] {
    const counts = new Map<string, number>();

    for (const value of values) {
        if (!value) continue;
        counts.set(value, (counts.get(value) ?? 0) + 1);
    }

    return [...counts.entries()]
        .map(([label, value]) => ({label, value}))
        .sort((a, b) => b.value - a.value)
        .slice(0, limit);
}

/**
 * Répartition sur un axe fixe et ordonné (heures, jours de la semaine).
 *
 * Contrairement à `tally`, l'ordre est celui de l'axe et les cases vides sont
 * conservées : une plage horaire sans visite est une information, pas un trou
 * à refermer.
 */
function distribute(labels: readonly string[], indexes: number[]): Count[] {
    const counts = new Array(labels.length).fill(0);

    for (const index of indexes) {
        if (index >= 0 && index < counts.length) counts[index]++;
    }

    return labels.map((label, i) => ({label, value: counts[i]}));
}

const HOUR_LABELS = Array.from({length: 24}, (_, h) => String(h).padStart(2, "0"));

// Abrégés : sept libellés se partagent la largeur d'une carte, « Mercredi »
// n'y tiendrait pas.
const WEEKDAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"] as const;

/** Index lundi = 0, pour coller à la semaine française. */
function weekdayIndex(day: string): number {
    return (new Date(`${day}T12:00:00Z`).getUTCDay() + 6) % 7;
}

async function fetchRows(range: Range, columns: string): Promise<{rows: DatedRow[]; truncated: boolean}> {
    const {from, to} = rangeBounds(range);

    const {data, error} = await supabaseAdmin()
        .from("analytics_events")
        .select(columns)
        .gte("occurred_at", from.toISOString())
        .lt("occurred_at", to.toISOString())
        .order("occurred_at", {ascending: true})
        .range(0, MAX_ROWS - 1);

    if (error) {
        throw new Error(`Lecture des statistiques impossible : ${error.message}`);
    }

    const raw = (data ?? []) as unknown as EventRow[];
    const rows = raw.map((row) => {
        const {day, hour} = parisParts(new Date(row.occurred_at));

        return {...row, day, hour};
    });

    return {rows, truncated: rows.length >= MAX_ROWS};
}

/**
 * Série journalière continue des pages vues sur la période.
 *
 * Lue séparément du reste : elle couvre toujours la période entière, y compris
 * lorsqu'une seule journée est détaillée en dessous, puisque c'est elle qui
 * sert de sélecteur de jour. Les jours sans aucune visite apparaissent à zéro,
 * sinon la courbe se resserre et masque les creux.
 */
export async function getDailySeries(days: Period): Promise<Count[]> {
    const {rows} = await fetchRows({kind: "period", days}, "occurred_at, name");

    const counts = new Map<string, number>();
    for (const row of rows) {
        if (row.name !== "page_view") continue;
        counts.set(row.day, (counts.get(row.day) ?? 0) + 1);
    }

    const last = today();

    return Array.from({length: days}, (_, i) => {
        const day = shiftDay(last, -(days - 1 - i));

        return {label: day, value: counts.get(day) ?? 0};
    });
}

export async function getAnalyticsSummary(range: Range): Promise<AnalyticsSummary> {
    const {rows, truncated} = await fetchRows(
        range,
        "occurred_at, name, path, referrer_host, device, os, browser, props"
    );

    const of = (name: AnalyticsEventName) => rows.filter((row) => row.name === name);

    const views = of("page_view");
    const pageViews = views.length;
    const formViews = of("form_view").length;
    const bookings = of("booking_submit").length;
    const appointments = of("appointment_submit").length;
    const submissions = bookings + appointments;

    // Les étapes intermédiaires portent leur numéro en propriété : un seul
    // nom d'événement suffit, ce qui évite d'en déclarer un par étape.
    const stepCount = (step: string) =>
        of("form_step").filter((row) => row.props?.step === step).length;

    const funnelTop = formViews;
    const rawFunnel: Count[] = [
        {label: "Formulaire vu", value: funnelTop},
        {label: "Étape 1 — Date", value: stepCount("1")},
        {label: "Étape 2 — Prestation", value: stepCount("2")},
        {label: "Étape 3 — Coordonnées", value: stepCount("3")},
        {label: "Étape 4 — Récapitulatif", value: stepCount("4")},
        {label: "Devis envoyé", value: bookings},
        {label: "Rappel demandé", value: appointments},
    ];

    return {
        truncated,
        pageViews,
        formViews,
        submissions,
        conversionRate: formViews ? Math.round((submissions / formViews) * 1000) / 10 : 0,
        topPages: tally(views.map((row) => row.path)),
        // Un référent absent, c'est un accès direct (favori, saisie, appli de
        // messagerie qui masque l'origine). Le distinguer d'une source connue
        // est justement l'information utile.
        referrers: tally(views.map((row) => row.referrer_host ?? "Accès direct")),
        devices: tally(
            views.map((row) => (isDevice(row.device) ? DEVICE_LABELS[row.device] : null))
        ),
        systems: tally(views.map((row) => row.os)),
        browsers: tally(views.map((row) => row.browser)),
        hourly: distribute(HOUR_LABELS, views.map((row) => row.hour)),
        // Sur une seule journée, la répartition hebdomadaire n'aurait qu'une
        // barre : elle n'a de sens que sur une période.
        weekdays: range.kind === "period"
            ? distribute(WEEKDAY_LABELS, views.map((row) => weekdayIndex(row.day)))
            : [],
        ctaSources: tally(of("cta_click").map((row) => row.props?.source)),
        contactClicks: tally(of("contact_click").map((row) => row.props?.channel)),
        funnel: rawFunnel.map((step) => ({
            ...step,
            share: funnelTop ? Math.round((step.value / funnelTop) * 1000) / 10 : 0,
        })),
        formErrors: tally(of("form_error").map((row) => row.props?.field)),
        faqQuestions: tally(of("faq_open").map((row) => row.props?.question)),
    };
}
