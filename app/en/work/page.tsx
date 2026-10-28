import type { Metadata } from "next";

import WorkIndex, { type WorkIndexCopy } from "@/app/components/work/WorkIndex";
import { EN_FOOTER_COPY, EN_HEADER_COPY } from "@/app/components/blocks/mini/enChromeCopy";
import { EN_HOME_CONTACT } from "@/app/components/blocks/mini/enHomeCopy";
import { EN_PRIMARY_NAV } from "@/lib/i18n/routes";

/**
 * Title only. Indexing stays the EN layout default (noindex, no canonical or hreflang) and the page is not in the
 * sitemap; description and social metadata follow in the SEO pass.
 */
export const metadata: Metadata = {
  title: "Selected web projects — Bauma",
};

/** Approved English copy of the Work index. Project names and the clients' artwork are not translated. */
const WORK_INDEX_EN: WorkIndexCopy = {
  heading: "Selected work.",
  lead: "Websites and digital solutions. From the starting point and key decisions to design and a working build.",
  descriptors: {
    flexido: "Industrial B2B",
    ulterior: "Product presentation and purchase system",
    "odstrani-tattoo": "Trust and conversion",
    "dema-plus": "Track record and clarity",
    artbite: "Tattoo studio website",
    hardshelljacket: "A product on a single page",
  },
  alts: {
    ulterior: "White hardshell jacket on a hanger",
    artbiteHorses: "Tattoo of two horses with a dreamcatcher",
    artbiteWatch: "Tattoo of a pocket watch with a feather",
    hardshelljacket: "Man in a dark olive hardshell jacket in front of a concrete wall",
  },
  conclusion: {
    eyebrow: "From concept to delivery",
    heading: "Different projects. One approach.",
    body: "At Bauma we plan, design and develop websites for companies, products and services. We start every project by understanding the content, the client’s needs and the visitor’s path. The result is clear, well-organized and carefully planned digital presentations.",
  },
};

/**
 * Work (English): the shared Work index (`app/components/work/WorkIndex.tsx`), as on /work, with the English copy. The six
 * cards link to the Slovenian case studies with `hrefLang="sl"` until their English pages are live (EN-005), and the
 * shared surfaces keep their Slovenian client headlines (`lang="sl"`). The closing is the English home page's.
 * Not linked from the English navigation or the language switch until it is activated in `lib/i18n/routes.ts`.
 */
export default function EnglishWorkPage() {
  return (
    <WorkIndex
      copy={WORK_INDEX_EN}
      locale="en"
      headerCopy={EN_HEADER_COPY}
      primaryNav={EN_PRIMARY_NAV}
      closingCopy={EN_HOME_CONTACT}
      footerCopy={EN_FOOTER_COPY}
    />
  );
}
