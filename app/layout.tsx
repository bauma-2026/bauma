import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

const isProduction = process.env.VERCEL_ENV === "production";

export const metadata: Metadata = {
  title: "Bauma — Digital Studio",
  description:
    "Bauma is a small digital studio building structured, calm and fast Next.js experiences — from blueprint to build.",
  metadataBase: new URL("https://bauma.si"),

  icons: {
    icon: "/favicon.svg",
  },

  openGraph: {
    title: "Bauma — Digital Studio",
    description:
      "Structured, calm and fast digital experiences. Blueprint → Design → Build.",
    url: "https://bauma.si",
    siteName: "Bauma",
    type: "website",
  },

  robots: isProduction
    ? {
        index: true,
        follow: true,
      }
    : {
        index: false,
        follow: false,
      },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sl">
      <body className={`${inter.className} min-h-screen text-neutral-900`}>
        
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