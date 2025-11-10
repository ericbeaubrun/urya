"use client";

import Image from "next/image";
import styles from "./Prestations.module.css";

interface Prestation {
    title: string;
    description: string;
    price: string;
    highlight: string;
    featured?: boolean;
    image: string;
}

const images_path = "/";

const prestations: Prestation[] = [
    {
        title: "Anniversaires",
        description: "Animation complète, ambiance personnalisée selon le thème et le public.",
        price: "À partir de 280 €",
        highlight: "Un excellent rapport qualité/prix pour une fête réussie.",
        image: images_path + "anniversaire.jpg",
    },
    {
        title: "Soirées privées",
        description: "Ambiance festive garantie pour vos événements familiaux ou entre amis.",
        price: "À partir de 320 €",
        highlight: "Une expérience musicale unique et sur mesure.",
        image: images_path + "soiree_privee.jpg",
    },

    {
        title: "Événements d'entreprise",
        description: "Animation musicale professionnelle pour vos séminaires, repas ou soirées de fin d'année.",
        price: "À partir de 450 €",
        highlight: "Une prestation professionnelle à un tarif compétitif.",
        image: images_path + "evenement.jpg",
    },
    {
        title: "Mariages",
        description: "Prestation sur mesure : cocktail, dîner, ouverture de bal, soirée dansante. Matériel pro & coordination.",
        price: "À partir de 520 €",
        highlight: "Un rapport qualité/prix optimal pour un jour inoubliable.",
        featured: true,
        image: images_path + "mariage.jpg",
    },
];

export default function Prestations() {
    return (
        <section className={styles.wrapper}>
            <h2 className={styles.sectionTitle}>Prestations</h2>

            <div className={styles.grid}>
                {prestations.map((p) => (
                    <div key={p.title} className={`${styles.card} ${p.featured ? styles.featured : ""}`}>
                        <div className={styles.imageWrapper}>
                            <Image src={p.image} alt={p.title} fill sizes="100%" className={styles.image}/>
                        </div>

                        <div className={styles.content}>
                            <h3 className={styles.title}>{p.title}</h3>
                            <p className={styles.description}>{p.description}</p>

                            <p className={styles.price}>{p.price}</p>
                            <p className={styles.highlight}>{p.highlight}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
