import { emailLayout } from "./emailLayout";
import { escapeHtml } from "@/lib/escape-html";

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

//email reçu par l'utilisateur après avoir fait une demande de prestation
export function clientEmailTemplate(record: PrestationRecord) {
    const title = "Demande reçue";
    const content = `
        <div class="title">${title}</div>
        <div class="content">
            <p>Bonjour <strong>${escapeHtml(record.nom)}</strong>,</p>
            <p>Nous avons bien reçu votre demande de prestation et nous vous en remercions.</p>
            <p>Notre équipe examine actuellement les détails de votre projet. Nous reviendrons vers vous dans les plus brefs délais pour discuter de la suite.</p>
            <div class="hr"></div>
            <p style="font-size: 14px; color: #9ca3af;">Si vous avez des questions urgentes, n'hésitez pas à nous contacter directement.</p>
        </div>
    `;

    return {
        subject: "Nous avons bien reçu votre demande",
        html: emailLayout(content, title)
    }
}
