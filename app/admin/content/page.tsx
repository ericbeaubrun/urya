import {getSiteContent} from "@/lib/content";
import ContentEditor from "./ContentEditor";
import {auth} from "@/auth";
import {redirect} from "next/navigation";

export default async function ContentAdminPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const content = await getSiteContent();

    return (
        <div style={{background: '#09090b', minHeight: '100vh'}}>
            <ContentEditor initialContent={content}/>
        </div>
    );
}
