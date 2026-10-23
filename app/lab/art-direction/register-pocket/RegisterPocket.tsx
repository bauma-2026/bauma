import SystemCubeB51 from "@/app/components/blocks/mini/SystemCubeB51";

import "./RegisterPocket.css";

/**
 * Lab only: Services first (the Direction B index), then a compact System block with a pocket-size cube, as the closing
 * thought before Selected Work. One surface; the page wrapper sets the background. `MiniSystemHome` and `MiniServicesGrid`
 * are untouched. `#storitve` opens Services, `#system` marks the pocket block. Service names, descriptions and numbering
 * are verbatim from `MiniServicesGrid`. Layout lives in RegisterPocket.css (`.rp`).
 */

const SYSTEM = {
  eyebrow: "CELOTA",
  heading: "Pod površino je sistem.",
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
      <span className="rp-nb">HTML e-novice</span>
      {after}
    </>
  );
}

export default function RegisterPocket() {
  return (
    <div className="rp">
      <div className="mini-page-rail rp-rail">
        <div className="rp-col">
          <section id="storitve" aria-labelledby="rp-svc-heading">
            <p className="uppercase">KAJ DELAMO</p>
            <h2 id="rp-svc-heading" className="rp-svc-h">
              Kaj lahko uredimo za vas.
            </h2>
            <ol className="rp-list">
              {SERVICES.map((s) => (
                <li key={s.n} className="rp-row">
                  <p className="rp-num" aria-hidden="true">
                    {s.n}
                  </p>
                  <h3>{s.title}</h3>
                  <p className="rp-desc">{withNoBreak(s.body)}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="rp-sys" aria-labelledby="rp-sys-heading">
            <span id="system" data-anchor-marker aria-hidden="true" />
            <figure aria-labelledby="rp-cube-title" className="rp-figure">
              <figcaption id="rp-cube-title" className="sr-only">
                {SYSTEM.objectDescription}
              </figcaption>
              <SystemCubeB51 className="rp-cube" />
            </figure>
            <div className="rp-sys-text">
              <p className="uppercase">{SYSTEM.eyebrow}</p>
              <h2 id="rp-sys-heading" className="rp-sys-h">
                {SYSTEM.heading}
              </h2>
              <p className="rp-sys-body">{SYSTEM.body}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
