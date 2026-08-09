-- Avis clients affichés sur la page d'accueil, et entrée « Avis » du menu.
--
-- Ces cinq avis sont repris tels quels de la fiche Mariages.net de DJ URYA :
-- ce sont les cinq notés 5/5 dont le texte est complet sur la fiche publique
-- (les autres y sont tronqués par un « En savoir plus », et reconstituer la
-- suite reviendrait à écrire à la place du client).
--
-- Le texte n'est ni corrigé ni reformulé, fautes comprises. Un avis est une
-- citation : le retoucher, même pour l'orthographe, en fait une paraphrase que
-- son auteur n'a pas écrite — et qui n'est plus vérifiable sur la plateforme
-- d'origine. Toute retouche se fait depuis l'onglet « Avis » de l'admin, en
-- connaissance de cause.
--
-- Les deux requêtes ne touchent que leur propre clé et peuvent être rejouées.
--
-- À exécuter dans l'éditeur SQL de Supabase, puis cliquer « Rafraîchir » dans
-- l'éditeur de contenu de l'admin pour purger le cache.


-- 1. Les avis. Réécrit intégralement la clé `testimonials`.
update site_content
set content = jsonb_set(
    content::jsonb,
    '{testimonials}',
    $json${
        "title": {"text": "Ce qu'ils en", "highlight": "disent"},
        "subtitle": "Les retours laissés par les mariés et les organisateurs après leur soirée.",
        "items": [
            {
                "rating": 5,
                "author": "Abdel",
                "title": "Super djette",
                "quote": "DJ URYA a rendu notre soirée inoubliable ! L'ambiance était incroyable, la musique parfaitement adaptée, et nos invités n'ont pas quitté la piste de danse. Un grand professionnalisme, une superbe énergie : on recommande les yeux fermés !"
            },
            {
                "rating": 5,
                "author": "Hicham",
                "title": "Je recommande vivement",
                "quote": "Une DJ sérieuse, professionnelle et agréable. Elle est à l'écoute, inspire confiance et fait preuve d'un grand sens du contact. Je la recommande sans hésiter à toutes les personnes qui recherchent une DJ de qualité."
            },
            {
                "rating": 5,
                "author": "Kevin",
                "title": "Superbe soirée de mariage",
                "quote": "Merci à DJ Urya pour la prestation de mon mariage tout à était extrêmement fluide tout a était exécuté parfaitement comme c'était convenue nous avons passer un tres bon moment de mariage en grande partie grâce au travail accomplie."
            },
            {
                "rating": 5,
                "author": "Thomas",
                "title": "Dj Urya au top",
                "quote": "Dj Urya est vraiment cool sympa et c'est animée n'importe quel événement mariage, anniversaire …"
            },
            {
                "rating": 5,
                "author": "Sam",
                "title": "Juste parfait très pro et très sympa",
                "quote": "DJ URYA est grave pro, grave sympa joue tous types de musique c etait super"
            }
        ]
    }$json$::jsonb
)
where id = 1;


-- 2. L'entrée de menu, insérée juste après « Services » pour suivre l'ordre
--    réel des sections de la page.
--
--    L'insertion passe par une renumérotation (rang × 2, et rang × 2 + 1 pour
--    la nouvelle entrée) : c'est le seul moyen de placer un élément au milieu
--    d'un tableau jsonb, qui n'a pas d'opérateur d'insertion positionnelle.
--
--    Le `not exists` final rend la requête rejouable : sans lui, chaque
--    exécution ajouterait un « Avis » de plus au menu.
update site_content
set content = jsonb_set(
    content::jsonb,
    '{navigation,items}',
    (
        select coalesce(jsonb_agg(entry order by rang), '[]'::jsonb)
        from (
            select item as entry, n * 2 as rang
            from jsonb_array_elements(content::jsonb #> '{navigation,items}')
                 with ordinality as t(item, n)

            union all

            select '{"to": "avis", "label": "Avis"}'::jsonb, n * 2 + 1
            from jsonb_array_elements(content::jsonb #> '{navigation,items}')
                 with ordinality as t(item, n)
            where item->>'to' = 'services'
        ) ordonne
    )
)
where id = 1
  and not exists (
      select 1
      from jsonb_array_elements(content::jsonb #> '{navigation,items}') as e
      where e->>'to' = 'avis'
  );


-- Contrôle : doit lister les entrées du menu dans l'ordre, « Avis » inclus.
select jsonb_path_query_array(content::jsonb, '$.navigation.items[*].label') as menu
from site_content
where id = 1;
