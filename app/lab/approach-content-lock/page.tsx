import type { Metadata } from "next";
import { Suspense } from "react";

import ApproachContentLockClient from "./ApproachContentLockClient";

export const metadata: Metadata = {
  title: "BAUMA Lab — Approach Content Lock",
  robots: { index: false, follow: false },
};

/**
 * Temporary review route:
 * /lab/approach-content-lock?variant=A|B|C
 * Same Approach object + layout; copy only differs.
 */
export default function ApproachContentLockPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#080808] px-5 py-8 font-mono text-[11px] text-white/45">
          Loading Approach content lock…
        </main>
      }
    >
      <ApproachContentLockClient />
    </Suspense>
  );
}
