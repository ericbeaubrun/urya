import {describe, expect, it} from "vitest";
import {
    detectBrowser,
    detectOs,
    isAnalyticsEventName,
    isDevice,
    isTrackablePath,
    MAX_PROP_LENGTH,
    sanitizePath,
    sanitizeProps,
    sanitizeReferrerHost,
} from "@/lib/analytics-events";

/**
 * Ces tests portent moins sur le confort de développement que sur une garantie
 * de conformité : l'absence de bandeau cookie repose entièrement sur le fait
 * qu'aucune donnée personnelle n'atteint la base. Une régression ici ne
 * casserait rien de visible — elle rendrait le traitement illicite.
 */

describe("isAnalyticsEventName", () => {
    it("accepte un événement déclaré", () => {
        expect(isAnalyticsEventName("page_view")).toBe(true);
        expect(isAnalyticsEventName("booking_submit")).toBe(true);
    });

    it("rejette un événement inconnu", () => {
        expect(isAnalyticsEventName("drop_table")).toBe(false);
        expect(isAnalyticsEventName("")).toBe(false);
        expect(isAnalyticsEventName(null)).toBe(false);
    });

    it("rejette les propriétés héritées d'Object", () => {
        expect(isAnalyticsEventName("toString")).toBe(false);
        expect(isAnalyticsEventName("constructor")).toBe(false);
    });
});

describe("sanitizeProps", () => {
    it("ne garde que les clés déclarées pour l'événement", () => {
        expect(sanitizeProps("cta_click", {source: "hero", email: "a@b.com"}))
            .toEqual({source: "hero"});
    });

    it("écarte les propriétés d'un événement qui n'en déclare aucune", () => {
        expect(sanitizeProps("page_view", {source: "hero"})).toBeNull();
    });

    it("renvoie null plutôt qu'un objet vide", () => {
        expect(sanitizeProps("cta_click", {source: "   "})).toBeNull();
        expect(sanitizeProps("cta_click", undefined)).toBeNull();
    });

    it("accepte les nombres, qui servent aux numéros d'étape", () => {
        expect(sanitizeProps("form_step", {step: 2})).toEqual({step: "2"});
    });

    it("écrase les sauts de ligne", () => {
        expect(sanitizeProps("form_error", {field: "nom\n\nmail"}))
            .toEqual({field: "nom mail"});
    });

    it("tronque une valeur trop longue", () => {
        const value = sanitizeProps("faq_open", {question: "a".repeat(500)});
        expect(value?.question).toHaveLength(MAX_PROP_LENGTH);
    });

    it("ignore les valeurs non scalaires", () => {
        expect(sanitizeProps("cta_click", {source: {nested: true}})).toBeNull();
    });
});

describe("sanitizePath", () => {
    it("retire la chaîne de requête, qui porte les identifiants de campagne", () => {
        expect(sanitizePath("/dj-mariage?utm_source=fb&gclid=abc")).toBe("/dj-mariage");
        expect(sanitizePath("/dj-mariage#faq")).toBe("/dj-mariage");
    });

    it("conserve un chemin nu", () => {
        expect(sanitizePath("/")).toBe("/");
        expect(sanitizePath("/dj-melun")).toBe("/dj-melun");
    });

    it("rejette ce qui n'est pas un chemin", () => {
        expect(sanitizePath("https://exemple.fr/page")).toBeNull();
        expect(sanitizePath("dj-melun")).toBeNull();
        expect(sanitizePath(42)).toBeNull();
    });
});

describe("sanitizeReferrerHost", () => {
    it("ne conserve que l'hôte, jamais la requête tapée par le visiteur", () => {
        expect(sanitizeReferrerHost("https://www.google.com/search?q=dj+mariage+jean+dupont"))
            .toBe("google.com");
    });

    it("écarte la navigation interne", () => {
        expect(sanitizeReferrerHost("https://dj-urya.fr/faq", "dj-urya.fr")).toBeNull();
        expect(sanitizeReferrerHost("https://www.dj-urya.fr/faq", "dj-urya.fr")).toBeNull();
    });

    it("rejette une valeur inexploitable", () => {
        expect(sanitizeReferrerHost("pas une url")).toBeNull();
        expect(sanitizeReferrerHost("")).toBeNull();
        expect(sanitizeReferrerHost(undefined)).toBeNull();
    });
});

describe("isTrackablePath", () => {
    it("écarte l'administration et la connexion", () => {
        expect(isTrackablePath("/admin")).toBe(false);
        expect(isTrackablePath("/admin/statistiques")).toBe(false);
        expect(isTrackablePath("/admin/prestations/futures")).toBe(false);
        expect(isTrackablePath("/login")).toBe(false);
    });

    it("conserve les pages publiques", () => {
        expect(isTrackablePath("/")).toBe(true);
        expect(isTrackablePath("/dj-mariage-seine-et-marne")).toBe(true);
        expect(isTrackablePath("/mentions-legales")).toBe(true);
    });

    it("ne se laisse pas berner par un préfixe partiel", () => {
        // Une page publique dont le chemin commence par les mêmes lettres doit
        // rester comptée.
        expect(isTrackablePath("/administration-de-preuve")).toBe(true);
        expect(isTrackablePath("/logins")).toBe(true);
    });

    it("écarte un chemin absent", () => {
        expect(isTrackablePath(null)).toBe(false);
        expect(isTrackablePath(undefined)).toBe(false);
    });
});

describe("isDevice", () => {
    it("n'accepte que les paliers de mise en page connus", () => {
        expect(isDevice("mobile")).toBe(true);
        expect(isDevice("tablet")).toBe(true);
        expect(isDevice("desktop")).toBe(true);
    });

    it("écarte toute autre valeur", () => {
        // Une largeur exacte serait un élément d'empreinte : seul le palier
        // doit pouvoir entrer en base.
        expect(isDevice("1440")).toBe(false);
        expect(isDevice("iPhone 15 Pro")).toBe(false);
        expect(isDevice(null)).toBe(false);
    });
});

/**
 * Le User-Agent brut n'est jamais stocké : ces deux fonctions sont le seul
 * chemin par lequel il peut laisser une trace, et leur rôle est de le réduire
 * à une famille. Un cas non reconnu doit donner `null`, pas la chaîne d'entrée
 * — sans quoi un User-Agent complet finirait en base.
 */
describe("detectOs", () => {
    it("reconnaît les familles courantes", () => {
        expect(detectOs("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")).toBe("Windows");
        expect(detectOs("Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X)")).toBe("iOS");
        expect(detectOs("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)")).toBe("macOS");
    });

    it("ne confond pas Android avec Linux", () => {
        // Un User-Agent Android contient « Linux » : sans l'ordre des motifs,
        // tout le trafic mobile serait rangé au mauvais endroit.
        expect(detectOs("Mozilla/5.0 (Linux; Android 14; Pixel 8)")).toBe("Android");
        expect(detectOs("Mozilla/5.0 (X11; Linux x86_64)")).toBe("Linux");
    });

    it("renvoie null plutôt que la chaîne d'entrée quand rien ne correspond", () => {
        expect(detectOs("UnAgentInconnu/1.0")).toBeNull();
        expect(detectOs("")).toBeNull();
    });
});

describe("detectBrowser", () => {
    it("préfère le moteur le plus spécifique", () => {
        // Les User-Agent s'imitent en cascade : Edge se déclare Chrome, qui se
        // déclare Safari. Le plus spécifique doit gagner.
        const edge = "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Chrome/124.0 Safari/537.36 Edg/124.0";
        expect(detectBrowser(edge)).toBe("Edge");

        const chrome = "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Chrome/124.0 Safari/537.36";
        expect(detectBrowser(chrome)).toBe("Chrome");

        const safari = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.4 Safari/605.1.15";
        expect(detectBrowser(safari)).toBe("Safari");
    });

    it("reconnaît Firefox sur mobile comme sur bureau", () => {
        expect(detectBrowser("Mozilla/5.0 (Windows NT 10.0; rv:125.0) Gecko/20100101 Firefox/125.0")).toBe("Firefox");
        expect(detectBrowser("Mozilla/5.0 (iPhone) FxiOS/125.0 Mobile/15E148 Safari/605.1.15")).toBe("Firefox");
    });

    it("renvoie null plutôt que la chaîne d'entrée quand rien ne correspond", () => {
        expect(detectBrowser("UnAgentInconnu/1.0")).toBeNull();
        expect(detectBrowser("")).toBeNull();
    });
});
