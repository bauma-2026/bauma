import MiniHeader from "../components/blocks/mini/MiniHeader";
import MiniHero from "../components/blocks/mini/MiniHero";
import MiniDecisionFlow from "../components/blocks/mini/MiniDecisionFlow";
import PristopSection from "../components/blocks/mini/PristopSection";
import SystemGraphic from "../components/blocks/mini/SystemGraphic";
import FinalCTA from "../components/blocks/home/FinalCTA";
import MiniFooter from "../components/blocks/mini/MiniFooter";
import MiniFinalCTA from "../components/blocks/mini/MiniFinalCTA";


export default function MiniHome() {
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