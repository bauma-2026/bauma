import Image from "next/image";

/**
 * Non-interactive reconstruction of a project detail page on the new Dema Plus
 * site (Next.js, served at demaplus.si; checked live on 2026-10-27): "Vila
 * Rožna dolina", at https://demaplus.si/reference/novogradnja-objekta-vila-rozna-dolina-condominium
 * (the slug comes from the site's own project data, projects.meta.ts and
 * FeaturedProjects.tsx in the local demaplus-next repo, read only).
 *
 * Source of truth for text and structure: the live page and demaplus-next
 * `src/app/reference/[slug]/page.tsx`, `ProjectBody.tsx`, `ProjectMeta.tsx` and
 * `RelatedProjectsEditorial.tsx`; project text and meta values from
 * `src/content/projects.generated.ts` / `projects.meta.generated.ts`. Wording is
 * reproduced as published; nothing is added.
 * - Image: the project visualisation, byte-identical to the existing
 *   `public/work/dema-plus/proof/vila-rozna-dolina.webp` (also the card image of
 *   the References proof). It is a visualisation of the building, not a photograph
 *   of the finished object. The three related-project thumbnails are the sites'
 *   `public/reference/<slug>/hero.webp`, copied byte-identical.
 * - Tokens: Tailwind's default neutral ramp (oklch), the system font stack, the
 *   brand tint `rgba(143,166,178,0.1)` for the related band (as #f4f6f7 on white)
 *   and `#f7f8f9` for the meta card. Written as literals, so a Bauma theme
 *   change cannot move them. Same convention as DemaPlusReferencesProof.
 *
 * Responsive logic is the original's, with container queries
 * (`@min-[640px]` / `@min-[1024px]` = sm / lg), so the layout follows the width
 * this block is given.
 *
 * Deliberately different from the source:
 * - Static: no links, hover states or scroll-in motion. The "Nazaj", previous /
 *   next labels, project cards and "Vse reference" are plain text.
 * - The site header and footer and the cookie notice are not reproduced.
 * - Related projects: the first three of the source's four (three columns from
 *   1024), so the band ends on a full row.
 * - Headings are configurable so the block never adds a document-level h1.
 */

const FONT_STACK =
  'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

const PROJECT = {
  title: "Vila Rožna dolina",
  subtitle: "Novogradnja večstanovanjskega objekta",
  excerpt:
    "Nizkoenergijski večstanovanjski objekt v Rožni dolini z devetimi stanovanji, leseno konstrukcijo in urejeno zunanjo ureditvijo.",
  paragraphs: [
    "Projekt obsega novogradnjo nizkoenergijskega večstanovanjskega objekta z devetimi stanovanji v ljubljanski Rožni dolini. Objekt vključuje klet, pritličje, dve nadstropji in terasno etažo ter je zasnovan z jasnim poudarkom na kakovosti bivanja in učinkoviti organizaciji prostora.",
    "V kletni etaži so urejena parkirna mesta, kolesarnica, shrambe, hodniki ter osebno in avtomobilsko dvigalo. Skupno je predvidenih 15 parkirnih mest v kleti, dve parkirni mesti za obiskovalce in eno kratkotrajno parkirno mesto na nivoju terena.",
    "Objekt je temeljen na betonskih pilotih in temeljni plošči. Stene ter plošča nad kletjo so armiranobetonske izvedbe, preostali nosilni del objekta pa je zasnovan v leseni konstrukciji, tako v stenah kot v stropnih ploščah. Fasada je predvidena v kontaktni izvedbi.",
    "Dostop do objekta je urejen preko asfaltiranega prometnega priključka, zunanja ureditev pa vključuje tlakovane poti, zelenice, pritlične terase in otroško igrišče.",
  ],
  meta: [
    { label: "Kategorije", value: "Javni objekti, Stanovanjski objekti" },
    { label: "Naročnik", value: "ASSETCO d.o.o." },
    { label: "Lokacija izvedbe", value: "Večna pot 81, Ljubljana" },
  ],
  image: "/work/dema-plus/proof/vila-rozna-dolina.webp",
  imageAlt: "Vizualizacija objekta Vila Rožna dolina",
  nextTitle: "Hotel Nox Ljubljana",
} as const;

const RELATED = [
  {
    title: "Center Obala Debeli rtič",
    label: "Stanovanjski objekt",
    location: "Debeli Rtič",
    image: "/work/dema-plus/proof/related-debeli-rtic.webp",
  },
  {
    title: "Center Četrtne skupnosti Golovec",
    label: "Stanovanjski objekt",
    location: "Ljubljana – Golovec",
    image: "/work/dema-plus/proof/related-golovec.webp",
  },
  {
    title: "Hiša Sonček",
    label: "Stanovanjski objekt",
    location: "Ljubljana",
    image: "/work/dema-plus/proof/related-hisa-soncek.webp",
  },
] as const;

const BORDER = "border-[oklch(0.922_0_0)]";
const EYEBROW =
  "text-[11px] font-medium uppercase leading-[1.5] tracking-[0.1em] text-[oklch(0.556_0_0)]";

export default function DemaPlusProjectProof({
  headingLevel = 2,
}: {
  /** Level of the project title; "O projektu" and "Sorodne reference" sit one level below, card titles two. */
  headingLevel?: 2 | 3;
}) {
  const Title = `h${headingLevel}` as "h2" | "h3";
  const Sub = `h${headingLevel + 1}` as "h3" | "h4";
  const Card = `h${headingLevel + 2}` as "h4" | "h5";

  return (
    <div
      className="@container bg-[#ffffff] text-[#111827] antialiased [text-rendering:geometricPrecision]"
      style={{ fontFamily: FONT_STACK }}
    >
      <div className="mx-auto max-w-[80rem] px-5">
        {/* Utility row: back label and muted previous / next labels (text only here). */}
        <div className="flex items-center justify-between gap-4 pt-8 text-sm leading-none @min-[640px]:pt-10">
          <span className="inline-flex items-center gap-2 text-sm text-[oklch(0.439_0_0)]">
            <span aria-hidden="true" className="text-sm leading-none">
              ←
            </span>
            <span>Nazaj</span>
          </span>

          <div className="hidden items-center gap-4 @min-[1024px]:flex">
            <span className="text-xs text-[oklch(0.87_0_0)]">Prejšnji projekt</span>
            <span aria-hidden="true" className="text-[oklch(0.87_0_0)]">
              •
            </span>
            <span className="text-xs text-[oklch(0.708_0_0)]">Naslednji projekt</span>
          </div>
        </div>

        {/* Intro: image left, title, subtitle and summary right. */}
        <div className="mt-6 grid gap-6 @min-[640px]:mt-8 @min-[1024px]:grid-cols-[1.25fr_1fr] @min-[1024px]:items-start @min-[1024px]:gap-12">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[oklch(0.97_0_0)]">
            <Image
              src={PROJECT.image}
              alt={PROJECT.imageAlt}
              fill
              sizes="(min-width: 1216px) 700px, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <Title className="text-[30px] font-semibold leading-[1.08] tracking-[-0.025em] text-[oklch(0.205_0_0)] @min-[640px]:text-4xl">
              {PROJECT.title}
            </Title>
            <p className="mt-2 text-base text-[oklch(0.556_0_0)]">{PROJECT.subtitle}</p>
            <div
              className={`mt-4 @min-[1024px]:mt-6 @min-[1024px]:border-t ${BORDER} @min-[1024px]:pt-6`}
            >
              <p className="max-w-[60ch] text-base leading-relaxed text-[oklch(0.439_0_0)]">
                {PROJECT.excerpt}
              </p>
            </div>
          </div>
        </div>

        {/* Description and project facts. */}
        <div
          className={`mt-8 grid gap-8 border-t ${BORDER} pt-6 @min-[640px]:mt-10 @min-[640px]:pt-8 @min-[1024px]:mt-12 @min-[1024px]:grid-cols-[1.25fr_1fr] @min-[1024px]:items-start @min-[1024px]:gap-12`}
        >
          <div>
            <Sub className="text-lg font-medium tracking-[-0.025em] text-[oklch(0.269_0_0)] @min-[640px]:text-xl">
              O projektu
            </Sub>
            <div className="mt-4 max-w-[72ch] @min-[640px]:mt-5">
              {PROJECT.paragraphs.map((text, i) => {
                const first = i === 0;
                const last = i === PROJECT.paragraphs.length - 1;
                return (
                  <p
                    key={i}
                    className={[
                      first
                        ? "mt-7 text-lg leading-[1.85] text-[oklch(0.269_0_0)]"
                        : "text-base leading-[1.75] text-[oklch(0.371_0_0)]",
                      !first && !last ? "mt-7" : "",
                      last && !first ? "mt-12" : "",
                    ].join(" ")}
                  >
                    {text}
                  </p>
                );
              })}
            </div>
          </div>

          <dl
            className={`flex flex-col gap-5 rounded-2xl border ${BORDER} bg-[#f7f8f9] px-5 py-5 text-sm @min-[640px]:gap-6 @min-[640px]:px-6 @min-[640px]:py-6`}
          >
            {PROJECT.meta.map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <dt className={EYEBROW}>{item.label}</dt>
                <dd className="leading-relaxed text-[oklch(0.371_0_0)]">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Previous / next at the foot of the project (text only here). */}
        <div
          className={`mt-10 border-t border-[oklch(0.922_0_0/0.7)] py-6 @min-[640px]:mt-12 @min-[640px]:py-7`}
        >
          <div className="grid grid-cols-2 items-start gap-3">
            <div className="justify-self-start">
              <span className="inline-flex items-center gap-2 text-sm text-[oklch(0.87_0_0)]">
                <span aria-hidden="true" className="text-base leading-none">
                  ←
                </span>
                <span>Prejšnji</span>
              </span>
            </div>
            <div className="inline-flex flex-col items-end gap-1 justify-self-end text-right text-sm text-[oklch(0.556_0_0)]">
              <span className="inline-flex items-center gap-2">
                <span>Naslednji</span>
                <span aria-hidden="true" className="text-base leading-none">
                  →
                </span>
              </span>
              <span className="hidden max-w-[26ch] truncate text-xs text-[oklch(0.708_0_0)] @min-[640px]:block">
                {PROJECT.nextTitle}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Related references. */}
      <section
        aria-labelledby="dp-related"
        className={`mt-10 border-t ${BORDER} bg-[#f4f6f7] @min-[640px]:mt-12`}
      >
        <div className="mx-auto max-w-[80rem] px-5 py-12 @min-[640px]:py-14">
          <div className="flex items-end justify-between gap-6">
            <div className="max-w-3xl">
              <Sub
                id="dp-related"
                className="text-2xl font-semibold tracking-[-0.025em] text-[oklch(0.205_0_0)] @min-[640px]:text-3xl"
              >
                Sorodne reference
              </Sub>
              <p className="mt-2.5 text-sm leading-relaxed text-[oklch(0.439_0_0)]">
                Izbor projektov s sorodnim programom, tipom izvedbe ali področjem dela.
              </p>
            </div>
            <span className="hidden items-center gap-2 text-sm text-[oklch(0.556_0_0)] @min-[640px]:inline-flex">
              <span>Vse reference</span>
              <span aria-hidden="true">→</span>
            </span>
          </div>

          {/* Below 1024: rows with a thumbnail. */}
          <div className={`mt-6 divide-y divide-[oklch(0.922_0_0)] @min-[1024px]:hidden`}>
            {RELATED.map((p) => (
              <div
                key={p.title}
                className="grid gap-4 py-5 @min-[640px]:grid-cols-[180px_1fr] @min-[640px]:items-center @min-[640px]:gap-5 @min-[640px]:py-6"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[oklch(0.97_0_0)]">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(min-width: 640px) 180px, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[oklch(0.556_0_0)]">
                    <span>{p.label}</span>
                    <span aria-hidden="true" className="text-[oklch(0.87_0_0)]">
                      •
                    </span>
                    <span>{p.location}</span>
                  </div>
                  <Card className="mt-1.5 text-base font-semibold tracking-[-0.025em] text-[oklch(0.205_0_0)] @min-[640px]:text-lg">
                    {p.title}
                  </Card>
                  <p className="mt-1.5 text-sm text-[oklch(0.439_0_0)]">
                    <span className="inline-flex items-center gap-2">
                      Poglej projekt
                      <span aria-hidden="true">→</span>
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* From 1024: three columns. */}
          <div className="mt-8 hidden @min-[1024px]:grid @min-[1024px]:grid-cols-3 @min-[1024px]:gap-x-6 @min-[1024px]:gap-y-7">
            {RELATED.map((p) => (
              <div key={p.title} className="block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[oklch(0.97_0_0)]">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(min-width: 1024px) 390px, 100vw"
                    className="object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
                </div>
                <div className="mt-2.5">
                  <div className={EYEBROW}>{p.label}</div>
                  <Card className="mt-1 text-base font-semibold tracking-[-0.025em] text-[oklch(0.205_0_0)]">
                    {p.title}
                  </Card>
                  <p className="mt-1.5 text-sm text-[oklch(0.439_0_0)]">
                    <span className="inline-flex items-center gap-2">
                      Poglej projekt
                      <span aria-hidden="true">→</span>
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
