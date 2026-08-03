"use client";

import {useEffect, useRef} from "react";
import {usePathname} from "next/navigation";
import {track} from "@/lib/analytics";

/**
 * Émet une page vue au chargement puis à chaque navigation.
 *
 * Le suivi est côté client à dessein. Compter les pages vues dans le rendu
 * serveur gonflerait les chiffres : `next/link` précharge les destinations au
 * survol, et chaque préchargement serait compté comme une visite d'une page
 * que personne n'a ouverte.
 */
export default function PageViewTracker() {
    const pathname = usePathname();
    // En mode strict, React monte les effets deux fois en développement. Ce
    // garde-fou évite d'y voir un doublon inexistant en production.
    const lastPath = useRef<string | null>(null);

    useEffect(() => {
        if (!pathname || lastPath.current === pathname) return;

        lastPath.current = pathname;
        track("page_view");
    }, [pathname]);

    return null;
}
