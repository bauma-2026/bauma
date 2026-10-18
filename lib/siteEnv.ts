/**
 * Staging flag for the separate `bauma-v3-staging` Vercel project.
 *
 * That project also runs with `VERCEL_ENV=production`, so staging is identified
 * only by the explicit `SITE_ENV=staging`. Unset (or any other value) keeps the
 * production behavior unchanged.
 */
export const isStaging = process.env.SITE_ENV === "staging";
