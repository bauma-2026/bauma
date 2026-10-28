import type { Metadata } from "next";
import { isIndexable } from "./siteEnv";

export const SITE_ORIGIN = "https://bauma.si";

/**
 * The only URLs that are indexable in production, in sitemap order.
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

export type IndexablePath = (typeof INDEXABLE_PATHS)[number];

export function canonicalUrl(path: IndexablePath): string {
  return path === "/" ? SITE_ORIGIN : `${SITE_ORIGIN}${path}`;
}

/**
 * robots + canonical (+ hreflang) for an indexable page.
 * Outside an explicit production build: noindex and nothing that advertises production.
 */
export function indexing(
  path: IndexablePath,
  languages?: Record<string, string>,
): Pick<Metadata, "robots" | "alternates"> {
  if (!isIndexable) return { robots: { index: false, follow: false } };
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

/**
 * Complete metadata of one of the main Slovenian pages: title, description, robots, canonical (+ hreflang),
 * and the same title and description for Open Graph and Twitter (`summary_large_image`).
 * `title` is the final string (no template); `og:url` follows `ogUrl()`.
 */
export function slPageMetadata(
  path: IndexablePath,
  copy: { title: string; description: string },
  languages?: Record<string, string>,
): Metadata {
  const { title, description } = copy;
  return {
    title,
    description,
    ...indexing(path, languages),
    openGraph: {
      title,
      description,
      ...ogUrl(path),
      siteName: "Bauma",
      images: [SL_SOCIAL_IMAGE],
      locale: "sl_SI",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: SL_SOCIAL_IMAGE.url, alt: SL_SOCIAL_IMAGE.alt }],
    },
  };
}
