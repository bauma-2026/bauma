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
  title: "Bauma — Jasna struktura. Več odločitev.",
  description:
    "Postavim strukturo, ki uporabnika vodi do jasne odločitve — brez odvečnega šuma.",
  metadataBase: new URL("https://bauma.si"),

  applicationName: "Bauma",
  creator: "Bauma — structure-first digital products",

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
      "Struktura, ki uporabnika vodi od razumevanja do odločitve.",
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
      <body className="min-h-screen font-sans bg-[#080808] text-white">
        {/* subtle background layer */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[#080808]" />
        </div>

       {children}
      </body>
    </html>
  );
}