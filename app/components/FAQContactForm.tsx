'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';
import styles from './FAQ.module.css';
import {EXAMPLE_MAIL, EXAMPLE_NAME} from "@/app/config";

import { useContent } from '@/app/ContentContext';

interface FAQContactFormProps {
    isOpen?: boolean;
    setIsOpen?: (open: boolean) => void;
}

export default function FAQContactForm({ isOpen: propIsOpen, setIsOpen: propSetIsOpen }: FAQContactFormProps) {
    const { faqForm } = useContent();
    const [localIsOpen, setLocalIsOpen] = useState(false);
    
    const isOpen = propIsOpen !== undefined ? propIsOpen : localIsOpen;
    const setIsOpen = propSetIsOpen !== undefined ? propSetIsOpen : setLocalIsOpen;

    const [form, setForm] = useState({ nom: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    if (!faqForm) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                setStatus('sent');
                setForm({ nom: '', email: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    const renderDescription = (text: string) => {
        if (!text) return "";
        const parts = text.split('**');
        return parts.map((part, i) => 
            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
        );
    };

    return (
        <div className={`${styles.item} ${styles.contactFaqTrigger} ${isOpen ? styles.itemOpen : ''}`}>
            <button 
                className={`${styles.trigger} `}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span className={`${styles.question}`}>{faqForm.trigger}</span>
                <div className={styles.iconWrapper}>
                    <ChevronDown size={20} />
                </div>
            </button>
            
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className={styles.contentWrapper}
                    >
                        <div className={styles.content}>
                            <p style={{ marginBottom: '1.5rem' }}>
                                {renderDescription(faqForm.description)}
                            </p>
                            
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.field}>
                                    <label className={styles.fieldLabel}>{faqForm.fields?.name}</label>
                                    <input
                                        type="text"
                                        name="nom"
                                        value={form.nom}
                                        onChange={handleChange}
                                        placeholder={EXAMPLE_NAME}
                                        required
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.field}>
                                    <label className={styles.fieldLabel}>{faqForm.fields?.email}</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder={EXAMPLE_MAIL}
                                        required
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.field}>
                                    <label className={styles.fieldLabel}>{faqForm.fields?.message}</label>
                                    <textarea
                                        name="message"
                                        rows={4}
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder={faqForm.fields?.placeholders?.message}
                                        required
                                        className={styles.textarea}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className={styles.cta}
                                >
                                    {status === 'sending' ? (
                                        <div className={styles.loaderGroup}>
                                            <div className={styles.spinner} />
                                            <span>{faqForm.buttons?.sending}</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Send size={16} />
                                            <span>{faqForm.buttons?.send}</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {(status === 'sent' || status === 'error') && (
                    <div className={styles.modalOverlay} onClick={() => setStatus('idle')}>
                        <motion.div
                            className={`${styles.modal} ${status === 'sent' ? styles.modalSuccess : styles.modalError}`}
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <div className={styles.modalContent}>
                                {status === 'sent' ? (
                                    <CheckCircle size={36} className={styles.modalIconSuccess} />
                                ) : (
                                    <AlertCircle size={36} className={styles.modalIconError} />
                                )}
                                <h3 className={styles.modalTitle}>
                                    {status === 'sent' ? faqForm.modal?.success?.title : faqForm.modal?.error?.title}
                                </h3>
                                <p className={styles.modalText}>
                                    {status === 'sent'
                                        ? faqForm.modal?.success?.text
                                        : faqForm.modal?.error?.text}
                                </p>
                            </div>
                            <div className={styles.modalActions}>
                                <button className={styles.modalButton} onClick={() => setStatus('idle')}>
                                    {faqForm.modal?.close}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
