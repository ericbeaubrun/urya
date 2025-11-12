"use client";

import { useState } from "react";
import styles from "../styles/ContactForm.module.css";

export default function ContactForm() {
    const [form, setForm] = useState({ nom: "", email: "", message: "" });
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            setStatus(res.ok ? "sent" : "error");
            if (res.ok) setForm({ nom: "", email: "", message: "" });

        } catch {
            setStatus("error");
        }
    };

    return (
        <section className={styles.wrapper}>
            <h2 className={styles.title}>Contact</h2>
            <p className={styles.subtitle}>Une question ? Un devis ? Parlons-en 🎧</p>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label>Nom complet</label>
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

                <button type="submit" disabled={status === "sending"} className={styles.button}>
                    {status === "sending" ? "Envoi en cours..." : "Envoyer"}
                </button>

                {status === "sent" && <p className={styles.success}>✅ Message envoyé ! Je reviens vers vous très vite.</p>}
                {status === "error" && <p className={styles.error}>❌ Une erreur est survenue. Réessayez.</p>}
            </form>
        </section>
    );
}
