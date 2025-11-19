//email reçu par l'admin d'une demande depuis le formulaire de contact'
export function contactEmailTemplate(record: any) {

    return {
        subject: "Nouveau message via le formulaire de contact",
        html: `
            <p><strong>Nom :</strong> ${record.nom}</p>
            <p><strong>Email :</strong> ${record.email}</p>
            <p><strong>Message :</strong><br/>${record.message}</p>
            `
    }
}
