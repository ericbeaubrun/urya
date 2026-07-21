import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Protège /admin/* en amont du rendu : sans ce fichier, le callback
// `authorized` de auth.config.ts n'est jamais exécuté par Next.js.
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
    matcher: ["/admin/:path*"],
};
