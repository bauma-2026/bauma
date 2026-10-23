import type { Metadata } from "next";

import HomeClosing from "../HomeClosing";

export const metadata: Metadata = {
  title: "Bauma — Lab: Home closing (direct)",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <HomeClosing withProjectCta={false} />;
}
