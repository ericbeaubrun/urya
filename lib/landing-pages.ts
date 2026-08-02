import type {PrestationType} from "@/lib/prestation-types";

/**
 * Pages d'atterrissage par type de prestation.
 *
 * Objectif : sortir du site mono-page. Une landing par intention de recherche
 * (« dj mariage », « dj séminaire entreprise »…) donne à chaque requête une
 * page dédiée, avec son H1, ses métadonnées et son balisage.
 *
 * Le contenu est rédigé ici, en dur, et non généré depuis un gabarit commun.
 * C'est délibéré : huit pages qui ne diffèrent que par un mot injecté sont des
 * « doorway pages » au sens de Google, désindexées en bloc. Chaque page doit
 * répondre à une question que les autres ne traitent pas — d'où des sections,
 * un déroulé et une FAQ propres à chaque prestation.
 *
 * Volontairement cinq pages et non une par valeur de `PRESTATION_TYPES` :
 * « séminaire » et « évènement corporate » relèvent de la même intention
 * d'achat, tout comme « club », « festival » et « concert ». Les séparer
 * produirait des pages concurrentes entre elles sur les mêmes requêtes.
 */

export interface LandingSection {
    title: string;
    /** Paragraphes. `**gras**` y est interprété, comme dans `About`. */
    body?: string[];
    /** Liste à puces affichée sous les paragraphes. */
    bullets?: string[];
}

export interface LandingFaq {
    question: string;
    answer: string;
}

export interface LandingPage {
    slug: string;
    /** Libellé court, pour la navigation et le fil d'Ariane. */
    navLabel: string;
    /** Type préselectionné dans le formulaire de devis depuis cette page. */
    prestationType: PrestationType;
    /** Balise `<title>` — la marque est ajoutée par le template du layout. */
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    /** Accroche au-dessus du H1. */
    eyebrow: string;
    h1: string;
    intro: string[];
    sections: LandingSection[];
    faq: LandingFaq[];
    /** Slugs des pages proposées en fin de page (maillage interne). */
    related: string[];
}

export const LANDING_PAGES: LandingPage[] = [
    {
        slug: "dj-mariage",
        navLabel: "DJ Mariage",
        prestationType: "mariage",
        metaTitle: "DJ Mariage – Animation & sonorisation de votre soirée",
        metaDescription:
            "DJ professionnel pour votre mariage, partout en France. Cérémonie, cocktail, dîner et soirée dansante : sonorisation, éclairage et playlist construite avec vous. Devis gratuit.",
        keywords: [
            "DJ mariage",
            "DJ mariage professionnel",
            "animation mariage",
            "sonorisation mariage",
            "DJ soirée dansante mariage",
            "playlist mariage",
        ],
        eyebrow: "Prestation mariage",
        h1: "DJ mariage : une soirée qui vous ressemble",
        intro: [
            "Un mariage n'est pas une soirée comme les autres : il y a vos deux familles, vos amis, des générations et des goûts musicaux qui n'ont rien à voir, et une seule chance de bien faire. Mon travail est de tenir cette salle du premier verre au dernier morceau.",
            "J'interviens **partout en France**, sur des formats allant du mariage intime de 40 convives à la réception de 300 personnes.",
        ],
        sections: [
            {
                title: "Ce que couvre la prestation",
                body: [
                    "Une journée de mariage se découpe en moments qui n'ont ni le même volume, ni la même énergie. Chacun est préparé séparément.",
                ],
                bullets: [
                    "**Cérémonie laïque** : sonorisation discrète, micros pour les intervenants, entrées et sorties musicales calées",
                    "**Vin d'honneur et cocktail** : ambiance sonore en fond, à un niveau qui laisse parler vos invités",
                    "**Dîner** : playlist continue, animation des temps forts (entrée des mariés, discours, pièce montée)",
                    "**Ouverture de bal** : votre morceau, travaillé en amont, avec le mix d'entrée et de sortie",
                    "**Soirée dansante** : jusqu'à la fin, avec une lecture de piste en temps réel",
                ],
            },
            {
                title: "La préparation, avant le jour J",
                body: [
                    "L'essentiel du résultat se joue avant la soirée. Le déroulé est calé à deux rendez-vous.",
                ],
                bullets: [
                    "Un premier échange pour comprendre le lieu, le nombre d'invités et l'ambiance recherchée",
                    "Une playlist collaborative : vos incontournables, et surtout **votre liste noire** — les morceaux à ne jamais passer",
                    "Un point technique avec le lieu de réception : puissance disponible, contraintes de bruit, horaires de fin",
                    "Un déroulé horaire écrit, partagé avec vous et votre wedding planner s'il y en a un",
                ],
            },
            {
                title: "Matériel fourni",
                bullets: [
                    "Sonorisation dimensionnée pour la salle, avec système séparé pour la cérémonie si elle est en extérieur",
                    "Éclairage de piste et mise en lumière de la salle",
                    "Micros HF pour les discours et la cérémonie",
                    "Matériel de secours sur place — une panne un soir de mariage n'est pas rattrapable",
                ],
            },
        ],
        faq: [
            {
                question: "À quelle distance intervenez-vous ?",
                answer:
                    "Partout en France. Au-delà d'un certain rayon, un forfait déplacement et, selon l'horaire de fin, un hébergement sont ajoutés au devis — toujours chiffrés à l'avance, jamais en supplément découvert après coup.",
            },
            {
                question: "Combien de temps à l'avance faut-il réserver ?",
                answer:
                    "Les samedis de juin à septembre partent souvent 12 à 18 mois à l'avance. Pour les autres dates, quelques mois suffisent généralement. Le plus simple est de vérifier la disponibilité de votre date avant tout autre échange.",
            },
            {
                question: "Peut-on imposer une liste de morceaux ?",
                answer:
                    "Vos incontournables sont joués, c'est votre soirée. En revanche je garde la main sur l'ordre et le moment : un morceau très attendu passé trop tôt vide la piste au lieu de la remplir.",
            },
            {
                question: "Que se passe-t-il si la salle impose un limiteur de bruit ?",
                answer:
                    "C'est fréquent et ça se gère, à condition de le savoir avant. Le point technique avec le lieu sert précisément à adapter le système au seuil imposé, plutôt qu'à subir des coupures pendant la soirée.",
            },
        ],
        related: ["dj-anniversaire", "dj-soiree-privee", "dj-entreprise"],
    },

    {
        slug: "dj-anniversaire",
        navLabel: "DJ Anniversaire",
        prestationType: "anniversaire",
        metaTitle: "DJ Anniversaire – 18, 30, 40, 50 ans et plus",
        metaDescription:
            "DJ professionnel pour votre anniversaire, partout en France. Sonorisation, éclairage et playlist adaptée à l'âge et à l'ambiance voulue. Formats salle, maison ou extérieur. Devis gratuit.",
        keywords: [
            "DJ anniversaire",
            "DJ anniversaire 18 ans",
            "DJ anniversaire 40 ans",
            "DJ anniversaire 50 ans",
            "animation anniversaire",
            "sonorisation anniversaire",
        ],
        eyebrow: "Prestation anniversaire",
        h1: "DJ anniversaire : l'ambiance selon l'âge et le public",
        intro: [
            "Un 18 ans, un 40 ans et un 60 ans ne se préparent pas de la même façon. Ce n'est pas qu'une question de playlist : le volume, l'horaire de démarrage, la place de la piste dans la salle et le moment où l'on bascule vraiment en soirée changent complètement.",
            "J'interviens **partout en France**, en salle louée, à domicile ou en extérieur.",
        ],
        sections: [
            {
                title: "Les formats les plus demandés",
                bullets: [
                    "**18 et 20 ans** : démarrage tôt en énergie, sono orientée piste, set actuel avec un fil conducteur clair",
                    "**30 et 40 ans** : une première partie qui laisse parler les invités, puis une bascule franche vers la piste en seconde moitié de soirée",
                    "**50, 60 ans et plus** : un répertoire large sur plusieurs décennies, volume maîtrisé pour que les conversations restent possibles toute la soirée",
                    "**Anniversaire surprise** : arrivée et installation calées avec l'organisateur pour ne rien éventer",
                ],
            },
            {
                title: "À domicile ou en extérieur",
                body: [
                    "Une grande partie des anniversaires ne se tiennent pas dans une salle équipée. C'est faisable, mais deux points se vérifient avant de s'engager sur un devis.",
                ],
                bullets: [
                    "**L'alimentation électrique** : une installation domestique ne supporte pas n'importe quelle puissance sur une seule ligne",
                    "**Le voisinage et l'horaire** : en extérieur ou en zone résidentielle, le système est dimensionné pour rester dans les clous jusqu'à l'heure de fin prévue",
                    "L'accès et le temps d'installation, qui conditionnent l'heure d'arrivée sur place",
                ],
            },
            {
                title: "Matériel fourni",
                bullets: [
                    "Sonorisation adaptée au nombre d'invités et au volume de la pièce",
                    "Éclairage de piste",
                    "Micro pour les prises de parole et le moment du gâteau",
                    "Installation et démontage inclus dans le créneau convenu",
                ],
            },
        ],
        faq: [
            {
                question: "Jusqu'à quelle heure pouvez-vous jouer ?",
                answer:
                    "L'heure de fin est fixée au devis et tenue. Elle dépend surtout du lieu : une salle louée impose souvent son propre horaire, et à domicile c'est la réglementation locale sur le bruit nocturne qui fait référence.",
            },
            {
                question: "Faut-il prévoir quelque chose de mon côté ?",
                answer:
                    "Un accès au lieu environ deux heures avant le début, une prise électrique dédiée près de l'emplacement du matériel, et une surface dégagée d'environ 2 mètres sur 2. Le reste est fourni.",
            },
            {
                question: "Peut-on brancher un micro pour un discours ?",
                answer:
                    "Oui, un micro est inclus dans toutes les prestations. Prévenez-moi simplement du moment prévu pour que la musique soit baissée au bon instant plutôt que coupée en pleine montée.",
            },
        ],
        related: ["dj-soiree-privee", "dj-mariage", "dj-entreprise"],
    },

    {
        slug: "dj-soiree-privee",
        navLabel: "DJ Soirée privée",
        prestationType: "soiree_privee",
        metaTitle: "DJ Soirée privée – Réception, crémaillère, fête de famille",
        metaDescription:
            "DJ professionnel pour vos soirées privées partout en France : réception, crémaillère, fête de famille, pool party. Sonorisation et éclairage inclus. Devis gratuit sous 24 h.",
        keywords: [
            "DJ soirée privée",
            "DJ réception privée",
            "DJ crémaillère",
            "DJ fête de famille",
            "animation soirée privée",
        ],
        eyebrow: "Prestation privée",
        h1: "DJ pour soirée privée",
        intro: [
            "Toutes les soirées ne rentrent pas dans une case. Une crémaillère, une réception de départ, un baptême, une fête de famille ou une soirée à thème n'ont ni le même public ni le même rythme — et rarement une salle équipée.",
            "Ces formats sont ceux où la préparation compte le plus, parce que rien n'est standard. J'interviens **partout en France**.",
        ],
        sections: [
            {
                title: "Types de soirées couverts",
                bullets: [
                    "**Crémaillère et pendaison de crémaillère** : format maison, montée progressive, gestion du voisinage",
                    "**Fête de famille** : plusieurs générations dans la même pièce, répertoire large et volume tenu",
                    "**Baptême et communion** : ambiance de journée puis bascule en soirée",
                    "**Réception de départ ou de retraite** : temps de parole, projection éventuelle, puis soirée",
                    "**Soirée à thème** : set construit autour du thème plutôt que plaqué dessus",
                    "**Pool party et soirée extérieure** : système résistant, dimensionné pour l'extérieur",
                ],
            },
            {
                title: "Comment se cale une soirée sur mesure",
                body: [
                    "Sans cahier des charges type, tout part d'un échange. Trois questions décident du reste du devis.",
                ],
                bullets: [
                    "**Combien d'invités, et dans quel volume ?** C'est ce qui dimensionne la sono, bien plus que la durée",
                    "**Y a-t-il un temps fort à animer ?** Discours, surprise, projection, arrivée d'un invité",
                    "**Quelle heure de fin ?** Elle détermine la structure du set, pas seulement sa longueur",
                ],
            },
            {
                title: "Matériel fourni",
                bullets: [
                    "Sonorisation intérieure ou extérieure selon le lieu",
                    "Éclairage d'ambiance et de piste",
                    "Micro pour les prises de parole",
                    "Possibilité de sonoriser deux espaces distincts (par exemple terrasse et salon)",
                ],
            },
        ],
        faq: [
            {
                question: "Intervenez-vous pour de petits effectifs ?",
                answer:
                    "Oui. En dessous d'une trentaine d'invités, le matériel est simplement plus léger — une sono surdimensionnée dans un petit volume dégrade le rendu au lieu de l'améliorer, et fait monter le devis pour rien.",
            },
            {
                question: "Est-ce possible en extérieur sans salle de repli ?",
                answer:
                    "C'est possible, mais je demande qu'un repli soit prévu, même sommaire. Le matériel électronique ne supporte pas la pluie, et une averse sans solution de repli met fin à la soirée.",
            },
            {
                question: "Peut-on vous confier aussi la sonorisation d'un discours ou d'une projection ?",
                answer:
                    "Oui, la sonorisation de prise de parole et le branchement d'une source vidéo sont inclus. Signalez-le en amont : cela change le placement du matériel dans la pièce.",
            },
        ],
        related: ["dj-anniversaire", "dj-mariage", "dj-entreprise"],
    },

    {
        slug: "dj-entreprise",
        navLabel: "DJ Entreprise",
        prestationType: "evenement_corporate",
        metaTitle: "DJ Événement d'entreprise – Séminaire, soirée, inauguration",
        metaDescription:
            "DJ professionnel pour vos événements d'entreprise partout en France : soirée de fin d'année, séminaire, team building, inauguration, lancement produit. Devis et facturation entreprise.",
        keywords: [
            "DJ entreprise",
            "DJ événement entreprise",
            "DJ séminaire",
            "DJ soirée entreprise",
            "DJ soirée de fin d'année",
            "DJ inauguration",
            "DJ team building",
            "animation événement professionnel",
        ],
        eyebrow: "Prestation professionnelle",
        h1: "DJ pour événement d'entreprise",
        intro: [
            "Un événement d'entreprise a une contrainte que les soirées privées n'ont pas : il doit tenir un horaire, s'articuler avec des prises de parole, et fonctionner devant un public qui n'a pas choisi d'être là. Le rôle du DJ y est autant technique qu'artistique.",
            "J'interviens **partout en France**, avec devis, convention et **facturation au format entreprise**.",
        ],
        sections: [
            {
                title: "Formats couverts",
                bullets: [
                    "**Soirée de fin d'année** : cocktail, dîner, remise de prix puis soirée dansante",
                    "**Séminaire** : sonorisation des plénières, transitions entre ateliers, soirée de clôture",
                    "**Team building** : ambiance sonore sur les activités et animation des temps collectifs",
                    "**Inauguration et lancement produit** : fond sonore maîtrisé, montée sur le moment clé",
                    "**Afterwork et soirée client** : ambiance qui laisse les échanges possibles toute la soirée",
                ],
            },
            {
                title: "La partie technique, qui fait la différence",
                body: [
                    "Sur un événement professionnel, l'essentiel des incidents ne vient pas de la musique mais de la sonorisation de parole. C'est traité en amont.",
                ],
                bullets: [
                    "**Micros HF pour les intervenants**, avec un jeu de secours — un micro qui lâche pendant un discours de direction est le seul incident que personne n'oublie",
                    "**Branchement sur la régie du lieu** ou système autonome selon la configuration",
                    "**Diffusion d'une bande-son de vidéo institutionnelle** avec calage sur la projection",
                    "**Conducteur minuté** partagé avec l'agence ou le service événementiel",
                ],
            },
            {
                title: "Cadre administratif",
                bullets: [
                    "Devis détaillé et facture au nom de la société, TVA apparente",
                    "Attestation d'assurance responsabilité civile professionnelle fournie sur demande",
                    "Convention de prestation signée avant l'événement",
                    "Repérage sur site possible pour les configurations complexes",
                ],
            },
        ],
        faq: [
            {
                question: "Pouvez-vous facturer au nom de la société ?",
                answer:
                    "Oui. Devis, convention de prestation et facture sont établis au nom de la société, avec les mentions attendues par un service comptable. Les délais et modalités de règlement sont fixés au devis.",
            },
            {
                question: "Fournissez-vous une attestation d'assurance ?",
                answer:
                    "Oui, une attestation de responsabilité civile professionnelle est fournie sur demande. La plupart des lieux et des services sécurité l'exigent avant d'autoriser l'installation.",
            },
            {
                question: "Travaillez-vous avec le prestataire technique du lieu ?",
                answer:
                    "Régulièrement. Quand le lieu dispose déjà d'une régie, je m'y raccorde plutôt que de doubler l'installation — c'est plus fiable et cela réduit le temps de montage. Un contact technique en amont suffit.",
            },
            {
                question: "Gérez-vous les prises de parole et les remises de prix ?",
                answer:
                    "Oui, c'est une part centrale de la prestation. Micros, ordre de passage, musiques d'entrée et de sortie et calage sur le conducteur sont préparés avant l'événement.",
            },
        ],
        related: ["dj-club-festival", "dj-soiree-privee", "dj-mariage"],
    },

    {
        slug: "dj-club-festival",
        navLabel: "DJ Club & Festival",
        prestationType: "club",
        metaTitle: "DJ Club & Festival – Booking pour salles et événements",
        metaDescription:
            "Booking DJ pour clubs, festivals et concerts partout en France. Sets adaptés au créneau et à la programmation, autonomie technique complète. Contact et disponibilités.",
        keywords: [
            "booking DJ",
            "DJ club",
            "DJ festival",
            "DJ concert",
            "programmation DJ",
            "réserver un DJ club",
        ],
        eyebrow: "Booking",
        h1: "Booking DJ : clubs, festivals et concerts",
        intro: [
            "Cette page s'adresse aux programmateurs, gérants de salle et organisateurs, pas aux particuliers. Le cadre y est différent : c'est la programmation qui donne le contexte, et le set se construit à partir du créneau confié.",
            "Disponible **partout en France**, en résidence comme en date isolée.",
        ],
        sections: [
            {
                title: "Contextes",
                bullets: [
                    "**Club** : sets de 1 à 4 heures, warm-up, peak time ou closing selon le créneau",
                    "**Festival** : formats scène, avec adaptation au créneau horaire et au public déjà en place",
                    "**Concert et première partie** : set d'ouverture calé sur l'artiste principal",
                    "**Soirée à programmation** : coordination avec les autres artistes de la line-up",
                ],
            },
            {
                title: "Ce qui est attendu et ce qui est fourni",
                body: [
                    "Sur ces formats, la technique est généralement côté lieu. Le point à caler en amont est donc la compatibilité, pas le matériel.",
                ],
                bullets: [
                    "**Rider technique** transmis à la confirmation de la date",
                    "Autonomie sur le matériel de contrôle ; le lieu fournit la diffusion et le monitoring",
                    "Compatibilité avec les configurations standard de club",
                    "Balances effectuées avant ouverture quand le planning du lieu le permet",
                ],
            },
            {
                title: "Réservation",
                body: [
                    "Pour une demande de booking, indiquez la **date**, le **lieu**, le **créneau horaire** et la **line-up prévue** : ce sont les quatre éléments qui déterminent si la date est jouable et sous quel format. La réponse intervient sous 24 heures.",
                ],
            },
        ],
        faq: [
            {
                question: "Quelle est la durée de set habituelle ?",
                answer:
                    "De 1 à 4 heures selon le créneau. Un warm-up et un peak time ne se construisent pas de la même façon : préciser la position dans la soirée est plus utile que la seule durée.",
            },
            {
                question: "Fournissez-vous un rider technique ?",
                answer:
                    "Oui, il est transmis dès la date confirmée. Il reste volontairement standard, pour rester compatible avec l'équipement courant des clubs sans imposer de location supplémentaire au lieu.",
            },
            {
                question: "Acceptez-vous les dates en semaine et les résidences ?",
                answer:
                    "Oui, dans les deux cas. Les résidences se calent en amont sur plusieurs mois, ce qui permet de bloquer les dates avant qu'elles ne partent sur des prestations privées.",
            },
        ],
        related: ["dj-entreprise", "dj-soiree-privee"],
    },
];

/** Accès direct par slug, pour la résolution de route. */
export function findLandingPage(slug: string): LandingPage | undefined {
    return LANDING_PAGES.find((page) => page.slug === slug);
}

export const LANDING_SLUGS = LANDING_PAGES.map((page) => page.slug);
