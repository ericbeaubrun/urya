import {describe, expect, it} from "vitest";
import {
    MAX_TESTIMONIALS,
    testimonialInitial,
    testimonialStars,
    usableTestimonials,
} from "@/lib/site-content";

/**
 * Ces trois fonctions encadrent des valeurs saisies dans l'éditeur
 * d'administration, où rien n'oblige un champ à être rempli ni une note à
 * rester dans ses bornes.
 */

describe("usableTestimonials", () => {
    it("écarte les avis sans texte", () => {
        const items = usableTestimonials([
            {quote: "Ambiance parfaite.", author: "Léa", title: "Au top"},
            {author: "Sans texte", title: "Titre seul", rating: 5},
            {quote: "   ", author: "Texte blanc"},
            {},
        ]);

        expect(items.map((item) => item.author)).toEqual(["Léa"]);
    });

    it("conserve l'ordre de saisie", () => {
        const items = usableTestimonials([
            {quote: "Premier"},
            {quote: "Deuxième"},
            {quote: "Troisième"},
        ]);

        expect(items.map((item) => item.quote)).toEqual([
            "Premier",
            "Deuxième",
            "Troisième",
        ]);
    });

    it("plafonne la liste même si le contenu enregistré déborde", () => {
        // Cas d'un contenu écrit avant l'introduction du plafond, ou modifié
        // directement en base : la grille ne doit pas déborder pour autant.
        const stored = Array.from({length: 9}, (_, i) => ({quote: `Avis ${i}`}));

        expect(usableTestimonials(stored)).toHaveLength(MAX_TESTIMONIALS);
    });

    it("tolère un contenu absent ou mal formé", () => {
        expect(usableTestimonials(undefined)).toEqual([]);
        expect(usableTestimonials({} as never)).toEqual([]);
    });
});

describe("testimonialStars", () => {
    it("rend la note saisie", () => {
        expect(testimonialStars(5)).toBe(5);
        expect(testimonialStars(3)).toBe(3);
    });

    it("accepte une note enregistrée sous forme de chaîne", () => {
        expect(testimonialStars("4")).toBe(4);
    });

    it("ramène la note dans les bornes", () => {
        expect(testimonialStars(9)).toBe(5);
        expect(testimonialStars(-2)).toBe(0);
        expect(testimonialStars(4.6)).toBe(5);
    });

    it("n'affiche aucune étoile sans note exploitable", () => {
        expect(testimonialStars(undefined)).toBe(0);
        expect(testimonialStars(null)).toBe(0);
        expect(testimonialStars("")).toBe(0);
        expect(testimonialStars("beaucoup")).toBe(0);
    });
});

describe("testimonialInitial", () => {
    it("prend la première lettre, en capitale", () => {
        expect(testimonialInitial("kevin")).toBe("K");
        expect(testimonialInitial("Hicham")).toBe("H");
    });

    it("ignore les espaces de tête", () => {
        expect(testimonialInitial("  Sam ")).toBe("S");
    });

    it("conserve les accents plutôt que de les translittérer", () => {
        expect(testimonialInitial("Élise")).toBe("É");
    });

    it("ne coupe pas un caractère composé en deux", () => {
        // `"🎉"[0]` rendrait une moitié de paire de substitution, donc un
        // losange noir à la place de la pastille.
        expect(testimonialInitial("🎉 Karim")).toBe("🎉");
    });

    it("ne rend aucune pastille sans nom", () => {
        expect(testimonialInitial(undefined)).toBeNull();
        expect(testimonialInitial("   ")).toBeNull();
    });
});

