import MiniHeader from "../components/blocks/mini/MiniHeader";
import MiniHero from "../components/blocks/mini/MiniHero";
import MiniDecisionFlow from "../components/blocks/mini/MiniDecisionFlow";
import ApproachSection from "@/components/home/approach/ApproachSection";
import SystemGraphic from "../components/blocks/mini/SystemGraphic";
import MiniPerceptionLayer from "../components/blocks/mini/MiniPerceptionLayer";
import HomeWorkPreview from "@/components/work-preview/HomeWorkPreview";
import MiniFinalCTA from "../components/blocks/mini/MiniFinalCTA";
import MiniFooter from "../components/blocks/mini/MiniFooter";

import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function MiniHome() {
  return (
    <>
      <MiniHeader />

      <main>
        <MiniHero />
        <MiniDecisionFlow />
        <ApproachSection />
        <SystemGraphic />
        <MiniPerceptionLayer />
        <HomeWorkPreview />
        <MiniFinalCTA />
      </main>
      <MiniFooter />
    </>
  );
}
