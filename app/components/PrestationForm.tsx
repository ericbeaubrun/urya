'use client';

import { useState } from 'react';
import styles from './PrestationForm.module.css';

interface PrestationFormData {
    // Informations client
    nom: string;
    mail: string;
    tel: string;

    // Informations prestation
    date_debut: string;
    date_fin: string;
    heure_debut: string;
    heure_fin: string;
    type: string;
    lieu: string;
    notes: string;
}

export default function PrestationForm() {
    const [formData, setFormData] = useState<PrestationFormData>({
        nom: '',
        mail: '',
        tel: '',
        date_debut: '',
        date_fin: '',
        heure_debut: '',
        heure_fin: '',
        type: '',
        lieu: '',
        notes: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        try {
            const response = await fetch('/api/prestations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage('Prestation soumise avec succès ! Elle sera validée par notre équipe.');
                setFormData({
                    nom: '',
                    mail: '',
                    tel: '',
                    date_debut: '',
                    date_fin: '',
                    heure_debut: '',
                    heure_fin: '',
                    type: '',
                    lieu: '',
                    notes: ''
                });
            } else {
                setMessage(`Erreur: ${result.error}`);
            }
        } catch (error) {
            setMessage('Erreur lors de la soumission du formulaire.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className={styles.prestationForm}>
            <div className={styles.container}>
                <h2 className={styles.title}>Demander une Prestation</h2>
                <p className={styles.subtitle}>
                    Remplissez ce formulaire pour demander une prestation. Votre demande sera examinée et validée par notre équipe.
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Informations Client</h3>

                        <div className={styles.formGroup}>
                            <label htmlFor="nom" className={styles.label}>
                                Nom complet <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                id="nom"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                required
                                className={styles.input}
                                placeholder="Votre nom complet"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="mail" className={styles.label}>
                                Email <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="email"
                                id="mail"
                                name="mail"
                                value={formData.mail}
                                onChange={handleChange}
                                required
                                className={styles.input}
                                placeholder="votre.email@exemple.com"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="tel" className={styles.label}>
                                Téléphone
                            </label>
                            <input
                                type="tel"
                                id="tel"
                                name="tel"
                                value={formData.tel}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="06 12 34 56 78"
                            />
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Détails de la Prestation</h3>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="date_debut" className={styles.label}>
                                    Date de début <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="date"
                                    id="date_debut"
                                    name="date_debut"
                                    value={formData.date_debut}
                                    onChange={handleChange}
                                    required
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="date_fin" className={styles.label}>
                                    Date de fin
                                </label>
                                <input
                                    type="date"
                                    id="date_fin"
                                    name="date_fin"
                                    value={formData.date_fin}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="heure_debut" className={styles.label}>
                                    Heure de début
                                </label>
                                <input
                                    type="time"
                                    id="heure_debut"
                                    name="heure_debut"
                                    value={formData.heure_debut}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="heure_fin" className={styles.label}>
                                    Heure de fin
                                </label>
                                <input
                                    type="time"
                                    id="heure_fin"
                                    name="heure_fin"
                                    value={formData.heure_fin}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="type" className={styles.label}>
                                Type de prestation
                            </label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="">Sélectionnez un type</option>
                                <option value="mariage">Mariage</option>
                                <option value="anniversaire">Anniversaire</option>
                                <option value="soiree_privee">Soirée privée</option>
                                <option value="evenement_corporate">Événement corporate</option>
                                <option value="festival">Festival</option>
                                <option value="club">Club</option>
                                <option value="autre">Autre</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="lieu" className={styles.label}>
                                Lieu de la prestation
                            </label>
                            <input
                                type="text"
                                id="lieu"
                                name="lieu"
                                value={formData.lieu}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Adresse ou nom du lieu"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="notes" className={styles.label}>
                                Notes supplémentaires
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className={styles.textarea}
                                rows={4}
                                placeholder="Informations supplémentaires, demandes spéciales, etc."
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`${styles.submitButton} ${isSubmitting ? styles.loading : ''}`}
                    >
                        {isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}
                    </button>

                    {message && (
                        <div className={`${styles.message} ${message.includes('Erreur') ? styles.error : styles.success}`}>
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </section>
    );
}
