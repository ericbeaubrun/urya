import type { Metadata } from 'next';
import Link from 'next/link';
import LegalShell from '@/app/legal/LegalShell';
import LegalValue from '@/app/legal/LegalValue';
import { getLegalContent } from '@/app/legal/legal.config';
import styles from '@/app/legal/Legal.module.css';
import JsonLd from '@/app/components/JsonLd';
import {SITE_URL} from '@/app/site-url';
import {legalPageJsonLd} from '@/lib/structured-data';

const PATH = '/politique-de-confidentialite';
const TITLE = 'Politique de confidentialité';
const DESCRIPTION =
    'Traitement des données personnelles collectées sur le site DJ URYA : finalités, durées de conservation et droits RGPD.';

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: PATH },
    robots: { index: true, follow: true },
    openGraph: {
        type: 'article',
        url: PATH,
        title: TITLE,
        description: DESCRIPTION,
    },
};

// Rendu à la demande : les informations légales sont éditées depuis l'admin et
// doivent apparaître dès l'enregistrement, sans rebuild.
export const dynamic = 'force-dynamic';

export default async function PolitiqueConfidentialitePage() {
    const { editor, processors, dataRetention, lastUpdate } = await getLegalContent();

    const contactLink = editor.email
        ? <a href={`mailto:${editor.email}`}>{editor.email}</a>
        : <LegalValue value="" label="Email de contact" />;

    return (
        <LegalShell title="Politique de confidentialité" lastUpdate={lastUpdate}>
            <JsonLd data={legalPageJsonLd(SITE_URL, PATH, {name: TITLE, description: DESCRIPTION})}/>
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>1. Responsable du traitement</h2>
                <p>
                    Le responsable du traitement des données collectées sur ce site est{' '}
                    <LegalValue value={editor.name} label="Responsable du traitement" />,{' '}
                    <LegalValue value={editor.address} label="Adresse" />. Pour toute question relative à vos données,
                    écrivez à {contactLink}.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>2. Données collectées et finalités</h2>
                <p>
                    Aucune donnée n&apos;est collectée à votre insu : seules les informations que vous saisissez
                    volontairement dans les formulaires du site sont traitées.
                </p>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>Formulaire</th>
                            <th>Données</th>
                            <th>Finalité</th>
                            <th>Base légale</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Contact</td>
                            <td>Nom, email, message</td>
                            <td>Répondre à votre demande</td>
                            <td>Consentement</td>
                        </tr>
                        <tr>
                            <td>Demande de rendez-vous</td>
                            <td>Nom ou organisme, email ou téléphone, disponibilités, type de rendez-vous</td>
                            <td>Organiser un échange préalable</td>
                            <td>Mesures précontractuelles</td>
                        </tr>
                        <tr>
                            <td>Demande de prestation</td>
                            <td>Nom, email, téléphone, date, horaires, lieu, type d&apos;événement, précisions</td>
                            <td>Étudier la demande et établir un devis</td>
                            <td>Mesures précontractuelles</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <p>
                    Dans les formulaires, les champs signalés comme obligatoires sont nécessaires au traitement de la
                    demande ; sans eux, celle-ci ne peut pas être prise en charge.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>3. Destinataires</h2>
                <p>
                    Les données sont destinées exclusivement à l&apos;éditeur du site. Elles ne sont ni vendues, ni
                    louées, ni cédées à des tiers à des fins commerciales. Elles transitent uniquement par les
                    prestataires techniques suivants, agissant en qualité de sous-traitants :
                </p>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>Prestataire</th>
                            <th>Rôle</th>
                            <th>Localisation</th>
                            <th>Politique</th>
                        </tr>
                        </thead>
                        <tbody>
                        {processors.map((p) => (
                            <tr key={p.name}>
                                <td>{p.name}</td>
                                <td>{p.purpose}</td>
                                <td>{p.location}</td>
                                <td>
                                    <a href={p.privacyUrl} target="_blank" rel="noopener noreferrer">Consulter</a>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <p>
                    Les éventuels transferts hors Union européenne sont encadrés par les clauses contractuelles types
                    de la Commission européenne.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>4. Durée de conservation</h2>
                <p>
                    Les demandes reçues via les formulaires sont conservées {dataRetention}. Les données liées à une
                    prestation effectivement réalisée sont conservées pendant la durée légale de conservation des
                    documents comptables, soit 10 ans.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>5. Cookies</h2>
                <p>
                    Ce site n&apos;utilise aucun cookie publicitaire ni aucun outil de mesure d&apos;audience. Seuls des
                    cookies strictement nécessaires au fonctionnement du site sont déposés, pour maintenir la session
                    d&apos;authentification de l&apos;espace d&apos;administration réservé à l&apos;éditeur. Ces cookies
                    sont exemptés de consentement au sens de l&apos;article 82 de la loi Informatique et Libertés.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>6. Sécurité</h2>
                <p>
                    Les échanges avec le site sont chiffrés (HTTPS). L&apos;accès aux données est restreint à
                    l&apos;éditeur, protégé par authentification, et les formulaires publics sont soumis à une
                    limitation du nombre de soumissions afin de prévenir les abus.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>7. Vos droits</h2>
                <p>
                    Conformément au Règlement (UE) 2016/679 (RGPD) et à la loi Informatique et Libertés, vous disposez
                    des droits suivants sur vos données :
                </p>
                <ul>
                    <li>droit d&apos;accès et de copie ;</li>
                    <li>droit de rectification ;</li>
                    <li>droit à l&apos;effacement ;</li>
                    <li>droit à la limitation du traitement ;</li>
                    <li>droit d&apos;opposition ;</li>
                    <li>droit à la portabilité ;</li>
                    <li>droit de retirer votre consentement à tout moment.</li>
                </ul>
                <p>
                    Ces droits s&apos;exercent par email à {contactLink}. Une
                    réponse vous sera apportée dans un délai maximal d&apos;un mois. Si vous estimez que vos droits ne
                    sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL —{' '}
                    <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>8. Modification</h2>
                <p>
                    La présente politique peut être modifiée à tout moment pour tenir compte des évolutions du site ou
                    de la réglementation. Voir également les{' '}
                    <Link href="/mentions-legales">mentions légales</Link>.
                </p>
            </section>
        </LegalShell>
    );
}
