import type {LegalContent} from "@/app/legal/legal.config";

/**
 * Forme du contenu éditorial du site.
 *
 * Ce contenu provient d'une colonne JSON pilotée par l'éditeur d'administration :
 * rien ne garantit qu'une clé soit présente, et l'admin peut enregistrer un
 * document incomplet. Tous les champs sont donc optionnels, et les composants
 * gardent leurs `?.` et leurs `Array.isArray()`.
 *
 * L'intérêt de ce typage n'est pas de garantir la présence des données, mais de
 * faire échouer la compilation sur une clé mal orthographiée ou renommée d'un
 * côté seulement — le cas qui, avec `any`, cassait le rendu en silence.
 */

export interface TitleBlock {
    text?: string;
    highlight?: string;
}

export interface HeroStat {
    value?: string;
    label?: string;
}

export interface HeroContent {
    status?: string;
    title?: {
        line1?: string;
        highlight?: string;
        line2?: string;
    };
    subtitle1?: string;
    subtitle2?: string;
    ctas?: {
        primary?: string;
        secondary?: string;
    };
    stats?: HeroStat[];
}

/** `icon` référence une clé de l'ICON_MAP de `About.tsx`. */
export interface ContactInfoItem {
    icon?: string;
    label?: string;
    sub?: string;
}

export interface AboutContent {
    title?: TitleBlock;
    /** Chaque entrée est un paragraphe ; `**gras**` y est interprété. */
    description?: string[];
    tags?: string[];
    contactInfo?: ContactInfoItem[];
}

export interface GalleryImage {
    src?: string;
    alt?: string;
    /** Occupe deux colonnes dans la grille. */
    big?: boolean;
}

export interface GalleryContent {
    title?: TitleBlock;
    subtitle?: string;
    images?: GalleryImage[];
}

export interface ServiceItem {
    /** Clé de l'ICON_MAP de `Services.tsx`. */
    icon?: string;
    image?: string;
    title?: string;
    subtitle?: string;
    inclusions?: string[];
    price?: string;
}

export interface ServicesContent {
    title?: TitleBlock;
    subtitle?: string;
    items?: ServiceItem[];
    extraOptions?: {
        title?: string;
        items?: string[];
    };
}

export interface FaqItem {
    question?: string;
    answer?: string;
}

export interface FaqContent {
    title?: TitleBlock;
    items?: FaqItem[];
}

export interface FaqFormContent {
    trigger?: string;
    description?: string;
    fields?: {
        name?: string;
        email?: string;
        message?: string;
        placeholders?: {
            message?: string;
        };
    };
    buttons?: {
        send?: string;
        sending?: string;
    };
    modal?: {
        success?: { title?: string; text?: string };
        error?: { title?: string; text?: string };
        close?: string;
    };
}

export interface PrestationFormStep {
    number?: string;
    label?: string;
}

export interface PrestationFormContent {
    title?: TitleBlock;
    /** Libellés des deux onglets du sélecteur de mode. */
    toggles?: {
        prestation?: string;
        appointment?: string;
    };
    subtitles?: {
        prestation?: string;
        appointment?: string;
    };
    steps?: PrestationFormStep[];
    fields?: {
        date?: string;
        date_fin?: string;
        timeStart?: string;
        timeEnd?: string;
        type?: string;
        location?: string;
        name?: string;
        email?: string;
        phone?: string;
        notes?: string;
    };
    placeholders?: {
        location?: string;
        notes?: string;
    };
    buttons?: {
        next?: string;
        prev?: string;
        send?: string;
        sendAppointment?: string;
        reset?: string;
    };
    success?: {
        title?: string;
        textPrestation?: string;
        textAppointment?: string;
    };
    privacyNote?: string;
}

/** Cible de défilement (`id` de section) pour react-scroll. */
export interface NavItem {
    to?: string;
    label?: string;
}

export interface NavigationContent {
    logo?: {
        first?: string;
        second?: string;
    };
    items?: NavItem[];
    cta?: string;
}

/** `platform` référence une clé de l'ICON_MAP de `Footer.tsx`. */
export interface SocialLink {
    platform?: string;
    url?: string;
}

export interface FooterContent {
    socials?: SocialLink[];
    copyright?: string;
    signature?: string;
}

export interface SiteContent {
    hero?: HeroContent;
    about?: AboutContent;
    gallery?: GalleryContent;
    services?: ServicesContent;
    faq?: FaqContent;
    faqForm?: FaqFormContent;
    prestationForm?: PrestationFormContent;
    navigation?: NavigationContent;
    footer?: FooterContent;
    /** Renseigné depuis l'onglet « Légal » ; fusionné avec `LEGAL_DEFAULTS`. */
    legal?: DeepPartial<LegalContent>;
}

/**
 * Entrée de navigation exploitable. Sans `to`, le lien ne mène nulle part :
 * on écarte ces entrées plutôt que de rendre un lien mort.
 */
export type ResolvedNavItem = NavItem & { to: string };

export function usableNavItems(items: NavItem[] | undefined): ResolvedNavItem[] {
    if (!Array.isArray(items)) return [];

    return items.filter(
        (item): item is ResolvedNavItem => typeof item.to === "string" && item.to !== ""
    );
}

/** Lien social exploitable : `platform` sert de clé d'icône et de libellé. */
export type ResolvedSocialLink = SocialLink & { platform: string };

export function usableSocials(socials: SocialLink[] | undefined): ResolvedSocialLink[] {
    if (!Array.isArray(socials)) return [];

    return socials.filter(
        (social): social is ResolvedSocialLink =>
            typeof social.platform === "string" && social.platform !== ""
    );
}

/** Rend récursivement optionnelles les propriétés d'un type. */
export type DeepPartial<T> = T extends (infer U)[]
    ? DeepPartial<U>[]
    : T extends object
        ? { [K in keyof T]?: DeepPartial<T[K]> }
        : T;
