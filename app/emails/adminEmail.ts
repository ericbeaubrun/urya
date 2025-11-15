export function adminEmailTemplate(record: any) {

    return {
        subject: "Nouvelle demande de prestation",
        html: `
      <p><strong>Nouvelle demande reçue</strong></p>
      <p>Nom : ${record.nom}</p>
      <p>Email : ${record.mail}</p>
      <p>Téléphone : ${record.tel}</p>
      <p>Date début : ${record.date_debut}</p>
      <p>Date fin : ${record.date_fin}</p>
      <p>Heure début : ${record.heure_debut}</p>
      <p>Heure fin : ${record.heure_fin}</p>
      <p>Type : ${record.type}</p>
      <p>Lieu : ${record.lieu}</p>
      <p>Notes : ${record.notes}</p>
    `
    }
}
