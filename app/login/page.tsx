"use client";

import {signIn} from "next-auth/react";
import {useState, FormEvent} from "react";
import {useRouter} from "next/navigation";
import "../admin/admin-theme.css";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (loading) return;

        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Email ou mot de passe incorrect");
                setLoading(false);
                return;
            }

            // On garde l'état « en cours » : la navigation et le rafraîchissement
            // prennent encore un instant, autant ne pas faire clignoter le bouton.
            router.push("/admin");
            router.refresh();
        } catch {
            setError("Une erreur est survenue");
            setLoading(false);
        }
    }

    return (
        <div className={`adminShell ${styles.page}`}>
            <div className={styles.card}>
                {loading && <div className={styles.progress} role="presentation"/>}

                <div className={styles.brand}>
                    <span className={styles.brandMark}>U</span>
                    <span className={styles.brandText}>Administration</span>
                </div>

                <h1 className={styles.title}>Connexion</h1>
                <p className={styles.subtitle}>Accès réservé aux administrateurs.</p>

                <form onSubmit={handleSubmit} noValidate={false}>
                    <fieldset
                        disabled={loading}
                        className={loading ? styles.fieldsBusy : undefined}
                        style={{border: 0, padding: 0, margin: 0}}
                    >
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="login-email">Email</label>
                            <input
                                id="login-email"
                                type="email"
                                autoComplete="username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="admin@example.com"
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="login-password">Mot de passe</label>
                            <input
                                id="login-password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>
                    </fieldset>

                    {error && (
                        <div className={styles.error} role="alert">{error}</div>
                    )}

                    <button type="submit" className={styles.submit} disabled={loading}>
                        {loading && <span className={styles.spinner} aria-hidden="true"/>}
                        {loading ? "Connexion en cours…" : "Se connecter"}
                    </button>

                    <p aria-live="polite" className={styles.srOnly}>
                        {loading ? "Connexion en cours" : ""}
                    </p>
                </form>

                <p className={styles.footer}>
                    Mot de passe oublié ? Contactez l’administrateur du site.
                </p>
            </div>
        </div>
    );
}
