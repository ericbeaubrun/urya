-- Mesure d'audience interne (voir lib/analytics-events.ts).
--
-- Aucune donnée personnelle n'est stockée : ni IP, ni User-Agent, ni
-- identifiant de visiteur. On compte des pages vues, pas des personnes. C'est
-- ce qui place le traitement dans l'exemption de consentement de la CNIL et
-- dispense le site de bandeau cookie.

create table if not exists public.analytics_events
(
    id            bigserial primary key,
    occurred_at   timestamptz not null default now(),
    -- Nom d'événement, contraint par l'allowlist applicative.
    name          text        not null,
    -- Chemin seul, jamais l'URL complète : les paramètres de campagne
    -- (utm_*, gclid) peuvent contenir des identifiants publicitaires.
    path          text,
    -- Hôte du référent uniquement ("google.com"), jamais le chemin : une URL
    -- de référent complète peut trahir une recherche nominative.
    referrer_host text,
    device        text,
    -- Propriétés d'événement, clés contraintes par l'allowlist.
    props         jsonb
);

-- Tous les écrans de l'admin filtrent d'abord sur une fenêtre temporelle.
create index if not exists analytics_events_occurred_at_idx
    on public.analytics_events (occurred_at desc);

-- L'entonnoir de conversion agrège par nom d'événement sur cette fenêtre.
create index if not exists analytics_events_name_occurred_at_idx
    on public.analytics_events (name, occurred_at desc);

-- La table n'est jamais lue ni écrite avec la clé anonyme : l'ingestion et
-- l'admin passent tous deux par la clé de service, côté serveur. RLS activé
-- sans aucune policy ferme donc complètement l'accès public, y compris si la
-- clé anonyme fuite.
alter table public.analytics_events
    enable row level security;

-- Purge de rétention. Le RGPD impose une durée limitée ; les lignes directrices
-- CNIL sur la mesure d'audience plafonnent les données à 25 mois.
--
-- Nécessite pg_cron (extension à activer dans le tableau de bord Supabase).
-- Sans planificateur, exécuter le `delete` manuellement une fois par trimestre.
--
-- select cron.schedule(
--     'purge-analytics-events',
--     '0 4 1 * *',
--     $$delete from public.analytics_events
--       where occurred_at < now() - interval '25 months'$$
-- );
