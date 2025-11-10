"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./PrestationForm.module.css";

interface PrestationFormData {
    nom: string;
    mail: string;
    tel: string;
    date_debut: string;
    date_fin: string;
    heure_debut: string;
    heure_fin: string;
    type: string;
    lieu: string;
    notes: string;
}

export default function PrestationForm() {
    const searchParams = useSearchParams();
    const dateFromCalendar = searchParams.get("date");

    const [formData, setFormData] = useState<PrestationFormData>({
        nom: "",
        mail: "",
        tel: "",
        date_debut: "",
        date_fin: "",
        heure_debut: "",
        heure_fin: "",
        type: "",
        lieu: "",
        notes: "",
    });

    useEffect(() => {
        if (dateFromCalendar) {
            setFormData((prev) => ({
                ...prev,
                date_debut: dateFromCalendar,
                date_fin: dateFromCalendar,
            }));
        }
    }, [dateFromCalendar]);

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep((s) => s + 1);
    const prevStep = () => setStep((s) => s - 1);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setMessage("");

        try {
            const res = await fetch("/api/prestations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            setMessage(res.ok ? "✅ Demande envoyée !" : `Erreur: ${data.error}`);
        } catch {
            setMessage("Erreur serveur.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className={styles.wrapper}>
            <div className={styles.card}>
                <div className={styles.stepIndicator}>
                    <span className={step >= 1 ? styles.active : ""}>1</span>
                    <span className={step >= 2 ? styles.active : ""}>2</span>
                    <span className={step >= 3 ? styles.active : ""}>3</span>
                    <span className={step === 4 ? styles.active : ""}>✔</span>
                </div>

                {/* STEP 1 */}
                {step === 1 && (
                    <div className={styles.section}>
                        <h3>1/3 • Détails de la prestation</h3>

                        <div className={styles.field}>
                            <label>Date de début *</label>
                            <input type="date" name="date_debut" value={formData.date_debut} onChange={handleChange} required />
                        </div>

                        <div className={styles.field}>
                            <label>Date de fin</label>
                            <input type="date" name="date_fin" value={formData.date_fin} onChange={handleChange} />
                        </div>

                        <div className={styles.fieldRow}>
                            <div className={styles.field}>
                                <label>Heure début</label>
                                <input type="time" name="heure_debut" value={formData.heure_debut} onChange={handleChange} />
                            </div>

                            <div className={styles.field}>
                                <label>Heure fin</label>
                                <input type="time" name="heure_fin" value={formData.heure_fin} onChange={handleChange} />
                            </div>
                        </div>

                        <button className={styles.btnNext} onClick={nextStep}>Suivant →</button>
                    </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <div className={styles.section}>
                        <h3>2/3 • Type & lieu</h3>

                        <div className={styles.field}>
                            <label>Type</label>
                            <select name="type" value={formData.type} onChange={handleChange}>
                                <option value="">Sélectionnez</option>
                                <option>mariage</option><option>anniversaire</option>
                                <option>soiree_privee</option><option>evenement_corporate</option>
                                <option>festival</option><option>club</option><option>autre</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label>Lieu</label>
                            <input name="lieu" value={formData.lieu} onChange={handleChange} />
                        </div>

                        <div className={styles.field}>
                            <label>Notes</label>
                            <textarea name="notes" value={formData.notes} onChange={handleChange} />
                        </div>

                        <div className={styles.nav}>
                            <button className={styles.btnBack} onClick={prevStep}>← Retour</button>
                            <button className={styles.btnNext} onClick={nextStep}>Suivant →</button>
                        </div>
                    </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <div className={styles.section}>
                        <h3>3/3 • Informations client</h3>

                        <div className={styles.field}>
                            <label>Nom *</label>
                            <input name="nom" value={formData.nom} onChange={handleChange} required />
                        </div>

                        <div className={styles.field}>
                            <label>Email *</label>
                            <input type="email" name="mail" value={formData.mail} onChange={handleChange} required />
                        </div>

                        <div className={styles.field}>
                            <label>Téléphone</label>
                            <input name="tel" value={formData.tel} onChange={handleChange} />
                        </div>

                        <div className={styles.nav}>
                            <button className={styles.btnBack} onClick={prevStep}>← Retour</button>
                            <button className={styles.btnNext} onClick={nextStep}>Voir récapitulatif →</button>
                        </div>
                    </div>
                )}

                {/* STEP 4 - RÉCAP */}
                {step === 4 && (
                    <div className={styles.section}>
                        <h3>Récapitulatif</h3>

                        <ul className={styles.recapList}>
                            {Object.entries(formData).map(([k, v]) => (
                                <li key={k}><strong>{k.replace("_", " ")} :</strong> {v || "—"}</li>
                            ))}
                        </ul>

                        <div className={styles.nav}>
                            <button className={styles.btnBack} onClick={prevStep}>← Modifier</button>
                            <button className={styles.btnConfirm} disabled={isSubmitting} onClick={handleSubmit}>
                                {isSubmitting ? "Envoi..." : "Confirmer & Envoyer"}
                            </button>
                        </div>

                        {message && <p className={styles.message}>{message}</p>}
                    </div>
                )}
            </div>
        </section>
    );
}



// 'use client';
//
// import {useEffect, useState} from 'react';
// import styles from './PrestationForm.module.css';
// import {useSearchParams} from "next/navigation";
//
// interface PrestationFormData {
//     // Informations client
//     nom: string;
//     mail: string;
//     tel: string;
//
//     // Informations prestation
//     date_debut: string;
//     date_fin: string;
//     heure_debut: string;
//     heure_fin: string;
//     type: string;
//     lieu: string;
//     notes: string;
// }
//
// export default function PrestationForm() {
//
//     const searchParams = useSearchParams();
//     const dateFromCalendar = searchParams.get("date");
//
//     useEffect(() => {
//         if (dateFromCalendar) {
//             setFormData(prev => ({
//                 ...prev,
//                 date_debut: dateFromCalendar,
//                 date_fin: dateFromCalendar
//             }));
//         }
//     }, [dateFromCalendar]);
//
//
//     const [formData, setFormData] = useState<PrestationFormData>({
//         nom: '',
//         mail: '',
//         tel: '',
//         date_debut: '',
//         date_fin: '',
//         heure_debut: '',
//         heure_fin: '',
//         type: '',
//         lieu: '',
//         notes: ''
//     });
//
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [message, setMessage] = useState('');
//
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };
//
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         setMessage('');
//
//         try {
//             const response = await fetch('/api/prestations', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(formData),
//             });
//
//             const result = await response.json();
//
//             if (response.ok) {
//                 setMessage('Prestation soumise avec succès ! Elle sera validée par notre équipe.');
//                 setFormData({
//                     nom: '',
//                     mail: '',
//                     tel: '',
//                     date_debut: '',
//                     date_fin: '',
//                     heure_debut: '',
//                     heure_fin: '',
//                     type: '',
//                     lieu: '',
//                     notes: ''
//                 });
//             } else {
//                 setMessage(`Erreur: ${result.error}`);
//             }
//         } catch (error) {
//             setMessage('Erreur lors de la soumission du formulaire.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };
//
//     return (
//         <section className={styles.prestationForm}>
//             <div className={styles.container}>
//                 <h2 className={styles.title}>Demander une Prestation</h2>
//                 <p className={styles.subtitle}>
//                     Remplissez ce formulaire pour demander une prestation. Votre demande sera examinée et validée par notre équipe.
//                 </p>
//
//                 <form onSubmit={handleSubmit} className={styles.form}>
//                     <div className={styles.section}>
//                         <h3 className={styles.sectionTitle}>Informations Client</h3>
//
//                         <div className={styles.formGroup}>
//                             <label htmlFor="nom" className={styles.label}>
//                                 Nom complet <span className={styles.required}>*</span>
//                             </label>
//                             <input
//                                 type="text"
//                                 id="nom"
//                                 name="nom"
//                                 value={formData.nom}
//                                 onChange={handleChange}
//                                 required
//                                 className={styles.input}
//                                 placeholder="Votre nom complet"
//                             />
//                         </div>
//
//                         <div className={styles.formGroup}>
//                             <label htmlFor="mail" className={styles.label}>
//                                 Email <span className={styles.required}>*</span>
//                             </label>
//                             <input
//                                 type="email"
//                                 id="mail"
//                                 name="mail"
//                                 value={formData.mail}
//                                 onChange={handleChange}
//                                 required
//                                 className={styles.input}
//                                 placeholder="votre.email@exemple.com"
//                             />
//                         </div>
//
//                         <div className={styles.formGroup}>
//                             <label htmlFor="tel" className={styles.label}>
//                                 Téléphone
//                             </label>
//                             <input
//                                 type="tel"
//                                 id="tel"
//                                 name="tel"
//                                 value={formData.tel}
//                                 onChange={handleChange}
//                                 className={styles.input}
//                                 placeholder="06 12 34 56 78"
//                             />
//                         </div>
//                     </div>
//
//                     <div className={styles.section}>
//                         <h3 className={styles.sectionTitle}>Détails de la Prestation</h3>
//
//                         <div className={styles.formRow}>
//                             <div className={styles.formGroup}>
//                                 <label htmlFor="date_debut" className={styles.label}>
//                                     Date de début <span className={styles.required}>*</span>
//                                 </label>
//                                 <input
//                                     type="date"
//                                     id="date_debut"
//                                     name="date_debut"
//                                     value={formData.date_debut}
//                                     onChange={handleChange}
//                                     required
//                                     className={styles.input}
//                                 />
//                             </div>
//
//                             <div className={styles.formGroup}>
//                                 <label htmlFor="date_fin" className={styles.label}>
//                                     Date de fin
//                                 </label>
//                                 <input
//                                     type="date"
//                                     id="date_fin"
//                                     name="date_fin"
//                                     value={formData.date_fin}
//                                     onChange={handleChange}
//                                     className={styles.input}
//                                 />
//                             </div>
//                         </div>
//
//                         <div className={styles.formRow}>
//                             <div className={styles.formGroup}>
//                                 <label htmlFor="heure_debut" className={styles.label}>
//                                     Heure de début
//                                 </label>
//                                 <input
//                                     type="time"
//                                     id="heure_debut"
//                                     name="heure_debut"
//                                     value={formData.heure_debut}
//                                     onChange={handleChange}
//                                     className={styles.input}
//                                 />
//                             </div>
//
//                             <div className={styles.formGroup}>
//                                 <label htmlFor="heure_fin" className={styles.label}>
//                                     Heure de fin
//                                 </label>
//                                 <input
//                                     type="time"
//                                     id="heure_fin"
//                                     name="heure_fin"
//                                     value={formData.heure_fin}
//                                     onChange={handleChange}
//                                     className={styles.input}
//                                 />
//                             </div>
//                         </div>
//
//                         <div className={styles.formGroup}>
//                             <label htmlFor="type" className={styles.label}>
//                                 Type de prestation
//                             </label>
//                             <select
//                                 id="type"
//                                 name="type"
//                                 value={formData.type}
//                                 onChange={handleChange}
//                                 className={styles.select}
//                             >
//                                 <option value="">Sélectionnez un type</option>
//                                 <option value="mariage">Mariage</option>
//                                 <option value="anniversaire">Anniversaire</option>
//                                 <option value="soiree_privee">Soirée privée</option>
//                                 <option value="evenement_corporate">Événement corporate</option>
//                                 <option value="festival">Festival</option>
//                                 <option value="club">Club</option>
//                                 <option value="autre">Autre</option>
//                             </select>
//                         </div>
//
//                         <div className={styles.formGroup}>
//                             <label htmlFor="lieu" className={styles.label}>
//                                 Lieu de la prestation
//                             </label>
//                             <input
//                                 type="text"
//                                 id="lieu"
//                                 name="lieu"
//                                 value={formData.lieu}
//                                 onChange={handleChange}
//                                 className={styles.input}
//                                 placeholder="Adresse ou nom du lieu"
//                             />
//                         </div>
//
//                         <div className={styles.formGroup}>
//                             <label htmlFor="notes" className={styles.label}>
//                                 Notes supplémentaires
//                             </label>
//                             <textarea
//                                 id="notes"
//                                 name="notes"
//                                 value={formData.notes}
//                                 onChange={handleChange}
//                                 className={styles.textarea}
//                                 rows={4}
//                                 placeholder="Informations supplémentaires, demandes spéciales, etc."
//                             />
//                         </div>
//                     </div>
//
//                     <button
//                         type="submit"
//                         disabled={isSubmitting}
//                         className={`${styles.submitButton} ${isSubmitting ? styles.loading : ''}`}
//                     >
//                         {isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}
//                     </button>
//
//                     {message && (
//                         <div className={`${styles.message} ${message.includes('Erreur') ? styles.error : styles.success}`}>
//                             {message}
//                         </div>
//                     )}
//                 </form>
//             </div>
//         </section>
//     );
// }
