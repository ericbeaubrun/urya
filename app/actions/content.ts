'use server';

import { revalidateTag } from 'next/cache';

/**
 * Action pour forcer le rafraîchissement du contenu du site
 */
export async function refreshSiteContent() {
  console.log('>>> [ACTION] PURGE DU CACHE CONTENU SOLICITÉE');
  try {
    // Purge le cache lié au tag 'site-content'
    revalidateTag('site-content','layout');
    return { success: true, message: 'Le cache a été vidé. Le prochain chargement récupérera les nouvelles données.' };
  } catch (error) {
    console.error('Erreur lors de la revalidation:', error);
    return { success: false, message: 'Erreur lors du rafraîchissement.' };
  }
}
