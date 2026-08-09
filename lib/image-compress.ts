import {MAX_IMAGE_DIMENSION} from "@/lib/gallery";

/**
 * Compression d'image côté navigateur, avant envoi.
 *
 * Le site tient aujourd'hui en quelques centaines de kilooctets et se charge en
 * une centaine de millisecondes ; publier depuis l'admin une photo de téléphone
 * de six mégaoctets ruinerait ce budget sur la seule section galerie, et sur
 * mobile en priorité. La réduction a donc lieu ici, pas côté serveur : elle
 * épargne aussi la bande passante de l'envoi, souvent le maillon lent quand on
 * publie depuis un téléphone.
 */

/** Qualité WebP. 0,82 tient le grain d'une photo de soirée sans halo visible. */
const WEBP_QUALITY = 0.82;

function targetSize(width: number, height: number) {
    const longest = Math.max(width, height);
    if (longest <= MAX_IMAGE_DIMENSION) return {width, height};

    const ratio = MAX_IMAGE_DIMENSION / longest;
    return {
        width: Math.round(width * ratio),
        height: Math.round(height * ratio),
    };
}

/**
 * Renvoie une version réduite et convertie en WebP, ou le fichier d'origine si
 * le navigateur ne sait pas produire ce format. Ce repli n'est pas théorique :
 * il couvre les Safari anciens, où `toBlob` rend un PNG sans prévenir. Mieux
 * vaut alors envoyer l'original — le serveur en contrôle de toute façon le
 * type et le poids.
 */
export async function compressImage(file: File): Promise<File> {
    if (typeof createImageBitmap !== "function") return file;

    let bitmap: ImageBitmap;
    try {
        // `imageOrientation` applique la rotation EXIF : sans elle, les photos
        // prises en portrait arrivent couchées sur le site.
        bitmap = await createImageBitmap(file, {imageOrientation: "from-image"});
    } catch {
        return file;
    }

    try {
        const {width, height} = targetSize(bitmap.width, bitmap.height);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        if (!context) return file;

        context.drawImage(bitmap, 0, 0, width, height);

        const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(resolve, "image/webp", WEBP_QUALITY);
        });

        if (!blob || blob.type !== "image/webp") return file;

        // Compresser une image déjà optimisée peut l'alourdir : on ne garde le
        // résultat que s'il fait réellement gagner du poids.
        if (blob.size >= file.size && bitmap.width === width) return file;

        const name = file.name.replace(/\.[^.]+$/, "") || "image";

        return new File([blob], `${name}.webp`, {type: "image/webp"});
    } finally {
        bitmap.close();
    }
}
