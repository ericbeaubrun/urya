// "use client";
//
// import styles from "../styles/Footer.module.css";
//
// export default function Footer() {
//     const currentYear = new Date().getFullYear();
//
//     const contactInfo = {
//         telephone: "07 43 35 65 17",
//         email: "2souchik@gmail.com",
//         adresse: "Le-Mée-sur-Seine (77350)"
//     };
//
//     return (
//         <footer className={styles.footer}>
//             <div className={styles.container}>
//                 <div className={styles.contact}>
//                     <div className={styles.contactItem}>
//                         <h4>Téléphone</h4>
//                         <p>{contactInfo.telephone}</p>
//                     </div>
//                     <div className={styles.contactItem}>
//                         <h4>Email</h4>
//                         <p>{contactInfo.email}</p>
//                     </div>
//                     <div className={styles.contactItem}>
//                         <h4>Adresse</h4>
//                         <p>{contactInfo.adresse}</p>
//                     </div>
//                 </div>
//             </div>
//
//             <div className={styles.bottom}>
//                 <p>© {currentYear} Dj URYA. Tous droits réservés.</p>
//             </div>
//         </footer>
//     );
// }
"use client";

import Image from "next/image";
import styles from "../styles/Footer.module.css";
import {ExternalLink} from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const contactInfo = {
        telephone: "07 43 35 65 17",
        email: "2souchik@gmail.com",
        adresse: "Le-Mée-sur-Seine (77350)"
    };

    const socials = [
        {
            name: "Instagram",
            icon: "/insta.png",
            user: "@djxuryax77",
            link: "https://www.instagram.com/dj.urya"
        },
        {
            name: "TikTok",
            icon: "/tt.png",
            user: "@djxuryax77",
            link: "https://www.tiktok.com/@dj.urya"
        }
    ];

    return (
        <footer className={styles.footer}>
            <div className={styles.socials}>
                {socials.map((social, index) => (
                    <a
                        key={index}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialItem}
                    >
                        <Image
                            src={social.icon}
                            alt={social.name}
                            width={30}
                            height={30}
                        />
                        <span>{social.user}</span>
                        {/*<ExternalLink className={styles.icon}/>*/}

                    </a>
                ))}
            </div>

            <div className={styles.container}>
                <div className={styles.contact}>
                    <div className={styles.contactItem}>
                        <h4>Tel</h4>
                        <p>{contactInfo.telephone}</p>
                    </div>
                    <div className={styles.contactItem}>
                        <h4>Email</h4>
                        <p>{contactInfo.email}</p>
                    </div>
                    <div className={styles.contactItem}>
                        <h4>Adresse</h4>
                        <p>{contactInfo.adresse}</p>
                    </div>
                </div>

                {/* --- Réseaux sociaux --- */}

            </div>

            <div className={styles.bottom}>
                <p>© {currentYear} Dj URYA. Tous droits réservés.</p>
            </div>
        </footer>
    );
}
