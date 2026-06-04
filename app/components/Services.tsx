'use client';

import {motion} from 'framer-motion';
import {Heart, Sparkles, PartyPopper, CalendarDays, Check, ArrowRight} from 'lucide-react';
import {Link as ScrollLink} from 'react-scroll';
import styles from './Services.module.css';
import {ANIMATION_ONCE} from "@/app/config";

import {useContent} from '@/app/ContentContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICON_MAP: Record<string, any> = {
    Heart,
    PartyPopper,
    Sparkles,
    CalendarDays
};

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

export default function Services() {
    const {services} = useContent();
    return (
        <section id="services" className={styles.section}>
            <div className={styles.bgOverlay}/>

            <motion.div
                className={styles.container}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{once: ANIMATION_ONCE, amount: 0.1}}
            >
                {/* Section Header */}
                <div className={styles.header}>
                    <motion.h2
                        className={styles.sectionTitle}
                        variants={itemVariants}
                    >
                        {services.title.text}
                        <br/>
                        <span className={styles.textGradient}>{services.title.highlight}</span>
                    </motion.h2>
                    <motion.p
                        className={styles.sectionSubtitle}
                        variants={itemVariants}
                    >
                        {services.subtitle}
                    </motion.p>
                </div>

                {/* 4 Cards Grid */}
                <div className={styles.grid}>
                    {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        services.items.map((service: any, idx: number) => {
                            const Icon = ICON_MAP[service.icon] || Sparkles;

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
                                        <div className={styles.imageOverlay}/>

                                        {/* Badge titre sur l'image */}
                                        <div className={styles.cardHeaderTitle}>
                                            <div className={styles.iconWrapper}>
                                                <Icon size={20} className={styles.icon}/>
                                            </div>
                                            <h3 className={styles.cardTitle}>{service.title}</h3>
                                        </div>
                                    </div>

                                    {/* Card Content Body */}
                                    <div className={styles.cardBody}>
                                        <p className={styles.cardSubtitle}>{service.subtitle}</p>

                                        <ul className={styles.inclusionsList}>
                                            {service.inclusions.map((item: string) => (
                                                <li key={item} className={styles.inclusionItem}>
                                                    <Check size={14} className={styles.checkIcon}/>
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
                                                style={{cursor: 'pointer'}}
                                            >
                                                <span>Devis</span>
                                                <ArrowRight size={14} className={styles.arrowIcon}/>
                                            </ScrollLink>
                                        </div>
                                    </div>

                                </motion.div>
                            );
                        })}
                </div>

                {/* Extra Options Section */}
                {services.extraOptions && (
                    <motion.div
                        className={styles.extraOptionsContainer}
                        variants={itemVariants}
                    >
                        <h3 className={styles.extraOptionsTitle}>{services.extraOptions.title}</h3>
                        <div className={styles.extraOptionsGrid}>
                            {services.extraOptions.items.map((item: string) => (
                                <div key={item} className={styles.extraOptionItem}>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </section>
    );
}
