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

import "@/app/(sl)/pristop/PristopPage.css";

/**
 * Title only. Indexing stays the EN layout default (noindex, no canonical or hreflang) and the page is not in the
 * sitemap; description and social metadata follow in the SEO pass.
 */
export const metadata: Metadata = {
  title: "Approach: from a short description to completion — Bauma",
};

type Role = "you" | "bauma";

/** `data-role` keeps the Slovenian values the shared CSS may key on (`vi`, `bauma`). */
const ROLE: Record<Role, { label: string; data: string }> = {
  you: { label: "You", data: "vi" },
  bauma: { label: "Bauma", data: "bauma" },
};

/** Each phase lists its roles in the real order of actions (as on /pristop). */
const PHASES: { n: string; name: string; roles: { role: Role; text: string }[] }[] = [
  {
    n: "01",
    name: "Start",
    roles: [
      {
        role: "you",
        text: "You describe by email what you want to change and who the site is for. If you already have an existing site, texts, images or examples you like, attach them.",
      },
      { role: "bauma", text: "We review your description and clarify open questions by email." },
    ],
  },
  {
    n: "02",
    name: "Agreement",
    roles: [
      { role: "bauma", text: "We prepare a proposed scope and a quote." },
      { role: "you", text: "You review and confirm the scope and the quote." },
    ],
  },
  {
    n: "03",
    name: "Implementation",
    roles: [
      {
        role: "bauma",
        text: "We design and build the agreed solution. When we need your materials or input, we email you.",
      },
      { role: "you", text: "You provide the agreed materials and feedback." },
    ],
  },
  {
    n: "04",
    name: "Review and completion",
    roles: [
      { role: "you", text: "You review the finished work and send us your comments." },
      { role: "bauma", text: "We make the agreed changes. If launch is included, we also publish the site." },
    ],
  },
];

/** Selected Work exactly as on /pristop: the homepage Work surface tone and the V1.1 type scope, on this wrapper only. */
const SELECTED_WORK_SCOPE = { "--mini-surface-work": "#0f141c" } as CSSProperties;

/**
 * Approach (English): the structure, wrappers and CSS of /pristop (`app/(sl)/pristop/page.tsx`, `PristopPage.css`)
 * with the approved English copy. Keep the two pages in step; only the copy and the language props differ.
 * Not linked from the English navigation or the language switch until it is activated in `lib/i18n/routes.ts`.
 */
export default function ApproachPage() {
  return (
    <div data-home-typography data-pristop-page className={homeMono.variable}>
      <MiniPalette>
        <MiniHeader
          hideApproachNav
          refined
          locale="en"
          copy={EN_HEADER_COPY}
          primaryNav={EN_PRIMARY_NAV}
          contactHref="#contact"
        />

        <main className="apw">
          <section className="apw-hero" aria-labelledby="apw-h1">
            <div className="mini-page-rail">
              <p className="uppercase">APPROACH</p>
              <h1 id="apw-h1" className="apw-h1">
                Every project starts with a short description.
              </h1>
              <p className="apw-lead">
                A few sentences about what you want to change are enough to start. You don’t need to have everything
                ready: we work through the open questions together, then propose a scope and a quote.
              </p>
              <p className="apw-written">
                <span className="apw-role">Coordination</span>
                Most of the coordination happens by email. We arrange a call or meeting when one is needed. Gregor
                Baumgartner leads the project from start to launch.
              </p>
            </div>
          </section>

          <section className="apw-process" aria-labelledby="apw-process-h">
            <div className="mini-page-rail">
              <div className="apw-col">
                <p className="uppercase">HOW WE WORK TOGETHER</p>
                <h2 id="apw-process-h" className="apw-h2">
                  From first description to completion.
                </h2>
                <ol className="apw-steps">
                  {PHASES.map((p) => (
                    <li key={p.n} className="apw-step">
                      <p className="apw-num" aria-hidden="true">
                        {p.n}
                      </p>
                      <h3 className="apw-step-title">{p.name}</h3>
                      <dl className="apw-roles">
                        {p.roles.map((r) => (
                          <div key={r.role} data-role={ROLE[r.role].data}>
                            <dt className="apw-role">{ROLE[r.role].label}</dt>
                            <dd>{r.text}</dd>
                          </div>
                        ))}
                      </dl>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section className="apw-scope" aria-labelledby="apw-scope-h">
            <div className="mini-page-rail">
              <div className="apw-col">
                <p className="uppercase">SCOPE</p>
                <h2 id="apw-scope-h" className="apw-h2">
                  We agree on what the project includes.
                </h2>
                <p className="apw-body">
                  Some projects cover everything from structure to launch, others just one part. If you already have
                  content, a design or a working site, we build on that. What’s included is set out in the proposal.
                </p>
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
