'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, Instagram, MapPin } from 'lucide-react';
import styles from './About.module.css';
import {ANIMATION_ONCE} from "@/app/config";

const contactInfo = [
    { icon: Phone, label: '+33 6 12 34 56 78', sub: 'Téléphone' },
    { icon: Mail, label: 'booking@djnexus.fr', sub: 'Email' },
    { icon: Instagram, label: '@djnexus_music', sub: 'Instagram' },
    { icon: MapPin, label: 'Paris, France', sub: 'Localisation' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

export default function About() {
    return (
        <section id="about" className={styles.section}>
            <motion.div 
                className={styles.container}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: ANIMATION_ONCE, amount: 0.1 }}
            >
                <div className={styles.grid}>

                    {/* Côté Média (Vidéo en boucle) */}
                    <motion.div 
                        className={styles.mediaWrapper}
                        variants={itemVariants}
                    >
                        <div className={styles.videoContainer}>
                            <video
                                src="/video.mp4"
                                poster="https://images.pexels.com/photos/2390369/pexels-photo-2390369.jpeg?auto=compress&cs=tinysrgb&w=800"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className={styles.video}
                            />
                            <div className={styles.videoRing} />
                            <div className={styles.videoGradientOverlay} />
                        </div>
                    </motion.div>

                    {/* Côté Texte */}
                    <div>
                        <motion.h2 
                            className={styles.sectionTitle}
                            variants={itemVariants}
                        >
                            Un artiste, une vision,
                            <br />
                            <span className={styles.textGradient}>votre soirée inoubliable.</span>
                        </motion.h2>

                        <motion.div 
                            className={styles.textContent}
                            variants={itemVariants}
                        >
                            <p>
                                Depuis plus de 8 ans, <strong className={styles.textWhite}>DJ URYA</strong> électrise les dancefloors
                                de Paris ... <strong className={styles.textWhite}>Open Format, Electronic</strong> et
                                touches <strong className={styles.textWhite}>Chic</strong> — capable de s&apos;adapter à chaque ambiance, de
                                l&apos;intime au grandiose.
                            </p>
                            <p>
                                Chaque prestation est une collaboration : un rendez-vous de préparation, une playlist
                                sur mesure, et une ... collective mémorable.
                            </p>
                        </motion.div>

                        {/* Tags de styles musicaux */}
                        <motion.div 
                            className={styles.tagsContainer}
                        >
                            {['Open Format', 'Electronic', 'House', 'Tech House', 'Commercial', 'Chic & Lounge'].map((tag) => (
                                <motion.span 
                                    key={tag} 
                                    className={styles.tag}
                                    variants={itemVariants}
                                >
                                    {tag}
                                </motion.span>
                            ))}
                        </motion.div>

                        {/* Informations de contact (anciennement Gear) */}
                        <motion.div 
                            className={styles.gearGrid}
                        >
                            {contactInfo.map(({ icon: Icon, label, sub }) => (
                                <motion.div 
                                    key={label} 
                                    className={styles.gearCard}
                                    variants={itemVariants}
                                >
                                    <div className={styles.gearIconWrapper}>
                                        <Icon size={16} className={styles.gearIcon} />
                                    </div>
                                    <div>
                                        <div className={styles.gearLabel}>{label}</div>
                                        <div className={styles.gearSub}>{sub}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                    </div>
                </div>
            </motion.div>
        </section>
    );
}
