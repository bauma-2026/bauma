/**
 * The Slovenian / English route pairs of the site, the single source for the language switch (MiniHeader) and the
 * English primary navigation. Later passes reuse it for hreflang and the sitemap.
 *
 * `live: false` marks an English page that is planned but does not exist yet. It is never linked: the switch from its
 * Slovenian page falls back to the other language's home page, and it does not appear in the English navigation.
 * Set `live: true` in the same change that adds the English page.
 */

export type Locale = "sl" | "en";

type RoutePair = {
  sl: string;
  en: string;
  live: boolean;
  /** Primary navigation item (header) of this pair. `id` is only used for the header's scroll-spy state. */
  nav?: { id: string; sl: string; en: string };
};

/** Same slugs in both languages; keep in step with `CASE_STUDIES` in `app/components/work/CaseStudyNav.tsx`. */
const CASE_STUDY_SLUGS = [
  "flexido",
  "ulterior",
  "odstrani-tattoo",
  "dema-plus",
  "artbite",
  "hardshelljacket",
] as const;

export const ROUTE_PAIRS: readonly RoutePair[] = [
  { sl: "/", en: "/en", live: true },
  { sl: "/pristop", en: "/en/approach", live: false, nav: { id: "pristop", sl: "Pristop", en: "Approach" } },
  { sl: "/work", en: "/en/work", live: false, nav: { id: "work", sl: "Work", en: "Work" } },
  { sl: "/o-nas", en: "/en/about", live: false, nav: { id: "o-nas", sl: "O nas", en: "About" } },
  ...CASE_STUDY_SLUGS.map((slug) => ({ sl: `/work/${slug}`, en: `/en/work/${slug}`, live: false })),
  { sl: "/pogoji-uporabe", en: "/en/terms", live: true },
  { sl: "/zasebnost", en: "/en/privacy", live: true },
  { sl: "/piskotki", en: "/en/cookies", live: true },
];

/**
 * Home-page fragments kept when switching between `/` and `/en`. Each target exists on both home pages under the same
 * id. The Slovenian `#kaj-delamo` has no English section yet; it is paired when the English home page is rebuilt.
 */
const HOME_HASH_PAIRS: readonly { sl: string; en: string }[] = [
  { sl: "#approach", en: "#approach" },
  { sl: "#system", en: "#system" },
  { sl: "#contact", en: "#contact" },
];

function normalize(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

/** Language of a URL path: `/en` and everything below it is English, every other path Slovenian. */
export function localeOfPath(pathname: string): Locale {
  const path = normalize(pathname);
  return path === "/en" || path.startsWith("/en/") ? "en" : "sl";
}

/** The live counterpart of `pathname` in the other language, or `null` when there is none (yet). */
export function counterpartPath(pathname: string): string | null {
  const path = normalize(pathname);
  for (const pair of ROUTE_PAIRS) {
    if (!pair.live) continue;
    if (pair.sl === path) return pair.en;
    if (pair.en === path) return pair.sl;
  }
  return null;
}

/**
 * Language-switch target for `pathname`, without a fragment. Works on the server and the client, so the rendered link
 * is already correct before hydration. Pages without a live counterpart use `fallback` (the other language's home).
 */
export function languageSwitchPath(pathname: string, fallback: string): string {
  return counterpartPath(pathname) ?? fallback;
}

/** Fragment to carry over when switching from `pathname` with `hash`; empty when none applies. */
export function languageSwitchHash(pathname: string, hash: string): string {
  const path = normalize(pathname);
  const from: Locale | null = path === "/" ? "sl" : path === "/en" ? "en" : null;
  if (!from || !hash) return "";
  const pair = HOME_HASH_PAIRS.find((p) => p[from] === hash);
  return pair ? pair[from === "sl" ? "en" : "sl"] : "";
}

/** English primary navigation: only pairs whose English page is live. Empty until those pages exist. */
export const EN_PRIMARY_NAV: { href: string; label: string; id: string }[] = ROUTE_PAIRS.filter(
  (pair) => pair.live && pair.nav,
).map((pair) => ({ href: pair.en, label: pair.nav!.en, id: pair.nav!.id }));
