'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Link as ScrollLink } from 'react-scroll';
import styles from './Footer.module.css';

import { useContent } from '@/app/ContentContext';
import { usableNavItems, usableSocials } from '@/lib/site-content';
import { LANDING_PAGES } from '@/lib/landing-pages';
import { CITY_PAGES } from '@/lib/city-pages';

const ICON_MAP: Record<string, string> = {
    Instagram: '/insta.webp',
    TikTok: '/tiktok.webp',
    Youtube: '/youtube.webp'
};

export default function Footer() {
    const { footer, navigation } = useContent();

    if (!footer || !navigation) return null;

    const navItems = usableNavItems(navigation.items);
    const socials = usableSocials(footer.socials);

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.topRow}>
                    <ScrollLink
                        to="hero"
                        smooth={true}
                        duration={800}
                        className={styles.logo}
                        aria-label="Retour en haut"
                        style={{ cursor: 'pointer' }}
                    >
                        <span className={styles.logoWhite}>{navigation.logo?.first}</span>
                        <span className={styles.logoGradient}>{navigation.logo?.second}</span>
                    </ScrollLink>

                    <nav className={styles.nav}>
                        {
                            navItems.map((item) => (
                            <ScrollLink
                                key={item.to}
                                to={item.to}
                                smooth={true}
                                offset={-80}
                                duration={800}
                                className={styles.navLink}
                                style={{ cursor: 'pointer' }}
                            >
                                {item.label}
                            </ScrollLink>
                        ))}

                        <Link href="/mentions-legales" className={styles.navLink}>
                            Mentions légales
                        </Link>
                        <Link href="/politique-de-confidentialite" className={styles.navLink}>
                            Confidentialité
                        </Link>
                    </nav>

                    <div className={styles.socials}>
                        {
                            socials.map((social) => {
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
                                        <Image
                                            src={iconSrc}
                                            alt={social.platform}
                                            width={24}
                                            height={24}
                                            className={styles.socialImg}
                                        />
                                    ) : (
                                        <span>{social.platform}</span>
                                    )}
                                </a>
                            );
                        })}
                    </div>
                </div>

                {/* Maillage interne. Sans lien depuis l'accueil, les pages de
                    prestation resteraient orphelines : le sitemap les fait
                    découvrir, il ne leur transmet aucune autorité. */}
                <nav className={styles.prestationsRow} aria-label="Prestations">
                    <span className={styles.prestationsLabel}>Prestations</span>
                    <div className={styles.prestationsLinks}>
                        {LANDING_PAGES.map((page) => (
                            <Link
                                key={page.slug}
                                href={`/${page.slug}`}
                                className={styles.prestationLink}
                            >
                                {page.navLabel}
                            </Link>
                        ))}
                    </div>
                </nav>

                <nav className={styles.prestationsRow} aria-label="Zones d'intervention">
                    <span className={styles.prestationsLabel}>Zones</span>
                    <div className={styles.prestationsLinks}>
                        {CITY_PAGES.map((page) => (
                            <Link
                                key={page.slug}
                                href={`/${page.slug}`}
                                className={styles.prestationLink}
                            >
                                {page.navLabel}
                            </Link>
                        ))}
                    </div>
                </nav>

                <div className={styles.bottomRow}>
                    <span>&copy; {new Date().getFullYear()} {footer.copyright}</span>
                    <span className={styles.signature}>{footer.signature}</span>
                </div>
            </div>
        </footer>
    );
}
