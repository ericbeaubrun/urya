import Link from 'next/link';
import type {AreaPage} from '@/lib/area-pages';
import {areaAncestors, areaChildren, findAreaPage} from '@/lib/area-pages';
import {LANDING_PAGES} from '@/lib/landing-pages';
import styles from './Landing.module.css';
import {BackHome, Breadcrumb, ContentSection, Cta, FaqList, RelatedGrid, renderEmphasis} from './parts';

/** Titre du bloc de descente, selon le niveau du territoire courant. */
const CHILDREN_TITLE: Record<AreaPage['level'], string> = {
    region: 'Département par département',
    department: 'Secteurs détaillés',
    city: 'Secteurs détaillés',
};

/** Gabarit des pages de zone (`/dj-ile-de-france`, `/dj-essonne`, `/dj-melun`…). */
export default function AreaLanding({page}: { page: AreaPage }) {
    const ancestors = areaAncestors(page).map((item) => ({
        slug: item.slug,
        label: item.navLabel,
    }));

    const children = areaChildren(page).map((item) => ({
        slug: item.slug,
        label: item.navLabel,
    }));

    const relatedAreas = page.related
        .map((slug) => findAreaPage(slug))
        .filter((item): item is AreaPage => Boolean(item))
        .map((item) => ({slug: item.slug, label: item.navLabel}));

    return (
        <div className={styles.container}>
            <Breadcrumb label={page.navLabel} trail={ancestors}/>

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

            {/* Descente d'un niveau. C'est ce lien vers le bas — doublé du lien
                remontant du fil d'Ariane — qui fait tenir la hiérarchie : sans
                lui, les pages de niveau inférieur ne reçoivent aucune autorité
                de leur parent. */}
            <RelatedGrid title={CHILDREN_TITLE[page.level]} links={children}/>

            {/* Les territoires couverts sont du texte, pas des liens : créer une
                page à chaque commune produirait exactement les pages sans
                contenu propre que ce format doit éviter. */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{page.coverage.title}</h2>
                <p>{page.coverage.intro}</p>
                <ul className={styles.tagList}>
                    {page.coverage.items.map((item) => (
                        <li className={styles.tag} key={item}>{item}</li>
                    ))}
                </ul>
            </section>

            {/* Croisement zone → prestation : c'est ce maillage qui permet à une
                page de zone de renforcer les pages de prestation, et l'inverse. */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Prestations {page.inLabel}</h2>
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
                text={`Indiquez votre date et le lieu exact ${page.inLabel} : vous recevez une réponse et un devis sous 24 heures.`}
            />

            <RelatedGrid title="Autres secteurs" links={relatedAreas}/>

            <BackHome/>
        </div>
    );
}
