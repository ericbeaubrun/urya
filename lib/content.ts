import {supabase_client, supabaseAdmin} from "@/lib/supabase_client";

import {unstable_cache} from 'next/cache';

async function fetchSiteContent() {
    console.log('--- [DB] REQUÊTE RÉELLE À SUPABASE ---');
    try {
        const {data, error} = await supabase_client
            .from('site_content')
            .select('content')
            .eq('id', 1)
            .single();

        if (error) {
            console.error('--- [DB] ERREUR:', error.message);
            return null;
        }

        return data?.content || null;
    } catch (err) {
        console.error('--- [DB] ERREUR CRITIQUE:', err);
        return null;
    }
}

export const getSiteContent = unstable_cache(
    async () => {
        return fetchSiteContent();
    },
    ['site-content-v1'],
    {
        revalidate: false, // Cache permanent
        tags: ['site-content'], // Tag pour le rafraîchissement manuel
    }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateSiteContent(content: any) {
    const {error} = await supabaseAdmin()
        .from('site_content')
        .upsert({id: 1, content});
    return {error};
}
