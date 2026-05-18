import MiniHeader from "./components/blocks/mini/MiniHeader";
import MiniHero from "./components/blocks/mini/MiniHero";
import MiniDecisionFlow from "./components/blocks/mini/MiniDecisionFlow";
import PristopSection from "./components/blocks/mini/PristopSection";
import SystemGraphic from "./components/blocks/mini/SystemGraphic";
import MiniPerceptionLayer from "./components/blocks/mini/MiniPerceptionLayer";
import MiniFinalCTA from "./components/blocks/mini/MiniFinalCTA";
import MiniFooter from "./components/blocks/mini/MiniFooter";


export default function Home() {
  return (
    <>
      <MiniHeader />

      <main>
        <MiniHero />
        <MiniDecisionFlow />
        <PristopSection />
        <SystemGraphic />
        <MiniPerceptionLayer />
        <MiniFinalCTA />
      
      </main>

      <MiniFooter />
    </>
  );
}