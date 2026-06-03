'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link as ScrollLink } from 'react-scroll';
import styles from './Hero.module.css';
import {ANIMATION_ONCE} from "@/app/config";

import content from '@/data/content.json';

const { hero } = content;

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
                <video
                    src="/hero_background.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className={styles.bgImage}
                />
                <div className={styles.bgOverlay} />
                <div className={styles.bgGlow} />
                <div className={styles.bottomShadow} />
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
            {hero.status}
          </span>
                </motion.div>

                <motion.h1 className={styles.title} variants={itemVariants}>
                    {hero.title.line1}
                    <br />
                    <span className={styles.textGradient}>{hero.title.highlight}</span>
                    <br />
                    {hero.title.line2}
                </motion.h1>

                <motion.p className={styles.subtitle} variants={itemVariants}>
                    {hero.subtitle1}
                    <br/>
                    {hero.subtitle2}
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
                        {hero.ctas.primary}
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
                        {hero.ctas.secondary}
                    </ScrollLink>
                </motion.div>

                {/* Stats Grid */}
                <motion.div className={styles.statsGrid} variants={itemVariants}>
                    {hero.stats.map((stat) => (
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
