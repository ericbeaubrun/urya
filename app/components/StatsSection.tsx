"use client";

import styles from "../styles/StatsSection.module.css";
import { motion } from "framer-motion";
import {ANIMATION_ONCE} from "@/app/config/config";

const content = {
    title: "About Last Night",
    description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo adipiscing faucibus nunc amet convallis " +
        "posuere diam nulla. Pellentesque vulputate dui posuere orci tellus dolor, semper convallis sed.",
    stats: [
        { number: "20+", label: "Music Artists" },
        { number: "150+", label: "Songs" },
        { number: "10+", label: "Places" },
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
