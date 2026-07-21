import { emailLayout } from "./emailLayout";
import { escapeHtml } from "@/lib/escape-html";

export interface ContactRecord {
    nom?: string;
    email?: string;
    message?: string;
}

//email reçu par l'admin d'une demande depuis le formulaire de contact'
export function contactEmailTemplate(record: ContactRecord) {
    const title = "Nouveau message via formulaire de contact";
    const content = `
        <div class="title">${title}</div>
        <div class="content">
            <div class="data-row"><span class="data-label">Nom :</span> ${escapeHtml(record.nom)}</div>
            <div class="data-row"><span class="data-label">Email :</span> ${escapeHtml(record.email)}</div>
            <div class="hr"></div>
            <div class="data-label">Message :</div>
            <p style="white-space: pre-wrap;">${escapeHtml(record.message)}</p>
        </div>
    `;

    return {
        subject: "Nouveau message via le formulaire de contact",
        html: emailLayout(content, title)
    }
}
