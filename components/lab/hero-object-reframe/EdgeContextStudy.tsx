"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import MiniHeader from "@/app/components/blocks/mini/MiniHeader";
import {
  pointsAttr,
  rgba,
  V3_CANVAS,
  V3_S0_MATERIAL,
} from "@/components/home/hero-system/v3/geometryV3";
import { ZONE_RADII } from "@/components/home/hero-system/v3/proximityModelV3";
import {
  pathJoinSegments,
  pathRearSegments,
  V3_F2_FACE,
} from "@/components/home/hero-system/v3/spatialPathV3";

import {
  parseEdgeContextParams,
  searchParamsFromWindow,
  type EdgeVisId,
  type LabSearchParams,
  type StabilityId,
  type TrafficId,
} from "./labSearchParams";
import {
  EDGE_LOCK,
  STABILITY_LABELS,
  useEdgeContextInteraction,
  vbMultipliers,
  type EdgeMetrics,
} from "./useEdgeContextInteraction";

type ObjectProps = {
  className?: string;
  stability: StabilityId;
  vis: EdgeVisId;
  traffic?: TrafficId;
  enabled?: boolean;
  reduced?: boolean;
  scrubProgress?: number | null;
  debug?: boolean;
  showZones?: boolean;
  heroInView?: boolean;
  onMetrics?: (m: EdgeMetrics) => void;
};

/** Lab object view — production geometry / path / materials; lab runtime shell. */
function EdgeContextObject({
  className = "relative h-[440px] w-full",
  stability,
  vis,
  traffic = "off",
  enabled = true,
  reduced = false,
  scrubProgress = null,
  debug = false,
  showZones = false,
  heroInView = true,
  onMetrics,
}: ObjectProps) {
  const { width, height, anchor, tiltDeg } = V3_CANVAS;
  const reactId = useId().replace(/:/g, "");
  const clipId = `lab-edge-occlude-${reactId}`;
  const svgRef = useRef<SVGSVGElement | null>(null);

  const snap = useEdgeContextInteraction({
    stability,
    vis,
    traffic,
    enabled,
    reduced,
    scrubProgress,
    svgRef,
    heroInView,
    onMetrics,
  });

  const { geom, debug: d, frontTilted, halfDiag } = snap;
  const { front, rear, faces } = geom;
  const v = useMemo(() => vbMultipliers(vis), [vis]);
  const joins = pathJoinSegments(geom);
  const rearSegs = pathRearSegments(geom);

  const poseTransform = `rotate(${tiltDeg} ${anchor.x} ${anchor.y})`;
  const depthBase = V3_S0_MATERIAL.rearBase * v.rearMul;
  const frontStrokeAlpha = 0.8 * v.frontMul;
  const frontStroke = `rgba(244,241,234,${frontStrokeAlpha.toFixed(3)})`;

  const drawFaces =
    geom.revealMix > 0.02 ? faces.filter((f) => f.render) : [];

  const maskD = `M0,0 H${width} V${height} H0 Z M${front
    .map((p) => `${p.x},${p.y}`)
    .join(" L")} Z`;

  const cFront = {
    x:
      frontTilted.reduce((s, p) => s + p.x, 0) /
      Math.max(1, frontTilted.length),
    y:
      frontTilted.reduce((s, p) => s + p.y, 0) /
      Math.max(1, frontTilted.length),
  };

  const zoneCircles = showZones
    ? [
        {
          id: "awareness",
          r: ZONE_RADII.awarenessOuter * halfDiag,
          stroke: "rgba(244,241,234,0.12)",
        },
        {
          id: "reveal",
          r: ZONE_RADII.revealOuter * halfDiag,
          stroke: "rgba(244,241,234,0.2)",
        },
        {
          id: "pressure",
          r: ZONE_RADII.pressureOuter * halfDiag,
          stroke: "rgba(166,118,62,0.45)",
        },
      ]
    : [];

  return (
    <div
      className={className}
      style={{ pointerEvents: "none" }}
      data-lab-renderer="edge-context"
      data-stability={stability}
      data-vis={vis}
      data-traffic={traffic}
      data-progress={snap.progress.toFixed(3)}
      data-zone={d.zone}
      data-segment={d.segment}
      data-runtime-enabled={enabled ? "1" : "0"}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full overflow-visible"
        style={{ pointerEvents: "none" }}
        aria-hidden
      >
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={maskD} clipRule="evenodd" />
          </clipPath>
        </defs>

        {showZones && (
          <g data-layer="zones" pointerEvents="none">
            {zoneCircles.map((z) => (
              <circle
                key={z.id}
                cx={cFront.x || width / 2}
                cy={cFront.y || height / 2}
                r={z.r}
                fill="none"
                stroke={z.stroke}
                strokeWidth={0.8}
                strokeDasharray="4 3"
              />
            ))}
            {frontTilted.length > 0 && (
              <polygon
                points={pointsAttr(frontTilted)}
                fill="none"
                stroke="rgba(244,241,234,0.28)"
                strokeWidth={0.7}
              />
            )}
            {d.closest && d.pointer && (
              <line
                x1={d.pointer.x}
                y1={d.pointer.y}
                x2={d.closest.x}
                y2={d.closest.y}
                stroke="rgba(166,118,62,0.5)"
                strokeWidth={0.8}
              />
            )}
          </g>
        )}

        <g transform={poseTransform} data-layer="volume">
          <g data-layer="rearEdges" clipPath={`url(#${clipId})`}>
            {rearSegs.map((seg) => (
              <line
                key={seg.id}
                x1={seg.a.x}
                y1={seg.a.y}
                x2={seg.b.x}
                y2={seg.b.y}
                fill="none"
                stroke={rgba(244, 241, 234, depthBase * seg.opacity)}
                strokeWidth={seg.strokeWidth ?? 0.75}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>

          {drawFaces.length > 0 && (
            <g data-layer="sideFaces">
              {drawFaces.map((f) => {
                const mat =
                  f.role === "primary"
                    ? V3_F2_FACE.primary
                    : V3_F2_FACE.secondary;
                const fade = geom.revealMix * v.faceMul;
                return (
                  <polygon
                    key={f.id}
                    points={pointsAttr(f.points)}
                    fill={rgba(244, 241, 234, mat.fillAlpha * fade)}
                    stroke={rgba(244, 241, 234, mat.strokeAlpha * fade)}
                    strokeWidth={mat.strokeWidth}
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}
            </g>
          )}

          <g data-layer="joins">
            {joins.map((j) => (
              <line
                key={j.id}
                x1={j.a.x}
                y1={j.a.y}
                x2={j.b.x}
                y2={j.b.y}
                fill="none"
                stroke={rgba(244, 241, 234, V3_S0_MATERIAL.joinBase * j.opacity * v.joinMul)}
                strokeWidth={V3_S0_MATERIAL.joinStrokeWidth}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>

          <g data-layer="frontPlate">
            <polygon
              data-role="fill"
              points={pointsAttr(front)}
              fill={V3_S0_MATERIAL.frontFill}
              fillOpacity={V3_S0_MATERIAL.frontFillOpacity}
              stroke="none"
            />
            <polygon
              points={pointsAttr(front)}
              fill="none"
              stroke={frontStroke}
              strokeWidth={V3_S0_MATERIAL.frontStrokeWidth}
              strokeLinejoin="miter"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </g>
      </svg>

      {debug && (
        <div className="pointer-events-none absolute bottom-1 left-1 max-w-[99%] rounded bg-black/75 px-2 py-1 font-mono text-[9px] leading-relaxed text-white/55">
          <div>
            {d.stability} · {d.vis} · {d.traffic} · {d.inputMode} ·{" "}
            {d.fps.toFixed(0)}fps
          </div>
          <div>
            zone {d.zone}/{d.rawZone} · dist {d.filteredDist.toFixed(1)} · raw{" "}
            {d.rawProximity.toFixed(3)} · tgt {d.targetProgress.toFixed(3)} →{" "}
            {d.renderedProgress.toFixed(3)}
            {d.deadbandSuppressed ? " · DB" : ""}
            {d.earlyRelease ? " · ER" : ""}
          </div>
        </div>
      )}
    </div>
  );
}

type EdgeContextStudyProps = {
  initialSearchParams?: LabSearchParams;
};

/**
 * Final lab reference — real-context edge stability review.
 * Production authorities for geometry, path, materials, proximity runtime.
 */
export default function EdgeContextStudy({
  initialSearchParams = {},
}: EdgeContextStudyProps) {
  const initial = parseEdgeContextParams(initialSearchParams);

  const [stability, setStability] = useState<StabilityId>(initial.stability);
  const [vis, setVis] = useState<EdgeVisId>(initial.visibility);
  const [traffic, setTraffic] = useState<TrafficId>(initial.traffic);
  const [debug, setDebug] = useState(initial.debug);
  const [showZones, setShowZones] = useState(initial.showZones);
  const [reduced, setReduced] = useState(initial.reduced);
  const [enabled, setEnabled] = useState(initial.enabled);
  const [hideChrome, setHideChrome] = useState(initial.hideChrome);
  const [drawerOpen, setDrawerOpen] = useState(initial.drawerOpen);
  const [scrubProgress, setScrubProgress] = useState<number | null>(
    initial.scrubProgress,
  );
  const [lowBright, setLowBright] = useState(initial.lowBright);
  const [heroInView, setHeroInView] = useState(true);
  const [lastMetrics, setLastMetrics] = useState<EdgeMetrics | null>(null);
  const [ctaFocus, setCtaFocus] = useState(false);
  const [isLg, setIsLg] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsLg(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const applyFromUrl = () => {
      const next = parseEdgeContextParams(searchParamsFromWindow());
      setStability(next.stability);
      setVis(next.visibility);
      setTraffic(next.traffic);
      setDebug(next.debug);
      setShowZones(next.showZones);
      setHideChrome(next.hideChrome);
      setLowBright(next.lowBright);
      setReduced(next.reduced);
      setEnabled(next.enabled);
      setDrawerOpen(next.drawerOpen);
      setScrubProgress(next.scrubProgress);
    };
    window.addEventListener("popstate", applyFromUrl);
    return () => window.removeEventListener("popstate", applyFromUrl);
  }, []);

  useEffect(() => {
    const el = document.querySelector("[data-edge-hero]");
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio > 0.35;
        setHeroInView(visible);
      },
      { threshold: [0, 0.35, 0.6, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onMetrics = useCallback((m: EdgeMetrics) => {
    setLastMetrics(m);
  }, []);

  const btn = (active: boolean) =>
    `rounded px-2 py-1 transition ${
      active ? "bg-white/15 text-white" : "bg-white/5 text-white/50"
    }`;

  const sharedObject = {
    stability,
    vis,
    traffic,
    reduced,
    scrubProgress,
    debug,
    showZones,
    heroInView,
  } as const;

  return (
    <div
      data-lab-root
      data-hero-object-reframe="1"
      data-lab-status="edge-context-reference"
      data-study="edge-context"
      data-stability={stability}
      data-visibility={vis}
      data-traffic={traffic}
      className="relative min-h-screen overflow-x-hidden bg-[#080808] text-white"
      style={lowBright ? { filter: "brightness(0.72) contrast(1.05)" } : undefined}
    >
      {!hideChrome && <MiniHeader />}

      <section
        className="relative overflow-hidden border-b border-white/10 bg-[#080808] text-white"
        data-edge-hero
        data-edge-field
      >
        <div className="mini-page-rail relative z-10 grid gap-10 pt-20 pb-0 sm:pt-20 sm:pb-0 lg:min-h-[calc(100vh-52px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-14 lg:py-24">
          <div className="relative z-10">
            <div className="inline-flex items-center rounded-full border border-[#B68A4C]/25 bg-[#B68A4C]/[0.04] px-3 py-1 text-[11px] font-medium text-white/72">
              Struktura pred obliko
            </div>

            <h1 className="mt-8 font-serif font-normal leading-[0.9] tracking-[-0.025em] text-white sm:leading-[0.94]">
              <span className="block max-w-[9ch] text-[3.75rem] sm:hidden">
                Jasna
                <br />
                struktura.
                <br />
                Več odločitev.
              </span>
              <span className="hidden max-w-[15ch] text-6xl sm:block lg:max-w-[16ch] lg:text-7xl">
                Jasna struktura.
                <br />
                Več odločitev.
              </span>
            </h1>

            <p className="mt-8 max-w-[52ch] text-base leading-7 text-white/55 sm:text-lg">
              Podjetjem pomagam urediti ponudbo, vsebino in pot skozi spletno
              stran, da vse deluje kot jasna in povezana celota.
            </p>

            <div className="mt-9">
              <a
                href="#flow"
                data-edge-cta
                data-cta-focused={ctaFocus ? "1" : "0"}
                onFocus={() => setCtaFocus(true)}
                onBlur={() => setCtaFocus(false)}
                className="bauma-focus-pill group inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-[transform,background-color,color] duration-300 hover:-translate-y-[1px] hover:bg-white/90 active:translate-y-0"
              >
                <span className="inline-flex items-center gap-2">
                  Kako stran vodi do odločitve
                  <span className="transition duration-300 group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </a>
            </div>

            <div className="mt-10 border-t border-white/[0.06] py-9 sm:py-10 lg:hidden">
              <div className="relative h-[112px] w-full overflow-hidden">
                <div
                  className="absolute inset-x-0 top-1/2 h-[232px] w-full"
                  style={{ transform: "translateY(calc(-50% + 3px))" }}
                >
                  <EdgeContextObject
                    {...sharedObject}
                    traffic={isLg ? "off" : traffic}
                    enabled={enabled && !isLg}
                    onMetrics={isLg ? undefined : onMetrics}
                    className="relative h-full w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="hidden min-w-0 lg:block" data-hero-visual-column>
            <div
              className="relative h-[440px] w-full"
              style={{ transform: "translateX(40px)" }}
            >
              <EdgeContextObject
                {...sharedObject}
                traffic={isLg ? traffic : "off"}
                enabled={enabled && isLg}
                onMetrics={isLg ? onMetrics : undefined}
                className="relative h-full w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {lastMetrics && (
        <div hidden data-edge-metrics-json>
          {JSON.stringify(lastMetrics)}
        </div>
      )}

      <div className="h-[120vh] bg-[#080808]" aria-hidden data-edge-scroll-spacer>
        <div className="mini-page-rail pt-16 text-sm text-white/20">
          Scroll spacer — return to hero to resume interaction.
        </div>
      </div>

      {!hideChrome && (
        <>
          <button
            type="button"
            onClick={() => setDrawerOpen((v) => !v)}
            className="fixed bottom-4 right-4 z-50 rounded-md border border-white/20 bg-[#0c0c0c]/95 px-3 py-2 text-[11px] text-white/70 shadow-lg backdrop-blur-sm"
            data-edge-drawer-toggle
          >
            {drawerOpen ? "Hide lab" : "Lab controls"}
          </button>

          {drawerOpen && (
            <div
              className="fixed bottom-14 right-4 z-50 flex max-w-[min(100vw-2rem,360px)] flex-col gap-2 rounded-md border border-white/15 bg-[#0c0c0c]/95 p-3 text-[11px] text-white/70 shadow-lg backdrop-blur-sm"
              data-edge-drawer
            >
              <div className="text-white/40">
                Locked {EDGE_LOCK.interaction} · {EDGE_LOCK.split} ·{" "}
                {EDGE_LOCK.preResponse} · production runtime
              </div>
              <div className="text-white/55">
                {STABILITY_LABELS[stability]} · {vis}
              </div>

              <div className="flex flex-wrap gap-1">
                {(["E0", "E1", "E2"] as StabilityId[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setStability(id)}
                    className={btn(stability === id)}
                  >
                    {id}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setVis("V0")}
                  className={btn(vis === "V0")}
                >
                  V0
                </button>
                <button
                  type="button"
                  onClick={() => setVis("VB")}
                  className={btn(vis === "VB")}
                >
                  VB
                </button>
              </div>

              <div className="flex flex-wrap gap-1 border-t border-white/10 pt-2">
                {(
                  ["off", "T0", "T1", "T2", "T3", "T4", "T5"] as TrafficId[]
                ).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setScrubProgress(null);
                      setTraffic(id);
                    }}
                    className={btn(traffic === id)}
                  >
                    {id}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-1 border-t border-white/10 pt-2">
                <button
                  type="button"
                  onClick={() => setDebug((v) => !v)}
                  className={btn(debug)}
                >
                  Debug
                </button>
                <button
                  type="button"
                  onClick={() => setShowZones((v) => !v)}
                  className={btn(showZones)}
                >
                  Zones
                </button>
                <button
                  type="button"
                  onClick={() => setReduced((v) => !v)}
                  className={btn(reduced)}
                >
                  Reduced
                </button>
                <button
                  type="button"
                  onClick={() => setEnabled((v) => !v)}
                  className={btn(enabled)}
                >
                  Ix {enabled ? "on" : "off"}
                </button>
                <button
                  type="button"
                  onClick={() => setLowBright((v) => !v)}
                  className={btn(lowBright)}
                >
                  Dim
                </button>
              </div>

              <div className="flex items-center gap-2 border-t border-white/10 pt-2">
                <span className="text-white/40">ip</span>
                <input
                  type="range"
                  min={0}
                  max={1000}
                  value={Math.round((scrubProgress ?? 0) * 1000)}
                  onChange={(e) => {
                    setTraffic("off");
                    setScrubProgress(Number(e.target.value) / 1000);
                  }}
                  className="h-1 w-full accent-white/70"
                />
                <button
                  type="button"
                  onClick={() => setScrubProgress(null)}
                  className="rounded bg-white/5 px-2 py-1"
                >
                  live
                </button>
              </div>

              {lastMetrics && (
                <pre
                  className="max-h-40 overflow-auto border-t border-white/10 pt-2 font-mono text-[9px] text-white/45"
                  data-edge-metrics
                >
                  {JSON.stringify(lastMetrics, null, 2)}
                </pre>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
