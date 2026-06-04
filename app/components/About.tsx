'use client';

import {motion} from 'framer-motion';
import {Phone, Mail, Instagram, MapPin} from 'lucide-react';
import styles from './About.module.css';
import {ANIMATION_ONCE} from "@/app/config";

import {useContent} from '@/app/ContentContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICON_MAP: Record<string, any> = {
    Phone,
    Mail,
    Instagram,
    MapPin
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

const renderDescription = (text: string) => {
    const parts = text.split('**');
    return parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i} className={styles.textWhite}>{part}</strong> : part
    );
};

export default function About() {
    const {about} = useContent();
    return (
        <section id="about" className={styles.section}>
            <motion.div
                className={styles.container}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{once: ANIMATION_ONCE, amount: 0.1}}
            >
                <div className={styles.grid}>

                    <motion.div
                        className={styles.mediaWrapper}
                        variants={itemVariants}
                    >
                        <div className={styles.videoContainer}>
                            <video
                                src="/about.mp4"
                                poster="https://images.pexels.com/photos/2390369/pexels-photo-2390369.jpeg?auto=compress&cs=tinysrgb&w=800"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className={styles.video}
                            />
                            <div className={styles.videoRing}/>
                            <div className={styles.videoGradientOverlay}/>
                        </div>
                    </motion.div>

                    {/* Côté Texte */}
                    <div>
                        <motion.h2
                            className={styles.sectionTitle}
                            variants={itemVariants}
                        >
                            {about.title.text}
                            <br/>
                            <span className={styles.textGradient}>{about.title.highlight}</span>
                        </motion.h2>

                        <motion.div
                            className={styles.textContent}
                            variants={itemVariants}
                        >
                            {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                about.description.map((para: any, i: any) => (
                                    <p key={i}>{renderDescription(para)}</p>
                                ))}
                        </motion.div>

                        <motion.div
                            className={styles.tagsContainer}
                        >
                            {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                about.tags.map((tag: any) => (
                                    <motion.span
                                        key={tag}
                                        className={styles.tag}
                                        variants={itemVariants}
                                    >
                                        {tag}
                                    </motion.span>
                                ))}
                            <motion.span
                                className={styles.tag}
                                variants={itemVariants}
                            >
                                ...
                            </motion.span>
                        </motion.div>

                        <motion.div
                            className={styles.gearGrid}
                        >
                            {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                about.contactInfo.map(({icon: iconName, label, sub}: any) => {
                                    const Icon = ICON_MAP[iconName] || Phone;
                                    return (
                                        <motion.div
                                            key={label}
                                            className={styles.gearCard}
                                            variants={itemVariants}
                                        >
                                            <div className={styles.gearIconWrapper}>
                                                <Icon size={16} className={styles.gearIcon}/>
                                            </div>
                                            <div>
                                                <div className={styles.gearLabel}>{label}</div>
                                                <div className={styles.gearSub}>{sub}</div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                        </motion.div>

                    </div>
                </div>
            </motion.div>
        </section>
    );
}
