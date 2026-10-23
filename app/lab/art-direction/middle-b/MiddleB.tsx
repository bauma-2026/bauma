import SystemCubeB51 from "@/app/components/blocks/mini/SystemCubeB51";

import "./MiddleB.css";

/**
 * Lab only: Art Direction B. System (left) and Services (right) as one composition on one surface; the page wrapper sets the
 * background. `MiniSystemHome` and `MiniServicesGrid` are untouched. `#system` and `#storitve` are kept. Service names,
 * descriptions and numbering are verbatim from `MiniServicesGrid`; the System copy is the agreed working text.
 * Layout lives in MiddleB.css (`.bmid`).
 */

const SYSTEM = {
  eyebrow: "CELOTA",
  lines: ["Pod površino", "je sistem."],
  body: "Vsebina, struktura, oblikovanje in tehnična izvedba morajo delovati skupaj. Tako obiskovalec lažje razume, kaj ponujate, najde pomembne informacije in naredi naslednji korak.",
  objectDescription: "Kompaktna kocka iz povezanih delov, ki skupaj tvorijo en sistem.",
};

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
      <span className="bmid-nb">HTML e-novice</span>
      {after}
    </>
  );
}

export default function MiddleB() {
  return (
    <div className="bmid">
      <div className="mini-page-rail bmid-grid">
        <section className="bmid-sys" aria-labelledby="bmid-sys-heading">
          <span id="system" data-anchor-marker aria-hidden="true" />
          <p className="uppercase">{SYSTEM.eyebrow}</p>
          <h2 id="bmid-sys-heading" className="bmid-h1">
            {SYSTEM.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p className="bmid-body">{SYSTEM.body}</p>
          <figure aria-labelledby="bmid-cube-title" className="bmid-figure">
            <figcaption id="bmid-cube-title" className="sr-only">
              {SYSTEM.objectDescription}
            </figcaption>
            <SystemCubeB51 className="bmid-cube" />
          </figure>
        </section>

        <section id="storitve" className="bmid-svc" aria-labelledby="bmid-svc-heading">
          <p className="uppercase">KAJ DELAMO</p>
          <h2 id="bmid-svc-heading" className="bmid-svc-h">
            Kaj lahko uredimo za vas.
          </h2>
          <ol className="bmid-list">
            {SERVICES.map((s) => (
              <li key={s.n} className="bmid-row">
                <p className="bmid-num" aria-hidden="true">
                  {s.n}
                </p>
                <h3>{s.title}</h3>
                <p className="bmid-desc">{withNoBreak(s.body)}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
