import type { Metadata } from "next";

import MiniHeader from "../components/blocks/mini/MiniHeader";
import MiniHero from "../components/blocks/mini/MiniHero";
import MiniDecisionFlow from "../components/blocks/mini/MiniDecisionFlow";
import ApproachSection from "@/components/home/approach/ApproachSection";
import SystemGraphic from "../components/blocks/mini/SystemGraphic";
import MiniPerceptionLayer from "../components/blocks/mini/MiniPerceptionLayer";
import MiniClosingBookend from "../components/blocks/mini/MiniClosingBookend";
import RightObjectAxisDebugGate from "@/components/home/debug/RightObjectAxisDebugGate";
import {
  EN_APPROACH,
  EN_CONTACT,
  EN_DECISION_FLOW,
  EN_FOOTER,
  EN_HEADER,
  EN_HERO,
  EN_SYSTEM,
  EN_VISUAL,
} from "@/components/home/copy/enHomepage";

const isProduction = process.env.VERCEL_ENV === "production";

/**
 * EN homepage — structural parity with locked `/`.
 * Route-owned indexing: overrides EN layout default noindex.
 * Only `/` and `/en` are indexable in production.
 */
export const metadata: Metadata = {
  alternates: {
    canonical: "https://bauma.si/en",
    languages: {
      sl: "https://bauma.si",
      en: "https://bauma.si/en",
      "x-default": "https://bauma.si",
    },
  },
  openGraph: {
    url: "https://bauma.si/en",
    siteName: "Bauma",
    images: [
      {
        url: "/og/bauma-og-en-v3.png",
        width: 1200,
        height: 630,
        alt: "Bauma — Clear structure. Better decisions.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: isProduction
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export default function EnglishHome() {
  return (
    <>
      <MiniHeader
        copy={{
          homeHref: "/en",
          langHref: "/",
          langLabel: EN_HEADER.langSwitch,
          langAria: EN_HEADER.langSwitchAria,
          langMobileLabel: EN_HEADER.langSwitchMobile,
          navApproach: EN_HEADER.navApproach,
          navSystem: EN_HEADER.navSystem,
          navContact: EN_HEADER.navContact,
          headerCta: EN_HEADER.headerCta,
          menuOpen: EN_HEADER.menuOpen,
          menuClose: EN_HEADER.menuClose,
        }}
      />

      <main>
        <MiniHero copy={EN_HERO} />
        <MiniDecisionFlow copy={EN_DECISION_FLOW} />
        <ApproachSection copy={EN_APPROACH} />
        <SystemGraphic copy={EN_SYSTEM} />
        <MiniPerceptionLayer copy={EN_VISUAL} />
      </main>

      <MiniClosingBookend
        ctaCopy={EN_CONTACT}
        footerCopy={{
          homeHref: "/en",
          email: EN_FOOTER.email,
          legalAria: EN_FOOTER.legalAria,
          legal: [...EN_FOOTER.legal],
        }}
      />
      <RightObjectAxisDebugGate />
    </>
  );
}
