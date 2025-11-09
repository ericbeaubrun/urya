"use server";

import { auth } from "@/auth";
import {supabase_client, supabaseAdmin} from "@/lib/supabase_client";
import { revalidatePath } from "next/cache";

/**
 * Vérifie si l'utilisateur est un admin connecté
 */
async function verifyAdmin() {
    const session = await auth();

    if (!session?.user?.email) {
        throw new Error("Non authentifié. Veuillez vous connecter.");
    }

    // Vérifier que l'email existe dans la table admins avec le service role key
    const { data, error } = await supabaseAdmin()
        .from("admins")
        .select("id, email")
        .eq("email", session.user.email)
        .single();

    if (error || !data) {
        throw new Error("Accès refusé. Vous n'êtes pas administrateur.");
    }

    return data;
}

/**
 * Récupérer tous les clients
 */
export async function getClients() {
    try {
        const { data, error } = await supabaseAdmin()
            .from("clients")
            .select("*")
            .order("nom", { ascending: true });

        if (error) {
            throw new Error(`Erreur lors du chargement des clients: ${error.message}`);
        }

        return { success: true, data };
    } catch (error) {
        console.error("❌ Erreur getClients:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Erreur inconnue",
            data: []
        };
    }
}

/**
 * Ajouter un client (réservé aux admins)
 */
export async function addClient(nom: string, mail: string, tel?: string) {
    try {
        const admin = await verifyAdmin();
        console.log("✅ Admin vérifié:", admin.email);

        const { data, error } = await supabaseAdmin()
            .from("clients")
            .insert([{ nom, mail, tel }])
            .select();

        if (error) {
            console.error("❌ Erreur Supabase:", error);
            throw new Error(`Erreur lors de l'ajout du client: ${error.message}`);
        }

        console.log("✅ Client ajouté:", data);
        revalidatePath("/");
        revalidatePath("/admin");

        return { success: true, data };
    } catch (error) {
        console.error("❌ Erreur addClient:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Erreur inconnue"
        };
    }
}

/**
 * Ajouter une prestation (réservé aux admins)
 */
export async function addPrestation(prestationData: {
    id_client?: string;
    statut?: string;
    date_debut: string;
    heure_debut?: string;
    heure_fin?: string;
    type?: string;
    lieu?: string;
    notes?: string;
}) {
    try {
        // Vérifier l'authentification
        const admin = await verifyAdmin();

        console.log("✅ Admin vérifié:", admin.email);

        // Ajouter la prestation avec le client admin qui bypass RLS
        const { data, error } = await supabaseAdmin()
            .from("prestations")
            .insert([{
                id_client: prestationData.id_client || null,
                statut: prestationData.statut || "en_attente",
                date_debut: prestationData.date_debut,
                heure_debut: prestationData.heure_debut || null,
                heure_fin: prestationData.heure_fin || null,
                type: prestationData.type || null,
                lieu: prestationData.lieu || null,
                notes: prestationData.notes || null,
            }])
            .select();

        if (error) {
            console.error("❌ Erreur Supabase:", error);
            throw new Error(`Erreur lors de l'ajout: ${error.message}`);
        }

        console.log("✅ Prestation ajoutée:", data);

        // Revalider les pages concernées
        revalidatePath("/");
        revalidatePath("/admin");

        return { success: true, data };
    } catch (error) {
        console.error("❌ Erreur addPrestation:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Erreur inconnue"
        };
    }
}

/**
 * Supprimer une prestation (réservé aux admins)
 */
export async function deletePrestation(id: string) {
    try {
        // Vérifier l'authentification
        const admin = await verifyAdmin();

        console.log("✅ Admin vérifié:", admin.email);

        // Supprimer la prestation avec le client admin qui bypass RLS
        const { error } = await supabaseAdmin()
            .from("prestations")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("❌ Erreur Supabase:", error);
            throw new Error(`Erreur lors de la suppression: ${error.message}`);
        }

        console.log("✅ Prestation supprimée:", id);

        // Revalider les pages concernées
        revalidatePath("/");
        revalidatePath("/admin");

        return { success: true };
    } catch (error) {
        console.error("❌ Erreur deletePrestation:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Erreur inconnue"
        };
    }
}

/**
 * Modifier une prestation (réservé aux admins)
 */
export async function updatePrestation(id: string, prestationData: {
    id_client?: string | null;
    statut?: string;
    date_debut?: string;
    date_fin?: string;
    heure_debut?: string | null;
    heure_fin?: string | null;
    type?: string | null;
    lieu?: string | null;
    notes?: string | null;
}) {
    try {
        // Vérifier l'authentification
        const admin = await verifyAdmin();

        console.log("✅ Admin vérifié:", admin.email);

        // Modifier la prestation avec le client admin qui bypass RLS
        const { data, error } = await supabaseAdmin()
            .from("prestations")
            .update(prestationData)
            .eq("id", id)
            .select();

        if (error) {
            console.error("❌ Erreur Supabase:", error);
            throw new Error(`Erreur lors de la modification: ${error.message}`);
        }

        console.log("✅ Prestation modifiée:", data);

        // Revalider les pages concernées
        revalidatePath("/");
        revalidatePath("/admin");

        return { success: true, data };
    } catch (error) {
        console.error("❌ Erreur updatePrestation:", error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : "Erreur inconnue" 
        };
    }
}

/**
 * Récupérer toutes les prestations (public)
 */
export async function getPrestations() {
    try {
        const { data, error } = await supabaseAdmin()
            .from("prestations")
            .select(`
                *,
                client:clients(id, nom, mail, tel)
            `)
            .order("date_debut", { ascending: true });

        if (error) {
            throw new Error(`Erreur lors du chargement: ${error.message}`);
        }

        return { success: true, data };
    } catch (error) {
        console.error("❌ Erreur getPrestations:", error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : "Erreur inconnue",
            data: []
        };
    }
}
