import type { Metadata } from "next";

import RootDocument from "@/app/_root/RootDocument";
import { ROOT_METADATA } from "@/app/_root/metadata";
import NotFoundContent, { NOT_FOUND_TITLE } from "@/app/_root/NotFoundContent";

/**
 * The 404 for every URL that matches no route (`experimental.globalNotFound` in `next.config.ts`). With separate root
 * layouts for `(sl)`, `en` and `lab` there is no single layout to render it in, so Next renders this file on its own:
 * it brings the full document (`RootDocument`, Slovenian) and the root metadata itself, then sets the 404 title.
 * Without it an unmatched URL got Next's bare 404 document with no `lang`.
 */
export const metadata: Metadata = {
  ...ROOT_METADATA,
  title: NOT_FOUND_TITLE,
};

export default function GlobalNotFound() {
  return (
    <RootDocument lang="sl">
      <NotFoundContent />
    </RootDocument>
  );
}
