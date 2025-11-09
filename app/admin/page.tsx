import {auth, signOut} from "@/auth";
import PrestationsAdminPage from "@/app/admin/PrestationsAdminPage";
import {redirect} from "next/navigation";
import styles from "./AdminPage.module.css";

export default async function AdminPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <div>
            <div className={styles.header}>
                <div>
                    <strong>Connecté en tant que:</strong> {session.user?.email}
                </div>
                <form
                    action={async () => {
                        "use server";
                        await signOut({redirectTo: "/"});
                    }}
                >
                    <button type="submit" className={styles.logoutButton}>
                        Déconnexion
                    </button>
                </form>
            </div>
            <PrestationsAdminPage/>
        </div>
    );
}
