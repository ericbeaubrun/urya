import {getEmailTemplates} from "@/lib/email-content";
import EmailsEditor from "./EmailsEditor";

// L'accès est contrôlé en amont : `proxy.ts` filtre /admin/*, puis
// `app/admin/layout.tsx` revérifie la session avant de rendre quoi que ce soit.
export default async function EmailsAdminPage() {
    // `getEmailTemplates` retombe toujours sur les valeurs par défaut : l'écran
    // reste utilisable même si la table n'a pas encore été créée.
    const templates = await getEmailTemplates();

    return <EmailsEditor initial={templates}/>;
}
