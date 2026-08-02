/**
 * Référentiel unique des valeurs métier d'une prestation.
 *
 * Ces listes étaient jusqu'ici dupliquées dans `PrestationForm`, `CalendarPicker`,
 * `PrestationComposer` et `PrestationsAdminPage`, chacune avec sa propre copie du
 * mapping. Toute divergence entre ces copies et les contraintes de la base se
 * traduisait par une erreur Postgres remontée en 500 générique.
 */

export const PRESTATION_TYPES = [
    "mariage",
    "anniversaire",
    "soiree_privee",
    "evenement_corporate",
    "club",
    "festival",
    "concert",
    "seminaire",
    "autre",
] as const;

export type PrestationType = (typeof PRESTATION_TYPES)[number];

/** Libellé affiché pour chaque valeur stockée. */
export const PRESTATION_TYPE_LABELS: Record<PrestationType, string> = {
    mariage: "Mariage",
    anniversaire: "Anniversaire",
    soiree_privee: "Soirée privée",
    evenement_corporate: "Évènement",
    club: "Club",
    festival: "Festival",
    concert: "Concert",
    seminaire: "Séminaire",
    autre: "Autre",
};

export const PRESTATION_STATUTS = [
    "en_attente",
    "confirmee",
    "annulee",
    "terminee",
] as const;

export type PrestationStatut = (typeof PRESTATION_STATUTS)[number];

export const PRESTATION_STATUT_LABELS: Record<PrestationStatut, string> = {
    en_attente: "En attente",
    confirmee: "Confirmée",
    annulee: "Annulée",
    terminee: "Terminée",
};
