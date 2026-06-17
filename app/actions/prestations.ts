"use server";

import {auth} from "@/auth";
import {connectToDatabase} from "@/lib/mongodb";
import {revalidatePath} from "next/cache";
import {ObjectId} from "mongodb";

async function verifyAdmin() {
    const session = await auth();

    if (!session?.user?.email) {
        throw new Error("Non authentifié. Veuillez vous connecter.");
    }

    const {db} = await connectToDatabase();
    const admin = await db.collection("admins").findOne({email: session.user.email});

    if (!admin) {
        throw new Error("Accès refusé. Vous n'êtes pas administrateur.");
    }

    return admin;
}

export async function getClients() {
    try {
        const {db} = await connectToDatabase();
        const clients = await db.collection("clients")
            .find({})
            .sort({nom: 1})
            .toArray();

        const data = clients.map(client => ({
            ...client,
            id: client._id.toString()
        }));

        return {success: true, data};
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Erreur inconnue",
            data: []
        };
    }
}

export async function addClient(nom: string, mail: string, tel?: string) {
    try {
        await verifyAdmin();
        const {db} = await connectToDatabase();

        const result = await db.collection("clients").insertOne({nom, mail, tel});
        const data = [{ _id: result.insertedId, nom, mail, tel, id: result.insertedId.toString() }];

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

export async function updateClient(id: string, clientData: { nom?: string, mail?: string, tel?: string }) {
    try {
        await verifyAdmin();
        const {db} = await connectToDatabase();

        await db.collection("clients").updateOne(
            { _id: new ObjectId(id) },
            { $set: clientData }
        );

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
    date_fin?: string | null;
    heure_debut?: string;
    heure_fin?: string;
    type?: string;
    lieu?: string;
    notes?: string;
}) {
    try {
        await verifyAdmin();
        const {db} = await connectToDatabase();

        const doc = {
            id_client: prestationData.id_client ? new ObjectId(prestationData.id_client) : null,
            statut: prestationData.statut || "en_attente",
            date_debut: prestationData.date_debut,
            date_fin: prestationData.date_fin || null,
            heure_debut: prestationData.heure_debut || null,
            heure_fin: prestationData.heure_fin || null,
            type: prestationData.type || null,
            lieu: prestationData.lieu || null,
            notes: prestationData.notes || null,
        };

        const result = await db.collection("prestations").insertOne(doc);
        const data = [{ ...doc, _id: result.insertedId, id: result.insertedId.toString() }];

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
        await verifyAdmin();
        const {db} = await connectToDatabase();

        const result = await db.collection("prestations").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            throw new Error(`Erreur lors de la suppression: Prestation non trouvée`);
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
        await verifyAdmin();
        const {db} = await connectToDatabase();

        const cleaned = cleanPrestationData(prestationData);
        
        // Convert id_client to ObjectId if present
        if (cleaned.id_client) {
            cleaned.id_client = new ObjectId(cleaned.id_client);
        }

        const result = await db.collection("prestations").findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: cleaned },
            { returnDocument: 'after' }
        );

        if (!result) throw new Error(`Erreur lors de la modification: Prestation non trouvée`);

        const data = { ...result, id: result._id.toString() };

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
        const {db} = await connectToDatabase();
        
        const prestations = await db.collection("prestations").aggregate([
            {
                $lookup: {
                    from: "clients",
                    localField: "id_client",
                    foreignField: "_id",
                    as: "client"
                }
            },
            {
                $unwind: { path: "$client", preserveNullAndEmptyArrays: true }
            },
            {
                $sort: { date_debut: 1 }
            }
        ]).toArray();

        const data = prestations.map(p => ({
            ...p,
            id: p._id.toString(),
            id_client: p.id_client ? p.id_client.toString() : null,
            client: p.client ? { ...p.client, id: p.client._id.toString() } : null
        }));

        return {success: true, data};
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Erreur inconnue",
            data: []
        };
    }
}


export async function getAllPrestationsForCalendar() {
    try {
        await verifyAdmin();
        const {db} = await connectToDatabase();
        
        const prestations = await db.collection("prestations")
            .find({})
            .sort({ date_debut: 1 })
            .toArray();

        const data = prestations.map(p => ({
            id: p._id.toString(),
            statut: p.statut,
            date_debut: p.date_debut,
            date_fin: p.date_fin,
            heure_debut: p.heure_debut,
            heure_fin: p.heure_fin,
            type: p.type,
            lieu: p.lieu
        }));

        return {success: true, data};
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Erreur inconnue",
            data: []
        };
    }
}


export async function getPublicPrestations() {
    try {
        const {db} = await connectToDatabase();
        
        // Filter out sensitive data and private prestations if needed
        const prestations = await db.collection("prestations")
            .find({
                statut: { $nin: ["en_attente", "annulee"] }
            })
            .sort({ date_debut: 1 })
            .toArray();

        const data = prestations.map(p => ({
            id: p._id.toString(),
            statut: p.statut,
            date_debut: p.date_debut,
            date_fin: p.date_fin,
            heure_debut: p.heure_debut,
            heure_fin: p.heure_fin,
            type: p.type
        }));

        return {success: true, data};
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Erreur inconnue",
            data: []
        };
    }
}
