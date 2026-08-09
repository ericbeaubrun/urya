'use client';

import {useEffect, useState} from 'react';
import {Phone} from 'lucide-react';
import {track} from '@/lib/analytics';
import {useContent} from '@/app/ContentContext';
import {findPhoneHref} from '@/lib/contact-links';
import styles from './StickyCta.module.css';
import BookingCta from './BookingCta';

/**
 * Barre d'appel à l'action fixée en bas d'écran, sur mobile uniquement.
 *
 * Le formulaire de devis se trouve aux quatre cinquièmes de la page : entre le
 * hero et lui, un visiteur mobile n'avait plus aucun moyen de convertir sans
 * ouvrir le menu burger. Cette barre couvre exactement cet intervalle.
 *
 * Elle n'est affichée que sous 768 px (voir la feuille de style), c'est-à-dire
 * précisément là où le bouton « Réserver » de l'en-tête est masqué : au-delà,
 * elle ferait doublon.
 */
export default function StickyCta() {
    const {about, navigation} = useContent();
    const [pastHero, setPastHero] = useState(false);
    const [reachedForm, setReachedForm] = useState(false);

    // Les deux sections observées appartiennent à des composants frères, d'où
    // la recherche par `id` plutôt que par référence. Elles sont montées en
    // même temps que cette barre : l'effet les trouve dès le premier passage.
    useEffect(() => {
        const hero = document.getElementById('hero');
        const devis = document.getElementById('devis');
        if (!hero || !devis) return;

        const heroObserver = new IntersectionObserver(
            ([entry]) => setPastHero(!entry.isIntersecting)
        );
        heroObserver.observe(hero);

        // Une fois le formulaire atteint, la barre a rempli son office : elle
        // disparaît définitivement plutôt que de recouvrir le pied de page.
        const formObserver = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            setReachedForm(true);
            formObserver.disconnect();
            heroObserver.disconnect();
        });
        formObserver.observe(devis);

        return () => {
            heroObserver.disconnect();
            formObserver.disconnect();
        };
    }, []);

    const phoneHref = findPhoneHref(about?.contactInfo);
    const visible = pastHero && !reachedForm;

    return (
        <div
            className={`${styles.bar} ${visible ? styles.visible : ''}`}
            aria-hidden={!visible}
        >
            <BookingCta
                source="sticky"
                className={styles.primary}
                tabIndex={visible ? 0 : -1}
            >
                {navigation?.cta || 'Réserver'}
            </BookingCta>

            {phoneHref && (
                <a
                    href={phoneHref}
                    className={styles.call}
                    aria-label="Appeler"
                    tabIndex={visible ? 0 : -1}
                    onClick={() => track('contact_click', {channel: 'phone'})}
                >
                    <Phone size={20}/>
                </a>
            )}
        </div>
    );
}
