-- Ajoute le contexte d'affichage aux événements d'audience.
--
-- À exécuter une fois sur une base où `analytics_events` existe déjà (les
-- installations neuves obtiennent ces colonnes par
-- `scripts/create-analytics-events.sql`, tenu à jour en parallèle).
--
-- Ces deux étiquettes sont déduites du User-Agent côté serveur puis réduites à
-- une famille prise dans une liste fermée (voir `detectOs` / `detectBrowser`
-- dans lib/analytics-events.ts). Le User-Agent brut n'est toujours pas stocké,
-- ni sa version, ni le modèle d'appareil : l'exemption de consentement tient
-- parce que rien de ce qui est écrit ici ne distingue un visiteur d'un autre.

alter table public.analytics_events
    add column if not exists os text,
    add column if not exists browser text;

-- Les lignes antérieures gardent `null` sur ces colonnes : l'admin les ignore
-- simplement dans les répartitions, aucune reprise n'est possible ni
-- souhaitable (le User-Agent d'origine n'a jamais été conservé).

-- Le palier "tablet" rejoint "mobile" et "desktop" dans la colonne `device`.
-- Aucune migration : les valeurs existantes restent valides, les tablettes
-- comptées jusqu'ici en "desktop" le restent pour le passé.
