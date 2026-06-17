import { connectToDatabase } from "./mongodb";
import bcrypt from "bcryptjs";

export interface Admin {
    id: string;
    email: string;
    password_hash: string;
}

/**
 * Vérifie les credentials d'un admin contre la base de données
 */
export async function verifyAdminCredentials(
    email: string,
    password: string
): Promise<{ id: string; email: string } | null> {
    try {
        const { db } = await connectToDatabase();
        
        // Récupérer l'admin depuis MongoDB
        const admin = await db.collection("admins").findOne({ email });

        console.log("mongo data : ");
        console.log(admin);

        if (!admin) {
            console.error("Admin not found");
            return null;
        }

        // Vérifier le mot de passe
        const isValidPassword = await bcrypt.compare(password, admin.password_hash);

        if (!isValidPassword) {
            return null;
        }

        // Retourner les infos de l'admin (sans le hash)
        return {
            id: admin._id.toString(),
            email: admin.email,
        };
    } catch (error) {
        console.error("Error verifying admin credentials:", error);
        return null;
    }
}

/**
 * Utilitaire pour hasher un mot de passe
 * Peut être utilisé pour créer des admins
 */
export async function hashPassword(password: string): Promise<string> {
    const res = bcrypt.hash(password, 12);
    console.log("password=" + res);
    return res;
}
