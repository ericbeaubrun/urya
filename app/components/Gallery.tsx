'use client';

import { motion } from 'framer-motion';
import styles from './Gallery.module.css';
import {ANIMATION_ONCE} from "@/app/config";

const galleryImages = [
    { src: 'dj-urya_1.png', alt: 'DJ en plein mix', gridClass: styles.bigCard },
    { src: 'dj-urya_2.png', alt: 'Foule en festival', gridClass: '' },
    { src: 'dj-urya_3.png', alt: 'Jeux de lumières concert', gridClass: '' },
    { src: 'dj-urya_4.png', alt: 'Ambiance soirée entreprise', gridClass: '' },
    { src: 'dj-urya_5.png', alt: 'Piste de danse en club', gridClass: '' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        },
    },
};

const itemVariants = {
    hidden: { 
        opacity: 0, 
        y: 30
    },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut"
        }
    },
};

export default function Gallery() {
    return (
        <section id="gallery" className={styles.section}>
            <motion.div 
                className={styles.container}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: ANIMATION_ONCE, amount: 0.2 }}
            >
                <div className={styles.header}>
                    <motion.h2 
                        className={styles.sectionTitle}
                        variants={itemVariants}
                    >
                        Capturer l&apos;énergie,
                        <br />
                        <span className={styles.textGradient}>immortaliser l&apos;instant</span>
                    </motion.h2>
                    <motion.p 
                        className={styles.sectionSubtitle}
                        variants={itemVariants}
                    >
                        Aperçu des moments forts et des ambiances créées lors des derniers événements.
                    </motion.p>
                </div>

                {/* Grille Bento */}
                <motion.div 
                    className={styles.grid}
                >
                    {galleryImages.map((img, idx) => (
                        <motion.div
                            key={idx}
                            className={`${styles.imageCard} ${img.gridClass}`}
                            variants={itemVariants}
                        >
                            <img
                                src={img.src}
                                alt={img.alt}
                                className={styles.image}
                                loading="lazy"
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}
