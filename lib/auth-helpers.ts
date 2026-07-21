import {supabaseAdmin} from "./supabase_client";
import bcrypt from "bcryptjs";
import {rateLimit} from "./rate-limit";

export interface Admin {
    id: string;
    email: string;
    password_hash: string;
}

/**
 * Hash de rebut, comparé quand l'email n'existe pas afin que le temps de
 * réponse soit le même qu'avec un compte existant. Sans cela, la différence de
 * durée (bcrypt cost 12 ≈ 200-300 ms) permet de distinguer « email inconnu » de
 * « mot de passe faux », donc d'énumérer les comptes admin.
 *
 * Généré avec bcrypt cost 12 ; ne correspond à aucun mot de passe utilisable.
 */
const DUMMY_HASH = "$2a$12$AW9YNbOcEyQMwlxS5HYx3.r/mKR.ERF8k00L1BN/c5C5dG8Jl3kgG";

/** Fenêtre anti-force-brute, par email. */
const LOGIN_ATTEMPT_LIMIT = 10;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export async function verifyAdminCredentials(
    email: string,
    password: string
): Promise<{ id: string; email: string } | null> {
    try {
        const trimmedEmail = email.trim();

        // Freine la force brute même si l'attaquant vise un email valide.
        // Complète (sans remplacer) la limite par IP appliquée aux routes API.
        // La clé est minusculée pour qu'un changement de casse ne remette pas
        // le compteur à zéro ; la requête DB, elle, garde la casse d'origine.
        const attempt = rateLimit(`login:${trimmedEmail.toLowerCase()}`, {
            limit: LOGIN_ATTEMPT_LIMIT,
            windowMs: LOGIN_WINDOW_MS,
        });

        if (!attempt.success) {
            return null;
        }

        const {data, error} = await supabaseAdmin()
            .from("admins")
            .select("id, email, password_hash")
            .eq("email", trimmedEmail)
            .single();

        // Aucun retour anticipé ici : on compare systématiquement un hash, pour
        // que les deux branches coûtent le même temps.
        const hashToCompare = error || !data ? DUMMY_HASH : data.password_hash;
        const isValidPassword = await bcrypt.compare(password, hashToCompare);

        if (error || !data || !isValidPassword) {
            return null;
        }

        return {
            id: data.id,
            email: data.email,
        };
    } catch (error) {
        console.error("Error verifying admin credentials:", error);
        return null;
    }
}

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}
