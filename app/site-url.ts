/**
 * URL canonique du site, utilisée par `sitemap.ts` et `robots.ts`.
 *
 * `NEXT_PUBLIC_SITE_URL` est la source de vérité ; à défaut on retombe sur
 * l'URL fournie par Vercel au déploiement. Le repli en dur ne sert qu'en local,
 * où sitemap et robots ne sont de toute façon pas consultés par un moteur.
 */
export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000")
).replace(/\/$/, "");
