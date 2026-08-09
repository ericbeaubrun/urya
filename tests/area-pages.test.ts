import {describe, expect, it} from "vitest";
import {
    AREA_PAGES,
    AREA_SLUGS,
    DEPARTMENT_PAGES,
    REGION_PAGE,
    areaAncestors,
    areaChildren,
    findAreaPage,
} from "@/lib/area-pages";
import {LANDING_SLUGS} from "@/lib/landing-pages";

/**
 * Ce référentiel est du contenu saisi à la main, et sa cohérence n'est vérifiée
 * par rien d'autre : un `parent` mal orthographié ne casse pas la compilation,
 * il produit silencieusement une page orpheline — c'est-à-dire une page que
 * Google découvre par le sitemap sans jamais recevoir d'autorité, exactement ce
 * que la hiérarchie cherche à éviter.
 */

describe("cohérence du référentiel de zones", () => {
    it("n'a pas de slug en double", () => {
        expect(new Set(AREA_SLUGS).size).toBe(AREA_SLUGS.length);
    });

    it("n'entre pas en collision avec les pages de prestation", () => {
        // Les deux familles partagent le segment `/[slug]` : une collision
        // rendrait l'une des deux pages inatteignable.
        const collisions = AREA_SLUGS.filter((slug) => LANDING_SLUGS.includes(slug));
        expect(collisions).toEqual([]);
    });

    it("ne référence que des slugs existants dans parent, children et related", () => {
        for (const page of AREA_PAGES) {
            const refs = [page.parent, ...(page.children ?? []), ...page.related];

            for (const ref of refs) {
                if (!ref) continue;
                expect(findAreaPage(ref), `${page.slug} → ${ref}`).toBeDefined();
            }
        }
    });

    it("déclare parent et children de façon réciproque", () => {
        for (const page of AREA_PAGES) {
            for (const child of areaChildren(page)) {
                expect(child.parent, `${child.slug} devrait pointer vers ${page.slug}`)
                    .toBe(page.slug);
            }

            if (page.parent) {
                expect(findAreaPage(page.parent)?.children).toContain(page.slug);
            }
        }
    });

    it("rattache toute page à la région, sauf la région elle-même", () => {
        for (const page of AREA_PAGES) {
            if (page.slug === REGION_PAGE.slug) {
                expect(page.parent).toBeUndefined();
                expect(areaAncestors(page)).toEqual([]);
                continue;
            }

            expect(areaAncestors(page)[0]?.slug, page.slug).toBe(REGION_PAGE.slug);
        }
    });

    it("place les huit départements franciliens sous la région", () => {
        expect(DEPARTMENT_PAGES).toHaveLength(8);
        expect(REGION_PAGE.children).toEqual(DEPARTMENT_PAGES.map((page) => page.slug));

        for (const page of DEPARTMENT_PAGES) {
            expect(page.level).toBe("department");
        }
    });

    it("respecte la hiérarchie des niveaux", () => {
        const depth = {region: 0, department: 1, city: 2} as const;

        for (const page of AREA_PAGES) {
            expect(areaAncestors(page), page.slug).toHaveLength(depth[page.level]);
        }
    });

    it("ne se cite pas soi-même dans related", () => {
        for (const page of AREA_PAGES) {
            expect(page.related, page.slug).not.toContain(page.slug);
        }
    });

    it("remplit les champs sur lesquels reposent les métadonnées", () => {
        for (const page of AREA_PAGES) {
            expect(page.metaTitle.length, `${page.slug} metaTitle`).toBeGreaterThan(0);
            expect(page.metaDescription.length, `${page.slug} metaDescription`)
                .toBeGreaterThan(0);
            expect(page.keywords.length, `${page.slug} keywords`).toBeGreaterThan(0);
            expect(page.intro.length, `${page.slug} intro`).toBeGreaterThan(0);
            expect(page.sections.length, `${page.slug} sections`).toBeGreaterThan(0);
            expect(page.faq.length, `${page.slug} faq`).toBeGreaterThan(0);
            expect(page.coverage.items.length, `${page.slug} coverage`).toBeGreaterThan(0);
        }
    });

    it("garde des métadonnées propres à chaque page", () => {
        // Deux pages qui partagent leur titre ou leur description sont le
        // premier symptôme d'un gabarit dupliqué — ce que Google désindexe.
        const titles = AREA_PAGES.map((page) => page.metaTitle);
        const descriptions = AREA_PAGES.map((page) => page.metaDescription);
        const h1 = AREA_PAGES.map((page) => page.h1);

        expect(new Set(titles).size).toBe(titles.length);
        expect(new Set(descriptions).size).toBe(descriptions.length);
        expect(new Set(h1).size).toBe(h1.length);
    });
});
