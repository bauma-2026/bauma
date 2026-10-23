import SystemCubeB51 from "@/app/components/blocks/mini/SystemCubeB51";

import "./SystemConnected.css";

/**
 * Lab only: homepage System section with the agreed copy and a connected text/cube composition.
 * Same shell as `MiniSystemHome` (surface, paddings, eyebrow, H2 and body classes); `MiniSystemHome` itself is not touched.
 * `#system` stays the only anchor (the hero's secondary CTA). Layout lives in SystemConnected.css (`.sysc`).
 */

const COPY = {
  eyebrow: "CELOTA",
  headline: "Pod površino\nje sistem.",
  body: "Vsebina, struktura, oblikovanje in tehnična izvedba morajo delovati skupaj. Tako obiskovalec lažje razume, kaj ponujate, najde pomembne informacije in naredi naslednji korak.",
  objectDescription: "Kompaktna kocka iz povezanih delov, ki skupaj tvorijo en sistem.",
};

export default function SystemConnected() {
  const [line1, line2] = COPY.headline.split("\n");
  return (
    <section className="sysc relative overflow-hidden border-t border-transparent bg-[var(--mini-surface-system,#0e0e0f)] pt-20 pb-16 text-white sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24">
      <span id="system" data-anchor-marker aria-hidden="true" />
      <div className="mini-page-rail sysc-rail">
        <div className="sysc-text">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">{COPY.eyebrow}</p>
          <h2 className="home-primary-heading mt-5 max-w-[11ch]">
            {line1}
            <br />
            {line2}
          </h2>
          <p className="sysc-body mt-6 text-base leading-7 text-white/55">{COPY.body}</p>
        </div>
        <figure aria-labelledby="system-view-title" className="sysc-figure">
          <figcaption id="system-view-title" className="sr-only">
            {COPY.objectDescription}
          </figcaption>
          <SystemCubeB51 className="sysc-cube" />
        </figure>
      </div>
    </section>
  );
}
