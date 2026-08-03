/**
 * Lecture / écriture des e-mails automatiques personnalisés (table
 * `email_templates`, voir `scripts/create-email-templates.sql`).
 *
 * Le contenu par défaut vit dans le code (`lib/email-templates.ts`) et sert de
 * repli systématique : base injoignable, ligne absente, champ vidé par erreur —
 * dans tous ces cas le mail part quand même, avec son texte d'origine. Un
 * transactionnel muet est un rendez-vous perdu, pas un simple bug d'affichage.
 */

import {unstable_cache} from "next/cache";
import {supabase_client, supabaseAdmin} from "@/lib/supabase_client";
import {emailLayout} from "@/app/emails/emailLayout";
import {escapeHtml} from "@/lib/escape-html";
import {
    EMAIL_TEMPLATES,
    getTemplateDef,
    renderTemplateBody,
    renderTemplateSubject,
    type StoredEmailTemplate,
    type TemplateValues,
} from "@/lib/email-templates";

export const EMAIL_TEMPLATES_TAG = "email-templates";

async function fetchStoredTemplates(): Promise<StoredEmailTemplate[]> {
    const {data, error} = await supabase_client
        .from("email_templates")
        .select("cle, sujet, corps");

    if (error) {
        throw new Error(`Lecture des modèles d'e-mail échouée : ${error.message}`);
    }

    return (data as StoredEmailTemplate[]) ?? [];
}

const getCachedStoredTemplates = unstable_cache(
    fetchStoredTemplates,
    ["email-templates-v1"],
    {tags: [EMAIL_TEMPLATES_TAG]}
);

/**
 * Le contenu effectif de chaque mail : la version enregistrée si elle existe et
 * n'est pas vide, sinon celle du code.
 */
export async function getEmailTemplates(): Promise<StoredEmailTemplate[]> {
    let stored: StoredEmailTemplate[] = [];

    try {
        stored = await getCachedStoredTemplates();
    } catch (err) {
        console.error("[email-templates] Contenu indisponible, repli sur les valeurs par défaut:", err);
    }

    return EMAIL_TEMPLATES.map(def => {
        const row = stored.find(t => t.cle === def.key);

        return {
            cle: def.key,
            sujet: row?.sujet?.trim() ? row.sujet : def.defaultSubject,
            corps: row?.corps?.trim() ? row.corps : def.defaultBody,
        };
    });
}

export async function getEmailTemplate(key: string): Promise<StoredEmailTemplate | null> {
    const all = await getEmailTemplates();
    return all.find(t => t.cle === key) ?? null;
}

export async function saveEmailTemplate(template: StoredEmailTemplate) {
    const {error} = await supabaseAdmin()
        .from("email_templates")
        .upsert(
            {
                cle: template.cle,
                sujet: template.sujet,
                corps: template.corps,
                updated_at: new Date().toISOString(),
            },
            {onConflict: "cle"}
        );

    return {error: error ? {message: error.message} : null};
}

export interface RenderedEmail {
    subject: string;
    html: string;
}

/**
 * Point d'entrée des routes d'envoi : rend un mail complet (sujet + document
 * HTML) à partir de la clé du modèle et des données de la demande.
 */
export async function renderEmail(key: string, values: TemplateValues): Promise<RenderedEmail> {
    const def = getTemplateDef(key);

    if (!def) {
        throw new Error(`Modèle d'e-mail inconnu : ${key}`);
    }

    const template = (await getEmailTemplate(key)) ?? {
        cle: key,
        sujet: def.defaultSubject,
        corps: def.defaultBody,
    };

    return renderEmailFrom(key, template.sujet, template.corps, values);
}

/**
 * Même rendu, mais à partir d'un sujet et d'un corps fournis : utilisé par
 * l'aperçu et l'envoi de test, qui portent sur du contenu pas encore
 * enregistré.
 */
export function renderEmailFrom(
    key: string,
    subject: string,
    body: string,
    values: TemplateValues
): RenderedEmail {
    const def = getTemplateDef(key);

    if (!def) {
        throw new Error(`Modèle d'e-mail inconnu : ${key}`);
    }

    const renderedSubject = renderTemplateSubject(def, subject, values);
    // Le sujet peut contenir une valeur saisie par un visiteur : échappé avant
    // d'être réutilisé comme titre dans le corps HTML.
    const content = `
        <div class="title">${escapeHtml(renderedSubject)}</div>
        <div class="content">
            ${renderTemplateBody(def, body, values)}
        </div>
    `;

    return {subject: renderedSubject, html: emailLayout(content, escapeHtml(renderedSubject))};
}
