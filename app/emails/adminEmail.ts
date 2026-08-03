import {renderEmail} from "@/lib/email-content";
import type {PrestationRecord} from "./userEmail";

// email reçu par l'admin lors d'une demande de prestation, éditable depuis
// /admin/emails.
export function adminEmailTemplate(record: PrestationRecord) {
    return renderEmail("prestation_admin", record);
}
