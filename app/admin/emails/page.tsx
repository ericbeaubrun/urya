import {auth} from "@/auth";
import {getEmailTemplates} from "@/lib/email-content";
import {DEFAULT_TEST_EMAIL} from "@/app/config";
import EmailsEditor from "./EmailsEditor";

// L'accès est contrôlé en amont : `proxy.ts` filtre /admin/*, puis
// `app/admin/layout.tsx` revérifie la session avant de rendre quoi que ce soit.
export default async function EmailsAdminPage() {
    // `getEmailTemplates` retombe toujours sur les valeurs par défaut : l'écran
    // reste utilisable même si la table n'a pas encore été créée.
    const templates = await getEmailTemplates();

    // Le test part par défaut vers l'adresse de l'admin connecté ; la constante
    // ne sert plus que de repli si la session n'expose pas d'e-mail.
    const session = await auth();
    const defaultTestEmail = session?.user?.email ?? DEFAULT_TEST_EMAIL;

    return <EmailsEditor initial={templates} defaultTestEmail={defaultTestEmail}/>;
}
