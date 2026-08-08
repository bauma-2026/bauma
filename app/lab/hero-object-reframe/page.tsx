import type { Metadata } from "next";

import HeroObjectReframeReference from "@/components/lab/hero-object-reframe/HeroObjectReframeReference";
import type { LabSearchParams } from "@/components/lab/hero-object-reframe/labSearchParams";

export const metadata: Metadata = {
  title: "BAUMA Lab — Hero Object Reframe (Edge Context Reference)",
  robots: {
    index: false,
    follow: false,
  },
};

type PageProps = {
  searchParams: Promise<LabSearchParams>;
};

export default async function HeroObjectReframePage({ searchParams }: PageProps) {
  const initialSearchParams = await searchParams;
  return (
    <HeroObjectReframeReference initialSearchParams={initialSearchParams} />
  );
}
