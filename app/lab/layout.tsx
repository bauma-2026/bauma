import type { Metadata } from "next";
import RootDocument from "@/app/_root/RootDocument";
import { ROOT_METADATA } from "@/app/_root/metadata";

/**
 * Root layout of the lab subtree (Slovenian document), so lab routes stay where they are next to `app/(sl)` and `app/en`.
 * Shared lab protection — any `/lab/*` route is noindex by default.
 * Page-level robots may remain; this prevents future lab leaks via inheritance.
 */
export const metadata: Metadata = {
  ...ROOT_METADATA,
  robots: { index: false, follow: false },
};

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="sl">{children}</RootDocument>;
}
