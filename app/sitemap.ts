import type { MetadataRoute } from "next";
import { isIndexable } from "@/lib/siteEnv";
import { ROUTE_PAIRS } from "@/lib/i18n/routes";
import { canonicalUrl, hreflangAlternates, isIndexablePath } from "@/lib/indexing";

/**
 * Production only: the ten Slovenian/English pairs, both pages of each, from the live route pairs in
 * `lib/i18n/routes.ts` (the same source as the language switch and the pages' hreflang). A pair is listed only when both
 * pages are indexable (`lib/indexing.ts`), so legal pages, /approach, /contact, /novice and lab/preview routes are not.
 * Each entry carries the same sl, en and x-default alternates as its page (`hreflangAlternates`).
 * No `lastmod`: there is no reliable content-change date, and the build time is not one.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Every non-production environment publishes an empty sitemap.
  if (!isIndexable) return [];

  return ROUTE_PAIRS.flatMap((pair) => {
    if (!pair.live || !isIndexablePath(pair.sl) || !isIndexablePath(pair.en)) return [];
    const languages = hreflangAlternates(pair.sl);
    if (!languages) return [];
    return [pair.sl, pair.en].map((path) => ({ url: canonicalUrl(path), alternates: { languages } }));
  });
}
