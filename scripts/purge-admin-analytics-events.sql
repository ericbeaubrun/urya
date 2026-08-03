-- Purge des événements d'audience émis depuis l'administration.
--
-- Avant le filtre de `lib/analytics-events.ts` (`isTrackablePath`), les pages
-- /admin/* et /login étaient comptées comme des pages vues du site. Ces lignes
-- gonflent la fréquentation et faussent surtout le taux de conversion, dont
-- elles alimentent le dénominateur sans jamais pouvoir le convertir.
--
-- À exécuter une fois dans l'éditeur SQL Supabase, après le déploiement du
-- correctif — sinon les pages d'administration encore ouvertes continueront
-- d'en produire.

-- À vérifier avant : combien de lignes vont disparaître, et lesquelles.
select path, count(*) as vues
from public.analytics_events
where path = '/admin'
   or path like '/admin/%'
   or path = '/login'
   or path like '/login/%'
group by path
order by vues desc;

delete
from public.analytics_events
where path = '/admin'
   or path like '/admin/%'
   or path = '/login'
   or path like '/login/%';
