import SystemCubeB51 from "./SystemCubeB51";

import "./MiniSystemPocket.css";

/**
 * Homepage "Celota" (SL), used only by `app/(sl)/page.tsx`, directly under `MiniServicesList` as the closing thought of the
 * Services chapter (after `/lab/art-direction/register-pocket`, text left and cube right). It replaces `MiniSystemHome` on
 * the homepage; that component stays for other callers. `#system` is the hero's secondary CTA target. Layout lives in
 * `MiniSystemPocket.css` (everything under `.msp`).
 */

export type MiniSystemPocketCopy = {
  eyebrow: string;
  heading: string;
  body: string;
  /** Accessible name of the cube figure (screen readers only). */
  objectDescription: string;
};

/** Approved Slovenian copy, the default; another language passes its own `copy`. */
const COPY: MiniSystemPocketCopy = {
  eyebrow: "CELOTA",
  heading: "Pod površino je sistem.",
  body: "Vsebina, struktura, oblikovanje in tehnična izvedba morajo delovati skupaj. Tako obiskovalec lažje razume, kaj ponujate, najde pomembne informacije in naredi naslednji korak.",
  objectDescription: "Kompaktna kocka iz povezanih delov, ki skupaj tvorijo en sistem.",
};

export default function MiniSystemPocket({ copy = COPY }: { copy?: MiniSystemPocketCopy }) {
  return (
    <section aria-labelledby="msp-heading" className="msp">
      <span id="system" data-anchor-marker aria-hidden="true" />
      <div className="mini-page-rail msp-rail">
        <div className="msp-text">
          <p className="uppercase">{copy.eyebrow}</p>
          <h2 id="msp-heading" className="msp-h">
            {copy.heading}
          </h2>
          <p className="msp-body">{copy.body}</p>
        </div>
        <figure aria-labelledby="msp-cube-title" className="msp-figure">
          <figcaption id="msp-cube-title" className="sr-only">
            {copy.objectDescription}
          </figcaption>
          <SystemCubeB51 className="msp-cube" homeMotion />
        </figure>
      </div>
    </section>
  );
}
