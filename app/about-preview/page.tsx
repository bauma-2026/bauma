import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MiniHeader from "../components/blocks/mini/MiniHeader";
import MiniFooter from "../components/blocks/mini/MiniFooter";
import Container from "../components/layout/Container";


export const metadata: Metadata = {
  title: "About Preview — Bauma",
  description: "Local identity preview for Bauma.",
  robots: {
    index: false,
    follow: false,
  },
};

const timeline = [
  {
    eyebrow: "1999–2002",
    title: "Zgodnji digitalni sistemi",
text: "Moja digitalna pot se je začela v Ljubljanski banki / NLB, v takratnem Sektorju za sodobne tržne poti, kjer sem sodeloval pri zgodnji podpori za NLB Klik in NLB Proklik.",  },
  {
    eyebrow: "Digital trust",
    title: "Uporabniki, brskalniki in certifikati",
    text: "Tam sem zelo zgodaj videl, kako hitro se uporabnik izgubi v digitalnem sistemu: certifikati, brskalniki, varnost, zaupanje in jasen naslednji korak.",
  },
  {
    eyebrow: "Visual communication",
    title: "Od sistemov do vizualne strukture",
text: "To obdobje me je usmerilo v vizualne komunikacije, interaktivno oblikovanje in kasneje delo tam, kjer se srečajo oblikovanje, tehnologija in uporabniško razumevanje.",  },
];

const principles = [
  {
    title: "Structure before surface",
    text: "Najprej mora biti jasno, kaj uporabnik razume, čemu zaupa in kateri korak mora narediti.",
  },
  {
    title: "Clarity before decoration",
    text: "Vizualni sloj ima največjo vrednost takrat, ko podpira strukturo, ne ko tekmuje z vsebino.",
  },
  {
    title: "AI as multiplier",
    text: "AI uporabljam kot pospeševalec razmišljanja, razvoja in iteracije — ne kot nadomestilo za presojo, ton in smer.",
  },
];

export default function AboutPreviewPage() {
  return (
    <>
      <MiniHeader />

      <main className="bg-[#080808] text-white">
        {/* Hero */}
{/* Hero */}
<section className="relative overflow-hidden border-b border-white/10 py-20 sm:py-24 lg:py-28">
  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_35%,rgba(125,211,252,0.055),transparent_32%)]" />

  <Container className="relative">
    <div className="inline-flex items-center rounded-full border border-sky-300/20 bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-white/72 shadow-[0_0_24px_rgba(125,211,252,0.05)]">
      About preview
    </div>

    <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_300px] lg:items-end lg:gap-24">
      <div className="max-w-[720px]">
        <h1 className="max-w-[16ch] font-serif text-5xl font-semibold leading-[0.96] tracking-[-0.025em] text-white sm:text-6xl lg:text-7xl">
          Struktura naredi
  <br />
  celoto jasnejšo.
        </h1>

        <div className="mt-8 max-w-[58ch]">
          <p className="text-base leading-7 text-white/62 sm:text-lg sm:leading-8">
            Bauma je moj način dela s spletnimi stranmi in digitalnimi sistemi —
            razpršene dele povezati v smiselno celoto.
          </p>

          <p className="mt-5 text-base leading-7 text-white/50 sm:text-lg sm:leading-8">
            Ko so vsebina, vizualni sloj in tehnologija povezani v isto smer,
            stran postane jasnejša, mirnejša in lažja za odločitev.
          </p>
        </div>

      {/* Mobile portrait */}
<div className="relative mr-auto mt-9 max-w-[200px] lg:hidden">
  <div className="pointer-events-none absolute -inset-8 rounded-full bg-white/[0.03] blur-3xl" />

  <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.015] opacity-90">
    <Image
      src="/images/gregor/gregor-baumgartner-portrait-bauma.jpg"
      alt="Gregor Baumgartner"
      width={900}
      height={1125}
      priority
      className="aspect-[4/5] w-full object-cover object-center grayscale opacity-85"
    />
  </div>
</div></div>

    {/* Desktop portrait */}
 <div className="relative hidden lg:block lg:w-[240px] lg:justify-self-end xl:w-[260px]">
  <div className="pointer-events-none absolute -inset-10 rounded-full bg-white/[0.03] blur-3xl" />

  <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.015] opacity-90">
    <Image
      src="/images/gregor/gregor-baumgartner-portrait-bauma.jpg"
      alt="Gregor Baumgartner"
      width={900}
      height={1125}
      priority
      className="aspect-[4/5] w-full object-cover object-center grayscale opacity-85 contrast-[0.92]"
    />
  </div>
</div></div>
  </Container>
</section>

       {/* Origin */}
<section className="border-b border-white/10 px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
  <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
        Origin
      </p>

      <h2 className="mt-4 max-w-[15ch] text-4xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
        Zgodnji stik z digitalnim trenjem.
      </h2>
    </div>

    <div className="border-y border-white/10 lg:mt-6">
      {timeline.map((item) => (
        <div
          key={item.title}
          className="grid gap-3 border-b border-white/10 py-6 last:border-b-0 sm:grid-cols-[120px_1fr] sm:gap-8"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.11em] text-sky-300/60">
            {item.eyebrow}
          </p>

          <div>
            <h3 className="text-base font-semibold tracking-[-0.015em] text-white/90 sm:text-lg">
              {item.title}
            </h3>

            <p className="mt-2 max-w-[58ch] text-sm leading-6 text-white/52">
              {item.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

     {/* Shift */}
<section className="border-b border-white/10 px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
  <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
        What changed
      </p>

      <h2 className="mt-4 max-w-[13ch] text-4xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
        Lep videz ni več dovolj.
      </h2>
    </div>

    <div className="max-w-[58ch] text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
      <p>
        Danes lahko skoraj vsak hitro ustvari stran, ki izgleda dovolj
        dobro. Zato videz sam po sebi ni več dovolj močan signal.
      </p>

      <p className="mt-5">
        Razlika nastane v strukturi: kaj pride najprej, kaj mora biti
        jasno, kje nastane zaupanje in kateri naslednji korak mora biti
        očiten.
      </p>

      <p className="mt-5">
        Bauma zato ne začne pri dekoraciji, ampak pri poti uporabnika.
      </p>
    </div>
  </div>
</section>
        {/* How I work */}
<section className="border-b border-white/10 px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
  <div className="mx-auto max-w-[1100px]">
    <div className="max-w-[720px]">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
        How I work
      </p>

      <h2 className="mt-4 max-w-[12ch] text-4xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
        Najprej pot. Potem sloj.
      </h2>

      <p className="mt-6 max-w-[58ch] text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
        Najprej pogledam, kje se uporabnik izgubi: v ponudbi, vsebini,
        zaporedju informacij, dokazih ali CTA-jih. Potem stran uredim
        kot sistem.
      </p>
    </div>

    <div className="mt-10 grid gap-4 lg:grid-cols-3">
      {principles.map((item) => (
        <div
          key={item.title}
          className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6"
        >
          <h3 className="text-base font-semibold tracking-[-0.015em] text-white/90">
            {item.title}
          </h3>

          <p className="mt-3 text-sm leading-6 text-white/50">
            {item.text}
          </p>
        </div>
      ))}
    </div>

    <div className="mt-10 rounded-2xl border border-white/10 bg-[#0d0d0d] p-5 sm:p-6 lg:max-w-[720px]">
      <p className="text-sm leading-6 text-white/52">
        Core flow:
      </p>

      <p className="mt-2 text-base font-medium tracking-[-0.02em] text-white">
        problem → jasna pot → dokaz → naslednji korak
      </p>
    </div>
  </div>
</section>
        {/* Current working model */}
       {/* Current working model */}
<section className="border-b border-white/10 px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
  <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
        Current model
      </p>

      <h2 className="mt-4 max-w-[16ch] text-4xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
        Iz Ljubljane.
        <br />
        Z mirnejše baze.
      </h2>
    </div>

    <div className="max-w-[58ch] text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
      <p>
        Rojen sem v Ljubljani, kjer sem odraščal in večino profesionalne
        poti oblikoval skozi vizualne komunikacije, oglaševanje in
        digitalno delo.
      </p>

      <p className="mt-5">
        Danes delam iz mirnejše baze. Ta premik mi omogoča več fokusa,
        manj hrupa in bolj strukturirano delo — brez izgube urbanega
        komunikacijskega ozadja, iz katerega prihajam.
      </p>

      <p className="mt-5">
        AI ne vidim kot grožnjo, ampak kot multiplikator sposobnosti:
        orodje za hitrejše razmišljanje, razvoj komponent, testiranje
        struktur in iteracijo. Vrednost pa ostaja v izbiri, presoji,
        tonu, hierarhiji in odločitvah.
      </p>
    </div>
  </div>
</section>

      {/* Closing */}
<section className="px-6 py-16 text-center sm:py-20 lg:px-8 lg:py-24">
  <div className="mx-auto max-w-[720px]">
    <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
      Next step
    </p>

    <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.025em] text-white sm:text-4xl">
      Začniva z jasnim vprašanjem.
    </h2>

    <p className="mx-auto mt-5 max-w-[46ch] text-sm leading-6 text-white/58 sm:text-base sm:leading-7">
      Pošljite link, idejo ali kratek opis problema. Pogledava, kje
      nastane največ nejasnosti in kateri korak je smiselno urediti
      najprej.
    </p>

    <div className="mt-8">
      <Link
        href="mailto:hello@bauma.si?subject=Povpra%C5%A1evanje%20%E2%80%94%20Bauma"
        className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90"
      >
        hello@bauma.si
      </Link>
    </div>
  </div>
</section>
      </main>

      <MiniFooter />
    </>
  );
}