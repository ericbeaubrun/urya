import type {GalleryImage} from "@/lib/site-content";

/**
 * Règles communes à la galerie éditable.
 *
 * Les visuels téléversés depuis l'admin vivent dans un bucket Supabase Storage
 * public, et non dans `public/` : sur Vercel, le système de fichiers est en
 * lecture seule à l'exécution, un envoi depuis l'admin n'aurait donc nulle part
 * où atterrir sans redéploiement.
 */

export const GALLERY_BUCKET = "gallery";

/**
 * La grille de la galerie est calibrée pour cinq visuels : une grande carte en
 * 2×2 plus quatre normales remplissent exactement les quatre colonnes du rendu
 * de bureau. Au-delà, la dernière rangée reste incomplète.
 */
export const MAX_GALLERY_IMAGES = 5;

/** Formats acceptés à l'envoi, alignés sur ceux déclarés sur le bucket. */
export const ALLOWED_IMAGE_TYPES = ["image/webp", "image/jpeg", "image/png"] as const;

/**
 * Plafond appliqué après compression côté navigateur. Une photo de téléphone
 * pèse plusieurs mégaoctets à la prise ; elle est ramenée à quelques centaines
 * de kilooctets avant de partir. Ce plafond n'est donc pas la taille attendue,
 * mais le garde-fou qui attrape les cas où la compression n'a pas pu opérer.
 */
export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;

/** Côté le plus long, en pixels, après redimensionnement. */
export const MAX_IMAGE_DIMENSION = 1600;

const PUBLIC_PATH_MARKER = `/storage/v1/object/public/${GALLERY_BUCKET}/`;

/**
 * Nom de l'objet de stockage désigné par une source d'image, ou `null` si
 * l'image n'en vient pas.
 *
 * Ce `null` est ce qui protège les visuels d'origine (`/dj-urya_4.webp`, servis
 * depuis `public/` et versionnés avec le code) : le ramasse-miettes ne peut pas
 * les prendre pour des fichiers téléversés devenus inutiles.
 */
export function galleryObjectName(src: string | undefined): string | null {
    if (!src) return null;

    const index = src.indexOf(PUBLIC_PATH_MARKER);
    if (index === -1) return null;

    const name = src.slice(index + PUBLIC_PATH_MARKER.length).split(/[?#]/)[0];

    // Un nom vide ou porteur de séparateurs ne peut pas venir de nos envois,
    // qui déposent des UUID à plat à la racine du bucket.
    return name && !name.includes("/") ? name : null;
}

/** Noms d'objets encore référencés par le contenu, donc à conserver. */
export function referencedGalleryObjects(images: GalleryImage[] | undefined): Set<string> {
    const names = new Set<string>();
    if (!Array.isArray(images)) return names;

    for (const image of images) {
        const name = galleryObjectName(image.src);
        if (name) names.add(name);
    }

    return names;
}
