import "@/app/globals.css";
import { Inter, DM_Serif_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { HASH_LANDING_SCRIPT } from "@/lib/hashLandingScript";

/**
 * The one <html> document for every root layout: `app/(sl)/layout.tsx` (lang "sl"), `app/en/layout.tsx` (lang "en"),
 * `app/lab/layout.tsx` (lang "sl") and `app/global-not-found.tsx`. Each subtree needs its own root layout so `/en`
 * serves `<html lang="en">` (EN-001); the fonts, global styles, landing script and analytics are declared here once so
 * every root renders the same document.
 */

/**
 * latin-ext covers Slovenian č/š/ž in the same next/font preload path as latin.
 *
 * `axes: ["opsz"]` adds Inter's optical-size axis (14..32, default 14). It is inert everywhere unless a rule opts in:
 * `globals.css` pins `font-optical-sizing: none` on `html` (= the previous opsz 14 rendering) and only the homepage
 * headings re-enable it (`app/homeTypography.css`). Lab reference: /lab/typography-foundation.
 */
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

/** `style` loads the genuine italic (the Hero emphasis was a browser-slanted roman before). */
const dmSerif = DM_Serif_Display({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
  preload: true,
});

export default function RootDocument({
  lang,
  children,
}: {
  lang: "sl" | "en";
  children: React.ReactNode;
}) {
  // For those who look beyond the surface. — GB
  return (
    <html lang={lang} className={`${inter.variable} ${dmSerif.variable}`}>
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
