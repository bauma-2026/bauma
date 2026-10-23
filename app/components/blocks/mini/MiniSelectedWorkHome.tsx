import Link from "next/link";
import type { ReactNode } from "react";

import SelectedWorkMotion, { type MotionSurfaceId } from "./SelectedWorkMotion";
import {
  DemaSurface,
  FlexidoSurface,
  OdstraniSurface,
} from "./MiniSelectedWorkSurfaces";

/**
 * Homepage "Izbrano delo" (SL), used only by `app/page.tsx`.
 *
 * Visually led: per project a typographic surface, the project name, a quiet
 * descriptor and a directional arrow. No cards, borders or captions around the
 * surfaces. Each project is ONE link (surface, name, descriptor and arrow are
 * all inside it); the arrow is a visual affordance, not a second link. `MiniSelectedWork` (reconstruction layout) is left as it was for
 * the labs and case studies that still use it.
 *
 * Grid: 3 equal columns from md (Visual QA Pass 2, option C). Two columns left the third card alone at 768-1023, and
 * the fixed-height surfaces crowded Flexido at ~468px wide; at 219-304px they read as portraits. Name and arrow share
 * a row at every width (the arrow is a glyph, so even "Odstrani Tattoo" fits the
 * 272px surface width at 320px). The row keeps the 44px height the old text link
 * gave it, so card height is unchanged.
 *
 * Project names are 24px at every width (the thumbnails lead). The overview link ("Vsi projekti", /work) sits
 * below the cards, right-aligned with the rail, as the continuation after the three selected projects.
 *
 * Motion: each surface is wrapped in `SelectedWorkMotion`, a progressive
 * enhancement that plays once on entry (static is always the default; see that
 * file). The wrapper is a plain block and does not change layout.
 */

/** Same ring as the header controls (`[data-header-focus]` in globals.css). */
const LINK_FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--mini-accent-text,#fff)]";

/** Arrow glyph shared by the section link and the cards: calm 3px nudge + contrast on hover of `.group`. */
const ARROW =
  "inline-block transition-transform duration-300 group-hover:translate-x-[3px]";

type Project = {
  slug: string;
  motion: MotionSurfaceId;
  name: string;
  descriptor: string;
  Art: () => ReactNode;
};

const PROJECTS: readonly Project[] = [
  { slug: "odstrani-tattoo", motion: "odstrani", name: "Odstrani Tattoo", descriptor: "Zaupanje in konverzija", Art: OdstraniSurface },
  { slug: "dema-plus", motion: "dema", name: "Dema Plus", descriptor: "Reference in jasnost", Art: DemaSurface },
  { slug: "flexido", motion: "flexido", name: "Flexido", descriptor: "Industrijski B2B", Art: FlexidoSurface },
];

function TextLink({ href, className = "", children }: { href: string; className?: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={`group inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-white/65 transition-colors duration-300 hover:text-white/92 ${LINK_FOCUS} ${className}`}
    >
      {children}
      <span aria-hidden="true" className={ARROW}>
        →
      </span>
    </Link>
  );
}

export default function MiniSelectedWorkHome({
  topRule = true,
}: {
  /**
   * The 1px rule on the section's top edge (default `true`). `false` keeps the 1px but
   * makes it transparent (height unchanged) where the section above shares this surface
   * (`/`: Services).
   */
  topRule?: boolean;
}) {
  return (
    <section
      id="selected-work"
      data-section="selected-work"
      aria-labelledby="msw-home-heading"
      className={`scroll-mt-13 border-t ${topRule ? "border-[color:var(--mini-border-section,color-mix(in_oklab,#fff_10%,transparent))]" : "border-transparent"} bg-[var(--mini-surface-work,#080a0f)] py-16 text-white sm:py-20 lg:py-24`}
    >
      <div className="mini-page-rail">
        <div className="flex items-end justify-between gap-10">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">Izbrano delo</p>
            <h2 id="msw-home-heading" className="home-bridge-heading mt-5 max-w-[18ch] text-balance text-xl sm:mt-6 sm:max-w-[22ch] sm:text-3xl">
              Različni projekti. Različni izzivi.
            </h2>
          </div>
        </div>

        <ol className="mt-10 grid list-none gap-x-6 gap-y-10 sm:mt-12 md:grid-cols-3 lg:mt-14 lg:gap-x-10 xl:gap-x-12">
          {PROJECTS.map((p, i) => {
            const id = `msw-home-${p.slug}`;
            const { Art } = p;
            return (
              <li key={p.slug}>
                <article>
                  <Link
                    href={`/work/${p.slug}`}
                    aria-labelledby={id}
                    aria-describedby={`${id}-desc`}
                    className={`group block ${LINK_FOCUS}`}
                  >
                    <SelectedWorkMotion id={p.motion} col={(i + 1) as 1 | 2 | 3}>
                      <Art />
                    </SelectedWorkMotion>
                    <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] grid-rows-[minmax(44px,auto)_auto] items-center">
                      <h3
                        id={id}
                        className="col-start-1 row-start-1 text-[1.5rem] font-semibold leading-[1.05] tracking-[-0.03em] text-white"
                      >
                        {p.name}
                      </h3>
                      <span
                        aria-hidden="true"
                        className="col-start-2 row-start-1 justify-self-end text-sm font-medium text-white/65 transition-colors duration-300 group-hover:text-white/92"
                      >
                        <span className={ARROW}>→</span>
                      </span>
                      <p id={`${id}-desc`} className="col-span-2 row-start-2 -mt-1 text-[13px] leading-5 text-white/60">
                        {p.descriptor}
                      </p>
                    </div>
                  </Link>
                </article>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 flex justify-end">
          <TextLink href="/work">Vsi projekti</TextLink>
        </div>
      </div>
    </section>
  );
}
