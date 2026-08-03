"use client";

import {
    type AnalyticsEventName,
    type AnalyticsProps,
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
 * Le seuil correspond à la bascule de mise en page du site. On ne cherche pas
 * à identifier l'appareil, seulement à savoir si l'on regarde une expérience
 * mobile ou bureau.
 */
function currentDevice(): string {
    return window.innerWidth < 768 ? "mobile" : "desktop";
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

    const payload = JSON.stringify({
        name,
        path: window.location.pathname,
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
