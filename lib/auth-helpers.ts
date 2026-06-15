import {supabaseAdmin} from "./supabase_client";
import bcrypt from "bcryptjs";

export interface Admin {
    id: string;
    email: string;
    password_hash: string;
}

export async function verifyAdminCredentials(
    email: string,
    password: string
): Promise<{ id: string; email: string } | null> {
    try {
        const {data, error} = await supabaseAdmin()
            .from("admins")
            .select("id, email, password_hash")
            .eq("email", email)
            .single();

        console.log("supabase data : ");
        console.log(data);

        if (error || !data) {
            console.error("Admin not found:", error);
            return null;
        }

        const isValidPassword = await bcrypt.compare(password, data.password_hash);

        if (!isValidPassword) {
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
    const res = bcrypt.hash(password, 12);
    console.log("password=" + res);
    return res;
}
