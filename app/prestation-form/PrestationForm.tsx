"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
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

export default function PrestationForm({ initialDate }: { initialDate?: string }) {
    const router = useRouter();

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
        if (initialDate) {
            setFormData((prev) => ({
                ...prev,
                date_debut: initialDate,
                date_fin: initialDate,
            }));
        }
    }, [initialDate]);

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

    // ---------- Nettoyage & Validation côté client ----------
    // Dictionnaire: libellé affiché -> valeur envoyée au backend
    const TYPE_LABEL_TO_VALUE: Record<string, string> = {
        "Mariage": "mariage",
        "Anniversaire": "anniversaire",
        "Soirée privée": "soiree_privee",
        "Évènement": "evenement_corporate",
        "Club": "club",
        "Festival": "festival",
        "Concert": "concert",
        "Séminaire": "seminaire",
        "Autre": "autre",
    };

    // Liste des valeurs autorisées (pour normalisation/validation)
    const ALLOWED_TYPES = [...Object.values(TYPE_LABEL_TO_VALUE), ""];

    const trim = (v: string) => (v ?? "").trim();
    const stripTags = (v: string) => trim(v).replace(/<[^>]*>/g, "");
    const normalizeEmail = (v: string) => stripTags(v).toLowerCase();
    const isValidEmail = (v: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    const normalizePhone = (v: string) => {
        const cleaned = stripTags(v).replace(/[^+\d]/g, "");
        return cleaned.replace(/(?!^)[+]/g, "");
    };
    const normalizeType = (v: string) => (ALLOWED_TYPES.includes(v) ? v : "autre");

    // Helper pour récupérer le libellé lisible depuis une valeur backend
    const getTypeLabelFromValue = (value: string) => {
        const entry = Object.entries(TYPE_LABEL_TO_VALUE).find(([, v]) => v === value);
        return entry ? entry[0] : value;
    };

    const toISODate = (v: string) => {
        if (!v) return "";
        const d = new Date(v);
        if (isNaN(d.getTime())) return "";
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    const toTime = (v: string) => {
        // attend HH:MM via input type=time
        if (!v) return "";
        const m = v.match(/^(\d{1,2}):(\d{2})/);
        if (!m) return "";
        const h = String(Math.min(23, Number(m[1]))).padStart(2, "0");
        const min = String(Math.min(59, Number(m[2]))).padStart(2, "0");
        return `${h}:${min}`;
    };

    function buildCleanPayload(fd: PrestationFormData) {
        const errors: string[] = [];

        const date_debut_clean = toISODate(fd.date_debut);
        const date_fin_clean = toISODate(fd.date_fin);
        const heure_debut_clean = toTime(fd.heure_debut);
        const heure_fin_clean = toTime(fd.heure_fin);

        // Vérifs de base
        if (!date_debut_clean) errors.push("La date de début est requise et doit être valide.");

        const nom_clean = stripTags(fd.nom);
        const mail_clean = normalizeEmail(fd.mail);
        const tel_clean = normalizePhone(fd.tel);
        const type_clean = normalizeType(stripTags(fd.type));
        const lieu_clean = stripTags(fd.lieu);
        const notes_clean = stripTags(fd.notes);

        if (!nom_clean) errors.push("Le nom est requis.");
        if (!mail_clean) errors.push("L'email est requis.");
        else if (!isValidEmail(mail_clean)) errors.push("Le format de l'email est invalide.");

        // Cohérence temporelle: si les deux heures sont fournies
        let final_date_fin = date_fin_clean;
        if (date_debut_clean && heure_debut_clean && heure_fin_clean) {
            const start = new Date(`${date_debut_clean}T${heure_debut_clean}:00`);
            const endBase = new Date(`${date_debut_clean}T${heure_fin_clean}:00`);
            const end = endBase <= start ? new Date(endBase.getTime() + 24 * 60 * 60 * 1000) : endBase;
            const yyyy = end.getFullYear();
            const mm = String(end.getMonth() + 1).padStart(2, "0");
            const dd = String(end.getDate()).padStart(2, "0");
            final_date_fin = `${yyyy}-${mm}-${dd}`;
        }

        if (date_debut_clean) {
            const today = new Date();
            const chosenDate = new Date(date_debut_clean);
            today.setHours(0, 0, 0, 0);
            chosenDate.setHours(0, 0, 0, 0);
            if (chosenDate < today) {
                errors.push("La date choisie est déjà passée.");
            }
        }

        return {
            clean: {
                nom: nom_clean,
                mail: mail_clean,
                tel: tel_clean,
                date_debut: date_debut_clean,
                date_fin: final_date_fin,
                heure_debut: heure_debut_clean,
                heure_fin: heure_fin_clean,
                type: type_clean,
                lieu: lieu_clean,
                notes: notes_clean,
            } as PrestationFormData,
            errors,
        };
    }

    const nextStep = () => {
        setMessage("");
        if (step === 1) {
            const {errors} = buildCleanPayload(formData);
            const dateErrors = errors.filter((e) =>
                /date/.test(e.toLowerCase())
            );
            if (dateErrors.length) {
                setMessage(`⚠️ ${dateErrors.join(" \n")}`);
                return;
            }
        }
        if (step === 3) {
            const {errors} = buildCleanPayload(formData);
            const requiredErrors = errors.filter((e) =>
                /(nom|email)/i.test(e)
            );
            if (requiredErrors.length) {
                setMessage(`⚠️ ${requiredErrors.join(" \n")}`);
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
            const {clean, errors} = buildCleanPayload(formData);
            if (errors.length) {
                setMessage(`Veuillez corriger les erreurs avant l'envoi:\n- ${errors.join("\n- ")}`);
                return;
            }

            const res = await fetch("/api/prestations", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(clean),
            });

            const data = await res.json();
            if (res.ok) {
                router.push("/merci");
                return;
            } else {
                setMessage(`Erreur: ${data.error}`);
            }
        } catch {
            setMessage("Erreur serveur.");
        } finally {
            setIsSubmitting(false);
        }
    };

    function truncate(text: string, max: number = 200) {
        if (!text) return "";
        const clean = String(text);
        return clean.length > max ? `${clean.slice(0, max)}…` : clean;
    }

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
                            <label>Quelle type de prestation souhaitez-vous ?</label>
                            <select name="type" value={formData.type} onChange={handleChange}>
                                <option value="">Sélectionnez</option>
                                {Object.entries(TYPE_LABEL_TO_VALUE).map(([label, value]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label>Où se déroulera-t-elle ?</label>
                            <input name="lieu" value={formData.lieu} onChange={handleChange}/>
                        </div>

                        <div className={styles.field}>
                            <label>Avez-vous des précisions à ajouter ?</label>
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
                                const rawValue = v || "__________";
                                const displayValue = key === "notes"
                                    ? truncate(String(rawValue))
                                    : key === "type"
                                        ? getTypeLabelFromValue(String(rawValue))
                                        : rawValue;
                                const titleAttr = key === "notes" && v ? String(v) : undefined;
                                return (
                                    <li key={k} title={titleAttr}>
                                        <strong>
                                            {baseLabel} {hasStar && (<span className={styles.requiredStar}>*</span>)} :
                                        </strong> {displayValue}
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
