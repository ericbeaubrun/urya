'use client';

import {motion} from 'framer-motion';
import {Phone, Mail, Instagram, MapPin, type LucideIcon} from 'lucide-react';
import styles from './About.module.css';
import LazyVideo from './LazyVideo';
import {ANIMATION_ONCE} from "@/app/config";
import {contactLink} from '@/lib/contact-links';
import {track} from '@/lib/analytics';

import {useContent} from '@/app/ContentContext';

const ICON_MAP: Record<string, LucideIcon> = {
    Phone,
    Mail,
    Instagram,
    MapPin
};

/** Entrée de contact éditable depuis l'admin ; structure non garantie. */
interface ContactInfoItem {
    icon?: string;
    label?: string;
    sub?: string;
}

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
    if (!text) return "";
    const parts = text.split('**');
    return parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i} className={styles.textWhite}>{part}</strong> : part
    );
};

export default function About() {
    const {about} = useContent();

    // Sécurité si about est manquant
    if (!about) return null;

    const tags = Array.isArray(about.tags) ? about.tags : [];
    // Instagram et la localisation sont toujours saisissables depuis l'admin,
    // mais ne sont plus affichés ici : la section ne garde que les moyens de
    // contact directs.
    const HIDDEN_CONTACT_ICONS = ["Instagram", "MapPin"];
    const contactInfo = (Array.isArray(about.contactInfo) ? about.contactInfo : [])
        .filter((item) => !HIDDEN_CONTACT_ICONS.includes(String(item.icon)));
    const description = Array.isArray(about.description) ? about.description : [];

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
                            <LazyVideo
                                src="/media/about.cf498287.mp4"
                                poster="/media/about_poster.a6b75b0f.webp"
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
                            {about.title?.text}
                            <br/>
                            <span className={styles.textGradient}>{about.title?.highlight}</span>
                        </motion.h2>

                        <motion.div
                            className={styles.textContent}
                            variants={itemVariants}
                        >
                            {
                                description.map((para, i) => (
                                    <p key={i}>{renderDescription(para)}</p>
                                ))}
                        </motion.div>

                        <motion.div
                            className={styles.tagsContainer}
                        >
                            {
                                tags.map((tag) => (
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
                            {(contactInfo as ContactInfoItem[]).map((item) => {
                                const {icon: iconName, label, sub} = item;
                                const Icon = (iconName && ICON_MAP[iconName]) || Phone;
                                const link = contactLink(item);

                                const body = (
                                    <>
                                        <div className={styles.gearIconWrapper}>
                                            <Icon size={16} className={styles.gearIcon}/>
                                        </div>
                                        <div>
                                            <div className={styles.gearLabel}>{label}</div>
                                            <div className={styles.gearSub}>{sub}</div>
                                        </div>
                                    </>
                                );

                                // Une carte sans destination reste un bloc de
                                // texte : en faire un lien inerte tromperait
                                // sur ce qu'un clic va produire.
                                if (!link) {
                                    return (
                                        <motion.div
                                            key={label}
                                            className={styles.gearCard}
                                            variants={itemVariants}
                                        >
                                            {body}
                                        </motion.div>
                                    );
                                }

                                return (
                                    <motion.a
                                        key={label}
                                        href={link.href}
                                        className={`${styles.gearCard} ${styles.gearCardLink}`}
                                        variants={itemVariants}
                                        onClick={() => track("contact_click", {channel: link.channel})}
                                        {...(link.external
                                            ? {target: "_blank", rel: "noopener noreferrer"}
                                            : {})}
                                    >
                                        {body}
                                    </motion.a>
                                );
                            })}
                        </motion.div>

                    </div>
                </div>
            </motion.div>
        </section>
    );
}
