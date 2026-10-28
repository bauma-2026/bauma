import "./MiniServicesList.css";

/**
 * Homepage "Kaj delamo" (SL), used only by `app/page.tsx`, between System and Selected Work: a vertical index of the four
 * services (promoted from `/lab/art-direction/register-pocket`, Services part only). `MiniServicesGrid` stays as it was.
 * Layout and type live in `MiniServicesList.css` (everything under `.msl`). `id="storitve"` is the anchor other pages link
 * to. No `data-section` attribute, so the `[data-section="services*"]` rules in `homeTypography*.css` do not apply here.
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
    body: "Oblikujemo statične in animirane spletne bannerje ter HTML e-novice. Datoteke pripravimo za objavo.",
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
      <span className="msl-nb">HTML e-novice</span>
      {after}
    </>
  );
}

export default function MiniServicesList({
  joined = false,
}: {
  /** `true` when a closing block follows on the same surface (`MiniSystemPocket` on `/`): drops the bottom padding. */
  joined?: boolean;
}) {
  return (
    <section id="storitve" aria-labelledby="msl-heading" className={joined ? "msl msl--joined" : "msl"}>
      {/* Target of the hero's "Kaj delamo ↓": same marker as #system, so the section starts under the fixed header. */}
      <span id="kaj-delamo" data-anchor-marker aria-hidden="true" />
      <div className="mini-page-rail">
        <div className="msl-col">
          <p className="uppercase">KAJ DELAMO</p>
          <h2 id="msl-heading" className="msl-h2">
            Kaj lahko uredimo za vas.
          </h2>
          <ol className="msl-list">
            {SERVICES.map((s) => (
              <li key={s.n} className="msl-row">
                <p className="msl-num" aria-hidden="true">
                  {s.n}
                </p>
                <h3>{s.title}</h3>
                <p className="msl-desc">{withNoBreak(s.body)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
