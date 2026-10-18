"use client";

import { Fragment } from "react";

import SystemCubeObject from "./SystemCubeObject";
import type { MiniSurfaceTone } from "./miniObjectMaterial";

export type SystemGraphicCopy = {
  eyebrow: string;
  headline: string;
  body: string;
  /** Screen-reader description of the cube; defaults to English. */
  objectDescription?: string;
};

const DEFAULT_COPY: SystemGraphicCopy = {
  eyebrow: "Sistemska plast",
  headline: "Pod površino\nje sistem.",
  body: "Ni dovolj, da so stvari na pravem mestu.\nMed sabo morajo tudi delovati.",
  objectDescription: "Kompaktna kocka iz povezanih delov, ki skupaj tvorijo en sistem.",
};

export default function SystemGraphic({
  copy = DEFAULT_COPY,
  tone = "warm",
  joinsNextSection = false,
  refined = false,
  topRule = true,
}: {
  copy?: SystemGraphicCopy;
  /** `neutral` drops the warm undertone from the cube faces (`/mini`). */
  tone?: MiniSurfaceTone;
  /** Shortens the bottom padding when the next section shares this surface and continues the idea (`/mini`). */
  joinsNextSection?: boolean;
  /** Refined System cube with visible hidden structure (`/` only). */
  refined?: boolean;
  /**
   * The 1px rule on the section's top edge (default `true`). `false` keeps the 1px but
   * makes it transparent (height unchanged) where the section above already ends in its
   * own hairline (`/`: the hero's bottom border).
   */
  topRule?: boolean;
}) {
  return (
    <section
      className={`relative overflow-hidden border-t ${topRule ? "border-[color:var(--mini-border-section,color-mix(in_oklab,#fff_10%,transparent))]" : "border-transparent"} bg-[var(--mini-surface-system,#0e0e0f)] pt-20 text-white sm:pt-24 lg:pt-28 ${
        joinsNextSection ? "pb-16 sm:pb-20 lg:pb-24" : "pb-20 sm:pb-24 lg:pb-28"
      }`}
    >
      <span id="system" data-anchor-marker aria-hidden="true" />
      <div className="mini-page-rail grid min-w-0 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
            {copy.eyebrow}
          </p>

          <h2 className="home-primary-heading mt-5 max-w-[11ch] max-sm:[&:lang(en)]:max-w-[15ch]">
            {copy.headline.split("\n").map((line, i) => (
              <Fragment key={line}>
                {i > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </h2>

          <p className="mt-6 max-w-[48ch] text-base leading-7 text-white/55">
            {/* "\n" = intentional sentence break at every size. */}
            {copy.body.split("\n").map((line, i) => (
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
            {copy.objectDescription ??
              "A compact cube of interlocking parts forming one system."}
          </figcaption>
          {/* Mobile: 159×132 at most, then shrinks with the column (Pocket Cube rule). */}
          <SystemCubeObject tone={tone} refined={refined} className="h-[200px] w-[240px] max-sm:aspect-[159/132] max-sm:h-auto max-sm:w-[min(159px,48.5%)]" />
        </figure>
      </div>
    </section>
  );
}
