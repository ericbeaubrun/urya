"use client";

import { Link, animateScroll as scroll } from "react-scroll";
import Image from "next/image";
import styles from "../styles/Header.module.css";

const OFFSET = -64;
const DURATION = 500;

export default function Header() {
    return (
        <header className={styles.header} role="banner">
            <nav className={styles.nav} aria-label="Navigation principale">
                <a
                    href="#top"
                    className={styles.brand}
                    onClick={(e) => {
                        e.preventDefault();
                        scroll.scrollToTop({ duration: DURATION, smooth: true });
                    }}
                >
                    <Image src="/logo.png" alt="Logo" width={72} height={72} priority />
                </a>
                <div className={styles.links}>

                    <Link to="prestations" smooth={true} duration={DURATION} offset={OFFSET} spy={true} className={styles.link}>
                        Offres
                    </Link>

                    <Link to="calendrier" smooth={true} duration={DURATION} offset={OFFSET} spy={true} className={styles.link}>
                        Calendrier
                    </Link>

                    <Link to="reseaux" smooth={true} duration={DURATION} offset={OFFSET} spy={true} className={styles.link}>
                        Réseaux Sociaux
                    </Link>

                    <Link to="contact" smooth={true} duration={DURATION} offset={OFFSET} spy={true} className={styles.link}>
                        Contact
                    </Link>
                </div>
            </nav>
        </header>
    );
}
