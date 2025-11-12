"use client";
import { useEffect } from "react";
import styles from "../styles/TikTokEmbed.module.css";

type Props = { tiktokUrl: string };

export default function TikTokEmbed({ tiktokUrl }: Props) {
    const videoId = tiktokUrl.split("/video/")[1]?.split("?")[0];

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://www.tiktok.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
        return () => { document.body.removeChild(script); };
    }, []);

    return (
        <div className={styles.wrapper}>
            <blockquote
                className="tiktok-embed"
                cite={tiktokUrl}
                data-video-id={videoId}
            >
                <section></section>
            </blockquote>
        </div>
    );
}
