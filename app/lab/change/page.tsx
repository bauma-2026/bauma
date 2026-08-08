import type { Metadata } from "next";

import ChangeSection from "@/components/home/change/ChangeSection";

export const metadata: Metadata = {
  title: "BAUMA Lab — Kaj se spremeni (Change Study)",
  robots: { index: false, follow: false },
};

/**
 * Reference route for the A01→A02→A03 Change spatial study.
 * Not part of the production homepage.
 */
export default function ChangeStudyPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <div className="border-b border-white/10 px-5 py-4 font-mono text-[11px] text-white/45">
        Lab reference — Change study (not on production homepage)
      </div>
      <ChangeSection />
    </main>
  );
}
