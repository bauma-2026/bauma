"use client";

import { Fragment } from "react";

import {
  HomeHeroCta,
  HomeHeroProvider,
} from "@/components/home/hero-system";

import MiniNextStepCube from "./MiniNextStepCube";
import MiniProjectCube from "./MiniProjectCube";
import type { MiniSurfaceTone } from "./miniObjectMaterial";

export type MiniMidPageCtaCopy = {
  eyebrow: string;
  headline: string;
  support: string;
  cta: string;
};

const DEFAULT_COPY: MiniMidPageCtaCopy = {
  eyebrow: "V PRAKSI",
  headline: "En primer je dovolj\nza začetek.",
  support: "Najprej se pokaže, kaj je res pomembno.",
  cta: "Pogovorimo se",
};

export default function MiniMidPageCta({
  copy = DEFAULT_COPY,
  tone = "warm",
  cube = "pocket",
  topRule = true,
  surface = "cta",
}: {
  copy?: MiniMidPageCtaCopy;
  /** `neutral` swaps the warm `#0f0e0c` section and cube fills for cool-neutral ones (`/mini`). */
  tone?: MiniSurfaceTone;
  /**
   * `material` is the softly rounded satin slate cube (`/` only, opt-in).
   * `pocket` is the existing Pocket Cube used by `/mini` and `/en/mini`.
   */
  cube?: "pocket" | "material";
  /**
   * The 1px rule on the section's top edge (default `true`, as on `/mini` and `/en/mini`).
   * `false` keeps the 1px but makes it transparent (height unchanged) where the surface
   * step from the previous section already separates the two (`/`).
   */
  topRule?: boolean;
  /**
   * Section surface when `tone` is `neutral`. `cta` is the `--mini-surface-cta` step used by
   * `/mini` and `/en/mini`; `system` is the shared Raised surface (`--mini-surface-system`,
   * the same as the System section above) used by `/`.
   */
  surface?: "cta" | "system";
}) {
  return (
    <section className={`overflow-hidden border-t ${topRule ? "border-[color:var(--mini-border-section,color-mix(in_oklab,#fff_10%,transparent))]" : "border-transparent"} ${tone === "neutral" ? (surface === "system" ? "bg-[var(--mini-surface-system,#0d0f15)]" : "bg-[var(--mini-surface-cta,#0f0f10)]") : "bg-[#0f0e0c]"} py-16 text-white sm:py-20 lg:py-20`}>
      <HomeHeroProvider>
        <div className="mini-page-rail grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14">
          <div className="max-w-[34rem]">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--mini-accent-text,#D1A45F)]">
              {copy.eyebrow}
            </p>
            <h2 className="home-bridge-heading mt-5 max-w-[18ch]">
              {copy.headline.split("\n").map((line, i) => (
                <Fragment key={line}>
                  {i > 0 && <br />}
                  {line}
                </Fragment>
              ))}
            </h2>
            <p className="mt-5 max-w-[48ch] text-sm leading-6 text-white/60 sm:text-base sm:leading-7">
              {copy.support}
            </p>
            <div className="mt-7">
              <HomeHeroCta label={copy.cta} href="#contact" variant="amber" />
            </div>
          </div>

          {/*
            Material cube: below lg the layout box is compact and clips the full-size
            stage, which is centred inside it. The cube keeps its stage-derived scale;
            only the footprint shrinks, and the clipped stage cannot catch pointer events
            meant for the CTA. From lg the box is the original 400px stage, unclipped.
          */}
          <div
            className={
              cube === "material"
                ? "relative flex h-36 items-center overflow-hidden sm:h-52 lg:h-[400px] lg:overflow-visible"
                : "relative h-[260px] max-sm:-mt-6 sm:h-[400px]"
            }
          >
            {cube === "material" ? (
              <MiniProjectCube className="relative h-[260px] w-full shrink-0 sm:h-[400px] lg:h-full" />
            ) : (
              <MiniNextStepCube tone={tone} className="relative h-full w-full" />
            )}
          </div>
        </div>
      </HomeHeroProvider>
    </section>
  );
}
