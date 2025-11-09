"use client";

import {useEffect, useState} from "react";
import {
    addPrestation,
    deletePrestation,
    getPrestations,
    updatePrestation,
    getClients,
    addClient
} from "../actions/prestations";
import styles from "./PrestationsAdminPage.module.css";

interface Client {
    id: string;
    nom: string;
    mail: string;
    tel?: string;
}

interface Prestation {
    id: string;
    id_client?: string;
    statut: string;
    date_debut: string;
    heure_debut?: string;
    heure_fin?: string;
    type?: string;
    lieu?: string;
    notes?: string;
    client?: Client;
}

interface PrestationFormData {
    id_client: string;
    statut: string;
    date_debut: string;
    heure_debut: string;
    heure_fin: string;
    type: string;
    lieu: string;
    notes: string;
}

export default function PrestationsAdminPage() {
    const [prestations, setPrestations] = useState<Prestation[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingPrestation, setEditingPrestation] = useState<Prestation | null>(null);
    const [showNewClientForm, setShowNewClientForm] = useState(false);

    // État du formulaire de prestation
    const [formData, setFormData] = useState<PrestationFormData>({
        id_client: "",
        statut: "en_attente",
        date_debut: "",
        heure_debut: "",
        heure_fin: "",
        type: "",
        lieu: "",
        notes: "",
    });

    // État du formulaire de nouveau client
    const [newClient, setNewClient] = useState({
        nom: "",
        mail: "",
        tel: "",
    });

    // Charger les prestations et clients au chargement
    useEffect(() => {
        loadPrestations();
        loadClients();
    }, []);

    async function loadPrestations() {
        console.log("🔄 Chargement des prestations...");
        const result = await getPrestations();

        if (!result.success) {
            console.error("❌ Erreur chargement:", result.error);
            alert(`Erreur chargement: ${result.error}`);
            return;
        }

        console.log("✅ Prestations chargées:", result.data?.length || 0);
        setPrestations(result.data || []);
    }

    async function loadClients() {
        console.log("🔄 Chargement des clients...");
        const result = await getClients();

        if (!result.success) {
            console.error("❌ Erreur chargement clients:", result.error);
            return;
        }

        console.log("✅ Clients chargés:", result.data?.length || 0);
        setClients(result.data || []);
    }

    function openAddModal() {
        setEditingPrestation(null);
        setFormData({
            id_client: "",
            statut: "en_attente",
            date_debut: "",
            heure_debut: "",
            heure_fin: "",
            type: "",
            lieu: "",
            notes: "",
        });
        setShowModal(true);
    }

    function openEditModal(prestation: Prestation) {
        setEditingPrestation(prestation);
        setFormData({
            id_client: prestation.id_client || "",
            statut: prestation.statut || "en_attente",
            date_debut: prestation.date_debut || "",
            heure_debut: prestation.heure_debut || "",
            heure_fin: prestation.heure_fin || "",
            type: prestation.type || "",
            lieu: prestation.lieu || "",
            notes: prestation.notes || "",
        });
        setShowModal(true);
    }

    async function handleSubmitPrestation(e: React.FormEvent) {
        e.preventDefault();

        if (!formData.date_debut) {
            alert("La date est obligatoire");
            return;
        }

        setLoading(true);

        const prestationData = {
            id_client: formData.id_client || undefined,
            statut: formData.statut,
            date_debut: formData.date_debut,
            heure_debut: formData.heure_debut || undefined,
            heure_fin: formData.heure_fin || undefined,
            type: formData.type || undefined,
            lieu: formData.lieu || undefined,
            notes: formData.notes || undefined,
        };

        let result;
        if (editingPrestation) {
            console.log("🔄 Tentative de modification:", editingPrestation.id);
            result = await updatePrestation(editingPrestation.id, prestationData);
        } else {
            console.log("🔄 Tentative d'ajout de prestation");
            result = await addPrestation(prestationData);
        }

        setLoading(false);

        if (!result.success) {
            console.error("❌ Erreur:", result.error);
            alert(`❌ ${result.error}`);
            return;
        }

        console.log("✅ Opération réussie");
        alert(editingPrestation ? "✅ Prestation modifiée avec succès!" : "✅ Prestation ajoutée avec succès!");
        setShowModal(false);
        loadPrestations();
    }

    async function handleAddClient(e: React.FormEvent) {
        e.preventDefault();

        if (!newClient.nom || !newClient.mail) {
            alert("Le nom et l'email sont obligatoires");
            return;
        }

        setLoading(true);
        console.log("🔄 Ajout d'un nouveau client");

        const result = await addClient(newClient.nom, newClient.mail, newClient.tel);

        setLoading(false);

        if (!result.success) {
            console.error("❌ Erreur ajout client:", result.error);
            alert(`❌ ${result.error}`);
            return;
        }

        console.log("✅ Client ajouté:", result.data);
        alert("✅ Client ajouté avec succès!");
        setNewClient({nom: "", mail: "", tel: ""});
        setShowNewClientForm(false);
        loadClients();

        // Sélectionner automatiquement le nouveau client
        if (result.data && result.data[0]) {
            setFormData({...formData, id_client: result.data[0].id});
        }
    }

    async function handleDeletePrestation(id: string) {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette prestation ?")) {
            return;
        }

        setLoading(true);
        console.log("🔄 Tentative de suppression:", id);

        const result = await deletePrestation(id);

        setLoading(false);

        if (!result.success) {
            console.error("❌ Erreur suppression:", result.error);
            alert(`❌ ${result.error}`);
            return;
        }

        console.log("✅ Prestation supprimée");
        alert("✅ Prestation supprimée avec succès!");
        loadPrestations();
    }

    const getStatutLabel = (statut: string) => {
        switch (statut) {
            case "en_attente":
                return "⏳ En attente";
            case "confirmee":
                return "✅ Confirmée";
            case "annulee":
                return "❌ Annulée";
            case "terminee":
                return "✔️ Terminée";
            default:
                return statut;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Gestion des Prestations</h1>
                <button onClick={openAddModal} className={styles.addButton} disabled={loading}>
                    ➕ Nouvelle Prestation
                </button>
            </div>

            {loading && (
                <div className={styles.loadingBanner}>
                    ⏳ Opération en cours...
                </div>
            )}

            {/* Liste des prestations */}
            <div className={styles.prestationsList}>
                {prestations.length === 0 ? (
                    <p className={styles.emptyMessage}>Aucune prestation pour le moment</p>
                ) : (
                    prestations.map((p) => (
                        <div key={p.id} className={styles.prestationCard}>
                            <div className={styles.prestationHeader}>
                                <h3>{p.type || "Prestation sans type"}</h3>
                                <span className={`${styles.statut} ${styles[p.statut]}`}>
                                    {getStatutLabel(p.statut)}
                                </span>
                            </div>

                            <div className={styles.prestationDetails}>
                                <div className={styles.detailRow}>
                                    <strong>📅 Date:</strong> {p.date_debut}
                                </div>

                                {(p.heure_debut || p.heure_fin) && (
                                    <div className={styles.detailRow}>
                                        <strong>🕐 Horaires:</strong>
                                        {p.heure_debut && ` ${p.heure_debut}`}
                                        {p.heure_debut && p.heure_fin && " - "}
                                        {p.heure_fin && `${p.heure_fin}`}
                                    </div>
                                )}

                                {p.client && (
                                    <div className={styles.detailRow}>
                                        <strong>👤 Client:</strong> {p.client.nom}
                                        <br/>
                                        <small>📧 {p.client.mail}</small>
                                        {p.client.tel && <><br/><small>📞 {p.client.tel}</small></>}
                                    </div>
                                )}

                                {p.lieu && (
                                    <div className={styles.detailRow}>
                                        <strong>📍 Lieu:</strong> {p.lieu}
                                    </div>
                                )}

                                {p.notes && (
                                    <div className={styles.detailRow}>
                                        <strong>📝 Notes:</strong> {p.notes}
                                    </div>
                                )}
                            </div>

                            <div className={styles.prestationActions}>
                                <button
                                    onClick={() => openEditModal(p)}
                                    disabled={loading}
                                    className={styles.editButton}
                                >
                                    ✏️ Modifier
                                </button>
                                <button
                                    onClick={() => handleDeletePrestation(p.id)}
                                    disabled={loading}
                                    className={styles.deleteButton}
                                >
                                    🗑️ Supprimer
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal d'ajout/édition */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{editingPrestation ? "Modifier la prestation" : "Nouvelle prestation"}</h2>
                            <button onClick={() => setShowModal(false)} className={styles.closeButton}>
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmitPrestation} className={styles.modalForm}>
                            <div className={styles.formGroup}>
                                <label>Client</label>
                                <div className={styles.clientSelect}>
                                    <select
                                        value={formData.id_client}
                                        onChange={(e) => setFormData({...formData, id_client: e.target.value})}
                                        disabled={loading}
                                    >
                                        <option value="">-- Aucun client --</option>
                                        {clients.map((client) => (
                                            <option key={client.id} value={client.id}>
                                                {client.nom} ({client.mail})
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => setShowNewClientForm(!showNewClientForm)}
                                        className={styles.newClientButton}
                                    >
                                        {showNewClientForm ? "Annuler" : "➕ Nouveau"}
                                    </button>
                                </div>

                                {showNewClientForm && (
                                    <div className={styles.newClientForm}>
                                        <input
                                            type="text"
                                            placeholder="Nom du client"
                                            value={newClient.nom}
                                            onChange={(e) => setNewClient({...newClient, nom: e.target.value})}
                                            required
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={newClient.mail}
                                            onChange={(e) => setNewClient({...newClient, mail: e.target.value})}
                                            required
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Téléphone (optionnel)"
                                            value={newClient.tel}
                                            onChange={(e) => setNewClient({...newClient, tel: e.target.value})}
                                        />
                                        <button type="button" onClick={handleAddClient} disabled={loading}>
                                            Ajouter le client
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label>Type de prestation</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Mariage, Anniversaire..."
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    disabled={loading}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Statut *</label>
                                <select
                                    value={formData.statut}
                                    onChange={(e) => setFormData({...formData, statut: e.target.value})}
                                    required
                                    disabled={loading}
                                >
                                    <option value="en_attente">En attente</option>
                                    <option value="confirmee">Confirmée</option>
                                    <option value="annulee">Annulée</option>
                                    <option value="terminee">Terminée</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Date *</label>
                                <input
                                    type="date"
                                    value={formData.date_debut}
                                    onChange={(e) => setFormData({...formData, date_debut: e.target.value})}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Heure de début</label>
                                    <input
                                        type="time"
                                        value={formData.heure_debut}
                                        onChange={(e) => setFormData({...formData, heure_debut: e.target.value})}
                                        disabled={loading}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Heure de fin</label>
                                    <input
                                        type="time"
                                        value={formData.heure_fin}
                                        onChange={(e) => setFormData({...formData, heure_fin: e.target.value})}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Lieu</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Salle des fêtes, Paris..."
                                    value={formData.lieu}
                                    onChange={(e) => setFormData({...formData, lieu: e.target.value})}
                                    disabled={loading}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Notes</label>
                                <textarea
                                    placeholder="Notes supplémentaires..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                    disabled={loading}
                                    rows={4}
                                />
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setShowModal(false)} disabled={loading}>
                                    Annuler
                                </button>
                                <button type="submit" disabled={loading} className={styles.submitButton}>
                                    {loading ? "⏳" : editingPrestation ? "💾 Enregistrer" : "➕ Créer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
