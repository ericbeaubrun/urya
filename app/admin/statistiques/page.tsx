import Link from "next/link";
import {requireAdmin} from "@/lib/require-admin";
import {getAnalyticsSummary, isPeriod, PERIODS, type Count, type Period} from "@/lib/analytics-query";
import styles from "./Stats.module.css";

// Les statistiques doivent refléter l'état de la base à l'instant du chargement.
export const dynamic = "force-dynamic";

// L'accès est contrôlé en amont : `proxy.ts` filtre /admin/*, puis
// `app/admin/layout.tsx` revérifie la session avant de rendre quoi que ce soit.
// `requireAdmin` y ajoute l'appartenance à la table des administrateurs, cette
// page lisant la base directement.

function Kpi({value, label}: { value: string | number; label: string }) {
    return (
        <div className={styles.kpi}>
            <div className={styles.kpiValue}>{value}</div>
            <div className={styles.kpiLabel}>{label}</div>
        </div>
    );
}

/** Liste classée avec barre proportionnelle au premier élément. */
function Breakdown({title, rows, empty, suffix}: {
    title: string;
    rows: Count[];
    empty: string;
    suffix?: string;
}) {
    const max = rows[0]?.value ?? 0;

    return (
        <section className={styles.card}>
            <h2 className={styles.cardTitle}>{title}</h2>
            {rows.length === 0 ? (
                <p className={styles.empty}>{empty}</p>
            ) : (
                <div className={styles.rows}>
                    {rows.map((row) => (
                        <div key={row.label} className={styles.row}>
                            <span className={styles.rowLabel} title={row.label}>{row.label}</span>
                            <span className={styles.rowValue}>{row.value}{suffix}</span>
                            <div className={styles.rowTrack}>
                                <div
                                    className={styles.rowFill}
                                    style={{width: `${max ? (row.value / max) * 100 : 0}%`}}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default async function StatistiquesPage(
    {searchParams}: { searchParams: Promise<{ periode?: string }> }
) {
    await requireAdmin();

    const {periode} = await searchParams;
    const period: Period = isPeriod(periode) ? (Number(periode) as Period) : 30;

    let summary;
    try {
        summary = await getAnalyticsSummary(period);
    } catch (e) {
        return (
            <div className={styles.page}>
                <h1 className={styles.title}>Statistiques</h1>
                <p className={`${styles.notice} ${styles.error}`}>
                    {e instanceof Error ? e.message : "Erreur inattendue."}
                    {" "}Vérifiez que la table <code>analytics_events</code> existe
                    (voir <code>scripts/create-analytics-events.sql</code>).
                </p>
            </div>
        );
    }

    const maxDaily = Math.max(...summary.daily.map((d) => d.value), 1);
    const firstDay = summary.daily[0]?.label;
    const lastDay = summary.daily[summary.daily.length - 1]?.label;

    const formatDay = (day?: string) =>
        day ? new Date(`${day}T00:00:00Z`).toLocaleDateString("fr-FR", {day: "numeric", month: "short"}) : "";

    return (
        <div className={styles.page}>
            <div className={styles.head}>
                <h1 className={styles.title}>Statistiques</h1>
                <nav className={styles.periods}>
                    {PERIODS.map((p) => (
                        <Link
                            key={p}
                            href={`/admin/statistiques?periode=${p}`}
                            className={p === period ? `${styles.period} ${styles.periodActive}` : styles.period}
                        >
                            {p} jours
                        </Link>
                    ))}
                </nav>
            </div>

            {summary.truncated && (
                <p className={styles.notice}>
                    Volume d&apos;événements au plafond de lecture : les chiffres ci-dessous
                    sont sous-estimés. Réduisez la période ou passez à des vues agrégées.
                </p>
            )}

            <div className={styles.kpis}>
                <Kpi value={summary.pageViews} label="Pages vues"/>
                <Kpi value={summary.formViews} label="Formulaires vus"/>
                <Kpi value={summary.submissions} label="Demandes envoyées"/>
                <Kpi value={`${summary.conversionRate} %`} label="Taux de conversion"/>
            </div>

            <section className={styles.card}>
                <h2 className={styles.cardTitle}>Fréquentation</h2>
                <div className={styles.chart}>
                    {summary.daily.map((day) => (
                        <div
                            key={day.label}
                            className={styles.bar}
                            style={{height: `${(day.value / maxDaily) * 100}%`}}
                            title={`${formatDay(day.label)} — ${day.value} page(s) vue(s)`}
                        />
                    ))}
                </div>
                <div className={styles.chartAxis}>
                    <span>{formatDay(firstDay)}</span>
                    <span>{formatDay(lastDay)}</span>
                </div>
            </section>

            <section className={styles.card}>
                <h2 className={styles.cardTitle}>Entonnoir de conversion</h2>
                {summary.formViews === 0 ? (
                    <p className={styles.empty}>Aucun formulaire vu sur la période.</p>
                ) : (
                    <div className={styles.funnel}>
                        {summary.funnel.map((step, i) => (
                            <div key={step.label} className={styles.funnelStep}>
                                <div className={styles.funnelHead}>
                                    <span>{step.label}</span>
                                    <span className={styles.funnelShare}>
                                        {step.value} · {step.share} %
                                    </span>
                                </div>
                                <div className={styles.funnelTrack}>
                                    <div
                                        className={
                                            i >= summary.funnel.length - 2
                                                ? `${styles.funnelFill} ${styles.funnelFillSuccess}`
                                                : styles.funnelFill
                                        }
                                        style={{width: `${Math.min(step.share, 100)}%`}}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <div className={styles.grid}>
                <Breakdown
                    title="Pages les plus vues"
                    rows={summary.topPages}
                    empty="Aucune page vue sur la période."
                />
                <Breakdown
                    title="Sources de trafic"
                    rows={summary.referrers}
                    empty="Aucune source enregistrée."
                />
                <Breakdown
                    title="Appareils"
                    rows={summary.devices}
                    empty="Aucun appareil enregistré."
                />
                <Breakdown
                    title="Origine des clics vers le devis"
                    rows={summary.ctaSources}
                    empty="Aucun clic enregistré."
                />
                <Breakdown
                    title="Champs les plus en erreur"
                    rows={summary.formErrors}
                    empty="Aucune erreur de saisie."
                />
                <Breakdown
                    title="Questions les plus ouvertes"
                    rows={summary.faqQuestions}
                    empty="Aucune question ouverte."
                />
            </div>

            <p className={styles.footnote}>
                Mesure interne, sans cookie ni identifiant de visiteur : les chiffres
                comptent des pages vues et des actions, pas des personnes. Un même
                visiteur revenu plusieurs fois est donc compté plusieurs fois. Aucune
                donnée n&apos;est transmise à un tiers, et les événements sont purgés
                au bout de 25 mois.
            </p>
        </div>
    );
}
