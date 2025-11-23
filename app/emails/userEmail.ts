//email reçu par l'utilisateur après avoir fait une demande de prestation
export function clientEmailTemplate(record: any) {

    return {
        subject: "Nous avons bien reçu votre demande",
        html: `
      <p>Bonjour ${record.nom},</p>
      <p>Merci pour votre demande. Nous reviendrons vers vous rapidement.</p>
    `
    }
}
