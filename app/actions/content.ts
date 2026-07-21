'use server';

import { revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/require-admin';


export async function refreshSiteContent() {
  try {
    await requireAdmin();

    // Purge le cache lié au tag 'site-content'
    revalidateTag('site-content', 'max');
    return { success: true, message: 'Le cache a été vidé. Le prochain chargement récupérera les nouvelles données.' };
  } catch (error) {
    console.error('Erreur lors de la revalidation:', error);
    return { success: false, message: 'Erreur lors du rafraîchissement.' };
  }
}
