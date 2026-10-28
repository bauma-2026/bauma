"use client";

import Link from "next/link";
import { useState } from "react";

import MiniProjectCube from "./MiniProjectCube";
import { localizedPath, type Locale } from "@/lib/i18n/routes";

import "./MiniProjectPocket.css";

/**
 * Homepage "Za začetek" (SL), used only by `app/(sl)/page.tsx` between Selected Work and the contact, in the pocket pattern of
 * `MiniSystemPocket` (text left, small cube right). `MiniMidPageCta` stays as it was for `/mini` and `/en/mini`.
 * The way in is a quiet text link to `/pristop` (the "Vsi projekti" link pattern from `MiniSelectedWorkHome`); the
 * contact below keeps the closing action. Layout lives in `MiniProjectPocket.css` (everything under `.mpp`).
 *
 * The link drives the cube (`MiniProjectCube` `cue`): hovered or focused = active (stays active while focused after the
 * pointer leaves); pointerdown or Enter = pressed, cleared on pointerup / pointercancel / leaving while pressed / keyup /
 * blur. Nothing here prevents or delays the link's own navigation: click, Enter, modifier and middle clicks are native.
 */

export type MiniProjectPocketCopy = {
  eyebrow: string;
  heading: string;
  body: string;
  /** Label of the link to the approach page. */
  link: string;
};

/** Approved Slovenian copy, the default; another language passes its own `copy` and `locale`. */
const COPY: MiniProjectPocketCopy = {
  eyebrow: "ZA ZAČETEK",
  heading: "Ni treba, da imate že vse razdelano.",
  body: "Opišite, kaj želite urediti ali kaj na obstoječi strani ne deluje. Na podlagi tega razjasnimo potrebe ter predlagamo obseg in ponudbo.",
  link: "Kako sodelujemo",
};

/** Same focus ring and arrow nudge as the homepage text links (`MiniSelectedWorkHome`). */
const LINK_FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--mini-accent-text,#fff)]";
const ARROW = "inline-block transition-transform duration-300 group-hover:translate-x-[3px]";

export default function MiniProjectPocket({
  copy = COPY,
  locale = "sl",
}: {
  copy?: MiniProjectPocketCopy;
  /**
   * Page language, for the link target (`localizedPath`): Slovenian links to `/pristop`; English links to its English
   * page once that is live, until then to `/pristop` with `hrefLang="sl"`.
   */
  locale?: Locale;
}) {
  const approach = localizedPath("/pristop", locale);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <section aria-labelledby="mpp-heading" className="mpp">
      <div className="mini-page-rail mpp-rail">
        <div className="mpp-text">
          <p className="uppercase">{copy.eyebrow}</p>
          <h2 id="mpp-heading" className="mpp-h">
            {copy.heading}
          </h2>
          <p className="mpp-body">{copy.body}</p>
          <div className="mpp-action">
            <Link
              href={approach.href}
              hrefLang={approach.hrefLang}
              onPointerEnter={() => setHovered(true)}
              onPointerLeave={() => {
                setHovered(false);
                setPressed(false);
              }}
              onPointerDown={() => setPressed(true)}
              onPointerUp={() => setPressed(false)}
              onPointerCancel={() => setPressed(false)}
              onFocus={() => setFocused(true)}
              onBlur={() => {
                setFocused(false);
                setPressed(false);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") setPressed(true);
              }}
              onKeyUp={(event) => {
                if (event.key === "Enter") setPressed(false);
              }}
              className={`group inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-white/65 transition-colors duration-300 hover:text-white/92 ${LINK_FOCUS}`}
            >
              {copy.link}
              <span aria-hidden="true" className={ARROW}>
                →
              </span>
            </Link>
          </div>
        </div>
        <div className="mpp-figure">
          <MiniProjectCube
            className="mpp-cube"
            svgClassName="mpp-cube-svg"
            scrollGain={2.2}
            cropWidth={220}
            palette="royal"
            cue={{ active: hovered || focused, pressed }}
          />
        </div>
      </div>
    </section>
  );
}
