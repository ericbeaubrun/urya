/**
 * Contrat partagé entre le traqueur client (`lib/analytics.ts`) et la route
 * d'ingestion (`app/api/stats/route.ts`).
 *
 * L'endpoint d'ingestion est public : n'importe qui peut y poster n'importe
 * quoi. Cette allowlist a donc deux rôles distincts, tous deux essentiels.
 *
 * 1. Technique : empêcher un tiers de polluer les statistiques avec des
 *    événements arbitraires, et la table de grossir sans borne.
 * 2. Juridique : garantir qu'aucune donnée personnelle ne peut atteindre la
 *    base, même par erreur d'instrumentation. Une mesure d'audience n'est
 *    exemptée de consentement que si elle reste anonyme et agrégée ; il suffit
 *    d'un `track("form_error", {value: email})` posé sans réfléchir pour faire
 *    tomber l'exemption. Ici, une clé hors liste est écartée, point.
 */

/**
 * Événements suivis. Chaque entrée déclare les clés de propriétés autorisées ;
 * toute autre clé est supprimée à l'ingestion.
 *
 * Règle à respecter en ajoutant un événement : les propriétés décrivent des
 * *catégories* (quel bouton, quelle étape, quel champ), jamais des *valeurs*
 * saisies par le visiteur.
 */
export const ANALYTICS_EVENTS = {
    /** Page vue. Émis au chargement et à chaque navigation client. */
    page_view: [],

    /** Clic sur un appel à l'action menant au formulaire. */
    cta_click: ["source"],

    /** Le formulaire entre dans le champ de vision. Sommet de l'entonnoir. */
    form_view: [],

    /** Passage à une étape du formulaire de devis. */
    form_step: ["step"],

    /** Erreur de validation. `field` est le NOM du champ, jamais son contenu. */
    form_error: ["field"],

    /** Départ de la page avec un formulaire entamé mais non envoyé. */
    form_abandon: ["step"],

    /** Demande de devis envoyée avec succès. */
    booking_submit: ["type"],

    /** Demande de rappel envoyée avec succès (tunnel à faible friction). */
    appointment_submit: ["type"],

    /** Ouverture d'une question de la FAQ. Signal d'intention. */
    faq_open: ["question"],
} as const satisfies Record<string, readonly string[]>;

export type AnalyticsEventName = keyof typeof ANALYTICS_EVENTS;

export type AnalyticsProps<N extends AnalyticsEventName> =
    (typeof ANALYTICS_EVENTS)[N][number] extends never
        ? undefined
        : Partial<Record<(typeof ANALYTICS_EVENTS)[N][number], string | number>>;

/** Au-delà, la valeur est tronquée : aucune catégorie légitime n'est si longue. */
export const MAX_PROP_LENGTH = 60;

/** Idem pour les chemins, qui viennent du client donc de nulle part de sûr. */
export const MAX_PATH_LENGTH = 200;

export function isAnalyticsEventName(value: unknown): value is AnalyticsEventName {
    return typeof value === "string" && Object.hasOwn(ANALYTICS_EVENTS, value);
}

/**
 * Normalise une valeur de propriété.
 *
 * Les sauts de ligne et caractères de contrôle sont écrasés : ces valeurs sont
 * réaffichées telles quelles dans les tableaux de l'admin, et une catégorie
 * multiligne casse la mise en page pour rien.
 */
function normalizePropValue(value: unknown): string | null {
    if (typeof value !== "string" && typeof value !== "number") return null;

    const clean = String(value).replace(/\s+/g, " ").trim();
    if (!clean) return null;

    return clean.slice(0, MAX_PROP_LENGTH);
}

/**
 * Ne conserve que les propriétés déclarées pour cet événement, normalisées.
 * Renvoie `null` s'il ne reste rien, pour éviter des `{}` inutiles en base.
 */
export function sanitizeProps(
    name: AnalyticsEventName,
    props: unknown
): Record<string, string> | null {
    const allowed: readonly string[] = ANALYTICS_EVENTS[name];
    if (!allowed.length || !props || typeof props !== "object") return null;

    const result: Record<string, string> = {};

    for (const key of allowed) {
        const value = normalizePropValue((props as Record<string, unknown>)[key]);
        if (value !== null) {
            result[key] = value;
        }
    }

    return Object.keys(result).length ? result : null;
}

/**
 * Ne garde que le chemin, en écartant la chaîne de requête.
 *
 * Les paramètres de campagne (`utm_*`, `gclid`, `fbclid`) sont des
 * identifiants de session publicitaire : les stocker reviendrait à conserver
 * un traceur inter-sites, exactement ce que l'exemption interdit.
 */
export function sanitizePath(value: unknown): string | null {
    if (typeof value !== "string") return null;

    const path = value.split(/[?#]/)[0].trim();
    if (!path.startsWith("/")) return null;

    return path.slice(0, MAX_PATH_LENGTH);
}

/**
 * Chemins exclus de la mesure : ils ne relèvent pas de l'audience du site.
 *
 * L'administration et l'écran de connexion sont fréquentés par l'exploitant,
 * pas par des visiteurs. Les y compter fausse tout : les pages vues, mais
 * surtout le taux de conversion, calculé sur un dénominateur gonflé par des
 * consultations internes.
 */
const UNTRACKED_PREFIXES = ["/admin", "/login"];

export function isTrackablePath(path: string | null | undefined): boolean {
    if (!path) return false;

    return !UNTRACKED_PREFIXES.some(
        prefix => path === prefix || path.startsWith(`${prefix}/`)
    );
}

/**
 * Réduit un référent à son seul nom d'hôte.
 *
 * Une URL de référent complète peut contenir la requête tapée par le visiteur,
 * parfois nominative. Le nom d'hôte suffit à répondre à la seule question
 * utile : d'où viennent les visiteurs.
 */
export function sanitizeReferrerHost(value: unknown, selfHost?: string): string | null {
    if (typeof value !== "string" || !value) return null;

    let host: string;
    try {
        host = new URL(value).hostname.replace(/^www\./, "");
    } catch {
        return null;
    }

    // La navigation interne n'est pas une source d'acquisition.
    if (!host || (selfHost && host === selfHost.replace(/^www\./, ""))) return null;

    return host.slice(0, MAX_PROP_LENGTH);
}

export const DEVICES = ["mobile", "desktop"] as const;
export type Device = (typeof DEVICES)[number];

export function isDevice(value: unknown): value is Device {
    return typeof value === "string" && (DEVICES as readonly string[]).includes(value);
}
