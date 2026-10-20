"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Reconstruction of the "Technical Proof" section of the Ulterior hardshell
 * product page (ulterior.es/shop/waterproof-hardshell-jacket). Unlike the other
 * proofs it is interactive, because the interaction is the point of the section.
 *
 * Source of truth (local ulterior-next, matches the live page):
 * - src/components/hardshell/HardshellTechnicalProof.tsx: copy, the five points
 *   and their marker positions (percent of the photograph), the hover / focus /
 *   click behaviour (hover or focus previews a point, click or tap selects it,
 *   nothing is selected at first) and the markup of the two columns.
 * - Tokens ported 1:1 from src/app/globals.css (`.eyebrow`, `.heading-section`,
 *   `.body-copy`, ulterior-dark #33333e, line #e6e6e6) instead of importing that
 *   stylesheet. Font: Arial/Helvetica. Two deliberate departures, both for the
 *   case study: the surface is a cool blue-grey (#f3f6fa, the original is the
 *   near-white `.section-soft-60`), and the active accent is Ulterior's blue
 *   #355cad (the original uses its lighter `--color-ulterior-blue-soft` #89a8e8).
 * - Image: public/images/product/hardshell/hardshell-green-front-01.webp,
 *   unedited (680 x 680), on the plate #f5f4f1.
 *
 * Differences from the original, none of them visible as a change in function:
 * breakpoints follow the width the proof is given (container queries at 640 /
 * 1024 instead of the viewport); the section's own top rule is dropped (the
 * proof frame is its edge); the detail block reserves its height so choosing a
 * point does not move the content below it; the section padding and the gaps
 * are tighter, and the photograph keeps to about 460px (a 680px source), with
 * the list taking the rest of the width. English only (no locale switch).
 *
 * Every title and the paragraph under it are plain text, and the page that
 * embeds this proof owns the only H1; the headline here is a paragraph.
 */

const FONT_STACK = "Arial, Helvetica, sans-serif";

const POINTS = [
  {
    number: "01",
    title: "Detachable hood",
    body: "A protective hood that can be removed when the conditions or the setting call for a cleaner profile.",
    marker: "left-[58%] top-[24%]",
  },
  {
    number: "02",
    title: "Waterproof zippers",
    body: "Zipper details designed to support protection in rain and changing weather.",
    marker: "left-[60%] top-[38%]",
  },
  {
    number: "03",
    title: "3-layer protective shell",
    body: "A technical shell construction built as the main protective outer layer.",
    marker: "left-[37%] top-[43%]",
  },
  {
    number: "04",
    title: "Durable water repellent",
    body: "A surface treatment that helps rain bead off the outer fabric.",
    marker: "left-[31%] top-[70%]",
  },
  {
    number: "05",
    title: "Breathable lamination",
    body: "A technical layer that supports comfort while keeping the jacket protective.",
    marker: "left-[67%] top-[69%]",
  },
] as const;

const FOCUS_RING =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#355cad] focus-visible:ring-offset-2";

export default function UlteriorTechnicalProof() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const visibleIndex = hoveredIndex ?? selectedIndex;
  const visiblePoint = visibleIndex === null ? null : POINTS[visibleIndex];

  function selectPoint(index: number) {
    setSelectedIndex(index);
    setHoveredIndex(null);
  }

  return (
    <div
      className="@container bg-[#f3f6fa] text-[#33333e] antialiased [text-rendering:auto]"
      style={{ fontFamily: FONT_STACK }}
    >
      <div className="mx-auto w-full max-w-[1240px] px-5 py-9 @min-[640px]:px-6 @min-[768px]:py-10 @min-[1024px]:px-8 @min-[1024px]:py-12">
        <div className="mb-7 max-w-3xl @min-[768px]:mb-8">
          <p className="mb-4 text-[0.75rem] uppercase leading-4 tracking-[0.14em] text-[#6f6f76]">
            Technical Proof
          </p>

          <p className="text-[1.875rem] font-semibold leading-[1.12] tracking-[-0.03em] text-[#33333e]">
            Technical details, mapped to the shell.
          </p>

          <p className="mt-5 text-base leading-7 text-[rgb(64,64,64)]">
            The hardshell brings together removable coverage, sealed openings,
            layered construction, water resistance, and breathable protection
            in one restrained outer shell.
          </p>
        </div>

        <div className="grid gap-7 @min-[1024px]:grid-cols-[minmax(0,460px)_minmax(0,1fr)] @min-[1024px]:items-start @min-[1024px]:gap-14">
          <div className="relative max-w-[520px] overflow-hidden bg-[#f5f4f1] @min-[1024px]:max-w-none">
            <Image
              src="/work/ulterior/proof/hardshell-green-front-01.webp"
              alt="Ulterior hardshell front proof view"
              width={680}
              height={680}
              sizes="(min-width: 1024px) 460px, (min-width: 640px) 520px, 100vw"
              quality={90}
              className="h-auto w-full"
            />

            <div className="absolute inset-0">
              {POINTS.map((point, index) => {
                const isActive = index === visibleIndex;

                return (
                  <button
                    key={point.number}
                    type="button"
                    aria-label={`Select detail: ${point.title}`}
                    aria-pressed={isActive}
                    onClick={() => selectPoint(index)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onFocus={() => setHoveredIndex(index)}
                    onBlur={() => setHoveredIndex(null)}
                    className={[
                      "absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition",
                      FOCUS_RING,
                      point.marker,
                    ].join(" ")}
                  >
                    <span
                      className={
                        isActive
                          ? "flex h-7 w-7 items-center justify-center rounded-full border border-[#355cad] bg-white text-[0.65rem] font-semibold leading-none text-[#355cad] shadow-sm ring-4 ring-[#355cad]/25 backdrop-blur-sm transition"
                          : "flex h-7 w-7 items-center justify-center rounded-full border border-white/70 bg-white/65 text-[0.65rem] font-semibold leading-none text-[#33333e]/70 shadow-sm backdrop-blur-sm transition hover:border-white hover:bg-white/90 hover:text-[#33333e]"
                      }
                    >
                      {point.number}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="@min-[1024px]:w-full @min-[1024px]:max-w-[540px]">
            <p className="mb-4 text-[0.75rem] uppercase leading-4 tracking-[0.14em] text-[#6f6f76]">
              Product details
            </p>

            <div className="border-t border-[#e6e6e6]">
              {POINTS.map((point, index) => {
                const isActive = index === visibleIndex;

                return (
                  <button
                    key={point.number}
                    type="button"
                    aria-label={`Select detail: ${point.title}`}
                    aria-pressed={isActive}
                    onClick={() => selectPoint(index)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onFocus={() => setHoveredIndex(index)}
                    onBlur={() => setHoveredIndex(null)}
                    className={[
                      "group grid w-full grid-cols-[2.5rem_1fr] items-center gap-4 border-b border-[#e6e6e6] py-3.5 text-left transition",
                      FOCUS_RING,
                    ].join(" ")}
                  >
                    <span
                      className={
                        isActive
                          ? "text-[0.72rem] font-semibold leading-none tracking-[0.08em] text-[#355cad] transition"
                          : "text-[0.72rem] font-semibold leading-none tracking-[0.08em] text-[#33333e]/60 transition group-hover:text-[#33333e]/75"
                      }
                    >
                      {point.number}
                    </span>

                    <span
                      className={
                        isActive
                          ? "text-[0.92rem] font-semibold leading-tight tracking-[-0.02em] text-[#33333e] transition"
                          : "text-[0.92rem] font-semibold leading-tight tracking-[-0.02em] text-[#33333e]/75 transition group-hover:text-[#33333e]"
                      }
                    >
                      {point.title}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 min-h-[6.5rem] max-w-[42ch]">
              <p className="text-[0.72rem] font-semibold leading-none tracking-[0.08em] text-[#355cad]">
                {visiblePoint ? visiblePoint.number : "Detail map"}
              </p>

              <p className="mt-3 text-base font-semibold leading-tight tracking-[-0.02em] text-[#33333e]">
                {visiblePoint
                  ? visiblePoint.title
                  : "Explore the shell construction."}
              </p>

              <p className="mt-2.5 text-[0.9rem] leading-6 text-[#33333e]/75">
                {visiblePoint
                  ? visiblePoint.body
                  : "Select a detail on the jacket or in the list to see how the hardshell is built."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
