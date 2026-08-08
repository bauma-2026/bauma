"use client";

/**
 * Optical-axis review overlay for Approach → System → Visual.
 * Activate with ?axis=1 — default off; no production render when inactive.
 * Aid for judgment only; not an alignment authority.
 */

import { useEffect, useState } from "react";

type Box = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
  cx: number;
  cy: number;
};

type ObjectMeasure = {
  id: "approach" | "system" | "visual";
  wrapper: Box | null;
  optical: Box | null;
  opticalCx: number | null;
};

function screenBBox(el: SVGGraphicsElement | null): Box | null {
  if (!el || typeof el.getBBox !== "function") return null;
  try {
    const b = el.getBBox();
    const ctm = el.getScreenCTM();
    if (!ctm || !(b.width > 0 || b.height > 0)) return null;
    const pts = [
      { x: b.x, y: b.y },
      { x: b.x + b.width, y: b.y },
      { x: b.x, y: b.y + b.height },
      { x: b.x + b.width, y: b.y + b.height },
    ].map((p) => ({
      x: ctm.a * p.x + ctm.c * p.y + ctm.e,
      y: ctm.b * p.x + ctm.d * p.y + ctm.f,
    }));
    const xs = pts.map((p) => p.x);
    const ys = pts.map((p) => p.y);
    const left = Math.min(...xs);
    const right = Math.max(...xs);
    const top = Math.min(...ys);
    const bottom = Math.max(...ys);
    return {
      left,
      right,
      top,
      bottom,
      width: right - left,
      height: bottom - top,
      cx: (left + right) / 2,
      cy: (top + bottom) / 2,
    };
  } catch {
    return null;
  }
}

function unionBoxes(boxes: Array<Box | null>): Box | null {
  const ok = boxes.filter((b): b is Box => Boolean(b));
  if (!ok.length) return null;
  const left = Math.min(...ok.map((b) => b.left));
  const right = Math.max(...ok.map((b) => b.right));
  const top = Math.min(...ok.map((b) => b.top));
  const bottom = Math.max(...ok.map((b) => b.bottom));
  return {
    left,
    right,
    top,
    bottom,
    width: right - left,
    height: bottom - top,
    cx: (left + right) / 2,
    cy: (top + bottom) / 2,
  };
}

function rectBox(el: Element | null): Box | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (!(r.width > 0 || r.height > 0)) return null;
  return {
    left: r.left,
    right: r.right,
    top: r.top,
    bottom: r.bottom,
    width: r.width,
    height: r.height,
    cx: r.left + r.width / 2,
    cy: r.top + r.height / 2,
  };
}

function measureApproach(): ObjectMeasure {
  const hit = document.querySelector("[data-approach-object-hit]");
  const svg = hit?.querySelector("svg") ?? null;
  const main = [...(svg?.querySelectorAll("line, path, polygon") ?? [])].filter(
    (el) => {
      const op = Number(getComputedStyle(el).opacity || 1);
      const stroke = getComputedStyle(el).stroke;
      return op >= 0.25 && stroke && stroke !== "none";
    },
  ) as SVGGraphicsElement[];
  const optical = unionBoxes(main.map(screenBBox));
  return {
    id: "approach",
    wrapper: rectBox(hit),
    optical,
    opticalCx: optical?.cx ?? null,
  };
}

function measureSystem(): ObjectMeasure {
  const fig = document.querySelector("#system figure");
  const svgs = [...(fig?.querySelectorAll("svg") ?? [])];
  const svg =
    svgs.find((s) => (s.getAttribute("viewBox") || "").includes("600")) ??
    svgs[svgs.length - 1] ??
    null;
  const els = [
    ...(svg?.querySelectorAll(
      "[data-system-node], [data-system-connection]",
    ) ?? []),
  ] as SVGGraphicsElement[];
  const optical = unionBoxes(els.map(screenBBox));
  return {
    id: "system",
    wrapper: rectBox(fig),
    optical,
    opticalCx: optical?.cx ?? null,
  };
}

function measureVisual(): ObjectMeasure {
  let host: Element | null = null;
  let svg: SVGSVGElement | null = null;
  for (const el of document.querySelectorAll("section [class*='absolute']")) {
    const cs = getComputedStyle(el);
    if (cs.position !== "absolute" || cs.display === "none") continue;
    const candidate = el.querySelector("svg");
    if (!candidate) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width >= 300 && rect.width <= 500) {
      host = el;
      svg = candidate;
      break;
    }
  }
  const fills = [...(svg?.querySelectorAll("polygon, path, rect") ?? [])].filter(
    (el) => {
      const fill = (getComputedStyle(el).fill || "").toLowerCase();
      const op = Number(getComputedStyle(el).opacity || 1);
      return op >= 0.2 && fill && fill !== "none";
    },
  ) as SVGGraphicsElement[];
  const solid = fills
    .map((el) => screenBBox(el))
    .filter((b): b is Box => Boolean(b && b.width > 40 && b.height > 40))
    .sort((a, b) => b.width * b.height - a.width * a.height);
  const optical = solid[0] ?? null;
  return {
    id: "visual",
    wrapper: rectBox(host),
    optical,
    opticalCx: optical?.cx ?? null,
  };
}

export default function RightObjectAxisDebug() {
  const [active, setActive] = useState(false);
  const [objects, setObjects] = useState<ObjectMeasure[]>([]);
  const [refX, setRefX] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const on =
      new URLSearchParams(window.location.search).get("axis") === "1";
    setActive(on);
    if (!on) return;

    const update = () => {
      const next = [measureApproach(), measureSystem(), measureVisual()];
      setObjects(next);
      const system = next.find((o) => o.id === "system");
      setRefX(system?.opticalCx ?? null);
    };

    update();
    const onScroll = () => update();
    const onResize = () => update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const id = window.setInterval(update, 400);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.clearInterval(id);
    };
  }, []);

  if (!active || refX == null) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999]"
      data-axis-debug="1"
    >
      {/* System reference vertical (viewport-fixed; updates on scroll) */}
      <div
        className="absolute inset-y-0 w-px bg-[#D1A45F]/70"
        style={{
          left: refX,
          transform: "translateX(-0.5px)",
        }}
      />
      <div
        className="absolute top-3 rounded bg-black/75 px-2 py-1 font-mono text-[10px] text-[#D1A45F]"
        style={{ left: refX + 8 }}
      >
        system optical axis
      </div>

      {objects.map((obj) => {
        if (!obj.optical) return null;
        const delta =
          obj.opticalCx != null ? Math.round(obj.opticalCx - refX) : null;
        return (
          <div key={obj.id}>
            {/* Main geometry bounds */}
            <div
              className="absolute border border-cyan-400/70"
              style={{
                left: obj.optical.left,
                top: obj.optical.top,
                width: obj.optical.width,
                height: obj.optical.height,
              }}
            />
            {/* Optical center */}
            <div
              className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-300 bg-cyan-300/30"
              style={{ left: obj.optical.cx, top: obj.optical.cy }}
            />
            {/* Wrapper center (cross) */}
            {obj.wrapper ? (
              <div
                className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2"
                style={{ left: obj.wrapper.cx, top: obj.wrapper.cy }}
              >
                <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-fuchsia-400/80" />
                <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-fuchsia-400/80" />
              </div>
            ) : null}
            <div
              className="absolute rounded bg-black/75 px-1.5 py-0.5 font-mono text-[10px] text-cyan-200"
              style={{
                left: obj.optical.left,
                top: Math.max(8, obj.optical.top - 22),
              }}
            >
              {obj.id} Δ{delta != null ? (delta >= 0 ? `+${delta}` : delta) : "—"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
