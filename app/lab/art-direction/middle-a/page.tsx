import type { Metadata } from "next";

import MiddleAHome from "./MiddleAHome";

export const metadata: Metadata = {
  title: "Bauma — Lab: Art direction (middle A)",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <MiddleAHome />;
}
