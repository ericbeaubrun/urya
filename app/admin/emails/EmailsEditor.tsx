'use client';

import {useRef, useState} from 'react';
import styles from './EmailsEditor.module.css';
import {DEFAULT_TEST_EMAIL} from '@/app/config';
import {EMAIL_TEMPLATES, unknownPlaceholders} from '@/lib/email-templates';
import type {StoredEmailTemplate} from '@/lib/email-templates';
import {
    previewEmailTemplateAction,
    saveEmailTemplateAction,
    sendTestEmailAction,
} from '@/app/actions/emailTemplates';

type Draft = { sujet: string; corps: string };

export default function EmailsEditor({initial}: { initial: StoredEmailTemplate[] }) {
    const [activeKey, setActiveKey] = useState(EMAIL_TEMPLATES[0].key);

    const [drafts, setDrafts] = useState<Record<string, Draft>>(() =>
        Object.fromEntries(
            EMAIL_TEMPLATES.map(def => {
                const row = initial.find(t => t.cle === def.key);
                return [def.key, {
                    sujet: row?.sujet ?? def.defaultSubject,
                    corps: row?.corps ?? def.defaultBody,
                }];
            })
        )
    );

    const [busy, setBusy] = useState(false);
    const [status, setStatus] = useState<{ text: string; error?: boolean } | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [testEmail, setTestEmail] = useState(DEFAULT_TEST_EMAIL);
    const bodyRef = useRef<HTMLTextAreaElement>(null);

    const def = EMAIL_TEMPLATES.find(t => t.key === activeKey)!;
    const draft = drafts[activeKey];
    const unknown = unknownPlaceholders(def, draft.sujet, draft.corps);

    function update(patch: Partial<Draft>) {
        setDrafts(prev => ({...prev, [activeKey]: {...prev[activeKey], ...patch}}));
        setPreview(null);
    }

    /** Insère la variable à la position du curseur, sinon en fin de corps. */
    function insertVariable(key: string) {
        const token = `{{${key}}}`;
        const el = bodyRef.current;

        if (!el) {
            update({corps: `${draft.corps}${token}`});
            return;
        }

        const start = el.selectionStart ?? draft.corps.length;
        const end = el.selectionEnd ?? start;
        const next = draft.corps.slice(0, start) + token + draft.corps.slice(end);

        update({corps: next});

        requestAnimationFrame(() => {
            el.focus();
            el.setSelectionRange(start + token.length, start + token.length);
        });
    }

    async function run(action: () => Promise<{ success: boolean; message?: string }>) {
        setBusy(true);
        setStatus(null);
        try {
            const result = await action();
            if (result.message) {
                setStatus({text: result.message, error: !result.success});
            }
        } catch (e) {
            setStatus({text: `Erreur : ${(e as Error).message}`, error: true});
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.pageHead}>
                <h1>Contenu des e-mails automatiques</h1>
                <p>Rédaction en Markdown. Les valeurs par défaut du site s&apos;appliquent tant que rien n&apos;est
                    enregistré.</p>
            </div>

            <nav className={styles.tabs}>
                {EMAIL_TEMPLATES.map(t => (
                    <button
                        key={t.key}
                        type="button"
                        aria-current={t.key === activeKey ? 'true' : undefined}
                        className={t.key === activeKey ? `${styles.tab} ${styles.tabActive}` : styles.tab}
                        onClick={() => {
                            setActiveKey(t.key);
                            setPreview(null);
                            setStatus(null);
                        }}
                    >
                        {t.label}
                    </button>
                ))}
            </nav>

            <div className={styles.layout}>
                <div className={styles.panel}>
                    <p className={styles.hint}>{def.description}</p>

                    <div className={styles.field}>
                        <label htmlFor="email-subject">Sujet</label>
                        <input
                            id="email-subject"
                            type="text"
                            value={draft.sujet}
                            onChange={e => update({sujet: e.target.value})}
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="email-body">Corps (Markdown)</label>
                        <textarea
                            id="email-body"
                            ref={bodyRef}
                            value={draft.corps}
                            onChange={e => update({corps: e.target.value})}
                        />
                    </div>

                    <p className={styles.hint}>
                        Mise en forme reconnue : <code>**gras**</code>, <code>*italique*</code>, <code>### titre</code>,
                        listes <code>- item</code>, séparateur <code>---</code>, liens <code>[texte](https://…)</code>.
                        Le HTML saisi ici n&apos;est pas interprété.
                    </p>

                    {unknown.length > 0 && (
                        <p className={`${styles.status} ${styles.statusError}`}>
                            Variables inconnues : {unknown.map(v => `{{${v}}}`).join(', ')} — elles resteront telles
                            quelles dans le mail.
                        </p>
                    )}

                    <div className={styles.field}>
                        <label htmlFor="email-test">Adresse pour l&apos;envoi de test</label>
                        <input
                            id="email-test"
                            type="email"
                            value={testEmail}
                            onChange={e => setTestEmail(e.target.value)}
                        />
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles.saveBtn}
                            disabled={busy}
                            onClick={() => run(() => saveEmailTemplateAction({cle: def.key, ...draft}))}
                        >
                            Enregistrer
                        </button>

                        <button
                            type="button"
                            disabled={busy}
                            onClick={() => run(async () => {
                                const result = await previewEmailTemplateAction({cle: def.key, ...draft});
                                if (result.success && result.html) {
                                    setPreview(result.html);
                                    return {success: true};
                                }
                                return {success: false, message: result.message ?? 'Aperçu impossible.'};
                            })}
                        >
                            Aperçu
                        </button>

                        <button
                            type="button"
                            disabled={busy}
                            onClick={() => run(() => sendTestEmailAction({
                                cle: def.key,
                                ...draft,
                                destinataire: testEmail,
                            }))}
                        >
                            Envoyer un test
                        </button>

                        <button
                            type="button"
                            disabled={busy}
                            onClick={() => {
                                if (!confirm('Revenir au contenu par défaut de ce mail ? (non enregistré)')) return;
                                update({sujet: def.defaultSubject, corps: def.defaultBody});
                            }}
                        >
                            Contenu par défaut
                        </button>
                    </div>

                    {status && (
                        <p className={status.error ? `${styles.status} ${styles.statusError}` : styles.status}>
                            {status.text}
                        </p>
                    )}
                </div>

                <div className={styles.panel}>
                    <h2 className={styles.panelTitle}>Variables disponibles</h2>
                    <p className={styles.hint}>Cliquez pour insérer. Une variable vide affiche sa valeur de repli.</p>

                    <div className={styles.variables}>
                        {def.variables.map(v => (
                            <button
                                key={v.key}
                                type="button"
                                className={styles.variable}
                                onClick={() => insertVariable(v.key)}
                            >
                                <span className={styles.variableCode}>{`{{${v.key}}}`}</span>
                                <span className={styles.variableLabel}>
                                    {v.label}{v.fallback ? ` — sinon « ${v.fallback} »` : ''}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {preview && (
                <div className={styles.panel}>
                    <h2 className={styles.panelTitle}>Aperçu (valeurs d&apos;exemple)</h2>
                    {/* `sandbox` vide : l'aperçu ne doit ni exécuter de script ni naviguer. */}
                    <iframe
                        className={styles.preview}
                        title="Aperçu de l'e-mail"
                        sandbox=""
                        srcDoc={preview}
                    />
                </div>
            )}
        </div>
    );
}
