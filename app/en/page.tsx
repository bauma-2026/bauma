import MiniHeaderEn from "../components/blocks/mini/MiniHeaderEn";
import MiniHeroEn from "../components/blocks/mini/MiniHeroEn";
import MiniDecisionFlowEn from "../components/blocks/mini/MiniDecisionFlowEn";
import ApproachSectionEn from "../components/blocks/mini/ApproachSectionEn";
import SystemGraphicEn from "../components/blocks/mini/SystemGraphicEn";
import MiniPerceptionLayerEn from "../components/blocks/mini/MiniPerceptionLayerEn";
import MiniFinalCTAEn from "../components/blocks/mini/MiniFinalCTAEn";
import MiniFooterEn from "../components/blocks/mini/MiniFooterEn";

export default function EnglishHome() {
  return (
    <>
      <MiniHeaderEn />

      <main>
        <MiniHeroEn />
        <MiniDecisionFlowEn />
        <ApproachSectionEn />
        <SystemGraphicEn />
        <MiniPerceptionLayerEn />
        <MiniFinalCTAEn />
      </main>

      <MiniFooterEn />
    </>
  );
}