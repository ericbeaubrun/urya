import {supabase_client, supabaseAdmin} from "@/lib/supabase_client";

import {unstable_cache} from 'next/cache';

export type {SiteContent} from "@/lib/site-content";

import type {SiteContent} from "@/lib/site-content";

async function fetchSiteContent(): Promise<SiteContent | null> {
    try {
        const {data, error} = await supabase_client
            .from('site_content')
            .select('content')
            .eq('id', 1)
            .single();

        if (error) {
            console.error('[content] Lecture Supabase échouée:', error.message);
            return null;
        }

        return (data?.content as SiteContent) ?? null;
    } catch (err) {
        console.error('[content] Erreur réseau lors de la lecture:', err);
        return null;
    }
}

/**
 * Le `throw` est volontaire : `unstable_cache` mémorise la valeur retournée,
 * donc renvoyer `null` ici gèlerait une panne Supabase passagère dans le cache
 * jusqu'à la prochaine revalidation. Lever une erreur laisse le cache vide.
 */
const getCachedSiteContent = unstable_cache(
    async () => {
        const content = await fetchSiteContent();

        if (!content) {
            throw new Error("Contenu indisponible : impossible de mettre en cache.");
        }

        return content;
    },
    ['site-content-v1'],
    {
        tags: ['site-content'],
    }
);

/**
 * Point d'entrée des pages. Absorbe l'erreur du cache et renvoie `null` pour
 * que l'appelant puisse afficher une page de maintenance plutôt qu'un 500.
 */
export async function getSiteContent(): Promise<SiteContent | null> {
    try {
        return await getCachedSiteContent();
    } catch (err) {
        console.error('[content] Contenu indisponible:', err);
        return null;
    }
}


export async function updateSiteContent(content: SiteContent) {
    try {
        const {error} = await supabaseAdmin()
            .from('site_content')
            .upsert({id: 1, content});

        if (error) {
            console.error('[content] Écriture Supabase échouée:', error.message);
            return {error};
        }

        return {error: null};
    } catch (err) {
        console.error('[content] Erreur réseau lors de l\'écriture:', err);
        return {error: {message: err instanceof Error ? err.message : 'Erreur inconnue'}};
    }
}
