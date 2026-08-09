import type { NextConfig } from "next";

// Origine Supabase autorisée pour les appels client (auth, requêtes REST).
const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

const isDev = process.env.NODE_ENV === "development";

// En développement uniquement :
// - 'unsafe-eval' : React et le runtime Turbopack utilisent eval() pour les
//   sourcemaps, le HMR et la reconstruction des piles d'appels. React ne
//   l'utilise jamais en production, donc la directive n'y est pas ajoutée.
// - websockets : canal de rechargement à chaud du serveur de dev.
// - `upgrade-insecure-requests` est retiré, sinon le http://localhost du
//   serveur de dev est réécrit en https et la page ne charge plus.
const scriptSrc = isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'";

const connectSrc = isDev
    ? `connect-src 'self' ${supabaseOrigin} ws: wss:`.replace(/\s+/g, " ").trim()
    : `connect-src 'self' ${supabaseOrigin}`.trim();

// 'unsafe-inline' reste nécessaire ici : Next.js injecte des scripts inline
// pour l'hydratation, et framer-motion applique des styles inline. Les
// supprimer demanderait une CSP à nonce (voir la doc Next sur les nonces CSP).
const contentSecurityPolicy = [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    // Le poster de la vidéo About est désormais servi localement ; pexels ne
    // reste autorisé que pour les images saisies depuis l'admin (galerie,
    // prestations). À retirer si plus aucun contenu n'y pointe.
    //
    // L'origine Supabase couvre le bucket public de la galerie, où atterrissent
    // les visuels téléversés depuis l'admin. `blob:` sert, lui, aux aperçus
    // produits par la compression avant envoi.
    `img-src 'self' data: blob: https://images.pexels.com ${supabaseOrigin}`.trim(),
    "media-src 'self'",
    "font-src 'self' data:",
    connectSrc,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
    { key: "Content-Security-Policy", value: contentSecurityPolicy },
    // Doublon volontaire de frame-ancestors, pour les navigateurs anciens.
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
    // Jamais en dev : le navigateur épinglerait localhost en https pour deux
    // ans, y compris pour les autres projets servis sur le même port.
    ...(isDev
        ? []
        : [{
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
        }]),
];

// Les fichiers de `public/media` portent un hash de contenu dans leur nom : une
// nouvelle version = un nouveau nom, donc l'URL ne peut jamais désigner autre
// chose. C'est ce qui rend `immutable` sûr — le navigateur ne revalidera
// jamais, pas même sur rechargement forcé.
const immutableCache = "public, max-age=31536000, immutable";

// Les images de `public/` sont référencées depuis le contenu éditable (admin),
// sans hash : leur nom peut être réutilisé pour un visuel différent. On garde
// donc une revalidation quotidienne, avec service du cache périmé pendant que
// la nouvelle version se télécharge en arrière-plan.
const staticCache = "public, max-age=86400, stale-while-revalidate=604800";

const nextConfig: NextConfig = {
    experimental: {
        // Les visuels de galerie transitent par une Server Action. La limite
        // par défaut (1 Mo) suffit à une image compressée, mais pas au repli
        // qui envoie l'original quand le navigateur ne sait pas produire de
        // WebP ; `MAX_UPLOAD_BYTES` reste le plafond réellement appliqué.
        serverActions: {bodySizeLimit: '3mb'},
    },
    async headers() {
        return [
            {
                source: "/:path*",
                headers: securityHeaders,
            },
            {
                source: "/media/:path*",
                headers: [{key: "Cache-Control", value: immutableCache}],
            },
            {
                source: "/:path*.(webp|png|svg|ico)",
                headers: [{key: "Cache-Control", value: staticCache}],
            },
        ];
    },
};

export default nextConfig;
