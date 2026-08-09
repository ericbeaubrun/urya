'use client';

import {motion} from 'framer-motion';
import {useCallback, useEffect, useState} from 'react';
import {X} from 'lucide-react';
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
    const [zoomed, setZoomed] = useState<number | null>(null);

    const close = useCallback(() => setZoomed(null), []);

    // Échap ferme la visionneuse, et le défilement de la page est bloqué tant
    // qu'elle est ouverte : sans cela, la molette fait défiler l'arrière-plan
    // derrière l'image agrandie.
    useEffect(() => {
        if (zoomed === null) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
        };
        window.addEventListener('keydown', onKey);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = previousOverflow;
        };
    }, [zoomed, close]);

    if (!gallery) return null;

    const images = Array.isArray(gallery.images) ? gallery.images : [];
    const zoomedImage = zoomed === null ? null : images[zoomed];

    const altFor = (img: { alt?: string }, idx: number) =>
        // `alt` est saisi depuis l'admin et souvent laissé vide : sans repli,
        // l'image sort du périmètre de Google Images.
        img.alt?.trim() || `DJ URYA en prestation – photo ${idx + 1}`;

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
                            <motion.button
                                key={idx}
                                type="button"
                                className={`${styles.imageCard} ${img.big ? styles.bigCard : ''}`}
                                variants={itemVariants}
                                onClick={() => setZoomed(idx)}
                                aria-label={`Agrandir : ${altFor(img, idx)}`}
                            >
                                <img
                                    src={img.src}
                                    alt={altFor(img, idx)}
                                    className={styles.image}
                                    loading="lazy"
                                    decoding="async"
                                />
                                <span className={styles.hoverOverlay}/>
                            </motion.button>
                        ))}
                </motion.div>
            </motion.div>

            {zoomedImage && (
                <div
                    className={styles.lightbox}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Photo agrandie"
                    onClick={close}
                >
                    <button
                        type="button"
                        className={styles.lightboxClose}
                        onClick={close}
                        aria-label="Fermer"
                        title="Fermer"
                    >
                        <X size={22}/>
                    </button>
                    {/* Le clic sur l'image ne doit pas refermer : seul le fond
                        et le bouton ferment la visionneuse. */}
                    <img
                        src={zoomedImage.src}
                        alt={altFor(zoomedImage, zoomed as number)}
                        className={styles.lightboxImage}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </section>
    );
}
