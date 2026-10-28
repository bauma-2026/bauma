import type { Metadata } from "next";
import type { CSSProperties } from "react";

import MiniClosingBookend from "@/app/components/blocks/mini/MiniClosingBookend";
import MiniHeader from "@/app/components/blocks/mini/MiniHeader";
import MiniPalette from "@/app/components/blocks/mini/MiniPalette";
import MiniSelectedWorkHome from "@/app/components/blocks/mini/MiniSelectedWorkHome";
import {
  EN_FOOTER_COPY,
  EN_HEADER_COPY,
  EN_PAGE_CLOSING,
} from "@/app/components/blocks/mini/enChromeCopy";
import { EN_HOME_WORK } from "@/app/components/blocks/mini/enHomeCopy";
import { homeMono } from "@/app/homeMono";
import { EN_PRIMARY_NAV } from "@/lib/i18n/routes";
import "@/app/homeTypography.css";
import "@/app/homeTypographyV11.css";

import "@/app/(sl)/o-nas/ONas.css";

/**
 * Title only. Indexing stays the EN layout default (noindex, no canonical or hreflang) and the page is not in the
 * sitemap; description and social metadata follow in the SEO pass.
 */
export const metadata: Metadata = {
  title: "About: a digital studio — Bauma",
};

/** Selected Work as on /o-nas: the Work surface tone plus the V1.1 type scope, on this wrapper only. */
const SELECTED_WORK_SCOPE = { "--mini-surface-work": "#0f141c" } as CSSProperties;

/**
 * About (English): the structure, wrappers and CSS of /o-nas (`app/(sl)/o-nas/page.tsx`, `ONas.css`) with the approved
 * English copy. Bauma speaks as the studio ("we"); Gregor Baumgartner speaks in the personal part (first person
 * singular) and signs it with his own address. Keep the two pages in step; only the copy and the language props differ.
 * Not linked from the English navigation or the language switch until it is activated in `lib/i18n/routes.ts`.
 */
export default function AboutPage() {
  return (
    <div data-home-typography data-o-nas className={homeMono.variable}>
      <MiniPalette>
        <MiniHeader
          hideApproachNav
          refined
          locale="en"
          copy={EN_HEADER_COPY}
          primaryNav={EN_PRIMARY_NAV}
          contactHref="#contact"
        />

        <main className="onas">
          <section className="onas-hero" aria-labelledby="onas-h1">
            <div className="mini-page-rail">
              <p className="uppercase">ABOUT</p>
              <h1 id="onas-h1" className="onas-h1">
                Design and development under one roof.
              </h1>
              <p className="onas-lead">
                Bauma is a digital studio for websites and digital solutions. We bring planning, design and development
                together — from the first brief to delivery.
              </p>
            </div>
          </section>

          <section className="onas-text">
            <div className="mini-page-rail">
              <div className="onas-col">
                <p className="onas-body">
                  Every project has its own starting point. Sometimes an extensive offering needs to be organized;
                  elsewhere it’s about presenting past work or simplifying the path to an inquiry or a purchase. First we
                  clarify what the solution needs to do and what information its users need. From that, we build the
                  structure, content and design.
                </p>
                <p className="onas-body">
                  We often start from something that already exists. We keep what works, remove obstacles and improve
                  what needs to change. It matters to us that the solution is easy to use and sensibly built for further
                  development.
                </p>
                <div className="onas-closing">
                  <p className="onas-body">
                    I’m Gregor Baumgartner, and I run Bauma. I lead projects from concept to launch and bring content,
                    design and development together.
                  </p>
                  <p className="onas-body">
                    My digital career began in the late 1990s, supporting the early online banking services NLB Klik and
                    Proklik. In 2005 I graduated from IED in Turin, specializing in Digital &amp; Virtual Design. I then
                    worked in advertising agencies, where as an interactive designer I designed and built websites and
                    produced digital campaign materials, from banners and newsletters to video animations. Later I
                    continued independently with Bauma.
                  </p>
                  <p className="onas-body">
                    Today I bring this experience together in websites and digital solutions. I work directly with each
                    client throughout the project, from the first questions to final delivery.
                  </p>
                  <p className="onas-signature">Gregor Baumgartner</p>
                  {/* Gregor's personal address; the studio's general contact (info@) stays in the contact section below. */}
                  <p className="onas-signature-mail">
                    <a href="mailto:gregor@bauma.si">gregor@bauma.si</a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div data-home-typography data-home-v11 style={SELECTED_WORK_SCOPE}>
            <MiniSelectedWorkHome
              topRule={false}
              heading="Selected work."
              eyebrow={false}
              lift
              copy={EN_HOME_WORK}
              locale="en"
              artLang="sl"
            />
          </div>
        </main>

        <MiniClosingBookend
          variant="graphite"
          photoBackground
          topRule={false}
          tone="natural-midnight"
          ctaCopy={EN_PAGE_CLOSING}
          footerCopy={EN_FOOTER_COPY}
        />
      </MiniPalette>
    </div>
  );
}
