import {describe, expect, it} from "vitest";
import {galleryObjectName, referencedGalleryObjects} from "@/lib/gallery";

/**
 * Ces deux fonctions décident quels fichiers le ramasse-miettes supprime du
 * bucket. Un faux positif efface un visuel encore affiché sur le site ; c'est
 * le cas que la majorité de ces cas de test couvre.
 */

const PUBLIC_BASE =
    "https://rkhalahlsymnusgzketk.supabase.co/storage/v1/object/public/gallery/";

describe("galleryObjectName", () => {
    it("extrait le nom d'un visuel téléversé", () => {
        expect(galleryObjectName(`${PUBLIC_BASE}a1b2c3.webp`)).toBe("a1b2c3.webp");
    });

    it("ignore la chaîne de requête et l'ancre", () => {
        expect(galleryObjectName(`${PUBLIC_BASE}a1b2c3.webp?v=2`)).toBe("a1b2c3.webp");
        expect(galleryObjectName(`${PUBLIC_BASE}a1b2c3.webp#top`)).toBe("a1b2c3.webp");
    });

    it("ne reconnaît pas les visuels servis depuis public/", () => {
        // Ce sont les images livrées avec le code : les traiter comme des
        // objets de stockage reviendrait à tenter de les supprimer.
        expect(galleryObjectName("/dj-urya_4.webp")).toBeNull();
        expect(galleryObjectName("dj-urya_4.webp")).toBeNull();
    });

    it("ne reconnaît pas un autre bucket ni un autre hébergeur", () => {
        expect(
            galleryObjectName(
                "https://rkhalahlsymnusgzketk.supabase.co/storage/v1/object/public/autre/x.webp"
            )
        ).toBeNull();
        expect(galleryObjectName("https://images.pexels.com/photos/1/x.jpeg")).toBeNull();
    });

    it("refuse un nom porteur de séparateurs", () => {
        // Nos envois déposent des UUID à plat : un chemin composé ne peut venir
        // que d'ailleurs, et ne doit pas devenir une cible de suppression.
        expect(galleryObjectName(`${PUBLIC_BASE}sous/dossier.webp`)).toBeNull();
        expect(galleryObjectName(`${PUBLIC_BASE}`)).toBeNull();
    });

    it("tolère une source absente", () => {
        expect(galleryObjectName(undefined)).toBeNull();
        expect(galleryObjectName("")).toBeNull();
    });
});

describe("referencedGalleryObjects", () => {
    it("ne retient que les objets de stockage", () => {
        const names = referencedGalleryObjects([
            {src: `${PUBLIC_BASE}un.webp`},
            {src: "/dj-urya_4.webp"},
            {src: `${PUBLIC_BASE}deux.webp`},
        ]);

        expect([...names].sort()).toEqual(["deux.webp", "un.webp"]);
    });

    it("dédoublonne un même visuel utilisé deux fois", () => {
        const names = referencedGalleryObjects([
            {src: `${PUBLIC_BASE}un.webp`},
            {src: `${PUBLIC_BASE}un.webp`},
        ]);

        expect(names.size).toBe(1);
    });

    it("tolère un contenu absent ou mal formé", () => {
        expect(referencedGalleryObjects(undefined).size).toBe(0);
        expect(referencedGalleryObjects([{}, {src: undefined}]).size).toBe(0);
        expect(referencedGalleryObjects({} as never).size).toBe(0);
    });
});
