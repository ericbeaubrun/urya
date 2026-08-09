'use client';

import Link from 'next/link';
import { Link as ScrollLink } from 'react-scroll';
import { Phone, Mail, type LucideIcon } from 'lucide-react';
import styles from './Footer.module.css';

import { useContent } from '@/app/ContentContext';
import { homeNavItems, usableSocials } from '@/lib/site-content';
import { SCROLL_OFFSET } from '@/app/config';
import { LANDING_PAGES } from '@/lib/landing-pages';
import { DEPARTMENT_PAGES, REGION_PAGE } from '@/lib/area-pages';
import { contactLink } from '@/lib/contact-links';
import { track } from '@/lib/analytics';

const ICON_MAP: Record<string, string> = {
    Instagram: '/insta.webp',
    TikTok: '/tiktok.webp',
    Youtube: '/youtube.webp'
};

/** Seuls les canaux joignables en un clic ont leur place ici. */
const CONTACT_ICONS: Record<string, LucideIcon> = {
    Phone,
    Mail
};

export default function Footer() {
    const content = useContent();
    const { footer, navigation, about } = content;

    if (!footer || !navigation) return null;

    const navItems = homeNavItems(content);
    const socials = usableSocials(footer.socials);
    const contacts = (Array.isArray(about?.contactInfo) ? about.contactInfo : [])
        .filter((item) => String(item.icon) in CONTACT_ICONS);

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Colonne d'identité : marque, contacts directs, réseaux. */}
                    <div className={styles.brandCol}>
                        <ScrollLink
                            to="hero"
                            className={styles.logo}
                            aria-label="Retour en haut"
                        >
                            <span className={styles.logoWhite}>{navigation.logo?.first}</span>
                            <span className={styles.logoGradient}>{navigation.logo?.second}</span>
                        </ScrollLink>

                        {contacts.length > 0 && (
                            <ul className={styles.contactList}>
                                {contacts.map((item) => {
                                    const Icon = CONTACT_ICONS[String(item.icon)];
                                    const link = contactLink(item);

                                    return (
                                        <li key={item.label}>
                                            {/* Sans lien exploitable, la valeur
                                                reste affichée mais inerte : un
                                                `tel:` construit sur une saisie
                                                fantaisiste vaut moins que rien. */}
                                            {link ? (
                                                <a
                                                    href={link.href}
                                                    className={styles.contactLink}
                                                    onClick={() =>
                                                        track('contact_click', { channel: link.channel })
                                                    }
                                                    {...(link.external
                                                        ? { target: '_blank', rel: 'noopener noreferrer' }
                                                        : {})}
                                                >
                                                    <Icon size={15} className={styles.contactIcon} aria-hidden />
                                                    {item.label}
                                                </a>
                                            ) : (
                                                <span className={styles.contactLink}>
                                                    <Icon size={15} className={styles.contactIcon} aria-hidden />
                                                    {item.label}
                                                </span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}

                        {socials.length > 0 && (
                            <div className={styles.socials}>
                                {socials.map((social) => {
                                    const iconSrc = ICON_MAP[social.platform];
                                    return (
                                        <a
                                            key={social.platform}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.socialIcon}
                                            aria-label={social.platform}
                                        >
                                            {iconSrc ? (
                                                // `next/image` serait facturé une
                                                // transformation par icône sur Vercel,
                                                // pour des WebP de moins de 2 Ko déjà
                                                // servis à leur taille d'affichage.
                                                <img
                                                    src={iconSrc}
                                                    alt=""
                                                    width={20}
                                                    height={20}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className={styles.socialImg}
                                                />
                                            ) : (
                                                <span>{social.platform}</span>
                                            )}
                                        </a>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <nav className={styles.col} aria-label="Sections du site">
                        <span className={styles.colTitle}>Navigation</span>
                        <ul className={styles.colLinks}>
                            {navItems.map((item) => (
                                <li key={item.to}>
                                    <ScrollLink
                                        to={item.to}
                                        offset={SCROLL_OFFSET}
                                        className={styles.link}
                                    >
                                        {item.label}
                                    </ScrollLink>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Maillage interne. Sans lien depuis l'accueil, les pages de
                        prestation resteraient orphelines : le sitemap les fait
                        découvrir, il ne leur transmet aucune autorité. */}
                    <nav className={styles.col} aria-label="Prestations">
                        <span className={styles.colTitle}>Prestations</span>
                        <ul className={styles.colLinks}>
                            {LANDING_PAGES.map((page) => (
                                <li key={page.slug}>
                                    <Link href={`/${page.slug}`} className={styles.link}>
                                        {page.navLabel}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Région et départements seulement : les pages de ville sont
                        atteintes depuis leur département. Un pied de page qui
                        listerait les trois niveaux diluerait le maillage au lieu
                        de le hiérarchiser. */}
                    <nav className={styles.col} aria-label="Zones d'intervention">
                        <span className={styles.colTitle}>Zones</span>
                        <ul className={styles.colLinks}>
                            {[REGION_PAGE, ...DEPARTMENT_PAGES].map((page) => (
                                <li key={page.slug}>
                                    <Link href={`/${page.slug}`} className={styles.link}>
                                        {page.navLabel}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className={styles.bottomRow}>
                    <span>&copy; {new Date().getFullYear()} {footer.copyright}</span>

                    <div className={styles.legal}>
                        <Link href="/mentions-legales" className={styles.legalLink}>
                            Mentions légales
                        </Link>
                        <Link href="/politique-de-confidentialite" className={styles.legalLink}>
                            Confidentialité
                        </Link>
                    </div>

                    <span className={styles.signature}>{footer.signature}</span>
                </div>
            </div>
        </footer>
    );
}
