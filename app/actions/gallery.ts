'use server';

import {requireAdmin} from '@/lib/require-admin';
import {supabaseAdmin} from '@/lib/supabase_client';
import {ALLOWED_IMAGE_TYPES, GALLERY_BUCKET, MAX_UPLOAD_BYTES} from '@/lib/gallery';

/**
 * Ce fichier est un module `'use server'` : chacun de ses exports est un point
 * d'entrée HTTP public. On n'y expose donc que des actions qui commencent par
 * `requireAdmin()`. Le ménage du bucket, dont le contrat est destructif, vit
 * dans `lib/gallery-storage.ts` pour ne pas être appelable de l'extérieur.
 */

export interface UploadResult {
    success: boolean;
    url?: string;
    message?: string;
}

/**
 * Reçoit un visuel de galerie et le dépose dans le bucket public.
 *
 * Les contrôles de type et de poids sont refaits ici bien qu'ils existent déjà
 * côté navigateur : une Server Action est un point d'entrée HTTP public, et
 * rien n'oblige l'appelant à être passé par notre formulaire.
 */
export async function uploadGalleryImage(formData: FormData): Promise<UploadResult> {
    try {
        await requireAdmin();

        const file = formData.get('file');
        if (!(file instanceof File) || file.size === 0) {
            return {success: false, message: "Aucun fichier reçu."};
        }

        if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
            return {
                success: false,
                message: `Format non accepté (${file.type || 'inconnu'}). Utilisez JPEG, PNG ou WebP.`,
            };
        }

        if (file.size > MAX_UPLOAD_BYTES) {
            const mo = (file.size / (1024 * 1024)).toFixed(1);
            return {success: false, message: `Image trop lourde (${mo} Mo) même après compression.`};
        }

        const extension = file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1];
        // Nom tiré au sort plutôt que repris du fichier d'origine : celui-ci
        // vient du poste de l'admin, peut contenir n'importe quel caractère, et
        // deux envois successifs de « photo.jpg » s'écraseraient l'un l'autre.
        const name = `${crypto.randomUUID()}.${extension}`;

        const storage = supabaseAdmin().storage.from(GALLERY_BUCKET);

        const {error} = await storage.upload(name, file, {
            contentType: file.type,
            // Le nom est unique et jamais réutilisé : le fichier peut donc être
            // mis en cache aussi longtemps que possible.
            cacheControl: '31536000',
            upsert: false,
        });

        if (error) throw new Error(error.message);

        return {success: true, url: storage.getPublicUrl(name).data.publicUrl};
    } catch (error) {
        console.error('[gallery] Envoi impossible :', error);

        const detail = error instanceof Error ? error.message : 'Erreur inconnue';
        return {success: false, message: `Envoi impossible : ${detail}`};
    }
}
