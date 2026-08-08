const CONTACT_MAILTO =
  "mailto:gregor@bauma.si?subject=Povpra%C5%A1evanje%20za%20projekt";

export default function MiniFinalCTA() {
  return (
    <section
      id="contact"
      className="border-t border-white/10 bg-[#0a0a0a] py-14 text-white sm:py-16 lg:py-20"
    >
      <div className="mini-page-rail">
        <div className="mx-auto max-w-[620px] text-center">
<h2 className="home-bridge-heading leading-[1.14] sm:leading-[1.12]">
  Za prvi stik je
  <br />
  dovolj kratek opis.
</h2>

<p className="mx-auto mt-5 max-w-[18rem] text-sm leading-[1.45] text-white/60 sm:max-w-[32rem] sm:text-base sm:leading-[1.5]">
  Na kratko opišite trenutno stanje in kaj želite spremeniti.
  <br className="hidden sm:block" />
  <span className="sm:hidden"> </span>
  Nato vam povem, kako je smiselno nadaljevati.
</p>
<div className="mt-8 flex justify-center sm:mt-9">
  <a
    href={CONTACT_MAILTO}
    className="bauma-focus-pill group inline-flex min-h-[48px] items-center justify-center whitespace-nowrap rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition-[background-color,color] duration-300 hover:bg-white/90"
  >
    <span className="inline-flex items-center gap-2">
      Pošljite opis projekta
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
