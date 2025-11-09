INSERT INTO admins (email, password_hash)
VALUES ('admin@example.com',
        '$2a$12$1KoGmVeKioXCupujeZcF6e6DJT8JNVq6YixmK796VJHYkBhVfOcOC');

INSERT INTO clients (nom, mail, tel)
VALUES ('Marie Dupont', 'marie@example.com', '0612345678'),
       ('Paul Durand', 'paul@example.com', NULL);

INSERT INTO prestations (id_client, statut, date_debut, date_fin, heure_debut, heure_fin, type, lieu, notes)
VALUES ((SELECT id
         FROM clients
         WHERE mail =
               'marie@example.com'),
        'confirmée',
        '2025-07-14',
        NULL,
        '18:00',
        '02:00',
        'Mariage',
        'Château des Lys',
        'Ouverture de bal au piano.'),
       ((SELECT id
         FROM clients
         WHERE mail = 'paul@example.com'),
        'en_attente',
        '2025-08-04',
        NULL,
        NULL,
        NULL,
        'Soirée privée',
        'Domicile',
        'Prévoir lumière ambiance simple.');
