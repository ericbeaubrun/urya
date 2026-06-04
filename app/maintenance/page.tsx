import styles from './Maintenance.module.css';

export default function MaintenancePage() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Maintenance en cours</h1>
                <p className={styles.subtitle}>
                    Nous mettons à jour notre contenu pour vous offrir la meilleure expérience possible.
                </p>
                <div className={styles.loader}></div>
                <p className={styles.footer}>Revenez d'ici quelques instants.</p>
            </div>
        </div>
    );
}
