"use client";

import { useEffect, useRef, useState } from "react";

import { VisualProofC3 } from "../visual/VisualProofObjects";

/**
 * VISUAL LAYER
 *
 * Position on the page is the whole point. The four sections escalate:
 *   Hero          → right column is a plain numbered list (no object)
 *   Decision flow → two chip cards, the densest text pattern
 *   Pristop       → hairline-separated list (no object)
 *   System layer   → a literal UI window: chrome, typing code, table rows
 *
 * System layer is the heaviest, most representational artifact on the page.
 * This section resolves the argument, so it inverts that weight: same column
 * position, same container and type scale, but the lightest and most abstract
 * mark on the page. Section vocabulary is copied from the neighbours exactly
 * (border-t, #080808, py rhythm, max-w-[1100px], eyebrow, h2 scale, body copy)
 * so nothing here reads as a new layout idea.
 */

const sequence = ["Pot", "Oblika", "Občutek"];

export default function VisualLayerSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden border-t border-white/10 bg-[#080808] py-16 text-white sm:py-20 lg:py-24"
    >
      <div className="mx-auto grid max-w-[1100px] min-w-0 gap-10 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-12 lg:px-8">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/35">
            Visual layer
          </p>

          <h2 className="mt-4 max-w-[12ch] text-3xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:max-w-[14ch] sm:text-5xl sm:leading-[0.95] sm:tracking-[-0.045em] lg:text-6xl">
            Oblika pride po jasnosti.
          </h2>

          <p className="mt-5 max-w-[48ch] text-sm leading-6 text-white/55 sm:text-base sm:leading-7">
            Ko je pot jasna, lahko vizual, gibanje in mikrointerakcije dodajo
            občutek sistema — brez da prevzamejo pozornost.
          </p>

          {/* same "→" step vocabulary the decision flow already uses */}
          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/45">
            {sequence.map((step, index) => (
              <div key={step} className="flex items-center gap-3">
                <span
                  className={
                    index === sequence.length - 1
                      ? "text-white/70"
                      : "text-white/45"
                  }
                >
                  {step}
                </span>

                {index < sequence.length - 1 && (
                  <span className="text-white/25">→</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* the proof object holds the same right-column slot as the system
            layer window, at a fraction of its ink */}
        <div className="group min-w-0 lg:pl-6">
          <div
            className={[
              "mx-auto w-full max-w-[520px] transition-all duration-[1200ms] ease-out",
              isRevealed
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0",
            ].join(" ")}
          >
            <VisualProofC3 />
          </div>
        </div>
      </div>
    </section>
  );
}
