import type {LegalContent} from "@/app/legal/legal.config";
import type {SiteContent} from "@/lib/site-content";
import {usableSocials} from "@/lib/site-content";
import {AREA_SERVED, BRAND, DEFAULT_DESCRIPTION, KEYWORDS, OG_IMAGE, schemaId} from "@/lib/seo";
import {PRESTATION_TYPE_LABELS} from "@/lib/prestation-types";
import type {LandingPage} from "@/lib/landing-pages";
import type {CityPage} from "@/lib/city-pages";

/**
 * Construction du JSON-LD du site.
 *
 * Tout est dérivé du contenu déjà affiché : une donnée structurée qui décrit
 * autre chose que la page visible est traitée par Google comme du spam de
 * balisage. Chaque valeur absente est donc omise du graphe plutôt que
 * remplacée par un défaut inventé.
 */

/** Retire les clés `undefined` pour ne pas sérialiser `"x": null` dans le JSON-LD. */
function compact<T extends Record<string, unknown>>(obj: T): T {
    return Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== "")
    ) as T;
}

/**
 * Le téléphone et l'e-mail publics vivent dans `about.contactInfo`, une liste
 * libre éditée depuis l'admin où seul `icon` identifie la nature de l'entrée.
 */
function findContact(content: SiteContent, icon: "Phone" | "Mail"): string | undefined {
    const entry = content.about?.contactInfo?.find((item) => item.icon === icon);
    const value = entry?.label?.trim();
    return value || undefined;
}

/** Profils sociaux : `sameAs` est le principal signal d'entité pour un artiste. */
function sameAs(content: SiteContent): string[] {
    return usableSocials(content.footer?.socials)
        .map((social) => social.url?.trim())
        .filter((url): url is string => Boolean(url));
}

// La description de l'entité est celle de `lib/seo.ts`, pas le slogan du hero :
// une divergence avec la balise `description` de la page dilue le signal.

function organization(base: string, content: SiteContent, legal: LegalContent) {
    const phone = findContact(content, "Phone");
    const email = findContact(content, "Mail") ?? (legal.editor.email?.trim() || undefined);
    const address = legal.editor.address?.trim() || undefined;

    return compact({
        // `MusicGroup` décrit l'artiste, `LocalBusiness` le prestataire qu'on
        // réserve : le double type couvre les deux intentions de recherche.
        "@type": ["MusicGroup", "LocalBusiness"],
        "@id": schemaId.organization(base),
        name: BRAND,
        alternateName: "URYA",
        url: `${base}/`,
        description: DEFAULT_DESCRIPTION,
        genre: ["Mariage", "Soirée privée", "Événement d'entreprise"],
        knowsLanguage: "fr-FR",
        logo: compact({
            "@type": "ImageObject",
            url: `${base}/logo.png`,
            caption: BRAND,
        }),
        image: `${base}${OG_IMAGE.url}`,
        telephone: phone,
        email,
        address: address
            ? compact({
                "@type": "PostalAddress",
                streetAddress: address,
                addressCountry: "FR",
            })
            : undefined,
        vatID: legal.editor.vatNumber?.trim() || undefined,
        // Le SIRET n'a pas de propriété dédiée : `identifier` typé est la forme
        // recommandée pour un identifiant national d'entreprise.
        identifier: legal.editor.siret?.trim()
            ? compact({
                "@type": "PropertyValue",
                propertyID: "SIRET",
                value: legal.editor.siret.trim(),
            })
            : undefined,
        areaServed: AREA_SERVED,
        sameAs: sameAs(content).length ? sameAs(content) : undefined,
        keywords: KEYWORDS.join(", "),
    });
}

function website(base: string) {
    return {
        "@type": "WebSite",
        "@id": schemaId.website(base),
        url: `${base}/`,
        name: BRAND,
        description: DEFAULT_DESCRIPTION,
        inLanguage: "fr-FR",
        publisher: {"@id": schemaId.organization(base)},
    };
}

function webpage(
    base: string,
    {path = "/", name, description}: { path?: string; name: string; description: string }
) {
    return {
        "@type": "WebPage",
        "@id": schemaId.webpage(base, path),
        url: path === "/" ? `${base}/` : `${base}${path}`,
        name,
        description,
        inLanguage: "fr-FR",
        isPartOf: {"@id": schemaId.website(base)},
        about: {"@id": schemaId.organization(base)},
        primaryImageOfPage: `${base}${OG_IMAGE.url}`,
    };
}

/**
 * Fil d'Ariane. Sur la page d'accueil il n'apporte rien, mais sur les pages
 * légales il permet à Google d'afficher « urya.fr › Mentions légales » plutôt
 * que l'URL brute.
 */
function breadcrumb(base: string, path: string, label: string) {
    return {
        "@type": "BreadcrumbList",
        "@id": schemaId.breadcrumb(base, path),
        itemListElement: [
            {"@type": "ListItem", position: 1, name: "Accueil", item: `${base}/`},
            {"@type": "ListItem", position: 2, name: label, item: `${base}${path}`},
        ],
    };
}

/**
 * Un `Service` par carte de prestation affichée. `price` est un texte libre
 * côté admin (« à partir de 450 € », « sur devis »…) : on ne tente pas de le
 * parser en `Offer` chiffrée, un prix structuré faux étant sanctionné. On se
 * limite à `priceSpecification.description`, qui accepte du texte.
 */
function services(base: string, content: SiteContent) {
    const items = content.services?.items ?? [];

    return items
        .filter((item) => item.title?.trim())
        .map((item) => {
            const price = item.price?.trim();

            return compact({
                "@type": "Service",
                name: item.title!.trim(),
                serviceType: item.title!.trim(),
                description: item.subtitle?.trim() || undefined,
                provider: {"@id": schemaId.organization(base)},
                areaServed: AREA_SERVED,
                image: item.image?.startsWith("http")
                    ? item.image
                    : item.image
                        ? `${base}${item.image}`
                        : undefined,
                offers: price
                    ? compact({
                        "@type": "Offer",
                        priceCurrency: "EUR",
                        availability: "https://schema.org/InStock",
                        priceSpecification: {
                            "@type": "PriceSpecification",
                            priceCurrency: "EUR",
                            description: price,
                        },
                    })
                    : undefined,
                hasOfferCatalog: item.inclusions?.length
                    ? {
                        "@type": "OfferCatalog",
                        name: `Inclus – ${item.title!.trim()}`,
                        itemListElement: item.inclusions
                            .filter((inc) => inc?.trim())
                            .map((inc) => ({
                                "@type": "Offer",
                                itemOffered: {"@type": "Service", name: inc.trim()},
                            })),
                    }
                    : undefined,
            });
        });
}

/**
 * `FAQPage` est le nœud à plus fort rendement du graphe : c'est le seul qui
 * peut produire un résultat enrichi dépliable dans la SERP. Il exige que
 * question et réponse soient toutes deux visibles sur la page — ce qui est le
 * cas, l'accordéon les rendant côté serveur.
 */
function faqPage(base: string, content: SiteContent) {
    const items = (content.faq?.items ?? []).filter(
        (item) => item.question?.trim() && item.answer?.trim()
    );

    if (!items.length) return undefined;

    return {
        "@type": "FAQPage",
        "@id": `${base}/#faq`,
        mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question!.trim(),
            acceptedAnswer: {
                "@type": "Answer",
                text: item.answer!.trim(),
            },
        })),
    };
}

/**
 * Le formulaire de devis, décrit comme une action réservable. C'est ce qui
 * permet à un moteur de comprendre que la page n'est pas qu'une vitrine mais
 * un point d'entrée de réservation.
 */
function reserveAction(base: string) {
    return {
        "@type": "ReserveAction",
        name: "Demander un devis",
        target: {
            "@type": "EntryPoint",
            urlTemplate: `${base}/#devis`,
            inLanguage: "fr-FR",
            actionPlatform: [
                "https://schema.org/DesktopWebPlatform",
                "https://schema.org/MobileWebPlatform",
            ],
        },
        result: {
            "@type": "Reservation",
            name: "Demande de prestation DJ",
        },
        agent: {"@id": schemaId.organization(base)},
    };
}

/**
 * Graphe de la page d'accueil. Un seul bloc `@graph` plutôt que plusieurs
 * scripts : les nœuds peuvent alors se référencer par `@id` sans duplication.
 */
export function homeJsonLd(base: string, content: SiteContent, legal: LegalContent) {
    // Le titre du hero est rendu sur trois lignes : recollé tel quel il porte
    // les retours de mise en page, qu'on écrase par une espace simple.
    const title = [content.hero?.title?.line1, content.hero?.title?.highlight, content.hero?.title?.line2]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

    const nodes: Record<string, unknown>[] = [
        organization(base, content, legal),
        website(base),
        webpage(base, {
            path: "/",
            name: title || BRAND,
            description: DEFAULT_DESCRIPTION,
        }),
        ...services(base, content),
        reserveAction(base),
    ];

    const faq = faqPage(base, content);
    if (faq) nodes.push(faq);

    return {"@context": "https://schema.org", "@graph": nodes};
}

/**
 * Graphe d'une page d'atterrissage par type de prestation.
 *
 * Le nœud central est un `Service` — c'est ce que la page vend — rattaché à
 * l'`Organization` du site par `@id`. Le `FAQPage` reprend la FAQ propre à la
 * page, et non celle de l'accueil : réutiliser les mêmes questions sur six URL
 * ferait perdre le résultat enrichi sur toutes.
 */
export function landingPageJsonLd(base: string, page: LandingPage) {
    const url = `${base}/${page.slug}`;

    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${url}#webpage`,
                url,
                name: page.h1,
                description: page.metaDescription,
                inLanguage: "fr-FR",
                isPartOf: {"@id": schemaId.website(base)},
                about: {"@id": `${url}#service`},
                breadcrumb: {"@id": schemaId.breadcrumb(base, `/${page.slug}`)},
                primaryImageOfPage: `${base}${OG_IMAGE.url}`,
            },
            breadcrumb(base, `/${page.slug}`, page.navLabel),
            {
                "@type": "Service",
                "@id": `${url}#service`,
                name: page.navLabel,
                serviceType: page.navLabel,
                description: page.metaDescription,
                provider: {"@id": schemaId.organization(base)},
                areaServed: AREA_SERVED,
                url,
                // Le formulaire de devis vit sur l'accueil : on décrit le canal
                // réel plutôt que d'annoncer une réservation en ligne inexistante.
                offers: {
                    "@type": "Offer",
                    availability: "https://schema.org/InStock",
                    priceCurrency: "EUR",
                    url: `${base}/#devis`,
                },
            },
            {
                "@type": "FAQPage",
                "@id": `${url}#faq`,
                mainEntity: page.faq.map((item) => ({
                    "@type": "Question",
                    name: item.question,
                    acceptedAnswer: {"@type": "Answer", text: item.answer},
                })),
            },
        ],
    };
}

/**
 * Graphe d'une page de zone d'intervention.
 *
 * Seule différence de fond avec une page de prestation : `areaServed` porte
 * ici une `City` précise au lieu du pays. C'est le seul endroit du balisage où
 * la dimension géographique est affirmée — le site n'a qu'un établissement, et
 * déclarer une `LocalBusiness` distincte par ville reviendrait à revendiquer
 * des points de vente qui n'existent pas.
 */
export function cityPageJsonLd(base: string, page: CityPage) {
    const url = `${base}/${page.slug}`;

    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${url}#webpage`,
                url,
                name: page.h1,
                description: page.metaDescription,
                inLanguage: "fr-FR",
                isPartOf: {"@id": schemaId.website(base)},
                about: {"@id": `${url}#service`},
                breadcrumb: {"@id": schemaId.breadcrumb(base, `/${page.slug}`)},
                primaryImageOfPage: `${base}${OG_IMAGE.url}`,
            },
            breadcrumb(base, `/${page.slug}`, page.navLabel),
            {
                "@type": "Service",
                "@id": `${url}#service`,
                name: `DJ à ${page.city}`,
                serviceType: "Prestation DJ",
                description: page.metaDescription,
                provider: {"@id": schemaId.organization(base)},
                url,
                areaServed: [
                    {
                        "@type": "City",
                        name: page.city,
                        containedInPlace: {
                            "@type": "AdministrativeArea",
                            name: page.department,
                        },
                    },
                    // Les communes voisines sont annoncées en clair sur la page ;
                    // les omettre du balisage laisserait une partie du contenu
                    // sans équivalent structuré.
                    ...page.nearby.map((commune) => ({"@type": "City", name: commune})),
                ],
                offers: {
                    "@type": "Offer",
                    availability: "https://schema.org/InStock",
                    priceCurrency: "EUR",
                    url: `${base}/#devis`,
                },
            },
            {
                "@type": "FAQPage",
                "@id": `${url}#faq`,
                mainEntity: page.faq.map((item) => ({
                    "@type": "Question",
                    name: item.question,
                    acceptedAnswer: {"@type": "Answer", text: item.answer},
                })),
            },
        ],
    };
}

/** Graphe minimal des pages légales : identité + fil d'Ariane. */
export function legalPageJsonLd(
    base: string,
    path: string,
    {name, description}: { name: string; description: string }
) {
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": schemaId.webpage(base, path),
                url: `${base}${path}`,
                name,
                description,
                inLanguage: "fr-FR",
                isPartOf: {"@id": schemaId.website(base)},
                breadcrumb: {"@id": schemaId.breadcrumb(base, path)},
            },
            breadcrumb(base, path, name),
        ],
    };
}

/**
 * Types de prestation exposés en mots-clés. Sert les métadonnées de la page
 * d'accueil, pour que les intentions couvertes par le formulaire (séminaire,
 * festival, club…) apparaissent aussi hors des cartes de services.
 */
export const PRESTATION_KEYWORDS = Object.values(PRESTATION_TYPE_LABELS)
    .filter((label) => label !== "Autre")
    .map((label) => `DJ ${label.toLowerCase()}`);
