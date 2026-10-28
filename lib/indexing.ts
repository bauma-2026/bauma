import type { Metadata } from "next";
import { ROUTE_PAIRS } from "./i18n/routes";
import { isIndexable } from "./siteEnv";

export const SITE_ORIGIN = "https://bauma.si";

/**
 * The URLs that are indexable in production and listed in the sitemap, in sitemap order (`app/sitemap.ts`).
 * Legal pages, /approach, /contact, /novice and every lab/preview route stay noindex.
 */
export const INDEXABLE_PATHS = [
  "/",
  "/pristop",
  "/work",
  "/work/flexido",
  "/work/odstrani-tattoo",
  "/work/dema-plus",
  "/work/ulterior",
  "/work/artbite",
  "/work/hardshelljacket",
  "/o-nas",
  "/en",
] as const;

/**
 * The English counterparts of the Slovenian main pages (besides `/en`), indexable in production. They opt in only when
 * their page uses `indexing()` / `pageMetadata()` (EN-006b); until then the EN layout keeps them noindex. They join the
 * sitemap in EN-006c.
 */
export const EN_INDEXABLE_PATHS = [
  "/en/approach",
  "/en/work",
  "/en/about",
  "/en/work/odstrani-tattoo",
  "/en/work/hardshelljacket",
  "/en/work/artbite",
  "/en/work/dema-plus",
  "/en/work/flexido",
  "/en/work/ulterior",
] as const;

export type IndexablePath = (typeof INDEXABLE_PATHS)[number] | (typeof EN_INDEXABLE_PATHS)[number];

const INDEXABLE: ReadonlySet<string> = new Set<string>([...INDEXABLE_PATHS, ...EN_INDEXABLE_PATHS]);

export function canonicalUrl(path: IndexablePath): string {
  return path === "/" ? SITE_ORIGIN : `${SITE_ORIGIN}${path}`;
}

/**
 * hreflang for `path`, from the live route pairs in `lib/i18n/routes.ts` (the same pairs as the language switch): the
 * Slovenian and English URL and `x-default` (the Slovenian one). Only when both pages of the pair are indexable, so a
 * noindex page (legal, legacy, preview) never gets or receives an alternate. Insertion order sl, en, x-default.
 */
export function hreflangAlternates(path: IndexablePath): Record<string, string> | undefined {
  const pair = ROUTE_PAIRS.find((p) => p.live && (p.sl === path || p.en === path));
  if (!pair || !INDEXABLE.has(pair.sl) || !INDEXABLE.has(pair.en)) return undefined;
  const sl = canonicalUrl(pair.sl as IndexablePath);
  return { sl, en: canonicalUrl(pair.en as IndexablePath), "x-default": sl };
}

/**
 * robots + canonical + hreflang for an indexable page.
 * Outside an explicit production build: noindex and nothing that advertises production.
 */
export function indexing(path: IndexablePath): Pick<Metadata, "robots" | "alternates"> {
  if (!isIndexable) return { robots: { index: false, follow: false } };
  const languages = hreflangAlternates(path);
  return {
    robots: { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl(path),
      ...(languages ? { languages } : {}),
    },
  };
}

/** `og:url` only when the page is indexable. */
export function ogUrl(path: IndexablePath): { url?: string } {
  return isIndexable ? { url: canonicalUrl(path) } : {};
}

/** The root layout's Open Graph block, reused by indexable pages that do not define their own. */
export const ROOT_OPEN_GRAPH = {
  title: "Bauma — Jasna struktura. Več odločitev.",
  description:
    "Spletne strani za podjetja, ki imajo dobro ponudbo, a se to na njihovi strani ne vidi.",
  siteName: "Bauma",
  images: [
    {
      url: "/og/bauma-og-v3.png",
      width: 1200,
      height: 630,
      alt: "Bauma — Jasna struktura. Več odločitev.",
    },
  ],
  locale: "sl_SI",
  type: "website" as const,
};

/**
 * Slovenian social image (Open Graph and Twitter) for the ten main Slovenian pages.
 * It is deliberately separate from `ROOT_OPEN_GRAPH`, which stays on the previous image and text for every page
 * that does not opt in (legal pages, EN, old routes, 404). `metadataBase` makes the url absolute.
 */
export const SL_SOCIAL_IMAGE = {
  url: "/og/bauma-og-main-v3.png",
  width: 1200,
  height: 630,
  alt: "Bauma — Spletne strani, ki pomagajo pridobivati stranke.",
};

/** The social image and `og:locale` of a page's language; each language passes its own (`slPageMetadata` below). */
export type SocialImage = { url: string; width: number; height: number; alt: string };

/**
 * Complete metadata of an indexable page in either language: title, description, robots, canonical + hreflang
 * (`indexing()`), and the same title and description for Open Graph and Twitter (`summary_large_image`) with the given
 * social image and `og:locale`. `title` is the final string (no template); `og:url` follows `ogUrl()`.
 */
export function pageMetadata(
  path: IndexablePath,
  copy: { title: string; description: string },
  social: { image: SocialImage; locale: "sl_SI" | "en_US" },
): Metadata {
  const { title, description } = copy;
  return {
    title,
    description,
    ...indexing(path),
    openGraph: {
      title,
      description,
      ...ogUrl(path),
      siteName: "Bauma",
      images: [social.image],
      locale: social.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: social.image.url, alt: social.image.alt }],
    },
  };
}

/** One of the main Slovenian pages: `pageMetadata` with the Slovenian social image. */
export function slPageMetadata(path: IndexablePath, copy: { title: string; description: string }): Metadata {
  return pageMetadata(path, copy, { image: SL_SOCIAL_IMAGE, locale: "sl_SI" });
}

/**
 * English social image (Open Graph and Twitter) of the ten English main pages. Interim: the existing English image (the
 * EN layout's default); an English counterpart of `SL_SOCIAL_IMAGE` follows in a separate pass.
 */
export const EN_SOCIAL_IMAGE: SocialImage = {
  url: "/og/bauma-og-en-v3.png",
  width: 1200,
  height: 630,
  alt: "Bauma — Clear structure. Better decisions.",
};

/** One of the English main pages: `pageMetadata` with the English social image. */
export function enPageMetadata(path: IndexablePath, copy: { title: string; description: string }): Metadata {
  return pageMetadata(path, copy, { image: EN_SOCIAL_IMAGE, locale: "en_US" });
}
