"use client";
import { useEffect } from "react";
import styles from "./TikTokEmbed.module.css";

type Props = {
    tiktokUrl: string; // ex: https://www.tiktok.com/@user/video/xxxxxxxx
};

export default function TikTokEmbed({ tiktokUrl }: Props) {
    // extraction de l'ID vidéo depuis l'URL (TikTok require `data-video-id`)
    const videoId = tiktokUrl.split("/video/")[1]?.split("?")[0];

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://www.tiktok.com/embed.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <blockquote
            className={`tiktok-embed ${styles.embed}`}
            cite={tiktokUrl}
            data-video-id={videoId}
        >
            <section></section>
        </blockquote>
    );
}
