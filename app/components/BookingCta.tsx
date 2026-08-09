'use client';

import type {ReactNode} from 'react';
import {track} from '@/lib/analytics';
import {BOOKING_SECTION_ID, scrollToBooking} from '@/lib/booking-scroll';

interface BookingCtaProps {
    /** Origine du clic, telle qu'elle apparaît dans les statistiques. */
    source: string;
    className?: string;
    children: ReactNode;
    /** Action propre à l'appelant (fermer le menu mobile, par exemple). */
    onClick?: () => void;
    tabIndex?: number;
}

/**
 * Bouton « Réserver ». Tous les emplacements passent par ici : en-tête, hero,
 * cartes de prestation et barre mobile visent ainsi le même point d'arrivée et
 * consignent le même événement.
 *
 * C'est une vraie ancre `#devis` : elle reste ouvrable au clavier, en nouvel
 * onglet, et fonctionne sans JavaScript. Le clic est intercepté pour le
 * défilement animé, ce qui évite au passage d'inscrire l'ancre dans l'URL.
 */
export default function BookingCta({source, className, children, onClick, tabIndex}: BookingCtaProps) {
    return (
        <a
            href={`#${BOOKING_SECTION_ID}`}
            className={className}
            tabIndex={tabIndex}
            onClick={(e) => {
                // Un clic modifié (nouvel onglet, nouvelle fenêtre) doit rester
                // une navigation normale.
                if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

                e.preventDefault();
                track('cta_click', {source});
                onClick?.();
                scrollToBooking();
            }}
        >
            {children}
        </a>
    );
}
