"use client";

import Link from "next/link";
import styles from "./merci.module.css";

export default function MerciPage() {
    return (
        <main className={styles.wrapper}>
            <div className={styles.card}>
                <h1 className={styles.title}>Merci pour votre demande !</h1>
                <p className={styles.subtitle}>
                    Nous reviendrons vers vous pour vous communiquer le tarif et confirmer le devis.
                </p>

                <Link href="/" className={styles.homeBtn}>
                    Retour à l’accueil
                </Link>
            </div>
        </main>
    );
}
