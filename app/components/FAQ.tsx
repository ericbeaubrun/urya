'use client';

import {useState} from 'react';
import {ChevronDown} from 'lucide-react';
import {motion, AnimatePresence} from 'framer-motion';
import styles from './FAQ.module.css';
import FAQContactForm from './FAQContactForm';
import {ANIMATION_ONCE} from "@/app/config";

import { useContent } from '@/app/ContentContext';

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
    const { faq } = useContent();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className={styles.section}>
            <motion.div
                className={styles.container}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{once: ANIMATION_ONCE, amount: 0.1}}
            >
                <div className={styles.header}>
                    <motion.h2 className={styles.title} variants={itemVariants}>
                        {faq.title.text} <span className={styles.textGradient}>{faq.title.highlight}</span>
                    </motion.h2>
                </div>

                <div className={styles.accordion}>
                    {faq.items.map((item: any, idx: number) => {
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
