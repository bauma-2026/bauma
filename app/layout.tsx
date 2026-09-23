import "./globals.css";
import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { HASH_LANDING_SCRIPT } from "@/lib/hashLandingScript";

/** latin-ext covers Slovenian č/š/ž in the same next/font preload path as latin. */
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-serif",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Bauma — Jasna struktura. Več odločitev.",
  description:
    "Spletne strani postavim tako, da uporabnik hitreje razume, zaupa in naredi naslednji korak.",
  metadataBase: new URL("https://bauma.si"),

  applicationName: "Bauma",
  creator: "Bauma — Structure-first websites",

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

  openGraph: {
    title: "Bauma — Jasna struktura. Več odločitev.",
    description:
      "Spletne strani postavim tako, da uporabnik hitreje razume, zaupa in naredi naslednji korak.",
    url: "https://bauma.si",
    siteName: "Bauma",
    images: [
      {
        url: "/og/bauma-og.png",
        width: 1200,
        height: 630,
        alt: "Bauma — Jasna struktura. Več odločitev.",
      },
    ],
    locale: "sl_SI",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Bauma — Jasna struktura. Več odločitev.",
    description:
      "Spletne strani postavim tako, da uporabnik hitreje razume, zaupa in naredi naslednji korak.",
    images: ["/og/bauma-og.png"],
  },

  // Default: non-indexable. Only `/` opts into index,follow in production.
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sl" className={`${inter.variable} ${dmSerif.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: HASH_LANDING_SCRIPT }} />
      </head>
      <body className="min-h-screen font-sans bg-[#080808] text-white">
        {/* subtle background layer */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[#080808]" />
        </div>

        {children}

        <Analytics />
      </body>
    </html>
  );
}