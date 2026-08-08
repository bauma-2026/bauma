import type { Metadata } from "next";

import VisualLayerDynamicsClient from "./VisualLayerDynamicsClient";

export const metadata: Metadata = {
  title: "BAUMA Lab — Visual Layer Interaction Dynamics",
  robots: { index: false, follow: false },
};

/**
 * Temporary review:
 * /lab/visual-layer-dynamics
 *
 * Production MiniResponsivePlane / MiniPerceptionLayer unchanged.
 */
export default function VisualLayerDynamicsPage() {
  return <VisualLayerDynamicsClient />;
}
