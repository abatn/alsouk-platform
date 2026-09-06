import type { Lang } from "@/lib/i18n";
import { directoryT } from "@/lib/directory-i18n";
import { CATEGORY_KEYS } from "@/lib/directory-data";

/**
 * Maps database category slugs to the i18n keys used in directory-i18n.ts.
 *
 * The DB stores slugs like "textile", "mechanical", "electrical" but the
 * i18n dictionary uses different keys ("textiles", "machinery", etc.).
 * This mapping bridges the gap so category names are always translated.
 */
const SLUG_TO_I18N_KEY: Record<string, string> = {
  food: "food",
  textile: "textiles",
  textiles: "textiles",
  construction: "construction",
  mechanical: "machinery",
  machinery: "machinery",
  chemical: "chemicals",
  chemicals: "chemicals",
  electrical: "electrical",
  handicrafts: "handicrafts",
  cosmetics: "cosmetics",
  leather: "leather",
};

/**
 * Returns the translated category name for a given DB slug and language.
 * Falls back to the raw DB name when no i18n mapping exists.
 */

/**
 * Returns the first 5 translated category names for a given language.
 * Used by the hero section quick-search tags.
 */
export function getPopularTerms(lang: Lang): string[] {
  return CATEGORY_KEYS.slice(0, 5).map((key) => {
    const categories = directoryT[lang].categories as Record<string, string>;
    return categories[key] ?? key;
  });
}

export function getCategoryName(
  slug: string,
  lang: Lang,
  dbName?: string | null,
): string {
  const i18nKey = SLUG_TO_I18N_KEY[slug];
  if (i18nKey) {
    const categories = directoryT[lang].categories as Record<string, string>;
    const translated = categories[i18nKey];
    if (translated) return translated;
  }
  // Fallback: use DB name if available, otherwise capitalise the slug
  if (dbName) return dbName;
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}
