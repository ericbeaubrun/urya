import {getSiteContent} from "@/lib/content";
import ContentEditor from "./ContentEditor";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {refreshSiteContent} from "@/app/actions/content";
import styles from "./ContentEditor.module.css";

export default async function ContentAdminPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const content = await getSiteContent();

    if (!content) {
        // Server Component : pas de `onClick` ni de `window` ici. Le
        // rafraîchissement passe par un formulaire appelant la Server Action.
        return (
            <div className={styles.errorState}>
                <h1>Contenu indisponible</h1>
                <p>Impossible de charger le contenu. Veuillez vérifier la base de données.</p>
                <form
                    action={async () => {
                        "use server";
                        await refreshSiteContent();
                        redirect("/admin/content");
                    }}
                >
                    <button type="submit" className={styles.saveBtn}>Rafraîchir le cache</button>
                </form>
            </div>
        );
    }

    return <ContentEditor initialContent={content}/>;
}
