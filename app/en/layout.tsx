import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://bauma.si"),

  title: "Bauma — Clear structure. Better decisions.",
  description:
    "I structure websites so users understand faster, trust more easily, and take the next step with less friction.",

  /**
   * Default for the EN subtree: noindex.
   * `/en` homepage opts into index,follow via route-owned metadata.
   * Do not remove this default — it protects about/legal/internal EN routes.
   */
  robots: { index: false, follow: false },

  openGraph: {
    title: "Bauma — Clear structure. Better decisions.",
    description:
      "I structure websites so users understand faster, trust more easily, and take the next step with less friction.",
    url: "https://bauma.si/en",
    siteName: "Bauma",
    images: [
      {
        url: "/og/bauma-og.png",
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
      "I structure websites so users understand faster, trust more easily, and take the next step with less friction.",
    images: ["/og/bauma-og.png"],
  },
};

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div lang="en" className="contents">{children}</div>;
}
