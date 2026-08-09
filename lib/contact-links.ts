import type {ContactInfoItem} from "@/lib/site-content";

/**
 * Transforme une entrée de `about.contactInfo` en lien réellement actionnable.
 *
 * Le libellé est saisi librement depuis l'admin : rien ne garantit qu'il
 * contienne un numéro ou une adresse cohérents avec l'icône choisie. On ne
 * fabrique donc un lien que lorsque la valeur en a la forme, et on retombe
 * sinon sur du texte simple. Un `tel:` construit sur une saisie fantaisiste
 * ouvrirait le composeur du visiteur sur un numéro faux : moins utile que pas
 * de lien du tout, et plus difficile à diagnostiquer.
 */

/** Canal de contact, tel qu'il est consigné dans la mesure d'audience. */
export type ContactChannel = "phone" | "email" | "instagram";

export interface ContactLink {
    href: string;
    channel: ContactChannel;
    /** Le lien quitte le site : impose `target` et `rel`. */
    external: boolean;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Normalise un numéro français en notation internationale.
 *
 * `tel:` accepte les espaces, mais les composeurs de certains Android les
 * digèrent mal ; la forme `+33…` est celle qui fonctionne partout, y compris
 * quand le visiteur appelle depuis l'étranger.
 */
function telHref(label: string): string | null {
    const digits = label.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");

    if (/^0\d{9}$/.test(digits)) return `tel:+33${digits.slice(1)}`;
    if (/^\+\d{8,15}$/.test(digits)) return `tel:${digits}`;

    return null;
}

function mailHref(label: string): string | null {
    const address = label.trim();

    return EMAIL_PATTERN.test(address) ? `mailto:${address}` : null;
}

/**
 * Le compte peut être saisi en `@pseudo` comme en URL complète : les deux
 * formes se retrouvent dans les contenus existants.
 */
function instagramHref(label: string): string | null {
    const value = label.trim();

    if (/^https?:\/\//i.test(value)) return value;

    const handle = value.replace(/^@/, "");

    return /^[\w.]{1,30}$/.test(handle) ? `https://www.instagram.com/${handle}/` : null;
}

/**
 * `MapPin` n'a volontairement pas de lien : la localisation affichée est une
 * zone d'intervention, pas une adresse où l'on reçoit du public. L'ouvrir dans
 * un plan enverrait le visiteur vers un point qui ne veut rien dire.
 */
export function contactLink(item: ContactInfoItem): ContactLink | null {
    const label = item.label?.trim();
    if (!label) return null;

    switch (item.icon) {
        case "Phone": {
            const href = telHref(label);
            return href ? {href, channel: "phone", external: false} : null;
        }
        case "Mail": {
            const href = mailHref(label);
            return href ? {href, channel: "email", external: false} : null;
        }
        case "Instagram": {
            const href = instagramHref(label);
            return href ? {href, channel: "instagram", external: true} : null;
        }
        default:
            return null;
    }
}

/**
 * Premier numéro appelable du contenu, pour les appels à l'action qui ne
 * disposent pas de l'entrée `contactInfo` complète (barre mobile fixe).
 */
export function findPhoneHref(items: ContactInfoItem[] | undefined): string | null {
    if (!Array.isArray(items)) return null;

    for (const item of items) {
        const link = contactLink(item);
        if (link?.channel === "phone") return link.href;
    }

    return null;
}
