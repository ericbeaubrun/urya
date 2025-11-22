"use server";

import {auth} from "@/auth";
import {supabase_client, supabaseAdmin} from "@/lib/supabase_client";
import {revalidatePath} from "next/cache";

async function verifyAdmin() {
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

export async function getClients() {
    try {
        const {data, error} = await supabaseAdmin()
            .from("clients")
            .select("*")
            .order("nom", {ascending: true});

        if (error) {
            throw new Error(`Erreur lors du chargement des clients: ${error.message}`);
        }

        return {success: true, data};
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Erreur inconnue",
            data: []
        };
    }
}

export async function addClient(nom: string, mail: string, p0: string | null, tel?: string) {
    try {
        const admin = await verifyAdmin();

        const {data, error} = await supabaseAdmin()
            .from("clients")
            .insert([{nom, mail, tel}])
            .select();

        if (error) {
            throw new Error(`Erreur lors de l'ajout du client: ${error.message}`);
        }

        revalidatePath("/");
        revalidatePath("/admin");

        return {success: true, data};
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Erreur inconnue"
        };
    }
}

function cleanPrestationData(data: any) {
    const {
        id,
        client,
        ...rest
    } = data;

    const cleaned: any = {};
    for (const key in rest) {
        cleaned[key] = rest[key] === "" ? null : rest[key];
    }

    return cleaned;
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
        const admin = await verifyAdmin();


        const {data, error} = await supabaseAdmin()
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
            throw new Error(`Erreur lors de l'ajout: ${error.message}`);
        }


        revalidatePath("/");
        revalidatePath("/admin");

        return {success: true, data};
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Erreur inconnue"
        };
    }
}

export async function deletePrestation(id: string) {
    try {
        const admin = await verifyAdmin();


        const {error} = await supabaseAdmin()
            .from("prestations")
            .delete()
            .eq("id", id);

        if (error) {
            throw new Error(`Erreur lors de la suppression: ${error.message}`);
        }


        revalidatePath("/");
        revalidatePath("/admin");

        return {success: true};
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Erreur inconnue"
        };
    }
}

export async function updatePrestation(id: string, prestationData: any) {
    try {
        const admin = await verifyAdmin();

        const cleaned = cleanPrestationData(prestationData);

        const {data, error} = await supabaseAdmin()
            .from("prestations")
            .update(cleaned)
            .eq("id", id)
            .select()
            .single();

        if (error) throw new Error(`Erreur lors de la modification: ${error.message}`);

        revalidatePath("/");
        revalidatePath("/admin");

        return {success: true, data};
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Erreur inconnue"
        };
    }
}


export async function getPrestations() {
    try {
        const {data, error} = await supabaseAdmin()
            .from("prestations")
            .select(`
                *,
                client:clients(id, nom, mail, tel)
            `)
            .order("date_debut", {ascending: true});

        if (error) {
            throw new Error(`Erreur lors du chargement: ${error.message}`);
        }

        return {success: true, data};
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Erreur inconnue",
            data: []
        };
    }
}
