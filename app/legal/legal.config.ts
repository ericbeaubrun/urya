// Valeurs par défaut des informations légales.
//
// Les champs d'identité sont volontairement vides : ils se renseignent depuis
// l'espace d'administration (onglet « Légal »), et tant qu'ils le sont, le site
// affiche un masque `*********` à leur place plutôt qu'un texte incomplet.

export type LegalContent = {
    siteName: string;
    siteUrl: string;
    editor: {
        name: string;
        legalForm: string;
        capital: string;
        address: string;
        siret: string;
        rcs: string;
        vatNumber: string;
        email: string;
        phone: string;
    };
    publicationDirector: string;
    host: {
        name: string;
        address: string;
        website: string;
    };
    processors: {
        name: string;
        purpose: string;
        location: string;
        privacyUrl: string;
    }[];
    dataRetention: string;
    lastUpdate: string;
};

/** Champs qui, laissés vides, doivent être masqués sur le site public. */
export const LEGAL_DEFAULTS: LegalContent = {
    siteName: 'DJ URYA',
    siteUrl: '',

    editor: {
        name: '',
        legalForm: '',
        capital: '',
        address: '',
        siret: '',
        rcs: '',
        vatNumber: '',
        email: '',
        phone: '',
    },

    publicationDirector: '',

    host: {
        name: 'Vercel Inc.',
        address: '440 N Barranca Ave #4133, Covina, CA 91723, États-Unis',
        website: 'https://vercel.com',
    },

    // Sous-traitants techniques : déduits du code, pas éditables depuis l'admin.
    processors: [
        {
            name: 'Vercel Inc.',
            purpose: 'Hébergement du site et journaux techniques',
            location: 'États-Unis / Union européenne',
            privacyUrl: 'https://vercel.com/legal/privacy-policy',
        },
        {
            name: 'Supabase Inc.',
            purpose: 'Base de données (contenus du site et prestations)',
            location: 'Union européenne',
            privacyUrl: 'https://supabase.com/privacy',
        },
        {
            name: 'Resend',
            purpose: 'Acheminement des emails de contact et de confirmation',
            location: 'Union européenne / États-Unis',
            privacyUrl: 'https://resend.com/legal/privacy-policy',
        },
    ],

    dataRetention: '3 ans à compter du dernier contact',
    lastUpdate: '',
};

/**
 * Fusionne le contenu éditable (`content.legal`) avec les valeurs par défaut.
 * Une chaîne vide côté admin l'emporte : c'est le signal « pas encore rempli ».
 */
export function resolveLegal(raw: unknown): LegalContent {
    // Le contenu vient d'une colonne JSON : on ne suppose rien de sa forme et
    // chaque niveau est vérifié avant d'être lu.
    const asRecord = (value: unknown): Record<string, unknown> =>
        value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

    const legal = asRecord(raw);
    const editor = asRecord(legal.editor);
    const host = asRecord(legal.host);

    const pick = (value: unknown, fallback: string) =>
        typeof value === 'string' ? value.trim() : fallback;

    return {
        siteName: pick(legal.siteName, LEGAL_DEFAULTS.siteName) || LEGAL_DEFAULTS.siteName,
        siteUrl: pick(legal.siteUrl, LEGAL_DEFAULTS.siteUrl),
        editor: {
            name: pick(editor.name, LEGAL_DEFAULTS.editor.name),
            legalForm: pick(editor.legalForm, LEGAL_DEFAULTS.editor.legalForm),
            capital: pick(editor.capital, LEGAL_DEFAULTS.editor.capital),
            address: pick(editor.address, LEGAL_DEFAULTS.editor.address),
            siret: pick(editor.siret, LEGAL_DEFAULTS.editor.siret),
            rcs: pick(editor.rcs, LEGAL_DEFAULTS.editor.rcs),
            vatNumber: pick(editor.vatNumber, LEGAL_DEFAULTS.editor.vatNumber),
            email: pick(editor.email, LEGAL_DEFAULTS.editor.email),
            phone: pick(editor.phone, LEGAL_DEFAULTS.editor.phone),
        },
        publicationDirector: pick(legal.publicationDirector, LEGAL_DEFAULTS.publicationDirector),
        host: {
            name: pick(host.name, LEGAL_DEFAULTS.host.name) || LEGAL_DEFAULTS.host.name,
            address: pick(host.address, LEGAL_DEFAULTS.host.address) || LEGAL_DEFAULTS.host.address,
            website: pick(host.website, LEGAL_DEFAULTS.host.website) || LEGAL_DEFAULTS.host.website,
        },
        processors: LEGAL_DEFAULTS.processors,
        dataRetention: pick(legal.dataRetention, LEGAL_DEFAULTS.dataRetention) || LEGAL_DEFAULTS.dataRetention,
        lastUpdate: pick(legal.lastUpdate, LEGAL_DEFAULTS.lastUpdate),
    };
}

/** Charge les informations légales sans jamais faire échouer la page. */
export async function getLegalContent(): Promise<LegalContent> {
    try {
        const { getSiteContent } = await import('@/lib/content');
        const content = await getSiteContent();
        return resolveLegal(content?.legal);
    } catch (err) {
        console.error('[legal] Contenu indisponible, valeurs par défaut utilisées:', err);
        return resolveLegal(null);
    }
}
