import type {LandingPage} from '@/lib/landing-pages';
import {findLandingPage} from '@/lib/landing-pages';
import styles from './Landing.module.css';
import {BackHome, Breadcrumb, ContentSection, Cta, FaqList, RelatedGrid, renderEmphasis} from './parts';

/** Gabarit des pages par type de prestation (`/dj-mariage`, `/dj-entreprise`…). */
export default function PrestationLanding({page}: { page: LandingPage }) {
    const related = page.related
        .map((slug) => findLandingPage(slug))
        .filter((item): item is LandingPage => Boolean(item))
        .map((item) => ({slug: item.slug, label: item.navLabel}));

    return (
        <div className={styles.container}>
            <Breadcrumb label={page.navLabel}/>

            <header>
                <span className={styles.eyebrow}>{page.eyebrow}</span>
                <h1 className={styles.title}>{page.h1}</h1>
                <div className={styles.intro}>
                    {page.intro.map((paragraph, i) => (
                        <p key={i}>{renderEmphasis(paragraph)}</p>
                    ))}
                </div>
            </header>

            {page.sections.map((section) => (
                <ContentSection key={section.title} section={section}/>
            ))}

            <FaqList items={page.faq}/>

            <Cta
                text="Indiquez votre date et le type d'événement : vous recevez une réponse et un devis sous 24 heures."
            />

            <RelatedGrid title="Autres prestations" links={related}/>

            <BackHome/>
        </div>
    );
}
