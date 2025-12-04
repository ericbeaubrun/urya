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
        <html lang="en">
        <head>
            <link
                href="https://fonts.googleapis.com/css2?family=Oswald&family=Roboto:wght@400;700&family=Bebas+Neue&display=swap"
                rel="stylesheet"
            />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className={styles.lights}>
            <div className={`${styles.light} ${styles.light1}`}></div>
            <div className={`${styles.light} ${styles.light2}`}></div>
            <div className={`${styles.light} ${styles.light3}`}></div>
            <div className={`${styles.light} ${styles.light4}`}></div>
            <div className={`${styles.light} ${styles.light5}`}></div>
        </div>

        {children}
        </body>
        </html>
    );
}
