import type { Metadata } from "next";

import ProofBridgeReview from "@/components/lab/home-proof-bridge/ProofBridgeReview";

export const metadata: Metadata = {
  title: "BAUMA — Home Proof Bridge Layout Study 01",
  robots: {
    index: false,
    follow: false,
  },
};

export default function HomeProofBridgePage() {
  return <ProofBridgeReview />;
}
