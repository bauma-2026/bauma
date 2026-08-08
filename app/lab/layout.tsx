import type { Metadata } from "next";

/**
 * Shared lab protection — any `/lab/*` route is noindex by default.
 * Page-level robots may remain; this prevents future lab leaks via inheritance.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
