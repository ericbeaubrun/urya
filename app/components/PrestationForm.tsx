"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle, Calendar, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import styles from "./PrestationForm.module.css";
import CalendarPicker from "./CalendarPicker";
import TimePicker from "./TimePicker";
import {ANIMATION_ONCE, EXAMPLE_MAIL, EXAMPLE_NAME, EXAMPLE_PHONE} from "@/app/config";
import {useContent} from "@/app/ContentContext";

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

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

export default function PrestationForm({ initialDate }: { initialDate?: string }) {
    const { prestationForm } = useContent();
    const sectionRef = useRef<HTMLDivElement>(null);
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

    const [step, setStep] = useState(1);
    const [viewMode, setViewMode] = useState<"prestation" | "appointment">("prestation");
    const [appointmentData, setAppointmentData] = useState({
        contact: "",
        name: "",
        availability: "",
        type: "tel" as "tel" | "visio" | "physique"
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [errorFields, setErrorFields] = useState<string[]>([]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState<{ active: boolean, field: "heure_debut" | "heure_fin" | null }>({
        active: false,
        field: null
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

    useEffect(() => {
        const lockScroll = () => {
            document.body.style.setProperty("overflow", "hidden", "important");
            document.documentElement.style.setProperty("overflow", "hidden", "important");
            document.body.style.touchAction = "none";
        };

        const unlockScroll = () => {
            document.body.style.removeProperty("overflow");
            document.documentElement.style.removeProperty("overflow");
            document.body.style.touchAction = "";
        };

        if (showCalendar || showTimePicker.active) {
            lockScroll();
        } else {
            unlockScroll();
        }

        return () => {
            unlockScroll();
        };
    }, [showCalendar, showTimePicker.active]);

    const backBtnContent = (
        <>
            <img src="/arrow-left.svg" alt="" aria-hidden="true" width={18} height={18} />
            <span>{prestationForm.buttons.prev}</span>
        </>
    );

    const nextBtnContent = (
        <>
            <span>{prestationForm.buttons.next}</span>
            <img src="/arrow-right.svg" alt="" aria-hidden="true" width={18} height={18} />
        </>
    );

    const fieldLabels: Record<keyof PrestationFormData, string> = {
        nom: prestationForm.fields.name + " *",
        mail: prestationForm.fields.email + " *",
        tel: prestationForm.fields.phone,
        date_debut: prestationForm.fields.date + " *",
        date_fin: prestationForm.fields.date_fin || "Date de fin",
        heure_debut: prestationForm.fields.timeStart,
        heure_fin: prestationForm.fields.timeEnd,
        type: prestationForm.fields.type,
        lieu: prestationForm.fields.location,
        notes: prestationForm.fields.notes,
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Effacer l'erreur du champ quand l'utilisateur commence à taper
        if (errorFields.includes(name)) {
            setErrorFields(prev => prev.filter(f => f !== name));
        }
    };

    const handleDateSelect = (dateStr: string) => {
        setFormData((prev) => ({
            ...prev,
            date_debut: dateStr,
            date_fin: dateStr,
        }));
        setShowCalendar(false);
        if (errorFields.includes("date_debut")) {
            setErrorFields(prev => prev.filter(f => f !== "date_debut"));
        }
    };

    const handleResetDate = () => {
        setFormData((prev) => ({
            ...prev,
            date_debut: "",
            date_fin: "",
        }));
        setShowCalendar(false);
    };

    const handleResetTime = () => {
        if (showTimePicker.field) {
            const field = showTimePicker.field;
            setFormData(prev => ({ ...prev, [field]: "" }));
            closeTimePicker();
        }
    };

    const handleTimeSelect = (timeStr: string) => {
        if (showTimePicker.field) {
            const field = showTimePicker.field;
            setFormData(prev => ({ ...prev, [field]: timeStr }));
            if (errorFields.includes(field)) {
                setErrorFields(prev => prev.filter(f => f !== field));
            }
        }
    };

    const closeTimePicker = () => {
        setShowTimePicker({ active: false, field: null });
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "Choisir la date...";
        try {
            const date = new Date(dateStr);
            return new Intl.DateTimeFormat('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(date);
        } catch {
            return dateStr;
        }
    };

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

    const ALLOWED_TYPES = [...Object.values(TYPE_LABEL_TO_VALUE), ""];
    const trim = (v: string) => (v ?? "").trim();
    const stripTags = (v: string) => trim(v).replace(/<[^>]*>/g, "");
    const normalizeEmail = (v: string) => stripTags(v).toLowerCase();
    const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    const normalizePhone = (v: string) => {
        const cleaned = stripTags(v).replace(/[^+\d]/g, "");
        return cleaned.replace(/(?!^)[+]/g, "");
    };
    const normalizeType = (v: string) => (ALLOWED_TYPES.includes(v) ? v : "autre");

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
        if (!v) return "";
        const m = v.match(/^(\d{1,2}):(\d{2})/);
        if (!m) return "";
        const h = String(Math.min(23, Number(m[1]))).padStart(2, "0");
        const min = String(Math.min(59, Number(m[2]))).padStart(2, "0");
        return `${h}:${min}`;
    };

    function buildCleanPayload(fd: PrestationFormData) {
        const errors: string[] = [];
        const errorFields: string[] = [];
        const date_debut_clean = toISODate(fd.date_debut);
        const date_fin_clean = toISODate(fd.date_fin);
        const heure_debut_clean = toTime(fd.heure_debut);
        const heure_fin_clean = toTime(fd.heure_fin);

        if (!date_debut_clean) {
            errors.push("La date de début est requise.");
            errorFields.push("date_debut");
        }

        const nom_clean = stripTags(fd.nom);
        const mail_clean = normalizeEmail(fd.mail);
        const tel_clean = normalizePhone(fd.tel);
        const type_clean = normalizeType(stripTags(fd.type));
        const lieu_clean = stripTags(fd.lieu);
        const notes_clean = stripTags(fd.notes);

        if (!nom_clean) {
            errors.push("Le nom est requis.");
            errorFields.push("nom");
        }
        if (!mail_clean) {
            errors.push("L'email est requis.");
            errorFields.push("mail");
        }
        else if (!isValidEmail(mail_clean)) {
            errors.push("Le format de l'email est invalide.");
            errorFields.push("mail");
        }

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
                errorFields.push("date_debut");
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
            errorFields,
        };
    }

    const nextStep = () => {
        setMessage("");
        setErrors([]);
        setErrorFields([]);

        if (step === 1) {
            const { errors, errorFields } = buildCleanPayload(formData);
            const dateErrors = errors.filter((e) => /date/.test(e.toLowerCase()));
            const dateErrorFields = errorFields.filter(f => f === "date_debut");
            if (dateErrors.length) {
                setErrors(dateErrors);
                setErrorFields(dateErrorFields);
                return;
            }
        }
        if (step === 3) {
            const { errors, errorFields } = buildCleanPayload(formData);
            const requiredErrors = errors.filter((e) => /(nom|email)/i.test(e));
            const requiredErrorFields = errorFields.filter(f => /nom|mail/.test(f));
            if (requiredErrors.length) {
                setErrors(requiredErrors);
                setErrorFields(requiredErrorFields);
                return;
            }
        }
        setStep((s) => s + 1);
    };

    const prevStep = () => {
        setMessage("");
        setErrors([]);
        setErrorFields([]);
        setStep((s) => s - 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setMessage("");
        setErrors([]);
        setErrorFields([]);

        try {
            const { clean, errors, errorFields } = buildCleanPayload(formData);
            if (errors.length) {
                setErrors(errors);
                setErrorFields(errorFields);
                return;
            }

            const res = await fetch("/api/prestations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(clean),
            });

            const data = await res.json();
            if (res.ok) {
                setIsSuccess(true);
                setFormData({
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

    const handleAppointmentChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setAppointmentData((prev) => ({ ...prev, [name]: value }));
        if (errorFields.includes(name)) {
            setErrorFields(prev => prev.filter(f => f !== name));
        }
    };

    const handleAppointmentSubmit = async () => {
        setIsSubmitting(true);
        setMessage("");
        setErrors([]);
        setErrorFields([]);

        const errs: string[] = [];
        const errFields: string[] = [];

        if (!appointmentData.name.trim()) {
            errs.push("Le nom ou l'organisme est requis.");
            errFields.push("name");
        }
        if (!appointmentData.contact.trim()) {
            errs.push("Le contact (Email ou Tel) est requis.");
            errFields.push("contact");
        }
        if (!appointmentData.availability.trim()) {
            errs.push("Vos disponibilités sont requises.");
            errFields.push("availability");
        }

        if (errs.length > 0) {
            setErrors(errs);
            setErrorFields(errFields);
            setIsSubmitting(false);
            return;
        }

        try {
            const res = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(appointmentData),
            });

            if (res.ok) {
                setIsSuccess(true);
                setAppointmentData({
                    contact: "",
                    name: "",
                    availability: "",
                    type: "tel"
                });
                return;
            } else {
                const data = await res.json();
                setMessage(data.error || "Une erreur est survenue lors de l'envoi.");
            }
        } catch {
            setMessage("Une erreur serveur est survenue.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
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
        setAppointmentData({
            contact: "",
            name: "",
            availability: "",
            type: "tel"
        });
        setStep(1);
        setIsSuccess(false);
        setMessage("");
        setErrors([]);
        setErrorFields([]);
    };

    const renderSubtitle = (text: string) => {
        const parts = text.split('**');
        return parts.map((part, i) => 
            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
        );
    };

    return (
        <section id="devis" ref={sectionRef} className={styles.wrapper}>
            <motion.div 
                className={styles.container}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: ANIMATION_ONCE, amount: 0.1 }}
            >
                <div className={styles.header}>
                    <motion.h2 className={styles.sectionTitle} variants={itemVariants}>
                        {prestationForm.title.text}
                        <br />
                        <span className={styles.textGradient}>{prestationForm.title.highlight}</span>
                    </motion.h2>
                    <motion.p className={styles.sectionSubtitle} variants={itemVariants}>
                        {viewMode === 'appointment' 
                            ? renderSubtitle(prestationForm.subtitles.appointment)
                            : renderSubtitle(prestationForm.subtitles.prestation)
                        }
                    </motion.p>
                </div>

                <motion.div className={styles.card} variants={itemVariants}>
                    {isSuccess ? (
                        <div className={styles.successScreen}>
                            <CheckCircle size={56} className={styles.successIcon} />
                            <h3 className={styles.successTitle}>{prestationForm.success.title}</h3>
                            <p className={styles.successText}>
                                {viewMode === 'appointment' 
                                    ? prestationForm.success.textAppointment
                                    : prestationForm.success.textPrestation
                                }
                            </p>
                            <button onClick={resetForm} className={styles.btnReset}>
                                {prestationForm.buttons.reset}
                            </button>
                        </div>
                    ) : viewMode === 'appointment' ? (
                        <div className={styles.formSection}>
                            {errors.length > 0 && (
                                <div className={styles.errorContainer}>
                                    {errors.map((err, i) => (
                                        <p key={i} className={styles.errorMessage}>⚠️ {err}</p>
                                    ))}
                                </div>
                            )}
                            {message && <p className={styles.message}>{message}</p>}

                            <div className={`${styles.field} ${errorFields.includes("name") ? styles.fieldHasError : ""}`}>
                                <label className={styles.fieldLabelText}>Nom ou Organisme <span className={styles.requiredStar}>*</span></label>
                                <input name="name" value={appointmentData.name} onChange={handleAppointmentChange} placeholder={EXAMPLE_NAME} className={`${styles.input} ${errorFields.includes("name") ? styles.inputError : ""}`} />
                            </div>

                            <div className={`${styles.field} ${errorFields.includes("contact") ? styles.fieldHasError : ""}`}>
                                <label className={styles.fieldLabelText}>Email ou Telélphone<span className={styles.requiredStar}>*</span></label>
                                <input name="contact" value={appointmentData.contact} onChange={handleAppointmentChange} placeholder={`${EXAMPLE_MAIL} ou 06...`} className={`${styles.input} ${errorFields.includes("contact") ? styles.inputError : ""}`} />
                            </div>

                            <div className={`${styles.field} ${errorFields.includes("availability") ? styles.fieldHasError : ""}`}>
                                <label className={styles.fieldLabelText}>Disponibilités (dates, heures) <span className={styles.requiredStar}>*</span></label>
                                <textarea name="availability" value={appointmentData.availability} onChange={handleAppointmentChange} rows={3} placeholder="Lundi après-midi, Jeudi matin, 12h30..." className={`${styles.textarea} ${errorFields.includes("availability") ? styles.textareaError : ""}`} />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.fieldLabelText}>Rendez-vous souhaité</label>
                                <div className={styles.appointmentTypeGrid}>
                                    {(['tel', 'visio', 'physique'] as const).map((t) => (
                                        <button 
                                            key={t}
                                            type="button"
                                            className={`${styles.typeSelectBtn} ${appointmentData.type === t ? styles.typeSelectBtnActive : ""}`}
                                            onClick={() => setAppointmentData(prev => ({ ...prev, type: t }))}
                                        >
                                            {t.charAt(0).toUpperCase() + t.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.navGroup}>
                                <button className={styles.btnConfirm} disabled={isSubmitting} onClick={handleAppointmentSubmit}>
                                    {isSubmitting ? (
                                        <div className={styles.loaderGroup}>
                                            <div className={styles.spinner} />
                                            <span>Envoi...</span>
                                        </div>
                                    ) : (
                                        prestationForm.buttons.sendAppointment
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={styles.stepIndicator}>
                                {prestationForm.steps.map((s: any, i: number) => (
                                    <div key={i} className={`${styles.stepItem} ${step >= (i + 1) ? styles.active : ""}`}>
                                        <span className={styles.stepNumber}>{s.number}</span>
                                        <span className={styles.stepLabel}>{s.label}</span>
                                    </div>
                                ))}
                            </div>

                            {errors.length > 0 && (
                                <div className={styles.errorContainer}>
                                    {errors.map((err, i) => (
                                        <p key={i} className={styles.errorMessage}>⚠️ {err}</p>
                                    ))}
                                </div>
                            )}
                            {message && <p className={styles.message}>{message}</p>}

                            {step === 1 && (
                                <div className={styles.formSection}>
                                    <div className={`${styles.field} ${errorFields.includes("date_debut") ? styles.fieldHasError : ""}`}>
                                        <label className={styles.fieldLabelText}>
                                            {prestationForm.fields.date} <span className={styles.requiredStar}>*</span>
                                        </label>
                                        <button 
                                            type="button" 
                                            className={`${styles.dateTrigger} ${formData.date_debut ? styles.dateTriggerActive : ""} ${errorFields.includes("date_debut") ? styles.dateTriggerError : ""}`}
                                            onClick={() => setShowCalendar(true)}
                                        >
                                            <span className={!formData.date_debut ? styles.datePlaceholder : ""}>
                                                {formatDate(formData.date_debut)}
                                            </span>
                                            <Calendar size={18} className={styles.dateIcon} />
                                        </button>
                                    </div>

                                    <div className={styles.fieldRow}>
                                        <div className={`${styles.field} ${errorFields.includes("heure_debut") ? styles.fieldHasError : ""}`}>
                                            <label className={styles.fieldLabelText}>{prestationForm.fields.timeStart}</label>
                                            <button 
                                                type="button" 
                                                className={`${styles.dateTrigger} ${formData.heure_debut ? styles.dateTriggerActive : ""} ${errorFields.includes("heure_debut") ? styles.dateTriggerError : ""}`}
                                                onClick={() => setShowTimePicker({ active: true, field: "heure_debut" })}
                                            >
                                                <span className={!formData.heure_debut ? styles.datePlaceholder : ""}>
                                                    {formData.heure_debut || "Choisir l'heure..."}
                                                </span>
                                                <Clock size={18} className={styles.dateIcon} />
                                            </button>
                                        </div>
                                        <div className={`${styles.field} ${errorFields.includes("heure_fin") ? styles.fieldHasError : ""}`}>
                                            <label className={styles.fieldLabelText}>{prestationForm.fields.timeEnd}</label>
                                            <button 
                                                type="button" 
                                                className={`${styles.dateTrigger} ${formData.heure_fin ? styles.dateTriggerActive : ""} ${errorFields.includes("heure_fin") ? styles.dateTriggerError : ""}`}
                                                onClick={() => setShowTimePicker({ active: true, field: "heure_fin" })}
                                            >
                                                <span className={!formData.heure_fin ? styles.datePlaceholder : ""}>
                                                    {formData.heure_fin || "Choisir l'heure..."}
                                                </span>
                                                <Clock size={18} className={styles.dateIcon} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className={styles.navGroup}>
                                        <button className={styles.btnNext} onClick={nextStep}>{nextBtnContent}</button>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className={styles.formSection}>
                                    <div className={`${styles.field} ${errorFields.includes("type") ? styles.fieldHasError : ""}`}>
                                        <label className={styles.fieldLabelText}>{prestationForm.fields.type}</label>
                                        <select name="type" value={formData.type} onChange={handleChange} className={`${styles.select} ${errorFields.includes("type") ? styles.selectError : ""}`}>
                                            <option value="">Sélectionnez...</option>
                                            {Object.entries(TYPE_LABEL_TO_VALUE).map(([label, value]) => (
                                                <option key={value} value={value}>{label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className={`${styles.field} ${errorFields.includes("lieu") ? styles.fieldHasError : ""}`}>
                                        <label className={styles.fieldLabelText}>{prestationForm.fields.location}</label>
                                        <input name="lieu" value={formData.lieu} onChange={handleChange} placeholder={prestationForm.placeholders.location} className={`${styles.input} ${errorFields.includes("lieu") ? styles.inputError : ""}`} />
                                    </div>

                                    <div className={`${styles.field} ${errorFields.includes("notes") ? styles.fieldHasError : ""}`}>
                                        <label className={styles.fieldLabelText}>{prestationForm.fields.notes}</label>
                                        <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} placeholder={prestationForm.placeholders.notes} className={`${styles.textarea} ${errorFields.includes("notes") ? styles.textareaError : ""}`} />
                                    </div>

                                    <div className={styles.navGroup}>
                                        <button className={styles.btnBack} onClick={prevStep}>{backBtnContent}</button>
                                        <button className={styles.btnNext} onClick={nextStep}>{nextBtnContent}</button>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className={styles.formSection}>
                                    <div className={`${styles.field} ${errorFields.includes("nom") ? styles.fieldHasError : ""}`}>
                                        <label className={styles.fieldLabelText}>{prestationForm.fields.name} <span className={styles.requiredStar}>*</span></label>
                                        <input name="nom" value={formData.nom} onChange={handleChange} placeholder={EXAMPLE_NAME} required className={`${styles.input} ${errorFields.includes("nom") ? styles.inputError : ""}`} />
                                    </div>

                                    <div className={`${styles.field} ${errorFields.includes("mail") ? styles.fieldHasError : ""}`}>
                                        <label className={styles.fieldLabelText}>{prestationForm.fields.email} <span className={styles.requiredStar}>*</span></label>
                                        <input type="email" name="mail" value={formData.mail} onChange={handleChange} placeholder={EXAMPLE_MAIL} required className={`${styles.input} ${errorFields.includes("mail") ? styles.inputError : ""}`} />
                                    </div>

                                    <div className={`${styles.field} ${errorFields.includes("tel") ? styles.fieldHasError : ""}`}>
                                        <label className={styles.fieldLabelText}>{prestationForm.fields.phone}</label>
                                        <input name="tel" value={formData.tel} onChange={handleChange} placeholder={EXAMPLE_PHONE} className={`${styles.input} ${errorFields.includes("tel") ? styles.inputError : ""}`} />
                                    </div>

                                    <div className={styles.navGroup}>
                                        <button className={styles.btnBack} onClick={prevStep}>{backBtnContent}</button>
                                        <button className={styles.btnNext} onClick={nextStep}>{nextBtnContent}</button>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className={styles.formSection}>
                                    <div className={styles.recapContainer}>
                                        <h4 className={styles.recapTitle}>Résumé de votre demande</h4>
                                        <ul className={styles.recapList}>
                                            {Object.entries(formData).map(([k, v]) => {
                                                const key = k as keyof PrestationFormData;
                                                const label = fieldLabels[key] || k.replace(/_/g, " ");
                                                const hasStar = /\*$/.test(label);
                                                const baseLabel = label.replace(/\s*\*$/, "");
                                                const rawValue = v || "Non spécifié";

                                                const displayValue = key === "notes"
                                                    ? truncate(String(rawValue))
                                                    : key === "type"
                                                        ? getTypeLabelFromValue(String(rawValue))
                                                        : key === "date_debut"
                                                            ? formatDate(String(rawValue))
                                                            : rawValue;

                                                return (
                                                    <li key={k} className={styles.recapItem}>
                                                        <span className={styles.recapLabel}>
                                                            {baseLabel} {hasStar && (<span className={styles.requiredStar}>*</span>)} :
                                                        </span>
                                                        <span className={styles.recapValue}>{displayValue}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>

                                    <p className={styles.privacyNote}>
                                        {prestationForm.privacyNote}
                                    </p>

                                    <div className={styles.navGroup}>
                                        <button className={styles.btnBack} onClick={prevStep}>{backBtnContent}</button>
                                        <button className={styles.btnConfirm} disabled={isSubmitting} onClick={handleSubmit}>
                                            {isSubmitting ? (
                                                <div className={styles.loaderGroup}>
                                                    <div className={styles.spinner} />
                                                    <span>Envoi...</span>
                                                </div>
                                            ) : (
                                                prestationForm.buttons.send
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </motion.div>
            </motion.div>

            <AnimatePresence>
                {showCalendar && (
                    <div className={styles.modalOverlay} onClick={() => setShowCalendar(false)}>
                        <motion.div 
                            className={styles.modalContent} 
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        >
                            <div className={styles.modalHeader}>
                                <h3 className={styles.modalTitleRecap}>Choisir une date</h3>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button className={styles.btnResetModal} onClick={handleResetDate} title="Réinitialiser">
                                        <img src="/reset.png" alt="Reset" width={20} height={20} />
                                    </button>
                                    <button className={styles.btnCloseModal} onClick={() => setShowCalendar(false)} title="Fermer">
                                        <X size={26} />
                                    </button>
                                </div>
                            </div>
                            <div className={styles.modalBody}>
                                <CalendarPicker 
                                    onDateSelect={handleDateSelect} 
                                    initialDate={formData.date_debut || undefined} 
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showTimePicker.active && (
                    <div className={styles.modalOverlay} onClick={closeTimePicker}>
                        <motion.div 
                            className={styles.modalContent} 
                            style={{ maxWidth: '400px' }}
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        >
                            <div className={styles.modalHeader}>
                                <h3 className={styles.modalTitleRecap}>
                                    Choisir l&apos;heure de {showTimePicker.field === "heure_debut" ? "début" : "fin"}
                                </h3>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button className={styles.btnResetModal} onClick={handleResetTime} title="Réinitialiser">
                                        <img src="/reset.png" alt="Reset" width={20} height={20} />
                                    </button>
                                    <button className={styles.btnCloseModal} onClick={closeTimePicker} title="Fermer">
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>
                            <div className={styles.modalBody}>
                                <TimePicker 
                                    onTimeSelect={(time) => {
                                        handleTimeSelect(time);
                                        closeTimePicker();
                                    }} 
                                    initialTime={formData[showTimePicker.field!] || undefined} 
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
