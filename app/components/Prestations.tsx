"use client";

import styles from './Prestations.module.css';

export default function Prestations() {
    const prestations = [
        {
            icon: "🎂",
            title: "Anniversaires",
            description: "Animation complète, ambiance personnalisée selon le thème et le public.",
            price: "À partir de 280 €",
            highlight: "Un excellent rapport qualité/prix pour une fête réussie."
        },
        {
            icon: "💍",
            title: "Mariages",
            description: "Prestation sur mesure : cocktail, dîner, ouverture de bal, soirée dansante. Matériel professionnel, coordination, installation et désinstallation incluses.",
            price: "À partir de 520 €",
            highlight: "Un rapport qualité/prix optimal pour un jour inoubliable.",
            featured: true
        },
        {
            icon: "🎉",
            title: "Soirées privées",
            description: "Ambiance festive garantie pour vos événements familiaux ou entre amis.",
            price: "À partir de 320 €",
            highlight: "Une expérience musicale unique et sur mesure."
        },
        {
            icon: "🏢",
            title: "Événements d'entreprise",
            description: "Animation musicale professionnelle pour vos séminaires, repas ou soirées de fin d'année.",
            price: "À partir de 450 €",
            highlight: "Une prestation professionnelle à un tarif compétitif."
        }
    ];

    const options = [
        "Jeux de lumières, fumée, lasers et effets spéciaux",
        "Vidéo projection",
        "Animation micro et drops personnalisés"
    ];

    return (
        <section className={styles.prestations}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        💡 Prestations proposées
                    </h2>
                    <p className={styles.subtitle}>
                        Des solutions adaptées à tous vos événements
                    </p>
                </div>

                <div className={styles.prestationsGrid}>
                    {prestations.map((prestation, index) => (
                        <div 
                            key={index} 
                            className={`${styles.prestationCard} ${prestation.featured ? styles.featured : ''}`}
                        >
                            {prestation.featured && (
                                <div className={styles.featuredBadge}>
                                    ⭐ Populaire
                                </div>
                            )}

                            <div className={styles.cardHeader}>
                                <span className={styles.cardIcon}>{prestation.icon}</span>
                                <h3 className={styles.cardTitle}>{prestation.title}</h3>
                            </div>

                            <p className={styles.cardDescription}>
                                {prestation.description}
                            </p>

                            <div className={styles.cardPrice}>
                                <span className={styles.priceIcon}>💰</span>
                                <span className={styles.priceText}>{prestation.price}</span>
                            </div>

                            <div className={styles.cardHighlight}>
                                <span className={styles.highlightIcon}>
                                    {prestation.featured ? "⭐" : "✅"}
                                </span>
                                <span>{prestation.highlight}</span>
                            </div>

                            <button className={styles.cardButton}>
                                📞 Demander un devis
                            </button>
                        </div>
                    ))}
                </div>

                <div className={styles.optionsSection}>
                    <h3 className={styles.optionsTitle}>
                        🔊 Options supplémentaires
                    </h3>
                    <div className={styles.optionsList}>
                        {options.map((option, index) => (
                            <div key={index} className={styles.optionItem}>
                                <span className={styles.optionIcon}>✨</span>
                                <span className={styles.optionText}>{option}</span>
                            </div>
                        ))}
                    </div>
                    <p className={styles.optionsNote}>
                        (Tarifs sur devis selon vos besoins)
                    </p>
                </div>

                <div className={styles.contactCta}>
                    <h3>Prêt à faire vibrer votre événement ?</h3>
                    <button className={styles.mainCtaButton}>
                        🎧 Contactez DJ Urya
                    </button>
                </div>
            </div>
        </section>
    );
}
