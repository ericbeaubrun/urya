"use client";

import {useState} from "react";
import styles from "./PrestationEdit.module.css";
import {Client, PrestationFormData} from "./DataTypes";
import {addPrestation, addClient} from "../actions/prestations";
import {PRESTATION_STATUTS, PRESTATION_STATUT_LABELS} from "@/lib/prestation-types";

type Feedback = { type: "ok" | "error"; message: string } | null;

export default function PrestationComposer({clients, onCreatedAction,}: {
    clients: Client[];
    onCreatedAction: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [showNewClient, setShowNewClient] = useState(false);
    const [feedback, setFeedback] = useState<Feedback>(null);

    const [formData, setFormData] = useState<PrestationFormData>({
        id_client: "",
        statut: "en_attente",
        date_debut: "",
        date_fin: "",
        heure_debut: "",
        heure_fin: "",
        type: "",
        lieu: "",
        notes: "",
    });

    const [newClient, setNewClient] = useState({
        nom: "",
        mail: "",
        tel: "",
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!formData.date_debut) {
            setFeedback({type: "error", message: "La date de début est obligatoire."});
            return;
        }

        setLoading(true);
        const result = await addPrestation({
            ...formData,
            date_fin: formData.date_fin || null,
        });
        setLoading(false);

        if (!result.success) {
            setFeedback({type: "error", message: "Erreur : " + result.error});
            return;
        }

        setFeedback({type: "ok", message: "Prestation ajoutée."});
        setFormData({
            id_client: "",
            statut: "en_attente",
            date_debut: "",
            date_fin: "",
            heure_debut: "",
            heure_fin: "",
            type: "",
            lieu: "",
            notes: "",
        });

        onCreatedAction();
    }

    async function handleAddClient() {
        if (!newClient.nom || !newClient.mail) {
            setFeedback({type: "error", message: "Nom et email du client sont obligatoires."});
            return;
        }

        setLoading(true);
        const result = await addClient(
            newClient.nom,
            newClient.mail,
            newClient.tel
        );
        setLoading(false);

        if (!result.success) {
            setFeedback({type: "error", message: "Erreur : " + result.error});
            return;
        }

        setFeedback({type: "ok", message: "Client ajouté."});
        const added = result.data?.[0];

        if (added) {
            setFormData({...formData, id_client: added.id});
        }

        setNewClient({nom: "", mail: "", tel: ""});
        setShowNewClient(false);
        onCreatedAction();
    }

    return (
        <div className={styles.formContainer}>
            <div className={styles.formHeader}>
                <h2>Nouvelle prestation</h2>
                <p>Les champs marqués d&apos;une astérisque sont obligatoires.</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>

                {feedback && (
                    <div
                        className={`${styles.feedback} ${feedback.type === "ok" ? styles.feedbackOk : styles.feedbackError}`}
                        role="status"
                    >
                        {feedback.message}
                    </div>
                )}

                <div className={styles.formGroup}>
                    <label htmlFor="date_debut">Date de début *</label>
                    <input
                        id="date_debut"
                        type="date"
                        value={formData.date_debut}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                date_debut: e.target.value,
                            })
                        }
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="date_fin">Date de fin</label>
                    <input
                        id="date_fin"
                        type="date"
                        value={formData.date_fin || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                date_fin: e.target.value,
                            })
                        }
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="heure_debut">Heure de début</label>
                    <input
                        id="heure_debut"
                        type="time"
                        value={formData.heure_debut}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                heure_debut: e.target.value,
                            })
                        }
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="heure_fin">Heure de fin</label>
                    <input
                        id="heure_fin"
                        type="time"
                        value={formData.heure_fin}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                heure_fin: e.target.value,
                            })
                        }
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="type">Type de prestation</label>
                    <input
                        id="type"
                        type="text"
                        value={formData.type}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                type: e.target.value,
                            })
                        }
                        placeholder="Mariage, anniversaire…"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="lieu">Lieu</label>
                    <input
                        id="lieu"
                        type="text"
                        placeholder="Salle des fêtes, Paris…"
                        value={formData.lieu}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                lieu: e.target.value,
                            })
                        }
                    />
                </div>

                <div className={`${styles.formGroup} ${styles.full}`}>
                    <label htmlFor="client">Client</label>
                    <div className={styles.clientRow}>
                        <select
                            id="client"
                            value={formData.id_client}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    id_client: e.target.value,
                                })
                            }
                        >
                            <option value="">— Aucun client —</option>
                            {clients.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.nom} ({c.mail})
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            onClick={() => setShowNewClient(!showNewClient)}
                            className={styles.newClientBtn}
                        >
                            {showNewClient ? "Annuler" : "Nouveau client"}
                        </button>
                    </div>

                    {showNewClient && (
                        <div className={styles.newClientForm}>
                            <input
                                type="text"
                                placeholder="Nom"
                                value={newClient.nom}
                                onChange={(e) =>
                                    setNewClient({
                                        ...newClient,
                                        nom: e.target.value,
                                    })
                                }
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={newClient.mail}
                                onChange={(e) =>
                                    setNewClient({
                                        ...newClient,
                                        mail: e.target.value,
                                    })
                                }
                            />
                            <input
                                type="tel"
                                placeholder="Téléphone"
                                value={newClient.tel}
                                onChange={(e) =>
                                    setNewClient({
                                        ...newClient,
                                        tel: e.target.value,
                                    })
                                }
                            />
                            <button type="button" onClick={handleAddClient} disabled={loading}>
                                Ajouter le client
                            </button>
                        </div>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="statut">Statut</label>
                    <select
                        id="statut"
                        value={formData.statut}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                statut: e.target.value,
                            })
                        }
                    >
                        {PRESTATION_STATUTS.map((statut) => (
                            <option key={statut} value={statut}>
                                {PRESTATION_STATUT_LABELS[statut]}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={`${styles.formGroup} ${styles.full}`}>
                    <label htmlFor="notes">Notes</label>
                    <textarea
                        id="notes"
                        rows={3}
                        placeholder="Notes supplémentaires…"
                        value={formData.notes}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                notes: e.target.value,
                            })
                        }
                    ></textarea>
                </div>

                <div className={styles.footer}>
                    <button type="submit" disabled={loading} className={styles.submitBtn}>
                        {loading ? "Enregistrement…" : "Ajouter la prestation"}
                    </button>
                </div>
            </form>
        </div>
    );
}
