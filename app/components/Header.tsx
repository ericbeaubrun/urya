"use client";

import {useState} from "react";
import {Link, animateScroll as scroll} from "react-scroll";
import Image from "next/image";
import styles from "../styles/Header.module.css";
import {ExternalLink} from "lucide-react";
import {usePathname} from "next/navigation";

const DURATION = 600;

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    const isPrestationFormPage = usePathname() === "/prestation-form";

    const handleToggle = () => {
        if (isPrestationFormPage) {
            // window.location.href = "/";
            setMenuOpen(!menuOpen);

        } else {
            setMenuOpen(!menuOpen);
        }
    };

    const handleClose = () => {
        if (isPrestationFormPage) {
            window.location.href = "/";
        } else {
            setMenuOpen(false);
        }
    };

    // 🧩 Tableau des liens à générer
    const navLinks = [
        {to: "prestations", label: "Offres", offset: 40},
        {to: "calendrier", label: "Calendrier", offset: -110},
        // {to: "reseaux", label: "Réseaux Sociaux"},
        {to: "contact", label: "Contact", offset: 270},
    ];

    return (
        <header className={styles.header} role="banner">
            <nav className={styles.nav} aria-label="Navigation principale">
                <a
                    href="#top"
                    className={styles.brand}
                    onClick={(e) => {
                        e.preventDefault();
                        scroll.scrollToTop({duration: DURATION, smooth: true});
                        handleClose();
                    }}
                >
                    <Image src="/logo.png" alt="Logo" width={72} height={72} priority/>
                </a>

                <button
                    className={`${styles.burger} ${menuOpen ? styles.open : ""}`}
                    aria-label="Menu"
                    onClick={handleToggle}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div
                    className={`${styles.links} ${menuOpen ? styles.showMenu : ""}`}
                    onClick={handleClose}
                >
                    {navLinks.map(({to, label, offset}) => (
                        <Link
                            key={to}
                            to={to}
                            smooth={true}
                            duration={DURATION}
                            offset={offset}
                            spy={true}
                            className={styles.link}
                            onClick={handleClose}
                        >
                            {label}
                        </Link>
                    ))}
                    {/*{!isPrestationFormPage && (*/}
                    <a
                        href="/prestation-form"
                        className={styles.redirectLink}
                        onClick={handleClose}
                    >
                        Demande de Prestation&nbsp;
                        <ExternalLink className={styles.icon}/>
                    </a>
                    {/*)}*/}
                </div>
            </nav>
        </header>
    );
}

