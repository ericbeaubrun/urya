import {supabaseAdmin} from "@/lib/supabase_client";
import type {AnalyticsEventName} from "@/lib/analytics-events";

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

export function isPeriod(value: unknown): value is Period {
    return PERIODS.includes(Number(value) as Period);
}

interface EventRow {
    occurred_at: string;
    name: string;
    path: string | null;
    referrer_host: string | null;
    device: string | null;
    props: Record<string, string> | null;
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
    daily: Count[];
    topPages: Count[];
    referrers: Count[];
    devices: Count[];
    ctaSources: Count[];
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
 * Série journalière continue : les jours sans aucune visite doivent apparaître
 * à zéro, sinon la courbe se resserre et masque les creux.
 */
function dailySeries(rows: EventRow[], days: number): Count[] {
    const counts = new Map<string, number>();

    for (const row of rows) {
        if (row.name !== "page_view") continue;
        const day = row.occurred_at.slice(0, 10);
        counts.set(day, (counts.get(day) ?? 0) + 1);
    }

    const series: Count[] = [];
    const cursor = new Date();
    cursor.setUTCHours(0, 0, 0, 0);
    cursor.setUTCDate(cursor.getUTCDate() - (days - 1));

    for (let i = 0; i < days; i++) {
        const day = cursor.toISOString().slice(0, 10);
        series.push({label: day, value: counts.get(day) ?? 0});
        cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    return series;
}

export async function getAnalyticsSummary(period: Period): Promise<AnalyticsSummary> {
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - period);

    const {data, error} = await supabaseAdmin()
        .from("analytics_events")
        .select("occurred_at, name, path, referrer_host, device, props")
        .gte("occurred_at", since.toISOString())
        .order("occurred_at", {ascending: true})
        .range(0, MAX_ROWS - 1);

    if (error) {
        throw new Error(`Lecture des statistiques impossible : ${error.message}`);
    }

    const rows = (data ?? []) as EventRow[];
    const of = (name: AnalyticsEventName) => rows.filter((row) => row.name === name);

    const pageViews = of("page_view").length;
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
        truncated: rows.length >= MAX_ROWS,
        pageViews,
        formViews,
        submissions,
        conversionRate: formViews ? Math.round((submissions / formViews) * 1000) / 10 : 0,
        daily: dailySeries(rows, period),
        topPages: tally(of("page_view").map((row) => row.path)),
        // Un référent absent, c'est un accès direct (favori, saisie, appli de
        // messagerie qui masque l'origine). Le distinguer d'une source connue
        // est justement l'information utile.
        referrers: tally(
            of("page_view").map((row) => row.referrer_host ?? "Accès direct")
        ),
        devices: tally(of("page_view").map((row) => row.device)),
        ctaSources: tally(of("cta_click").map((row) => row.props?.source)),
        funnel: rawFunnel.map((step) => ({
            ...step,
            share: funnelTop ? Math.round((step.value / funnelTop) * 1000) / 10 : 0,
        })),
        formErrors: tally(of("form_error").map((row) => row.props?.field)),
        faqQuestions: tally(of("faq_open").map((row) => row.props?.question)),
    };
}
