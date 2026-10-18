import MiniPalette from "../components/blocks/mini/MiniPalette";
import MiniHeader from "../components/blocks/mini/MiniHeader";
import MiniHero from "../components/blocks/mini/MiniHero";
import SystemGraphic from "../components/blocks/mini/SystemGraphic";
import MiniFlexidoProofSection from "../components/blocks/mini/MiniFlexidoProofSection";
import { MINI_HERO } from "../components/blocks/mini/miniHomeCopy";
import MiniMidPageCta from "../components/blocks/mini/MiniMidPageCta";
import MiniPerceptionLayer from "../components/blocks/mini/MiniPerceptionLayer";
import HomeWorkPreview from "@/components/work-preview/HomeWorkPreview";
import MiniClosingBookend from "../components/blocks/mini/MiniClosingBookend";
import RightObjectAxisDebugGate from "@/components/home/debug/RightObjectAxisDebugGate";

import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function MiniHome() {
  return (
    <MiniPalette>
      <MiniHeader treatAsHomepage darkHero />

      <main>
        <MiniHero
          copy={MINI_HERO}
          secondaryHref="#system"
          secondaryLabel="Poglejte sistem"
          glowBackground
        />
        <SystemGraphic tone="neutral" joinsNextSection />

        <MiniFlexidoProofSection />

        <MiniMidPageCta tone="neutral" />
        <MiniPerceptionLayer tone="neutral" />
        <HomeWorkPreview />
      </main>
      <MiniClosingBookend variant="royal" />
      {/* ?axis=1 only — module loads only when that query is present */}
      <RightObjectAxisDebugGate />
    </MiniPalette>
  );
}
