/**
 * Script pour créer un admin dans la base de données
 * 
 * Usage:
 * 1. Installer ts-node: npm install -D ts-node
 * 2. Exécuter: npx ts-node scripts/create-admin.ts
 * 
 * Ou utilisez ce script pour générer un hash et l'insérer manuellement dans Supabase
 */

import { hashPassword } from "../lib/auth-helpers";

async function createAdmin() {
    const email = "admin@example.com";
    const password = "admin123";

    const passwordHash = await hashPassword(password);

    console.log("\n=== CRÉER UN ADMIN ===");
    console.log("\nCopiez cette requête SQL dans l'éditeur SQL de Supabase:\n");
    console.log(`INSERT INTO admins (email, password_hash) VALUES ('${email}', '${passwordHash}');`);
    console.log("\n======================\n");
}

createAdmin();
