/**
 * Référentiel SEO du site.
 *
 * Le contenu éditorial (titres, textes, FAQ) vit en base et change depuis
 * l'admin ; ce fichier ne contient que ce qui doit rester stable pour les
 * moteurs — la formulation des balises `title`/`description`, le périmètre
 * géographique et l'identité du prestataire.
 *
 * Positionnement : national. Les métadonnées ne mentionnent donc pas de
 * département, et `AREA_SERVED` déclare la France entière aux moteurs.
 */

export const BRAND = "DJ URYA";

/**
 * Titre par défaut. Reste sous ~60 caractères pour ne pas être tronqué dans
 * les résultats de recherche.
 */
export const DEFAULT_TITLE = "DJ URYA – DJ Mariage, Anniversaire & Entreprise";

/**
 * Titre complet de la page d'accueil (balise `<title>` uniquement, où la
 * troncature est moins pénalisante que sur un titre de section).
 */
export const HOME_TITLE =
    "DJ URYA – DJ professionnel mariage, anniversaire & entreprise en France";

export const DEFAULT_DESCRIPTION =
    "DJ professionnel pour mariages, anniversaires, soirées privées et événements " +
    "d'entreprise partout en France. Sonorisation, éclairage et animation sur mesure. " +
    "Devis gratuit sous 24 h.";

/** Requêtes cibles, reprises dans les `keywords` et les données structurées. */
export const KEYWORDS = [
    "DJ mariage",
    "DJ professionnel",
    "DJ anniversaire",
    "DJ soirée privée",
    "DJ événement entreprise",
    "DJ séminaire",
    "animation mariage",
    "sonorisation événement",
    "réserver un DJ",
    "devis DJ",
];

/** Locale au format Open Graph. */
export const LOCALE = "fr_FR";

/** Zone d'intervention déclarée dans le JSON-LD. */
export const AREA_SERVED = {
    "@type": "Country",
    name: "France",
} as const;

/**
 * Image de partage. Générée à la volée par `app/opengraph-image.tsx`, mais on
 * garde ses dimensions ici : elles sont réutilisées par le JSON-LD, qui ne peut
 * pas les déduire de la convention de fichier Next.
 */
export const OG_IMAGE = {
    url: "/opengraph-image",
    width: 1200,
    height: 630,
    alt: `${BRAND} – DJ professionnel pour mariages et événements`,
} as const;

/**
 * Identifiants stables des nœuds JSON-LD. Le graphe se référence lui-même par
 * ces `@id` plutôt que de dupliquer les objets, ce que Google recommande pour
 * relier `Organization`, `WebSite` et `WebPage`.
 */
export const schemaId = {
    organization: (base: string) => `${base}/#organization`,
    website: (base: string) => `${base}/#website`,
    webpage: (base: string, path = "/") => `${base}${path === "/" ? "/" : path}#webpage`,
    breadcrumb: (base: string, path = "/") => `${base}${path === "/" ? "/" : path}#breadcrumb`,
};
