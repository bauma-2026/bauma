import "./MiniHeroPhotoBackground.css";

/** Same optimizer URLs the stylesheet draws; the preloads must match them exactly. */
const ROAD_PHONE =
  "/_next/image?url=%2Fimages%2Fatmosphere%2Froad-evening-01.jpg&w=2048&q=75";
const ROAD_WIDE =
  "/_next/image?url=%2Fimages%2Fatmosphere%2Froad-evening-01.jpg&w=3840&q=75";

/**
 * Blue Hour road hero background (approved lab Concept 02 / 04, `/` only).
 *
 * The original road photograph is drawn by CSS with a deliberate crop per
 * breakpoint, graded by an SVG tone curve that moves only the shadows toward
 * midnight blue, then darkened by a graduated sky filter and one flat exposure
 * step for readability (MiniHeroPhotoBackground.css). Replaces
 * MiniHeroGlowBackground when `MiniHero` gets `photoBackground`.
 */
export default function MiniHeroPhotoBackground() {
  return (
    <div
      aria-hidden="true"
      className="bauma-hero-photo pointer-events-none absolute inset-0"
    >
      <link
        rel="preload"
        as="image"
        href={ROAD_PHONE}
        media="(max-width: 767px)"
      />
      <link
        rel="preload"
        as="image"
        href={ROAD_WIDE}
        media="(min-width: 768px)"
      />
      <svg
        width="0"
        height="0"
        focusable="false"
        style={{ position: "absolute" }}
      >
        <defs>
          <filter id="bauma-hero-bluehour" colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0 0.2 0.46 0.74 0.97" />
              <feFuncG type="table" tableValues="0.005 0.24 0.5 0.765 0.975" />
              <feFuncB type="table" tableValues="0.045 0.29 0.53 0.77 0.95" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>
    </div>
  );
}
