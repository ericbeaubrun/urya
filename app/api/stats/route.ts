import {NextRequest, NextResponse} from "next/server";
import {enforceRateLimit} from "@/lib/rate-limit";
import {supabaseAdmin} from "@/lib/supabase_client";
import {SITE_URL} from "@/app/site-url";
import {
    detectBrowser,
    detectOs,
    isAnalyticsEventName,
    isDevice,
    isTrackablePath,
    sanitizePath,
    sanitizeProps,
    sanitizeReferrerHost,
} from "@/lib/analytics-events";

/**
 * Ingestion de la mesure d'audience interne.
 *
 * Rien de ce qui entre ici n'est stocké tel quel : le nom d'événement doit
 * figurer dans l'allowlist, les propriétés sont filtrées clé par clé, le
 * chemin est amputé de sa chaîne de requête et le référent réduit à son hôte.
 * L'IP n'est jamais écrite en base ; du User-Agent, seules deux étiquettes
 * issues de listes fermées sont conservées (famille de système, famille de
 * navigateur), jamais la chaîne d'origine ni sa version. C'est la condition de
 * l'absence de bandeau : rien de ce qui est stocké ne singularise un visiteur.
 */

/**
 * Les crawlers représentent typiquement un tiers à la moitié des requêtes.
 * Sans ce filtre, les chiffres sont inexploitables.
 *
 * Le filtrage par User-Agent est grossier — un bot peut mentir — mais les
 * robots légitimes (moteurs, aperçus de lien, supervision) s'annoncent
 * honnêtement, et ce sont eux qui faussent le comptage.
 */
const BOT_PATTERN = /bot|crawl|spider|slurp|headless|lighthouse|preview|monitor|curl|wget|python-requests|axios|facebookexternalhit|whatsapp|telegram|discord|embedly|pingdom|uptime/i;

/** Hôte canonique, pour distinguer le référent externe de la navigation interne. */
const SELF_HOST = (() => {
    try {
        return new URL(SITE_URL).hostname;
    } catch {
        return undefined;
    }
})();

/**
 * Réponse commune à tous les cas.
 *
 * On renvoie systématiquement 204, y compris sur charge utile invalide : le
 * client n'a rien à faire de l'échec (il n'affiche ni ne retente rien), et ne
 * pas distinguer l'accepté du rejeté évite d'offrir un oracle à qui voudrait
 * sonder l'allowlist.
 */
const ACCEPTED = new NextResponse(null, {status: 204});

export async function POST(req: NextRequest) {
    // Un visiteur actif émet une poignée d'événements par minute. La limite
    // laisse largement passer un parcours normal tout en bornant le coût d'un
    // script qui voudrait gonfler les compteurs.
    const limited = enforceRateLimit(req, "stats", {
        limit: 60,
        windowMs: 60 * 1000,
    });
    if (limited) return ACCEPTED;

    // L'endpoint n'a pas vocation à être appelé depuis un autre site. Le
    // contrôle ne résiste pas à un client forgé (qui pose l'en-tête qu'il
    // veut), mais écarte les appels de navigateur illégitimes.
    const origin = req.headers.get("origin");
    if (origin && SELF_HOST && new URL(origin).hostname !== SELF_HOST) {
        return ACCEPTED;
    }

    const userAgent = req.headers.get("user-agent") ?? "";
    if (!userAgent || BOT_PATTERN.test(userAgent)) {
        return ACCEPTED;
    }

    try {
        const body = await req.json();

        const name = body?.name;
        if (!isAnalyticsEventName(name)) {
            return ACCEPTED;
        }

        // Écarté ici aussi, et pas seulement côté client : l'endpoint est
        // public, et une page d'administration ouverte dans un onglet resté
        // chargé avant ce correctif continuerait sinon d'émettre.
        const path = sanitizePath(body?.path);
        if (!isTrackablePath(path)) {
            return ACCEPTED;
        }

        const {error} = await supabaseAdmin()
            .from("analytics_events")
            .insert({
                name,
                path,
                referrer_host: sanitizeReferrerHost(body?.referrer, SELF_HOST),
                device: isDevice(body?.device) ? body.device : null,
                os: detectOs(userAgent),
                browser: detectBrowser(userAgent),
                props: sanitizeProps(name, body?.props),
            });

        if (error) {
            console.error("Erreur d'enregistrement d'un événement d'audience:", error);
        }
    } catch {
        // Charge utile illisible : on ignore sans bruit.
    }

    return ACCEPTED;
}
