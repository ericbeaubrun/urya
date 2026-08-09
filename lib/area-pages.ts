/**
 * Pages « zone d'intervention », organisées en trois étages : la région, ses
 * huit départements, puis quelques villes.
 *
 * C'est le format SEO le plus rentable et le plus risqué à la fois. Rentable
 * parce que « dj mariage + lieu » est une requête à forte intention d'achat.
 * Risqué parce que la tentation est de dupliquer un gabarit en changeant le
 * nom du territoire : Google qualifie ces pages de « doorway pages » et les
 * désindexe par lot, en emportant souvent la confiance accordée au domaine.
 *
 * D'où le choix du grain. Couvrir l'Île-de-France ne veut pas dire une page
 * par commune — il y en a 1 268, et 1 268 variantes d'un même texte sont la
 * définition exacte de ce que Google sanctionne. Le département est le plus
 * petit territoire sur lequel on peut encore écrire quelque chose de vrai et
 * de propre à lui : le 92 n'a pas les mêmes lieux ni les mêmes contraintes
 * que le 95. Les communes, elles, sont **citées en clair** dans le corps de
 * la page. C'est ce qui capte les requêtes locales sans créer de page vide.
 *
 * La règle appliquée ici reste donc la même : chaque page doit contenir au
 * moins une information qu'aucune autre ne contient et qui aiderait réellement
 * quelqu'un organisant son événement là — nature des lieux de réception du
 * secteur, contraintes d'accès et de bruit, conditions de déplacement depuis
 * la base. Si un nouveau territoire ne peut pas remplir ses sections
 * sincèrement, il vaut mieux ne pas créer la page.
 *
 * Rien ici n'affirme une prestation passée dans un lieu nommé : seuls sont
 * cités des faits publics (monuments, géographie, desserte) et des catégories
 * de lieux. Une référence client inventée serait à la fois un risque juridique
 * et, pour un moteur, un signal de contenu non fiable.
 */

export type AreaLevel = "region" | "department" | "city";

export interface AreaSection {
    title: string;
    /** Paragraphes. `**gras**` y est interprété. */
    body?: string[];
    bullets?: string[];
}

export interface AreaFaq {
    question: string;
    answer: string;
}

/**
 * Territoires couverts et cités en clair. Le titre et la phrase d'introduction
 * sont portés par la page plutôt que calculés : le français n'a pas de règle
 * unique de préposition devant un nom de lieu, et une phrase générée serait
 * fausse une fois sur trois.
 */
export interface AreaCoverage {
    title: string;
    intro: string;
    items: string[];
}

export interface AreaPage {
    slug: string;
    level: AreaLevel;
    /** Nom nu du territoire, tel qu'il apparaît dans le balisage. */
    name: string;
    /** Le nom précédé de sa préposition : « à Melun », « dans le Val-d'Oise ». */
    inLabel: string;
    navLabel: string;
    /** Accroche au-dessus du H1. */
    eyebrow: string;
    /** Slug de la page de niveau supérieur. Absent sur la seule page régionale. */
    parent?: string;
    /** Slugs des pages de niveau inférieur, mis en avant dans le corps. */
    children?: string[];
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    h1: string;
    intro: string[];
    coverage: AreaCoverage;
    /** Sections différenciantes : les lieux du secteur, puis la logistique. */
    sections: AreaSection[];
    faq: AreaFaq[];
    /** Slugs d'autres zones proposées en fin de page. */
    related: string[];
}

/* ------------------------------------------------------------------ région */

const REGION: AreaPage[] = [
    {
        slug: "dj-ile-de-france",
        level: "region",
        name: "Île-de-France",
        inLabel: "en Île-de-France",
        navLabel: "Île-de-France",
        eyebrow: "Zone d'intervention",
        children: [
            "dj-paris",
            "dj-seine-et-marne",
            "dj-yvelines",
            "dj-essonne",
            "dj-hauts-de-seine",
            "dj-seine-saint-denis",
            "dj-val-de-marne",
            "dj-val-doise",
        ],
        metaTitle: "DJ en Île-de-France – Mariage, soirée privée et entreprise",
        metaDescription:
            "DJ professionnel dans les huit départements d'Île-de-France : mariages, anniversaires, soirées privées et événements d'entreprise. Sonorisation et éclairage inclus. Devis gratuit sous 24 h.",
        keywords: [
            "DJ Île-de-France",
            "DJ IDF",
            "DJ mariage Île-de-France",
            "DJ soirée entreprise Île-de-France",
            "DJ région parisienne",
        ],
        h1: "DJ en Île-de-France",
        intro: [
            "L'Île-de-France tient dans un rayon d'une centaine de kilomètres, et pourtant deux réceptions distantes de quarante minutes n'y posent pas du tout le même problème. Une grange briarde et un salon du 8e arrondissement demandent un matériel différent, un temps d'installation différent et une gestion du volume différente.",
            "Je couvre les **huit départements** depuis une base en Seine-et-Marne. Ce qui change d'un secteur à l'autre n'est presque jamais la musique : c'est l'accès, l'électricité disponible et le seuil de bruit toléré.",
        ],
        coverage: {
            title: "Les grands pôles de réception",
            intro:
                "Chacun des huit départements a sa page ci-dessus, avec ses lieux, ses contraintes propres et les communes couvertes. Les secteurs d'où viennent le plus de demandes :",
            items: [
                "Paris",
                "Versailles",
                "Boulogne-Billancourt",
                "Saint-Denis",
                "Créteil",
                "Cergy",
                "Évry-Courcouronnes",
                "Marne-la-Vallée",
                "Melun",
                "Fontainebleau",
                "Saint-Germain-en-Laye",
                "Nanterre",
            ],
        },
        sections: [
            {
                title: "Trois familles de lieux, trois problèmes différents",
                body: [
                    "À peu près toutes les réceptions franciliennes entrent dans l'une de ces catégories. Savoir laquelle avant le devis détermine le matériel et le temps de montage.",
                ],
                bullets: [
                    "**Le dense** — Paris et la petite couronne : salles en étage ou en sous-sol, limiteur de bruit quasi systématique, créneau de livraison court, horaire de fin imposé. La contrainte est réglementaire et logistique, jamais acoustique",
                    "**Le patrimonial** — châteaux, domaines et lieux classés des Yvelines, du sud 77 et du Vexin : cahier des charges prestataire, aucune fixation autorisée, cérémonie en extérieur puis réception en intérieur, donc deux systèmes distincts",
                    "**Le rural et l'agricole** — corps de ferme briards, granges du Vexin, propriétés de la Beauce : grands volumes réverbérants où pousser le volume dégrade le son, et installations électriques rarement dimensionnées pour une soirée",
                    "**Le corporate**, qui traverse les trois : hôtels, centres de congrès et sièges d'entreprise, où l'on se raccorde à la régie du lieu plutôt que d'apporter une seconde installation",
                ],
            },
            {
                title: "Déplacement : ce qui est inclus, ce qui ne l'est pas",
                body: [
                    "La base est en Seine-et-Marne. La règle est annoncée au devis et ne bouge plus après : **vous connaissez le montant total avant de vous engager**, frais de déplacement compris.",
                ],
                bullets: [
                    "**Déplacement inclus** sur la Seine-et-Marne, Paris, et la petite couronne (92, 93, 94)",
                    "**Forfait déplacement possible** sur l'ouest et le nord de la région — Yvelines, Val-d'Oise, ouest de l'Essonne — ainsi que sur l'est rural du 77. Il est chiffré au devis, jamais ajouté après coup",
                    "**Frais refacturés au réel** uniquement quand le lieu les impose : stationnement, badge d'accès, créneau de livraison payant",
                    "**Repérage sur site** offert sur la Seine-et-Marne et la proche couronne, sur demande ailleurs",
                ],
            },
            {
                title: "Ce que la région impose partout",
                bullets: [
                    "**Le limiteur de bruit** : présent dans la majorité des salles franciliennes, y compris en grande couronne. Il coupe l'alimentation au dépassement du seuil, ce qui suppose de connaître ce seuil avant le jour J et non pendant la soirée",
                    "**Le tapage nocturne** : au-delà de 22 h, il s'apprécie sans mesure de niveau sonore. La gêne suffit, et une plainte peut écourter la soirée — c'est vrai en pavillon comme en copropriété",
                    "**L'horaire de fin**, presque toujours fixé par le lieu et non négociable. Il structure le set entier, pas seulement sa dernière heure",
                    "**L'accès véhicule** : de la ruelle médiévale de Provins au parking souterrain à hauteur limitée de La Défense, c'est le premier point vérifié — il conditionne l'heure d'arrivée",
                ],
            },
        ],
        faq: [
            {
                question: "Intervenez-vous vraiment dans toute l'Île-de-France ?",
                answer:
                    "Oui, dans les huit départements. Selon la commune, un forfait déplacement peut s'appliquer sur l'ouest et le nord de la région ; il est chiffré au devis. Aucune zone n'est exclue a priori : indiquez le lieu exact et vous avez la réponse avec le tarif.",
            },
            {
                question: "Comment savoir si ma salle impose un limiteur de bruit ?",
                answer:
                    "C'est la première question posée au lieu lors du point technique, et vous pouvez la poser vous-même dès la visite : y a-t-il un limiteur, à quel seuil, et coupe-t-il l'alimentation ou déclenche-t-il seulement une alarme ? La réponse change le matériel prévu.",
            },
            {
                question: "Ma réception est en grande couronne, loin de votre base. Est-ce un problème ?",
                answer:
                    "Non, cela se traduit simplement par un forfait déplacement annoncé au devis. Le seul point réellement contraignant est l'installation en extérieur sans électricité proche : là, la question du groupe électrogène se tranche avant le devis, pas après.",
            },
            {
                question: "Pouvez-vous intervenir en semaine pour un événement d'entreprise ?",
                answer:
                    "Oui, c'est un format courant sur La Défense, Marne-la-Vallée et le plateau de Saclay : plénières sonorisées en journée puis soirée de clôture. Devis, convention de prestation et facture sont établis au nom de la société, avec attestation de RC professionnelle sur demande.",
            },
        ],
        related: ["dj-paris", "dj-seine-et-marne", "dj-hauts-de-seine"],
    },
];

/* ------------------------------------------------------------ départements */

const DEPARTMENTS: AreaPage[] = [
    {
        slug: "dj-paris",
        level: "department",
        name: "Paris",
        inLabel: "à Paris",
        navLabel: "Paris (75)",
        eyebrow: "Zone d'intervention · Île-de-France",
        parent: "dj-ile-de-france",
        metaTitle: "DJ à Paris (75) – Mariage, soirée privée et entreprise",
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
        coverage: {
            title: "Arrondissements et secteurs couverts",
            intro:
                "J'interviens dans les vingt arrondissements, sans distinction ni supplément d'un secteur à l'autre. Les quartiers où les réceptions sont les plus fréquentes :",
            items: [
                "Marais",
                "Bastille",
                "Montmartre",
                "Champs-Élysées",
                "Saint-Germain-des-Prés",
                "Montparnasse",
                "Bercy",
                "La Villette",
                "Batignolles",
                "Belleville",
                "Quais de Seine",
                "Porte de Versailles",
            ],
        },
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
                question: "Intervenez-vous en petit comité dans un appartement ?",
                answer:
                    "Oui, avec un matériel volontairement léger. Dans un appartement, la contrainte n'est jamais la puissance mais le voisinage : le volume est calé pour rester tenable, et l'heure de fin fixée avant de commencer.",
            },
        ],
        related: ["dj-hauts-de-seine", "dj-seine-saint-denis", "dj-val-de-marne"],
    },

    {
        slug: "dj-seine-et-marne",
        level: "department",
        name: "Seine-et-Marne",
        inLabel: "en Seine-et-Marne",
        navLabel: "Seine-et-Marne (77)",
        eyebrow: "Zone d'intervention · Île-de-France",
        parent: "dj-ile-de-france",
        children: [
            "dj-melun",
            "dj-meaux",
            "dj-fontainebleau",
            "dj-chelles",
            "dj-marne-la-vallee",
            "dj-provins",
        ],
        metaTitle: "DJ en Seine-et-Marne (77) – Mariage, anniversaire, entreprise",
        metaDescription:
            "DJ professionnel en Seine-et-Marne : mariages en domaine et en corps de ferme, anniversaires, soirées d'entreprise. Département de base, déplacement inclus. Devis gratuit sous 24 h.",
        keywords: [
            "DJ Seine-et-Marne",
            "DJ 77",
            "DJ mariage Seine-et-Marne",
            "DJ mariage grange 77",
            "DJ anniversaire 77",
        ],
        h1: "DJ en Seine-et-Marne",
        intro: [
            "La Seine-et-Marne est mon département de base, et le plus vaste d'Île-de-France — à lui seul, près de la moitié de la superficie régionale. Autant dire qu'il n'a rien d'homogène : l'ouest est une banlieue dense, l'est est franchement rural.",
            "C'est aussi la zone où j'interviens dans les **meilleures conditions logistiques** : trajet court, repérage possible avant le jour J, aucun forfait déplacement, et pas de contrainte d'heure de fin liée au retour.",
        ],
        coverage: {
            title: "Communes couvertes",
            intro:
                "Six secteurs ont leur page dédiée ci-dessous. En dehors de ceux-là, j'interviens notamment à :",
            items: [
                "Coulommiers",
                "Nemours",
                "Montereau-Fault-Yonne",
                "Pontault-Combault",
                "Roissy-en-Brie",
                "Ozoir-la-Ferrière",
                "Lieusaint",
                "Moissy-Cramayel",
                "Savigny-le-Temple",
                "Nangis",
                "Lagny-sur-Marne",
                "Bussy-Saint-Georges",
                "Champs-sur-Marne",
                "Villeparisis",
                "Mitry-Mory",
                "Dammartin-en-Goële",
                "La Ferté-sous-Jouarre",
                "Tournan-en-Brie",
                "Brie-Comte-Robert",
                "Avon",
            ],
        },
        sections: [
            {
                title: "Le département où l'on se marie en grange",
                body: [
                    "C'est la particularité du 77, et elle change tout pour la sonorisation : une grande partie des réceptions s'y tiennent dans des **bâtiments agricoles reconvertis** — corps de ferme briards, granges, hangars aménagés. De beaux volumes, et acoustiquement les plus difficiles qui soient.",
                    "Un grand volume nu, avec des murs en pierre et une charpente apparente, renvoie le son au lieu de l'absorber. Monter le volume n'y rend pas la musique plus présente : cela rend les paroles inintelligibles et la piste inconfortable.",
                ],
                bullets: [
                    "**Plusieurs points de diffusion** à volume modéré plutôt qu'un système unique poussé fort",
                    "**Enceintes orientées vers la piste** et non vers les murs, pour réduire la réverbération",
                    "**Vérification de l'électricité** : sur un bâtiment agricole reconverti, l'installation n'est pas toujours dimensionnée pour une soirée",
                    "**Traitement des basses**, qui s'accumulent dans les volumes hauts et masquent le reste",
                ],
            },
            {
                title: "Un département, quatre secteurs qui n'ont rien à voir",
                bullets: [
                    "**Ouest urbain** (Chelles, Pontault-Combault, Villeparisis) : anniversaires et soirées privées, salles municipales et réceptions à domicile, où la contrainte est le voisinage",
                    "**Val d'Europe et Marne-la-Vallée** : le secteur corporate du département, hôtels et centres de congrès, séminaires en semaine",
                    "**Sud** (Melun, Fontainebleau) : la plus forte concentration de domaines et de châteaux, avec cérémonie en extérieur et réception en orangerie",
                    "**Est rural** (Provins, Coulommiers, Nangis) : corps de ferme, salles communales de village, réceptions en extérieur souvent sans point électrique proche",
                ],
            },
        ],
        faq: [
            {
                question: "Y a-t-il des frais de déplacement en Seine-et-Marne ?",
                answer:
                    "Non sur la plus grande partie du département, qui est ma zone habituelle. Un forfait peut s'appliquer sur l'extrême est, au-delà de Provins et de Coulommiers ; il est alors chiffré au devis, jamais ajouté après coup.",
            },
            {
                question: "Pouvez-vous venir voir la salle avant l'événement ?",
                answer:
                    "Oui, et je le recommande en Seine-et-Marne puisque c'est sans frais. Un repérage de trente minutes évite la plupart des mauvaises surprises : puissance disponible, distance au tableau électrique, emplacement réel de la piste.",
            },
            {
                question: "Ma réception est dans une grange sans électricité suffisante. Est-ce bloquant ?",
                answer:
                    "Pas nécessairement, mais cela doit être su avant. Selon le cas, on répartit la charge sur plusieurs lignes, ou le lieu loue un groupe électrogène. Le découvrir le jour même signifie une soirée sans son.",
            },
        ],
        related: ["dj-melun", "dj-meaux", "dj-ile-de-france"],
    },

    {
        slug: "dj-yvelines",
        level: "department",
        name: "Yvelines",
        inLabel: "dans les Yvelines",
        navLabel: "Yvelines (78)",
        eyebrow: "Zone d'intervention · Île-de-France",
        parent: "dj-ile-de-france",
        metaTitle: "DJ dans les Yvelines (78) – Mariage en château et réception",
        metaDescription:
            "DJ professionnel dans les Yvelines : mariages en château et en domaine, réceptions à Versailles et Saint-Germain-en-Laye, séminaires. Habitué aux cahiers des charges patrimoniaux. Devis gratuit.",
        keywords: [
            "DJ Yvelines",
            "DJ 78",
            "DJ mariage Versailles",
            "DJ mariage château 78",
            "DJ Saint-Germain-en-Laye",
        ],
        h1: "DJ dans les Yvelines",
        intro: [
            "Les Yvelines concentrent la plus forte densité de **lieux patrimoniaux** de la région : châteaux, orangeries, propriétés privées, anciennes fermes seigneuriales de la vallée de Chevreuse. C'est le département où les réceptions sont les plus belles et les cahiers des charges les plus stricts.",
            "Ces lieux sont exigeants, moins sur la puissance que sur la **discrétion** : matériel qui doit s'effacer visuellement, installation sans aucune fixation, câbles protégés sur parquets anciens, et volume tenu vers l'extérieur.",
        ],
        coverage: {
            title: "Communes couvertes",
            intro:
                "De la boucle de Seine à la vallée de Chevreuse, j'interviens notamment à :",
            items: [
                "Versailles",
                "Saint-Germain-en-Laye",
                "Rambouillet",
                "Poissy",
                "Mantes-la-Jolie",
                "Sartrouville",
                "Le Chesnay-Rocquencourt",
                "Montigny-le-Bretonneux",
                "Guyancourt",
                "Conflans-Sainte-Honorine",
                "Houilles",
                "Maisons-Laffitte",
                "Le Vésinet",
                "Chatou",
                "Marly-le-Roi",
                "Vélizy-Villacoublay",
                "Plaisir",
                "Les Mureaux",
                "Chevreuse",
                "Dampierre-en-Yvelines",
            ],
        },
        sections: [
            {
                title: "Les lieux du département",
                bullets: [
                    "**Châteaux et orangeries** : cérémonie en extérieur puis réception en intérieur, donc deux systèmes distincts et un temps de bascule à intégrer au déroulé horaire",
                    "**Propriétés privées et grands parcs** de la boucle de Seine (Maisons-Laffitte, Le Vésinet) : le son porte très loin en extérieur, ce qui impose un système directif plutôt que puissant",
                    "**Anciennes fermes et granges de la vallée de Chevreuse** : volumes en pierre à forte réverbération, où le placement des enceintes compte plus que leur puissance",
                    "**Hôtels et golfs** autour de Saint-Germain et de Rambouillet : séminaires résidentiels en semaine, soirée de clôture ensuite",
                    "**Salles municipales** des communes de la boucle : bien équipées en électricité, mais avec un horaire de fin fixé par la mairie",
                ],
            },
            {
                title: "Travailler dans un lieu classé",
                body: [
                    "Un lieu d'exception impose presque toujours un cahier des charges au prestataire, transmis par le propriétaire ou le régisseur. Il est lu avant le devis, pas après : il conditionne le matériel prévu et le temps d'installation à réserver.",
                ],
                bullets: [
                    "**Aucune fixation** dans les murs ni les charpentes : l'éclairage passe sur pieds, jamais en accroche",
                    "**Câbles gainés et protégés**, notamment sur parquets anciens, tomettes et sols en pierre",
                    "**Créneau de montage et de démontage imposé**, parfois avec démontage le soir même après la fin de la soirée",
                    "**Seuil de bruit bas en extérieur** : un parc n'atténue rien, et les propriétés voisines sont souvent proches",
                ],
            },
        ],
        faq: [
            {
                question: "Y a-t-il un forfait déplacement pour les Yvelines ?",
                answer:
                    "Le département est à l'opposé de ma base seine-et-marnaise, donc un forfait déplacement s'applique généralement. Il est chiffré au devis en fonction de la commune exacte, et vous connaissez le montant total avant de vous engager.",
            },
            {
                question: "Le domaine impose un cahier des charges prestataire. Est-ce un problème ?",
                answer:
                    "Au contraire, c'est utile : il indique à l'avance les contraintes de fixation, d'accès et d'horaire. Transmettez-le dès la demande de devis — c'est lui qui détermine le matériel prévu et le temps d'installation à réserver.",
            },
            {
                question: "Peut-on sonoriser une cérémonie laïque dans un parc ?",
                answer:
                    "Oui, avec un système autonome et des micros HF pour les intervenants. Le point à valider est l'alimentation : sans point électrique à proximité, il faut une solution sur batterie, ce qui limite la durée et le volume. C'est à trancher avant le devis.",
            },
        ],
        related: ["dj-hauts-de-seine", "dj-essonne", "dj-val-doise"],
    },

    {
        slug: "dj-essonne",
        level: "department",
        name: "Essonne",
        inLabel: "en Essonne",
        navLabel: "Essonne (91)",
        eyebrow: "Zone d'intervention · Île-de-France",
        parent: "dj-ile-de-france",
        metaTitle: "DJ en Essonne (91) – Mariage, anniversaire et séminaire",
        metaDescription:
            "DJ professionnel en Essonne : mariages en domaine dans le sud du département, anniversaires en salle communale, séminaires sur le plateau de Saclay. Devis gratuit sous 24 h.",
        keywords: [
            "DJ Essonne",
            "DJ 91",
            "DJ mariage Essonne",
            "DJ séminaire Saclay",
            "DJ anniversaire Évry",
        ],
        h1: "DJ en Essonne",
        intro: [
            "L'Essonne est le département le plus contrasté de la région : au nord, une banlieue dense et le plateau de Saclay avec ses campus et ses sièges d'entreprise ; au sud, la Beauce, des domaines et des villages où l'on se marie en corps de ferme.",
            "Concrètement, deux demandes très différentes arrivent du même département : des **séminaires en semaine** au nord, des **mariages en domaine** au sud. Elles ne demandent ni le même matériel ni le même déroulé.",
        ],
        coverage: {
            title: "Communes couvertes",
            intro: "Du plateau de Saclay au sud du département, j'interviens notamment à :",
            items: [
                "Évry-Courcouronnes",
                "Massy",
                "Palaiseau",
                "Savigny-sur-Orge",
                "Sainte-Geneviève-des-Bois",
                "Corbeil-Essonnes",
                "Athis-Mons",
                "Yerres",
                "Draveil",
                "Brétigny-sur-Orge",
                "Montgeron",
                "Longjumeau",
                "Les Ulis",
                "Gif-sur-Yvette",
                "Saint-Michel-sur-Orge",
                "Mennecy",
                "Arpajon",
                "Dourdan",
                "Étampes",
                "Milly-la-Forêt",
            ],
        },
        sections: [
            {
                title: "Le sud : domaines, fermes et salles de village",
                bullets: [
                    "**Domaines et propriétés de la Beauce**, autour de Dourdan et d'Étampes : réception sous chapiteau ou en orangerie, avec la question du repli en cas de pluie",
                    "**Corps de ferme rénovés** : grands volumes réverbérants, où l'on répartit la diffusion à volume modéré plutôt que de pousser un système unique",
                    "**Salles des fêtes communales** : électricité correcte, horaire de fin fixé par la mairie et rarement négociable",
                    "**Bords de l'Essonne et de la Juine** : réceptions en extérieur, presque toujours sans point électrique à proximité immédiate",
                ],
            },
            {
                title: "Le nord : Saclay, Massy et le corporate",
                body: [
                    "Le plateau de Saclay et le pôle de Massy concentrent campus, laboratoires et sièges d'entreprise. La demande y est majoritairement professionnelle, et souvent en semaine.",
                ],
                bullets: [
                    "**Séminaires et journées d'étude** : sonorisation de plénière, micros HF pour les intervenants, puis soirée de clôture",
                    "**Raccordement à la régie du lieu** quand elle existe — amphithéâtres et centres de congrès en sont équipés : plus fiable, et temps de montage réduit",
                    "**Attestation de RC professionnelle** exigée par la plupart des établissements avant d'autoriser l'installation",
                    "**Soirées de fin d'année et lancements** : conducteur minuté, cocktail puis bascule en soirée dansante",
                    "**Facturation au nom de la société**, avec les mentions attendues par un service comptable",
                ],
            },
        ],
        faq: [
            {
                question: "Intervenez-vous dans le sud du département, vers Étampes et Dourdan ?",
                answer:
                    "Oui. C'est un secteur éloigné de ma base, donc un forfait déplacement s'applique généralement ; il est chiffré au devis selon la commune. En contrepartie, ce sont souvent des lieux où l'installation est simple, sans contrainte d'accès.",
            },
            {
                question: "Pouvez-vous facturer au nom de la société pour un séminaire ?",
                answer:
                    "Oui : devis, convention de prestation et facture au nom de la société, avec TVA apparente et les mentions attendues par un service comptable. Les modalités de règlement sont fixées au devis.",
            },
            {
                question: "Et pour une réception sous chapiteau ?",
                answer:
                    "C'est courant sur les domaines du sud du département. Deux points sont vérifiés en amont : d'où vient l'électricité, et quelle est la solution de repli en cas de pluie. Le matériel électronique ne supporte pas l'eau, même sous une simple averse.",
            },
        ],
        related: ["dj-yvelines", "dj-val-de-marne", "dj-seine-et-marne"],
    },

    {
        slug: "dj-hauts-de-seine",
        level: "department",
        name: "Hauts-de-Seine",
        inLabel: "dans les Hauts-de-Seine",
        navLabel: "Hauts-de-Seine (92)",
        eyebrow: "Zone d'intervention · Île-de-France",
        parent: "dj-ile-de-france",
        metaTitle: "DJ dans les Hauts-de-Seine (92) – Entreprise, mariage, soirée",
        metaDescription:
            "DJ professionnel dans les Hauts-de-Seine : soirées d'entreprise à La Défense, mariages à Boulogne et Neuilly, réceptions privées. Facturation entreprise et RC pro. Devis gratuit.",
        keywords: [
            "DJ Hauts-de-Seine",
            "DJ 92",
            "DJ soirée entreprise La Défense",
            "DJ mariage Boulogne-Billancourt",
            "DJ Neuilly-sur-Seine",
        ],
        h1: "DJ dans les Hauts-de-Seine",
        intro: [
            "Le 92 est le département le plus **corporate** de la région. La Défense, Issy-les-Moulineaux, Boulogne-Billancourt : la concentration de sièges sociaux y déplace la demande vers les soirées d'entreprise, les lancements et les fins d'année, souvent en semaine.",
            "Côté privé, la contrainte est l'inverse de celle du 77 : jamais l'acoustique, toujours le **voisinage et l'accès**. On y travaille en étage, en copropriété, avec un créneau de montage court et un horaire de fin ferme.",
        ],
        coverage: {
            title: "Communes couvertes",
            intro: "De la boucle nord au sud du département, j'interviens notamment à :",
            items: [
                "Boulogne-Billancourt",
                "Neuilly-sur-Seine",
                "Nanterre",
                "Levallois-Perret",
                "Issy-les-Moulineaux",
                "Courbevoie",
                "Puteaux",
                "Rueil-Malmaison",
                "Clichy",
                "Asnières-sur-Seine",
                "Colombes",
                "Antony",
                "Clamart",
                "Meudon",
                "Suresnes",
                "Saint-Cloud",
                "Sèvres",
                "Montrouge",
                "Vanves",
                "Sceaux",
            ],
        },
        sections: [
            {
                title: "Soirées d'entreprise et espaces événementiels",
                body: [
                    "Les tours et les campus d'entreprise disposent presque toujours d'une régie et d'un référent technique. La bonne approche n'est pas d'apporter une seconde installation, mais de s'y raccorder.",
                ],
                bullets: [
                    "**Raccordement à la régie du lieu** quand elle existe : plus fiable, et temps de montage nettement réduit",
                    "**Badge et contrôle d'accès** : dans les tours, l'accès prestataire se demande plusieurs jours à l'avance, avec la liste nominative et le détail du matériel",
                    "**Parkings souterrains à hauteur limitée** : c'est le point le plus souvent négligé. Un véhicule utilitaire ne passe pas partout, et le portage depuis la voirie change l'heure d'arrivée",
                    "**Créneau de montage court**, coincé entre la fin de journée de travail et le début de l'événement",
                    "**Attestation de RC professionnelle** exigée avant toute installation, à anticiper : certains sites refusent l'accès sans ce document",
                ],
            },
            {
                title: "Réceptions privées en zone dense",
                bullets: [
                    "**Salons privatisés et espaces de réception** à Boulogne, Neuilly et Levallois : souvent en étage, avec limiteur de bruit et horaire de fin imposé par le bail commercial du lieu",
                    "**Rooftops et terrasses** : le son porte sur les immeubles voisins, donc système directif orienté vers la piste et seuil bas",
                    "**Réceptions à domicile en copropriété** : la ligne électrique domestique ne supporte pas n'importe quelle puissance sur une seule prise, et les basses traversent les planchers bien mieux que le reste",
                    "**Péniches et bords de Seine** sur la boucle de Suresnes à Asnières : volume clos et réverbérant, alimentation limitée, portage par passerelle",
                    "**Restaurants et clubs privatisés** : format cocktail avec bascule en soirée dansante en fin de service",
                ],
            },
        ],
        faq: [
            {
                question: "Y a-t-il des frais de déplacement pour le 92 ?",
                answer:
                    "Non, la petite couronne est dans ma zone habituelle : le déplacement est inclus. Seuls les frais imposés par le lieu — stationnement, badge d'accès, créneau de livraison payant — sont refacturés au réel et annoncés au devis.",
            },
            {
                question: "Le site demande une attestation d'assurance et un badge. Comment ça se passe ?",
                answer:
                    "L'attestation de responsabilité civile professionnelle est transmise sur demande, et la demande de badge se fait auprès du site plusieurs jours avant. Anticipez-la : sans ce document, l'accès au matériel est purement et simplement refusé.",
            },
            {
                question: "La salle est au 12e étage. Est-ce faisable ?",
                answer:
                    "Oui, mais cela change le planning. Ce qui compte, ce sont les dimensions de l'ascenseur de service et sa disponibilité sur le créneau de montage. Signalez-le dès la demande de devis pour que l'heure d'arrivée soit calée en conséquence.",
            },
        ],
        related: ["dj-paris", "dj-yvelines", "dj-val-de-marne"],
    },

    {
        slug: "dj-seine-saint-denis",
        level: "department",
        name: "Seine-Saint-Denis",
        inLabel: "en Seine-Saint-Denis",
        navLabel: "Seine-Saint-Denis (93)",
        eyebrow: "Zone d'intervention · Île-de-France",
        parent: "dj-ile-de-france",
        metaTitle: "DJ en Seine-Saint-Denis (93) – Mariage et grande réception",
        metaDescription:
            "DJ professionnel en Seine-Saint-Denis : mariages et grandes réceptions en salle privée, anniversaires, soirées d'entreprise. Habitué aux formats de 150 à 400 convives. Devis gratuit.",
        keywords: [
            "DJ Seine-Saint-Denis",
            "DJ 93",
            "DJ mariage 93",
            "DJ grande réception mariage",
            "DJ Montreuil",
        ],
        h1: "DJ en Seine-Saint-Denis",
        intro: [
            "Le 93 est le département des **grandes réceptions**. C'est celui qui compte le plus de salles privées dédiées au mariage, et où les formats de 150 à 400 convives sont la norme plutôt que l'exception.",
            "Ce n'est pas seulement une question de puissance. Une salle de 300 personnes se sonorise en plusieurs points, se cale sur un déroulé souvent long, et impose une lecture de piste différente d'un mariage de 80 invités.",
        ],
        coverage: {
            title: "Communes couvertes",
            intro: "Sur l'ensemble du département, j'interviens notamment à :",
            items: [
                "Saint-Denis",
                "Montreuil",
                "Aubervilliers",
                "Aulnay-sous-Bois",
                "Drancy",
                "Noisy-le-Grand",
                "Pantin",
                "Le Blanc-Mesnil",
                "Bondy",
                "Épinay-sur-Seine",
                "Bobigny",
                "Rosny-sous-Bois",
                "Sevran",
                "Saint-Ouen-sur-Seine",
                "Villepinte",
                "Tremblay-en-France",
                "Livry-Gargan",
                "Gagny",
                "Le Raincy",
                "Bagnolet",
            ],
        },
        sections: [
            {
                title: "Sonoriser une grande salle de réception",
                body: [
                    "Au-delà de 150 convives, un système unique placé en fond de salle ne fonctionne plus : les premiers rangs sont trop forts avant que les derniers n'entendent correctement. La réponse n'est pas plus de puissance, c'est une meilleure répartition.",
                ],
                bullets: [
                    "**Diffusion répartie** en plusieurs points, avec des niveaux calés zone par zone plutôt qu'un volume unique",
                    "**Sonorisation de parole distincte** de la musique : sur ces formats, discours, animations et entrées prennent une place réelle dans le déroulé",
                    "**Vérification de la puissance électrique** de la salle en amont, surtout quand un traiteur et un éclairagiste tirent sur les mêmes lignes",
                    "**Déroulé horaire long** : ces réceptions commencent tôt et finissent tard, ce qui suppose une gestion d'énergie sur toute la soirée et pas seulement un pic en fin de nuit",
                ],
            },
            {
                title: "Les lieux du département",
                bullets: [
                    "**Salles de réception privées** : le format dominant, généralement bien équipé en électricité, avec un horaire de fin fixé au contrat de location",
                    "**Halles et entrepôts reconvertis** à Saint-Ouen, Pantin et Montreuil : très grands volumes bruts, où tout est à apporter et où la réverbération est le vrai sujet",
                    "**Salles municipales** : électricité correcte, horaire de fin fixé par la mairie et rarement négociable — à confirmer avant de caler le déroulé",
                    "**Hôtels et centres d'affaires** autour de Roissy et du Parc des expositions de Villepinte : séminaires, soirées de fin d'année et conventions",
                    "**Réceptions à domicile et en jardin** dans les communes pavillonnaires de l'est : là, la contrainte redevient le voisinage",
                ],
            },
        ],
        faq: [
            {
                question: "Pouvez-vous sonoriser une réception de 300 personnes ?",
                answer:
                    "Oui, c'est un format courant sur le département. Ce qui change par rapport à un mariage de 80 convives n'est pas seulement le matériel mais la répartition : plusieurs points de diffusion calés zone par zone, et une sonorisation de parole distincte de la musique.",
            },
            {
                question: "Y a-t-il des frais de déplacement pour le 93 ?",
                answer:
                    "Non, le département est dans ma zone habituelle depuis la Seine-et-Marne. Le déplacement est inclus au tarif de base ; seuls les frais imposés par le lieu sont refacturés au réel.",
            },
            {
                question: "La soirée peut-elle se prolonger tard ?",
                answer:
                    "Cela dépend uniquement du lieu, jamais de moi. L'horaire de fin figure au contrat de location de la salle : confirmez-le avant de caler le déroulé, il structure toute la soirée et pas seulement sa dernière heure.",
            },
        ],
        related: ["dj-paris", "dj-val-de-marne", "dj-seine-et-marne"],
    },

    {
        slug: "dj-val-de-marne",
        level: "department",
        name: "Val-de-Marne",
        inLabel: "dans le Val-de-Marne",
        navLabel: "Val-de-Marne (94)",
        eyebrow: "Zone d'intervention · Île-de-France",
        parent: "dj-ile-de-france",
        metaTitle: "DJ dans le Val-de-Marne (94) – Mariage, anniversaire, soirée",
        metaDescription:
            "DJ professionnel dans le Val-de-Marne : mariages en bord de Marne, anniversaires en salle communale, réceptions à domicile et soirées d'entreprise. Déplacement inclus. Devis gratuit.",
        keywords: [
            "DJ Val-de-Marne",
            "DJ 94",
            "DJ mariage bord de Marne",
            "DJ guinguette",
            "DJ Saint-Maur-des-Fossés",
        ],
        h1: "DJ dans le Val-de-Marne",
        intro: [
            "Le Val-de-Marne a une signature que les autres départements n'ont pas : les **bords de Marne**. Guinguettes, péniches, salles avec terrasse sur l'eau de Joinville à Nogent — c'est là que se tient une bonne part des réceptions du département.",
            "Le reste est une banlieue résidentielle dense, où le format dominant est l'anniversaire ou la soirée privée en salle communale, et où la contrainte principale est le voisinage plutôt que la technique.",
        ],
        coverage: {
            title: "Communes couvertes",
            intro: "Sur l'ensemble du département, j'interviens notamment à :",
            items: [
                "Créteil",
                "Vitry-sur-Seine",
                "Saint-Maur-des-Fossés",
                "Champigny-sur-Marne",
                "Ivry-sur-Seine",
                "Maisons-Alfort",
                "Vincennes",
                "Fontenay-sous-Bois",
                "Villejuif",
                "Alfortville",
                "Choisy-le-Roi",
                "Nogent-sur-Marne",
                "Le Perreux-sur-Marne",
                "Charenton-le-Pont",
                "Joinville-le-Pont",
                "Saint-Mandé",
                "Sucy-en-Brie",
                "Bry-sur-Marne",
                "Cachan",
                "Rungis",
            ],
        },
        sections: [
            {
                title: "Les bords de Marne",
                body: [
                    "Une réception au bord de l'eau est un très beau cadre et un environnement sonore particulier : rien n'arrête le son côté rivière, et il porte jusqu'aux habitations de la rive opposée.",
                ],
                bullets: [
                    "**Système orienté vers la piste**, jamais vers l'eau : c'est la seule façon de tenir un volume confortable sans gêner la rive d'en face",
                    "**Guinguettes et salles avec terrasse** : deux ambiances à gérer, l'extérieur en journée et l'intérieur en soirée, avec une bascule prévue au déroulé",
                    "**Péniches** : volume clos et réverbérant, alimentation limitée, matériel à descendre par une passerelle étroite — le temps d'installation double",
                    "**Repli en cas de pluie** : sur une réception annoncée en extérieur, c'est la question à trancher avant le devis, pas le jour même",
                ],
            },
            {
                title: "Le reste du département",
                bullets: [
                    "**Salles polyvalentes communales** : électricité correcte, mais horaire de fin fixé par la mairie et rarement négociable",
                    "**Réceptions à domicile et en jardin** dans les communes pavillonnaires : la ligne électrique domestique se vérifie en amont, et le son porte sur plusieurs propriétés voisines",
                    "**Restaurants et espaces privatisés** à Vincennes, Saint-Mandé et Nogent : format cocktail avec bascule en soirée dansante en fin de service",
                    "**Sites d'entreprise** du secteur de Rungis, d'Orly et de Créteil : séminaires, soirées de fin d'année, avec facturation au nom de la société",
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
                question: "Y a-t-il des frais de déplacement pour le 94 ?",
                answer:
                    "Non, le département est dans ma zone habituelle depuis la Seine-et-Marne. Le déplacement est inclus au tarif de base ; seuls les frais de stationnement ou d'accès imposés par le lieu sont refacturés au réel.",
            },
            {
                question: "Jusqu'à quelle heure peut-on mettre de la musique en extérieur ?",
                answer:
                    "Passé 22 h, le tapage nocturne s'apprécie sans mesure de niveau sonore : la gêne suffit, et une plainte peut mettre fin à la soirée. En pratique, une bascule de volume est prévue à l'heure convenue, plutôt qu'une coupure sèche.",
            },
        ],
        related: ["dj-paris", "dj-seine-saint-denis", "dj-seine-et-marne"],
    },

    {
        slug: "dj-val-doise",
        level: "department",
        name: "Val-d'Oise",
        inLabel: "dans le Val-d'Oise",
        navLabel: "Val-d'Oise (95)",
        eyebrow: "Zone d'intervention · Île-de-France",
        parent: "dj-ile-de-france",
        metaTitle: "DJ dans le Val-d'Oise (95) – Mariage, réception, séminaire",
        metaDescription:
            "DJ professionnel dans le Val-d'Oise : mariages en corps de ferme du Vexin, réceptions à Cergy et Enghien, séminaires près de Roissy. Sonorisation et éclairage inclus. Devis gratuit.",
        keywords: [
            "DJ Val-d'Oise",
            "DJ 95",
            "DJ mariage Val-d'Oise",
            "DJ mariage Vexin",
            "DJ séminaire Roissy",
        ],
        h1: "DJ dans le Val-d'Oise",
        intro: [
            "Le Val-d'Oise se lit en trois bandes : la vallée de l'Oise et l'agglomération de Cergy, la plaine de France autour de Roissy et de Sarcelles, et le **Vexin** — un parc naturel régional où les mariages se tiennent en corps de ferme et en propriété.",
            "C'est la même diversité qu'en Seine-et-Marne, avec une particularité en plus : la proximité de l'aéroport, qui fait du nord du département une zone hôtelière et de séminaire à part entière.",
        ],
        coverage: {
            title: "Communes couvertes",
            intro: "De l'agglomération de Cergy au Vexin, j'interviens notamment à :",
            items: [
                "Cergy",
                "Pontoise",
                "Argenteuil",
                "Sarcelles",
                "Franconville",
                "Ermont",
                "Garges-lès-Gonesse",
                "Goussainville",
                "Bezons",
                "Villiers-le-Bel",
                "Herblay-sur-Seine",
                "Saint-Ouen-l'Aumône",
                "Taverny",
                "Gonesse",
                "Domont",
                "Montmorency",
                "Enghien-les-Bains",
                "L'Isle-Adam",
                "Auvers-sur-Oise",
                "Roissy-en-France",
            ],
        },
        sections: [
            {
                title: "Le Vexin et les réceptions rurales",
                body: [
                    "Le nord-ouest du département est un parc naturel régional : villages en pierre, corps de ferme rénovés, propriétés isolées. De beaux lieux, avec deux problèmes récurrents.",
                ],
                bullets: [
                    "**Réverbération** : une grange ou une longère en pierre renvoie le son au lieu de l'absorber. On répartit la diffusion à volume modéré plutôt que de pousser un système unique",
                    "**Électricité** : sur un bâtiment agricole reconverti, l'installation n'est pas toujours dimensionnée pour une soirée. Cela se vérifie avant, jamais le jour J",
                    "**Isolement** : peu de commerces et de services ouverts tard, donc une prestation prévue totalement autonome en matériel de secours",
                    "**Réceptions en extérieur** sur propriétés privées, presque toujours sans point électrique proche — la question du groupe électrogène se tranche avant le devis",
                ],
            },
            {
                title: "L'agglomération et la plaine de France",
                bullets: [
                    "**Salles de réception et espaces privés** de l'agglomération de Cergy-Pontoise, généralement bien équipés, avec horaire de fin au contrat de location",
                    "**Hôtels et centres de congrès du secteur de Roissy** : séminaires résidentiels, conventions et soirées de fin d'année, souvent en semaine, avec régie technique sur place",
                    "**Lieux patrimoniaux** autour de L'Isle-Adam, Auvers-sur-Oise et Enghien : cahier des charges strict sur les fixations et la protection des sols",
                    "**Salles municipales** des communes de la vallée de Montmorency : électricité correcte, horaire fixé par la mairie",
                    "**Réceptions à domicile** dans les communes pavillonnaires, où la contrainte redevient le voisinage plutôt que la technique",
                ],
            },
        ],
        faq: [
            {
                question: "Y a-t-il un forfait déplacement pour le Val-d'Oise ?",
                answer:
                    "Selon la commune, oui : le nord et l'ouest du département sont éloignés de ma base seine-et-marnaise. Le forfait est chiffré au devis, jamais ajouté après coup, et vous connaissez le montant total avant de vous engager.",
            },
            {
                question: "Ma réception est dans une ferme du Vexin, en pleine campagne. Que faut-il prévoir ?",
                answer:
                    "Deux points, tranchés avant le devis : la puissance électrique réellement disponible, et la solution de repli si une partie de la réception est en extérieur. Le reste — réverbération, placement des enceintes — se règle au moment de l'installation.",
            },
            {
                question: "Intervenez-vous pour des séminaires près de Roissy ?",
                answer:
                    "Oui, c'est un format courant sur le secteur : plénières sonorisées en journée avec micros pour les intervenants, puis soirée de clôture. Ces établissements ont presque toujours une régie, à laquelle il vaut mieux se raccorder que d'apporter une seconde installation.",
            },
        ],
        related: ["dj-yvelines", "dj-seine-saint-denis", "dj-ile-de-france"],
    },
];

/* -------------------------------------------------------------- villes 77 */

const CITIES: AreaPage[] = [
    {
        slug: "dj-melun",
        level: "city",
        name: "Melun",
        inLabel: "à Melun",
        navLabel: "Melun",
        eyebrow: "Zone d'intervention · Seine-et-Marne (77)",
        parent: "dj-seine-et-marne",
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
        coverage: {
            title: "Communes couvertes",
            intro:
                "Depuis Melun, j'interviens également dans les communes de la couronne, notamment :",
            items: [
                "Dammarie-lès-Lys",
                "Le Mée-sur-Seine",
                "Vaux-le-Pénil",
                "Savigny-le-Temple",
                "Combs-la-Ville",
                "Brie-Comte-Robert",
                "Maincy",
            ],
        },
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
        related: ["dj-fontainebleau", "dj-provins", "dj-seine-et-marne"],
    },

    {
        slug: "dj-meaux",
        level: "city",
        name: "Meaux",
        inLabel: "à Meaux",
        navLabel: "Meaux",
        eyebrow: "Zone d'intervention · Seine-et-Marne (77)",
        parent: "dj-seine-et-marne",
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
        coverage: {
            title: "Communes couvertes",
            intro:
                "Depuis Meaux, j'interviens également dans le nord du département, notamment :",
            items: [
                "Chelles",
                "Claye-Souilly",
                "Lagny-sur-Marne",
                "Coulommiers",
                "Nanteuil-lès-Meaux",
                "Trilport",
                "La Ferté-sous-Jouarre",
            ],
        },
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
        related: ["dj-chelles", "dj-marne-la-vallee", "dj-seine-et-marne"],
    },

    {
        slug: "dj-fontainebleau",
        level: "city",
        name: "Fontainebleau",
        inLabel: "à Fontainebleau",
        navLabel: "Fontainebleau",
        eyebrow: "Zone d'intervention · Seine-et-Marne (77)",
        parent: "dj-seine-et-marne",
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
        coverage: {
            title: "Communes couvertes",
            intro:
                "Depuis Fontainebleau, j'interviens également autour de la forêt, notamment :",
            items: [
                "Avon",
                "Barbizon",
                "Bois-le-Roi",
                "Samois-sur-Seine",
                "Moret-Loing-et-Orvanne",
                "Nemours",
                "Milly-la-Forêt",
            ],
        },
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
        related: ["dj-melun", "dj-provins", "dj-essonne"],
    },

    {
        slug: "dj-chelles",
        level: "city",
        name: "Chelles",
        inLabel: "à Chelles",
        navLabel: "Chelles",
        eyebrow: "Zone d'intervention · Seine-et-Marne (77)",
        parent: "dj-seine-et-marne",
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
        coverage: {
            title: "Communes couvertes",
            intro:
                "Depuis Chelles, j'interviens également dans les communes voisines, notamment :",
            items: [
                "Vaires-sur-Marne",
                "Brou-sur-Chantereine",
                "Courtry",
                "Champs-sur-Marne",
                "Noisiel",
                "Torcy",
                "Le Pin",
            ],
        },
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
        related: ["dj-marne-la-vallee", "dj-meaux", "dj-seine-saint-denis"],
    },

    {
        slug: "dj-marne-la-vallee",
        level: "city",
        name: "Marne-la-Vallée",
        inLabel: "à Marne-la-Vallée",
        navLabel: "Marne-la-Vallée",
        eyebrow: "Zone d'intervention · Seine-et-Marne (77)",
        parent: "dj-seine-et-marne",
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
        coverage: {
            title: "Communes couvertes",
            intro:
                "Sur l'ensemble du secteur de Marne-la-Vallée, j'interviens notamment à :",
            items: [
                "Serris",
                "Chessy",
                "Bailly-Romainvilliers",
                "Bussy-Saint-Georges",
                "Torcy",
                "Noisiel",
                "Lagny-sur-Marne",
            ],
        },
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
        related: ["dj-chelles", "dj-meaux", "dj-seine-et-marne"],
    },

    {
        slug: "dj-provins",
        level: "city",
        name: "Provins",
        inLabel: "à Provins",
        navLabel: "Provins",
        eyebrow: "Zone d'intervention · Seine-et-Marne (77)",
        parent: "dj-seine-et-marne",
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
        coverage: {
            title: "Communes couvertes",
            intro:
                "Depuis Provins, j'interviens également dans l'est du département, notamment :",
            items: [
                "Nangis",
                "Donnemarie-Dontilly",
                "Bray-sur-Seine",
                "Villiers-Saint-Georges",
                "Longueville",
                "Sourdun",
                "Chalautre-la-Petite",
            ],
        },
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
        related: ["dj-melun", "dj-fontainebleau", "dj-seine-et-marne"],
    },
];

export const AREA_PAGES: AreaPage[] = [...REGION, ...DEPARTMENTS, ...CITIES];

export function findAreaPage(slug: string): AreaPage | undefined {
    return AREA_PAGES.find((page) => page.slug === slug);
}

export const AREA_SLUGS = AREA_PAGES.map((page) => page.slug);

/** Page régionale : racine du fil d'Ariane et cible des liens remontants. */
export const REGION_PAGE = REGION[0];

/** Départements, dans l'ordre d'affichage du pied de page et de la page régionale. */
export const DEPARTMENT_PAGES = DEPARTMENTS;

/**
 * Ancêtres d'une page, du plus général au plus proche. Alimente le fil
 * d'Ariane HTML et son équivalent `BreadcrumbList` : sans hiérarchie déclarée,
 * Google traite les huit pages départementales comme huit pages de même niveau
 * sans lien entre elles, et la page régionale ne reçoit rien.
 */
export function areaAncestors(page: AreaPage): AreaPage[] {
    const trail: AreaPage[] = [];

    for (let current = page.parent; current; ) {
        const parent = findAreaPage(current);
        if (!parent) break;

        trail.unshift(parent);
        current = parent.parent;
    }

    return trail;
}

/** Pages de niveau inférieur, résolues et dans l'ordre déclaré. */
export function areaChildren(page: AreaPage): AreaPage[] {
    return (page.children ?? [])
        .map((slug) => findAreaPage(slug))
        .filter((child): child is AreaPage => Boolean(child));
}
