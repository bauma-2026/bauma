import type { Metadata } from "next";

import ConnectedHome from "./ConnectedHome";

export const metadata: Metadata = {
  title: "Bauma — Lab: System (connected)",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ConnectedHome />;
}
