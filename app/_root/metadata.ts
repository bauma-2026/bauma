import type { Metadata } from "next";
import { ROOT_OPEN_GRAPH } from "@/lib/indexing";

/**
 * Site-wide default metadata, previously the single root layout's. Every root layout and `app/global-not-found.tsx`
 * starts from it, so each subtree inherits the same defaults it did under one root: the EN root and the lab root spread it
 * and then override only what they set themselves.
 */
export const ROOT_METADATA: Metadata = {
  title: "Bauma — Jasna struktura. Več odločitev.",
  description:
    "Spletne strani za podjetja, ki imajo dobro ponudbo, a se to na njihovi strani ne vidi.",
  metadataBase: new URL("https://bauma.si"),

  applicationName: "Bauma",
  creator: "Bauma",

  icons: {
    icon: [
      { url: "/favicon.ico?v=4" },
      { url: "/favicon.svg?v=4", type: "image/svg+xml" },
      { url: "/favicon-32x32.png?v=4", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png?v=4", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=4", sizes: "180x180" }],
  },

  manifest: "/site.webmanifest?v=4",

  // No `url` here: a page-level og:url must match that page's own canonical (see `lib/indexing.ts`).
  openGraph: { ...ROOT_OPEN_GRAPH },

  twitter: {
    card: "summary_large_image",
    title: "Bauma — Jasna struktura. Več odločitev.",
    description:
      "Spletne strani za podjetja, ki imajo dobro ponudbo, a se to na njihovi strani ne vidi.",
    images: ["/og/bauma-og-v3.png"],
  },

  // Default: non-indexable. Only the 11 paths in `lib/indexing.ts` opt into index,follow, and only in an explicit production build.
  robots: { index: false, follow: false },
};
