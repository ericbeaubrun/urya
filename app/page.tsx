import type {Metadata} from 'next';
import {getSiteContent} from '@/lib/content';
import {getLegalContent} from '@/app/legal/legal.config';
import {ContentProvider} from './ContentContext';
import HomeClient from './HomeClient';
import JsonLd from './components/JsonLd';
import {SITE_URL} from './site-url';
import {DEFAULT_DESCRIPTION, HOME_TITLE, KEYWORDS, OG_IMAGE} from '@/lib/seo';
import {PRESTATION_KEYWORDS, homeJsonLd} from '@/lib/structured-data';
import {redirect} from 'next/navigation';

/**
 * La `description` reste celle de `lib/seo.ts` et n'est pas dérivée du hero :
 * le sous-titre affiché est un slogan (« Ensemble créons des souvenirs… »),
 * sans les termes sur lesquels on veut être trouvé. L'extrait de résultat de
 * recherche a un autre travail à faire que l'accroche visuelle, et se pilote
 * donc séparément.
 */
export function generateMetadata(): Metadata {
    const description = DEFAULT_DESCRIPTION;

    return {
        title: HOME_TITLE,
        description,
        keywords: [...KEYWORDS, ...PRESTATION_KEYWORDS],
        alternates: {canonical: '/'},
        openGraph: {
            type: 'website',
            url: '/',
            title: HOME_TITLE,
            description,
            images: [OG_IMAGE],
        },
        twitter: {
            card: 'summary_large_image',
            title: HOME_TITLE,
            description,
            images: [OG_IMAGE.url],
        },
    };
}

export default async function Home() {
    // Les deux lectures sont indépendantes : les séquencer ajouterait un
    // aller-retour Supabase au rendu de la page la plus visitée du site.
    const [content, legal] = await Promise.all([getSiteContent(), getLegalContent()]);

    if (!content) {
        redirect('/maintenance');
    }

    return (
        <ContentProvider content={content}>
            <JsonLd data={homeJsonLd(SITE_URL, content, legal)}/>
            <HomeClient/>
        </ContentProvider>
    );
}
