"use client";

import {signIn} from "next-auth/react";
import {useState, FormEvent} from "react";
import {useRouter} from "next/navigation";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Email ou mot de passe incorrect");
            } else {
                router.push("/admin");
                router.refresh();
            }
        } catch (error) {
            setError("Une erreur est survenue");
        }
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.formContainer}>
                <h1 className={styles.title}>
                    Connexion Admin
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={styles.input}
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={styles.input}
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className={styles.errorMessage}>
                            {error}
                        </div>
                    )}

                    <button type="submit" className={styles.submitButton}>
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    );
}
