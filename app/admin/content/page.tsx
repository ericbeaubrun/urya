import {getSiteContent} from "@/lib/content";
import ContentEditor from "./ContentEditor";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {refreshSiteContent} from "@/app/actions/content";

export default async function ContentAdminPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const content = await getSiteContent();

    if (!content) {
        return (
            <div style={{color: 'white', padding: '2rem'}}>
                <h1>Erreur</h1>
                <p>Impossible de charger le contenu. Veuillez vérifier la base de données.</p>
                <button
                    onClick={async () => {
                        await refreshSiteContent();
                        window.location.reload();
                    }}
                >
                    Rafraîchir le cache
                </button>
            </div>
        );
    }

    return (
        <div style={{background: '#09090b', minHeight: '100vh'}}>
            <ContentEditor initialContent={content}/>
        </div>
    );
}
