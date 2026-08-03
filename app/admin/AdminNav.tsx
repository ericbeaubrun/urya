"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";
import styles from "./AdminPage.module.css";

const links = [
    {href: "/admin/prestations/ajouter", label: "Ajouter"},
    {href: "/admin/prestations/futures", label: "À venir"},
    {href: "/admin/prestations/passees", label: "Passées"},
    {href: "/admin/prestations/toutes", label: "Toutes"},
    {href: "/admin/prestations/calendrier", label: "Calendrier"},
    {href: "/admin/content", label: "Contenu"},
    {href: "/admin/statistiques", label: "Statistiques"},
];

export default function AdminNav({email, logout}: { email?: string | null; logout: React.ReactNode }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className={styles.bar}>
                <Link href="/admin" className={styles.brand}>
                    <span className={styles.brandMark}>U</span>
                    <span className={styles.brandText}>Administration</span>
                </Link>

                <button
                    type="button"
                    className={styles.burger}
                    aria-expanded={open}
                    aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
                    onClick={() => setOpen(v => !v)}
                >
                    <span/><span/><span/>
                </button>

                <div className={`${styles.panel} ${open ? styles.panelOpen : ""}`}>
                    <nav className={styles.nav}>
                        {links.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={pathname === link.href ? `${styles.link} ${styles.linkActive}` : styles.link}
                                onClick={() => setOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className={styles.account}>
                        <span className={styles.email} title={email ?? undefined}>{email}</span>
                        {logout}
                    </div>
                </div>
            </div>
        </header>
    );
}
