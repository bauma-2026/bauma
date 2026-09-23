export type MiniFinalCtaCopy = {
  eyebrow: string;
  line1: string;
  line2: string;
  bodyLine1: string;
  bodyLine2: string;
  cta: string;
  mailto: string;
};

const DEFAULT_COPY: MiniFinalCtaCopy = {
  eyebrow: "ZAČNIMO POGOVOR",
  line1: "Za prvi stik je",
  line2: "dovolj kratek opis.",
  bodyLine1: "Na kratko opišite trenutno stanje in kaj želite spremeniti.",
  bodyLine2: "Nato vam povem, kako je smiselno nadaljevati.",
  cta: "Pošljite opis projekta",
  mailto: "mailto:gregor@bauma.si?subject=Povpra%C5%A1evanje%20za%20projekt",
};

export default function MiniFinalCTA({
  copy = DEFAULT_COPY,
  embedded = false,
}: {
  copy?: MiniFinalCtaCopy;
  embedded?: boolean;
}) {
  return (
    <section
      className={
        embedded
          ? "relative z-10 py-14 text-white sm:py-16 lg:py-20"
          : "relative border-t border-white/10 bg-[#0a0a0a] py-14 text-white sm:py-16 lg:py-20"
      }
    >
      {/* Embedded: the 1px border-t sits on the bookend wrapper directly above. */}
      <span id="contact" data-anchor-marker aria-hidden="true" />
      <div className="mini-page-rail">
        <div className="mx-auto max-w-[620px] text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/70">
            {copy.eyebrow}
          </p>

          <h2 className="home-bridge-heading mt-4 leading-[1.14] sm:leading-[1.12]">
            {copy.line1}
            <br />
            {copy.line2}
          </h2>

          <p className="mx-auto mt-5 max-w-[18rem] text-sm leading-[1.45] text-white/60 sm:max-w-[32rem] sm:text-base sm:leading-[1.5]">
            {copy.bodyLine1}
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            {copy.bodyLine2}
          </p>
          <div className="mt-8 flex justify-center sm:mt-9">
            <a
              href={copy.mailto}
              className="bauma-focus-pill group inline-flex min-h-[48px] items-center justify-center whitespace-nowrap rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition-[background-color,color] duration-300 hover:bg-white/90"
            >
              <span className="inline-flex items-center gap-2">
                {copy.cta}
                <span
                  aria-hidden
                  className="transition duration-300 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
