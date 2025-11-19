"use client";

import {useState, useEffect} from "react";
import {useSearchParams} from "next/navigation";
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
    const backBtnContent = `\u2b9c précédent`;
    const nextBtnContent = `suivant \u2b9e`;

    // Libellés affichés dans le récapitulatif, avec * pour les champs obligatoires
    const fieldLabels: Record<keyof PrestationFormData, string> = {
        nom: "Nom *",
        mail: "Email *",
        tel: "Téléphone",
        date_debut: "Date de début *",
        date_fin: "Date de fin",
        heure_debut: "Heure début",
        heure_fin: "Heure fin",
        type: "Type",
        lieu: "Lieu",
        notes: "Notes",
    };


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const nextStep = () => {
        if (step === 1) {
            const today = new Date();
            const chosenDate = new Date(formData.date_debut);

            // on compare uniquement les jours (pas l'heure)
            today.setHours(0, 0, 0, 0);
            chosenDate.setHours(0, 0, 0, 0);

            if (chosenDate < today) {
                setMessage("⚠️ La date choisie est déjà passée.");
                return;
            }
        }
        setStep((s) => s + 1);
    };
    const prevStep = () => setStep((s) => s - 1);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setMessage("");

        try {
            const res = await fetch("/api/prestations", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
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
            <button
                className={styles.backPageBtn}
                onClick={() => window.history.back()}
            >
                {"\u21a9"}
            </button>

            <div className={styles.card}>
                <div className={styles.stepIndicator}>
                    <span className={step >= 1 ? styles.active : ""}>1</span>
                    <span className={step >= 2 ? styles.active : ""}>2</span>
                    <span className={step >= 3 ? styles.active : ""}>3</span>
                    <span className={`${styles.recap} ${(step === 4 ? styles.active : "")}`}>✔</span>
                </div>

                {/* STEP 1 */}
                {step === 1 && (
                    <div className={styles.section}>
                        <h3>Détails de la prestation</h3>
                        {message && <p className={styles.message}>{message}</p>}
                        <div className={styles.field}>
                            <label>
                                Date de début <span className={styles.requiredStar}>*</span>
                            </label>
                            <input type="date" name="date_debut" value={formData.date_debut} onChange={handleChange}
                                   required/>
                        </div>

                        {/*<div className={styles.field}>*/}
                        {/*    <label>Date de fin</label>*/}
                        {/*    <input type="date" name="date_fin" value={formData.date_fin} onChange={handleChange} />*/}
                        {/*</div>*/}

                        <div className={styles.fieldRow}>
                            <div className={styles.field}>
                                <label>Heure début</label>
                                <input type="time" name="heure_debut" value={formData.heure_debut}
                                       onChange={handleChange}/>
                            </div>

                            <div className={styles.field}>
                                <label>Heure fin</label>
                                <input type="time" name="heure_fin" value={formData.heure_fin} onChange={handleChange}/>
                            </div>
                        </div>

                        <div className={styles.nav}>
                            <br></br>
                            <button className={styles.btnNext} onClick={nextStep}>{nextBtnContent}</button>
                        </div>
                    </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <div className={styles.section}>
                        <h3>Type & lieu</h3>
                        {message && <p className={styles.message}>{message}</p>}
                        <div className={styles.field}>
                            <label>Type</label>
                            <select name="type" value={formData.type} onChange={handleChange}>
                                <option value="">Sélectionnez</option>
                                <option>mariage</option>
                                <option>anniversaire</option>
                                <option>soiree_privee</option>
                                <option>evenement_corporate</option>
                                <option>festival</option>
                                <option>club</option>
                                <option>autre</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label>Lieu</label>
                            <input name="lieu" value={formData.lieu} onChange={handleChange}/>
                        </div>

                        <div className={styles.field}>
                            <label>Notes</label>
                            <textarea name="notes" value={formData.notes} onChange={handleChange}/>
                        </div>

                        <div className={styles.nav}>
                            {/*<button className={styles.btnBack} onClick={prevStep}>← Retour</button>*/}
                            <button className={styles.btnBack} onClick={prevStep}>{backBtnContent}</button>
                            <button className={styles.btnNext} onClick={nextStep}>{nextBtnContent}</button>
                        </div>
                    </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <div className={styles.section}>
                        <h3>Informations client</h3>
                        {message && <p className={styles.message}>{message}</p>}
                        <div className={styles.field}>
                            <label>
                                Nom <span className={styles.requiredStar}>*</span>
                            </label>
                            <input name="nom" value={formData.nom} onChange={handleChange} required/>
                        </div>

                        <div className={styles.field}>
                            <label>
                                Email <span className={styles.requiredStar}>*</span>
                            </label>
                            <input type="email" name="mail" value={formData.mail} onChange={handleChange} required/>
                        </div>

                        <div className={styles.field}>
                            <label>Téléphone</label>
                            <input name="tel" value={formData.tel} onChange={handleChange}/>
                        </div>

                        <div className={styles.nav}>
                            <button className={styles.btnBack} onClick={prevStep}>{backBtnContent}</button>
                            <button className={styles.btnNext} onClick={nextStep}>{nextBtnContent}</button>
                        </div>
                    </div>
                )}

                {/* STEP 4 - RÉCAP */}
                {step === 4 && (
                    <div className={styles.section}>
                        <h3>Récapitulatif</h3>
                        {message && <p className={styles.message}>{message}</p>}

                        <ul className={styles.recapList}>
                            {Object.entries(formData).map(([k, v]) => {
                                const key = k as keyof PrestationFormData;
                                const label = fieldLabels[key] || k.replace(/_/g, " ");
                                const hasStar = /\*$/.test(label);
                                const baseLabel = label.replace(/\s*\*$/, "");
                                return (
                                    <li key={k}>
                                        <strong>
                                            {baseLabel} {hasStar && (<span className={styles.requiredStar}>*</span>)} :
                                        </strong> {v || "__________"}
                                    </li>
                                );
                            })}
                        </ul>

                        <div className={styles.nav}>
                            <button className={styles.btnBack} onClick={prevStep}>{backBtnContent}</button>
                            <button className={styles.btnConfirm} disabled={isSubmitting} onClick={handleSubmit}>
                                {isSubmitting ? "Envoi..." : "Envoyer"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
