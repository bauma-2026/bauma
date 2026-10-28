import type { Metadata } from "next";
import RootDocument from "@/app/_root/RootDocument";
import { ROOT_METADATA } from "@/app/_root/metadata";

/**
 * Slovenian root layout: every route outside `/en` and `/lab`. The `(sl)` group adds no URL segment, so `/`, `/pristop`,
 * `/work`, … are unchanged. Navigating to another root layout (`/en`, `/lab`) is a full page load.
 */
export const metadata: Metadata = ROOT_METADATA;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootDocument lang="sl">{children}</RootDocument>;
}
