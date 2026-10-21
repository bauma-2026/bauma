"use client";

import { Fragment } from "react";
import Image from "next/image";

import MiniHeroGlowBackground from "./MiniHeroGlowBackground";
import MiniHeroPhotoBackground from "./MiniHeroPhotoBackground";
import "./MiniHeroSentence.css";
import {
  HomeHeroCta,
  HomeHeroProvider,
} from "@/components/home/hero-system";

type MiniHeroHeadline =
  | {
      /** Two fixed lines, broken after `line1`. Used by `/mini` and `/en/mini`. */
      line1: string;
      line2: string;
      headline?: never;
    }
  | {
      /** One sentence that wraps naturally (no forced break). Used by `/` and `/en`. */
      headline: string;
      /**
       * Phrase inside `headline` that must not wrap apart in the desktop headline (kept together
       * with `white-space: nowrap`, applied only from 768 to 840px in MiniHeroSentence.css).
       */
      headlineKeep?: string;
      line1?: never;
      line2?: never;
    };

export type MiniHeroCopy = MiniHeroHeadline & {
  eyebrow?: string;
  support: string;
  /** Viewport width (px) from which the "\n" in `support` breaks; narrower wraps naturally. */
  supportBreakFrom?: 375 | 400;
  secondaryCta: string;
  primaryCta: string;
};

const DEFAULT_COPY: MiniHeroCopy = {
  line1: "Jasna struktura.",
  line2: "Več odločitev.",
  support:
    "Delam s podjetji, ki imajo dobro ponudbo,\na se to na njihovi spletni strani ne vidi.",
  secondaryCta: "Poglejte pristop",
  primaryCta: "Opišite projekt",
};

/** Static class pairs so Tailwind generates them: [break, mobile space]. */
const SUPPORT_BREAK_CLASSES = {
  375: ["hidden min-[375px]:block", "min-[375px]:hidden"],
  400: ["hidden min-[400px]:block", "min-[400px]:hidden"],
} as const;

function splitLastWord(line: string): [string, string] {
  const lastSpace = line.lastIndexOf(" ");
  if (lastSpace === -1) return ["", line];
  return [line.slice(0, lastSpace), line.slice(lastSpace + 1)];
}

export default function MiniHero({
  copy = DEFAULT_COPY,
  secondaryHref = "#approach",
  secondaryLabel,
  backgroundSrc = "/images/atmosphere/road-evening-01.jpg",
  backgroundPosition = "object-center lg:object-[52%_center]",
  glowBackground = false,
  photoBackground = false,
}: {
  copy?: MiniHeroCopy;
  /** Target of the secondary CTA. Default keeps `/` and `/en` unchanged; `/mini` has no Approach section and overrides it. */
  secondaryHref?: string;
  /** Overrides `copy.secondaryCta` so the label can match an overridden target. */
  secondaryLabel?: string;
  /** Hero background image. Default keeps `/`, `/en` and `/en/mini` unchanged. */
  backgroundSrc?: string;
  /** Tailwind object-position classes for the background image. */
  backgroundPosition?: string;
  /** Replaces the photograph and its overlays with the CSS glow field (`/mini` test only). */
  glowBackground?: boolean;
  /**
   * Blue Hour road photograph (graded, cropped per breakpoint) instead of the
   * glow or the default photograph. `/` only; wins over `glowBackground`.
   */
  photoBackground?: boolean;
}) {
  /**
   * `phoneBreak` (`/mini` sentence H1, mobile copy only) puts everything after the
   * first comma in a span that is block-level below 600px and inline from 600px up.
   * Below 600px the first line therefore always ends at the comma and the rest
   * balances on its own; from 600px the sentence wraps as one.
   */
  const renderHeadline = (phoneBreak: boolean) => {
    if (copy.headline !== undefined) {
      const comma = phoneBreak ? copy.headline.indexOf(", ") : -1;
      const head = comma === -1 ? null : copy.headline.slice(0, comma + 1);
      const [lead, emphasis] = splitLastWord(
        comma === -1 ? copy.headline : copy.headline.slice(comma + 2),
      );
      const keep = !phoneBreak ? copy.headlineKeep : undefined;
      const at = keep && lead ? lead.indexOf(keep) : -1;
      const leadNode =
        at === -1 ? (
          lead
        ) : (
          <>
            {lead.slice(0, at)}
            <span className="bauma-hero-keep">{keep}</span>
            {lead.slice(at + keep!.length)}
          </>
        );
      const tail = (
        <>
          {lead ? <>{leadNode} </> : null}
          <span className="italic">{emphasis}</span>
        </>
      );
      return head === null ? (
        tail
      ) : (
        <>
          {head}{" "}
          <span className="block min-[600px]:inline">{tail}</span>
        </>
      );
    }
    const [line2Lead, line2Emphasis] = splitLastWord(copy.line2);
    return (
      <>
        {copy.line1}
        <br />
        {line2Lead ? `${line2Lead} ` : null}
        <span className="italic">{line2Emphasis}</span>
      </>
    );
  };
  const headlineContent = renderHeadline(false);
  const sentenceClass = copy.headline !== undefined ? " bauma-hero-h1-sentence" : "";
  const [supportBreakClass, supportSpaceClass] =
    SUPPORT_BREAK_CLASSES[copy.supportBreakFrom ?? 375];

  return (
    <section
      className="relative overflow-hidden border-b border-[color:var(--mini-border-section,color-mix(in_oklab,#fff_10%,transparent))] bg-[#080808] text-white max-lg:h-[91svh] max-lg:min-h-[91svh] max-lg:landscape:h-[100svh] max-lg:landscape:min-h-[100svh]"
      data-hero-edge-hero
    >
      {photoBackground ? (
        <MiniHeroPhotoBackground />
      ) : glowBackground ? (
        <MiniHeroGlowBackground />
      ) : (
        <>
          {/*
            Mobile only: 1.12 scale, origin nudged down and a small upward shift
            so the horizon sits higher and pale sky is reduced.
          */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 max-lg:origin-[50%_76%] max-lg:scale-[1.12] max-lg:-translate-y-[3%]">
              <Image
                src={backgroundSrc}
                alt=""
                fill
                priority
                sizes="100vw"
                className={`pointer-events-none object-cover ${backgroundPosition}`}
              />
            </div>
          </div>
          {/*
            Shared flat overlay — desktop lock. Mobile overlay is a light
            final correction after composition, not the primary contrast tool.
          */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[1] bg-black/[0.16]"
          />
          <div
            aria-hidden="true"
            className="bauma-hero-mobile-readability pointer-events-none absolute inset-0 z-[1] lg:hidden"
          />
        </>
      )}
      <HomeHeroProvider>
        <div className="mini-page-rail bauma-hero-rail relative z-10">
          <div className="relative z-10" data-hero-copy>
            {copy.eyebrow ? (
              <div className="bauma-hero-eyebrow text-[11px] font-medium uppercase tracking-[0.105em]">
                {copy.eyebrow}
              </div>
            ) : null}
            <h1 className={`${copy.eyebrow ? "mt-[11px] " : ""}font-serif font-normal tracking-[-0.025em] text-white`}>
              <span
                className={`bauma-hero-h1-mobile${sentenceClass} font-normal tracking-[-0.025em]`}
              >
                {renderHeadline(true)}
              </span>

              <span className={`bauma-hero-h1-desktop${sentenceClass}`}>
                {headlineContent}
              </span>
            </h1>

            <p
              className={`mt-6 text-white/75 max-lg:text-white/[0.86] ${
                copy.headline !== undefined
                  ? "max-w-[40ch] text-balance"
                  : "max-w-[47ch]"
              }`}
            >
              {/* "\n" = intentional break from `supportBreakFrom` up; narrower phones wrap naturally. */}
              {copy.support.split("\n").map((line, i) => (
                <Fragment key={line}>
                  {i > 0 && (
                    <>
                      <br className={supportBreakClass} />
                      <span className={supportSpaceClass}> </span>
                    </>
                  )}
                  {line}
                </Fragment>
              ))}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3" data-hero-mobile-cta>
              <HomeHeroCta
                label={copy.primaryCta}
                href="#contact"
                variant="amber"
                arrow={false}
              />
              <HomeHeroCta
                label={secondaryLabel ?? copy.secondaryCta}
                href={secondaryHref}
                variant="ghost"
                arrow={false}
              />
            </div>
          </div>
        </div>
      </HomeHeroProvider>
    </section>
  );
}
