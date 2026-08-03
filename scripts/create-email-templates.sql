-- Contenu éditable des e-mails automatiques (voir lib/email-content.ts).
--
-- Une ligne par mail, identifiée par la clé du catalogue applicatif
-- (lib/email-templates.ts). La table peut rester vide : le code retombe alors
-- sur les textes par défaut, donc cette migration peut être jouée avant ou
-- après le déploiement sans interruption d'envoi.
--
-- `corps` est du Markdown, jamais du HTML : le rendu est fait côté serveur par
-- lib/markdown-email.ts, qui échappe tout avant de retransformer une grammaire
-- fermée. Rien de ce qui est stocké ici n'est injecté tel quel dans un mail.

create table if not exists public.email_templates
(
    cle        text primary key,
    sujet      text        not null default '',
    -- Markdown. Les variables autorisées sont contraintes par le catalogue
    -- applicatif : un placeholder hors catalogue n'est jamais substitué.
    corps      text        not null default '',
    updated_at timestamptz not null default now()
);

-- La lecture publique passe par la clé anon (envoi des mails côté serveur),
-- l'écriture uniquement par la service role key depuis l'administration.
alter table public.email_templates
    enable row level security;

drop policy if exists email_templates_read on public.email_templates;
create policy email_templates_read
    on public.email_templates
    for select
    using (true);
