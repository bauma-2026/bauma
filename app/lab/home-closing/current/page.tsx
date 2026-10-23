import type { Metadata } from "next";

import HomeClosing from "../HomeClosing";

export const metadata: Metadata = {
  title: "Bauma — Lab: Home closing (current)",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <HomeClosing withProjectCta={true} />;
}
