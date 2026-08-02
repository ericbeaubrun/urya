'use client';

import {motion} from 'framer-motion';
import styles from './Gallery.module.css';
import {ANIMATION_ONCE} from "@/app/config";

import {useContent} from '@/app/ContentContext';

const containerVariants = {
    hidden: {opacity: 0},
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
    const {gallery} = useContent();

    if (!gallery) return null;

    const images = Array.isArray(gallery.images) ? gallery.images : [];

    return (
        <section id="gallery" className={styles.section}>
            <motion.div
                className={styles.container}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{once: ANIMATION_ONCE, amount: 0.2}}
            >
                <div className={styles.header}>
                    <motion.h2
                        className={styles.sectionTitle}
                        variants={itemVariants}
                    >
                        {gallery.title?.text}
                        <br/>
                        <span className={styles.textGradient}>{gallery.title?.highlight}</span>
                    </motion.h2>
                    <motion.p
                        className={styles.sectionSubtitle}
                        variants={itemVariants}
                    >
                        {gallery.subtitle}
                    </motion.p>
                </div>

                <motion.div
                    className={styles.grid}
                >
                    {
                        images.map((img, idx) => (
                            <motion.div
                                key={idx}
                                className={`${styles.imageCard} ${img.big ? styles.bigCard : ''}`}
                                variants={itemVariants}
                            >
                                <img
                                    src={img.src}
                                    // `alt` est saisi depuis l'admin et souvent
                                    // laissé vide : sans repli, l'image sort du
                                    // périmètre de Google Images.
                                    alt={img.alt?.trim() || `DJ URYA en prestation – photo ${idx + 1}`}
                                    className={styles.image}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </motion.div>
                        ))}
                </motion.div>
            </motion.div>
        </section>
    );
}
