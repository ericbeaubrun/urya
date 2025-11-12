"use client";

import styles from "../styles/Footer.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* --- LOGO / NOM --- */}
                <div className={styles.brand}>
                    <Image
                        src="/logo.svg" // <-- Remplace par ton logo si tu en as un
                        alt="DJ Logo"
                        width={50}
                        height={50}
                        className={styles.logo}
                    />
                    <h3 className={styles.name}>DJ Nightwave</h3>
                </div>

                {/* --- NAVIGATION --- */}
                <nav className={styles.nav}>
                    <Link href="/">Accueil</Link>
                    <Link href="/prestations">Prestations</Link>
                    <Link href="/calendar">Calendrier</Link>
                    <Link href="/contact">Contact</Link>
                </nav>

                {/* --- RESEAUX SOCIAUX --- */}
                <div className={styles.socials}>
                    <a href="https://instagram.com/TON_COMPTE" target="_blank" aria-label="Instagram">
                        <Image src="/icons/instagram.svg" alt="Instagram" width={24} height={24} />
                    </a>
                    <a href="https://tiktok.com/@TON_COMPTE" target="_blank" aria-label="TikTok">
                        <Image src="/icons/tiktok.svg" alt="TikTok" width={24} height={24} />
                    </a>
                    <a href="https://soundcloud.com/TON_COMPTE" target="_blank" aria-label="SoundCloud">
                        <Image src="/icons/soundcloud.svg" alt="SoundCloud" width={24} height={24} />
                    </a>
                </div>
            </div>

            {/* --- COPYRIGHT --- */}
            <div className={styles.bottom}>
                <p>© {currentYear} DJ Nightwave. Tous droits réservés.</p>
            </div>
        </footer>
    );
}
