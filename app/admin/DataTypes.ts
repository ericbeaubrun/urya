
export interface Client {
    id: string;
    nom: string;
    mail: string;
    tel?: string;
}

export interface Prestation {
    id: string;
    id_client?: string;
    statut: string;
    date_debut: string;
    heure_debut?: string;
    heure_fin?: string;
    type?: string;
    lieu?: string;
    notes?: string;
    client?: Client;
}

export interface PrestationFormData {
    id_client: string;
    statut: string;
    date_debut: string;
    heure_debut: string;
    heure_fin: string;
    type: string;
    lieu: string;
    notes: string;
}
