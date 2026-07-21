/**
 * Échappe les caractères ayant une signification en HTML.
 *
 * À appliquer à TOUTE donnée fournie par un visiteur avant interpolation dans
 * un template d'e-mail : sans cela, un formulaire public permet d'injecter des
 * liens de phishing, des pixels de tracking ou de casser la mise en page dans
 * la boîte mail du destinataire.
 */
export function escapeHtml(value: unknown): string {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/**
 * Variante avec valeur de repli, pour les champs facultatifs.
 */
export function escapeHtmlOr(value: unknown, fallback: string): string {
    if (value === null || value === undefined || String(value).trim() === "") {
        return escapeHtml(fallback);
    }

    return escapeHtml(value);
}
