import {describe, expect, it} from "vitest";
import {renderMarkdownEmail} from "@/lib/markdown-email";
import {
    EMAIL_TEMPLATES,
    getTemplateDef,
    renderTemplateBody,
    renderTemplateSubject,
    unknownPlaceholders,
} from "@/lib/email-templates";

describe("renderMarkdownEmail", () => {
    it("échappe le HTML saisi au lieu de l'interpréter", () => {
        const html = renderMarkdownEmail("<script>alert(1)</script>");

        expect(html).not.toContain("<script>");
        expect(html).toContain("&lt;script&gt;");
    });

    it("rend gras, italique, titres, listes et séparateur", () => {
        const html = renderMarkdownEmail("### Titre\n\n- **a**\n- *b*\n\n---\n\ntexte");

        expect(html).toContain("Titre</h3>");
        expect(html).toContain("<strong>a</strong>");
        expect(html).toContain("<em>b</em>");
        expect(html).toContain('<div class="hr"></div>');
        expect(html).toContain("<p>texte</p>");
    });

    it("n'accepte que les schémas de lien sûrs", () => {
        expect(renderMarkdownEmail("[ok](https://urya.fr)")).toContain('href="https://urya.fr"');

        const dangerous = renderMarkdownEmail("[clic](javascript:alert(1))");
        expect(dangerous).not.toContain("<a ");
        expect(dangerous).toContain("clic");
    });

    it("laisse les placeholders intacts", () => {
        expect(renderMarkdownEmail("Bonjour **{{nom}}**")).toContain("{{nom}}");
    });
});

describe("renderTemplateBody", () => {
    const def = getTemplateDef("prestation_client")!;

    it("substitue les variables du catalogue", () => {
        const html = renderTemplateBody(def, "Bonjour {{nom}}", {nom: "Camille"});
        expect(html).toContain("Bonjour Camille");
    });

    it("échappe les valeurs et n'interprète pas leur Markdown", () => {
        const html = renderTemplateBody(def, "Bonjour {{nom}}", {
            nom: "<b>x</b> [clic](https://phishing.example)",
        });

        expect(html).not.toContain("<b>x</b>");
        expect(html).not.toContain("phishing.example\"");
        expect(html).not.toContain("<a ");
    });

    it("applique la valeur de repli quand la donnée est vide", () => {
        const html = renderTemplateBody(def, "Lieu : {{lieu}}", {lieu: "   "});
        expect(html).toContain("Lieu : Non renseigné");
    });

    it("laisse en place un placeholder hors catalogue", () => {
        const html = renderTemplateBody(def, "{{inconnu}}", {inconnu: "valeur"});
        expect(html).toContain("{{inconnu}}");
    });
});

describe("renderTemplateSubject", () => {
    const def = getTemplateDef("prestation_admin")!;

    it("supprime les retours à la ligne, pour ne pas injecter d'en-tête", () => {
        const subject = renderTemplateSubject(def, "Demande de {{nom}}", {
            nom: "Camille\nBcc: tiers@example.com",
        });

        expect(subject).not.toContain("\n");
    });
});

describe("catalogue", () => {
    it("n'utilise que des variables déclarées dans ses valeurs par défaut", () => {
        for (const def of EMAIL_TEMPLATES) {
            expect(unknownPlaceholders(def, def.defaultSubject, def.defaultBody)).toEqual([]);
        }
    });

    it("expose des clés uniques", () => {
        const keys = EMAIL_TEMPLATES.map(t => t.key);
        expect(new Set(keys).size).toBe(keys.length);
    });
});
