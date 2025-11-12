"use client";

import Image from "next/image";
import styles from "../styles/Prestations.module.css";
import { motion } from "framer-motion";
import { ANIMATION_ONCE } from "@/app/config/config";

interface Prestation {
    title: string;
    description: string;
    price: string;
    featured?: boolean;
    image: string;
}

const images_path = "/";

const prestations: Prestation[] = [
    {
        title: "Anniversaires",
        description:
            "Animation complète, ambiance personnalisée selon le thème et le public.",
        price: "À partir de 280 €",
        image: images_path + "anniversaire.jpg",
    },
    {
        title: "Soirées",
        description:
            "Ambiance festive garantie pour vos événements familiaux ou entre amis.",
        price: "À partir de 320 €",
        image: images_path + "soiree_privee.jpg",
    },
    {
        title: "Événements",
        description:
            "Animation musicale professionnelle pour vos séminaires, repas ou soirées de fin d'année.",
        price: "À partir de 450 €",
        image: images_path + "evenement.jpg",
    },
    {
        title: "Mariages",
        description:
            "Prestation sur mesure : cocktail, dîner, ouverture de bal, soirée dansante. Matériel pro & coordination.",
        price: "À partir de 520 €",
        featured: true,
        image: images_path + "mariage.jpg",
    },
];

export default function Prestations() {
    return (
        <section className={styles.wrapper}>
            <motion.h2
                className={styles.sectionTitle}
                variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                            duration: 0.6,
                            delay: 0.15,
                            ease: "easeOut",
                        },
                    },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: ANIMATION_ONCE, amount: 0.3 }}
            >
                Principales Offres
            </motion.h2>

            <div className={styles.grid}>
                {prestations.map((p, idx) => (
                    <motion.div
                        key={p.title}
                        className={`${styles.card} ${p.featured ? styles.featured : ""}`}
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                    duration: 0.6,
                                    delay: 0.15 + idx * 0.1,
                                    ease: "easeOut",
                                },
                            },
                        }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: ANIMATION_ONCE, amount: 0.3 }}
                    >

                    <div className={styles.imageWrapper}>
                            <Image
                                src={p.image}
                                alt={p.title}
                                fill
                                sizes="100%"
                                className={styles.image}
                            />
                        </div>

                        <div className={styles.content}>
                            <h3 className={styles.title}>{p.title}</h3>
                            <p className={styles.description}>{p.description}</p>
                            <p className={styles.price}>{p.price}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
