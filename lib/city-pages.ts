/**
 * Pages « zone d'intervention ».
 *
 * C'est le format SEO le plus rentable et le plus risqué à la fois. Rentable
 * parce que « dj mariage + ville » est une requête à forte intention d'achat.
 * Risqué parce que la tentation est de dupliquer un gabarit en changeant le
 * nom de la ville : Google qualifie ces pages de « doorway pages » et les
 * désindexe par lot, en emportant souvent la confiance accordée au domaine.
 *
 * La règle appliquée ici : chaque page doit contenir au moins une information
 * qu'aucune autre ne contient et qui aiderait réellement quelqu'un organisant
 * son événement dans cette ville — nature des lieux de réception du secteur,
 * contraintes d'accès et de bruit, conditions de déplacement depuis la base.
 * Les sections `venues` et `logistics` portent cette différenciation ; si une
 * nouvelle ville ne peut pas les remplir sincèrement, il vaut mieux ne pas
 * créer la page.
 *
 * Rien ici n'affirme une prestation passée dans un lieu nommé : seuls sont
 * cités des faits publics (monuments, géographie, desserte) et des catégories
 * de lieux. Une référence client inventée serait à la fois un risque juridique
 * et, pour un moteur, un signal de contenu non fiable.
 */

export interface CitySection {
    title: string;
    /** Paragraphes. `**gras**` y est interprété. */
    body?: string[];
    bullets?: string[];
}

export interface CityFaq {
    question: string;
    answer: string;
}

export interface CityPage {
    slug: string;
    /** Nom de la ville seul, utilisé dans les titres et le balisage. */
    city: string;
    /** Département, affiché et repris dans `areaServed`. */
    department: string;
    navLabel: string;
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    h1: string;
    intro: string[];
    /** Communes couvertes depuis cette page, citées en clair. */
    nearby: string[];
    /** Sections différenciantes : les lieux du secteur, puis la logistique. */
    sections: CitySection[];
    faq: CityFaq[];
    /** Slugs d'autres villes proposées en fin de page. */
    related: string[];
}

export const CITY_PAGES: CityPage[] = [
    {
        slug: "dj-paris",
        city: "Paris",
        department: "Paris",
        navLabel: "Paris",
        metaTitle: "DJ à Paris – Mariage, soirée privée et entreprise",
        metaDescription:
            "DJ professionnel à Paris pour mariages, soirées privées et événements d'entreprise. Habitué aux limiteurs de bruit, aux péniches et aux contraintes d'accès parisiennes. Devis gratuit.",
        keywords: [
            "DJ Paris",
            "DJ mariage Paris",
            "DJ soirée privée Paris",
            "DJ événement entreprise Paris",
            "DJ péniche Paris",
        ],
        h1: "DJ à Paris",
        intro: [
            "Paris est la zone où la technique compte le plus, et la musique le moins. Presque tous les lieux de réception intra-muros imposent un **limiteur de bruit**, beaucoup sont en étage ou en sous-sol sans accès véhicule direct, et l'horaire de fin est rarement négociable.",
            "Rien de tout cela n'empêche une bonne soirée — à condition que ce soit anticipé plutôt que découvert le soir même.",
        ],
        nearby: [
            "les 20 arrondissements",
            "Neuilly-sur-Seine",
            "Levallois-Perret",
            "Boulogne-Billancourt",
            "Saint-Ouen",
            "Montreuil",
            "Vincennes",
        ],
        sections: [
            {
                title: "Les lieux de réception parisiens",
                body: [
                    "Chaque famille de lieux pose un problème différent, connu à l'avance.",
                ],
                bullets: [
                    "**Péniches et bateaux** : volume clos et réverbérant, alimentation limitée, matériel à descendre par une passerelle étroite — le temps d'installation double par rapport à une salle classique",
                    "**Rooftops et terrasses** : son qui porte loin sur le voisinage, donc seuil imposé bas et système orienté vers la piste plutôt que diffusé large",
                    "**Hôtels particuliers et salons privatisés** : souvent superbes acoustiquement mais avec interdiction de fixation et passage de câbles contraint",
                    "**Caves voûtées et sous-sols** : réverbération forte, où pousser le volume dégrade le son au lieu de l'augmenter",
                    "**Lofts et ateliers d'artiste** : espaces bruts, généralement sans équipement, tout est à apporter",
                ],
            },
            {
                title: "Contraintes propres à Paris",
                bullets: [
                    "**Limiteur de bruit** : présent dans la majorité des salles. Il coupe l'alimentation au dépassement du seuil. Le système est dimensionné en conséquence, ce qui suppose de connaître le seuil avant le jour J",
                    "**Accès et stationnement** : les créneaux de livraison sont courts et parfois payants. Le déchargement se cale sur l'horaire autorisé par le lieu",
                    "**Copropriété et voisinage** : au-delà de 22 h, le tapage nocturne s'apprécie sans mesure de niveau — une plainte suffit à écourter la soirée",
                    "**Horaire de fin** : imposé par le lieu, souvent 2 h ou 4 h. Il structure le set entier, pas seulement sa fin",
                ],
            },
        ],
        faq: [
            {
                question: "Y a-t-il des frais de déplacement pour Paris ?",
                answer:
                    "Paris est dans ma zone habituelle depuis la Seine-et-Marne. Le déplacement est inclus ; seuls les frais de stationnement ou d'accès imposés par le lieu sont refacturés au réel, et annoncés au devis.",
            },
            {
                question: "Comment gérez-vous un limiteur de bruit ?",
                answer:
                    "En dimensionnant le système pour rester sous le seuil plutôt qu'en le poussant jusqu'à la coupure. Cela suppose de connaître le seuil et son mode de déclenchement en amont : c'est la première question posée au lieu lors du point technique.",
            },
            {
                question: "Intervenez-vous en petite comité dans un appartement ?",
                answer:
                    "Oui, avec un matériel volontairement léger. Dans un appartement, la contrainte n'est jamais la puissance mais le voisinage : le volume est calé pour rester tenable, et l'heure de fin fixée avant de commencer.",
            },
        ],
        related: ["dj-chelles", "dj-marne-la-vallee", "dj-melun"],
    },

    {
        slug: "dj-melun",
        city: "Melun",
        department: "Seine-et-Marne (77)",
        navLabel: "Melun",
        metaTitle: "DJ à Melun (77) – Mariage, anniversaire et soirée",
        metaDescription:
            "DJ professionnel à Melun et dans le sud de la Seine-et-Marne : mariages, anniversaires et soirées d'entreprise. Domaines, salles communales et châteaux du secteur. Devis gratuit.",
        keywords: [
            "DJ Melun",
            "DJ mariage Melun",
            "DJ 77",
            "DJ Seine-et-Marne",
            "DJ anniversaire Melun",
        ],
        h1: "DJ à Melun et dans le sud Seine-et-Marne",
        intro: [
            "Melun est ma zone la plus proche : préfecture de Seine-et-Marne, au centre d'un secteur où se concentrent domaines de réception, corps de ferme rénovés et salles communales.",
            "C'est aussi la zone où j'interviens dans les **meilleures conditions logistiques** : trajet court, repérage possible avant le jour J, et installation sans contrainte d'horaire de retour.",
        ],
        nearby: [
            "Dammarie-lès-Lys",
            "Le Mée-sur-Seine",
            "Vaux-le-Pénil",
            "Savigny-le-Temple",
            "Combs-la-Ville",
            "Brie-Comte-Robert",
            "Maincy",
        ],
        sections: [
            {
                title: "Les lieux de réception du secteur",
                bullets: [
                    "**Domaines et châteaux** : le sud 77 en concentre un nombre inhabituel, autour de Maincy et de la vallée de la Seine. Réceptions souvent en orangerie ou sous chapiteau, avec cérémonie en extérieur — deux systèmes distincts à prévoir",
                    "**Corps de ferme briards rénovés** : granges à forte réverbération, où le placement des enceintes compte plus que leur puissance",
                    "**Salles des fêtes communales** : bien équipées en électricité mais souvent avec un horaire de fin strict fixé par la mairie",
                    "**Bords de Seine et guinguettes** : réceptions en extérieur, avec la question du repli en cas de pluie",
                ],
            },
            {
                title: "Logistique locale",
                body: [
                    "La proximité change concrètement deux choses par rapport à une prestation lointaine.",
                ],
                bullets: [
                    "**Repérage sur site possible** avant le jour J, sans frais — utile sur les lieux atypiques (grange, extérieur, cérémonie déportée)",
                    "**Aucun forfait déplacement** sur Melun et sa couronne",
                    "**Pas de contrainte d'heure de fin liée au retour** : la soirée peut aller jusqu'à l'horaire autorisé par le lieu",
                    "Installation possible en avance dans la journée quand le lieu est accessible tôt",
                ],
            },
        ],
        faq: [
            {
                question: "Pouvez-vous venir voir la salle avant l'événement ?",
                answer:
                    "Oui, et je le recommande sur le secteur de Melun puisque c'est sans frais. Un repérage de trente minutes évite la plupart des mauvaises surprises : puissance disponible, distance au tableau électrique, emplacement réel de la piste.",
            },
            {
                question: "Intervenez-vous dans les salles communales du secteur ?",
                answer:
                    "Régulièrement. Ces salles ont l'avantage d'une électricité correctement dimensionnée, et l'inconvénient d'un horaire de fin fixé par la commune, sans souplesse. Il est à confirmer auprès de la mairie avant de caler le déroulé.",
            },
            {
                question: "Et pour une réception sous chapiteau ou en extérieur ?",
                answer:
                    "C'est courant sur les domaines du secteur. Deux points sont vérifiés en amont : d'où vient l'électricité, et quelle est la solution de repli en cas de pluie. Le matériel électronique ne supporte pas l'eau, même sous une simple averse.",
            },
        ],
        related: ["dj-fontainebleau", "dj-provins", "dj-paris"],
    },

    {
        slug: "dj-meaux",
        city: "Meaux",
        department: "Seine-et-Marne (77)",
        navLabel: "Meaux",
        metaTitle: "DJ à Meaux (77) – Mariage, soirée et entreprise",
        metaDescription:
            "DJ professionnel à Meaux et dans le nord de la Seine-et-Marne : mariages en corps de ferme, anniversaires et soirées d'entreprise. Sonorisation et éclairage inclus. Devis gratuit.",
        keywords: [
            "DJ Meaux",
            "DJ mariage Meaux",
            "DJ nord Seine-et-Marne",
            "DJ 77 Meaux",
            "DJ grange mariage",
        ],
        h1: "DJ à Meaux et dans le nord Seine-et-Marne",
        intro: [
            "Le nord de la Seine-et-Marne a une particularité qui change tout pour la sonorisation : une grande partie des réceptions s'y tiennent dans des **bâtiments agricoles reconvertis** — granges, corps de ferme briards, hangars aménagés.",
            "Ce sont de beaux volumes, et acoustiquement les plus difficiles qui soient. C'est le point qui décide de la qualité de la soirée bien avant le choix des morceaux.",
        ],
        nearby: [
            "Chelles",
            "Claye-Souilly",
            "Lagny-sur-Marne",
            "Coulommiers",
            "Nanteuil-lès-Meaux",
            "Trilport",
            "La Ferté-sous-Jouarre",
        ],
        sections: [
            {
                title: "Sonoriser une grange ou un corps de ferme",
                body: [
                    "Un grand volume nu, avec des murs en pierre et une charpente apparente, renvoie le son au lieu de l'absorber. Monter le volume dans ces conditions ne rend pas la musique plus présente : cela rend les paroles inintelligibles et la piste inconfortable.",
                ],
                bullets: [
                    "**Plusieurs points de diffusion** à volume modéré plutôt qu'un système unique poussé fort",
                    "**Enceintes orientées vers la piste** et non vers les murs, pour réduire la réverbération",
                    "**Vérification de l'électricité** : sur un bâtiment agricole reconverti, l'installation n'est pas toujours dimensionnée pour une soirée",
                    "**Traitement des basses**, qui s'accumulent dans les volumes hauts et masquent le reste",
                ],
            },
            {
                title: "Les autres lieux du secteur",
                bullets: [
                    "**Salles municipales et espaces culturels** de Meaux et des communes voisines, généralement bien équipés",
                    "**Domaines et propriétés de la Brie**, avec réception en extérieur ou sous chapiteau",
                    "**Bords de Marne** : guinguettes et espaces en extérieur, avec la question du repli",
                    "**Sites d'entreprise** de la zone d'activité, pour séminaires et soirées de fin d'année",
                ],
            },
        ],
        faq: [
            {
                question: "Y a-t-il des frais de déplacement sur Meaux ?",
                answer:
                    "Non, Meaux et sa couronne sont dans ma zone habituelle depuis la Seine-et-Marne. Le déplacement est inclus au tarif de base.",
            },
            {
                question: "Ma réception est dans une grange sans électricité suffisante. Est-ce bloquant ?",
                answer:
                    "Pas nécessairement, mais cela doit être su avant. Selon le cas, on répartit la charge sur plusieurs lignes, ou le lieu loue un groupe électrogène. Le découvrir le jour même signifie une soirée sans son.",
            },
            {
                question: "Pouvez-vous sonoriser une cérémonie en extérieur puis la soirée en intérieur ?",
                answer:
                    "Oui, c'est la configuration la plus fréquente sur le secteur. Elle suppose deux systèmes distincts et un temps de bascule entre les deux, intégré au déroulé horaire.",
            },
        ],
        related: ["dj-chelles", "dj-marne-la-vallee", "dj-provins"],
    },

    {
        slug: "dj-fontainebleau",
        city: "Fontainebleau",
        department: "Seine-et-Marne (77)",
        navLabel: "Fontainebleau",
        metaTitle: "DJ à Fontainebleau (77) – Mariage et réception",
        metaDescription:
            "DJ professionnel à Fontainebleau et Avon : mariages en domaine, réceptions hôtelières et séminaires. Habitué aux lieux d'exception et à leurs contraintes. Devis gratuit.",
        keywords: [
            "DJ Fontainebleau",
            "DJ mariage Fontainebleau",
            "DJ château mariage",
            "DJ Avon 77",
            "DJ séminaire Fontainebleau",
        ],
        h1: "DJ à Fontainebleau",
        intro: [
            "Fontainebleau et sa forêt attirent des réceptions d'un autre type que le reste du département : mariages en domaine, séminaires résidentiels en hôtel, réceptions dans des lieux patrimoniaux.",
            "Ces lieux sont exigeants, moins sur la puissance que sur la **discrétion** : matériel qui doit s'effacer visuellement, installation sans fixation ni marquage, et volume tenu.",
        ],
        nearby: [
            "Avon",
            "Barbizon",
            "Bois-le-Roi",
            "Samois-sur-Seine",
            "Moret-Loing-et-Orvanne",
            "Nemours",
            "Milly-la-Forêt",
        ],
        sections: [
            {
                title: "Les lieux du secteur",
                bullets: [
                    "**Domaines et propriétés privées** en lisière de forêt, souvent avec cérémonie en extérieur et réception en orangerie",
                    "**Hôtels et centres de séminaire** : prestations corporate en semaine, avec sonorisation de plénière en journée puis soirée",
                    "**Lieux patrimoniaux** : cahier des charges strict sur les fixations, le passage de câbles et la protection des sols",
                    "**Auberges et restaurants de village** autour de Barbizon et Milly-la-Forêt, pour des formats plus intimes",
                ],
            },
            {
                title: "Ce que ces lieux imposent",
                body: [
                    "Un lieu d'exception impose presque toujours un cahier des charges au prestataire, transmis par le propriétaire ou le régisseur. Il est lu avant le devis, pas après.",
                ],
                bullets: [
                    "**Aucune fixation** dans les murs ni les charpentes : l'éclairage passe sur pieds, pas en accroche",
                    "**Câbles protégés et gainés**, notamment sur parquets anciens et sols en pierre",
                    "**Installation et démontage dans un créneau imposé**, parfois avec démontage le soir même",
                    "**Réception en extérieur** : la forêt et les grands parcs portent le son loin, ce qui impose un système directif plutôt que puissant",
                ],
            },
        ],
        faq: [
            {
                question: "Le domaine impose un cahier des charges prestataire. Est-ce un problème ?",
                answer:
                    "Au contraire, c'est utile : il indique à l'avance les contraintes de fixation, d'accès et d'horaire. Transmettez-le dès la demande de devis, il conditionne le matériel prévu et le temps d'installation à réserver.",
            },
            {
                question: "Intervenez-vous pour des séminaires d'entreprise en semaine ?",
                answer:
                    "Oui, c'est un format courant sur le secteur, avec sonorisation des plénières et micros pour les intervenants en journée, puis soirée de clôture. Devis et facture sont établis au nom de la société.",
            },
            {
                question: "Une cérémonie en extérieur en forêt est-elle sonorisable ?",
                answer:
                    "Oui, avec un système autonome et des micros HF pour les intervenants. Le point à valider est l'alimentation : sans point électrique à proximité, il faut prévoir une solution sur batterie, ce qui limite la durée et le volume.",
            },
        ],
        related: ["dj-melun", "dj-provins", "dj-paris"],
    },

    {
        slug: "dj-chelles",
        city: "Chelles",
        department: "Seine-et-Marne (77)",
        navLabel: "Chelles",
        metaTitle: "DJ à Chelles (77) – Anniversaire, soirée privée, mariage",
        metaDescription:
            "DJ professionnel à Chelles et dans l'est parisien : anniversaires, soirées privées et mariages. Salles municipales et réceptions à domicile. Devis gratuit sous 24 h.",
        keywords: [
            "DJ Chelles",
            "DJ anniversaire Chelles",
            "DJ mariage Chelles",
            "DJ est parisien",
            "DJ Vaires-sur-Marne",
        ],
        h1: "DJ à Chelles et dans l'est parisien",
        intro: [
            "Chelles et l'ouest de la Seine-et-Marne forment une zone dense, à cheval entre la banlieue et le département. Les réceptions y sont plus souvent des **anniversaires et des soirées privées** que des mariages en domaine.",
            "Le format dominant y est la salle municipale ou la réception à domicile — deux configurations où la contrainte principale est le voisinage, pas la technique.",
        ],
        nearby: [
            "Vaires-sur-Marne",
            "Brou-sur-Chantereine",
            "Courtry",
            "Champs-sur-Marne",
            "Noisiel",
            "Torcy",
            "Le Pin",
        ],
        sections: [
            {
                title: "Salles municipales et réceptions à domicile",
                bullets: [
                    "**Salles polyvalentes communales** : électricité correcte, mais horaire de fin fixé par la mairie et rarement négociable — à confirmer avant de caler le déroulé",
                    "**Réception à domicile** : la ligne électrique domestique ne supporte pas n'importe quelle puissance sur une seule prise, ce qui se vérifie en amont",
                    "**Jardins et extérieurs** : en zone résidentielle dense, le son porte sur plusieurs propriétés voisines",
                    "**Restaurants et espaces privatisés** : format cocktail, avec bascule en soirée dansante en fin de service",
                ],
            },
            {
                title: "La question du voisinage",
                body: [
                    "En zone résidentielle dense, c'est le seul vrai sujet. Passé 22 h, le tapage nocturne s'apprécie **sans mesure de niveau sonore** : la gêne suffit, et une plainte peut mettre fin à la soirée.",
                ],
                bullets: [
                    "Le système est orienté vers l'intérieur et vers la piste, jamais vers les limites de propriété",
                    "Les basses, qui traversent les murs bien mieux que le reste, sont contenues plutôt que poussées",
                    "Une bascule de volume est prévue à l'heure convenue, plutôt qu'une coupure sèche en fin de soirée",
                    "Prévenir les voisins proches en amont reste la mesure la plus efficace, et elle ne coûte rien",
                ],
            },
        ],
        faq: [
            {
                question: "Puis-je organiser une soirée dans mon jardin ?",
                answer:
                    "Oui, avec un volume calé pour l'extérieur et une heure de fin fixée à l'avance. En zone pavillonnaire, je recommande de basculer à l'intérieur en fin de soirée plutôt que de finir dehors — c'est ce qui déclenche les plaintes.",
            },
            {
                question: "Y a-t-il un supplément de déplacement ?",
                answer:
                    "Non, Chelles et les communes voisines sont dans ma zone habituelle. Le déplacement est inclus au tarif de base.",
            },
            {
                question: "Quelle puissance électrique faut-il prévoir à domicile ?",
                answer:
                    "Une prise dédiée près de l'emplacement du matériel, sur un circuit qui n'alimente pas déjà les gros appareils de la maison. Sur une installation ancienne, cela se vérifie avant plutôt que de faire sauter le disjoncteur en pleine soirée.",
            },
        ],
        related: ["dj-marne-la-vallee", "dj-paris", "dj-meaux"],
    },

    {
        slug: "dj-marne-la-vallee",
        city: "Marne-la-Vallée",
        department: "Seine-et-Marne (77)",
        navLabel: "Marne-la-Vallée",
        metaTitle: "DJ à Marne-la-Vallée – Séminaire, soirée entreprise, mariage",
        metaDescription:
            "DJ professionnel à Marne-la-Vallée et Val d'Europe : séminaires, soirées d'entreprise et mariages en hôtel. Facturation entreprise et attestation RC pro. Devis gratuit.",
        keywords: [
            "DJ Marne-la-Vallée",
            "DJ Val d'Europe",
            "DJ séminaire Marne-la-Vallée",
            "DJ soirée entreprise 77",
            "DJ Serris",
        ],
        h1: "DJ à Marne-la-Vallée et Val d'Europe",
        intro: [
            "Marne-la-Vallée est le secteur le plus **corporate** de mon périmètre. La concentration d'hôtels, de centres de congrès et de sièges d'entreprise y déplace la demande : beaucoup de séminaires, de soirées de fin d'année et de lancements, souvent en semaine.",
            "Ce sont des prestations où le conducteur horaire et la sonorisation de parole comptent autant que la partie musicale.",
        ],
        nearby: [
            "Serris",
            "Chessy",
            "Bailly-Romainvilliers",
            "Bussy-Saint-Georges",
            "Torcy",
            "Noisiel",
            "Lagny-sur-Marne",
        ],
        sections: [
            {
                title: "Travailler avec un hôtel ou un centre de congrès",
                body: [
                    "Ces établissements disposent presque toujours d'une régie et d'un référent technique. La bonne approche n'est pas d'apporter une seconde installation, mais de s'y raccorder.",
                ],
                bullets: [
                    "**Raccordement à la régie du lieu** quand elle existe : plus fiable, et temps de montage réduit",
                    "**Attestation de RC professionnelle** exigée par la plupart des établissements avant d'autoriser l'installation",
                    "**Créneau de montage imposé**, souvent court et coincé entre deux événements de la journée",
                    "**Contact technique en amont**, pour valider les branchements et éviter la découverte le jour même",
                ],
            },
            {
                title: "Les formats du secteur",
                bullets: [
                    "**Séminaires résidentiels** : plénières sonorisées en journée, soirée de clôture ensuite",
                    "**Soirées de fin d'année** : cocktail, dîner, remise de prix puis soirée dansante, sur un conducteur minuté",
                    "**Lancements et inaugurations** : fond sonore maîtrisé, avec montée sur le moment clé",
                    "**Mariages en hôtel** : configuration salle de réception, avec les contraintes d'un établissement en activité — voisinage de chambres occupées et horaire de fin ferme",
                ],
            },
        ],
        faq: [
            {
                question: "Pouvez-vous facturer au nom de la société ?",
                answer:
                    "Oui : devis, convention de prestation et facture au nom de la société, avec TVA apparente et les mentions attendues par un service comptable. Les modalités de règlement sont fixées au devis.",
            },
            {
                question: "L'hôtel demande une attestation d'assurance. Pouvez-vous la fournir ?",
                answer:
                    "Oui, une attestation de responsabilité civile professionnelle est transmise sur demande. Anticipez-la : certains établissements refusent l'accès au matériel sans ce document.",
            },
            {
                question: "Un mariage en hôtel a-t-il des contraintes particulières ?",
                answer:
                    "Oui, principalement l'horaire de fin, ferme parce que des chambres sont occupées au-dessus ou à côté de la salle. Il est fixé par l'établissement et se cale dans le déroulé dès la préparation.",
            },
        ],
        related: ["dj-chelles", "dj-meaux", "dj-paris"],
    },

    {
        slug: "dj-provins",
        city: "Provins",
        department: "Seine-et-Marne (77)",
        navLabel: "Provins",
        metaTitle: "DJ à Provins (77) – Mariage et réception",
        metaDescription:
            "DJ professionnel à Provins et dans l'est de la Seine-et-Marne : mariages en lieux historiques, corps de ferme et salles communales. Zone rurale desservie. Devis gratuit.",
        keywords: [
            "DJ Provins",
            "DJ mariage Provins",
            "DJ est Seine-et-Marne",
            "DJ Nangis",
            "DJ mariage rural 77",
        ],
        h1: "DJ à Provins et dans l'est Seine-et-Marne",
        intro: [
            "Provins, cité médiévale classée au patrimoine mondial de l'UNESCO, attire des réceptions dans des **lieux historiques** — caves voûtées, granges anciennes, bâtiments classés. Le secteur alentour est nettement plus rural que le reste du département.",
            "Deux conséquences concrètes : des lieux acoustiquement difficiles, et des contraintes d'accès qu'il faut connaître avant de s'engager sur un horaire.",
        ],
        nearby: [
            "Nangis",
            "Donnemarie-Dontilly",
            "Bray-sur-Seine",
            "Villiers-Saint-Georges",
            "Longueville",
            "Sourdun",
            "Chalautre-la-Petite",
        ],
        sections: [
            {
                title: "Lieux historiques et bâtiments anciens",
                body: [
                    "Une cave voûtée ou une salle en pierre est un très beau cadre et un environnement acoustique hostile : le son y rebondit longtemps, et la réverbération masque tout dès que le volume monte.",
                ],
                bullets: [
                    "**Diffusion répartie à volume modéré**, plutôt qu'un système unique poussé",
                    "**Aucune fixation** sur les murs ou charpentes des bâtiments protégés : éclairage sur pieds uniquement",
                    "**Accès contraint** : ruelles étroites de la ville haute, parfois sans accès véhicule au plus près, ce qui allonge le portage et donc le temps d'installation",
                    "**Électricité ancienne** dans certains bâtiments : la puissance disponible se vérifie avant, pas le jour J",
                ],
            },
            {
                title: "Le secteur rural alentour",
                bullets: [
                    "**Corps de ferme et granges** : le format dominant des mariages du secteur",
                    "**Salles communales de village** : simples, avec un horaire de fin fixé par la mairie",
                    "**Réceptions en extérieur** sur propriétés privées, presque toujours sans point électrique proche",
                    "**Éloignement** : peu de commerces et de services ouverts tard, donc une prestation à prévoir totalement autonome en matériel de secours",
                ],
            },
        ],
        faq: [
            {
                question: "Provins est loin. Y a-t-il un forfait déplacement ?",
                answer:
                    "Selon la commune exacte, un forfait déplacement peut s'appliquer sur l'est du département. Il est chiffré au devis, jamais ajouté après coup, et vous connaissez le montant total avant de vous engager.",
            },
            {
                question: "La salle est en ville haute, sans accès voiture direct. Est-ce faisable ?",
                answer:
                    "Oui, mais cela change le planning : le portage du matériel allonge l'installation d'une bonne heure. Signalez-le dès la demande de devis pour que l'heure d'arrivée soit calée en conséquence.",
            },
            {
                question: "Comment gérez-vous une réception en extérieur sans électricité ?",
                answer:
                    "Deux options : tirer une ligne depuis le bâtiment le plus proche si la distance le permet, ou prévoir un groupe électrogène côté lieu. C'est un point à trancher avant le devis, car il conditionne tout le reste.",
            },
        ],
        related: ["dj-melun", "dj-fontainebleau", "dj-meaux"],
    },
];

export function findCityPage(slug: string): CityPage | undefined {
    return CITY_PAGES.find((page) => page.slug === slug);
}

export const CITY_SLUGS = CITY_PAGES.map((page) => page.slug);
