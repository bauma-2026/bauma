import "./globals.css";
import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";

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
  title: "Bauma — Digitalni studio",
  description:
    "Strukturiram in postavim digitalne produkte, ki so jasni, hitri in pripravljeni za rast.",
  metadataBase: new URL("https://bauma.si"),

  applicationName: "Bauma",
  creator: "Bauma — built with structure in mind",

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },

  manifest: "/site.webmanifest",

  openGraph: {
    title: "Bauma — Digitalni studio",
    description:
      "Strukturirani, hitri in jasni digitalni produkti. Zasnova → Dizajn → Izvedba.",
    url: "https://bauma.si",
    siteName: "Bauma",
    type: "website",
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
      <body className="min-h-screen font-sans text-neutral-900">
        {/* background vignette */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0" />
        </div>

        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}