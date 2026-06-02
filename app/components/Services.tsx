'use client';

import { motion } from 'framer-motion';
import { Heart, Sparkles, PartyPopper, CalendarDays, Check, ArrowRight } from 'lucide-react';
import { Link as ScrollLink } from 'react-scroll';
import styles from './Services.module.css';
import {ANIMATION_ONCE} from "@/app/config";

const servicesData = [
    {
        icon: Heart,
        title: 'Mariages',
        subtitle: 'La bande-son parfaite pour le plus beau jour de votre vie',
        image: '/mariage.jpg',
        price: 'À partir de 1 200€',
        inclusions: [
            'Rendez-vous de préparation approfondi',
            'Playlist personnalisée pour le vin d\'honneur',
            'Sonorisation haut de gamme de la piste de danse',
            // 'Éclairage d\'ambiance de la salle (DMX)',
            // 'Micro HF disponible pour les discours',
            // 'Matériel de secours (backup) systématique',
        ],
    },
    {
        icon: PartyPopper,
        title: 'Anniversaires',
        subtitle: 'Une ambiance sur mesure pour célébrer votre nouvelle année',
        image: '/anniversaire.jpg',
        price: 'À partir de 700€',
        inclusions: [
            'Mix Open Format adapté à toutes les générations',
            'Prise en compte de vos morceaux favoris (Blacklist/Whitelist)',
            'Système de sonorisation et lumières inclus',
            // 'Installation propre et discrète avant l\'arrivée des invités',
            // 'En option : Option Karaoké ou Blind Test durant le repas',
        ],
    },
    {
        icon: Sparkles,
        title: 'Événements & Soirées',
        subtitle: 'Transformez votre villa ou lieu loué en véritable club éphémère',
        image: '/soiree_privee.png',
        price: 'À partir de 900€',
        inclusions: [
            'Set orienté House, Tech House, Deep ou Commercial',
            'Effets visuels dynamiques et machines à effets',
            'Modularité selon la configuration du lieu',
            // 'Gestion de l\'énergie de la piste en temps réel',
            // 'Prolongations possibles sur demande',
        ],
    },
    // {
    //     icon: CalendarDays,
    //     title: 'Événements',
    //     subtitle: 'Lancements, galas ou soirées d\'entreprise haut de gamme',
    //     image: '/evenement.png',
    //     price: 'Sur devis',
    //     inclusions: [
    //         'Analyse du brief événementiel et de l\'ADN de marque',
    //         'Musique d\'ambiance Lounge / Deep pour le cocktail',
    //         'Montée en puissance pour la partie dansante',
    //         // 'Coordination avec vos prestataires et équipes techniques',
    //         // 'Création de jingles ou identité sonore dédiée',
    //     ],
    // },
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

export default function Services() {
    return (
        <section id="services" className={styles.section}>
            <div className={styles.bgOverlay} />

            <motion.div 
                className={styles.container}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: ANIMATION_ONCE, amount: 0.1 }}
            >
                {/* Section Header */}
                <div className={styles.header}>
                    <motion.h2 
                        className={styles.sectionTitle}
                        variants={itemVariants}
                    >
                        Chaque événement mérite
                        <br />
                        <span className={styles.textGradient}>une expérience unique</span>
                    </motion.h2>
                    <motion.p 
                        className={styles.sectionSubtitle}
                        variants={itemVariants}
                    >
                        Du mariage intimiste à la soirée de gala, chaque programmation sonore
                        est façonnée avec exigence et passion.
                    </motion.p>
                </div>

                {/* 4 Cards Grid */}
                <div className={styles.grid}>
                    {servicesData.map((service, idx) => {
                        const Icon = service.icon;

                        return (
                            <motion.div
                                key={service.title}
                                className={styles.card}
                                variants={itemVariants}
                            >
                                {/* Image Wrapper */}
                                <div className={styles.imageWrapper}>
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className={styles.image}
                                    />
                                    <div className={styles.imageOverlay} />

                                    {/* Badge titre sur l'image */}
                                    <div className={styles.cardHeaderTitle}>
                                        <div className={styles.iconWrapper}>
                                            <Icon size={20} className={styles.icon} />
                                        </div>
                                        <h3 className={styles.cardTitle}>{service.title}</h3>
                                    </div>
                                </div>

                                {/* Card Content Body */}
                                <div className={styles.cardBody}>
                                    <p className={styles.cardSubtitle}>{service.subtitle}</p>

                                    <ul className={styles.inclusionsList}>
                                        {service.inclusions.map((item) => (
                                            <li key={item} className={styles.inclusionItem}>
                                                <Check size={14} className={styles.checkIcon} />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Card Footer (Tarif et CTA) */}
                                    <div className={styles.cardFooter}>
                                        <div>
                                            <div className={styles.priceLabel}>Tarif</div>
                                            <div className={styles.priceValue}>{service.price}</div>
                                        </div>
                                        <ScrollLink
                                            to="devis"
                                            smooth={true}
                                            offset={-80}
                                            duration={800}
                                            className={styles.ctaLink}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <span>Devis</span>
                                            <ArrowRight size={14} className={styles.arrowIcon} />
                                        </ScrollLink>
                                    </div>
                                </div>

                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </section>
    );
}
