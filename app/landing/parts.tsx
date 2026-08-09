import {Fragment} from 'react';
import Link from 'next/link';
import styles from './Landing.module.css';

/**
 * Briques communes aux pages de prestation et aux pages de ville.
 *
 * Les deux gabarits partagent leur ossature (fil d'Ariane, FAQ, appel à
 * l'action, maillage) mais pas leur contenu. C'est la structure qui se
 * factorise ici ; le texte reste propre à chaque page, faute de quoi on
 * retomberait sur les pages dupliquées que ce découpage cherche à éviter.
 */

/** Rend `**gras**`, même convention que les descriptions de `About`. */
export function renderEmphasis(text: string) {
    return text.split('**').map((part, i) =>
        i % 2 === 1 ? <strong key={i} className={styles.strong}>{part}</strong> : part
    );
}

/**
 * `trail` porte les niveaux intermédiaires cliquables (région, département) ;
 * `label` reste la page courante, non cliquable. Le fil d'Ariane HTML doit
 * refléter exactement le `BreadcrumbList` du JSON-LD, faute de quoi Google
 * ignore les deux.
 */
export function Breadcrumb({
    label,
    trail = [],
}: {
    label: string;
    trail?: { slug: string; label: string }[];
}) {
    return (
        <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link>
            {trail.map((step) => (
                <Fragment key={step.slug}>
                    <span aria-hidden="true">/</span>
                    <Link href={`/${step.slug}`}>{step.label}</Link>
                </Fragment>
            ))}
            <span aria-hidden="true">/</span>
            <span className={styles.breadcrumbCurrent}>{label}</span>
        </nav>
    );
}

export interface Section {
    title: string;
    body?: string[];
    bullets?: string[];
}

export function ContentSection({section}: { section: Section }) {
    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            {section.body?.map((paragraph, i) => (
                <p key={i}>{renderEmphasis(paragraph)}</p>
            ))}
            {section.bullets && (
                <ul className={styles.bullets}>
                    {section.bullets.map((bullet, i) => (
                        <li className={styles.bullet} key={i}>
                            {renderEmphasis(bullet)}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

/**
 * `details` natif plutôt qu'un accordéon JavaScript : la réponse figure dans
 * le HTML servi, ce qu'exige Google pour valider le balisage `FAQPage`.
 */
export function FaqList({items}: { items: { question: string; answer: string }[] }) {
    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Questions fréquentes</h2>
            <div className={styles.faqList}>
                {items.map((item) => (
                    <details className={styles.faqItem} key={item.question}>
                        <summary className={styles.faqQuestion}>{item.question}</summary>
                        <p className={styles.faqAnswer}>{item.answer}</p>
                    </details>
                ))}
            </div>
        </section>
    );
}

export function Cta({text}: { text: string }) {
    return (
        <section className={styles.cta}>
            <h2 className={styles.ctaTitle}>Vérifier ma date</h2>
            <p className={styles.ctaText}>{text}</p>
            <Link href="/#devis" className={styles.ctaButton}>
                Demander un devis gratuit
            </Link>
        </section>
    );
}

/** Maillage interne : sans ces liens, les pages ne reçoivent aucune autorité. */
export function RelatedGrid({
    title,
    links,
}: {
    title: string;
    links: { slug: string; label: string }[];
}) {
    if (!links.length) return null;

    return (
        <section className={styles.related}>
            <h2 className={styles.relatedTitle}>{title}</h2>
            <div className={styles.relatedGrid}>
                {links.map((link) => (
                    <Link key={link.slug} href={`/${link.slug}`} className={styles.relatedCard}>
                        {link.label}
                    </Link>
                ))}
            </div>
        </section>
    );
}

export function BackHome() {
    return (
        <Link href="/" className={styles.backHome}>&larr; Retour à l&apos;accueil</Link>
    );
}
