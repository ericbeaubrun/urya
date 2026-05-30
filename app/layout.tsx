import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import styles from './global.module.css';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "DJ URYA – DJ Mariage & Soirées Privées en Seine-et-Marne (77)",
    description: "DJ Professionnel pour Anniversaires et Entreprises – Île-de-France ",
};


export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="fr">
        <head>
            <link
                href="https://fonts.googleapis.com/css2?family=Oswald&family=Roboto:wght@400;700&family=Bebas+Neue&display=swap"
                rel="stylesheet"
            />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>

        {children}
        </body>
        </html>
    );
}
