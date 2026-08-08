"use client";

import {
  HomeHeroCta,
  HomeHeroField,
  HomeHeroProvider,
} from "@/components/home/hero-system";

/** P10 Variant B — visible mobile field (letterbox viewport). */
const MOBILE_FIELD_PX = 112;
/** Locked V2 object render height (scale); not the visible field. */
const MOBILE_OBJECT_SLOT_PX = 232;
/**
 * Geometry sits slightly above viewBox center; +3px recenters the volume
 * inside the 112px viewport so strokes are not clipped.
 */
const MOBILE_LETTERBOX_NUDGE_Y_PX = 3;

/** P10.1 Variant B — desktop V3 right counterweight (in-column only). */
const DESKTOP_OBJECT_SHIFT_X_PX = 40;

export default function MiniHero() {
  return (
    <section
      className="relative overflow-hidden border-b border-white/10 bg-[#080808] text-white"
      data-hero-edge-field
      data-hero-edge-hero
    >
      <HomeHeroProvider>
        <div className="mini-page-rail relative z-10 grid gap-10 pt-20 pb-0 sm:pt-20 sm:pb-0 lg:min-h-[calc(100vh-52px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-14 lg:py-24">
          <div className="relative z-10">
            <div className="inline-flex items-center rounded-full border border-[#D1A45F]/25 bg-[#D1A45F]/[0.04] px-3 py-1 text-[11px] font-medium text-white/65 shadow-[0_0_24px_rgba(209,164,95,0.07)]">
              Struktura pred obliko
            </div>

            <h1 className="mt-8 font-serif font-normal leading-[0.9] tracking-[-0.025em] text-white sm:leading-[0.94]">
              <span className="block max-w-[9ch] text-[3.75rem] sm:hidden">
                Jasna
                <br />
                struktura.
                <br />
                Več odločitev.
              </span>

              <span className="hidden max-w-[15ch] text-6xl sm:block lg:max-w-[16ch] lg:text-7xl">
                Jasna struktura.
                <br />
                Več odločitev.
              </span>
            </h1>

            <p className="mt-8 max-w-[52ch] text-base leading-7 text-white/55 sm:text-lg">
              Podjetjem pomagam urediti ponudbo, vsebino in pot skozi
              spletno stran, da vse deluje kot jasna in povezana celota.
            </p>

            <div className="mt-9" data-hero-mobile-cta>
              <HomeHeroCta />
            </div>

            <div
              className="mt-10 border-t border-white/[0.08] py-9 sm:py-10 lg:hidden"
              data-hero-mobile-spatial-zone
            >
              <div
                className="relative w-full overflow-hidden"
                style={{ height: MOBILE_FIELD_PX }}
                data-hero-mobile-field
                data-hero-mobile-field-px={MOBILE_FIELD_PX}
              >
                <div
                  className="absolute inset-x-0 top-1/2 w-full [&_[data-hero-visual-root]]:!h-full"
                  style={{
                    height: MOBILE_OBJECT_SLOT_PX,
                    transform: `translateY(calc(-50% + ${MOBILE_LETTERBOX_NUDGE_Y_PX}px))`,
                  }}
                  data-hero-mobile-object-slot
                  data-hero-mobile-object-slot-px={MOBILE_OBJECT_SLOT_PX}
                >
                  <HomeHeroField variant="mobile" />
                </div>
              </div>
            </div>
          </div>

          <div className="hidden min-w-0 lg:block" data-hero-visual-column>
            <div
              data-hero-desktop-object-shift
              data-hero-desktop-shift-x={DESKTOP_OBJECT_SHIFT_X_PX}
              style={{ transform: `translateX(${DESKTOP_OBJECT_SHIFT_X_PX}px)` }}
            >
              <HomeHeroField variant="desktop" />
            </div>
          </div>
        </div>
      </HomeHeroProvider>
    </section>
  );
}
