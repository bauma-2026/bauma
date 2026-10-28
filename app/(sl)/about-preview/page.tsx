import type { Metadata } from "next";

import AboutPreviewView from "@/components/about/AboutPreviewView";
import {
  ABOUT_FOOTER_SL,
  ABOUT_HEADER_SL,
  ABOUT_PREVIEW_COPY_SL,
} from "@/components/about/aboutPreviewCopy";

export const metadata: Metadata = {
  title: "About Preview — Bauma",
  description: "Local identity preview for Bauma.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AboutPreviewPage() {
  return (
    <AboutPreviewView
      copy={ABOUT_PREVIEW_COPY_SL}
      headerCopy={ABOUT_HEADER_SL}
      footerCopy={ABOUT_FOOTER_SL}
    />
  );
}
