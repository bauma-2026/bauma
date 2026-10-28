import type { Metadata } from "next";
import RootDocument from "@/app/_root/RootDocument";
import { ROOT_METADATA } from "@/app/_root/metadata";

/**
 * English root layout for `/en` and everything below it, so the served document is `<html lang="en">` (EN-001).
 * It starts from the site-wide defaults (icons, manifest, …) it used to inherit from the single root layout and
 * overrides the same fields as before. Switching to or from a Slovenian page is a full page load.
 */
export const metadata: Metadata = {
  ...ROOT_METADATA,
  metadataBase: new URL("https://bauma.si"),

  title: "Bauma — Clear structure. Better decisions.",
  description:
    "Websites for companies with a strong offer that their current site doesn’t communicate clearly.",

  /**
   * Default for the EN subtree: noindex.
   * `/en` homepage opts into index,follow via route-owned metadata (production only).
   * Do not remove this default — it protects about/legal/internal EN routes.
   */
  robots: { index: false, follow: false },

  openGraph: {
    title: "Bauma — Clear structure. Better decisions.",
    description:
      "Websites for companies with a strong offer that their current site doesn’t communicate clearly.",
    siteName: "Bauma",
    images: [
      {
        url: "/og/bauma-og-en-v3.png",
        width: 1200,
        height: 630,
        alt: "Bauma — Clear structure. Better decisions.",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Bauma — Clear structure. Better decisions.",
    description:
      "Websites for companies with a strong offer that their current site doesn’t communicate clearly.",
    images: ["/og/bauma-og-en-v3.png"],
  },
};

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
