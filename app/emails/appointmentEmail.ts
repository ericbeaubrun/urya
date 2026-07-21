import { emailLayout } from "./emailLayout";
import { escapeHtml, escapeHtmlOr } from "@/lib/escape-html";

export interface AppointmentRecord {
    name?: string;
    contact?: string;
    type?: string | null;
    availability?: string;
}

// email reçu par l'admin d'une demande de premier rendez-vous gratuit
export function appointmentEmailTemplate(record: AppointmentRecord) {
    const title = "Nouvelle demande de rendez-vous gratuit";
    const content = `
        <div class="title">${title}</div>
        <div class="content">
            <div class="data-row"><span class="data-label">Nom / Organisme :</span> ${escapeHtml(record.name)}</div>
            <div class="data-row"><span class="data-label">Contact (Email/Tel) :</span> ${escapeHtml(record.contact)}</div>
            <div class="data-row"><span class="data-label">Type de rendez-vous :</span> ${escapeHtmlOr(record.type, 'Non renseigné')}</div>
            <div class="hr"></div>
            <div class="data-label">Disponibilités :</div>
            <p style="white-space: pre-wrap;">${escapeHtml(record.availability)}</p>
        </div>
    `;

    return {
        subject: "Nouvelle demande de RDV - Urya",
        html: emailLayout(content, title)
    }
}

// email de confirmation envoyé au client
export function appointmentConfirmationEmailTemplate(record: AppointmentRecord) {
    const title = "Confirmation de votre demande de rendez-vous";
    const content = `
        <div class="title">${title}</div>
        <div class="content">
            <p>Bonjour ${escapeHtml(record.name)},</p>
            <p>Merci pour votre demande de rendez-vous gratuit. J'ai bien reçu votre message et je reviendrai vers vous très prochainement pour confirmer l'horaire.</p>
            <div class="hr"></div>
            <p><strong>Récapitulatif de votre demande :</strong></p>
            <div class="data-row"><span class="data-label">Type de rendez-vous :</span> ${escapeHtmlOr(record.type, 'Non renseigné')}</div>
            <div class="data-row"><span class="data-label">Disponibilités :</span> ${escapeHtml(record.availability)}</div>
            <p>À bientôt,<br>Urya</p>
        </div>
    `;

    return {
        subject: "Confirmation de votre demande de rendez-vous - Urya",
        html: emailLayout(content, title)
    }
}
