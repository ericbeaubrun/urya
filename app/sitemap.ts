import type {MetadataRoute} from "next";
import {SITE_URL} from "./site-url";
import {getSiteContent} from "@/lib/content";
import {LANDING_SLUGS} from "@/lib/landing-pages";
import {AREA_PAGES} from "@/lib/area-pages";

/**
 * Priorité des pages de zone selon leur niveau. La page régionale est la tête
 * de la hiérarchie et la seule à viser la requête large ; les villes, à trafic
 * égal, convertissent moins bien qu'une requête de prestation.
 */
const AREA_PRIORITY = {region: 0.8, department: 0.75, city: 0.7} as const;

/**
 * Les images de la galerie sont déclarées sur l'entrée d'accueil : c'est la
 * seule voie d'indexation dans Google Images pour des `<img>` rendues côté
 * client, et les photos de prestation sont un point d'entrée réel sur ce
 * marché.
 */
function galleryImages(images: { src?: string }[] | undefined): string[] {
    if (!Array.isArray(images)) return [];

    return images
        .map((img) => img.src?.trim())
        .filter((src): src is string => Boolean(src))
        .map((src) =>
            src.startsWith("http") ? src : `${SITE_URL}${src.startsWith("/") ? "" : "/"}${src}`
        );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const lastModified = new Date();
    // `getSiteContent` absorbe déjà ses erreurs et renvoie `null` : une panne
    // Supabase dégrade le sitemap en entrée sans images plutôt que de le faire
    // échouer.
    const content = await getSiteContent();

    return [
        {
            url: SITE_URL,
            lastModified,
            changeFrequency: "weekly",
            priority: 1,
            images: galleryImages(content?.gallery?.images),
        },
        // Pages d'atterrissage : contenu figé dans le dépôt, donc `lastmod`
        // aligné sur le déploiement plutôt que sur l'heure de génération.
        ...LANDING_SLUGS.map((slug) => ({
            url: `${SITE_URL}/${slug}`,
            lastModified,
            changeFrequency: "monthly" as const,
            priority: 0.8,
        })),
        ...AREA_PAGES.map((page) => ({
            url: `${SITE_URL}/${page.slug}`,
            lastModified,
            changeFrequency: "monthly" as const,
            priority: AREA_PRIORITY[page.level],
        })),
        {
            url: `${SITE_URL}/mentions-legales`,
            lastModified,
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${SITE_URL}/politique-de-confidentialite`,
            lastModified,
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ];
}
