'use server';

import { updateSiteContent as updateInDB } from '@/lib/content';
import { revalidateTag } from 'next/cache';

export async function saveAndRefreshContent(newContent: any) {
  try {
    // 1. Mise à jour en base de données
    const { error } = await updateInDB(newContent);
    if (error) throw error;

    // 2. Purge du cache
    revalidateTag('site-content', 'layout');

    return { success: true, message: 'Contenu sauvegardé et cache rafraîchi !' };
  } catch (error: any) {
    console.error('Erreur lors de la sauvegarde du contenu:', error);
    return { success: false, message: error.message || 'Erreur lors de la sauvegarde.' };
  }
}
