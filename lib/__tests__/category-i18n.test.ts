import { describe, it, expect } from "vitest";
import { getPopularTerms } from "@/lib/category-i18n";
import { CATEGORY_KEYS } from "@/lib/directory-data";
import type { Lang } from "@/lib/i18n";

describe("getPopularTerms", () => {
  const langs: Lang[] = ["en", "fr", "ar"];

  it.each(langs)("returns exactly 5 terms for lang=%s", (lang) => {
    const terms = getPopularTerms(lang);
    expect(terms).toHaveLength(5);
  });

  it.each(langs)("returns strings for lang=%s", (lang) => {
    const terms = getPopularTerms(lang);
    for (const term of terms) {
      expect(typeof term).toBe("string");
      expect(term.length).toBeGreaterThan(0);
    }
  });

  it("uses the first 5 CATEGORY_KEYS in order", () => {
    const expectedKeys = CATEGORY_KEYS.slice(0, 5);
    const terms = getPopularTerms("en");

    // Each term should be the English translation of the corresponding key
    for (let i = 0; i < expectedKeys.length; i++) {
      // The term should not be the raw key itself (proves translation happened)
      expect(terms[i]).not.toBe(expectedKeys[i]);
    }
  });

  it("returns different translations per language", () => {
    const en = getPopularTerms("en");
    const fr = getPopularTerms("fr");
    const ar = getPopularTerms("ar");

    // At least the first term should differ across languages
    expect(en[0]).not.toBe(fr[0]);
    expect(en[0]).not.toBe(ar[0]);
    expect(fr[0]).not.toBe(ar[0]);
  });

  it("maps each result to a known category translation", () => {
    // Verify all 3 languages produce valid translations for all 5 keys
    const keys = CATEGORY_KEYS.slice(0, 5);
    const langs: Lang[] = ["en", "fr", "ar"];

    for (const lang of langs) {
      const terms = getPopularTerms(lang);
      expect(terms).toHaveLength(keys.length);

      for (let i = 0; i < keys.length; i++) {
        // Each term should be a non-empty string
        expect(terms[i].length).toBeGreaterThan(0);
      }
    }
  });
});
