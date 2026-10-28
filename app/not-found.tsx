import type { Metadata } from "next";
import Link from "next/link";

import MiniHeader, {
  type MiniHeaderNavItem,
} from "./components/blocks/mini/MiniHeader";
import MiniPalette from "./components/blocks/mini/MiniPalette";

/**
 * The 404 for every unmatched URL and every `notFound()`, rendered inside the root layout (`app/layout.tsx`), so there is
 * no second <html> or <body>. It sets its own text and surface instead of relying on the page-level defaults: the
 * default Next 404 styles `body{color:#000}` outside any cascade layer, which beat `text-white` and gave black text on
 * the near-black surface under a light OS colour scheme. Indexing stays as the root default (noindex, nofollow); Next
 * adds its own `noindex` for not-found responses. The shared header is used as on the other pages; this page has no
 * contact section, so its Contact link goes to the one on the homepage (`/#contact`).
 */
export const metadata: Metadata = {
  title: "Strani ni mogoče najti — Bauma",
};

/** Same primary navigation as `/`, `/work` and the case studies. */
const HOME_NAV: MiniHeaderNavItem[] = [
  { href: "/pristop", label: "Pristop", id: "pristop" },
  { href: "/work", label: "Work", id: "work" },
  { href: "/o-nas", label: "O nas", id: "o-nas" },
];

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white";

export default function NotFound() {
  return (
    <MiniPalette>
      <MiniHeader
        refined
        primaryNav={HOME_NAV}
        contactHref="/#contact"
        trackSections={false}
      />

      <main className="flex min-h-screen items-center bg-[#080a0f] px-5 pb-16 pt-28 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1120px]">
          <h1 className="max-w-[16ch] font-serif text-[40px] font-normal leading-[1.02] tracking-[-0.025em] text-white text-balance break-words sm:text-5xl lg:text-6xl">
            Strani ni mogoče najti.
          </h1>
          <p className="mt-5 max-w-[36ch] text-base leading-[1.6] text-white/70 sm:text-lg">
            Naslov morda ne obstaja več ali je napačen.
          </p>
          <p className="mt-8">
            <Link
              href="/"
              className={`inline-block rounded-sm py-2 text-base font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors duration-200 hover:decoration-white/70 sm:text-lg ${FOCUS}`}
            >
              Nazaj na domačo stran →
            </Link>
          </p>
        </div>
      </main>
    </MiniPalette>
  );
}
