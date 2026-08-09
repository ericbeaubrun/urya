'use server';

import {updateSiteContent as updateInDB, type SiteContent} from '@/lib/content';
import {requireAdmin} from '@/lib/require-admin';
import {pruneGalleryStorage} from '@/lib/gallery-storage';
import {revalidateTag} from 'next/cache';

export async function saveAndRefreshContent(newContent: SiteContent) {
    try {
        await requireAdmin();

        const {error} = await updateInDB(newContent);
        if (error) throw new Error(error.message);

        // Après l'écriture seulement : le contenu enregistré fait foi pour
        // décider quels visuels de galerie sont encore utiles.
        await pruneGalleryStorage(newContent.gallery?.images);

        revalidateTag('site-content', 'max');

        return {success: true, message: 'Contenu sauvegardé et cache rafraîchi !'};
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du contenu:', error);

        const detail = error instanceof Error ? error.message : 'Erreur inconnue';

        return {
            success: false,
            message: `Erreur durant la sauvegarde : ${detail}`,
        };
    }
}
