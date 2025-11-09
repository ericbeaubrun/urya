CREATE
EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS admins
(
    id
    UUID
    PRIMARY
    KEY
    DEFAULT
    gen_random_uuid
(
),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
    );
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
DROP
POLICY IF EXISTS "deny admins" ON admins;
CREATE
POLICY "deny admins" ON admins FOR ALL USING (false) WITH CHECK (false);

CREATE TABLE IF NOT EXISTS clients
(
    id
    UUID
    PRIMARY
    KEY
    DEFAULT
    gen_random_uuid
(
),
    nom TEXT NOT NULL,
    mail TEXT NOT NULL,
    tel TEXT
    );
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
DROP
POLICY IF EXISTS "deny clients" ON clients;
CREATE
POLICY "deny clients" ON clients FOR ALL USING (false) WITH CHECK (false);

CREATE TABLE IF NOT EXISTS prestations
(
    id
    UUID
    PRIMARY
    KEY
    DEFAULT
    gen_random_uuid
(
),
    id_client UUID REFERENCES clients
(
    id
) ON DELETE SET NULL,
    statut TEXT NOT NULL DEFAULT 'en_attente',
    date_debut DATE NOT NULL,
    date_fin DATE, -- Quand date_fin = NULL : Si (heure_debut <= heure_fin) alors date_fin = date_debut, sinon date_fin = date_debut + 1 jour
    heure_debut TIME,
    heure_fin TIME,
    type TEXT,
    lieu TEXT,
    notes TEXT
    );
ALTER TABLE prestations ENABLE ROW LEVEL SECURITY;
DROP
POLICY IF EXISTS "deny prestations" ON prestations;
CREATE
POLICY "deny prestations" ON prestations FOR ALL USING (false) WITH CHECK (false);

CREATE
OR REPLACE VIEW public_prestations_calendar AS
SELECT id, type, statut, date_debut, date_fin, heure_debut, heure_fin
FROM prestations;
ALTER
VIEW public_prestations_calendar SET (security_invoker = false);
GRANT SELECT ON public_prestations_calendar TO anon;
