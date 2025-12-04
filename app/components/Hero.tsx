"use client";

import styles from "../styles/Hero.module.css";
import MusicPlayingEffect from "@/app/components/MusicPlayingEffect";
import {motion} from "framer-motion";
import {ANIMATION_ONCE} from "../config/config";
import {Link} from "react-scroll";

export default function Hero() {

    const appear = (index: number) => ({
        hidden: {opacity: 0, y: 30},
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                delay: index * 0.15,
                ease: "easeOut",
            },
        },
    });

    return (
        <section className={styles.hero}>

            <div className={styles.content}>
                <motion.h1
                    className={styles.title}
                    variants={appear(0)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once: ANIMATION_ONCE, amount: 0.3}}
                >
                    <strong>DJ <br/> <MusicPlayingEffect/> URYA</strong>
                </motion.h1>

                <motion.p
                    className={styles.subTitle}
                    variants={appear(1)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once: ANIMATION_ONCE, amount: 0.3}}
                >
                    Je suis votre DJ
                </motion.p>

                <motion.p
                    className={styles.description}
                    variants={appear(2)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once: ANIMATION_ONCE, amount: 0.3}}
                >
                    Bienvenue dans l’univers de <strong>DJ URYA</strong> passionnée de musique et créateur d’ambiances inoubliables.
                    Mariages, anniversaires, soirées privées ou événements professionnels : je suis votre DJ pour faire
                    de chaque instant un moment unique.
                </motion.p>

                <motion.div
                    className={styles.actions}
                    variants={appear(3)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once: ANIMATION_ONCE, amount: 0.3}}
                >

                    <Link
                        key={'hero'}
                        to={'contact'}
                        smooth={true}
                        duration={750}
                        offset={270}
                        spy={true}
                        className={styles.link}
                    >
                        <button className={styles.cta}>Contacter</button>
                    </Link>

                    <div className={styles.contactInfo}>
                        <span className={styles.contactText} aria-label="Téléphone">
                            07 43 35 65 17
                        </span>
                        <span className={styles.contactText} aria-label="Email">
                            2souchik@gmail.com
                        </span>
                    </div>
                </motion.div>
            </div>

            <motion.div
                className={styles.media}
                variants={appear(4)}
                initial="hidden"
                whileInView="visible"
                viewport={{once: ANIMATION_ONCE, amount: 0.3}}>
                <video autoPlay muted loop playsInline className={styles.video}>
                    <source src="/video.mp4" type="video/mp4"/>
                </video>
            </motion.div>

        </section>
    );
}
