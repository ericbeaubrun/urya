import { emailLayout } from "./emailLayout";

// email reçu par l'admin lors d'une demande de prestation
export function adminEmailTemplate(record: any) {
    const title = "Nouvelle demande de prestation";
    const content = `
        <div class="title">${title}</div>
        <div class="content">
            <h3 style="color: #ffffff; margin-bottom: 15px;">Informations Client</h3>
            <div class="data-row"><span class="data-label">Nom :</span> ${record.nom}</div>
            <div class="data-row"><span class="data-label">Email :</span> ${record.mail}</div>
            <div class="data-row"><span class="data-label">Téléphone :</span> ${record.tel}</div>
            
            <div class="hr"></div>
            
            <h3 style="color: #ffffff; margin-bottom: 15px;">Détails de l'Événement</h3>
            <div class="data-row"><span class="data-label">Date :</span> Du ${record.date_debut} au ${record.date_fin}</div>
            <div class="data-row"><span class="data-label">Horaires :</span> De ${record.heure_debut} à ${record.heure_fin}</div>
            <div class="data-row"><span class="data-label">Lieu :</span> ${record.lieu}</div>
            <div class="data-row"><span class="data-label">Type :</span> ${record.type}</div>
            
            <div class="hr"></div>
            
            <h3 style="color: #ffffff; margin-bottom: 15px;">Notes complémentaires</h3>
            <p style="white-space: pre-wrap;">${record.notes || 'Aucune note'}</p>
        </div>
    `;

    return {
        subject: "Nouvelle demande de prestation",
        html: emailLayout(content, title)
    }
}
