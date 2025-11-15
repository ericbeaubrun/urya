import styles from '../styles/MusicPlayingEffect.module.css';


export default function MusicPlayingEffect() {
    return (
        <div className={styles.playingContainer}>
            <div className={styles.playing}>
                <div className={styles.rect1}></div>
                <div className={styles.rect2}></div>
                <div className={styles.rect3}></div>
                <div className={styles.rect4}></div>
                <div className={styles.rect5}></div>
            </div>
        </div>
    );
}
