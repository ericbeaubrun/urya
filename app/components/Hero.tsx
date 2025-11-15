"use client";

import styles from "../styles/Hero.module.css";
import MusicPlayingEffect from "@/app/components/MusicPlayingEffect";
import {motion} from "framer-motion";
import {ANIMATION_ONCE} from "../config/config";

export default function Hero() {

    const appear = (index) => ({
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
                    DJ <br/> <MusicPlayingEffect/> URYA
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
                    Bienvenue dans l’univers de DJ URYA passionnée de musique et créateur d’ambiances inoubliables.
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
                    <button className={styles.cta}>Contacter</button>
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
