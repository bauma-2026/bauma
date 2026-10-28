"use client";

import { usePathname } from "next/navigation";

import { localeOfPath, type Locale } from "@/lib/i18n/routes";

/**
 * Picks the 404 of the requested URL's language inside `app/global-not-found.tsx`. Both bodies are rendered on the
 * server and passed in; only the matching one is output. The title and description are rendered here (React hoists them
 * into <head>) because the global 404's static metadata cannot know the URL; every other head tag stays in its metadata.
 */
export default function LocalizedNotFound({
  head,
  bodies,
}: {
  head: Record<Locale, { title: string; description: string }>;
  bodies: Record<Locale, React.ReactNode>;
}) {
  const locale = localeOfPath(usePathname() ?? "/");

  return (
    <>
      <title>{head[locale].title}</title>
      <meta name="description" content={head[locale].description} />
      {bodies[locale]}
    </>
  );
}
