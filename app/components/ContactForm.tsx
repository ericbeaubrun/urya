"use client";

import {useState} from "react";
import { motion } from "framer-motion";
import styles from "../styles/ContactForm.module.css";
import { ANIMATION_ONCE } from "../config/config";

export default function ContactForm() {
    const [form, setForm] = useState({nom: "", email: "", message: ""});
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

    const appear = (index: number) => ({
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                delay: index * 0.15,
                ease: "easeOut",
            },
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(form),
            });

            setStatus(res.ok ? "sent" : "error");
            if (res.ok) setForm({nom: "", email: "", message: ""});

        } catch {
            setStatus("error");
        }
    };

    return (
        <section className={styles.wrapper}>
            <motion.h2
                className={styles.title}
                variants={appear(0)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: ANIMATION_ONCE, amount: 0.3 }}
            >
                Contact
            </motion.h2>
            <motion.p
                className={styles.subtitle}
                variants={appear(1)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: ANIMATION_ONCE, amount: 0.3 }}
            >
                Pour toute demande ou collaboration, envoyez‑moi un message.
            </motion.p>

            <motion.form
                onSubmit={handleSubmit}
                className={styles.form}
                variants={appear(2)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: ANIMATION_ONCE, amount: 0.3 }}
            >
                <motion.div className={styles.field} variants={appear(3)}>
                    <label>Nom ou Organisation</label>
                    <input
                        type="text"
                        name="nom"
                        value={form.nom}
                        onChange={handleChange}
                        required
                    />
                </motion.div>

                <motion.div className={styles.field} variants={appear(4)}>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </motion.div>

                <motion.div className={styles.field} variants={appear(5)}>
                    <label>Message</label>
                    <textarea
                        name="message"
                        rows={4}
                        value={form.message}
                        onChange={handleChange}
                        required
                    />
                </motion.div>

                <motion.button
                    type="submit"
                    disabled={status === "sending"}
                    className={styles.cta}
                    variants={appear(6)}
                >
                    {status === "sending" ? "Envoi en cours..." : "Envoyer"}
                </motion.button>
            </motion.form>

            {(status === "sent" || status === "error") && (
                <motion.div
                    className={styles.modalOverlay}
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setStatus("idle")}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.div
                        className={`${styles.modal} ${status === "sent" ? styles.modalSuccess : styles.modalError}`}
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    >
                        <div className={styles.modalContent}>
                            <h3 className={styles.modalTitle}>
                                {status === "sent" ? "Message envoyé" : "Erreur"}
                            </h3>
                            <p className={styles.modalText}>
                                {status === "sent"
                                    ? "Je reviens vers vous très vite."
                                    : "Une erreur est survenue. Réessayez."}
                            </p>
                        </div>
                        <div className={styles.modalActions}>
                            <button className={styles.modalButton} onClick={() => setStatus("idle")}>OK</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </section>
    );
}
