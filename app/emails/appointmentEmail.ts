import { emailLayout } from "./emailLayout";

// email reçu par l'admin d'une demande de premier rendez-vous gratuit
export function appointmentEmailTemplate(record: any) {
    const title = "Nouvelle demande de rendez-vous gratuit";
    const content = `
        <div class="title">${title}</div>
        <div class="content">
            <div class="data-row"><span class="data-label">Nom / Organisme :</span> ${record.name}</div>
            <div class="data-row"><span class="data-label">Contact (Email/Tel) :</span> ${record.contact}</div>
            <div class="data-row"><span class="data-label">Type de rendez-vous :</span> ${record.type}</div>
            <div class="hr"></div>
            <div class="data-label">Disponibilités :</div>
            <p style="white-space: pre-wrap;">${record.availability}</p>
        </div>
    `;

    return {
        subject: "Nouvelle demande de RDV - Urya",
        html: emailLayout(content, title)
    }
}

// email de confirmation envoyé au client
export function appointmentConfirmationEmailTemplate(record: any) {
    const title = "Confirmation de votre demande de rendez-vous";
    const content = `
        <div class="title">${title}</div>
        <div class="content">
            <p>Bonjour ${record.name},</p>
            <p>Merci pour votre demande de rendez-vous gratuit. J'ai bien reçu votre message et je reviendrai vers vous très prochainement pour confirmer l'horaire.</p>
            <div class="hr"></div>
            <p><strong>Récapitulatif de votre demande :</strong></p>
            <div class="data-row"><span class="data-label">Type de rendez-vous :</span> ${record.type}</div>
            <div class="data-row"><span class="data-label">Disponibilités :</span> ${record.availability}</div>
            <p>À bientôt,<br>Urya</p>
        </div>
    `;

    return {
        subject: "Confirmation de votre demande de rendez-vous - Urya",
        html: emailLayout(content, title)
    }
}
