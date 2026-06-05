'use client';

import Image from 'next/image';
import { Link as ScrollLink } from 'react-scroll';
import styles from './Footer.module.css';

import { useContent } from '@/app/ContentContext';

const ICON_MAP: Record<string, string> = {
    Instagram: '/insta.png',
    TikTok: '/tiktok.png',
    Youtube: '/youtube.png'
};

export default function Footer() {
    const { footer, navigation } = useContent();

    if (!footer || !navigation) return null;

    const navItems = Array.isArray(navigation.items) ? navigation.items : [];
    const socials = Array.isArray(footer.socials) ? footer.socials : [];

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
                        <span className={styles.logoWhite}>{navigation.logo?.first}</span>
                        <span className={styles.logoGradient}>{navigation.logo?.second}</span>
                    </ScrollLink>

                    {/* Navigation secondaire */}
                    <nav className={styles.nav}>
                        {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            navItems.map((item: any) => (
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
                    </nav>

                    {/* Liens Réseaux Sociaux */}
                    <div className={styles.socials}>
                        {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            socials.map((social: any) => {
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

                {/* Ligne du bas (Copyright) */}
                <div className={styles.bottomRow}>
                    <span>&copy; {new Date().getFullYear()} {footer.copyright}</span>
                    <span className={styles.signature}>{footer.signature}</span>
                </div>
            </div>
        </footer>
    );
}
