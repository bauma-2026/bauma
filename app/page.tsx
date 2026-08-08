import type { Metadata } from "next";

import MiniHeader from "./components/blocks/mini/MiniHeader";
import MiniHero from "./components/blocks/mini/MiniHero";
import MiniDecisionFlow from "./components/blocks/mini/MiniDecisionFlow";
import ApproachSection from "@/components/home/approach/ApproachSection";
import SystemGraphic from "./components/blocks/mini/SystemGraphic";
import MiniPerceptionLayer from "./components/blocks/mini/MiniPerceptionLayer";
import MiniFinalCTA from "./components/blocks/mini/MiniFinalCTA";
import MiniFooter from "./components/blocks/mini/MiniFooter";
import RightObjectAxisDebugGate from "@/components/home/debug/RightObjectAxisDebugGate";

const isProduction = process.env.VERCEL_ENV === "production";

/**
 * Launch indexing: only `/` is indexable, and only on Vercel production.
 * Env gate: VERCEL_ENV === "production"
 */
export const metadata: Metadata = {
  alternates: {
    canonical: "https://bauma.si",
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
        <MiniPerceptionLayer />
        <MiniFinalCTA />
      </main>

      <MiniFooter />
      {/* ?axis=1 only — module loads only when that query is present */}
      <RightObjectAxisDebugGate />
    </>
  );
}
