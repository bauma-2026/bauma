import type { Metadata } from "next";

import OgSocialPreviewClient from "./OgSocialPreviewClient";

export const metadata: Metadata = {
  title: "BAUMA Lab — OG Social Preview Study",
  robots: { index: false, follow: false },
};

/**
 * Temporary review:
 * /lab/og-social-preview
 *
 * Production OG asset (public/og/bauma-og.png) locked to Variant A.
 */
export default function OgSocialPreviewPage() {
  return <OgSocialPreviewClient />;
}
