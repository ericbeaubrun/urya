import Link from 'next/link';
import type {CityPage} from '@/lib/city-pages';
import {findCityPage} from '@/lib/city-pages';
import {LANDING_PAGES} from '@/lib/landing-pages';
import styles from './Landing.module.css';
import {BackHome, Breadcrumb, ContentSection, Cta, FaqList, RelatedGrid, renderEmphasis} from './parts';

/** Gabarit des pages de zone d'intervention (`/dj-paris`, `/dj-melun`…). */
export default function CityLanding({page}: { page: CityPage }) {
    const relatedCities = page.related
        .map((slug) => findCityPage(slug))
        .filter((item): item is CityPage => Boolean(item))
        .map((item) => ({slug: item.slug, label: item.navLabel}));

    return (
        <div className={styles.container}>
            <Breadcrumb label={page.navLabel}/>

            <header>
                <span className={styles.eyebrow}>Zone d&apos;intervention · {page.department}</span>
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

            {/* Les communes couvertes sont du texte, pas des liens : leur créer
                une page à chacune produirait exactement les pages sans contenu
                propre que ce format doit éviter. */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Communes couvertes</h2>
                <p>
                    Depuis {page.city}, j&apos;interviens également à{' '}
                    {page.nearby.slice(0, -1).join(', ')} et {page.nearby[page.nearby.length - 1]},
                    ainsi que dans les communes alentour.
                </p>
                <ul className={styles.tagList}>
                    {page.nearby.map((commune) => (
                        <li className={styles.tag} key={commune}>{commune}</li>
                    ))}
                </ul>
            </section>

            {/* Croisement ville → prestation : c'est ce maillage qui permet à une
                page de ville de renforcer les pages de prestation, et l'inverse. */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Prestations à {page.city}</h2>
                <div className={styles.relatedGrid}>
                    {LANDING_PAGES.map((prestation) => (
                        <Link
                            key={prestation.slug}
                            href={`/${prestation.slug}`}
                            className={styles.relatedCard}
                        >
                            {prestation.navLabel}
                        </Link>
                    ))}
                </div>
            </section>

            <FaqList items={page.faq}/>

            <Cta
                text={`Indiquez votre date et le lieu exact à ${page.city} : vous recevez une réponse et un devis sous 24 heures.`}
            />

            <RelatedGrid title="Autres secteurs" links={relatedCities}/>

            <BackHome/>
        </div>
    );
}
