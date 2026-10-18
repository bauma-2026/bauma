"use client";

import { Suspense } from "react";

import WorkBridge from "./WorkBridge";
import WorkPreviewModal from "./WorkPreviewModal";
import { WorkPreviewProvider } from "./WorkPreviewProvider";

export default function HomeWorkPreview({
  locale = "sl",
}: {
  /** Production callers never pass this — default keeps existing SL output. */
  locale?: "sl" | "en";
}) {
  return (
    <Suspense fallback={null}>
      <WorkPreviewProvider>
        <WorkBridge locale={locale} />
        <WorkPreviewModal locale={locale} />
      </WorkPreviewProvider>
    </Suspense>
  );
}
