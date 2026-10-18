import type { ReactNode } from "react";

import "./MiniPalette.css";
import "./MiniButtons.css";
import "./MiniContact.css";

/** `/mini` only: scopes the Royal Blue palette variables to this subtree. */
export default function MiniPalette({ children }: { children: ReactNode }) {
  return <div data-mini-palette="">{children}</div>;
}
