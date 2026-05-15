import type { Metadata } from "next";

import MiniHeader from "./components/blocks/mini/MiniHeader";
import MiniHero from "./components/blocks/mini/MiniHero";
import MiniDecisionFlow from "./components/blocks/mini/MiniDecisionFlow";
import PristopSection from "./components/blocks/mini/PristopSection";
import SystemGraphic from "./components/blocks/mini/SystemGraphic";
import MiniFinalCTA from "./components/blocks/mini/MiniFinalCTA";
import MiniFooter from "./components/blocks/mini/MiniFooter";

export const metadata: Metadata = {
  title: "Bauma — Jasna struktura. Več odločitev.",
  description:
    "Spletne strani postavim tako, da uporabnik hitreje razume, zaupa in naredi naslednji korak.",
  alternates: {
    canonical: "https://bauma.si",
  },
  openGraph: {
    title: "Bauma — Jasna struktura. Več odločitev.",
    description:
      "Spletne strani postavim tako, da uporabnik hitreje razume, zaupa in naredi naslednji korak.",
    url: "https://bauma.si",
    siteName: "Bauma",
    type: "website",
    locale: "sl_SI",
  },
};

export default function Home() {
  return (
    <>
      <MiniHeader />
      <MiniHero />
      <MiniDecisionFlow />
      <PristopSection />
      <SystemGraphic />
      <MiniFinalCTA />
      <MiniFooter />
    </>
  );
}