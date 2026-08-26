import type { Metadata } from "next";

import MiniHeader from "./components/blocks/mini/MiniHeader";
import MiniHero from "./components/blocks/mini/MiniHero";
import MiniDecisionFlow from "./components/blocks/mini/MiniDecisionFlow";
import ApproachSection from "@/components/home/approach/ApproachSection";
import SystemGraphic from "./components/blocks/mini/SystemGraphic";
import MiniMidPageCta from "./components/blocks/mini/MiniMidPageCta";
import MiniPerceptionLayer from "./components/blocks/mini/MiniPerceptionLayer";
import MiniClosingBookend from "./components/blocks/mini/MiniClosingBookend";
import RightObjectAxisDebugGate from "@/components/home/debug/RightObjectAxisDebugGate";

const isProduction = process.env.VERCEL_ENV === "production";

/**
 * Launch indexing: `/` and `/en` only, and only on Vercel production.
 * Env gate: VERCEL_ENV === "production"
 */
export const metadata: Metadata = {
  alternates: {
    canonical: "https://bauma.si",
    languages: {
      sl: "https://bauma.si",
      en: "https://bauma.si/en",
      "x-default": "https://bauma.si",
    },
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
        <MiniHero />
        <MiniDecisionFlow />
        <ApproachSection />
        <SystemGraphic />
        <MiniMidPageCta />
        <MiniPerceptionLayer />
      </main>

      <MiniClosingBookend />
      {/* ?axis=1 only — module loads only when that query is present */}
      <RightObjectAxisDebugGate />
    </>
  );
}
