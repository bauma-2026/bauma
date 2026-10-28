import "./MiniServicesGrid.css";

/**
 * Homepage "Storitve" (SL), used only by `app/(sl)/page.tsx`, between System and Selected Work: Editorial Grid B V1.2
 * (promoted from `/lab/services-grid`). Heading above one unified 2x2 frame of four equal cells; one column below md.
 * Layout and the service scale live in `MiniServicesGrid.css` (everything under `.msg`). `id="storitve"` is the anchor
 * other pages link to. The section deliberately carries `data-section="services-grid"`, not `"services"`, so the
 * approved H2 renders exactly as in the lab (the `[data-section="services"]` rules in `homeTypography*.css` stay with
 * the old `MiniServicesBoxes`, which labs still use).
 * Class lists are arrays + join (Tailwind scanner drops classes against `${`).
 */
const SERVICES = [
  {
    n: "01",
    title: "Struktura in zasnova",
    body: "Določimo strukturo strani, razporeditev vsebin in vizualno smer. Pripravimo načrt, ki ga lahko uporabi tudi drug izvajalec.",
  },
  {
    n: "02",
    title: "Oblikovanje in izvedba",
    body: "Spletno stran oblikujemo, razvijemo in objavimo. Od prve zasnove do delujoče spletne strani.",
  },
  {
    n: "03",
    title: "Digitalni materiali",
    body: "Oblikujemo spletne bannerje, HTML e-novice ter animirane in video različice. Datoteke pripravimo za objavo.",
  },
  {
    n: "04",
    title: "Vzdrževanje in razvoj",
    body: "Obstoječe spletne strani posodabljamo, odpravljamo napake in uvajamo izboljšave. Tudi na straneh drugih izvajalcev.",
  },
] as const;

/** Keeps "HTML e-novice" together so the hyphen never leaves "e-" at a line end (copy unchanged). */
function withNoBreak(body: string) {
  const [before, after] = body.split("HTML e-novice");
  if (after === undefined) return body;
  return (
    <>
      {before}
      <span className="msg-nb">HTML e-novice</span>
      {after}
    </>
  );
}

export default function MiniServicesGrid() {
  return (
    <section
      id="storitve"
      data-section="services-grid"
      aria-labelledby="msv-home-heading"
      className={[
        "msg relative border-t border-transparent pt-16 pb-9 text-white sm:pt-20 sm:pb-12 lg:pt-24 lg:pb-20",
        "bg-[var(--mini-surface-work,#080a0f)]",
      ].join(" ")}
    >
      <div className="mini-page-rail">
        <header className="msg-head">
          <p className="uppercase">KAJ DELAMO</p>
          <h2 id="msv-home-heading" className="home-primary-heading text-balance">
            Kaj lahko uredimo za vas.
          </h2>
        </header>
        <ul className="msg-grid list-none">
          {SERVICES.map((s) => (
            <li key={s.n} className="msg-cell">
              <p className="msg-num" aria-hidden="true">
                {s.n}
              </p>
              <article className="msg-body" aria-labelledby={`msv-home-${s.n}`}>
                <h3 id={`msv-home-${s.n}`}>
                  <span>{s.title}</span>
                </h3>
                <p>{withNoBreak(s.body)}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
