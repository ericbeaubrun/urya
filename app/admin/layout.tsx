import {auth, signOut} from "@/auth";
import Link from "next/link";
import styles from "./AdminPage.module.css";
import React from "react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();



   
    if (!session) {
        //redirect("/login")
    }

    return (
    <div>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <strong>Connecté en tant que:</strong> {session?.user?.email}
        </div>
        <nav className={styles.nav}>
          <Link href="/admin/prestations/futures">Prestations à venir</Link>
          <Link href="/admin/prestations/passees">Prestations passées</Link>
          <Link href="/admin/prestations/toutes">Voir tout</Link>
          <Link href="/admin/prestations/calendrier">Vue calendrier</Link>
          <Link href="/admin/prestations/ajouter">Ajout de prestations</Link>
                    <form
                        action={async () => {
                            "use server";
                            await signOut({ redirectTo: "/" });
                        }}
                    >
                        <button type="submit" className={styles.logoutButton}>Déconnexion</button>
                    </form>
                </nav>
            </div>
            <main>{children}</main>
        </div>
    );
}
