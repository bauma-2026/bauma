import type { Metadata } from "next";

import MiddleBHome from "./MiddleBHome";

export const metadata: Metadata = {
  title: "Bauma — Lab: Art direction (middle B)",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <MiddleBHome />;
}
