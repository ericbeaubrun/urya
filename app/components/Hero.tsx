'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link as ScrollLink } from 'react-scroll';
import styles from './Hero.module.css';
import {ANIMATION_ONCE} from "@/app/config";

interface HeroProps {
    onContactClick?: () => void;
}

export default function Hero({ onContactClick }: HeroProps) {
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

    return (
        <section id="hero" className={styles.heroSection}>
            {/* Background Media & Overlays */}
            <div className={styles.bgContainer}>
                <img
                    src="https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=1920"
                    alt="DJ en action"
                    className={styles.bgImage}
                />
                <div className={styles.bgOverlay} />
                <div className={styles.bgGlow} />
            </div>

            {/* Main Content */}
            <motion.div 
                className={styles.content}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: ANIMATION_ONCE, amount: 0.1 }}
            >
                {/* Status Tag */}
                <motion.div className={styles.tag} variants={itemVariants}>
                    <span className={styles.tagPulse} />
                    <span className={styles.tagText}>
            Disponible pour 2026 / 2027
          </span>
                </motion.div>

                <motion.h1 className={styles.title} variants={itemVariants}>
                    L&apos;énergie de votre
                    <br />
                    <span className={styles.textGradient}>événement</span>
                    <br />
                    sur mesure.
                </motion.h1>

                <motion.p className={styles.subtitle} variants={itemVariants}>
                    DJ professionnel pour mariages, soirées d&apos;entreprise et clubs.
                    Un univers sonore unique, une présence scénique incomparable.
                </motion.p>

                {/* Call To Actions */}
                <motion.div className={styles.ctaGroup} variants={itemVariants}>
                    <ScrollLink
                        to="devis"
                        smooth={true}
                        offset={-80}
                        duration={800}
                        className={styles.primaryBtn}
                        style={{ cursor: 'pointer' }}
                    >
                        Réserver une date
                    </ScrollLink>
                    <ScrollLink
                        to="faq"
                        smooth={true}
                        offset={670}
                        duration={800}
                        onClick={onContactClick}
                        className={styles.secondaryBtn}
                        style={{ cursor: 'pointer' }}
                    >
                        Me contacter
                    </ScrollLink>
                </motion.div>

                {/* Stats Grid */}
                <motion.div className={styles.statsGrid} variants={itemVariants}>
                    {[
                        { value: '8+', label: "années d'expérience" },
                        { value: '400+', label: 'événements' },
                        { value: '50+', label: 'clubs & festivals' },
                    ].map((stat) => (
                        <div key={stat.label} className={styles.statCard}>
                            <div className={styles.statValue}>{stat.value}</div>
                            <div className={styles.statLabel}>{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Scroll Down Indicator */}
            <ScrollLink
                to="about"
                smooth={true}
                duration={800}
                className={styles.scrollIndicator}
                aria-label="Découvrir la suite"
                style={{ cursor: 'pointer' }}
            >
                {/*<span className={styles.scrollText}>Découvrir</span>*/}
                {/*<ChevronDown size={20} className={styles.scrollIcon} />*/}
            </ScrollLink>
        </section>
    );
}
