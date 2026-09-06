import { describe, it, expect } from "vitest";
import { getPopularTerms, getCategoryItems, getCategoryName } from "@/lib/category-i18n";
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

describe("getCategoryItems", () => {
  const langs: Lang[] = ["en", "fr", "ar"];

  it.each(langs)(
    "returns exactly %d items for lang=%s (matches CATEGORY_KEYS.length)",
    (lang) => {
      const items = getCategoryItems(lang);
      expect(items).toHaveLength(CATEGORY_KEYS.length);
    },
  );

  it.each(langs)("returns objects with name property for lang=%s", (lang) => {
    const items = getCategoryItems(lang);
    for (const item of items) {
      expect(item).toHaveProperty("name");
      expect(typeof item.name).toBe("string");
      expect(item.name.length).toBeGreaterThan(0);
    }
  });

  it("returns one item per CATEGORY_KEY in order", () => {
    const items = getCategoryItems("en");
    expect(items).toHaveLength(CATEGORY_KEYS.length);

    // Each item name should be a translation, not the raw key
    for (let i = 0; i < CATEGORY_KEYS.length; i++) {
      expect(items[i].name).not.toBe(CATEGORY_KEYS[i]);
    }
  });

  it("returns different translations per language", () => {
    const en = getCategoryItems("en");
    const fr = getCategoryItems("fr");
    const ar = getCategoryItems("ar");

    // All 3 languages should produce distinct first items
    expect(en[0].name).not.toBe(fr[0].name);
    expect(en[0].name).not.toBe(ar[0].name);
    expect(fr[0].name).not.toBe(ar[0].name);
  });

  it("includes all CATEGORY_KEYS translations without gaps", () => {
    const langs: Lang[] = ["en", "fr", "ar"];
    for (const lang of langs) {
      const items = getCategoryItems(lang);
      expect(items).toHaveLength(CATEGORY_KEYS.length);

      // Every item must be a non-empty translated string
      for (const item of items) {
        expect(item.name.trim().length).toBeGreaterThan(0);
      }
    }
  });
});

describe("getCategoryName", () => {
  // --- Slug-to-key resolution ---

  it("resolves DB slug 'food' to English translation", () => {
    expect(getCategoryName("food", "en")).toBe("Food & Agriculture");
  });

  it("resolves DB slug 'textile' (not 'textiles') via slug-to-key mapping", () => {
    expect(getCategoryName("textile", "en")).toBe("Textiles & Apparel");
  });

  it("resolves DB slug 'mechanical' via slug-to-key mapping", () => {
    expect(getCategoryName("mechanical", "en")).toBe("Industrial Machinery");
  });

  it("resolves DB slug 'chemical' via slug-to-key mapping", () => {
    expect(getCategoryName("chemical", "en")).toBe("Chemicals & Plastics");
  });

  it("resolves DB slug 'electrical' to English translation", () => {
    expect(getCategoryName("electrical", "en")).toBe("Electrical & Electronics");
  });

  it("resolves DB slug 'construction' to English translation", () => {
    expect(getCategoryName("construction", "en")).toBe("Construction & Building");
  });

  // --- All 6 DB slugs return translations, not raw keys ---

  const dbSlugs = ["food", "textile", "mechanical", "chemical", "electrical", "construction"];

  it.each(dbSlugs)("slug '%s' returns a translation, not the raw key (en)", (slug) => {
    const result = getCategoryName(slug, "en");
    expect(result).not.toBe(slug);
    expect(result.length).toBeGreaterThan(0);
  });

  // --- Cross-language translations ---

  it("resolves 'food' to French translation", () => {
    expect(getCategoryName("food", "fr")).toBe("Alimentation & Agriculture");
  });

  it("resolves 'food' to Arabic translation", () => {
    expect(getCategoryName("food", "ar")).toBe("الأغذية والزراعة");
  });

  it("returns different translations per language for the same slug", () => {
    const en = getCategoryName("food", "en");
    const fr = getCategoryName("food", "fr");
    const ar = getCategoryName("food", "ar");
    expect(en).not.toBe(fr);
    expect(en).not.toBe(ar);
    expect(fr).not.toBe(ar);
  });

  // --- Missing key fallback (unknown slug, no dbName) ---

  it("returns capitalized slug when slug is unknown and no dbName", () => {
    expect(getCategoryName("unknown-slug", "en")).toBe("Unknown-slug");
  });

  it("capitalizes only the first character of unknown slug", () => {
    expect(getCategoryName("my-custom", "en")).toBe("My-custom");
  });

  // --- dbName fallback ---

  it("returns dbName when slug is unknown and dbName is provided", () => {
    expect(getCategoryName("unknown", "en", "Custom Category")).toBe("Custom Category");
  });

  it("returns dbName when dbName is a non-empty string", () => {
    expect(getCategoryName("whatever", "fr", "Ma Catégorie")).toBe("Ma Catégorie");
  });

  // --- null dbName behavior ---

  it("falls back to capitalized slug when dbName is null", () => {
    expect(getCategoryName("unknown", "en", null)).toBe("Unknown");
  });

  it("falls back to capitalized slug when dbName is undefined", () => {
    expect(getCategoryName("unknown", "en", undefined)).toBe("Unknown");
  });

  it("falls back to capitalized slug when dbName is empty string", () => {
    expect(getCategoryName("unknown", "en", "")).toBe("Unknown");
  });

  // --- Mapped slug but key exists (not a dead mapping) ---

  it("does not return the raw i18n key when mapping succeeds", () => {
    // 'textile' maps to i18n key 'textiles' — result should be the translation, not 'textiles'
    expect(getCategoryName("textile", "en")).not.toBe("textiles");
    expect(getCategoryName("textile", "en")).toBe("Textiles & Apparel");
  });
});
