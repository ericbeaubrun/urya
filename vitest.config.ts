import {defineConfig} from "vitest/config";
import {fileURLToPath} from "node:url";

export default defineConfig({
    resolve: {
        // Reprend l'alias `@/*` de tsconfig.json.
        alias: {
            "@": fileURLToPath(new URL("./", import.meta.url)),
        },
    },
    test: {
        environment: "node",
        include: ["tests/**/*.test.ts"],
    },
});
