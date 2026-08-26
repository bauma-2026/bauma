import type { Metadata } from "next";

import AboutPreviewView from "@/components/about/AboutPreviewView";
import {
  ABOUT_FOOTER_EN,
  ABOUT_HEADER_EN,
  ABOUT_PREVIEW_COPY_EN,
} from "@/components/about/aboutPreviewCopy";

export const metadata: Metadata = {
  title: "About Preview — Bauma",
  description: "About preview for Bauma.",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * EN About Preview — structural parity with locked SLO `/about-preview`.
 * Shared AboutPreviewView + temporary EN copy placeholders.
 * Dedicated EN About copy pass is deferred.
 */
export default function EnglishAboutPreviewPage() {
  return (
    <AboutPreviewView
      copy={ABOUT_PREVIEW_COPY_EN}
      headerCopy={ABOUT_HEADER_EN}
      footerCopy={ABOUT_FOOTER_EN}
    />
  );
}
