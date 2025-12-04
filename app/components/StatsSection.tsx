"use client";

import styles from "../styles/StatsSection.module.css";
import { motion } from "framer-motion";
import {ANIMATION_ONCE} from "@/app/config/config";

const content = {
    title: "Ambiance sur mesure",
    description:
        "Avec une sélection musicale variée, des classiques intemporels aux derniers hits, j’adapte chaque mix à votre public, à vos goûts et à l’énergie du moment.\n" +
        "Mon objectif : créer une atmosphère festive et élégante, où chaque invité profite pleinement de la fête.",
    stats: [
        { number: "120+", label: "Événements animés" },
        { number: "10+", label: "Années d’expérience" },
        { number: "50+", label: "Styles musicaux maîtrisés" },
    ],
} as const;

export default function StatsSection() {
    const appear = (index: number) => ({
        hidden: { opacity: 0, y: 30 },
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
        <section className={styles.wrapper}>
            <div className={styles.container}>
                <motion.h2
                    className={styles.title}
                    variants={appear(0)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: ANIMATION_ONCE, amount: 0.3 }}
                >
                    {content.title}
                </motion.h2>

                <motion.p
                    className={styles.text}
                    variants={appear(1)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: ANIMATION_ONCE, amount: 0.3 }}
                >
                    {content.description}
                </motion.p>

                <div className={styles.stats}>
                    {content.stats.map((s, i) => (
                        <motion.div
                            className={styles.statItem}
                            key={s.label}
                            variants={appear(i + 2)}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: ANIMATION_ONCE, amount: 0.3 }}
                        >
                            <span className={styles.number}>{s.number}</span>
                            <span className={styles.label}>{s.label}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
