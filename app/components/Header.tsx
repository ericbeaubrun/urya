'use client';

import { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Menu, X } from 'lucide-react';
import styles from './Header.module.css';
import BookingCta from './BookingCta';

import { useContent } from '@/app/ContentContext';
import { homeNavItems } from '@/lib/site-content';
import { SCROLL_OFFSET } from '@/app/config';

interface NavigationProps {
    onContactClick?: () => void;
}

export default function Navigation({ onContactClick }: NavigationProps) {
    const content = useContent();
    const { navigation } = content;
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isHeroActive, setIsHeroActive] = useState(true);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 40);
            if (window.scrollY < 10) {
                setIsHeroActive(true);
            }
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!navigation) return null;

    const navItems = homeNavItems(content);

    const handleNav = () => {
        setMenuOpen(false);
    };

    return (
        <>
            <nav className={`${styles.navContainer} ${scrolled ? styles.scrolled : ''}`}>
                <div className={styles.navContent}>
                    {/* Logo */}
                    <ScrollLink
                        to="hero"
                        spy={true}
                        offset={SCROLL_OFFSET}
                        onClick={handleNav}
                        className={`${styles.logo} ${isHeroActive ? styles.activeLink : ''}`}
                        activeClass={styles.activeLink}
                        onSetActive={() => setIsHeroActive(true)}
                        onSetInactive={() => setIsHeroActive(false)}
                        style={{ cursor: 'pointer' }}
                    >
                        <span className={styles.logoWhite}>{navigation.logo?.first}</span>
                        <span className={styles.logoGradient}>{navigation.logo?.second}</span>
                    </ScrollLink>

                    <ul className={styles.desktopMenu}>
                        {
                            navItems.map((item) => (
                            <li key={item.to}>
                                <ScrollLink
                                    to={item.to}
                                    spy={true}
                                    // Hauteur de l'en-tête fixe. Le décalage
                                    // était positif : la section montait
                                    // au-delà du haut de la fenêtre, puis
                                    // l'en-tête en recouvrait le titre.
                                    offset={SCROLL_OFFSET}
                                    onClick={() => {
                                        handleNav();
                                        if (item.to === 'faq' && onContactClick) onContactClick();
                                    }}
                                    className={styles.navLink}
                                    activeClass={styles.activeLink}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {item.label}
                                </ScrollLink>
                            </li>
                        ))}
                    </ul>

                    <BookingCta source="header" className={styles.ctaButton}>
                        Réserver
                    </BookingCta>

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className={styles.mobileMenuBtn}
                        aria-label="Menu"
                        title={menuOpen ? "Fermer" : "Menu"}
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            <div className={`${styles.mobileDrawer} ${menuOpen ? styles.drawerOpen : ''}`}>
                <div className={styles.drawerOverlay} onClick={() => setMenuOpen(false)} />
                <div className={styles.drawerContent}>
                    <button
                        onClick={() => setMenuOpen(false)}
                        className={styles.closeDrawerBtn}
                        aria-label="Fermer le menu"
                        title="Fermer"
                    >
                        <X size={24} />
                    </button>
                    <ul className={styles.mobileMenuList}>
                        {
                            navItems.map((item) => (
                            <li key={item.to}>
                                <ScrollLink
                                    to={item.to}
                                    spy={true}
                                    offset={SCROLL_OFFSET}
                                    onClick={() => {
                                        handleNav();
                                        if (item.to === 'faq' && onContactClick) onContactClick();
                                    }}
                                    className={styles.mobileNavLink}
                                    activeClass={styles.activeLink}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {item.label}
                                </ScrollLink>
                            </li>
                        ))}
                    </ul>
                    <BookingCta
                        source="header_mobile"
                        onClick={handleNav}
                        className={styles.mobileCtaButton}
                    >
                        Réserver
                    </BookingCta>
                </div>
            </div>
        </>
    );
}
