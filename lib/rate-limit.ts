import {NextRequest, NextResponse} from "next/server";

/**
 * Limiteur de débit à fenêtre fixe, en mémoire et sans dépendance.
 *
 * ATTENTION : l'état vit dans le processus. En déploiement serverless
 * (Vercel), chaque instance a son propre compteur : la limite réelle est donc
 * « limite × nombre d'instances actives ». C'est suffisant pour stopper un
 * script naïf, mais pas un attaquant distribué. Pour une protection sérieuse,
 * remplacer le Map par un store partagé (Upstash Redis, Vercel KV) et ajouter
 * un captcha sur les formulaires publics.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Évite que la Map ne grossisse indéfiniment sur un processus longue durée.
function pruneExpired(now: number) {
    if (buckets.size < 5000) return;

    for (const [key, bucket] of buckets) {
        if (bucket.resetAt <= now) {
            buckets.delete(key);
        }
    }
}

/**
 * Identifie l'appelant. `x-forwarded-for` est falsifiable en direct, mais
 * derrière un proxy de confiance (Vercel) il est réécrit, donc fiable.
 */
export function getClientIp(req: NextRequest): string {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }

    return req.headers.get("x-real-ip") ?? "unknown";
}

export interface RateLimitOptions {
    /** Nombre de requêtes autorisées par fenêtre. */
    limit: number;
    /** Durée de la fenêtre, en millisecondes. */
    windowMs: number;
}

export interface RateLimitResult {
    success: boolean;
    remaining: number;
    /** Secondes avant réouverture, pour l'en-tête Retry-After. */
    retryAfter: number;
}

export function rateLimit(
    identifier: string,
    {limit, windowMs}: RateLimitOptions
): RateLimitResult {
    const now = Date.now();
    pruneExpired(now);

    const bucket = buckets.get(identifier);

    if (!bucket || bucket.resetAt <= now) {
        buckets.set(identifier, {count: 1, resetAt: now + windowMs});
        return {success: true, remaining: limit - 1, retryAfter: 0};
    }

    bucket.count += 1;

    if (bucket.count > limit) {
        return {
            success: false,
            remaining: 0,
            retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
        };
    }

    return {success: true, remaining: limit - bucket.count, retryAfter: 0};
}

/**
 * Applique une limite et renvoie une réponse 429 prête à l'emploi si dépassée,
 * sinon `null` (la route peut continuer).
 */
export function enforceRateLimit(
    req: NextRequest,
    scope: string,
    options: RateLimitOptions
): NextResponse | null {
    const result = rateLimit(`${scope}:${getClientIp(req)}`, options);

    if (result.success) {
        return null;
    }

    return NextResponse.json(
        {error: "Trop de requêtes. Veuillez réessayer dans quelques minutes."},
        {status: 429, headers: {"Retry-After": String(result.retryAfter)}}
    );
}
