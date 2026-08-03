import {renderEmail} from "@/lib/email-content";

export interface PrestationRecord {
    nom?: string;
    mail?: string;
    tel?: string | null;
    date_debut?: string;
    date_fin?: string | null;
    heure_debut?: string | null;
    heure_fin?: string | null;
    type?: string | null;
    lieu?: string | null;
    notes?: string | null;
}

// email reçu par l'utilisateur après avoir fait une demande de prestation.
// Le contenu est éditable depuis /admin/emails ; sans personnalisation
// enregistrée, c'est le texte par défaut de `lib/email-templates.ts` qui part.
export function clientEmailTemplate(record: PrestationRecord) {
    return renderEmail("prestation_client", record);
}
