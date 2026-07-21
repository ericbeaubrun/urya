import type { NextConfig } from "next";

// Origine Supabase autorisée pour les appels client (auth, requêtes REST).
const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

// 'unsafe-inline' reste nécessaire ici : Next.js injecte des scripts inline
// pour l'hydratation, et framer-motion applique des styles inline. Les
// supprimer demanderait une CSP à nonce (voir la doc Next sur les nonces CSP).
const contentSecurityPolicy = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    // Poster de la vidéo About + images optimisées par Next.
    "img-src 'self' data: blob: https://images.pexels.com",
    "media-src 'self'",
    "font-src 'self' data:",
    `connect-src 'self' ${supabaseOrigin}`.trim(),
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
    { key: "Content-Security-Policy", value: contentSecurityPolicy },
    // Doublon volontaire de frame-ancestors, pour les navigateurs anciens.
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
    {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
    },
];

const nextConfig: NextConfig = {
    async headers() {
        return [
            {
                source: "/:path*",
                headers: securityHeaders,
            },
        ];
    },
};

export default nextConfig;
