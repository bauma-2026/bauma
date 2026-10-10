import type { Metadata } from "next";

import MiniHeader from "./components/blocks/mini/MiniHeader";
import MiniHero, { type MiniHeroCopy } from "./components/blocks/mini/MiniHero";
import MiniDecisionFlow from "./components/blocks/mini/MiniDecisionFlow";
import ApproachSection from "@/components/home/approach/ApproachSection";
import SystemGraphic from "./components/blocks/mini/SystemGraphic";
import MiniPerceptionLayer from "./components/blocks/mini/MiniPerceptionLayer";
import MiniClosingBookend from "./components/blocks/mini/MiniClosingBookend";
import RightObjectAxisDebugGate from "@/components/home/debug/RightObjectAxisDebugGate";

const isProduction = process.env.VERCEL_ENV === "production";

const HOME_HERO: MiniHeroCopy = {
  headline: "Spletne strani, ki pomagajo pridobivati stranke.",
  support: "Od jasne strukture in vsebine do oblikovanja, razvoja in objave.",
  secondaryCta: "Poglejte pristop",
  primaryCta: "Opišite projekt",
};

const HOME_TITLE = "Bauma — Spletne strani, ki pomagajo pridobivati stranke.";
const HOME_DESCRIPTION =
  "Spletne strani, ki pomagajo pridobivati stranke. Od jasne strukture in vsebine do oblikovanja, razvoja in objave.";

/**
 * Launch indexing: `/` and `/en` only, and only on Vercel production.
 * Env gate: VERCEL_ENV === "production"
 */
export const metadata: Metadata = {
  // Page-level so only `/` changes; routes that inherit the root layout
  // (e.g. `/mini`) keep their current tags.
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: {
    canonical: "https://bauma.si",
    languages: {
      sl: "https://bauma.si",
      en: "https://bauma.si/en",
      "x-default": "https://bauma.si",
    },
  },
  // `openGraph` / `twitter` replace the root layout's objects, so the
  // unchanged image fields are restated. The OG image itself still shows
  // the previous tagline (not regenerated in this pass), so its alt text
  // keeps describing what the image actually says.
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: "https://bauma.si",
    siteName: "Bauma",
    images: [
      {
        url: "/og/bauma-og-v3.png",
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
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ["/og/bauma-og-v3.png"],
  },
  robots: isProduction
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

/**
 * Launch homepage flow (Proof / Work Bridge deferred).
 * Reactivate later via: import HomeWorkPreview from "@/components/work-preview/HomeWorkPreview"
 * and render <HomeWorkPreview /> between Visual Layer and Contact.
 */
export default function Home() {
  return (
    <>
      <MiniHeader />

      <main>
        <MiniHero copy={HOME_HERO} />
        <MiniDecisionFlow />
        <ApproachSection />
        <SystemGraphic />
        <MiniPerceptionLayer />
      </main>

      <MiniClosingBookend />
      {/* ?axis=1 only — module loads only when that query is present */}
      <RightObjectAxisDebugGate />
    </>
  );
}
