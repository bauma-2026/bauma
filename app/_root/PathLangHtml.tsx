"use client";

import { usePathname } from "next/navigation";

import { localeOfPath } from "@/lib/i18n/routes";

/**
 * `<html>` whose `lang` follows the requested URL (`/en/*` English, everything else Slovenian). Used only by
 * `RootDocument lang="path"` in `app/global-not-found.tsx`, the one document shared by both languages; it is rendered
 * per request, so `usePathname()` is the URL that was not found and the server HTML already carries the right `lang`.
 */
export default function PathLangHtml({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <html lang={localeOfPath(usePathname() ?? "/")} className={className}>
      {children}
    </html>
  );
}
