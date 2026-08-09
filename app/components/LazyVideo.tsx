'use client';

import {useEffect, useRef, useState} from 'react';

/**
 * `onLoad` : la vidéo est visible d'emblée (arrière-plan du hero), mais on
 * attend la fin du chargement de la page pour ne pas concurrencer le LCP.
 * `onVisible` : la vidéo est plus bas dans la page, on ne la télécharge que
 * lorsqu'elle approche du viewport.
 */
type LoadStrategy = 'onLoad' | 'onVisible';

interface LazyVideoProps {
    src: string;
    /** Affiché immédiatement, le temps que la vidéo soit chargée. */
    poster: string;
    className?: string;
    strategy?: LoadStrategy;
}

/**
 * Vidéo décorative en lecture automatique, sans son ni contrôles.
 *
 * L'attribut `autoPlay` est volontairement absent : il déclencherait le
 * téléchargement dès le rendu, `preload="none"` compris. On pose donc `src`
 * seulement une fois la stratégie satisfaite, puis on lance la lecture à la
 * main. Tant que ce n'est pas le cas, le navigateur n'affiche que le poster.
 */
export default function LazyVideo({src, poster, className, strategy = 'onVisible'}: LazyVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [activated, setActivated] = useState(false);

    useEffect(() => {
        if (strategy === 'onLoad') {
            if (document.readyState === 'complete') {
                // La page est déjà chargée : plus rien à attendre. On diffère
                // d'une frame plutôt que d'appeler setState dans le corps de
                // l'effet, ce qui provoquerait un rendu en cascade.
                const frame = requestAnimationFrame(() => setActivated(true));
                return () => cancelAnimationFrame(frame);
            }
            const onLoad = () => setActivated(true);
            window.addEventListener('load', onLoad, {once: true});
            return () => window.removeEventListener('load', onLoad);
        }

        const element = videoRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setActivated(true);
                    observer.disconnect();
                }
            },
            // Marge d'avance : le téléchargement démarre avant que la section
            // n'entre réellement dans le champ de vision.
            {rootMargin: '300px'}
        );
        observer.observe(element);
        return () => observer.disconnect();
    }, [strategy]);

    useEffect(() => {
        if (!activated) return;
        // La promesse est rejetée si le navigateur bloque la lecture automatique
        // ou si le composant est démonté entre-temps : sans effet visible, le
        // poster reste affiché.
        videoRef.current?.play().catch(() => {});
    }, [activated]);

    return (
        <video
            ref={videoRef}
            src={activated ? src : undefined}
            poster={poster}
            preload="none"
            muted
            loop
            playsInline
            aria-hidden="true"
            className={className}
        />
    );
}
