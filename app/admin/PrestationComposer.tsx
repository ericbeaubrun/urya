"use client";

import {useState} from "react";
import styles from "./PrestationEdit.module.css";
import {Client, PrestationFormData} from "./DataTypes";
import {addPrestation, addClient} from "../actions/prestations";

export default function PrestationComposer({clients, onCreated,}: {
    clients: Client[];
    onCreated: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [showNewClient, setShowNewClient] = useState(false);

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

    // ---------------------
    // Ajouter une prestation
    // ---------------------

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!formData.date_debut) {
            alert("La date de début est obligatoire");
            return;
        }

        setLoading(true);
        const result = await addPrestation({
            ...formData,
            date_fin: formData.date_fin || null,
        });
        setLoading(false);

        if (!result.success) {
            alert("Erreur: " + result.error);
            return;
        }

        alert("Prestation ajoutée !");
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

        onCreated();
    }

    // ---------------------
    // Ajouter un client
    // ---------------------

    async function handleAddClient() {
        if (!newClient.nom || !newClient.mail)
            return alert("Nom + email obligatoires");

        setLoading(true);
        const result = await addClient(
            newClient.nom,
            newClient.mail,
            newClient.tel
        );
        setLoading(false);

        if (!result.success) {
            alert("Erreur: " + result.error);
            return;
        }

        alert("Client ajouté !");
        const added = result.data?.[0];

        if (added) {
            setFormData({...formData, id_client: added.id});
        }

        setNewClient({nom: "", mail: "", tel: ""});
        setShowNewClient(false);
        onCreated();
    }

    // ---------------------
    // Rendu
    // ---------------------

    return (
        <div className={styles.formContainer}>
            <h2>Ajouter une nouvelle prestation</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
                {/* DATES -------------------------------------------------------------- */}
                <div className={styles.formGroup}>
                    <label>Date de début *</label>
                    <input
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
                    <label>Date de fin</label>
                    <input
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

                {/* HEURES -------------------------------------------------------------- */}
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Heure début</label>
                        <input
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
                        <label>Heure fin</label>
                        <input
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
                </div>

                {/* TYPE -------------------------------------------------------------- */}
                <div className={styles.formGroup}>
                    <label>Type de prestation</label>
                    <input
                        type="text"
                        value={formData.type}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                type: e.target.value,
                            })
                        }
                        placeholder="Ex: Mariage, Anniversaire..."
                    />
                </div>

                {/* LIEU -------------------------------------------------------------- */}
                <div className={styles.formGroup}>
                    <label>Lieu</label>
                    <input
                        type="text"
                        placeholder="Ex: Salle des fêtes, Paris..."
                        value={formData.lieu}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                lieu: e.target.value,
                            })
                        }
                    />
                </div>

                {/* CLIENT -------------------------------------------------------------- */}
                <div className={styles.formGroup}>
                    <label>Client</label>
                    <div className={styles.clientRow}>
                        <select
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
                            {showNewClient ? "Annuler" : "➕ Nouveau"}
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
                            <button type="button" onClick={handleAddClient}>
                                ➕ Ajouter le client
                            </button>
                        </div>
                    )}
                </div>

                {/* STATUT -------------------------------------------------------------- */}
                <div className={styles.formGroup}>
                    <label>Statut</label>
                    <select
                        value={formData.statut}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                statut: e.target.value,
                            })
                        }
                    >
                        <option value="en_attente">En attente</option>
                        <option value="confirmee">Confirmée</option>
                        <option value="annulee">Annulée</option>
                        <option value="terminee">Terminée</option>
                    </select>
                </div>

                {/* NOTES -------------------------------------------------------------- */}
                <div className={styles.formGroup}>
                    <label>Notes</label>
                    <textarea
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

                {/* SUBMIT -------------------------------------------------------------- */}
                <button type="submit" disabled={loading} className={styles.submitBtn}>
                    {loading ? "⏳" : "➕ Ajouter"}
                </button>
            </form>
        </div>
    );
}
