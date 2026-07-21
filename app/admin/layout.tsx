import {auth, signOut} from "@/auth";
import {redirect} from "next/navigation";
import styles from "./AdminPage.module.css";
import "./admin-theme.css";
import AdminNav from "./AdminNav";
import React from "react";

export default async function AdminLayout({children}: { children: React.ReactNode }) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const logout = (
        <form
            action={async () => {
                "use server";
                await signOut({redirectTo: "/"});
            }}
        >
            <button type="submit" className={styles.logoutButton}>Déconnexion</button>
        </form>
    );

    return (
        <div className="adminShell">
            <AdminNav email={session?.user?.email} logout={logout}/>
            <main className={styles.main}>{children}</main>
        </div>
    );
}
