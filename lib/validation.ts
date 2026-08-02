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

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

/**
 * Valide une date au format ISO `AAAA-MM-JJ`.
 *
 * Le regex ne suffit pas : `2025-02-31` le satisfait mais n'existe pas. On
 * reconstruit donc la date et on vérifie qu'elle n'a pas été décalée par la
 * normalisation du constructeur `Date`.
 */
export function isValidDate(value: unknown): value is string {
    if (typeof value !== "string" || !DATE_REGEX.test(value)) return false;

    const parsed = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime())) return false;

    return parsed.toISOString().slice(0, 10) === value;
}

/** Valide une heure `HH:MM` ou `HH:MM:SS` sur 24 h. */
export function isValidTime(value: unknown): value is string {
    return typeof value === "string" && TIME_REGEX.test(value);
}

/** Vérifie qu'une valeur appartient à une allowlist. */
export function isOneOf<T extends string>(
    value: unknown,
    allowed: readonly T[]
): value is T {
    return typeof value === "string" && (allowed as readonly string[]).includes(value);
}
