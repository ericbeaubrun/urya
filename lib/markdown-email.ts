/**
 * Rendu Markdown minimal pour les e-mails automatiques.
 *
 * Le corps des mails est saisi en Markdown depuis l'administration. On ne rend
 * volontairement PAS le HTML brut de l'auteur : tout est échappé d'abord, puis
 * seule une grammaire fermée (titres, gras, italique, listes, liens, séparateur)
 * est retransformée en balises. Une faute de frappe dans l'éditeur ne peut donc
 * pas casser la mise en page du mail, et un HTML collé par mégarde s'affiche
 * tel quel au lieu d'être exécuté chez le destinataire.
 *
 * Les placeholders `{{variable}}` traversent ce rendu intacts : ils sont
 * remplacés APRÈS, par `renderTemplateBody`, avec échappement des valeurs.
 * C'est ce qui empêche une donnée saisie par un visiteur (un nom contenant
 * `[clic ici](http://phishing)`) d'être interprétée comme du Markdown.
 */

import {escapeHtml} from "@/lib/escape-html";

/** Seuls ces schémas d'URL sont acceptés dans un lien. */
const SAFE_LINK = /^(https?:\/\/|mailto:|tel:)/i;

function renderInline(escaped: string): string {
    return escaped
        // [texte](url) — un schéma non listé retombe sur le texte seul.
        .replace(/\[([^\]\n]+)]\(([^)\s]+)\)/g, (_match, text: string, url: string) => {
            if (!SAFE_LINK.test(url)) return text;
            return `<a href="${url}" style="color: #8b5cf6;">${text}</a>`;
        })
        .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
        .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}

/**
 * Convertit un corps Markdown en fragment HTML destiné à `emailLayout`.
 * Le résultat n'est pas un document complet : pas de `<html>`, pas de `<style>`.
 */
export function renderMarkdownEmail(markdown: string): string {
    const lines = escapeHtml(markdown).replace(/\r\n/g, "\n").split("\n");

    const out: string[] = [];
    let paragraph: string[] = [];
    let listItems: string[] = [];

    function flushParagraph() {
        if (paragraph.length === 0) return;
        // Un retour à la ligne simple reste un retour à la ligne dans un mail :
        // les clients de messagerie ne reflowent pas comme un navigateur.
        out.push(`<p>${renderInline(paragraph.join("<br>"))}</p>`);
        paragraph = [];
    }

    function flushList() {
        if (listItems.length === 0) return;
        const items = listItems.map(item => `<li>${renderInline(item)}</li>`).join("");
        out.push(`<ul style="padding-left: 20px; margin: 10px 0;">${items}</ul>`);
        listItems = [];
    }

    function flushAll() {
        flushParagraph();
        flushList();
    }

    for (const rawLine of lines) {
        const line = rawLine.trim();

        if (line === "") {
            flushAll();
            continue;
        }

        if (/^-{3,}$/.test(line)) {
            flushAll();
            out.push(`<div class="hr"></div>`);
            continue;
        }

        const heading = /^(#{1,6})\s+(.*)$/.exec(line);
        if (heading) {
            flushAll();
            // Un seul niveau visuel : les clients mail gèrent mal la hiérarchie
            // des titres, et un mail transactionnel n'en a pas besoin.
            out.push(
                `<h3 style="color: #ffffff; margin: 20px 0 12px;">${renderInline(heading[2].trim())}</h3>`
            );
            continue;
        }

        const bullet = /^[-*]\s+(.*)$/.exec(line);
        if (bullet) {
            flushParagraph();
            listItems.push(bullet[1].trim());
            continue;
        }

        flushList();
        paragraph.push(line);
    }

    flushAll();

    return out.join("\n");
}
