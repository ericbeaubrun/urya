import {supabase_client, supabaseAdmin} from "@/lib/supabase_client";

import {unstable_cache} from 'next/cache';

/** Contenu éditorial du site, structure libre pilotée par l'éditeur admin. */
export type SiteContent = Record<string, unknown>;

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

export const getSiteContent = unstable_cache(
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
