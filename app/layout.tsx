import "./globals.css";
import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
});

const isProduction = process.env.VERCEL_ENV === "production";

export const metadata: Metadata = {
  title: "Bauma — Jasna struktura. Več odločitev.",
  description:
    "Spletne strani postavim tako, da uporabnik hitreje razume, zaupa in naredi naslednji korak.",
  metadataBase: new URL("https://bauma.si"),

  applicationName: "Bauma",
  creator: "Bauma — Structure-first websites",

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: [
      { url: "/favicon.ico?v=2" },
      { url: "/favicon.svg?v=2", type: "image/svg+xml" },
      { url: "/favicon-32x32.png?v=2", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png?v=2", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=2", sizes: "180x180" }],
  },

  manifest: "/site.webmanifest?v=2",

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

  robots: isProduction
    ? { index: true, follow: true }
    : { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sl" className={`${inter.variable} ${dmSerif.variable}`}>
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