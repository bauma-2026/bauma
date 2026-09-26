"use client";

import { Fragment } from "react";

import SystemCubeObject from "./SystemCubeObject";

export type SystemGraphicCopy = {
  eyebrow: string;
  headline: string;
  body: string;
};

const DEFAULT_COPY: SystemGraphicCopy = {
  eyebrow: "Sistemska plast",
  headline: "Pod površino\nje sistem.",
  body: "Ni dovolj, da so stvari na pravem mestu. Med sabo morajo tudi delovati.",
};

export default function SystemGraphic({
  copy = DEFAULT_COPY,
}: {
  copy?: SystemGraphicCopy;
}) {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-[#0e0e0f] py-20 text-white sm:py-24 lg:py-28">
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
            {copy.body}
          </p>
        </div>

        <figure
          aria-labelledby="system-view-title"
          className="relative flex min-h-[220px] w-full min-w-0 items-center justify-center max-lg:min-h-[200px] lg:min-h-[280px]"
        >
          <figcaption id="system-view-title" className="sr-only">
            A compact cube of interlocking parts forming one system.
          </figcaption>
          {/* Mobile: 159×132 at most, then shrinks with the column (Pocket Cube rule). */}
          <SystemCubeObject className="h-[200px] w-[240px] max-sm:aspect-[159/132] max-sm:h-auto max-sm:w-[min(159px,48.5%)]" />
        </figure>
      </div>
    </section>
  );
}
