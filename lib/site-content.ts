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

export interface TestimonialItem {
    /** Texte de l'avis, restitué tel quel : c'est la parole du client. */
    quote?: string;
    author?: string;
    /** Titre donné à l'avis par son auteur, ex. « Je recommande vivement ». */
    title?: string;
    /** Note sur 5. Absente ou nulle : aucune étoile n'est affichée. */
    rating?: number;
}

export interface TestimonialsContent {
    title?: TitleBlock;
    subtitle?: string;
    items?: TestimonialItem[];
}

/**
 * Plafond d'avis affichés. Au-delà de cinq, la section cesse d'être une preuve
 * qu'on lit pour devenir un mur qu'on saute : la sélection vaut mieux que
 * l'exhaustivité, et la rangée incomplète reste centrée jusqu'à ce compte.
 */
export const MAX_TESTIMONIALS = 5;

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
    testimonials?: TestimonialsContent;
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

/** Cible de défilement de la section « Avis ». */
const TESTIMONIALS_TARGET = "avis";

/**
 * Entrées de menu réellement atteignables sur la page d'accueil.
 *
 * La section « Avis » n'est rendue que si elle a du contenu, alors que son
 * entrée de menu, elle, reste enregistrée en base. Sans ce filtre, elle
 * deviendrait un lien qui ne défile nulle part : react-scroll ne trouvant pas
 * sa cible, le clic n'aurait aucun effet.
 *
 * Le calcul est ici plutôt que dans l'en-tête parce que le pied de page reprend
 * exactement la même liste : c'est le genre de règle qu'on n'applique qu'à un
 * seul des deux endroits si on la duplique.
 */
export function homeNavItems(content: SiteContent): ResolvedNavItem[] {
    const hasTestimonials = usableTestimonials(content.testimonials?.items).length > 0;

    return usableNavItems(content.navigation?.items).filter(
        (item) => item.to !== TESTIMONIALS_TARGET || hasTestimonials
    );
}

/**
 * Avis exploitable. Sans texte, il ne reste qu'un nom et une note : une carte
 * vide qui affaiblit les avis voisins au lieu de les renforcer. Le plafond est
 * appliqué ici plutôt qu'à la saisie, pour qu'un contenu enregistré avant ce
 * plafond — ou modifié à la main en base — ne déborde jamais la grille.
 */
export type ResolvedTestimonial = TestimonialItem & { quote: string };

export function usableTestimonials(
    items: TestimonialItem[] | undefined
): ResolvedTestimonial[] {
    if (!Array.isArray(items)) return [];

    return items
        .filter(
            (item): item is ResolvedTestimonial =>
                typeof item.quote === "string" && item.quote.trim() !== ""
        )
        .slice(0, MAX_TESTIMONIALS);
}

/** Note ramenée à un entier de 0 à 5 : le champ est libre côté admin. */
export function testimonialStars(rating: unknown): number {
    const value = Math.round(Number(rating));

    if (!Number.isFinite(value) || value <= 0) return 0;

    return Math.min(value, 5);
}

/**
 * Initiale affichée dans la pastille d'avatar.
 *
 * Les avis viennent d'une plateforme tierce où seul le prénom est publié : il
 * n'y a pas de photo à reprendre, et en inventer une serait un faux. La lettre
 * suffit à donner un visage à la carte.
 *
 * `[...author]` plutôt que `author[0]` : découper une chaîne par indice sépare
 * les paires de substitution, et un prénom commençant par un emoji rendrait un
 * demi-caractère.
 */
export function testimonialInitial(author: string | undefined): string | null {
    const first = [...(author ?? "").trim()][0];

    return first ? first.toLocaleUpperCase("fr-FR") : null;
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
