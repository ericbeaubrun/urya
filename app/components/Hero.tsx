import styles from "./Hero.module.css";
import Link from "next/link";

export default function Hero() {
    return (
        <section className={styles.hero}>
            {/*<div className={styles.overlay}></div>*/}

            <div className={styles.content}>
                <p className={styles.subTitle}>WELCOME TO THE PARTY</p>
                <h1 className={styles.title}>
                    JOIN THE <br /> CLUB
                </h1>

                <p className={styles.description}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo adipiscing faucibus nunc amet convallis posuere diam nulla. Pellentesque vulputate dui posuere orci tellus dolor, semper convallis sed.
                </p>

                <div className={styles.actions}>
                    <button className={styles.cta}>Get in Touch</button>

                    <div className={styles.socials}>
                        <Link href="#">FB</Link>
                        <span>—</span>
                        <Link href="#">INST</Link>
                        <span>—</span>
                        <Link href="#">TW</Link>
                    </div>
                </div>
            </div>

            <div className={styles.media}>
                <video autoPlay muted loop playsInline className={styles.video}>
                    <source src="/video.mp4" type="video/mp4"/>
                </video>
            </div>
        </section>
    );
}


// "use client";
//
// import styles from './Hero.module.css';
//
// export default function Hero() {
//     return (
//         <section className={styles.hero}>
//             <div className={styles.container}>
//                 <div className={styles.content}>
//                     <div className={styles.titleSection}>
//                         <h1 className={styles.title}>
//                             DJ Urya – Votre DJ, tous styles, toutes ambiances 🎶
//                         </h1>
//                         <p className={styles.subtitle}>
//                             Bienvenue dans l'univers de DJ URYA passionnée de musique et créateur d'ambiances inoubliables.
//                         </p>
//                     </div>
//
//                     <div className={styles.description}>
//                         <p>
//                             Mariages, anniversaires, soirées privées ou événements professionnels : je suis votre DJ pour faire de chaque instant un moment unique.
//                         </p>
//                         <p>
//                             Avec une sélection musicale variée — des classiques intemporels aux derniers hits —, j'adapte chaque mix à votre public, à vos goûts et à l'énergie du moment.
//                             Mon objectif : créer une atmosphère festive et élégante, où chaque invité profite pleinement de la fête.
//                         </p>
//                     </div>
//
//                     <div className={styles.features}>
//                         <div className={styles.feature}>
//                             <span className={styles.icon}>🎵</span>
//                             <span>Mixs dynamiques et transitions fluides</span>
//                         </div>
//                         <div className={styles.feature}>
//                             <span className={styles.icon}>🔊</span>
//                             <span>Sonorisation et éclairage professionnels</span>
//                         </div>
//                         <div className={styles.feature}>
//                             <span className={styles.icon}>✨</span>
//                             <span>Ambiance garantie du début à la fin</span>
//                         </div>
//                     </div>
//
//                     <div className={styles.cta}>
//                         <button className={styles.ctaButton}>
//                             🎧 Réservez votre DJ
//                         </button>
//                         <button className={styles.ctaButtonSecondary}>
//                             📅 Voir mes disponibilités
//                         </button>
//                     </div>
//                 </div>
//
//                 <div className={styles.visualElement}>
//                     <div className={styles.djIcon}>🎧</div>
//                     <div className={styles.musicWaves}>
//                         <div className={styles.wave}></div>
//                         <div className={styles.wave}></div>
//                         <div className={styles.wave}></div>
//                         <div className={styles.wave}></div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// }
