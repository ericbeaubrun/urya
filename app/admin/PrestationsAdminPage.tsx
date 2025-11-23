"use client";

import styles from "./PrestationsAdminPage.module.css";
import {useEffect, useState} from "react";
import {
    getPrestations,
    getClients,
    deletePrestation,
    updatePrestation,
    addClient
} from "../actions/prestations";

import {Prestation, Client} from "./DataTypes";
import PrestationForm from "./PrestationComposer";

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR");
}

type SectionType = "futures" | "passees";

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
        if (!confirm("Supprimer ?")) return;
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
                <h2 className={styles.blockTitle}>{title}</h2>

                {items.map((p) => {
                    const isPast = new Date(p.date_debut) < today;
                    const cardStatusClass = isPast
                        ? styles.cardPassee
                        : p.statut === "confirmee"
                            ? styles.cardConfirmee
                            : p.statut === "annulee"
                                ? styles.cardAnnulee
                                : "";

                    return (
                        <div key={p.id} className={`${styles.card} ${cardStatusClass}`}>
                            {editingId === p.id ? (
                                <>
                                    <div className={styles.formRow}>
                                        <label>Date début :</label>
                                        <input
                                            type="date"
                                            value={editData.date_debut || ""}
                                            onChange={(e) =>
                                                setEditData({...editData, date_debut: e.target.value})
                                            }
                                        />
                                    </div>

                                    <div className={styles.formRow}>
                                        <label>Date fin :</label>
                                        <input
                                            type="date"
                                            value={editData.date_fin || ""}
                                            onChange={(e) =>
                                                setEditData({...editData, date_fin: e.target.value})
                                            }
                                        />
                                    </div>

                                    <div className={styles.formRow}>
                                        <label>Heure début :</label>
                                        <input
                                            type="time"
                                            value={editData.heure_debut || ""}
                                            onChange={(e) =>
                                                setEditData({...editData, heure_debut: e.target.value})
                                            }
                                        />
                                    </div>

                                    <div className={styles.formRow}>
                                        <label>Heure fin :</label>
                                        <input
                                            type="time"
                                            value={editData.heure_fin || ""}
                                            onChange={(e) =>
                                                setEditData({...editData, heure_fin: e.target.value})
                                            }
                                        />
                                    </div>

                                    <div className={styles.formRow}>
                                        <label>Type :</label>
                                        <input
                                            type="text"
                                            value={editData.type || ""}
                                            onChange={(e) =>
                                                setEditData({...editData, type: e.target.value})
                                            }
                                        />
                                    </div>

                                    <div className={styles.formRow}>
                                        <label>Lieu :</label>
                                        <input
                                            type="text"
                                            value={editData.lieu || ""}
                                            onChange={(e) =>
                                                setEditData({...editData, lieu: e.target.value})
                                            }
                                        />
                                    </div>

                                    <div className={styles.formRow}>
                                        <label>Client :</label>
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
                                            <div className={styles.formRow}>
                                                <label>Nom client :</label>
                                                <input
                                                    type="text"
                                                    value={editClient.nom || ""}
                                                    onChange={(e) =>
                                                        setEditClient({...editClient, nom: e.target.value})
                                                    }
                                                />
                                            </div>

                                            <div className={styles.formRow}>
                                                <label>Email client :</label>
                                                <input
                                                    type="email"
                                                    value={editClient.mail || ""}
                                                    onChange={(e) =>
                                                        setEditClient({...editClient, mail: e.target.value})
                                                    }
                                                />
                                            </div>

                                            <div className={styles.formRow}>
                                                <label>Téléphone client :</label>
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

                                    <div className={styles.formRow}>
                                        <label>Statut :</label>
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
                                        <label>Notes :</label>
                                        <textarea
                                            value={editData.notes || ""}
                                            onChange={(e) =>
                                                setEditData({...editData, notes: e.target.value})
                                            }
                                        />
                                    </div>

                                    <div className={styles.actions}>
                                        <button
                                            onClick={async () => {
                                                setLoading(true);

                                                await updatePrestation(p.id, editData);

                                                if (editData.id_client && editClient) {
                                                    await addClient(
                                                        editClient.nom!,
                                                        editClient.mail!,
                                                        editClient.tel || null,
                                                        editData.id_client
                                                    );
                                                }

                                                setLoading(false);

                                                setEditingId(null);
                                                loadAll();
                                            }}

                                        >
                                            💾 Enregistrer
                                        </button>

                                        <button onClick={() => setEditingId(null)}>❌ Annuler</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={styles.cardSection}>
                                        {p.client ? (
                                            <>
                                                {p.client.nom ? (
                                                    <p>👤 {p.client.nom}</p>
                                                ) : (
                                                    <p className={styles.emptyValue}>👤 Non renseigné</p>
                                                )}

                                                {p.client.mail ? (
                                                    <p>✉️ {p.client.mail}</p>
                                                ) : (
                                                    <p className={styles.emptyValue}>✉️ Non renseigné</p>
                                                )}

                                                {p.client.tel ? (
                                                    <p>📞 {p.client.tel}</p>
                                                ) : (
                                                    <p className={styles.emptyValue}>📞 Non renseigné</p>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <p className={styles.emptyValue}>👤 Non renseigné</p>
                                                <p className={styles.emptyValue}>✉️ Non renseigné</p>
                                                <p className={styles.emptyValue}>📞 Non renseigné</p>
                                            </>
                                        )}
                                    </div>

                                    <div className={styles.cardSection}>
                                        <p>📅 {formatDate(p.date_debut)}</p>

                                        {p.heure_debut ? (
                                            <p>🕒 {p.heure_debut} → {p.heure_fin || "--:--"}</p>
                                        ) : (
                                            <p className={styles.emptyValue}>🕒 Non renseigné</p>
                                        )}

                                        {p.date_fin ? (
                                            <p>📅 Fin : {formatDate(p.date_fin)}</p>
                                        ) : (
                                            <p className={styles.emptyValue}>📅 Fin : Non renseignée</p>
                                        )}
                                    </div>

                                    {/* Bloc Lieu + Type + Notes */}
                                    <div className={styles.cardSection}>
                                        {p.lieu ? (
                                            <p>📍 {p.lieu}</p>
                                        ) : (
                                            <p className={styles.emptyValue}>📍 Non renseigné</p>
                                        )}

                                        {p.type ? (
                                            <p>🎵 {p.type}</p>
                                        ) : (
                                            <p className={styles.emptyValue}>🎵 Non renseigné</p>
                                        )}

                                        {p.notes ? (
                                            <p>📝 {p.notes}</p>
                                        ) : (
                                            <p className={styles.emptyValue}>📝 Non renseigné</p>
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
                                                ✔ Valider
                                            </button>
                                        )}


                                        <button
                                            className={styles.editBtn}

                                            onClick={() => {
                                                setEditingId(p.id);
                                                setEditData({...p});
                                                setEditClient({...p.client});
                                            }}

                                        >
                                            ✏ Modifier
                                        </button>


                                        <button
                                            className={styles.delete}
                                            disabled={loading}
                                            onClick={() => handleDelete(p.id)}
                                        >
                                            🗑 Supprimer
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
        <div className={`${styles.container} ${styles["mode-compact"]}`}>

            {showComposer && (
                <PrestationForm clients={clients} onCreatedAction={loadAll}/>
            )}

            {(showFutures || showPassees) && (
                <div className={styles.list}>
                    {showFutures && (
                        <>
                            <h1 className={styles.sectionTitle}>📅 Prestations à venir</h1>
                            <Block title="⏳ En attente" items={futurePending}/>
                            <Block title="✅ Confirmées ou ❌ Annulées" items={futureOthers}/>
                        </>
                    )}

                    {showPassees && (
                        <>
                            <h1 className={styles.sectionTitle}>📅 Prestations passées</h1>
                            <Block title="⏳ En attente" items={pastPending}/>
                            <Block title="✔ Validées ou ❌ Annulées" items={pastOthers}/>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default PrestationsAdminPage;


