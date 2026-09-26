import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://bauma.si"),

  title: "Bauma — Clear structure. Better decisions.",
  description:
    "Websites for companies with a strong offer that their current site doesn’t communicate clearly.",

  /**
   * Default for the EN subtree: noindex.
   * `/en` homepage opts into index,follow via route-owned metadata.
   * Do not remove this default — it protects about/legal/internal EN routes.
   */
  robots: { index: false, follow: false },

  openGraph: {
    title: "Bauma — Clear structure. Better decisions.",
    description:
      "Websites for companies with a strong offer that their current site doesn’t communicate clearly.",
    url: "https://bauma.si/en",
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
  return <div lang="en" className="contents">{children}</div>;
}
