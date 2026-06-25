import {supabase_client, supabaseAdmin} from "@/lib/supabase_client";

import {unstable_cache} from 'next/cache';

async function fetchSiteContent() {
    console.log('--- [DB] Tentative de récupération pour ID 1 ---');
    try {
        const {data, error} = await supabase_client
            .from('site_content')
            .select('content')
            .eq('id', 1)
            .single();

        if (error) {
            console.error('--- [DB] ERREUR SUPABASE:', error); // Affiche l'erreur réelle
            return null;
        }

        console.log('--- [DB] Données reçues:', data); // Vérifiez si c'est null ou un objet
        return data?.content || null;
    } catch (err) {
        console.error('--- [DB] ERREUR CRITIQUE:', err);
        return null;
    }
}
// export const getSiteContent = unstable_cache(
//     async () => {
//         return fetchSiteContent();
//     },
//     ['site-content-v1'],
//     {
//         revalidate: false, // Cache permanent
//         tags: ['site-content'], // Tag pour le rafraîchissement manuel
//     }
// );

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
        // revalidate: 3600,
        tags: ['site-content'],
    }
);


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateSiteContent(content: any) {
    try {
        const client = supabaseAdmin();
        const { data, error } = await client
            .from('site_content')
            .upsert({ id: 1, content });

        if (error) {
            console.error('Erreur DB:', error);
            return { error };
        }
        return { error: null };
    } catch (err) {
        console.error('Erreur Réseau/Auth:', err);
        return { error: { message: err instanceof Error ? err.message : 'Erreur inconnue' } };
    }
}
