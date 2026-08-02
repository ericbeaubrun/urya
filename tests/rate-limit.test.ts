import {afterEach, describe, expect, it, vi} from "vitest";
import {rateLimit} from "@/lib/rate-limit";

// L'état du limiteur vit dans un Map au niveau du module : chaque test utilise
// donc un identifiant unique pour rester indépendant des autres.
let counter = 0;
const uniqueKey = () => `test:${counter++}:${Math.random()}`;

afterEach(() => {
    vi.useRealTimers();
});

describe("rateLimit", () => {
    it("autorise les requêtes jusqu'à la limite", () => {
        const key = uniqueKey();
        const options = {limit: 3, windowMs: 60_000};

        expect(rateLimit(key, options)).toMatchObject({success: true, remaining: 2});
        expect(rateLimit(key, options)).toMatchObject({success: true, remaining: 1});
        expect(rateLimit(key, options)).toMatchObject({success: true, remaining: 0});
    });

    it("refuse la requête qui dépasse la limite", () => {
        const key = uniqueKey();
        const options = {limit: 2, windowMs: 60_000};

        rateLimit(key, options);
        rateLimit(key, options);
        const blocked = rateLimit(key, options);

        expect(blocked.success).toBe(false);
        expect(blocked.remaining).toBe(0);
        expect(blocked.retryAfter).toBeGreaterThan(0);
    });

    it("compte séparément deux identifiants", () => {
        const options = {limit: 1, windowMs: 60_000};
        const a = uniqueKey();
        const b = uniqueKey();

        expect(rateLimit(a, options).success).toBe(true);
        expect(rateLimit(b, options).success).toBe(true);
        expect(rateLimit(a, options).success).toBe(false);
    });

    it("rouvre une fois la fenêtre écoulée", () => {
        vi.useFakeTimers();
        const key = uniqueKey();
        const options = {limit: 1, windowMs: 60_000};

        expect(rateLimit(key, options).success).toBe(true);
        expect(rateLimit(key, options).success).toBe(false);

        vi.advanceTimersByTime(60_001);

        expect(rateLimit(key, options).success).toBe(true);
    });

    it("ne rouvre pas avant la fin de la fenêtre", () => {
        vi.useFakeTimers();
        const key = uniqueKey();
        const options = {limit: 1, windowMs: 60_000};

        rateLimit(key, options);
        vi.advanceTimersByTime(59_000);

        expect(rateLimit(key, options).success).toBe(false);
    });

    it("annonce un retryAfter décroissant, en secondes", () => {
        vi.useFakeTimers();
        const key = uniqueKey();
        const options = {limit: 1, windowMs: 60_000};

        rateLimit(key, options);
        const first = rateLimit(key, options).retryAfter;

        vi.advanceTimersByTime(30_000);
        const later = rateLimit(key, options).retryAfter;

        expect(first).toBeLessThanOrEqual(60);
        expect(later).toBeLessThan(first);
        expect(later).toBeGreaterThan(0);
    });
});
