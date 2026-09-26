import type { Metadata } from "next";

import OgSocialPreviewClient from "./OgSocialPreviewClient";

export const metadata: Metadata = {
  title: "BAUMA Lab — OG Social Preview Study",
  robots: { index: false, follow: false },
};

/**
 * Review:
 * /lab/og-social-preview
 *
 * Source for production OG assets:
 * public/og/bauma-og-v2.png (SL) and public/og/bauma-og-en-v2.png (EN).
 */
export default function OgSocialPreviewPage() {
  return <OgSocialPreviewClient />;
}
