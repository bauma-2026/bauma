import "./MiniServicesBoxes.css";

/**
 * Homepage "Storitve" (SL), used only by `app/page.tsx`, between System and Selected Work.
 *
 * Four equal, quietly framed blocks (the approved Boxes direction, `/lab/services-editorial/spread/boxes`, with the
 * Typography V1.1 scale, `/lab/home-typography-v1/v1-1`). The heading sits in column 1 of the Selected Work grid and the
 * four services form a 2x2 on columns 2 and 3, so the block edges land on the tile edges below. Below lg everything is a
 * single column (two columns from md for the blocks). Equal size and weight, one tone-on-tone border each, natural
 * content heights, no fill, numbers, icons, links or hover states. Layout and the service scale live in
 * `MiniServicesBoxes.css` (everything under `.msx`); the H2 size comes from the homepage scope in
 * `app/homeTypographyV11.css`.
 *
 * `MiniServicesHome` (horizontal rows) is left as it was for the labs that still embed it.
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

export default function MiniServicesBoxes() {
  return (
    <section
      id="storitve"
      data-section="services"
      aria-labelledby="msv-home-heading"
      className={[
        /* Same shell as the rows version: the transparent 1px border keeps the section height, and the bottom padding is
           deliberately shorter than the top (36 / 48 / 80px) because Selected Work below carries its own top padding. */
        "msx relative border-t border-transparent pt-16 pb-9 text-white sm:pt-20 sm:pb-12 lg:pt-24 lg:pb-20",
        "bg-[var(--mini-surface-work,#080a0f)]",
      ].join(" ")}
    >
      <div className="mini-page-rail">
        <div className="msx-grid">
          <header className="msx-head">
            <p className="uppercase">KAJ DELAMO</p>
            <h2 id="msv-home-heading" className="home-primary-heading text-balance">
              Kaj lahko uredimo za vas.
            </h2>
          </header>
          <ul className="msx-matrix list-none">
            {SERVICES.map((s) => (
              <li key={s.n}>
                <article aria-labelledby={`msv-home-${s.n}`}>
                  <h3 id={`msv-home-${s.n}`}>
                    <span>{s.title}</span>
                  </h3>
                  <p>{s.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
