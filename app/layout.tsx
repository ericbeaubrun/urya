import type {Metadata} from "next";
import './globals.css';

export const metadata: Metadata = {
    title: "DJ URYA – DJ Mariage & Soirées Privées en Seine-et-Marne (77)",
    description: "DJ Professionnel pour Anniversaires et Entreprises – Île-de-France ",
};


export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="fr">
        <body>
        {children}
        </body>
        </html>
    );
}
