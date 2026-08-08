import type { Metadata } from "next";

import HeroFinalQualityStudy from "@/components/lab/hero-final-quality-pass/HeroFinalQualityStudy";

export const metadata: Metadata = {
  title: "BAUMA Lab — Hero Final Quality Pass",
  robots: {
    index: false,
    follow: false,
  },
};

export default function HeroFinalQualityPassPage() {
  return <HeroFinalQualityStudy />;
}
