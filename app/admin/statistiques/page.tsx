import Link from "next/link";
import {requireAdmin} from "@/lib/require-admin";
import {
    getAnalyticsSummary,
    getDailySeries,
    parsePeriod,
    parseRange,
    shiftDay,
    today,
    PERIODS,
    type Count,
} from "@/lib/analytics-query";
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

/**
 * Histogramme horizontal sur un axe fixe : les cases vides comptent autant que
 * les pleines, contrairement à un classement.
 */
function Distribution({title, rows, unit, every = 1}: {
    title: string;
    rows: Count[];
    unit: string;
    /** N'affiche qu'une étiquette sur `every`, pour ne pas surcharger l'axe. */
    every?: number;
}) {
    const max = Math.max(...rows.map((r) => r.value), 1);

    return (
        <section className={styles.card}>
            <h2 className={styles.cardTitle}>{title}</h2>
            <div className={styles.dist}>
                {rows.map((row, i) => (
                    <div
                        key={row.label}
                        className={styles.distCol}
                        title={`${row.label} — ${row.value} page(s) vue(s)`}
                    >
                        <div className={styles.distTrack}>
                            <div
                                className={styles.distFill}
                                style={{height: `${(row.value / max) * 100}%`}}
                            />
                        </div>
                        <span className={styles.distLabel}>
                            {i % every === 0 ? row.label : ""}
                        </span>
                    </div>
                ))}
            </div>
            <p className={styles.distUnit}>{unit}</p>
        </section>
    );
}

export default async function StatistiquesPage(
    {searchParams}: { searchParams: Promise<{ periode?: string; jour?: string }> }
) {
    await requireAdmin();

    const {periode, jour} = await searchParams;
    // La période reste portée même quand une journée est sélectionnée : elle
    // définit l'étendue du graphique de fréquentation, qui sert de sélecteur.
    const period = parsePeriod(periode);
    const range = parseRange(periode, jour);
    const selectedDay = range.kind === "day" ? range.day : null;

    const href = (params: { periode?: number; jour?: string }) => {
        const query = new URLSearchParams({periode: String(params.periode ?? period)});
        if (params.jour) query.set("jour", params.jour);

        return `/admin/statistiques?${query}`;
    };

    let summary;
    let daily: Count[];
    try {
        [summary, daily] = await Promise.all([
            getAnalyticsSummary(range),
            getDailySeries(period),
        ]);
    } catch (e) {
        return (
            <div className={styles.page}>
                <h1 className={styles.title}>Statistiques</h1>
                <p className={`${styles.notice} ${styles.error}`}>
                    {e instanceof Error ? e.message : "Erreur inattendue."}
                    {" "}Vérifiez que la table <code>analytics_events</code> existe et
                    qu&apos;elle porte les colonnes <code>os</code> et <code>browser</code>
                    {" "}(voir <code>scripts/create-analytics-events.sql</code> et
                    {" "}<code>scripts/add-analytics-client-context.sql</code>).
                </p>
            </div>
        );
    }

    const maxDaily = Math.max(...daily.map((d) => d.value), 1);
    const firstDay = daily[0]?.label;
    const lastDay = daily[daily.length - 1]?.label;

    const formatDay = (day?: string) =>
        day ? new Date(`${day}T00:00:00Z`).toLocaleDateString("fr-FR", {day: "numeric", month: "short"}) : "";

    const formatFullDay = (day: string) =>
        new Date(`${day}T00:00:00Z`).toLocaleDateString("fr-FR", {
            weekday: "long", day: "numeric", month: "long", year: "numeric",
        });

    return (
        <div className={styles.page}>
            <div className={styles.head}>
                <h1 className={styles.title}>Statistiques</h1>
                <nav className={styles.periods}>
                    {PERIODS.map((p) => (
                        <Link
                            key={p}
                            href={href({periode: p})}
                            className={
                                !selectedDay && p === period
                                    ? `${styles.period} ${styles.periodActive}`
                                    : styles.period
                            }
                        >
                            {p} jours
                        </Link>
                    ))}
                    {/* Formulaire GET : le sélecteur natif du navigateur suffit,
                        sans une ligne de JavaScript côté client. */}
                    <form className={styles.dayForm} action="/admin/statistiques">
                        <input type="hidden" name="periode" value={period}/>
                        <input
                            type="date"
                            name="jour"
                            className={styles.dayInput}
                            defaultValue={selectedDay ?? ""}
                            max={today()}
                            min={shiftDay(today(), -760)}
                            aria-label="Journée à détailler"
                        />
                        <button type="submit" className={styles.dayButton}>Voir</button>
                    </form>
                </nav>
            </div>

            {selectedDay && (
                <p className={styles.dayBanner}>
                    Chiffres de la journée du <strong>{formatFullDay(selectedDay)}</strong>.
                    <Link href={href({})} className={styles.reset}>
                        Revenir aux {period} jours
                    </Link>
                </p>
            )}

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
                <h2 className={styles.cardTitle}>
                    Fréquentation <span className={styles.hint}>— cliquez une barre pour détailler la journée</span>
                </h2>
                <div className={styles.chart}>
                    {daily.map((day) => (
                        <Link
                            key={day.label}
                            href={href({jour: day.label})}
                            className={
                                day.label === selectedDay
                                    ? `${styles.bar} ${styles.barActive}`
                                    : styles.bar
                            }
                            style={{height: `${(day.value / maxDaily) * 100}%`}}
                            title={`${formatDay(day.label)} — ${day.value} page(s) vue(s)`}
                            aria-label={`${formatDay(day.label)} : ${day.value} page(s) vue(s)`}
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
                    <p className={styles.empty}>
                        Aucun formulaire vu {selectedDay ? "ce jour-là" : "sur la période"}.
                    </p>
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
                <Distribution
                    title="Heures de fréquentation"
                    rows={summary.hourly}
                    unit="Pages vues par heure locale — indique quand publier et quand être joignable."
                    every={3}
                />
                {summary.weekdays.length > 0 && (
                    <Distribution
                        title="Jours de la semaine"
                        rows={summary.weekdays}
                        unit="Pages vues cumulées par jour de la semaine sur la période."
                    />
                )}
            </div>

            <div className={styles.grid}>
                <Breakdown
                    title="Pages les plus vues"
                    rows={summary.topPages}
                    empty="Aucune page vue."
                />
                <Breakdown
                    title="Sources de trafic"
                    rows={summary.referrers}
                    empty="Aucune source enregistrée."
                />
                <Breakdown
                    title="Largeur d'écran"
                    rows={summary.devices}
                    empty="Aucun affichage enregistré."
                />
                <Breakdown
                    title="Systèmes"
                    rows={summary.systems}
                    empty="Aucun système enregistré."
                />
                <Breakdown
                    title="Navigateurs"
                    rows={summary.browsers}
                    empty="Aucun navigateur enregistré."
                />
                <Breakdown
                    title="Origine des clics vers le devis"
                    rows={summary.ctaSources}
                    empty="Aucun clic enregistré."
                />
                <Breakdown
                    title="Contacts directs (appel, e-mail, Instagram)"
                    rows={summary.contactClicks}
                    empty="Aucun contact direct enregistré."
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
                visiteur revenu plusieurs fois est donc compté plusieurs fois. La
                largeur d&apos;écran est arrondie à trois paliers, le système et le
                navigateur à leur seule famille — jamais leur version : de quoi
                orienter le design, jamais de quoi reconnaître quelqu&apos;un. Les
                journées sont découpées à l&apos;heure de Paris. Aucune donnée
                n&apos;est transmise à un tiers, et les événements sont purgés au bout
                de 25 mois.
            </p>
        </div>
    );
}
