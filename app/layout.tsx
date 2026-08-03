import type {Metadata, Viewport} from "next";
import './globals.css';
import {SITE_URL} from './site-url';
import PageViewTracker from './components/PageViewTracker';
import {
    BRAND,
    DEFAULT_DESCRIPTION,
    DEFAULT_TITLE,
    KEYWORDS,
    LOCALE,
    OG_IMAGE,
} from '@/lib/seo';

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: DEFAULT_TITLE,
        // Les pages internes n'ont plus à répéter la marque dans leur titre.
        template: `%s | ${BRAND}`,
    },
    description: DEFAULT_DESCRIPTION,
    keywords: KEYWORDS,
    applicationName: BRAND,
    authors: [{name: BRAND, url: SITE_URL}],
    creator: BRAND,
    publisher: BRAND,
    category: "Événementiel",

    // Sans canonical par défaut, les URL suffixées de paramètres de campagne
    // (utm_*, gclid) sont indexées comme autant de pages distinctes.
    alternates: {
        canonical: "/",
    },

    icons: {
        icon: "/logo.png",
        apple: "/logo.png",
    },

    openGraph: {
        type: "website",
        locale: LOCALE,
        url: "/",
        siteName: BRAND,
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        images: [OG_IMAGE],
    },

    twitter: {
        card: "summary_large_image",
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        images: [OG_IMAGE.url],
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            // Sans ces trois directives, Google plafonne par défaut la taille
            // des extraits et des vignettes affichés dans les résultats.
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
        },
    },

    // Les numéros de téléphone du site sont des libellés, pas des liens : la
    // détection automatique d'iOS les réécrit et casse le rendu.
    formatDetection: {
        telephone: false,
    },

    // Renseigner GOOGLE_SITE_VERIFICATION active la validation Search Console
    // sans redéploiement de code.
    verification: process.env.GOOGLE_SITE_VERIFICATION
        ? {google: process.env.GOOGLE_SITE_VERIFICATION}
        : undefined,
};

export const viewport: Viewport = {
    themeColor: "#000000",
    colorScheme: "dark",
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="fr">
        <body>
        <PageViewTracker/>
        {children}
        </body>
        </html>
    );
}
