import type { Metadata } from 'next';
import Link from 'next/link';
import LegalShell from '@/app/legal/LegalShell';
import LegalValue from '@/app/legal/LegalValue';
import { getLegalContent } from '@/app/legal/legal.config';
import styles from '@/app/legal/Legal.module.css';

export const metadata: Metadata = {
    title: 'Mentions légales – DJ URYA',
    description: 'Mentions légales du site DJ URYA : éditeur, hébergeur, propriété intellectuelle et responsabilité.',
    robots: { index: true, follow: true },
};

// Rendu à la demande : les informations légales sont éditées depuis l'admin et
// doivent apparaître dès l'enregistrement, sans rebuild.
export const dynamic = 'force-dynamic';

export default async function MentionsLegalesPage() {
    const { editor, host, publicationDirector, siteName, siteUrl, lastUpdate } = await getLegalContent();

    return (
        <LegalShell title="Mentions légales" lastUpdate={lastUpdate}>
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>1. Éditeur du site</h2>
                <div className={`${styles.card} ${styles.definitions}`}>
                    <div className={styles.definitionRow}>
                        <span className={styles.definitionTerm}>Éditeur</span>
                        <span className={styles.definitionValue}>
                            <LegalValue value={editor.name} label="Éditeur" />
                        </span>
                    </div>
                    <div className={styles.definitionRow}>
                        <span className={styles.definitionTerm}>Forme juridique</span>
                        <span className={styles.definitionValue}>
                            <LegalValue value={editor.legalForm} label="Forme juridique" />
                            {editor.capital ? ` au capital de ${editor.capital}` : ''}
                        </span>
                    </div>
                    <div className={styles.definitionRow}>
                        <span className={styles.definitionTerm}>Adresse</span>
                        <span className={styles.definitionValue}>
                            <LegalValue value={editor.address} label="Adresse" />
                        </span>
                    </div>
                    <div className={styles.definitionRow}>
                        <span className={styles.definitionTerm}>SIRET</span>
                        <span className={styles.definitionValue}>
                            <LegalValue value={editor.siret} label="SIRET" />
                        </span>
                    </div>
                    {editor.rcs && (
                        <div className={styles.definitionRow}>
                            <span className={styles.definitionTerm}>Immatriculation</span>
                            <span className={styles.definitionValue}>{editor.rcs}</span>
                        </div>
                    )}
                    <div className={styles.definitionRow}>
                        <span className={styles.definitionTerm}>TVA</span>
                        <span className={styles.definitionValue}>
                            {/*{editor.vatNumber || 'TVA non applicable, article 293 B du Code général des impôts'}*/}
                            {editor.vatNumber ?editor.vatNumber : <LegalValue value="" label="vatNumber" />}
                        </span>
                    </div>
                    <div className={styles.definitionRow}>
                        <span className={styles.definitionTerm}>Email</span>
                        <span className={styles.definitionValue}>
                            {editor.email
                                ? <a href={`mailto:${editor.email}`}>{editor.email}</a>
                                : <LegalValue value="" label="Email" />}
                        </span>
                    </div>
                    {editor.phone && (
                        <div className={styles.definitionRow}>
                            <span className={styles.definitionTerm}>Téléphone</span>
                            <span className={styles.definitionValue}>{editor.phone}</span>
                        </div>
                    )}
                    <div className={styles.definitionRow}>
                        <span className={styles.definitionTerm}>Directeur de publication</span>
                        <span className={styles.definitionValue}>
                            <LegalValue value={publicationDirector} label="Directeur de publication" />
                        </span>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>2. Hébergeur</h2>
                <div className={`${styles.card} ${styles.definitions}`}>
                    <div className={styles.definitionRow}>
                        <span className={styles.definitionTerm}>Hébergeur</span>
                        <span className={styles.definitionValue}>{host.name}</span>
                    </div>
                    <div className={styles.definitionRow}>
                        <span className={styles.definitionTerm}>Adresse</span>
                        <span className={styles.definitionValue}>{host.address}</span>
                    </div>
                    <div className={styles.definitionRow}>
                        <span className={styles.definitionTerm}>Site web</span>
                        <span className={styles.definitionValue}>
                            <a href={host.website} target="_blank" rel="noopener noreferrer">{host.website}</a>
                        </span>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>3. Propriété intellectuelle</h2>
                <p>
                    L&apos;ensemble des éléments composant le site{' '}
                    {siteUrl ? `${siteName} (${siteUrl})` : siteName} — structure, textes, photographies, vidéos,
                    visuels, logos et éléments graphiques — est protégé par le droit de la propriété intellectuelle et
                    demeure la propriété exclusive de l&apos;éditeur ou de ses ayants droit.
                </p>
                <p>
                    Toute reproduction, représentation, modification ou exploitation, totale ou partielle, de ces
                    éléments, par quelque procédé que ce soit et sur quelque support que ce soit, est interdite sans
                    autorisation écrite préalable de l&apos;éditeur.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>4. Responsabilité</h2>
                <p>
                    L&apos;éditeur s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des informations
                    publiées sur le site. Les informations relatives aux prestations, tarifs et disponibilités sont
                    fournies à titre indicatif et ne constituent pas une offre contractuelle ; seul un devis accepté
                    engage les parties.
                </p>
                <p>
                    L&apos;éditeur ne saurait être tenu responsable des dommages directs ou indirects résultant de
                    l&apos;utilisation du site, d&apos;une indisponibilité technique, ou du contenu des sites tiers vers
                    lesquels des liens hypertextes peuvent renvoyer.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>5. Données personnelles et cookies</h2>
                <p>
                    Le traitement des données transmises via les formulaires du site est décrit dans la{' '}
                    <Link href="/politique-de-confidentialite">politique de confidentialité</Link>.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>6. Droit applicable</h2>
                <p>
                    Les présentes mentions légales sont soumises au droit français. En cas de litige, et à défaut de
                    résolution amiable, les tribunaux français seront seuls compétents.
                </p>
            </section>
        </LegalShell>
    );
}
