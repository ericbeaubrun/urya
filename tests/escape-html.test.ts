import {describe, expect, it} from "vitest";
import {escapeHtml, escapeHtmlOr} from "@/lib/escape-html";

describe("escapeHtml", () => {
    it("neutralise une balise injectée depuis un formulaire public", () => {
        expect(escapeHtml('<script>alert(1)</script>')).toBe(
            "&lt;script&gt;alert(1)&lt;/script&gt;"
        );
    });

    it("neutralise une tentative de sortie d'attribut", () => {
        expect(escapeHtml('" onload="steal()')).toBe("&quot; onload=&quot;steal()");
        expect(escapeHtml("' onload='steal()")).toBe("&#39; onload=&#39;steal()");
    });

    it("échappe l'esperluette en premier, sans double échappement", () => {
        // Si `&` était traité après `<`, on obtiendrait `&amp;lt;`.
        expect(escapeHtml("a & b")).toBe("a &amp; b");
        expect(escapeHtml("&lt;")).toBe("&amp;lt;");
    });

    it("laisse intact un texte sans caractère spécial", () => {
        expect(escapeHtml("Soirée d'entreprise à Melun")).toBe(
            "Soirée d&#39;entreprise à Melun"
        );
        expect(escapeHtml("Mariage 2026")).toBe("Mariage 2026");
    });

    it("rend une chaîne vide pour null et undefined", () => {
        expect(escapeHtml(null)).toBe("");
        expect(escapeHtml(undefined)).toBe("");
    });

    it("convertit les autres types plutôt que de les laisser passer", () => {
        expect(escapeHtml(42)).toBe("42");
        expect(escapeHtml(false)).toBe("false");
    });
});

describe("escapeHtmlOr", () => {
    it("utilise le repli quand la valeur est vide ou absente", () => {
        expect(escapeHtmlOr(null, "Non renseigné")).toBe("Non renseigné");
        expect(escapeHtmlOr(undefined, "Non renseigné")).toBe("Non renseigné");
        expect(escapeHtmlOr("", "Non renseigné")).toBe("Non renseigné");
        expect(escapeHtmlOr("   ", "Non renseigné")).toBe("Non renseigné");
    });

    it("échappe la valeur fournie quand elle est présente", () => {
        expect(escapeHtmlOr("<b>x</b>", "Non renseigné")).toBe("&lt;b&gt;x&lt;/b&gt;");
    });

    it("échappe aussi le repli", () => {
        expect(escapeHtmlOr(null, "<i>vide</i>")).toBe("&lt;i&gt;vide&lt;/i&gt;");
    });
});
