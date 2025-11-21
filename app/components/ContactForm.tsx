"use client";

import {useState} from "react";
import styles from "../styles/ContactForm.module.css";

export default function ContactForm() {
    const [form, setForm] = useState({nom: "", email: "", message: ""});
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

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
            <h2 className={styles.title}>Contact</h2>
            <p className={styles.subtitle}>Pour toute demande ou collaboration, envoyez‑moi un message.</p>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label>Nom ou Organisation</label>
                    <input
                        type="text"
                        name="nom"
                        value={form.nom}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label>Message</label>
                    <textarea
                        name="message"
                        rows={4}
                        value={form.message}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" disabled={status === "sending"} className={styles.cta}>
                    {status === "sending" ? "Envoi en cours..." : "Envoyer"}
                </button>
            </form>

            {(status === "sent" || status === "error") && (
                <div
                    className={styles.modalOverlay}
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setStatus("idle")}
                >
                    <div
                        className={`${styles.modal} ${status === "sent" ? styles.modalSuccess : styles.modalError}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalContent}>
                            <h3 className={styles.modalTitle}>
                                {status === "sent" ? "Message envoyé" : "Erreur"}
                            </h3>
                            <p className={styles.modalText}>
                                {status === "sent"
                                    ? "Message envoyé ! Je reviens vers vous très vite."
                                    : "Une erreur est survenue. Réessayez."}
                            </p>
                        </div>
                        <div className={styles.modalActions}>
                            <button className={styles.modalButton} onClick={() => setStatus("idle")}>OK</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
