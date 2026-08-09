export const ANIMATION_ONCE = true;
export const FILTER_PRESTATION_CALENDAR = true;
export const EXAMPLE_MAIL = "mail@example.com";
export const EXAMPLE_NAME = "Prenom Nom";
export const EXAMPLE_PHONE = "06 00 00 00 00";
/** Destinataire pré-rempli des envois de test depuis /admin/emails. */
export const DEFAULT_TEST_EMAIL = "e.adelaide.beaubrun@gmail.com";

/** Hauteur de l'en-tête fixe (`.navContent`, `var(--space-20)`), en pixels. */
export const HEADER_HEIGHT = 80;

/**
 * Décalage appliqué aux ancres pour dégager l'en-tête fixe.
 *
 * La navigation interne ne défile plus : elle saute. Le défilement animé, même
 * borné à 450 ms, ne faisait qu'ajouter une attente entre le clic et la
 * section demandée — l'en-tête restant visible tout du long, le visiteur ne
 * perd de toute façon pas le fil de l'endroit où il se trouve.
 */
export const SCROLL_OFFSET = -HEADER_HEIGHT;
