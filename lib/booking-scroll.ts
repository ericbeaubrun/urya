'use client';

import {HEADER_HEIGHT} from '@/app/config';

/**
 * Destination commune de tous les boutons « Réserver ».
 *
 * La cible n'est pas la section `#devis` mais la carte du formulaire : viser la
 * section amenait le visiteur sur le titre et le sous-titre, le formulaire
 * lui-même commençant sous la ligne de flottaison. Il fallait donc encore faire
 * défiler après avoir cliqué sur un bouton dont c'était tout l'objet.
 */

/** `id` de la carte du formulaire, cible réelle du défilement. */
export const BOOKING_FORM_ID = 'devis-form';

/** `id` de la section, conservé pour les ancres externes (`/#devis`). */
export const BOOKING_SECTION_ID = 'devis';

/**
 * Demande au formulaire de se montrer immédiatement, sans son fondu d'entrée.
 *
 * Le visiteur qui clique sur « Réserver » a déjà décidé : lui faire regarder
 * une carte vide apparaître en fondu à la fin du défilement ne met rien en
 * valeur, cela ne fait qu'ajouter une attente à celle du trajet.
 */
export const BOOKING_REVEAL_EVENT = 'booking:reveal';

/** Marge minimale entre l'en-tête et le haut de la carte. */
const GAP = 16;

export function requestBookingReveal() {
    window.dispatchEvent(new Event(BOOKING_REVEAL_EVENT));
}

/**
 * Position absolue d'un élément dans la page, prise sur la mise en page.
 *
 * `getBoundingClientRect` était le chemin naturel, mais il intègre les
 * transformations CSS : au moment du clic, la carte porte encore le
 * `translateY` de son état masqué, et la destination calculée s'en trouvait
 * décalée d'autant. `offsetTop` ignore les transformations.
 */
function layoutTop(element: HTMLElement) {
    let top = 0;
    let node: HTMLElement | null = element;

    while (node) {
        top += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
    }

    return top;
}

/**
 * Amène le visiteur au formulaire, entièrement visible : centré sous l'en-tête
 * quand il tient dans la fenêtre, sinon calé juste dessous — au-delà, il n'y a
 * pas de meilleur cadrage que de commencer par son premier champ.
 *
 * Le saut est immédiat, sans défilement animé : le formulaire est aux quatre
 * cinquièmes de la page, et faire défiler tout ce qui le sépare du hero ne
 * montrait rien d'utile à quelqu'un qui vient de demander à le voir.
 */
export function scrollToBooking() {
    if (typeof window === 'undefined') return;

    requestBookingReveal();

    const card = document.getElementById(BOOKING_FORM_ID);
    // Repli sur la section : la carte peut ne pas être montée (contenu
    // éditorial absent, rendu en cours).
    const target = card ?? document.getElementById(BOOKING_SECTION_ID);
    if (!target) return;

    const available = window.innerHeight - HEADER_HEIGHT;
    const height = card ? card.offsetHeight : 0;
    const gap = card && height + 2 * GAP <= available
        ? Math.round((available - height) / 2)
        : GAP;

    // `behavior: "auto"` explicite : une règle `scroll-behavior: smooth` posée
    // globalement plus tard rendrait sinon le saut animé à nouveau.
    window.scrollTo({top: Math.max(0, layoutTop(target) - HEADER_HEIGHT - gap), behavior: 'auto'});
}
