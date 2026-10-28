import type { MetadataRoute } from "next";
import { isIndexable } from "@/lib/siteEnv";
import { INDEXABLE_PATHS, canonicalUrl, SITE_ORIGIN } from "@/lib/indexing";

/**
 * Production only: the indexable URLs from `lib/indexing.ts` (11). Legal pages, /approach,
 * /contact, /novice and lab/preview routes are not listed.
 * No `lastmod`: there is no reliable content-change date, and the build time is not one.
 * The / and /en pair carries its hreflang alternates.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Every non-production environment publishes an empty sitemap.
  if (!isIndexable) return [];

  const languages = { sl: SITE_ORIGIN, en: `${SITE_ORIGIN}/en` };

  return INDEXABLE_PATHS.map((path) => ({
    url: canonicalUrl(path),
    ...(path === "/" || path === "/en" ? { alternates: { languages } } : {}),
  }));
}
