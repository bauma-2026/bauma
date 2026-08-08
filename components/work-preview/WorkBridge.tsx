"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { useWorkPreview } from "./WorkPreviewProvider";

type BridgeRow =
  | {
      kind: "modal";
      id: string;
      name: string;
      meta: string;
    }
  | {
      kind: "link";
      name: string;
      meta: string;
      href: string;
    };

const rows: BridgeRow[] = [
  {
    kind: "modal",
    id: "flexido",
    name: "Flexido",
    meta: "Industrijski B2B",
  },
  {
    kind: "link",
    name: "Odstrani Tattoo",
    meta: "Zaupanje in konverzija",
    href: "/work/odstrani-tattoo",
  },
  {
    kind: "link",
    name: "Dema Plus",
    meta: "Reference in jasnost",
    href: "/work/dema-plus",
  },
];

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const AMBER = "rgba(209, 164, 95, 0.55)";

function RowArrow() {
  return (
    <span className="work-bridge-row-arrow relative inline-flex shrink-0 items-center justify-end">
      <span
        aria-hidden
        className="work-bridge-row-arrow-mark text-sm leading-none text-white/40"
      >
        →
      </span>
      <span
        aria-hidden
        className="work-bridge-row-arrow-dot absolute right-[-1px] top-1/2 h-[3px] w-[3px] -translate-y-1/2 rounded-full bg-[#d1a45f]/0"
      />
    </span>
  );
}

function BridgeRowButton({
  id,
  name,
  meta,
}: {
  id: string;
  name: string;
  meta: string;
}) {
  const { openPreview, registerTrigger } = useWorkPreview();
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    registerTrigger(id, ref.current);
    return () => registerTrigger(id, null);
  }, [id, registerTrigger]);

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => {
        if (ref.current) openPreview(id, ref.current);
      }}
      className="work-bridge-row group grid min-h-[44px] w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-white/10 py-4 text-left sm:py-[18px]"
    >
      <span className="min-w-0">
        <span className="work-bridge-row-name block text-base font-semibold tracking-[-0.02em] text-white/88">
          {name}
        </span>
        <span className="work-bridge-row-meta mt-0.5 block text-sm text-white/40">
          {meta}
        </span>
      </span>
      <RowArrow />
    </button>
  );
}

function BridgeRowLink({
  name,
  meta,
  href,
}: {
  name: string;
  meta: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="work-bridge-row group grid min-h-[44px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-white/10 py-4 sm:py-[18px]"
    >
      <span className="min-w-0">
        <span className="work-bridge-row-name block text-base font-semibold tracking-[-0.02em] text-white/88">
          {name}
        </span>
        <span className="work-bridge-row-meta mt-0.5 block text-sm text-white/40">
          {meta}
        </span>
      </span>
      <RowArrow />
    </Link>
  );
}

function WorkBridgeEyebrow() {
  return (
    <Link
      href="/work"
      className="work-bridge-eyebrow group relative inline-flex h-[29px] items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.02] px-[11px] text-[10px] font-medium uppercase tracking-[0.18em] text-white/60 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/50"
    >
      <span
        aria-hidden
        className="work-bridge-eyebrow-accent pointer-events-none absolute bottom-0 right-[34px] h-px w-[18px] rounded-full"
        style={{ backgroundColor: AMBER }}
      />
      <span>Iz prakse</span>
      <span
        aria-hidden
        className="work-bridge-eyebrow-arrow text-[11px] leading-none text-white/40"
      >
        →
      </span>
    </Link>
  );
}

export default function WorkBridge() {
  return (
    <section
      id="work-bridge"
      data-section="work-bridge"
      className="scroll-mt-13 border-t border-white/10 bg-[#080808] py-10 text-white sm:py-12 lg:py-14"
    >
      <style>{`
        .work-bridge-eyebrow,
        .work-bridge-eyebrow-accent,
        .work-bridge-eyebrow-arrow,
        .work-bridge-row,
        .work-bridge-row-name,
        .work-bridge-row-meta,
        .work-bridge-row-arrow-mark,
        .work-bridge-row-arrow-dot,
        .work-bridge-cta {
          transition-duration: 280ms;
          transition-timing-function: ${EASE};
        }

        .work-bridge-eyebrow {
          transition-property: border-color, color, background-color;
        }

        .work-bridge-eyebrow-accent {
          transition-property: width, opacity;
        }

        .work-bridge-eyebrow-arrow {
          transition-property: transform, color;
        }

        .work-bridge-row {
          transition-property: border-color;
        }

        .work-bridge-row-name,
        .work-bridge-row-meta,
        .work-bridge-row-arrow-mark,
        .work-bridge-row-arrow-dot {
          transition-property: color, transform, opacity, background-color;
        }

        .work-bridge-cta {
          transition-property: color;
        }

        @media (hover: hover) {
          .work-bridge-eyebrow:hover {
            border-color: rgba(255, 255, 255, 0.15);
            background-color: rgba(255, 255, 255, 0.025);
            color: rgba(255, 255, 255, 0.72);
          }

          .work-bridge-eyebrow:hover .work-bridge-eyebrow-accent {
            width: 22px;
            opacity: 0.65;
          }

          .work-bridge-eyebrow:hover .work-bridge-eyebrow-arrow {
            transform: translateX(2px);
            color: rgba(255, 255, 255, 0.58);
          }

          .work-bridge-row:hover {
            border-color: rgba(255, 255, 255, 0.15);
          }

          .work-bridge-row:hover .work-bridge-row-name {
            color: rgba(255, 255, 255, 0.96);
          }

          .work-bridge-row:hover .work-bridge-row-meta {
            color: rgba(255, 255, 255, 0.52);
          }

          .work-bridge-row:hover .work-bridge-row-arrow-mark {
            transform: translateX(5px);
            color: rgba(255, 255, 255, 0.58);
          }

          .work-bridge-row:hover .work-bridge-row-arrow-dot {
            background-color: rgba(209, 164, 95, 0.55);
          }

          .work-bridge-cta:hover {
            color: rgba(255, 255, 255, 0.92);
          }

          .work-bridge-cta:hover .work-bridge-cta-arrow {
            transform: translateX(3px);
          }
        }

        /* Keyboard-only — matches Work CTA / eyebrow focus language. Rest/hover unchanged. */
        .work-bridge-row:focus {
          outline: none;
        }

        .work-bridge-row:focus-visible {
          border-color: rgba(255, 255, 255, 0.15);
          outline: 1px solid rgba(255, 255, 255, 0.5);
          outline-offset: 4px;
        }

        .work-bridge-row:focus-visible .work-bridge-row-name {
          color: rgba(255, 255, 255, 0.96);
        }

        .work-bridge-row:focus-visible .work-bridge-row-meta {
          color: rgba(255, 255, 255, 0.52);
        }

        .work-bridge-row:focus-visible .work-bridge-row-arrow-mark {
          transform: translateX(5px);
          color: rgba(255, 255, 255, 0.58);
        }

        .work-bridge-row:focus-visible .work-bridge-row-arrow-dot {
          background-color: rgba(209, 164, 95, 0.55);
        }

        @media (prefers-reduced-motion: reduce) {
          .work-bridge-eyebrow,
          .work-bridge-eyebrow-accent,
          .work-bridge-eyebrow-arrow,
          .work-bridge-row,
          .work-bridge-row-name,
          .work-bridge-row-meta,
          .work-bridge-row-arrow-mark,
          .work-bridge-row-arrow-dot,
          .work-bridge-cta,
          .work-bridge-cta-arrow {
            transition-duration: 0ms !important;
          }

          .work-bridge-eyebrow:hover .work-bridge-eyebrow-arrow,
          .work-bridge-row:hover .work-bridge-row-arrow-mark,
          .work-bridge-cta:hover .work-bridge-cta-arrow,
          .work-bridge-row:focus-visible .work-bridge-row-arrow-mark {
            transform: none;
          }
        }
      `}</style>

      <div className="mini-page-rail">
        <header className="max-w-[540px]">
          <WorkBridgeEyebrow />

          <h2 className="home-bridge-heading mt-6 max-w-[18ch] sm:mt-7 sm:max-w-[20ch] lg:max-w-[16ch]">
            Kako jasna struktura izgleda v praksi.
          </h2>
        </header>

        <div className="mt-11 border-t border-white/10 sm:mt-12 lg:mt-14">
          {rows.map((row) =>
            row.kind === "modal" ? (
              <BridgeRowButton
                key={row.id}
                id={row.id}
                name={row.name}
                meta={row.meta}
              />
            ) : (
              <BridgeRowLink
                key={row.href}
                name={row.name}
                meta={row.meta}
                href={row.href}
              />
            ),
          )}
        </div>

        <div className="mt-8 sm:mt-9">
          <Link
            href="/work"
            className="work-bridge-cta group inline-flex items-center gap-1.5 text-sm font-medium text-white/65 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/50"
          >
            Poglej izbrano delo
            <span
              aria-hidden
              className="work-bridge-cta-arrow inline-block transition-transform"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
