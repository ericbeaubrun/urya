/**
 * Catalogue des e-mails automatiques éditables depuis l'administration.
 *
 * Chaque entrée décrit un mail : son sujet et son corps Markdown par défaut, et
 * la liste FERMÉE des variables utilisables. Cette liste est la seule source de
 * vérité côté serveur : un `{{ ... }}` absent du catalogue n'est jamais
 * remplacé, donc l'éditeur ne peut pas atteindre une donnée qu'on ne lui a pas
 * explicitement ouverte.
 *
 * Les valeurs par défaut ci-dessous reprennent les mails historiques : tant que
 * l'admin n'a rien enregistré, le contenu envoyé reste identique.
 */

import {escapeHtml} from "@/lib/escape-html";
import {renderMarkdownEmail} from "@/lib/markdown-email";

export interface TemplateVariable {
    key: string;
    label: string;
    /** Affiché quand la valeur est absente ou vide. */
    fallback?: string;
    /** Valeur utilisée pour l'aperçu et les envois de test. */
    sample: string;
}

export interface EmailTemplateDef {
    key: string;
    /** Regroupement affiché dans le sélecteur de /admin/emails. */
    category: string;
    /** Libellé court, unique à l'intérieur de sa catégorie. */
    label: string;
    description: string;
    variables: TemplateVariable[];
    defaultSubject: string;
    defaultBody: string;
}

const NR = "Non renseigné";

export const EMAIL_TEMPLATES: EmailTemplateDef[] = [
    {
        key: "prestation_client",
        category: "Demande de prestation",
        label: "Client",
        description: "Accusé de réception envoyé au visiteur qui remplit le formulaire de prestation.",
        variables: [
            {key: "nom", label: "Nom du client", sample: "Camille Martin"},
            {key: "mail", label: "Email du client", sample: "camille.martin@example.com"},
            {key: "date_debut", label: "Date de début", sample: "2026-09-12"},
            {key: "date_fin", label: "Date de fin", fallback: NR, sample: "2026-09-13"},
            {key: "heure_debut", label: "Heure de début", fallback: NR, sample: "20:00"},
            {key: "heure_fin", label: "Heure de fin", fallback: NR, sample: "02:00"},
            {key: "type", label: "Type de prestation", fallback: NR, sample: "Mariage"},
            {key: "lieu", label: "Lieu", fallback: NR, sample: "Bordeaux"},
        ],
        defaultSubject: "Nous avons bien reçu votre demande",
        defaultBody: `Bonjour **{{nom}}**,

Nous avons bien reçu votre demande de prestation et nous vous en remercions.

Notre équipe examine actuellement les détails de votre projet. Nous reviendrons vers vous dans les plus brefs délais pour discuter de la suite.

---

Si vous avez des questions urgentes, n'hésitez pas à nous contacter directement.`,
    },
    {
        key: "prestation_admin",
        category: "Demande de prestation",
        label: "Administration",
        description: "Notification interne à chaque nouvelle demande de prestation.",
        variables: [
            {key: "nom", label: "Nom du client", sample: "Camille Martin"},
            {key: "mail", label: "Email du client", sample: "camille.martin@example.com"},
            {key: "tel", label: "Téléphone", fallback: NR, sample: "06 00 00 00 00"},
            {key: "date_debut", label: "Date de début", sample: "2026-09-12"},
            {key: "date_fin", label: "Date de fin", fallback: NR, sample: "2026-09-13"},
            {key: "heure_debut", label: "Heure de début", fallback: NR, sample: "20:00"},
            {key: "heure_fin", label: "Heure de fin", fallback: NR, sample: "02:00"},
            {key: "type", label: "Type de prestation", fallback: NR, sample: "Mariage"},
            {key: "lieu", label: "Lieu", fallback: NR, sample: "Bordeaux"},
            {key: "notes", label: "Notes", fallback: "Aucune note", sample: "Prévoir une arrivée à 18h."},
        ],
        defaultSubject: "Nouvelle demande de prestation",
        defaultBody: `### Informations client

- **Nom :** {{nom}}
- **Email :** {{mail}}
- **Téléphone :** {{tel}}

---

### Détails de l'événement

- **Date :** du {{date_debut}} au {{date_fin}}
- **Horaires :** de {{heure_debut}} à {{heure_fin}}
- **Lieu :** {{lieu}}
- **Type :** {{type}}

---

### Notes complémentaires

{{notes}}`,
    },
    {
        key: "appointment_admin",
        category: "Rendez-vous gratuit",
        label: "Administration",
        description: "Notification interne à chaque demande de premier rendez-vous.",
        variables: [
            {key: "name", label: "Nom / organisme", sample: "Camille Martin"},
            {key: "contact", label: "Contact (email ou téléphone)", sample: "camille.martin@example.com"},
            {key: "type", label: "Type de rendez-vous", fallback: NR, sample: "visio"},
            {key: "availability", label: "Disponibilités", sample: "Mardi après-midi ou jeudi matin"},
        ],
        defaultSubject: "Nouvelle demande de RDV - Urya",
        defaultBody: `- **Nom / Organisme :** {{name}}
- **Contact :** {{contact}}
- **Type de rendez-vous :** {{type}}

---

**Disponibilités :**

{{availability}}`,
    },
    {
        key: "appointment_client",
        category: "Rendez-vous gratuit",
        label: "Client",
        description: "Confirmation envoyée au visiteur, uniquement si son contact est un email valide.",
        variables: [
            {key: "name", label: "Nom / organisme", sample: "Camille Martin"},
            {key: "type", label: "Type de rendez-vous", fallback: NR, sample: "visio"},
            {key: "availability", label: "Disponibilités", sample: "Mardi après-midi ou jeudi matin"},
        ],
        defaultSubject: "Confirmation de votre demande de rendez-vous - Urya",
        defaultBody: `Bonjour {{name}},

Merci pour votre demande de rendez-vous gratuit. J'ai bien reçu votre message et je reviendrai vers vous très prochainement pour confirmer l'horaire.

---

**Récapitulatif de votre demande :**

- **Type de rendez-vous :** {{type}}
- **Disponibilités :** {{availability}}

À bientôt,
Urya`,
    },
    {
        key: "contact_admin",
        category: "Formulaire de contact",
        label: "Administration",
        description: "Notification interne à chaque message envoyé depuis le formulaire de contact.",
        variables: [
            {key: "nom", label: "Nom", sample: "Camille Martin"},
            {key: "email", label: "Email", sample: "camille.martin@example.com"},
            {key: "message", label: "Message", sample: "Bonjour, je souhaite un devis pour un mariage."},
        ],
        defaultSubject: "Nouveau message via le formulaire de contact",
        defaultBody: `- **Nom :** {{nom}}
- **Email :** {{email}}

---

**Message :**

{{message}}`,
    },
];

export type EmailTemplateKey = (typeof EMAIL_TEMPLATES)[number]["key"];

export function getTemplateDef(key: string): EmailTemplateDef | undefined {
    return EMAIL_TEMPLATES.find(t => t.key === key);
}

/** Ce qu'on stocke en base pour un mail personnalisé. */
export interface StoredEmailTemplate {
    cle: string;
    sujet: string;
    corps: string;
}

/**
 * Données d'une demande. Typé `object` et non `Record<string, unknown>` :
 * les records des routes (`PrestationRecord`, …) sont des interfaces, donc sans
 * signature d'index. La lecture se fait par clé du catalogue, pas par confiance
 * dans la forme de l'objet.
 */
export type TemplateValues = object;

function placeholderPattern(key: string) {
    // Tolère les espaces autour du nom : {{ nom }} comme {{nom}}.
    return new RegExp(`\\{\\{\\s*${key}\\s*}}`, "g");
}

function resolve(variable: TemplateVariable, values: TemplateValues): string {
    const raw = (values as Record<string, unknown>)[variable.key];
    const isEmpty = raw === null || raw === undefined || String(raw).trim() === "";
    return isEmpty ? (variable.fallback ?? "") : String(raw);
}

/**
 * Rend le corps : Markdown d'abord, substitution ensuite.
 *
 * L'ordre compte. Les valeurs sont échappées au moment de l'insertion, dans du
 * HTML déjà produit : elles ne peuvent devenir ni une balise, ni un lien
 * Markdown, ni un titre — même si un visiteur les a rédigées.
 */
export function renderTemplateBody(
    def: EmailTemplateDef,
    body: string,
    values: TemplateValues
): string {
    let html = renderMarkdownEmail(body);

    for (const variable of def.variables) {
        html = html.replace(placeholderPattern(variable.key), () =>
            escapeHtml(resolve(variable, values)).replace(/\n/g, "<br>")
        );
    }

    return html;
}

/** Le sujet est un en-tête : texte brut, et surtout aucun retour à la ligne. */
export function renderTemplateSubject(
    def: EmailTemplateDef,
    subject: string,
    values: TemplateValues
): string {
    let out = subject;

    for (const variable of def.variables) {
        out = out.replace(placeholderPattern(variable.key), () => resolve(variable, values));
    }

    return out.replace(/[\r\n]+/g, " ").trim();
}

/** Placeholders présents dans le texte mais absents du catalogue de la fiche. */
export function unknownPlaceholders(def: EmailTemplateDef, ...texts: string[]): string[] {
    const known = new Set(def.variables.map(v => v.key));
    const found = new Set<string>();

    for (const text of texts) {
        for (const match of text.matchAll(/\{\{\s*([\w.-]+)\s*}}/g)) {
            if (!known.has(match[1])) found.add(match[1]);
        }
    }

    return [...found];
}

/** Valeurs d'exemple, pour l'aperçu et les envois de test. */
export function sampleValues(def: EmailTemplateDef): TemplateValues {
    return Object.fromEntries(def.variables.map(v => [v.key, v.sample]));
}
