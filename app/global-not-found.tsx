import type { Metadata } from "next";

import RootDocument from "@/app/_root/RootDocument";
import { ROOT_METADATA } from "@/app/_root/metadata";
import NotFoundContent, { NOT_FOUND_TITLE, NOT_FOUND_TITLE_EN } from "@/app/_root/NotFoundContent";
import LocalizedNotFound from "@/app/_root/LocalizedNotFound";

/**
 * The 404 for every URL that matches no route (`experimental.globalNotFound` in `next.config.ts`). With separate root
 * layouts for `(sl)`, `en` and `lab` there is no single layout to render it in, so Next renders this file on its own:
 * it brings the full document (`RootDocument`) and the root metadata itself. Without it an unmatched URL got Next's bare
 * 404 document with no `lang`.
 *
 * It is the 404 of both languages: rendered per request, it reads the requested URL, so `/en/*` gets
 * `<html lang="en">` with the English body, title and description, and every other URL the Slovenian ones
 * (`PathLangHtml`, `LocalizedNotFound`). An English 404 cannot come from `notFound()` under `app/en`: Next 16.4.1 answers
 * a thrown `notFound()` with its bare `__next_error__` document, while this unmatched-route path renders in full.
 */
export const dynamic = "force-dynamic";

/** Title and description come from `LocalizedNotFound`; everything else is the root metadata, as before. */
export const metadata: Metadata = {
  ...ROOT_METADATA,
  title: null,
  description: null,
};

const HEAD = {
  sl: { title: NOT_FOUND_TITLE, description: ROOT_METADATA.description as string },
  // The English root layout's default description (`app/en/layout.tsx`).
  en: {
    title: NOT_FOUND_TITLE_EN,
    description:
      "Websites for companies with a strong offer that their current site doesn’t communicate clearly.",
  },
};

export default function GlobalNotFound() {
  return (
    <RootDocument lang="path">
      <LocalizedNotFound
        head={HEAD}
        bodies={{ sl: <NotFoundContent />, en: <NotFoundContent locale="en" /> }}
      />
    </RootDocument>
  );
}
