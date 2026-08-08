import type { Metadata } from "next";
import { Suspense } from "react";

import HeroRealContextPageClient from "./HeroRealContextPageClient";

export const metadata: Metadata = {
  title: "BAUMA Hero Reference",
  robots: {
    index: false,
    follow: false,
  },
};

export default function HeroRealContextPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080808] text-white/40">
          Loading reference…
        </div>
      }
    >
      <HeroRealContextPageClient />
    </Suspense>
  );
}
