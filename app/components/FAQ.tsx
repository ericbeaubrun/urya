'use client';

import {useState} from 'react';
import {ChevronDown} from 'lucide-react';
import {motion, AnimatePresence} from 'framer-motion';
import styles from './FAQ.module.css';
import FAQContactForm from './FAQContactForm';
import {ANIMATION_ONCE} from "@/app/config";

const faqData = [
    {
        question: "Si besoin est, accepteriez-vous de faire des heures supplémentaires ?",
        answer: "Absolument. Je sais que l'énergie d'une soirée peut parfois dépasser les prévisions. Si l'ambiance est au rendez-vous et que vous souhaitez prolonger le mix, je m'adapte en temps réel pour assurer la continuité de l'événement."
    },
    {
        question: "Que se passe-t-il si ma date ou mes horaires changent ?",
        answer: "La flexibilité est l'une de mes priorités. Si vous m'informez suffisamment à l'avance, je ferai tout mon possible pour réajuster mon planning sans frais supplémentaires, sous réserve de disponibilité à la nouvelle date."
    },
    {
        question: "Facturez-vous les déplacements ?",
        answer: "Les frais de déplacement sont inclus dans un rayon défini autour de ma base. Pour les prestations nationales ou internationales, un forfait kilométrique ou de transport transparent est calculé lors du devis initial."
    },
    {
        question: "Avez-vous besoin d'un repas ou d'un hébergement ?",
        answer: "Pour les prestations de longue durée (soirées complètes), un repas prestataire est apprécié. Concernant l'hébergement, il n'est généralement requis que pour les déplacements lointains nécessitant un repos après le set pour des raisons de sécurité."
    },
    {
        question: "Combien de temps vous faut-il pour l'installation ?",
        answer: "Il me faut environ 1 heure pour installer et calibrer mon système de sonorisation et d'éclairage. J'arrive systématiquement en avance pour m'assurer que tout est opérationnel avant l'arrivée de vos premiers invités."
    },
    {
        question: "Est-il possible de choisir les chansons qui seront jouées ?",
        answer: "C'est votre événement, votre univers sonore. Nous définissons ensemble une 'Playlist' de vos incontournables et une 'Blacklist' de ce que vous ne voulez surtout pas entendre. Je me charge ensuite de mixer ces choix de manière fluide et professionnelle."
    }
];

const containerVariants = {
    hidden: {opacity: 0},
    visible: {
        opacity: 1,
        transition: {
            duration: 0.5
        }
    }
};

const itemVariants = {
    hidden: {opacity: 0},
    visible: {
        opacity: 1,
        transition: {duration: 0.5, ease: "easeOut"}
    }
};

interface FAQProps {
    isContactFormOpen?: boolean;
    setIsContactFormOpen?: (open: boolean) => void;
}

export default function FAQ({isContactFormOpen, setIsContactFormOpen}: FAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className={styles.section}>
            {/*<div className={styles.bgGlow}/>*/}

            <motion.div
                className={styles.container}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{once: ANIMATION_ONCE, amount: 0.1}}
            >
                <div className={styles.header}>
                    {/*<span className={styles.sectionTag}>Assistance</span>*/}
                    <motion.h2 className={styles.title} variants={itemVariants}>
                        Questions <span className={styles.textGradient}>Fréquentes</span>
                    </motion.h2>
                </div>

                <div className={styles.accordion}>
                    {faqData.map((item, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <motion.div
                                key={idx}
                                className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}
                                variants={itemVariants}
                            >
                                <button
                                    className={styles.trigger}
                                    onClick={() => toggleItem(idx)}
                                    aria-expanded={isOpen}
                                >
                                    <span className={styles.question}>{item.question}</span>
                                    <div className={styles.iconWrapper}>
                                        <ChevronDown size={20}/>
                                    </div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{height: 0, opacity: 0}}
                                            animate={{height: 'auto', opacity: 1}}
                                            exit={{height: 0, opacity: 0}}
                                            transition={{duration: 0.3, ease: 'easeInOut'}}
                                            className={styles.contentWrapper}
                                        >
                                            <div className={styles.content}>
                                                {item.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                    <motion.div variants={itemVariants}>
                        <FAQContactForm
                            isOpen={isContactFormOpen}
                            setIsOpen={setIsContactFormOpen}
                        />
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
