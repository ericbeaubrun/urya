import {supabaseAdmin} from "@/lib/supabase_client";
import {GALLERY_BUCKET, referencedGalleryObjects} from "@/lib/gallery";
import type {GalleryImage} from "@/lib/site-content";

/**
 * Entretien du bucket de galerie.
 *
 * Ce module n'est délibérément PAS marqué `'use server'` : dans un tel fichier,
 * chaque export devient un point d'entrée HTTP public que n'importe qui peut
 * appeler avec les arguments de son choix. Une fonction dont le contrat est
 * « supprime tout ce qui n'est pas dans cette liste » y serait une porte
 * ouverte — un appel avec une liste vide viderait le bucket. Elle reste donc
 * une fonction ordinaire, appelable seulement depuis du code serveur déjà
 * passé par `requireAdmin()`.
 */

/**
 * Supprime du bucket les visuels que le contenu ne référence plus.
 *
 * À appeler APRÈS une sauvegarde réussie, jamais au retrait d'une vignette dans
 * l'éditeur : tant que le JSON n'est pas enregistré, le site public pointe
 * encore sur le fichier, et l'effacer casserait la galerie en ligne pour un
 * retrait que l'admin peut encore annuler en quittant la page sans sauver.
 *
 * Ce balayage ramasse au passage les envois abandonnés — un visuel téléversé
 * puis jamais enregistré n'est référencé nulle part.
 */
export async function pruneGalleryStorage(images: GalleryImage[] | undefined): Promise<void> {
    try {
        const keep = referencedGalleryObjects(images);
        const storage = supabaseAdmin().storage.from(GALLERY_BUCKET);

        const {data, error} = await storage.list("", {limit: 1000});
        if (error) throw new Error(error.message);

        const orphans = (data ?? [])
            .map((object) => object.name)
            .filter((name) => !keep.has(name));

        if (!orphans.length) return;

        const {error: removeError} = await storage.remove(orphans);
        if (removeError) throw new Error(removeError.message);
    } catch (error) {
        // Un orphelin qui survit ne coûte que quelques kilooctets et sera repris
        // au prochain enregistrement : cet échec ne doit jamais faire échouer
        // une sauvegarde de contenu par ailleurs réussie.
        console.error("[gallery] Nettoyage du stockage incomplet :", error);
    }
}
