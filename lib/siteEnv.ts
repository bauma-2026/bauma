/**
 * Two independent switches, both read when Next loads this module at build time
 * (a later `next start` does not recompute them):
 *
 * - `isIndexable` — the single indexing decision. True only for an explicitly
 *   production build: `SITE_ENV=production` AND `VERCEL_ENV=production`. Staging
 *   (which also runs with `VERCEL_ENV=production`), previews, local builds and a
 *   missing or mistyped `SITE_ENV` are all non-indexable. robots meta, the
 *   `X-Robots-Tag` header, robots.txt, the sitemap, canonical, hreflang and
 *   `og:url` all follow this one value (see `lib/indexing.ts`).
 * - `isStaging` — route access only (TECH-004): staging redirects `/lab/*` to `/`
 *   instead of closing the development routes. It does not decide indexing.
 */
export const isIndexable =
  process.env.SITE_ENV === "production" &&
  process.env.VERCEL_ENV === "production";

/** Staging flag for the separate `bauma-v3-staging` Vercel project: `SITE_ENV=staging` exactly. */
export const isStaging = process.env.SITE_ENV === "staging";
