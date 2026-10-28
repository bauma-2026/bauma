import Link from "next/link";
import type { ReactNode } from "react";

import SelectedWorkMotion, { type MotionSurfaceId } from "./SelectedWorkMotion";
import {
  DemaSurface,
  FlexidoSurface,
  OdstraniSurface,
} from "./MiniSelectedWorkSurfaces";

/**
 * Homepage "Izbrano delo" (SL), used by `app/(sl)/page.tsx` and, with its own heading and no eyebrow, `app/(sl)/o-nas/page.tsx` and
 * `app/(sl)/pristop/page.tsx`.
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

/** The `/work` card arrow response, used by the cards when `lift` is on (same classes as app/(sl)/work/page.tsx). */
const ARROW_EASE = "ease-[cubic-bezier(.25,.8,.25,1)]";
const CARD_ARROW_TINT = `text-white/48 transition-colors duration-300 ${ARROW_EASE} group-hover:text-white/92 group-hover:duration-200 group-focus-visible:text-white/92 group-focus-visible:duration-200 motion-reduce:transition-none`;
const CARD_ARROW = `inline-block transition-transform duration-300 ${ARROW_EASE} group-hover:translate-x-[3px] group-hover:duration-200 group-focus-visible:translate-x-[3px] group-focus-visible:duration-200 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-focus-visible:translate-x-0`;

/**
 * Flexido in the single column (below md): the surface keeps its fixed 18/19rem height while it widens to ~720px, its
 * type caps at 3.1rem and its 7cqw padding keeps growing, so from 640px "Ne samo robot ob stroju." (3 lines) met the
 * first sentence and the bottom edge. Here only, below md: the mobile two-line set ("Ne samo robot / ob stroju.") and the
 * vertical padding capped at 1.75rem (it does not bind below ~400px wide, so phones are unchanged). `/work` and the
 * three-column cards keep the surface as it is.
 */
const FLEXIDO_SINGLE_COLUMN =
  "max-md:[&_[data-surface=flexido]>div>div]:py-[min(7cqw,1.75rem)] max-md:[&_[data-surface=flexido]_p:last-child]:max-w-none max-md:[&_[data-surface=flexido]_br]:inline";

/**
 * Dema in the single column (below md), same cause: the three equal rows shrink to ~68px while the type caps at 3rem, so
 * from ~600px each sentence met the rule above it (1px at 767) and read as hanging from it. Here only, below md: the
 * surface's vertical padding and each row's gap above its rule capped at 1.75rem and 0.625rem, one rule for all three
 * rows. Neither binds below ~400px wide, so phones are unchanged.
 */
const DEMA_SINGLE_COLUMN =
  "max-md:[&_[data-surface=dema]>div>div]:py-[min(7cqw,1.75rem)] max-md:[&_[data-surface=dema]>div>div>div]:pb-[min(2.6cqw,0.625rem)]";

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
  heading = "Različni projekti. Različni izzivi.",
  eyebrow = true,
  lift = false,
}: {
  /**
   * The 1px rule on the section's top edge (default `true`). `false` keeps the 1px but
   * makes it transparent (height unchanged) where the section above shares this surface
   * (`/`: Services).
   */
  topRule?: boolean;
  /** The H2 (default: the homepage line). `/o-nas` and `/pristop` use "Izbrano delo.". */
  heading?: string;
  /**
   * The "Izbrano delo" eyebrow (default `true`). `false` drops it where the heading already says it (`/o-nas`,
   * `/pristop`); the heading then starts at the section's top padding (inline, so it also beats the homepage-scoped
   * heading margin).
   */
  eyebrow?: boolean;
  /** Card hover / focus response (3px lift of the surface, `/work` arrow); only the homepage turns it on. */
  lift?: boolean;
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
            {eyebrow ? (
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">Izbrano delo</p>
            ) : null}
            <h2
              id="msw-home-heading"
              className="home-bridge-heading mt-5 max-w-[18ch] text-balance text-xl sm:mt-6 sm:max-w-[22ch] sm:text-3xl"
              style={eyebrow ? undefined : { marginTop: 0 }}
            >
              {heading}
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
                    className={`group block ${FLEXIDO_SINGLE_COLUMN} ${DEMA_SINGLE_COLUMN} ${LINK_FOCUS}`}
                  >
                    <div className={lift ? "work-lift work-lift-home" : undefined}>
                      <SelectedWorkMotion id={p.motion} col={(i + 1) as 1 | 2 | 3}>
                        <Art />
                      </SelectedWorkMotion>
                    </div>
                    <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] grid-rows-[minmax(44px,auto)_auto] items-center">
                      <h3
                        id={id}
                        className="col-start-1 row-start-1 text-[1.5rem] font-semibold leading-[1.05] tracking-[-0.03em] text-white"
                      >
                        {p.name}
                      </h3>
                      <span
                        aria-hidden="true"
                        className={`col-start-2 row-start-1 justify-self-end text-sm font-medium ${lift ? CARD_ARROW_TINT : "text-white/65 transition-colors duration-300 group-hover:text-white/92"}`}
                      >
                        <span className={lift ? CARD_ARROW : ARROW}>→</span>
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

        <div className="mt-2 flex justify-end lg:mt-6">
          <TextLink href="/work">Vsi projekti</TextLink>
        </div>
      </div>
    </section>
  );
}
