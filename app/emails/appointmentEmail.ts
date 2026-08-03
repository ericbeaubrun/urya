import {renderEmail} from "@/lib/email-content";

export interface AppointmentRecord {
    name?: string;
    contact?: string;
    type?: string | null;
    availability?: string;
}

// email reçu par l'admin d'une demande de premier rendez-vous gratuit,
// éditable depuis /admin/emails.
export function appointmentEmailTemplate(record: AppointmentRecord) {
    return renderEmail("appointment_admin", record);
}

// email de confirmation envoyé au client, éditable depuis /admin/emails.
export function appointmentConfirmationEmailTemplate(record: AppointmentRecord) {
    return renderEmail("appointment_client", record);
}
