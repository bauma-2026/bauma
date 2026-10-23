import type { CSSProperties, ReactNode } from "react";

/**
 * Homepage "Izbrano delo": the three approved typographic project surfaces
 * (lab: /lab/selected-work-typographic-v2, refinement 02). Colours, type,
 * proportions and internal layouts are exactly as approved.
 *
 * The statements are the projects' own homepage headlines, unchanged:
 *   Odstrani  "Ali je vaš tattoo mogoče odstraniti?"
 *   Dema      "Gradimo. / Po načrtu. / Do izvedbe."
 *   Flexido   "Povežemo tok med stroji. / Ne samo robot ob stroju."
 * No photographs, logos, gradients or effects. Type scales with the surface
 * (container query units), so one composition holds from 272px to ~400px.
 */

/** One footprint for all three surfaces. */
const SURFACE =
  "@container h-[18rem] overflow-hidden rounded-[3px] antialiased [text-rendering:auto] sm:h-[19rem] lg:h-[21.25rem]";

/** Container-query units resolve against an ancestor, so padding lives on a child. */
function Surface({ bg, ink, font, className, children }: { bg: string; ink: string; font: string; className: string; children: ReactNode }) {
  return (
    <div className={SURFACE} style={{ backgroundColor: bg, color: ink, fontFamily: font }}>
      <div className={`h-full ${className}`}>{children}</div>
    </div>
  );
}

const ARIAL = "Arial, Helvetica, sans-serif";
const INTER = "var(--font-sans), ui-sans-serif, system-ui, sans-serif";

const cq = (n: number, min: string, max: string): CSSProperties => ({
  fontSize: `clamp(${min}, ${n}cqw, ${max})`,
});

/* ------------------------------ surfaces ------------------------------ */

/** 01 · Warm sand, the site's own Arial. One large question, anchored low;
 *  the only colour move is the question mark. */
export function OdstraniSurface() {
  return (
    <Surface bg="#EADFD1" ink="#1B1612" font={ARIAL} className="flex flex-col justify-end px-[7cqw] pb-[7cqw]">
      <p
        className="font-bold leading-[0.98] tracking-[-0.045em]"
        style={cq(12, "1.75rem", "3.25rem")}
      >
        <span className="block">Ali je vaš</span>
        <span className="block">tattoo mogoče</span>
        <span className="block">
          odstraniti<span className="text-[#A8714A]">?</span>
        </span>
      </p>
    </Surface>
  );
}

const DEMA_LINES = ["Gradimo.", "Po načrtu.", "Do izvedbe."] as const;

/** 02 · Limestone. The three real lines of the headline become three equal
 *  ruled rows, like a drawing's title block; each sentence sits on its rule. */
export function DemaSurface() {
  return (
    <Surface bg="#C9C6BD" ink="#22211F" font={INTER} className="grid grid-rows-3 px-[7cqw] py-[7cqw]">
      {DEMA_LINES.map((line, i) => (
        <div
          key={line}
          className={[
            "flex items-end justify-between gap-4 pb-[2.6cqw]",
            "border-t border-[#22211F]/35",
            i === DEMA_LINES.length - 1 ? "border-b" : "",
          ].join(" ")}
        >
          <p className="font-medium leading-none tracking-[-0.04em]" style={cq(11.5, "1.625rem", "3rem")}>
            {line}
          </p>
          <span
            aria-hidden="true"
            className="pb-[0.2em] text-[10px] font-medium tabular-nums tracking-[0.18em] text-[#5A5852]"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
        </div>
      ))}
    </Surface>
  );
}

/** 03 · Industrial blue. One idea, taken from the statement's own grammar:
 *  "tok MED stroji" is between, "robot OB stroju" is beside.
 *  - "tok med stroji." is justified edge to edge: its words sit on both edges
 *    of the surface and the gaps between them are the flow.
 *  - "Ne samo robot ob stroju." is one compact cluster at the same size. It
 *    touches no edge and nothing else; it stays beside itself.
 *  Same size and face (the second sentence only a step quieter in weight and
 *  colour): no headline and subline. The only
 *  difference between the sentences is their relationship to the space. */
export function FlexidoSurface() {
  const size = cq(11.5, "1.75rem", "3.1rem");
  return (
    <Surface bg="#101C33" ink="#F2F5FB" font={INTER} className="flex flex-col justify-between px-[7cqw] py-[7cqw]">
      <p className="font-semibold leading-[1] tracking-[-0.045em]" style={size}>
        <span className="block">Povežemo</span>
        <span className="block text-justify [text-align-last:justify]">tok med stroji.</span>
      </p>
      {/* Below sm the surface is a fixed 18rem while the type grows with its width: three lines here ran into the
          bottom padding from ~430px. Two set lines keep the cluster compact without the narrow measure. A <br>, not
          spans, so SelectedWorkMotion's `p > span` selectors are unaffected. */}
      <p
        className="max-w-[5.4em] font-medium leading-[1] tracking-[-0.04em] text-[#7F91B9] max-sm:max-w-none"
        style={size}
      >
        Ne samo robot
        <br className="sm:hidden" /> ob stroju.
      </p>
    </Surface>
  );
}
