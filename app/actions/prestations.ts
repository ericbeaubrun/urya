"use server";

import {supabaseAdmin} from "@/lib/supabase_client";
import {requireAdmin as verifyAdmin} from "@/lib/require-admin";
import {revalidatePath} from "next/cache";
import type {Client, Prestation} from "@/app/admin/DataTypes";

/**
 * Colonnes qu'un administrateur est autorisé à modifier sur une prestation.
 * Tout champ absent de cette liste est ignoré : sans allowlist, l'objet reçu
 * était transmis tel quel à Supabase, ce qui permettait d'écrire n'importe
 * quelle colonne (id, id_client, horodatages...).
 */
const PRESTATION_UPDATABLE_FIELDS = [
    "id_client",
    "statut",
    "date_debut",
    "date_fin",
    "heure_debut",
    "heure_fin",
    "type",
    "lieu",
    "notes",
] as const;

type PrestationUpdatableField = (typeof PRESTATION_UPDATABLE_FIELDS)[number];
export type PrestationInput = Partial<Record<PrestationUpdatableField, string | null>>;

/** Colonnes modifiables sur un client. */
const CLIENT_UPDATABLE_FIELDS = ["nom", "mail", "tel"] as const;

type ClientUpdatableField = (typeof CLIENT_UPDATABLE_FIELDS)[number];
export type ClientInput = Partial<Record<ClientUpdatableField, string | null>>;

/**
 * Ne conserve que les colonnes autorisées et normalise les chaînes vides en
 * `null` (une chaîne vide dans une colonne date fait échouer Postgres).
 */
function pickAllowedFields<K extends string>(
    data: Record<string, unknown>,
    allowed: readonly K[]
): Partial<Record<K, string | null>> {
    const cleaned: Partial<Record<K, string | null>> = {};

    for (const key of allowed) {
        if (!(key in data)) continue;

        const value = data[key];
        if (value === undefined) continue;

        cleaned[key] =
            value === "" || value === null ? null : String(value);
    }

    return cleaned;
}

function errorResult(error: unknown) {
    return {
        success: false as const,
        error: error instanceof Error ? error.message : "Erreur inconnue",
    };
}

export async function getClients() {
    try {
        await verifyAdmin();

        const {data, error} = await supabaseAdmin()
            .from("clients")
            .select("id, nom, mail, tel")
            .order("nom", {ascending: true});

        if (error) {
            throw new Error(`Erreur lors du chargement des clients: ${error.message}`);
        }

        return {success: true as const, data: (data ?? []) as Client[]};
    } catch (error) {
        return {...errorResult(error), data: [] as Client[]};
    }
}

export async function addClient(nom: string, mail: string, tel?: string | null) {
    try {
        await verifyAdmin();

        const {data, error} = await supabaseAdmin()
            .from("clients")
            .insert([{nom, mail, tel: tel || null}])
            .select();

        if (error) {
            throw new Error(`Erreur lors de l'ajout du client: ${error.message}`);
        }

        revalidatePath("/");
        revalidatePath("/admin");

        return {success: true as const, data: (data ?? []) as Client[]};
    } catch (error) {
        return errorResult(error);
    }
}

export async function updateClient(id: string, clientData: ClientInput) {
    try {
        await verifyAdmin();

        const cleaned = pickAllowedFields(clientData, CLIENT_UPDATABLE_FIELDS);

        if (Object.keys(cleaned).length === 0) {
            throw new Error("Aucun champ modifiable fourni.");
        }

        const {data, error} = await supabaseAdmin()
            .from("clients")
            .update(cleaned)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            throw new Error(`Erreur lors de la modification du client: ${error.message}`);
        }

        revalidatePath("/");
        revalidatePath("/admin");

        return {success: true as const, data: data as Client};
    } catch (error) {
        return errorResult(error);
    }
}

export async function addPrestation(prestationData: PrestationInput & { date_debut: string }) {
    try {
        await verifyAdmin();

        const cleaned = pickAllowedFields(prestationData, PRESTATION_UPDATABLE_FIELDS);

        const {data, error} = await supabaseAdmin()
            .from("prestations")
            .insert([{
                ...cleaned,
                statut: cleaned.statut || "en_attente",
            }])
            .select();

        if (error) {
            throw new Error(`Erreur lors de l'ajout: ${error.message}`);
        }

        revalidatePath("/");
        revalidatePath("/admin");

        return {success: true as const, data: (data ?? []) as Prestation[]};
    } catch (error) {
        return errorResult(error);
    }
}

export async function deletePrestation(id: string) {
    try {
        await verifyAdmin();

        const {error} = await supabaseAdmin()
            .from("prestations")
            .delete()
            .eq("id", id);

        if (error) {
            throw new Error(`Erreur lors de la suppression: ${error.message}`);
        }

        revalidatePath("/");
        revalidatePath("/admin");

        return {success: true as const};
    } catch (error) {
        return errorResult(error);
    }
}

export async function updatePrestation(id: string, prestationData: PrestationInput) {
    try {
        await verifyAdmin();

        const cleaned = pickAllowedFields(prestationData, PRESTATION_UPDATABLE_FIELDS);

        if (Object.keys(cleaned).length === 0) {
            throw new Error("Aucun champ modifiable fourni.");
        }

        const {data, error} = await supabaseAdmin()
            .from("prestations")
            .update(cleaned)
            .eq("id", id)
            .select()
            .single();

        if (error) throw new Error(`Erreur lors de la modification: ${error.message}`);

        revalidatePath("/");
        revalidatePath("/admin");

        return {success: true as const, data: data as Prestation};
    } catch (error) {
        return errorResult(error);
    }
}

export async function getPrestations() {
    try {
        await verifyAdmin();

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

        return {success: true as const, data: (data ?? []) as Prestation[]};
    } catch (error) {
        return {...errorResult(error), data: [] as Prestation[]};
    }
}
