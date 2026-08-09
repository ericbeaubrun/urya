'use client';

import {motion} from 'framer-motion';
import {Star} from 'lucide-react';
import styles from './Testimonials.module.css';
import {ANIMATION_ONCE} from "@/app/config";

import {useContent} from '@/app/ContentContext';
import {
    testimonialInitial,
    testimonialStars,
    usableTestimonials,
} from '@/lib/site-content';

const containerVariants = {
    hidden: {opacity: 0},
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: {opacity: 0, y: 30},
    visible: {
        opacity: 1,
        y: 0,
        transition: {duration: 0.8, ease: "easeOut"}
    }
};

export default function Testimonials() {
    const {testimonials} = useContent();

    if (!testimonials) return null;

    const items = usableTestimonials(testimonials.items);

    // Une section d'avis vide ne rassure pas, elle inquiète : tant qu'aucun
    // témoignage n'est saisi, la section n'existe pas du tout.
    if (!items.length) return null;

    return (
        <section id="avis" className={styles.section}>
            <motion.div
                className={styles.container}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{once: ANIMATION_ONCE, amount: 0.1}}
            >
                <div className={styles.header}>
                    <motion.h2
                        className={styles.sectionTitle}
                        variants={itemVariants}
                    >
                        {testimonials.title?.text}{' '}
                        <span className={styles.textGradient}>{testimonials.title?.highlight}</span>
                    </motion.h2>
                    {testimonials.subtitle && (
                        <motion.p
                            className={styles.sectionSubtitle}
                            variants={itemVariants}
                        >
                            {testimonials.subtitle}
                        </motion.p>
                    )}
                </div>

                <div className={styles.grid}>
                    {
                        items.map((item, idx) => {
                            const stars = testimonialStars(item.rating);
                            const author = item.author?.trim();
                            const initial = testimonialInitial(author);
                            const title = item.title?.trim();

                            return (
                                <motion.figure
                                    key={idx}
                                    className={styles.card}
                                    variants={itemVariants}
                                >
                                    <figcaption className={styles.head}>
                                        {/* La pastille double le nom écrit juste
                                            à côté : pour un lecteur d'écran,
                                            c'est une répétition, d'où le retrait
                                            de l'arbre d'accessibilité. */}
                                        {initial && (
                                            <span className={styles.avatar} aria-hidden="true">
                                                {initial}
                                            </span>
                                        )}

                                        <div className={styles.identity}>
                                            {author && (
                                                <span className={styles.authorName}>{author}</span>
                                            )}

                                            {stars > 0 && (
                                                <div
                                                    className={styles.stars}
                                                    role="img"
                                                    aria-label={`Note : ${stars} sur 5`}
                                                >
                                                    {Array.from({length: stars}, (_, i) => (
                                                        <Star key={i} size={18} className={styles.star}/>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </figcaption>

                                    <blockquote className={styles.quote}>
                                        {title && <p className={styles.quoteTitle}>{title}</p>}
                                        <p className={styles.quoteText}>{item.quote}</p>
                                    </blockquote>
                                </motion.figure>
                            );
                        })}
                </div>
            </motion.div>
        </section>
    );
}
