// Limites de longueur : évitent qu'un champ libre serve à envoyer un mur de
// texte (spam) ou à saturer la base.
export const MAX_SHORT_FIELD = 200;
export const MAX_LONG_FIELD = 5000;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export function isValidEmail(value: unknown): value is string {
    return (
        typeof value === "string" &&
        value.length <= 254 &&
        EMAIL_REGEX.test(value)
    );
}

/**
 * Normalise un champ texte : rejette les non-chaînes, retire les espaces de
 * bord et tronque. Retourne `null` si le champ est absent ou vide.
 */
export function normalizeField(
    value: unknown,
    maxLength: number = MAX_SHORT_FIELD
): string | null {
    if (typeof value !== "string") return null;

    const trimmed = value.trim();
    if (trimmed === "") return null;

    return trimmed.slice(0, maxLength);
}
