import type { Metadata } from "next";
import { Suspense } from "react";

import ContactCohesionClient from "./ContactCohesionClient";

export const metadata: Metadata = {
  title: "BAUMA Lab — Contact Cohesion",
  robots: { index: false, follow: false },
};

/**
 * Temporary review route:
 * /lab/contact-cohesion?variant=A|B|C&email=1|0
 *
 * Production homepage Contact remains MiniFinalCTA (unchanged).
 */
export default function ContactCohesionPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#080808] px-5 py-8 font-mono text-[11px] text-white/45">
          Loading Contact cohesion…
        </main>
      }
    >
      <ContactCohesionClient />
    </Suspense>
  );
}
