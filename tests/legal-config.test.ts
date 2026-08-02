import {describe, expect, it} from "vitest";
import {LEGAL_DEFAULTS, resolveLegal} from "@/app/legal/legal.config";

describe("resolveLegal", () => {
    it("retombe sur les valeurs par défaut quand rien n'est fourni", () => {
        expect(resolveLegal(null)).toEqual(LEGAL_DEFAULTS);
        expect(resolveLegal(undefined)).toEqual(LEGAL_DEFAULTS);
    });

    it("ne casse pas sur un contenu du mauvais type", () => {
        // La colonne JSON n'est pas contrainte : une chaîne ou un tableau ne
        // doit pas faire échouer le rendu des pages légales.
        expect(resolveLegal("n'importe quoi")).toEqual(LEGAL_DEFAULTS);
        expect(resolveLegal(42)).toEqual(LEGAL_DEFAULTS);
        expect(resolveLegal({editor: "pas un objet"}).editor).toEqual(LEGAL_DEFAULTS.editor);
    });

    it("reprend les valeurs saisies dans l'admin", () => {
        const resolved = resolveLegal({
            siteUrl: "https://dj-urya.fr",
            editor: {name: "URYA", siret: "12345678900011"},
            publicationDirector: "Eric",
        });

        expect(resolved.siteUrl).toBe("https://dj-urya.fr");
        expect(resolved.editor.name).toBe("URYA");
        expect(resolved.editor.siret).toBe("12345678900011");
        expect(resolved.publicationDirector).toBe("Eric");
    });

    it("laisse vides les champs d'identité non renseignés, pour qu'ils soient masqués", () => {
        const resolved = resolveLegal({editor: {name: "URYA"}});

        expect(resolved.editor.siret).toBe("");
        expect(resolved.editor.rcs).toBe("");
    });

    it("retire les espaces de bord", () => {
        expect(resolveLegal({publicationDirector: "  Eric  "}).publicationDirector).toBe("Eric");
    });

    it("garde un hébergeur par défaut même si l'admin l'a vidé", () => {
        // L'hébergeur est une mention obligatoire : elle ne peut pas être vide.
        const resolved = resolveLegal({host: {name: "", address: "", website: ""}});

        expect(resolved.host.name).toBe(LEGAL_DEFAULTS.host.name);
        expect(resolved.host.address).toBe(LEGAL_DEFAULTS.host.address);
    });

    it("ignore les valeurs non textuelles", () => {
        const resolved = resolveLegal({editor: {name: 42, phone: null}});

        expect(resolved.editor.name).toBe(LEGAL_DEFAULTS.editor.name);
        expect(resolved.editor.phone).toBe(LEGAL_DEFAULTS.editor.phone);
    });
});
