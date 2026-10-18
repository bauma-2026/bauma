import "./MiniServicesHome.css";

/**
 * Homepage "Storitve" (SL), used only by `app/page.tsx`, between System and
 * Selected Work.
 *
 * Four equal horizontal rows on the page grid that Selected Work uses below (from the lab's C2
 * composition, without its structural decoration): the title sits on column 1, the description on
 * column 2, and full-width horizontal rules separate the rows. Layout lives in
 * `MiniServicesHome.css`; below md the rows stack title -> description.
 *
 * The four services are independent offers, not steps, so there are no numbers (an unordered list).
 * No icons, links, CTAs, hover states, motion or decorative lines other than the row rules.
 * The eyebrow is styled by the shared homepage eyebrow rule (`app/homeTypography.css`, IBM Plex
 * Mono 500); display optical size, tracking and `text-wrap: pretty` come from the same foundation.
 *
 * Width: the list spans the full rail so the rules end on the right edge of the third tile below.
 */

const SERVICES = [
  {
    n: "01",
    title: "Struktura in zasnova",
    body: "Določimo strukturo, vsebinske sklope in vizualno smer spletne strani. Dobite dokumentiran načrt, ki ga lahko uporabi tudi drug izvajalec.",
  },
  {
    n: "02",
    title: "Oblikovanje in izvedba",
    body: "Spletno stran oblikujemo, razvijemo in objavimo. Od zasnove do končne izvedbe poskrbimo za celoten projekt.",
  },
  {
    n: "03",
    title: "Digitalni materiali",
    body: "Oblikujemo in izdelujemo spletne bannerje, HTML e-novice in druge digitalne materiale, pripravljene za uporabo.",
  },
  {
    n: "04",
    title: "Vzdrževanje in razvoj",
    body: "Obstoječe spletne strani posodabljamo, odpravljamo napake in uvajamo izboljšave. Tudi na straneh drugih izvajalcev.",
  },
] as const;

export default function MiniServicesHome() {
  return (
    <section
      id="storitve"
      data-section="services"
      aria-labelledby="msv-home-heading"
      className={[
        /* No top rule: the System surface above (#0d0f15) already steps to this one (#080a0f).
           The transparent 1px border keeps the section's height unchanged. Bottom padding is deliberately shorter
           than the top (36 / 48 / 40px): Selected Work below carries its own 64 / 80 / 96px top padding, so equal
           padding would read as a doubled gap. */
        "msv relative border-t border-transparent pt-16 pb-9 text-white sm:pt-20 sm:pb-12 lg:pt-24 lg:pb-10",
        "bg-[var(--mini-surface-work,#080a0f)]",
      ].join(" ")}
    >
      <div className="mini-page-rail">
        <div>
          <p className="uppercase">KAJ DELAMO</p>
          <h2 id="msv-home-heading" className="home-primary-heading mt-5 max-w-[12ch] text-balance">
            Kaj lahko uredimo za vas.
          </h2>
        </div>
        <ul className="msv-list mt-9 list-none sm:mt-10 lg:mt-12">
          {SERVICES.map((s) => (
            <li key={s.n}>
              <article aria-labelledby={`msv-home-${s.n}`} className="msv-row">
                <h3 id={`msv-home-${s.n}`}>
                  <span>{s.title}</span>
                </h3>
                <p>{s.body}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
