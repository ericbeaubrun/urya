import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Le projet n'utilise volontairement pas `next/image` : les visuels
      // proviennent de l'administration (Supabase, saisie libre) sans
      // dimensions connues, ils sont déjà compressés en WebP côté client
      // (`lib/image-compress.ts`) et servis avec nos propres en-têtes de cache
      // (`next.config.ts`). Passer par l'optimiseur ne gagnerait rien et
      // impliquerait une facturation à l'image.
      "@next/next/no-img-element": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
