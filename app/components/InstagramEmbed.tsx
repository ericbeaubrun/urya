"use client";
import {useEffect} from "react";
import styles from "./InstagramEmbed.module.css";

type Props = {
    instagramUrl: string;
};

export default function InstagramEmbed({instagramUrl}: Props) {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "//www.instagram.com/embed.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <blockquote
            className={`instagram-media custom-instagram ${styles.embed}`}
            data-instgrm-captioned
            data-instgrm-permalink={instagramUrl + "?utm_source=ig_embed&amp;utm_campaign=loading"}
            data-instgrm-version="14"
        />
    );
}
