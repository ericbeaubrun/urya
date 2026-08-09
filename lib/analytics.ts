"use client";

import {
    isTrackablePath,
    type AnalyticsEventName,
    type AnalyticsProps,
    type Device,
} from "./analytics-events";

/**
 * Traqueur d'audience interne, côté client.
 *
 * Ni cookie, ni `localStorage`, ni empreinte de navigateur : on ne compte que
 * des pages vues et des actions, jamais des visiteurs. C'est la contrepartie
 * assumée de l'absence de bandeau — on ne saura pas distinguer un visiteur
 * revenu trois fois de trois visiteurs distincts.
 *
 * L'endpoint s'appelle `/api/stats` volontairement : les bloqueurs de contenu
 * filtrent sur des motifs comme `/analytics`, `/track` ou `/collect`. Comme il
 * est de surcroît servi par le domaine du site, la mesure échappe très
 * largement au blocage, ce qui est le principal gain face à un outil tiers.
 */

const ENDPOINT = "/api/stats";

/**
 * Les seuils sont ceux des points de bascule de la mise en page du site. On ne
 * cherche pas à identifier l'appareil, seulement à savoir sur quelle largeur
 * le site est réellement consulté — la seule mesure qui puisse trancher un
 * arbitrage de design. La largeur exacte n'est jamais transmise : elle serait
 * un élément d'empreinte, le palier ne l'est pas.
 */
function currentDevice(): Device {
    const width = window.innerWidth;

    if (width < 768) return "mobile";
    if (width < 1024) return "tablet";

    return "desktop";
}

/**
 * Émet un événement. N'échoue jamais bruyamment : une statistique perdue ne
 * doit sous aucun prétexte casser une navigation ou l'envoi d'un formulaire.
 */
export function track<N extends AnalyticsEventName>(
    name: N,
    ...[props]: AnalyticsProps<N> extends undefined ? [] : [AnalyticsProps<N>]
): void {
    if (typeof window === "undefined") return;

    // En développement, chaque rechargement à chaud produirait des lignes qui
    // fausseraient durablement les moyennes.
    if (process.env.NODE_ENV !== "production") return;

    // L'administration n'est pas de l'audience : on n'émet rien depuis ces
    // pages. La route d'ingestion refait ce contrôle, une balise pouvant être
    // forgée.
    const path = window.location.pathname;
    if (!isTrackablePath(path)) return;

    const payload = JSON.stringify({
        name,
        path,
        referrer: document.referrer || undefined,
        device: currentDevice(),
        props,
    });

    try {
        // `sendBeacon` est le seul envoi que le navigateur garantit de mener à
        // terme si la page se ferme dans la foulée. C'est indispensable pour
        // `form_abandon`, qui part précisément au moment du départ : un `fetch`
        // ordinaire serait tué avec le document.
        if (navigator.sendBeacon?.(ENDPOINT, new Blob([payload], {type: "application/json"}))) {
            return;
        }

        // Repli : `keepalive` offre la même garantie de survie, avec une limite
        // de taille que nos charges utiles ne risquent pas d'atteindre.
        void fetch(ENDPOINT, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: payload,
            keepalive: true,
        }).catch(() => {
        });
    } catch {
        // Volontairement muet.
    }
}
