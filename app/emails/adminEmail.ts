import { emailLayout } from "./emailLayout";
import { escapeHtml, escapeHtmlOr } from "@/lib/escape-html";
import type { PrestationRecord } from "./userEmail";

// email reçu par l'admin lors d'une demande de prestation
export function adminEmailTemplate(record: PrestationRecord) {
    const title = "Nouvelle demande de prestation";
    const content = `
        <div class="title">${title}</div>
        <div class="content">
            <h3 style="color: #ffffff; margin-bottom: 15px;">Informations Client</h3>
            <div class="data-row"><span class="data-label">Nom :</span> ${escapeHtml(record.nom)}</div>
            <div class="data-row"><span class="data-label">Email :</span> ${escapeHtml(record.mail)}</div>
            <div class="data-row"><span class="data-label">Téléphone :</span> ${escapeHtmlOr(record.tel, 'Non renseigné')}</div>

            <div class="hr"></div>

            <h3 style="color: #ffffff; margin-bottom: 15px;">Détails de l'Événement</h3>
            <div class="data-row"><span class="data-label">Date :</span> Du ${escapeHtml(record.date_debut)} au ${escapeHtmlOr(record.date_fin, 'Non renseigné')}</div>
            <div class="data-row"><span class="data-label">Horaires :</span> De ${escapeHtmlOr(record.heure_debut, 'Non renseigné')} à ${escapeHtmlOr(record.heure_fin, 'Non renseigné')}</div>
            <div class="data-row"><span class="data-label">Lieu :</span> ${escapeHtmlOr(record.lieu, 'Non renseigné')}</div>
            <div class="data-row"><span class="data-label">Type :</span> ${escapeHtmlOr(record.type, 'Non renseigné')}</div>

            <div class="hr"></div>

            <h3 style="color: #ffffff; margin-bottom: 15px;">Notes complémentaires</h3>
            <p style="white-space: pre-wrap;">${escapeHtmlOr(record.notes, 'Aucune note')}</p>
        </div>
    `;

    return {
        subject: "Nouvelle demande de prestation",
        html: emailLayout(content, title)
    }
}
