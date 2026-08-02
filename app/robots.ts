import type {MetadataRoute} from "next";
import {SITE_URL} from "./site-url";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            // Pages sans intérêt pour l'indexation : espace d'administration,
            // écran de connexion, page de maintenance et endpoints API.
            disallow: ["/admin", "/login", "/maintenance", "/api/"],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
