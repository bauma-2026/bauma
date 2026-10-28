import type { Metadata } from "next";

import NotFoundContent, { NOT_FOUND_TITLE } from "@/app/_root/NotFoundContent";

/**
 * The 404 for `notFound()` inside the Slovenian subtree (for example a `/novice/<slug>` page), rendered inside
 * `app/(sl)/layout.tsx`. Unmatched URLs anywhere in the app (and the closed development routes rewritten to
 * `/_not-found` in `next.config.ts`) get the same body from `app/global-not-found.tsx`, because there is no single root
 * layout to compose a 404 from. Indexing stays as the root default (noindex, nofollow); Next adds its own `noindex` for
 * not-found responses.
 */
export const metadata: Metadata = {
  title: NOT_FOUND_TITLE,
};

export default function NotFound() {
  return <NotFoundContent />;
}
