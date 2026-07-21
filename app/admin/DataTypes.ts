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
    date_fin: string;
    heure_debut?: string;
    heure_fin?: string;
    type?: string;
    lieu?: string;
    notes?: string;
    client?: Client;
}

/** Ligne exposée par la vue Supabase publique `public_prestations_calendar`. */
export interface CalendarRow {
    id: string;
    type: string | null;
    statut: string | null;
    date_debut: string | null;
    date_fin: string | null;
    heure_debut: string | null;
    heure_fin: string | null;
    lieu: string | null;
}

export interface PrestationFormData {
    id_client: string;
    statut: string;
    date_debut: string;
    date_fin?: string | null;
    heure_debut: string;
    heure_fin: string;
    type: string;
    lieu: string;
    notes: string;
}
