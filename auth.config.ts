import type { NextAuthConfig } from "next-auth";

// Configuration compatible Edge (aucun import Node : ni bcrypt, ni Supabase).
// Utilisée telle quelle par le middleware, et étendue par auth.ts côté serveur.
export const authConfig = {
    providers: [],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        // Une session admin ne reste pas valide indéfiniment : 8 h, prolongées
        // au plus une fois par heure tant que l'admin reste actif.
        maxAge: 8 * 60 * 60,
        updateAge: 60 * 60,
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith("/admin");

            if (isOnAdmin) {
                return isLoggedIn;
            }

            return true;
        },
    },
} satisfies NextAuthConfig;
