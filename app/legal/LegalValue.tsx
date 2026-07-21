import styles from './Legal.module.css';

/**
 * Affiche une information légale, ou un masque `*********` tant qu'elle n'a pas
 * été renseignée depuis l'espace d'administration. Le masque reste lisible et
 * accessible : la mention réelle est annoncée aux lecteurs d'écran.
 */
export default function LegalValue({ value, label }: { value: string; label?: string }) {
    if (value) return <>{value}</>;

    return (
        <span
            className={styles.redacted}
            title={label ? `${label} : information à venir` : 'Information à venir'}
        >
            <span aria-hidden="true">*********</span>
            <span className={styles.srOnly}>Information à venir</span>
        </span>
    );
}
