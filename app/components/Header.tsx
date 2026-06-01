'use client';

import { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import styles from './Header.module.css';

const navItems = [
    { label: 'Accueil', to: 'hero' },
    { label: 'À propos', to: 'about' },
    { label: 'Services', to: 'services' },
    // { label: 'Devis', to: 'devis' },
    { label: 'Questions', to: 'faq' },
    // { label: 'Contact', to: 'contact' },
];

interface NavigationProps {
    onContactClick?: () => void;
}

export default function Navigation({ onContactClick }: NavigationProps) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

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
                        smooth={true}
                        duration={800}
                        onClick={handleNav}
                        className={styles.logo}
                        style={{ cursor: 'pointer' }}
                    >
                        <span className={styles.logoWhite}>DJ</span>
                        <span className={styles.logoGradient}>URYA</span>
                    </ScrollLink>

                    {/* Desktop Navigation */}
                    <ul className={styles.desktopMenu}>
                        {navItems.map((item) => (
                            <li key={item.to}>
                                <ScrollLink
                                    to={item.to}
                                    spy={true}
                                    smooth={true}
                                    offset={-80}
                                    duration={800}
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

                    {/* Desktop CTA */}
                    <ScrollLink
                        to="devis"
                        spy={true}
                        smooth={true}
                        offset={-80}
                        duration={800}
                        className={styles.ctaButton}
                        activeClass={styles.activeCta}
                        style={{ cursor: 'pointer' }}
                    >
                        Réserver
                    </ScrollLink>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className={styles.mobileMenuBtn}
                        aria-label="Menu"
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <div className={`${styles.mobileDrawer} ${menuOpen ? styles.drawerOpen : ''}`}>
                <div className={styles.drawerOverlay} onClick={() => setMenuOpen(false)} />
                <div className={styles.drawerContent}>
                    <ul className={styles.mobileMenuList}>
                        {navItems.map((item) => (
                            <li key={item.to}>
                                <ScrollLink
                                    to={item.to}
                                    spy={true}
                                    smooth={true}
                                    offset={-80}
                                    duration={800}
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
                    <ScrollLink
                        to="devis"
                        spy={true}
                        smooth={true}
                        offset={-80}
                        duration={800}
                        onClick={handleNav}
                        className={styles.mobileCtaButton}
                        activeClass={styles.activeCtaMobile}
                        style={{ cursor: 'pointer' }}
                    >
                        Réserver
                    </ScrollLink>
                </div>
            </div>
        </>
    );
}

