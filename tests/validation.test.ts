import {describe, expect, it} from "vitest";
import {
    isOneOf,
    isValidDate,
    isValidEmail,
    isValidTime,
    normalizeField,
    MAX_SHORT_FIELD,
} from "@/lib/validation";

describe("isValidEmail", () => {
    it("accepte une adresse normale", () => {
        expect(isValidEmail("contact@dj-urya.fr")).toBe(true);
    });

    it("rejette les formes incomplètes", () => {
        for (const value of ["", "contact", "contact@", "@dj-urya.fr", "a@b", "a @b.fr"]) {
            expect(isValidEmail(value), value).toBe(false);
        }
    });

    it("rejette ce qui n'est pas une chaîne", () => {
        expect(isValidEmail(null)).toBe(false);
        expect(isValidEmail(42)).toBe(false);
        expect(isValidEmail({})).toBe(false);
    });

    it("rejette au-delà de la limite RFC de 254 caractères", () => {
        const local = "a".repeat(250);
        expect(isValidEmail(`${local}@b.fr`)).toBe(false);
    });
});

describe("normalizeField", () => {
    it("retire les espaces de bord", () => {
        expect(normalizeField("  Marie  ")).toBe("Marie");
    });

    it("retourne null sur une valeur vide ou absente", () => {
        expect(normalizeField("")).toBeNull();
        expect(normalizeField("   ")).toBeNull();
        expect(normalizeField(undefined)).toBeNull();
        expect(normalizeField(null)).toBeNull();
    });

    it("rejette les non-chaînes plutôt que de les convertir", () => {
        // Un objet passé ici viendrait d'un corps JSON forgé.
        expect(normalizeField({toString: () => "injection"})).toBeNull();
        expect(normalizeField(["a"])).toBeNull();
        expect(normalizeField(12)).toBeNull();
    });

    it("tronque à la longueur maximale", () => {
        const long = "x".repeat(MAX_SHORT_FIELD + 50);
        expect(normalizeField(long)).toHaveLength(MAX_SHORT_FIELD);
    });

    it("respecte une longueur maximale explicite", () => {
        expect(normalizeField("abcdef", 3)).toBe("abc");
    });
});

describe("isValidDate", () => {
    it("accepte une date ISO existante", () => {
        expect(isValidDate("2026-08-15")).toBe(true);
        expect(isValidDate("2024-02-29")).toBe(true); // année bissextile
    });

    it("rejette une date au bon format mais inexistante", () => {
        // Le cas que le seul regex laissait passer.
        expect(isValidDate("2025-02-31")).toBe(false);
        expect(isValidDate("2025-13-01")).toBe(false);
        expect(isValidDate("2025-00-10")).toBe(false);
        expect(isValidDate("2023-02-29")).toBe(false);
    });

    it("rejette les autres formats", () => {
        for (const value of ["15/08/2026", "2026-8-15", "2026-08-15T10:00", "", "demain"]) {
            expect(isValidDate(value), value).toBe(false);
        }
    });

    it("rejette ce qui n'est pas une chaîne", () => {
        expect(isValidDate(new Date())).toBe(false);
        expect(isValidDate(null)).toBe(false);
    });
});

describe("isValidTime", () => {
    it("accepte HH:MM et HH:MM:SS", () => {
        expect(isValidTime("00:00")).toBe(true);
        expect(isValidTime("23:59")).toBe(true);
        expect(isValidTime("21:30:00")).toBe(true);
    });

    it("rejette les heures hors bornes ou mal formées", () => {
        for (const value of ["24:00", "23:60", "9:30", "21h30", "", "21:3"]) {
            expect(isValidTime(value), value).toBe(false);
        }
    });
});

describe("isOneOf", () => {
    const allowed = ["mariage", "club"] as const;

    it("accepte une valeur de l'allowlist", () => {
        expect(isOneOf("mariage", allowed)).toBe(true);
    });

    it("rejette tout le reste", () => {
        expect(isOneOf("festival", allowed)).toBe(false);
        expect(isOneOf("", allowed)).toBe(false);
        expect(isOneOf(null, allowed)).toBe(false);
        expect(isOneOf(0, allowed)).toBe(false);
    });

    it("ne se laisse pas piéger par les propriétés héritées d'Array", () => {
        expect(isOneOf("length", allowed)).toBe(false);
        expect(isOneOf("constructor", allowed)).toBe(false);
    });
});
