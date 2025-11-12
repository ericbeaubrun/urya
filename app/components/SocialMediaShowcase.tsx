"use client";

import InstagramEmbed from "./InstagramEmbed";
import TikTokEmbed from "./TikTokEmbed";
import styles from "../styles/SocialMediaShowcase.module.css";
import Image from "next/image";

export default function SocialMediaShowcase() {
    const instagramHandle = "@djxuryax77";
    const tiktokHandle = "@djxuryax77";

    const instagramProfileUrl = "https://www.instagram.com/djxuryax77/";
    const tiktokProfileUrl = "https://www.tiktok.com/@djxuryax77";

    return (
        <section className={styles.wrapper}>
            <h2 className={styles.title}>
                Suivez votre DJ sur les réseaux
            </h2>

            <div className={styles.grid}>

                {/* INSTAGRAM */}
                <div className={styles.card}>
                    <div className={styles.header}>
                        <Image
                            src="/insta.png"
                            alt="Instagram"
                            width={56}
                            height={56}
                            className={styles.icon}
                        />
                        <a href={instagramProfileUrl} target="_blank" className={styles.handle}>
                            {instagramHandle}
                        </a>
                    </div>

                    <InstagramEmbed instagramUrl="https://www.instagram.com/reel/DO3VFXCCAvF/"/>
                </div>

                {/* TIKTOK */}
                <div className={styles.card}>
                    <div className={styles.header}>
                        <Image
                            src="/tiktok.png"
                            alt="TikTok"
                            width={56}
                            height={56}
                            className={styles.icon}
                        />
                        <a href={tiktokProfileUrl} target="_blank" className={styles.handle}>
                            {tiktokHandle}
                        </a>
                    </div>

                    <TikTokEmbed tiktokUrl="https://www.tiktok.com/@djxuryax77/video/7566762503657639190"/>
                </div>

            </div>
        </section>
    );
}


// "use client";
//
// import InstagramEmbed from "./InstagramEmbed";
// import TikTokEmbed from "./TikTokEmbed";
// import styles from "./SocialMediaShowcase.module.css";
//
// export default function SocialMediaShowcase() {
//     return (
//         <section className={styles.wrapper}>
//             <h2 className={styles.title}>Suivez le DJ sur les réseaux 🎧</h2>
//
//             <div className={styles.accounts}>
//                 <a href="https://www.instagram.com/djxuryax77/" target="_blank" className={styles.link}>
//                     @TON_COMPTE_INSTAGRAM
//                 </a>
//                 <a href="https://www.tiktok.com/@djxuryax77" target="_blank" className={styles.link}>
//                     @TON_COMPTE_TIKTOK
//                 </a>
//             </div>
//
//             <div className={styles.grid}>
//                 {/* 👉 Tu ajoutes ou retires des vidéos ici */}
//                 <InstagramEmbed instagramUrl="https://www.instagram.com/reel/DO3VFXCCAvF/" />
//                 <TikTokEmbed tiktokUrl="https://www.tiktok.com/@djxuryax77/video/7566762503657639190" />
//             </div>
//         </section>
//     );
// }
