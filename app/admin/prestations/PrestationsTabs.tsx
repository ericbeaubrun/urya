"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import styles from "./PrestationsTabs.module.css";

const tabs = [
    {href: "/admin/prestations/ajouter", label: "Ajouter"},
    {href: "/admin/prestations/futures", label: "À venir"},
    {href: "/admin/prestations/passees", label: "Passées"},
    {href: "/admin/prestations/toutes", label: "Toutes"},
];

export default function PrestationsTabs() {
    const pathname = usePathname();

    // Le calendrier partage le segment /admin/prestations mais reste une entrée
    // à part dans la navigation principale : pas de sous-onglets pour lui.
    if (!tabs.some(t => t.href === pathname)) return null;

    return (
        <div className={styles.wrap}>
            <h2 className={styles.title}>Gestion des prestations</h2>
            <nav className={styles.tabs}>
                {tabs.map(tab => (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        aria-current={pathname === tab.href ? "page" : undefined}
                        className={pathname === tab.href ? `${styles.tab} ${styles.tabActive}` : styles.tab}
                    >
                        {tab.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
