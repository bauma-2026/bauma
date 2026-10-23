import type { Metadata } from "next";

import RegisterPocketHome from "./RegisterPocketHome";

export const metadata: Metadata = {
  title: "Bauma — Lab: Art direction (register pocket)",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <RegisterPocketHome />;
}
