import {describe, expect, it, vi} from "vitest";

// La couche de requête importe le client Supabase, qui exige des variables
// d'environnement dès son chargement. Rien n'est interrogé ici : seuls les
// découpages de dates sont testés.
vi.mock("@/lib/supabase_client", () => ({supabaseAdmin: () => ({})}));

const {isDay, parseRange, rangeBounds, shiftDay, today} = await import("@/lib/analytics-query");

/**
 * Le découpage en journées est fait à l'heure de Paris, pas en UTC. Un
 * découpage UTC rangerait chaque soirée française sur le lendemain, ce qui
 * fausserait à la fois la sélection d'un jour et la répartition horaire — sans
 * qu'aucun écran ne signale l'erreur.
 */

describe("shiftDay", () => {
    it("traverse les fins de mois et les années bissextiles", () => {
        expect(shiftDay("2026-03-01", -1)).toBe("2026-02-28");
        expect(shiftDay("2024-02-28", 1)).toBe("2024-02-29");
        expect(shiftDay("2025-12-31", 1)).toBe("2026-01-01");
    });
});

describe("isDay", () => {
    it("accepte un jour civil passé", () => {
        expect(isDay(shiftDay(today(), -1))).toBe(true);
        expect(isDay(today())).toBe(true);
    });

    it("refuse un jour futur", () => {
        // Sinon l'écran s'affiche vide sans que l'on comprenne pourquoi.
        expect(isDay(shiftDay(today(), 1))).toBe(false);
    });

    it("refuse une date au bon format mais inexistante", () => {
        expect(isDay("2026-02-31")).toBe(false);
        expect(isDay("2026-13-01")).toBe(false);
    });

    it("refuse tout ce qui n'est pas un jour civil", () => {
        expect(isDay("hier")).toBe(false);
        expect(isDay("2026-3-1")).toBe(false);
        expect(isDay(20260301)).toBe(false);
        expect(isDay(undefined)).toBe(false);
    });
});

describe("rangeBounds", () => {
    it("borne une journée d'hiver sur minuit heure de Paris (UTC+1)", () => {
        const {from, to} = rangeBounds({kind: "day", day: "2026-01-15"});

        expect(from.toISOString()).toBe("2026-01-14T23:00:00.000Z");
        expect(to.toISOString()).toBe("2026-01-15T23:00:00.000Z");
    });

    it("borne une journée d'été sur minuit heure de Paris (UTC+2)", () => {
        const {from, to} = rangeBounds({kind: "day", day: "2026-07-15"});

        expect(from.toISOString()).toBe("2026-07-14T22:00:00.000Z");
        expect(to.toISOString()).toBe("2026-07-15T22:00:00.000Z");
    });

    it("donne 23 heures à la journée du passage à l'heure d'été", () => {
        // Le 29 mars 2026, 2 h devient 3 h : la journée ne dure que 23 heures,
        // et minuit est encore à l'heure d'hiver alors que midi est déjà à
        // celle d'été. C'est le cas que le calcul naïf rate.
        const {from, to} = rangeBounds({kind: "day", day: "2026-03-29"});

        expect(from.toISOString()).toBe("2026-03-28T23:00:00.000Z");
        expect((to.getTime() - from.getTime()) / 3_600_000).toBe(23);
    });

    it("donne 25 heures à la journée du passage à l'heure d'hiver", () => {
        // Le 25 octobre 2026, 3 h redevient 2 h : cette heure est vécue deux
        // fois, et les deux doivent être comptées dans la même journée.
        const {from, to} = rangeBounds({kind: "day", day: "2026-10-25"});

        expect(from.toISOString()).toBe("2026-10-24T22:00:00.000Z");
        expect((to.getTime() - from.getTime()) / 3_600_000).toBe(25);
    });

    it("couvre exactement N journées entières sur une période", () => {
        const {from, to} = rangeBounds({kind: "period", days: 7});
        const first = rangeBounds({kind: "day", day: shiftDay(today(), -6)});
        const last = rangeBounds({kind: "day", day: today()});

        // La période commence au matin du premier jour et se termine à la fin
        // de la journée en cours : un événement de ce soir doit être compté.
        expect(from.toISOString()).toBe(first.from.toISOString());
        expect(to.toISOString()).toBe(last.to.toISOString());
    });
});

describe("parseRange", () => {
    it("retient la journée dès qu'elle est valide, période ignorée", () => {
        const day = shiftDay(today(), -3);
        expect(parseRange("30", day)).toEqual({kind: "day", day});
    });

    it("retombe sur la période quand le jour est invalide", () => {
        expect(parseRange("7", "n'importe quoi")).toEqual({kind: "period", days: 7});
        expect(parseRange(undefined, undefined)).toEqual({kind: "period", days: 30});
    });

    it("écarte une période hors de la liste", () => {
        // Sinon l'URL décide seule du volume de lignes rapatriées.
        expect(parseRange("9999", undefined)).toEqual({kind: "period", days: 30});
    });
});
