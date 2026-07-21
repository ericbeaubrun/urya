import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyAdminCredentials } from "./lib/auth-helpers";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Mot de passe", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const admin = await verifyAdminCredentials(
                    credentials.email as string,
                    credentials.password as string
                );

                if (!admin) {
                    return null;
                }

                return {
                    id: admin.id,
                    email: admin.email,
                    name: admin.email,
                };
            }
        })
    ],
});
