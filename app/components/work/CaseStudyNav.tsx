import Link from "next/link";

/**
 * Case-study order: the reading order of the `/work` grid (rows of two). This list is the single source for the
 * previous / next navigation; keep it in step with `PROJECTS` in `app/(sl)/work/page.tsx` when a project is added or moved.
 */
export const CASE_STUDIES = [
  { slug: "flexido", name: "Flexido" },
  { slug: "ulterior", name: "Ulterior" },
  { slug: "odstrani-tattoo", name: "Odstrani Tattoo" },
  { slug: "dema-plus", name: "Dema Plus" },
  { slug: "artbite", name: "ArtBite" },
  { slug: "hardshelljacket", name: "Hardshelljacket" },
] as const;

export type CaseStudySlug = (typeof CASE_STUDIES)[number]["slug"];

/** Same ring as the header controls (`[data-header-focus]` in globals.css). */
const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--mini-accent-text,#fff)]";

/** The case pages' own eyebrow style (Inter, tracked caps). */
const EYEBROW = "text-[11px] font-medium uppercase tracking-[0.22em] text-white/60";

const DIRECTION = "text-[13px] font-medium text-white/55 transition-colors duration-300 group-hover:text-white/80";

/** `break-words`: with increased user letter/word spacing the longest name ("Hardshelljacket") can be wider than its half
 *  of the row; it then breaks inside the cell instead of overflowing the page. No effect when the name fits. */
const TITLE =
  "mt-2 break-words text-lg font-medium leading-[1.2] tracking-[-0.02em] text-white transition-colors duration-300 group-hover:text-[var(--mini-accent-text,#fff)] sm:text-2xl";

/**
 * Previous / next case study and the way back to `/work`, between the last proof and the closing CTA. Bauma's own
 * interface, on the page's base surface (never inside a client reconstruction). Circular: the first project's previous
 * is the last one. Type only: no thumbnails, cards or filled buttons; Royal Blue only as hover and focus feedback.
 */
export default function CaseStudyNav({ current }: { current: CaseStudySlug }) {
  const i = CASE_STUDIES.findIndex((p) => p.slug === current);
  const prev = CASE_STUDIES[(i - 1 + CASE_STUDIES.length) % CASE_STUDIES.length];
  const next = CASE_STUDIES[(i + 1) % CASE_STUDIES.length];

  return (
    <nav aria-labelledby="case-nav-label" className="pb-14 pt-12 text-white sm:pb-16 sm:pt-14 lg:pb-20 lg:pt-16">
      <div className="mini-page-rail">
        <div className="flex items-baseline justify-between gap-6">
          <p id="case-nav-label" className={EYEBROW}>
            Izbrani projekti
          </p>
          <Link
            href="/work"
            className={`-my-3 inline-flex min-h-11 items-center text-sm font-medium text-white/65 transition-colors duration-300 hover:text-white ${FOCUS}`}
          >
            Vsi projekti<span aria-hidden="true">&nbsp;→</span>
          </Link>
        </div>

        <ul className="mt-4 grid list-none grid-cols-2 gap-x-6 border-t border-white/10 sm:gap-x-10">
          <li>
            <Link href={`/work/${prev.slug}`} rel="prev" className={`group block py-6 sm:py-7 ${FOCUS}`}>
              <span className={`block ${DIRECTION}`}>
                <span aria-hidden="true">←&nbsp;</span>Prejšnji projekt
              </span>
              <span className={`block ${TITLE}`}>{prev.name}</span>
            </Link>
          </li>
          <li className="text-right">
            <Link href={`/work/${next.slug}`} rel="next" className={`group block py-6 sm:py-7 ${FOCUS}`}>
              <span className={`block ${DIRECTION}`}>
                Naslednji projekt<span aria-hidden="true">&nbsp;→</span>
              </span>
              <span className={`block ${TITLE}`}>{next.name}</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
