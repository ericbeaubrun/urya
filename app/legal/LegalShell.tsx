import Link from 'next/link';
import styles from './Legal.module.css';

export default function LegalShell({
    title,
    lastUpdate,
    children,
}: {
    title: string;
    lastUpdate: string;
    children: React.ReactNode;
}) {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Link href="/" className={styles.back}>&larr; Retour à l&apos;accueil</Link>
                <h1 className={styles.title}>{title}</h1>
                {lastUpdate && <p className={styles.updated}>Dernière mise à jour : {lastUpdate}</p>}
                {children}
            </div>
        </div>
    );
}
