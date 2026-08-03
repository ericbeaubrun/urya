import {renderEmail} from "@/lib/email-content";

export interface ContactRecord {
    nom?: string;
    email?: string;
    message?: string;
}

// email reçu par l'admin depuis le formulaire de contact, éditable depuis
// /admin/emails.
export function contactEmailTemplate(record: ContactRecord) {
    return renderEmail("contact_admin", record);
}
