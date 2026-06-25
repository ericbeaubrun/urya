'use server';

import {updateSiteContent as updateInDB} from '@/lib/content';
import {revalidateTag} from 'next/cache';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveAndRefreshContent(newContent: any) {
    try {
        const {error} = await updateInDB(newContent);
        if (error) throw error;

        revalidateTag('site-content', 'max');

        return {success: true, message: 'Contenu sauvegardé et cache rafraîchi !'};
    }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
        console.error('Erreur lors de la sauvegarde du contenu:', error);
        return {
            success: false,
            message: "Erreur suivante durant la sauvegarde : " + error.message || 'Erreur inconnue lors de la sauvegarde.'
        };
    }
}
