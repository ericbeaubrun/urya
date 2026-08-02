import {describe, expect, it} from "vitest";
import {usableNavItems, usableSocials} from "@/lib/site-content";

describe("usableNavItems", () => {
    it("garde les entrées ayant une cible de défilement", () => {
        expect(usableNavItems([{to: "about", label: "À propos"}])).toEqual([
            {to: "about", label: "À propos"},
        ]);
    });

    it("écarte les entrées sans cible exploitable", () => {
        const items = usableNavItems([
            {to: "about", label: "À propos"},
            {label: "Orphelin"},
            {to: "", label: "Vide"},
        ]);

        expect(items).toHaveLength(1);
        expect(items[0].to).toBe("about");
    });

    it("tolère un contenu absent ou d'un autre type", () => {
        expect(usableNavItems(undefined)).toEqual([]);
        // La colonne JSON peut contenir n'importe quoi si l'admin l'a mal remplie.
        expect(usableNavItems({} as never)).toEqual([]);
    });
});

describe("usableSocials", () => {
    it("garde les liens ayant une plateforme", () => {
        const socials = usableSocials([{platform: "Instagram", url: "https://example.com"}]);

        expect(socials).toHaveLength(1);
        expect(socials[0].platform).toBe("Instagram");
    });

    it("écarte les liens sans plateforme, qui n'ont ni icône ni libellé", () => {
        expect(usableSocials([{url: "https://example.com"}, {platform: ""}])).toEqual([]);
    });

    it("tolère un contenu absent", () => {
        expect(usableSocials(undefined)).toEqual([]);
    });
});
