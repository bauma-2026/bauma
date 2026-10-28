import type { Metadata } from "next";
import { slPageMetadata } from "@/lib/indexing";

import WorkIndex from "@/app/components/work/WorkIndex";

const TITLE = "Izbrani spletni projekti — Bauma";
const DESCRIPTION =
  "Izbor spletnih strani in digitalnih rešitev. Izhodišča projektov, odločitve pri zasnovi ter povezava med vsebino, oblikovanjem in razvojem.";

export const metadata: Metadata = slPageMetadata(
  "/work",
  { title: TITLE, description: DESCRIPTION },
);

/** `/work`: the shared Work index (`app/components/work/WorkIndex.tsx`) with its Slovenian defaults. */
export default function WorkPage() {
  return <WorkIndex locale="sl" />;
}
