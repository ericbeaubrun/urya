"use client";
import { useEffect } from "react";
import styles from "../styles/InstagramEmbed.module.css";

type Props = { instagramUrl: string; };

export default function InstagramEmbed({ instagramUrl }: Props) {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
        return () => { document.body.removeChild(script); };
    }, []);

    return (
        <div className={styles.wrapper}>
            <blockquote
                className="instagram-media"
                data-instgrm-captioned
                data-instgrm-permalink={`${instagramUrl}?utm_source=ig_embed`}
                data-instgrm-version="14"
            />
        </div>
    );
}
