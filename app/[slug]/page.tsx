import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import JsonLd from '@/app/components/JsonLd';
import {SITE_URL} from '@/app/site-url';
import {LANDING_PAGES, findLandingPage} from '@/lib/landing-pages';
import {AREA_PAGES, findAreaPage} from '@/lib/area-pages';
import {areaPageJsonLd, landingPageJsonLd} from '@/lib/structured-data';
import {KEYWORDS, OG_IMAGE} from '@/lib/seo';
import PrestationLanding from '@/app/landing/PrestationLanding';
import AreaLanding from '@/app/landing/AreaLanding';
import styles from '@/app/landing/Landing.module.css';

/**
 * Pages d'atterrissage, servies à la racine (`/dj-mariage`, `/dj-paris`)
 * plutôt que sous un préfixe : l'URL est un signal de pertinence, et un
 * segment intermédiaire sans page propre n'en apporte aucun.
 *
 * Les deux familles — type de prestation et zone d'intervention — partagent ce
 * segment parce que Next n'autorise qu'un seul segment dynamique par niveau.
 * Leurs slugs ne peuvent pas entrer en collision : les uns nomment une
 * prestation, les autres un territoire.
 *
 * Les trois niveaux de zone (région, département, ville) vivent eux aussi à
 * plat plutôt que sous `/dj-ile-de-france/dj-essonne/…` : une URL courte se
 * partage mieux, et la hiérarchie est déjà portée par le fil d'Ariane et le
 * maillage, qui sont les signaux que Google lit réellement.
 *
 * Le segment ne met pas en danger les routes existantes : un segment statique
 * (`/admin`, `/login`…) l'emporte toujours sur un segment dynamique de même
 * niveau.
 */

// Sans cela, une URL inventée serait traitée comme dynamique et rendue en 200.
export const dynamicParams = false;

export function generateStaticParams() {
    return [...LANDING_PAGES, ...AREA_PAGES].map((page) => ({slug: page.slug}));
}

export async function generateMetadata(
    {params}: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const {slug} = await params;
    const page = findLandingPage(slug) ?? findAreaPage(slug);

    if (!page) return {};

    const url = `/${page.slug}`;

    return {
        title: page.metaTitle,
        description: page.metaDescription,
        // Mots-clés propres à la page d'abord, tronc commun ensuite.
        keywords: [...page.keywords, ...KEYWORDS],
        alternates: {canonical: url},
        openGraph: {
            type: 'article',
            url,
            title: page.metaTitle,
            description: page.metaDescription,
            images: [OG_IMAGE],
        },
        twitter: {
            card: 'summary_large_image',
            title: page.metaTitle,
            description: page.metaDescription,
            images: [OG_IMAGE.url],
        },
    };
}

export default async function LandingPageRoute(
    {params}: { params: Promise<{ slug: string }> }
) {
    const {slug} = await params;

    const prestation = findLandingPage(slug);
    const area = prestation ? undefined : findAreaPage(slug);

    if (!prestation && !area) notFound();

    return (
        <div className={styles.page}>
            {prestation ? (
                <>
                    <JsonLd data={landingPageJsonLd(SITE_URL, prestation)}/>
                    <PrestationLanding page={prestation}/>
                </>
            ) : (
                <>
                    <JsonLd data={areaPageJsonLd(SITE_URL, area!)}/>
                    <AreaLanding page={area!}/>
                </>
            )}
        </div>
    );
}
