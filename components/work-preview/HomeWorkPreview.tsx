"use client";

import { Suspense } from "react";

import WorkBridge from "./WorkBridge";
import WorkPreviewModal from "./WorkPreviewModal";
import { WorkPreviewProvider } from "./WorkPreviewProvider";

export default function HomeWorkPreview() {
  return (
    <Suspense fallback={null}>
      <WorkPreviewProvider>
        <WorkBridge />
        <WorkPreviewModal />
      </WorkPreviewProvider>
    </Suspense>
  );
}
