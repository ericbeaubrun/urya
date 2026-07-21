"use client";

import styles from "./PrestationsAdminPage.module.css";
import {useEffect, useState} from "react";
import {
    getPrestations,
    getClients,
    deletePrestation,
    updatePrestation,
    updateClient
} from "../actions/prestations";

import {Prestation, Client} from "./DataTypes";
import PrestationForm from "./PrestationComposer";

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", {day: "2-digit", month: "short", year: "numeric"});
}

const STATUT_LABELS: Record<string, string> = {
    en_attente: "En attente",
    confirmee: "Confirmée",
    annulee: "Annulée",
    terminee: "Terminée",
};

const STATUT_BADGES: Record<string, string> = {
    en_attente: styles.badgeEnAttente,
    confirmee: styles.badgeConfirmee,
    annulee: styles.badgeAnnulee,
};

type SectionType = "futures" | "passees";

function Field({label, value}: { label: string; value?: string | null }) {
    return (
        <div className={styles.metaItem}>
            <span className={styles.metaLabel}>{label}</span>
            <span className={`${styles.metaValue} ${value ? "" : styles.emptyValue}`}>
                {value || "Non renseigné"}
            </span>
        </div>
    );
}

function PrestationsAdminPage({
                                  showComposer = true,
                                  sections = ["futures", "passees"] as SectionType[],
                              }: {
    showComposer?: boolean;
    sections?: SectionType[];
}) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState<Partial<Prestation & { client: Client }>>({});
    const [prestations, setPrestations] = useState<Prestation[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(false);
    const [editClient, setEditClient] = useState<Partial<Client>>({});


    async function loadAll() {
        const p = await getPrestations();
        if (p.success) setPrestations(p.data || []);

        const c = await getClients();
        if (c.success) setClients(c.data || []);
    }

    useEffect(() => {
        loadAll();
    }, []);

    async function handleDelete(id: string) {
        if (!confirm("Supprimer cette prestation ?")) return;
        setLoading(true);
        await deletePrestation(id);
        setLoading(false);
        loadAll();
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sorted = [...prestations].sort(
        (a, b) => new Date(a.date_debut).getTime() - new Date(b.date_debut).getTime()
    );

    const future = sorted.filter(p => new Date(p.date_debut) >= today);
    const past = sorted.filter(p => new Date(p.date_debut) < today);

    const futurePending = future.filter(p => p.statut === "en_attente");
    const futureOthers = future.filter(
        p => p.statut === "confirmee" || p.statut === "annulee"
    );

    const pastPending = past.filter(p => p.statut === "en_attente");
    const pastOthers = past.filter(
        p => p.statut === "confirmee" || p.statut === "annulee"
    );

    function Block({title, items}: { title: string; items: Prestation[] }) {
        if (items.length === 0) return null;

        return (
            <div className={styles.block}>
                <h3 className={styles.blockTitle}>
                    {title}
                    <span className={styles.count}>{items.length}</span>
                </h3>

                {items.map((p) => {
                    const isPast = new Date(p.date_debut) < today;
                    const cardStatusClass = isPast
                        ? styles.cardPassee
                        : p.statut === "confirmee"
                            ? styles.cardConfirmee
                            : p.statut === "annulee"
                                ? styles.cardAnnulee
                                : styles.cardEnAttente;

                    return (
                        <div key={p.id} className={`${styles.card} ${cardStatusClass}`}>
                            {editingId === p.id ? (
                                <>
                                    <div className={styles.editGrid}>
                                        <div className={styles.formRow}>
                                            <label>Date de début</label>
                                            <input
                                                type="date"
                                                value={editData.date_debut || ""}
                                                onChange={(e) =>
                                                    setEditData({...editData, date_debut: e.target.value})
                                                }
                                            />
                                        </div>

                                        <div className={styles.formRow}>
                                            <label>Date de fin</label>
                                            <input
                                                type="date"
                                                value={editData.date_fin || ""}
                                                onChange={(e) =>
                                                    setEditData({...editData, date_fin: e.target.value})
                                                }
                                            />
                                        </div>

                                        <div className={styles.formRow}>
                                            <label>Heure de début</label>
                                            <input
                                                type="time"
                                                value={editData.heure_debut || ""}
                                                onChange={(e) =>
                                                    setEditData({...editData, heure_debut: e.target.value})
                                                }
                                            />
                                        </div>

                                        <div className={styles.formRow}>
                                            <label>Heure de fin</label>
                                            <input
                                                type="time"
                                                value={editData.heure_fin || ""}
                                                onChange={(e) =>
                                                    setEditData({...editData, heure_fin: e.target.value})
                                                }
                                            />
                                        </div>

                                        <div className={styles.formRow}>
                                            <label>Type</label>
                                            <input
                                                type="text"
                                                value={editData.type || ""}
                                                onChange={(e) =>
                                                    setEditData({...editData, type: e.target.value})
                                                }
                                            />
                                        </div>

                                        <div className={styles.formRow}>
                                            <label>Lieu</label>
                                            <input
                                                type="text"
                                                value={editData.lieu || ""}
                                                onChange={(e) =>
                                                    setEditData({...editData, lieu: e.target.value})
                                                }
                                            />
                                        </div>

                                        <div className={styles.formRow}>
                                            <label>Statut</label>
                                            <select
                                                value={editData.statut || "en_attente"}
                                                onChange={(e) =>
                                                    setEditData({...editData, statut: e.target.value})
                                                }
                                            >
                                                <option value="en_attente">En attente</option>
                                                <option value="confirmee">Confirmée</option>
                                                <option value="annulee">Annulée</option>
                                                <option value="terminee">Terminée</option>
                                            </select>
                                        </div>

                                        <div className={styles.formRow}>
                                            <label>Client</label>
                                            <select
                                                value={editData.id_client || ""}
                                                onChange={(e) =>
                                                    setEditData({...editData, id_client: e.target.value})
                                                }
                                            >
                                                <option value="">Aucun client</option>
                                                {clients.map((c) => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.nom} ({c.mail})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {editData.id_client && (
                                            <>
                                                <p className={styles.editSubTitle}>Coordonnées du client</p>

                                                <div className={styles.formRow}>
                                                    <label>Nom</label>
                                                    <input
                                                        type="text"
                                                        value={editClient.nom || ""}
                                                        onChange={(e) =>
                                                            setEditClient({...editClient, nom: e.target.value})
                                                        }
                                                    />
                                                </div>

                                                <div className={styles.formRow}>
                                                    <label>Email</label>
                                                    <input
                                                        type="email"
                                                        value={editClient.mail || ""}
                                                        onChange={(e) =>
                                                            setEditClient({...editClient, mail: e.target.value})
                                                        }
                                                    />
                                                </div>

                                                <div className={styles.formRow}>
                                                    <label>Téléphone</label>
                                                    <input
                                                        type="tel"
                                                        value={editClient.tel || ""}
                                                        onChange={(e) =>
                                                            setEditClient({...editClient, tel: e.target.value})
                                                        }
                                                    />
                                                </div>
                                            </>
                                        )}

                                        <div className={`${styles.formRow} ${styles.formRowFull}`}>
                                            <label>Notes</label>
                                            <textarea
                                                rows={3}
                                                value={editData.notes || ""}
                                                onChange={(e) =>
                                                    setEditData({...editData, notes: e.target.value})
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.actions}>
                                        <button
                                            className={styles.saveBtn}
                                            disabled={loading}
                                            onClick={async () => {
                                                setLoading(true);

                                                await updatePrestation(p.id, editData);

                                                // Modification du client rattaché :
                                                // updateClient, et non addClient qui
                                                // créait un doublon à chaque édition.
                                                if (editData.id_client && editClient) {
                                                    await updateClient(editData.id_client, {
                                                        nom: editClient.nom,
                                                        mail: editClient.mail,
                                                        tel: editClient.tel || null,
                                                    });
                                                }

                                                setLoading(false);

                                                setEditingId(null);
                                                loadAll();
                                            }}
                                        >
                                            Enregistrer
                                        </button>

                                        <button onClick={() => setEditingId(null)}>Annuler</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={styles.cardTop}>
                                        <div className={styles.cardTitle}>
                                            <strong>{p.client?.nom || "Client non renseigné"}</strong>
                                            <span className={styles.cardDate}>
                                                {formatDate(p.date_debut)}
                                                {p.heure_debut && ` · ${p.heure_debut}${p.heure_fin ? ` → ${p.heure_fin}` : ""}`}
                                            </span>
                                        </div>
                                        <span
                                            className={`${styles.badge} ${STATUT_BADGES[p.statut] || styles.badgeNeutre}`}>
                                            {STATUT_LABELS[p.statut] || p.statut}
                                        </span>
                                    </div>

                                    <div className={styles.meta}>
                                        <Field label="Email" value={p.client?.mail}/>
                                        <Field label="Téléphone" value={p.client?.tel}/>
                                        <Field label="Date de fin"
                                               value={p.date_fin ? formatDate(p.date_fin) : null}/>
                                        <Field label="Type" value={p.type}/>
                                        <Field label="Lieu" value={p.lieu}/>
                                        {p.notes && (
                                            <div className={`${styles.metaItem} ${styles.notes}`}>
                                                <span className={styles.metaLabel}>Notes</span>
                                                <span className={styles.metaValue}>{p.notes}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.actions}>
                                        {p.statut === "en_attente" && (
                                            <button
                                                className={styles.validBtn}
                                                disabled={loading || isPast}
                                                title={isPast ? "Validation désactivée pour une prestation passée" : undefined}
                                                onClick={async () => {
                                                    if (isPast) return; // sécurité supplémentaire
                                                    setLoading(true);
                                                    try {
                                                        await updatePrestation(p.id, {statut: "confirmee"});
                                                    } finally {
                                                        setLoading(false);
                                                        await loadAll();
                                                    }
                                                }}
                                            >
                                                Valider la réservation
                                            </button>
                                        )}

                                        <button
                                            onClick={() => {
                                                setEditingId(p.id);
                                                setEditData({...p});
                                                setEditClient({...p.client});
                                            }}
                                        >
                                            Modifier
                                        </button>

                                        <button
                                            className={`${styles.delete} ${styles.spacer}`}
                                            disabled={loading}
                                            onClick={() => handleDelete(p.id)}
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }

    // ---------- RENDER ----------
    const showFutures = sections.includes("futures");
    const showPassees = sections.includes("passees");

    return (
        <div className={styles.container}>

            {showComposer && (
                <>
                    <div className={styles.pageHead}>
                        <h1>Ajouter une prestation</h1>
                        <p>{prestations.length} prestation{prestations.length > 1 ? "s" : ""} enregistrée{prestations.length > 1 ? "s" : ""}</p>
                    </div>
                    <PrestationForm clients={clients} onCreatedAction={loadAll}/>
                </>
            )}

            {(showFutures || showPassees) && (
                <div className={styles.list}>
                    {showFutures && (
                        <section className={styles.section}>
                            <div className={styles.pageHead}>
                                <h1 className={styles.sectionTitle}>Prestations à venir</h1>
                                <p>{future.length} au total</p>
                            </div>
                            <Block title="En attente" items={futurePending}/>
                            <Block title="Confirmées ou annulées" items={futureOthers}/>
                            {future.length === 0 && (
                                <p className={styles.empty}>Aucune prestation à venir.</p>
                            )}
                        </section>
                    )}

                    {showPassees && (
                        <section className={styles.section}>
                            <div className={styles.pageHead}>
                                <h1 className={styles.sectionTitle}>Prestations passées</h1>
                                <p>{past.length} au total</p>
                            </div>
                            <Block title="En attente" items={pastPending}/>
                            <Block title="Validées ou annulées" items={pastOthers}/>
                            {past.length === 0 && (
                                <p className={styles.empty}>Aucune prestation passée.</p>
                            )}
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}

export default PrestationsAdminPage;
