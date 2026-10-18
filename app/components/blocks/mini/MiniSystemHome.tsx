import { Fragment } from "react";

import SystemCubeB51 from "./SystemCubeB51";

/**
 * Homepage "Sistemska plast" (SL), used only by `app/page.tsx`, between Hero and Services.
 *
 * Same section shell, copy and cube footprint as `SystemGraphic` with the props `/` passes
 * (`tone="neutral" joinsNextSection refined topRule={false}`), but the illustration is the approved
 * B5.1 cube (lab: /lab/system-cube/b51). `SystemGraphic` and `SystemCubeObject` stay as they were
 * for `/mini`, `/en/mini` and any other caller.
 */

const COPY = {
  eyebrow: "Sistemska plast",
  headline: "Pod površino\nje sistem.",
  body: "Ni dovolj, da so stvari na pravem mestu.\nMed sabo morajo tudi delovati.",
  objectDescription: "Kompaktna kocka iz povezanih delov, ki skupaj tvorijo en sistem.",
};

/** Footprint classes copied from SystemGraphic (240x200, mobile 159x132 then fluid). */
const CUBE_BOX = "h-[200px] w-[240px] max-sm:aspect-[159/132] max-sm:h-auto max-sm:w-[min(159px,48.5%)]";

export default function MiniSystemHome() {
  return (
    <section className="relative overflow-hidden border-t border-transparent bg-[var(--mini-surface-system,#0e0e0f)] pt-20 pb-16 text-white sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24">
      <span id="system" data-anchor-marker aria-hidden="true" />
      <div className="mini-page-rail grid min-w-0 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">{COPY.eyebrow}</p>
          <h2 className="home-primary-heading mt-5 max-w-[11ch] max-sm:[&:lang(en)]:max-w-[15ch]">
            {COPY.headline.split("\n").map((line, i) => (
              <Fragment key={line}>
                {i > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </h2>
          <p className="mt-6 max-w-[48ch] text-base leading-7 text-white/55">
            {/* "\n" = intentional sentence break at every size. */}
            {COPY.body.split("\n").map((line, i) => (
              <Fragment key={line}>
                {i > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </p>
        </div>
        <figure
          aria-labelledby="system-view-title"
          className="relative flex min-h-[220px] w-full min-w-0 items-center justify-center max-lg:min-h-[200px] lg:min-h-[280px]"
        >
          <figcaption id="system-view-title" className="sr-only">
            {COPY.objectDescription}
          </figcaption>
          <SystemCubeB51 className={CUBE_BOX} />
        </figure>
      </div>
    </section>
  );
}
