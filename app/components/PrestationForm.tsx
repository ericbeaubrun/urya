"use client";

import {useState, useEffect, useRef} from "react";
import Link from "next/link";
import {CheckCircle, Calendar, X, Clock} from 'lucide-react';
import {motion} from "framer-motion";
import styles from "./PrestationForm.module.css";
import CalendarPicker from "./CalendarPicker";
import TimePicker from "./TimePicker";
import {ANIMATION_ONCE, EXAMPLE_MAIL, EXAMPLE_NAME, EXAMPLE_PHONE} from "@/app/config";
import {useContent} from "@/app/ContentContext";
import {PRESTATION_TYPES, PRESTATION_TYPE_LABELS, type PrestationType} from "@/lib/prestation-types";
import {track} from "@/lib/analytics";
import {
    BOOKING_FORM_ID,
    BOOKING_REVEAL_EVENT,
    BOOKING_SECTION_ID,
    scrollToBooking,
} from "@/lib/booking-scroll";

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

// Cette section est la cible de tous les boutons « Réserver » : le visiteur y
// arrive en ayant déjà décidé. L'apparition est donc nettement plus rapide
// qu'ailleurs sur la page — l'attente cumulée (défilement + délai + fondu)
// donnait l'impression que le formulaire mettait des secondes à venir.
const containerVariants = {
    hidden: {opacity: 0},
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.06
        }
    }
};

const itemVariants = {
    hidden: {opacity: 0, y: 16},
    visible: {
        opacity: 1,
        y: 0,
        transition: {duration: 0.35, ease: "easeOut"}
    }
};

/**
 * Variantes utilisées quand le visiteur arrive par un bouton « Réserver ».
 *
 * Les deux états y sont identiques et sans durée : le formulaire est déjà
 * entièrement affiché quand le défilement s'achève. Le fondu d'entrée a du sens
 * pour qui découvre la page en descendant ; il n'en a aucun pour qui vient de
 * demander à voir ce formulaire, à qui il ne montre qu'une carte vide.
 */
const INSTANT_VARIANTS = {
    hidden: {opacity: 1, y: 0},
    visible: {opacity: 1, y: 0, transition: {duration: 0}}
};

/**
 * Découpage réel du parcours. L'ordre appartient au code : il détermine la
 * validation, le suivi d'entonnoir et surtout l'endroit où le visiteur est
 * arrêté. Le contenu éditorial ne fournit que les libellés.
 *
 * « Prestation » passe volontairement en premier : aucun de ses champs n'est
 * obligatoire, là où la date — seule donnée réellement engageante — bloquait
 * net quiconque n'en avait pas encore. Le récapitulatif, lui, n'est plus une
 * étape : trois écrans plus bas, le visiteur n'a rien oublié de ce qu'il vient
 * de saisir, et l'écran supplémentaire ne coûtait que des abandons.
 */
const STEP_LABELS = ["Prestation", "Date & horaires", "Vos coordonnées"] as const;
const TOTAL_STEPS = STEP_LABELS.length;

/** Cible de `aria-describedby` pour les champs refusés par la validation. */
const ERROR_ID = "prestation-form-errors";

/**
 * Le récapitulatif résume la demande, pas les coordonnées : celles-ci sont
 * saisies dans le même écran, juste au-dessus de lui.
 */
const RECAP_EXCLUDED: ReadonlySet<string> = new Set(["nom", "mail", "tel"]);

export default function PrestationForm() {
    const {prestationForm} = useContent();
    const sectionRef = useRef<HTMLDivElement>(null);
    const errorRef = useRef<HTMLDivElement>(null);
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [errorFields, setErrorFields] = useState<string[]>([]);
    // Déclencheur du recadrage sur le premier champ fautif. C'est le compteur,
    // et non le tableau d'erreurs, qui porte l'information : deux échecs
    // identiques d'affilée produisent des tableaux égaux, sur lesquels un effet
    // ne se rejouerait pas — le visiteur resterait alors sans retour visible.
    const [errorFocus, setErrorFocus] = useState<{ seq: number; field?: string }>({seq: 0});
    // Arrivée demandée par un bouton « Réserver » : plus de fondu d'entrée.
    const [instant, setInstant] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState<{
        active: boolean,
        field: "heure_debut" | "heure_fin" | null
    }>({
        active: false,
        field: null
    });

    // Mesure d'audience. Ces trois références portent un état qui ne doit
    // jamais provoquer de rendu : elles ne servent qu'à ne pas compter deux
    // fois le même jalon.
    const trackedViewRef = useRef(false);
    const trackedStartRef = useRef(false);
    const trackedExitRef = useRef(false);
    // L'étape et le succès sont lus depuis un écouteur d'événement posé une
    // seule fois : sans copie dans une référence, il ne verrait que leurs
    // valeurs au premier rendu.
    const stepRef = useRef(step);
    const successRef = useRef(isSuccess);
    stepRef.current = step;
    successRef.current = isSuccess;

    /** Marque le début de saisie, au premier champ renseigné quel qu'il soit. */
    const trackFormStart = () => {
        if (trackedStartRef.current) return;
        trackedStartRef.current = true;
        track("form_step", {step: "1"});
    };

    /**
     * Signale les champs refusés par la validation.
     *
     * Seul le NOM du champ part : sa valeur est une saisie du visiteur, donc
     * potentiellement une donnée personnelle, qui n'a rien à faire dans une
     * mesure d'audience anonyme.
     */
    const trackErrorFields = (fields: string[]) => {
        for (const field of fields) {
            track("form_error", {field});
        }
    };

    /** Affiche les erreurs, les consigne, et demande le recadrage. */
    const reportErrors = (nextErrors: string[], nextFields: string[]) => {
        setErrors(nextErrors);
        setErrorFields(nextFields);
        trackErrorFields(nextFields);
        setErrorFocus((prev) => ({seq: prev.seq + 1, field: nextFields[0]}));
    };

    useEffect(() => {
        const reveal = () => setInstant(true);
        window.addEventListener(BOOKING_REVEAL_EVENT, reveal);
        return () => window.removeEventListener(BOOKING_REVEAL_EVENT, reveal);
    }, []);

    // Arrivée par l'ancre `/#devis` (pages d'atterrissage, données structurées,
    // lien partagé). Le navigateur, lui, cale le HAUT DE LA SECTION en haut de
    // la fenêtre : le titre passe sous l'en-tête fixe et le formulaire reste
    // hors champ. On refait le cadrage une fois la mise en page posée.
    useEffect(() => {
        if (window.location.hash !== `#${BOOKING_SECTION_ID}`) return;

        const frame = requestAnimationFrame(() => scrollToBooking());
        return () => cancelAnimationFrame(frame);
    }, []);

    // Sommet de l'entonnoir : le formulaire est réellement arrivé sous les yeux
    // du visiteur, ce qui est une base de comparaison bien plus honnête que le
    // nombre de pages vues.
    useEffect(() => {
        const element = sectionRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries.some((entry) => entry.isIntersecting) || trackedViewRef.current) return;
                trackedViewRef.current = true;
                track("form_view");
                observer.disconnect();
            },
            {threshold: 0.25}
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    // Abandon : formulaire entamé, jamais envoyé, et le visiteur s'en va.
    //
    // L'écoute porte sur `visibilitychange` et non `beforeunload` : ce dernier
    // n'est pas déclenché de façon fiable sur mobile, où l'onglet est le plus
    // souvent mis en arrière-plan puis détruit sans préavis. C'est précisément
    // le cas majoritaire ici.
    useEffect(() => {
        const onHidden = () => {
            if (document.visibilityState !== "hidden") return;
            if (successRef.current || !trackedStartRef.current || trackedExitRef.current) return;

            trackedExitRef.current = true;
            track("form_abandon", {step: String(stepRef.current)});
        };

        document.addEventListener("visibilitychange", onHidden);
        return () => document.removeEventListener("visibilitychange", onHidden);
    }, []);

    // Le message d'erreur s'affiche en tête de carte alors que les boutons de
    // navigation sont en pied : sur mobile, un « Suivant » refusé ne produisait
    // aucun changement visible, le message restant hors champ au-dessus.
    useEffect(() => {
        if (!errorFocus.seq) return;

        errorRef.current?.scrollIntoView({behavior: "smooth", block: "center"});
        if (!errorFocus.field) return;

        // Le sélecteur couvre les deux natures de champ : les saisies portent un
        // `name`, les déclencheurs de date et d'heure sont des boutons qui n'en
        // ont pas et s'annoncent par `data-field`.
        const target = sectionRef.current?.querySelector<HTMLElement>(
            `[name="${errorFocus.field}"], [data-field="${errorFocus.field}"]`
        );
        // Le recadrage vient d'être demandé sur le message : laisser le focus en
        // programmer un second les ferait se contredire.
        target?.focus({preventScroll: true});
    }, [errorFocus]);

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

    if (!prestationForm) return null;

    // Les libellés éditoriaux ne sont repris que s'ils correspondent au nombre
    // d'étapes réelles : un contenu resté sur l'ancien découpage en quatre
    // écrans serait sinon appliqué de travers, chaque libellé décrivant l'étape
    // voisine. Voir la note d'administration dans le README du contenu.
    const contentSteps = Array.isArray(prestationForm.steps) ? prestationForm.steps : [];
    const stepLabels = STEP_LABELS.map((fallback, i) =>
        contentSteps.length === TOTAL_STEPS ? contentSteps[i]?.label || fallback : fallback
    );

    const backBtnContent = (
        <>
            <img src="/arrow-left.svg" alt="" aria-hidden="true" width={18} height={18}/>
            <span>{prestationForm.buttons?.prev}</span>
        </>
    );

    const nextBtnContent = (
        <>
            <span>{prestationForm.buttons?.next}</span>
            <img src="/arrow-right.svg" alt="" aria-hidden="true" width={18} height={18}/>
        </>
    );

    // Libellés du seul récapitulatif : les champs obligatoires y sont
    // forcément renseignés, l'astérisque n'y a donc plus rien à signaler.
    const fieldLabels: Record<keyof PrestationFormData, string> = {
        nom: prestationForm.fields?.name || "Nom",
        mail: prestationForm.fields?.email || "Email",
        tel: prestationForm.fields?.phone || "Téléphone",
        date_debut: prestationForm.fields?.date || "Date",
        date_fin: prestationForm.fields?.date_fin || "Date de fin",
        heure_debut: prestationForm.fields?.timeStart || "Heure début",
        heure_fin: prestationForm.fields?.timeEnd || "Heure fin",
        type: prestationForm.fields?.type || "Type",
        lieu: prestationForm.fields?.location || "Lieu",
        notes: prestationForm.fields?.notes || "Notes",
    };

    /**
     * Lignes du récapitulatif : seulement ce qui a été renseigné. Un
     * récapitulatif majoritairement composé de « Non spécifié » donne, juste
     * avant le bouton d'envoi, l'impression d'une demande bâclée.
     */
    const recapEntries = Object.entries(formData).filter(([k, v]) => {
        if (!v || RECAP_EXCLUDED.has(k)) return false;
        // `date_fin` est recopiée de `date_debut` à la sélection : elle n'apprend
        // quelque chose que lorsque la soirée passe minuit.
        if (k === "date_fin") return v !== formData.date_debut;
        return true;
    });

    /** Attributs d'accessibilité liant un champ refusé à la liste d'erreurs. */
    const fieldA11y = (name: string) =>
        errorFields.includes(name)
            ? {"aria-invalid": true as const, "aria-describedby": ERROR_ID}
            : {};

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const {name, value} = e.target;
        trackFormStart();
        setFormData((prev) => ({...prev, [name]: value}));
        // Effacer l'erreur du champ quand l'utilisateur commence à taper
        if (errorFields.includes(name)) {
            setErrorFields(prev => prev.filter(f => f !== name));
        }
    };

    const handleDateSelect = (dateStr: string) => {
        trackFormStart();
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
            setFormData(prev => ({...prev, [field]: ""}));
            closeTimePicker();
        }
    };

    const handleTimeSelect = (timeStr: string) => {
        trackFormStart();
        if (showTimePicker.field) {
            const field = showTimePicker.field;
            setFormData(prev => ({...prev, [field]: timeStr}));
            if (errorFields.includes(field)) {
                setErrorFields(prev => prev.filter(f => f !== field));
            }
        }
    };

    const closeTimePicker = () => {
        setShowTimePicker({active: false, field: null});
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

    const ALLOWED_TYPES: string[] = [...PRESTATION_TYPES, ""];
    const trim = (v: string) => (v ?? "").trim();
    const stripTags = (v: string) => trim(v).replace(/<[^>]*>/g, "");
    const normalizeEmail = (v: string) => stripTags(v).toLowerCase();
    const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    const normalizePhone = (v: string) => {
        const cleaned = stripTags(v).replace(/[^+\d]/g, "");
        return cleaned.replace(/(?!^)[+]/g, "");
    };
    const normalizeType = (v: string) => (ALLOWED_TYPES.includes(v) ? v : "autre");

    const getTypeLabelFromValue = (value: string) =>
        PRESTATION_TYPE_LABELS[value as PrestationType] ?? value;

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
        } else if (!isValidEmail(mail_clean)) {
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

    /**
     * Erreurs propres à une étape.
     *
     * L'étape 1 ne comporte que des champs facultatifs : elle laisse toujours
     * passer. C'est tout l'objet du nouvel ordre.
     */
    const validateStep = (current: number) => {
        const {errors, errorFields} = buildCleanPayload(formData);

        if (current === 2) {
            return {
                errors: errors.filter((e) => /date/i.test(e)),
                errorFields: errorFields.filter((f) => f === "date_debut"),
            };
        }

        return {errors: [], errorFields: []};
    };

    const nextStep = () => {
        setMessage("");
        setErrors([]);
        setErrorFields([]);

        const {errors, errorFields} = validateStep(step);
        if (errors.length) {
            reportErrors(errors, errorFields);
            return;
        }

        // L'étape franchie est la suivante : c'est elle que l'entonnoir compte.
        // L'étape 1 est marquée à la première saisie, pas ici.
        track("form_step", {step: String(step + 1)});
        setStep((s) => s + 1);
    };

    /**
     * Point d'entrée unique de chaque étape, branché sur `submit` : le clic sur
     * le bouton et la touche Entrée empruntent ainsi le même chemin.
     */
    const handleStepSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step === TOTAL_STEPS) {
            void handleSubmit();
            return;
        }
        nextStep();
    };

    /** Un second clic sur la pastille active repasse le type à « non précisé ». */
    const handleTypeSelect = (value: string) => {
        trackFormStart();
        setFormData((prev) => ({...prev, type: prev.type === value ? "" : value}));
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
            const {clean, errors, errorFields} = buildCleanPayload(formData);
            if (errors.length) {
                reportErrors(errors, errorFields);
                return;
            }

            const res = await fetch("/api/prestations", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(clean),
            });

            const data = await res.json();
            if (res.ok) {
                // Le type de prestation est une catégorie fermée
                // (`PRESTATION_TYPES`), pas une saisie libre : le consigner ne
                // rend personne identifiable.
                track("booking_submit", {type: clean.type || "non précisé"});
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
        setStep(1);
        setIsSuccess(false);
        setMessage("");
        setErrors([]);
        setErrorFields([]);
    };

    const renderSubtitle = (text?: string) => {
        if (!text) return "";
        const parts = text.split('**');
        return parts.map((part, i) =>
            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
        );
    };

    const container = instant ? INSTANT_VARIANTS : containerVariants;
    const item = instant ? INSTANT_VARIANTS : itemVariants;

    return (
        <section id={BOOKING_SECTION_ID} ref={sectionRef} className={styles.wrapper}>
            <motion.div
                className={styles.container}
                variants={container}
                initial="hidden"
                animate={instant ? "visible" : undefined}
                whileInView="visible"
                viewport={{once: ANIMATION_ONCE, amount: 0.1}}
            >
                <div className={styles.header}>
                    <motion.h2 className={styles.sectionTitle} variants={item}>
                        {prestationForm.title?.text}{' '}
                        <span className={styles.textGradient}>{prestationForm.title?.highlight}</span>
                    </motion.h2>
                    <motion.p className={styles.sectionSubtitle} variants={item}>
                        {renderSubtitle(prestationForm.subtitles?.prestation)}
                    </motion.p>
                </div>

                <motion.div id={BOOKING_FORM_ID} className={styles.card} variants={item}>
                    {isSuccess ? (
                        <div className={styles.successScreen}>
                            <CheckCircle size={56} className={styles.successIcon}/>
                            <h3 className={styles.successTitle}>{prestationForm.success?.title}</h3>
                            <p className={styles.successText}>
                                {prestationForm.success?.textPrestation}
                            </p>
                            <button onClick={resetForm} className={styles.btnReset}>
                                {prestationForm.buttons?.reset}
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className={styles.stepIndicator}>
                                {
                                    stepLabels.map((label, i) => (
                                        <div key={i}
                                             className={`${styles.stepItem} ${step >= (i + 1) ? styles.active : ""}`}>
                                            <span className={styles.stepNumber}>{i + 1}</span>
                                            <span className={styles.stepLabel}>{label}</span>
                                        </div>
                                    ))}
                            </div>

                            {errors.length > 0 && (
                                <div className={styles.errorContainer} id={ERROR_ID} ref={errorRef} role="alert">
                                    {errors.map((err, i) => (
                                        <p key={i} className={styles.errorMessage}>⚠️ {err}</p>
                                    ))}
                                </div>
                            )}
                            {message && <p className={styles.message} role="alert">{message}</p>}

                            {/* Étape 1 — la prestation. Aucun champ obligatoire :
                                le visiteur avance sans avoir à s'engager. */}
                            {step === 1 && (
                                <form className={styles.formSection} onSubmit={handleStepSubmit} noValidate>
                                    <div className={styles.field}>
                                        <label className={styles.fieldLabelText} id="prestation-type-label">
                                            {prestationForm.fields?.type}
                                        </label>
                                        {/* Deux commandes pour un même état, départagées par
                                            la largeur de fenêtre (la bascule est dans la
                                            feuille de styles : une media query, pas un
                                            `matchMedia`, pour que le rendu serveur et le
                                            rendu client restent identiques).

                                            Les pastilles montrent les neuf options d'un
                                            coup et se prennent d'un pouce, mais sur un
                                            téléphone elles s'étalent sur cinq rangées : près
                                            de 300 px pour un champ facultatif, qui
                                            repoussaient hors de l'écran la date et les
                                            coordonnées — les deux seules choses réellement
                                            demandées. Le sélecteur natif rend la même liste
                                            en une ligne. */}
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            aria-labelledby="prestation-type-label"
                                            className={`${styles.select} ${styles.typeSelect}`}
                                        >
                                            <option value="">Choisir un type...</option>
                                            {PRESTATION_TYPES.map((value) => (
                                                <option key={value} value={value}>
                                                    {PRESTATION_TYPE_LABELS[value]}
                                                </option>
                                            ))}
                                        </select>
                                        <div className={styles.typeGrid} role="group"
                                             aria-labelledby="prestation-type-label">
                                            {PRESTATION_TYPES.map((value) => (
                                                <button
                                                    key={value}
                                                    type="button"
                                                    aria-pressed={formData.type === value}
                                                    className={`${styles.typeSelectBtn} ${formData.type === value ? styles.typeSelectBtnActive : ""}`}
                                                    onClick={() => handleTypeSelect(value)}
                                                >
                                                    {PRESTATION_TYPE_LABELS[value]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={styles.field}>
                                        <label
                                            className={styles.fieldLabelText}>{prestationForm.fields?.location}</label>
                                        <input name="lieu" value={formData.lieu} onChange={handleChange}
                                               placeholder={prestationForm.placeholders?.location}
                                               className={styles.input}/>
                                    </div>

                                    <div className={styles.field}>
                                        <label className={styles.fieldLabelText}>{prestationForm.fields?.notes}</label>
                                        <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4}
                                                  placeholder={prestationForm.placeholders?.notes}
                                                  className={styles.textarea}/>
                                    </div>

                                    <div className={styles.navGroup}>
                                        <button type="submit" className={styles.btnNext}>{nextBtnContent}</button>
                                    </div>
                                </form>
                            )}

                            {/* Étape 2 — la date, seule donnée réellement obligatoire. */}
                            {step === 2 && (
                                <form className={styles.formSection} onSubmit={handleStepSubmit} noValidate>
                                    <div
                                        className={`${styles.field} ${errorFields.includes("date_debut") ? styles.fieldHasError : ""}`}>
                                        <label className={styles.fieldLabelText}>
                                            {prestationForm.fields?.date} <span className={styles.requiredStar}>*</span>
                                        </label>
                                        <button
                                            type="button"
                                            data-field="date_debut"
                                            {...fieldA11y("date_debut")}
                                            className={`${styles.dateTrigger} ${formData.date_debut ? styles.dateTriggerActive : ""} ${errorFields.includes("date_debut") ? styles.dateTriggerError : ""}`}
                                            onClick={() => setShowCalendar(true)}
                                        >
                                            <span className={!formData.date_debut ? styles.datePlaceholder : ""}>
                                                {formatDate(formData.date_debut)}
                                            </span>
                                            <Calendar size={18} className={styles.dateIcon}/>
                                        </button>
                                    </div>

                                    <div className={styles.fieldRow}>
                                        <div
                                            className={`${styles.field} ${errorFields.includes("heure_debut") ? styles.fieldHasError : ""}`}>
                                            <label
                                                className={styles.fieldLabelText}>{prestationForm.fields?.timeStart}</label>
                                            <button
                                                type="button"
                                                data-field="heure_debut"
                                                className={`${styles.dateTrigger} ${formData.heure_debut ? styles.dateTriggerActive : ""} ${errorFields.includes("heure_debut") ? styles.dateTriggerError : ""}`}
                                                onClick={() => setShowTimePicker({active: true, field: "heure_debut"})}
                                            >
                                                <span className={!formData.heure_debut ? styles.datePlaceholder : ""}>
                                                    {formData.heure_debut || "Choisir l'heure..."}
                                                </span>
                                                <Clock size={18} className={styles.dateIcon}/>
                                            </button>
                                        </div>
                                        <div
                                            className={`${styles.field} ${errorFields.includes("heure_fin") ? styles.fieldHasError : ""}`}>
                                            <label
                                                className={styles.fieldLabelText}>{prestationForm.fields?.timeEnd}</label>
                                            <button
                                                type="button"
                                                data-field="heure_fin"
                                                className={`${styles.dateTrigger} ${formData.heure_fin ? styles.dateTriggerActive : ""} ${errorFields.includes("heure_fin") ? styles.dateTriggerError : ""}`}
                                                onClick={() => setShowTimePicker({active: true, field: "heure_fin"})}
                                            >
                                                <span className={!formData.heure_fin ? styles.datePlaceholder : ""}>
                                                    {formData.heure_fin || "Choisir l'heure..."}
                                                </span>
                                                <Clock size={18} className={styles.dateIcon}/>
                                            </button>
                                        </div>
                                    </div>

                                    <div className={styles.navGroup}>
                                        <button type="button" className={styles.btnBack}
                                                onClick={prevStep}>{backBtnContent}</button>
                                        <button type="submit" className={styles.btnNext}>{nextBtnContent}</button>
                                    </div>
                                </form>
                            )}

                            {/* Étape 3 — coordonnées et envoi. Le récapitulatif y est
                                intégré : il rappelle la demande pendant que le visiteur
                                saisit ses coordonnées, au lieu de lui coûter un écran. */}
                            {step === 3 && (
                                <form className={styles.formSection} onSubmit={handleStepSubmit} noValidate>
                                    <div
                                        className={`${styles.field} ${errorFields.includes("nom") ? styles.fieldHasError : ""}`}>
                                        <label className={styles.fieldLabelText}>{prestationForm.fields?.name} <span
                                            className={styles.requiredStar}>*</span></label>
                                        <input name="nom" value={formData.nom} onChange={handleChange}
                                               placeholder={EXAMPLE_NAME} required
                                               autoComplete="name" {...fieldA11y("nom")}
                                               className={`${styles.input} ${errorFields.includes("nom") ? styles.inputError : ""}`}/>
                                    </div>

                                    <div
                                        className={`${styles.field} ${errorFields.includes("mail") ? styles.fieldHasError : ""}`}>
                                        <label className={styles.fieldLabelText}>{prestationForm.fields?.email} <span
                                            className={styles.requiredStar}>*</span></label>
                                        <input type="email" name="mail" value={formData.mail} onChange={handleChange}
                                               placeholder={EXAMPLE_MAIL} required
                                               autoComplete="email" inputMode="email" {...fieldA11y("mail")}
                                               className={`${styles.input} ${errorFields.includes("mail") ? styles.inputError : ""}`}/>
                                    </div>

                                    <div
                                        className={`${styles.field} ${errorFields.includes("tel") ? styles.fieldHasError : ""}`}>
                                        <label className={styles.fieldLabelText}>{prestationForm.fields?.phone}</label>
                                        {/* `type="tel"` ouvre le pavé numérique sur mobile ; sans lui,
                                            le visiteur compose son numéro au clavier alphabétique. */}
                                        <input type="tel" name="tel" value={formData.tel} onChange={handleChange}
                                               placeholder={EXAMPLE_PHONE}
                                               autoComplete="tel" inputMode="tel" {...fieldA11y("tel")}
                                               className={`${styles.input} ${errorFields.includes("tel") ? styles.inputError : ""}`}/>
                                    </div>

                                    {recapEntries.length > 0 && (
                                        <div className={styles.recapContainer}>
                                            <h4 className={styles.recapTitle}>Résumé de votre demande</h4>
                                            <ul className={styles.recapList}>
                                                {recapEntries.map(([k, v]) => {
                                                    const key = k as keyof PrestationFormData;
                                                    const label = fieldLabels[key] || k.replace(/_/g, " ");

                                                    const displayValue = key === "notes"
                                                        ? truncate(String(v))
                                                        : key === "type"
                                                            ? getTypeLabelFromValue(String(v))
                                                            : key === "date_debut" || key === "date_fin"
                                                                ? formatDate(String(v))
                                                                : v;

                                                    return (
                                                        <li key={k} className={styles.recapItem}>
                                                            <span className={styles.recapLabel}>{label} :</span>
                                                            <span className={styles.recapValue}>{displayValue}</span>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    )}

                                    <p className={styles.privacyNote}>
                                        {prestationForm.privacyNote}{' '}
                                        <Link href="/politique-de-confidentialite" target="_blank">
                                            Politique de confidentialité
                                        </Link>.
                                    </p>

                                    <div className={styles.navGroup}>
                                        <button type="button" className={styles.btnBack}
                                                onClick={prevStep}>{backBtnContent}</button>
                                        <button type="submit" className={styles.btnConfirm} disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <div className={styles.loaderGroup}>
                                                    <div className={styles.spinner}/>
                                                    <span>Envoi...</span>
                                                </div>
                                            ) : (
                                                prestationForm.buttons?.send
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </>
                    )}
                </motion.div>
            </motion.div>

            {/*
              * Ces deux voiles sont montés sans `AnimatePresence`.
              *
              * `framer-motion@11` ne démonte plus les enfants d'`AnimatePresence`
              * sous React 19 : le voile restait dans le document après fermeture,
              * en `position: fixed`, plein écran et `pointer-events: auto`. Il
              * interceptait donc tous les clics de la page — y compris le bouton
              * d'envoi du formulaire — sans rien laisser voir du problème.
              *
              * Le rendu conditionnel simple garantit le démontage. Seule
              * l'animation de sortie est perdue ; la fermeture est immédiate.
              * Le correctif de fond est la montée en `framer-motion@12`, qui
              * concerne aussi `FAQ` et `FAQContactForm`.
              */}
            {showCalendar && (
                <motion.div
                    className={styles.modalOverlay}
                    onClick={() => setShowCalendar(false)}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                >
                    <motion.div
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                        initial={{opacity: 0, scale: 0.9, y: 20}}
                        animate={{opacity: 1, scale: 1, y: 0}}
                    >
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitleRecap}>Choisir une date</h3>
                            <div style={{display: 'flex', gap: '8px'}}>
                                <button className={styles.btnResetModal} onClick={handleResetDate}
                                        title="Réinitialiser">
                                    <img src="/reset.png" alt="Reset" width={20} height={20}/>
                                </button>
                                <button className={styles.btnCloseModal} onClick={() => setShowCalendar(false)}
                                        title="Fermer">
                                    <X size={26}/>
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
                </motion.div>
            )}

            {showTimePicker.active && (
                <motion.div
                    className={styles.modalOverlay}
                    onClick={closeTimePicker}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                >
                    <motion.div
                        className={styles.modalContent}
                        style={{maxWidth: '400px'}}
                        onClick={(e) => e.stopPropagation()}
                        initial={{opacity: 0, scale: 0.9, y: 20}}
                        animate={{opacity: 1, scale: 1, y: 0}}
                    >
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitleRecap}>
                                Choisir l&apos;heure de {showTimePicker.field === "heure_debut" ? "début" : "fin"}
                            </h3>
                            <div style={{display: 'flex', gap: '8px'}}>
                                <button className={styles.btnResetModal} onClick={handleResetTime}
                                        title="Réinitialiser">
                                    <img src="/reset.png" alt="Reset" width={20} height={20}/>
                                </button>
                                <button className={styles.btnCloseModal} onClick={closeTimePicker} title="Fermer">
                                    <X size={24}/>
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
                </motion.div>
            )}
        </section>
    );
}
