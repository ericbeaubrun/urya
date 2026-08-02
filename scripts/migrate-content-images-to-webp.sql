-- Bascule des visuels du contenu éditorial vers les versions WebP.
--
-- Les chemins des images (galerie, prestations) sont stockés dans la colonne
-- JSON `site_content.content`, pilotée par l'éditeur d'administration : ils ne
-- sont pas mis à jour par un déploiement de code. À exécuter dans l'éditeur SQL
-- Supabase JUSTE APRÈS le déploiement qui ajoute les fichiers .webp.
--
-- Les .png d'origine restent servis tant qu'ils sont dans public/, donc un écart
-- de quelques minutes entre le déploiement et cette requête ne casse rien.
--
-- À vérifier avant :
select content::text ~ '\.png' as reste_des_png from site_content where id = 1;

-- Remplacement ciblé, fichier par fichier : un `replace` global sur '.png'
-- toucherait aussi logo.png, qui reste volontairement en PNG (favicon).
-- Les icônes réseaux sociaux ne figurent pas ici : leurs chemins vivent dans
-- l'ICON_MAP de Footer.tsx, la base ne stocke que le nom de la plateforme.
-- Si la colonne est de type `json` et non `jsonb`, remplacer le cast final.
update site_content
set content = replace(replace(replace(replace(replace(replace(replace(replace(replace(
    content::text,
    '/mariage.png',      '/mariage.webp'),
    '/soiree.png',       '/soiree.webp'),
    '/anniversaire.png', '/anniversaire.webp'),
    '/dj-urya_1.png',    '/dj-urya_1.webp'),
    '/dj-urya_2.png',    '/dj-urya_2.webp'),
    '/dj-urya_3.png',    '/dj-urya_3.webp'),
    '/dj-urya_4.png',    '/dj-urya_4.webp'),
    '/dj-urya_5.png',    '/dj-urya_5.webp'),
    '/dj-urya_6.png',    '/dj-urya_6.webp')::jsonb
where id = 1;

-- Contrôle : ne doit plus lister que d'éventuels chemins non prévus ici.
select content::text ~ '\.png' as reste_des_png from site_content where id = 1;
