import {auth} from "@/auth";
import {supabaseAdmin} from "@/lib/supabase_client";

/**
 * Garde d'accès à utiliser en première ligne de TOUTE Server Action privilégiée.
 * Les Server Actions sont des endpoints HTTP publics : sans ce contrôle,
 * n'importe qui peut les invoquer.
 */
export async function requireAdmin() {
    const session = await auth();

    if (!session?.user?.email) {
        throw new Error("Non authentifié. Veuillez vous connecter.");
    }

    const {data, error} = await supabaseAdmin()
        .from("admins")
        .select("id, email")
        .eq("email", session.user.email)
        .single();

    if (error || !data) {
        throw new Error("Accès refusé. Vous n'êtes pas administrateur.");
    }

    return data;
}
