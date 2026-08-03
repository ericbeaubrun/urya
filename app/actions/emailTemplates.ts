'use server';

import {Resend} from 'resend';
import {revalidateTag} from 'next/cache';
import {requireAdmin} from '@/lib/require-admin';
import {isValidEmail} from '@/lib/validation';
import {
    EMAIL_TEMPLATES_TAG,
    renderEmailFrom,
    saveEmailTemplate,
} from '@/lib/email-content';
import {getTemplateDef, sampleValues, unknownPlaceholders} from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY!);

/** Limite de longueur : un corps de mail n'a aucune raison d'être un roman. */
const MAX_SUBJECT = 200;
const MAX_BODY = 20000;

export async function saveEmailTemplateAction(input: { cle: string; sujet: string; corps: string }) {
    try {
        await requireAdmin();

        const def = getTemplateDef(input.cle);
        if (!def) {
            return {success: false, message: "Modèle d'e-mail inconnu."};
        }

        const sujet = input.sujet.trim();
        const corps = input.corps.trim();

        if (!sujet || !corps) {
            return {success: false, message: 'Le sujet et le corps sont obligatoires.'};
        }

        if (sujet.length > MAX_SUBJECT || corps.length > MAX_BODY) {
            return {success: false, message: 'Contenu trop long.'};
        }

        const {error} = await saveEmailTemplate({cle: def.key, sujet, corps});
        if (error) throw new Error(error.message);

        revalidateTag(EMAIL_TEMPLATES_TAG, 'max');

        const unknown = unknownPlaceholders(def, sujet, corps);

        return {
            success: true,
            message: unknown.length
                ? `Enregistré. Attention : ${unknown.map(v => `{{${v}}}`).join(', ')} ne correspond à aucune variable et restera tel quel dans le mail.`
                : 'Modèle enregistré.',
        };
    } catch (error) {
        console.error("Erreur lors de la sauvegarde du modèle d'e-mail:", error);
        const detail = error instanceof Error ? error.message : 'Erreur inconnue';
        return {success: false, message: `Erreur durant la sauvegarde : ${detail}`};
    }
}

/** Aperçu HTML du contenu en cours d'édition, avec les valeurs d'exemple. */
export async function previewEmailTemplateAction(input: { cle: string; sujet: string; corps: string }) {
    try {
        await requireAdmin();

        const def = getTemplateDef(input.cle);
        if (!def) {
            return {success: false, message: "Modèle d'e-mail inconnu."};
        }

        const {subject, html} = renderEmailFrom(def.key, input.sujet, input.corps, sampleValues(def));

        return {success: true, subject, html};
    } catch (error) {
        console.error("Erreur lors de l'aperçu du modèle d'e-mail:", error);
        return {success: false, message: "Aperçu impossible."};
    }
}

/**
 * Envoi de test : le contenu testé est celui affiché dans l'éditeur, pas celui
 * enregistré — on veut pouvoir vérifier avant de publier. Le destinataire est
 * choisi par l'admin ; le sujet est préfixé pour qu'un test ne soit jamais
 * confondu avec un vrai mail transactionnel.
 */
export async function sendTestEmailAction(input: {
    cle: string;
    sujet: string;
    corps: string;
    destinataire: string;
}) {
    try {
        await requireAdmin();

        const def = getTemplateDef(input.cle);
        if (!def) {
            return {success: false, message: "Modèle d'e-mail inconnu."};
        }

        const to = input.destinataire.trim();
        if (!isValidEmail(to)) {
            return {success: false, message: "Adresse de test invalide."};
        }

        const {subject, html} = renderEmailFrom(def.key, input.sujet, input.corps, sampleValues(def));

        const {error} = await resend.emails.send({
            from: process.env.RESEND_MAIL_ADDRESS!,
            to,
            subject: `[TEST] ${subject}`,
            html,
        });

        if (error) throw new Error(error.message);

        return {success: true, message: `E-mail de test envoyé à ${to}.`};
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'e-mail de test:", error);
        const detail = error instanceof Error ? error.message : 'Erreur inconnue';
        return {success: false, message: `Envoi impossible : ${detail}`};
    }
}
