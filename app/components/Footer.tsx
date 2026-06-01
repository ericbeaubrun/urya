'use client';

import { Link as ScrollLink } from 'react-scroll';
import { Instagram, Music, ExternalLink } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.topRow}>
                    {/* Logo / Back to top */}
                    <ScrollLink
                        to="hero"
                        smooth={true}
                        duration={800}
                        className={styles.logo}
                        aria-label="Retour en haut"
                        style={{ cursor: 'pointer' }}
                    >
                        <span className={styles.logoWhite}>DJ</span>
                        <span className={styles.logoGradient}>URYA</span>
                    </ScrollLink>

                    {/* Navigation secondaire */}
                    <nav className={styles.nav}>
                        {[
                            { label: 'À propos', id: 'about' },
                            { label: 'Prestations', id: 'services' },
                            { label: 'Médias', id: 'media' },
                            { label: 'Avis', id: 'testimonials' },
                            { label: 'Contact', id: 'contact' },
                        ].map((item) => (
                            <ScrollLink
                                key={item.id}
                                to={item.id}
                                smooth={true}
                                offset={-80}
                                duration={800}
                                className={styles.navLink}
                                style={{ cursor: 'pointer' }}
                            >
                                {item.label}
                            </ScrollLink>
                        ))}
                    </nav>

                    {/* Liens Réseaux Sociaux */}
                    <div className={styles.socials}>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialIcon}
                            aria-label="Instagram"
                        >
                            <Instagram size={16} />
                        </a>
                        <a
                            href="https://tiktok.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialIcon}
                            aria-label="TikTok"
                        >
                            <Music size={16} />
                        </a>
                        <a
                            href="https://soundcloud.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialIcon}
                            aria-label="SoundCloud"
                        >
                            <ExternalLink size={16} />
                        </a>
                    </div>
                </div>

                {/* Ligne du bas (Copyright) */}
                <div className={styles.bottomRow}>
                    <span>&copy; {new Date().getFullYear()} DJ URYA — Tous droits réservés.</span>
                    <span className={styles.signature}>Fait avec passion · Paris, France</span>
                </div>
            </div>
        </footer>
    );
}
