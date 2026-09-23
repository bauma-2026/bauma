"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

type Concept = "structure" | "clarity" | "trust" | "decision";

type SystemConcept = {
  id: Concept;
  label: string;
  description: string;
};

export type SystemGraphicCopy = {
  eyebrow: string;
  headline: string;
  body: string;
  conceptsAria: string;
  concepts: readonly SystemConcept[];
};

const DEFAULT_COPY: SystemGraphicCopy = {
  eyebrow: "Sistemska plast",
  headline: "Pod površino je sistem.",
  body: "Stran ni samo zaporedje sekcij. Vsak del mora zmanjšati nejasnost, zgraditi zaupanje ali uporabnika premakniti naprej.",
  conceptsAria: "Sistemski koncepti",
  concepts: [
    {
      id: "structure",
      label: "Struktura",
      description: "Uredi vsebino v jasen vrstni red.",
    },
    {
      id: "clarity",
      label: "Jasnost",
      description: "Uporabnik hitreje razume, kaj je pomembno.",
    },
    {
      id: "trust",
      label: "Zaupanje",
      description: "Dvom se zmanjša, naslednji korak postane lažji.",
    },
    {
      id: "decision",
      label: "Odločitev",
      description: "Jasna pot pripelje do akcije.",
    },
  ],
};

/** Ids only — used by field geometry (labels come from copy). */
const concepts = DEFAULT_COPY.concepts;
type Connection = "squareCircle" | "squareRing" | "circleDecision" | "ringDecision";

const accentRgb = "209,164,95";
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const NODE_STROKE_COMMITTED: Record<Concept, number> = {
  structure: 0.86,
  clarity: 0.82,
  trust: 0.8,
  decision: 0.86,
};

const NODE_STROKE_REST: Record<Concept, number> = {
  structure: 0.42,
  clarity: 0.38,
  trust: 0.34,
  decision: 0.42,
};

const NODE_STROKE_PREVIEW = 0.38;
const NODE_FILL_COMMITTED: Partial<Record<Concept, number>> = {
  trust: 0.9,
  decision: 0.92,
};
const NODE_FILL_PREVIEW = 0.42;
const CONNECTION_PREVIEW_INTENSITY = 0.24;

type Point = { x: number; y: number };
type NodeOffsets = Record<Concept, Point>;
type NodeAngles = Record<Concept, number>;
type RestConnection = { length: number; direction: Point };
type RestGeometry = Record<Connection, RestConnection>;
type FieldElementCache = {
  nodes: Record<Concept, SVGGElement | null>;
  connections: Record<Connection, SVGPathElement | null>;
};
type FieldLayout = {
  nodes: Record<Concept, Point>;
  connections: Record<Connection, { from: Concept; to: Concept; start: Point; end: Point }>;
};

type CircularGeometry = Record<"clarity" | "trust", { radius: number; gap: number }>;

const zeroNodeOffsets = (): NodeOffsets => ({
  structure: { x: 0, y: 0 },
  clarity: { x: 0, y: 0 },
  trust: { x: 0, y: 0 },
  decision: { x: 0, y: 0 },
});

const zeroNodeAngles = (): NodeAngles => ({
  structure: 0,
  clarity: 0,
  trust: 0,
  decision: 0,
});

const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(value, maximum));

function rotatePoint(point: Point, centre: Point, degrees: number) {
  if (!degrees) return point;

  const radians = (degrees * Math.PI) / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  const x = point.x - centre.x;
  const y = point.y - centre.y;

  return {
    x: centre.x + x * cosine - y * sine,
    y: centre.y + x * sine + y * cosine,
  };
}

const resistanceProfile: Record<Concept, { radius: number; max: number; approach: number; return: number; fallback: Point; inset: Point }> = {
  structure: { radius: 112, max: 2.5, approach: 7.6, return: 2.7, fallback: { x: -0.7, y: 0.7 }, inset: { x: 43, y: 43 } },
  clarity: { radius: 134, max: 4.1, approach: 9.1, return: 2.7, fallback: { x: 0.6, y: -0.8 }, inset: { x: 44.5, y: 44.5 } },
  trust: { radius: 96, max: 3, approach: 10.7, return: 3.2, fallback: { x: -0.5, y: 0.8 }, inset: { x: 31.5, y: 31.5 } },
  decision: { radius: 100, max: 1.4, approach: 7.2, return: 2.9, fallback: { x: 0.8, y: 0.4 }, inset: { x: 34, y: 34 } },
};

const mobileFieldLayout: FieldLayout = {
  nodes: {
    structure: { x: 65, y: 47 },
    clarity: { x: 260, y: 82 },
    trust: { x: 178, y: 214 },
    decision: { x: 414, y: 183 },
  },
  connections: {
    squareCircle: { from: "structure", to: "clarity", start: { x: 89, y: 23 }, end: { x: 230.6, y: 71.86 } },
    squareRing: { from: "structure", to: "trust", start: { x: 89, y: 60 }, end: { x: 170.07, y: 200.28 } },
    circleDecision: { from: "clarity", to: "decision", start: { x: 285, y: 100.5 }, end: { x: 396.5, y: 183 } },
    ringDecision: { from: "trust", to: "decision", start: { x: 193.69, y: 211.77 }, end: { x: 396.5, y: 183 } },
  },
};

const desktopFieldLayout: FieldLayout = {
  nodes: {
    structure: { x: 88, y: 147 },
    clarity: { x: 325, y: 70 },
    trust: { x: 237, y: 230 },
    decision: { x: 535, y: 166 },
  },
  connections: {
    squareCircle: { from: "structure", to: "clarity", start: { x: 113, y: 122 }, end: { x: 293.82, y: 77.65 } },
    squareRing: { from: "structure", to: "trust", start: { x: 113, y: 161 }, end: { x: 223.15, y: 222.29 } },
    circleDecision: { from: "clarity", to: "decision", start: { x: 353.71, y: 84.36 }, end: { x: 517, y: 166 } },
    ringDecision: { from: "trust", to: "decision", start: { x: 252.45, y: 226.47 }, end: { x: 517, y: 166 } },
  },
};

const mobileCircularGeometry: CircularGeometry = {
  clarity: { radius: 28.5, gap: 2 },
  trust: { radius: 14, gap: 1.25 },
};

const desktopCircularGeometry: CircularGeometry = {
  clarity: { radius: 29.5, gap: 2 },
  trust: { radius: 14, gap: 1.25 },
};

const visibleStrokeCompensation = 0.6;

const angularConnections: Record<"structure" | "decision", Connection[]> = {
  structure: ["squareCircle", "squareRing"],
  decision: ["circleDecision", "ringDecision"],
};

function pointOnCircleToward(centre: Point, toward: Point, radius: number, opticalGap: number) {
  const vector = { x: toward.x - centre.x, y: toward.y - centre.y };
  const length = Math.hypot(vector.x, vector.y) || 1;
  const distance = radius + visibleStrokeCompensation + opticalGap;

  return {
    x: centre.x + (vector.x / length) * distance,
    y: centre.y + (vector.y / length) * distance,
  };
}

function nodeCentre(layout: FieldLayout, concept: Concept, offsets: NodeOffsets) {
  return {
    x: layout.nodes[concept].x + offsets[concept].x,
    y: layout.nodes[concept].y + offsets[concept].y,
  };
}

function connectionAnchors(
  layout: FieldLayout,
  geometry: CircularGeometry,
  offsets: NodeOffsets,
  angles: NodeAngles,
  connection: Connection
) {
  const { from, to, start, end } = layout.connections[connection];
  const fromCentre = nodeCentre(layout, from, offsets);
  const toCentre = nodeCentre(layout, to, offsets);
  let startWorld = rotatePoint(start, layout.nodes[from], angles[from]);
  let endWorld = rotatePoint(end, layout.nodes[to], angles[to]);

  startWorld = { x: startWorld.x + offsets[from].x, y: startWorld.y + offsets[from].y };
  endWorld = { x: endWorld.x + offsets[to].x, y: endWorld.y + offsets[to].y };

  if (from === "clarity" || from === "trust") {
    const circular = geometry[from];
    startWorld = pointOnCircleToward(fromCentre, endWorld, circular.radius, circular.gap);
  }

  if (to === "clarity" || to === "trust") {
    const circular = geometry[to];
    endWorld = pointOnCircleToward(toCentre, startWorld, circular.radius, circular.gap);
  }

  return { start: startWorld, end: endWorld };
}

function createRestGeometry(layout: FieldLayout, geometry: CircularGeometry): RestGeometry {
  const offsets = zeroNodeOffsets();
  const angles = zeroNodeAngles();
  return (Object.keys(layout.connections) as Connection[]).reduce((restGeometry, connection) => {
    const { start, end } = connectionAnchors(layout, geometry, offsets, angles, connection);
    const vector = { x: end.x - start.x, y: end.y - start.y };
    const length = Math.hypot(vector.x, vector.y) || 1;
    restGeometry[connection] = {
      length,
      direction: { x: vector.x / length, y: vector.y / length },
    };
    return restGeometry;
  }, {} as RestGeometry);
}

const mobileRestGeometry = createRestGeometry(mobileFieldLayout, mobileCircularGeometry);
const desktopRestGeometry = createRestGeometry(desktopFieldLayout, desktopCircularGeometry);
const decisionUpperRestAngles = {
  mobile: Math.atan2(
    mobileFieldLayout.nodes.decision.y - mobileFieldLayout.nodes.clarity.y,
    mobileFieldLayout.nodes.decision.x - mobileFieldLayout.nodes.clarity.x
  ),
  desktop: Math.atan2(
    desktopFieldLayout.nodes.decision.y - desktopFieldLayout.nodes.clarity.y,
    desktopFieldLayout.nodes.decision.x - desktopFieldLayout.nodes.clarity.x
  ),
};

function connectionOpacity(active: Concept) {
  return {
    squareCircle: active === "structure" || active === "clarity" ? 0.28 : 0.21,
    squareRing: active === "structure" ? 0.14 : active === "trust" ? 0.115 : 0.075,
    circleDecision: active === "clarity" ? 0.14 : active === "decision" ? 0.28 : 0.18,
    ringDecision: active === "trust" ? 0.085 : active === "decision" ? 0.05 : 0.03,
  };
}

function isConnectionAccented(concept: Concept, connection: Connection) {
  return (
    (concept === "structure" && (connection === "squareCircle" || connection === "squareRing")) ||
    (concept === "clarity" && (connection === "squareCircle" || connection === "circleDecision")) ||
    (concept === "trust" && (connection === "squareRing" || connection === "ringDecision")) ||
    (concept === "decision" && (connection === "circleDecision" || connection === "ringDecision"))
  );
}

function connectionStroke(
  connection: Connection,
  committed: Concept,
  preview: Concept | null,
  compact = false,
) {
  const restOpacity = Math.min(
    1,
    connectionOpacity(committed)[connection] * (compact ? 1.28 : 1),
  );
  const committedOpacity = isConnectionAccented(committed, connection) ? restOpacity : 0;
  const previewOpacity =
    preview && preview !== committed && isConnectionAccented(preview, connection)
      ? Math.max(restOpacity * CONNECTION_PREVIEW_INTENSITY, 0.05)
      : 0;
  const accentFloor = compact && isConnectionAccented(committed, connection) ? 0.4 : 0;
  const restFloor = compact ? 0.05 : 0;
  const finalOpacity = Math.max(restOpacity, committedOpacity, previewOpacity, accentFloor, restFloor);

  if (isConnectionAccented(committed, connection)) {
    return `rgba(${accentRgb},${finalOpacity})`;
  }

  if (preview && preview !== committed && isConnectionAccented(preview, connection)) {
    return `rgba(${accentRgb},${finalOpacity})`;
  }

  return `rgba(255,255,255,${finalOpacity})`;
}

function nodeStrokeColor(concept: Concept, committed: Concept, preview: Concept | null) {
  if (concept === committed) {
    return `rgba(${accentRgb},${NODE_STROKE_COMMITTED[concept]})`;
  }

  if (preview === concept) {
    return `rgba(${accentRgb},${NODE_STROKE_PREVIEW})`;
  }

  return `rgba(255,255,255,${NODE_STROKE_REST[concept]})`;
}

function nodeFillColor(concept: Concept, committed: Concept, preview: Concept | null) {
  if (concept === committed) {
    return `rgba(${accentRgb},${NODE_FILL_COMMITTED[concept] ?? 0.62})`;
  }

  if (preview === concept) {
    return `rgba(${accentRgb},${NODE_FILL_PREVIEW})`;
  }

  return "rgba(255,255,255,0.62)";
}

function isPointerPreview(event: ReactPointerEvent) {
  return event.pointerType === "mouse";
}

function nodeOffset(concept: Concept, time: number, scale: number, lift: number) {
  const cycle = Math.PI * 2;
  const wave = (duration: number, phase: number, secondaryDuration: number, secondaryPhase: number) =>
    Math.sin((time / duration) * cycle + phase) * 0.84 +
    Math.cos((time / secondaryDuration) * cycle + secondaryPhase) * 0.16;

  switch (concept) {
    case "structure":
      return {
        x: wave(11000, 0.2, 15400, 1.4) * 3.2 * lift * scale,
        y: wave(10200, 1.05, 13700, 2.6) * 3.7 * lift * scale,
      };
    case "clarity":
      return {
        x: wave(9200, 1.3, 12800, 0.45) * 3.7 * lift * scale,
        y: wave(8900, 2.2, 11900, 2.95) * 5.5 * lift * scale,
      };
    case "trust":
      return {
        x: wave(7600, 2.5, 10900, 0.65) * 4.1 * lift * scale,
        y: wave(7300, 0.75, 9800, 2.35) * 4.6 * lift * scale,
      };
    case "decision":
      return {
        x: wave(12400, 0.9, 17300, 2.1) * 2 * lift * scale,
        y: wave(11900, 2.8, 16100, 0.35) * 2.5 * lift * scale,
      };
  }
}

function relationalOffset(layout: FieldLayout, concept: Concept, time: number, scale: number) {
  const nodes = Object.values(layout.nodes);
  const centre = nodes.reduce((sum, node) => ({ x: sum.x + node.x, y: sum.y + node.y }), { x: 0, y: 0 });
  centre.x /= nodes.length;
  centre.y /= nodes.length;

  const node = layout.nodes[concept];
  const vector = { x: node.x - centre.x, y: node.y - centre.y };
  const length = Math.hypot(vector.x, vector.y) || 1;
  const profile: Record<Concept, { amplitude: number; phase: number }> = {
    structure: { amplitude: 1.3, phase: 0.2 },
    clarity: { amplitude: 2.2, phase: 1.1 },
    trust: { amplitude: 1.7, phase: 2.25 },
    decision: { amplitude: 0.9, phase: 3.2 },
  };
  const current = profile[concept];
  const tension = Math.sin((time / 15800) * Math.PI * 2 + current.phase) * current.amplitude * scale;

  return { x: (vector.x / length) * tension, y: (vector.y / length) * tension };
}

function SystemField({
  committed,
  preview,
  onSelect,
  onPreview,
  onClearPreview,
}: {
  committed: Concept;
  preview: Concept | null;
  onSelect: (concept: Concept) => void;
  onPreview: (concept: Concept) => void;
  onClearPreview: () => void;
}) {
  const mobileFieldRef = useRef<SVGSVGElement>(null);
  const desktopFieldRef = useRef<SVGSVGElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const mobileElementCacheRef = useRef<FieldElementCache | null>(null);
  const desktopElementCacheRef = useRef<FieldElementCache | null>(null);
  const compactMotionScaleRef = useRef(0.6);
  const compactTorqueScaleRef = useRef(0.52);
  const pointerRef = useRef({ inside: false, x: 0, y: 0 });
  const desktopBoundsRef = useRef<{ left: number; top: number; width: number; height: number; inverseScale: number } | null>(null);
  const resistanceRef = useRef<NodeOffsets>(zeroNodeOffsets());
  const mobileAnglesRef = useRef<NodeAngles>(zeroNodeAngles());
  const desktopAnglesRef = useRef<NodeAngles>(zeroNodeAngles());
  const mobileDecisionFollowRef = useRef<Point>({ x: 0, y: 0 });
  const desktopDecisionFollowRef = useRef<Point>({ x: 0, y: 0 });
  const activeRef = useRef(committed);
  const desktopMotionScaleRef = useRef(1);
  const desktopVisibleRef = useRef(false);

  useEffect(() => {
    activeRef.current = committed;
  }, [committed]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine) and (hover: hover)");
    let reducedMotionActive = reducedMotion.matches;
    const upperBranchVelocity = {
      mobile: { initialized: false, previousDelta: 0, filtered: 0 },
      desktop: { initialized: false, previousDelta: 0, filtered: 0 },
    };

    const cacheFieldElements = (field: SVGSVGElement | null): FieldElementCache | null => {
      if (!field) return null;

      return {
        nodes: Object.fromEntries(
          (concepts.map(({ id }) => [id, field.querySelector<SVGGElement>(`[data-system-node="${id}"]`)]))
        ) as FieldElementCache["nodes"],
        connections: Object.fromEntries(
          (Object.keys(desktopFieldLayout.connections) as Connection[]).map((connection) => [
            connection,
            field.querySelector<SVGPathElement>(`[data-system-connection="${connection}"]`),
          ])
        ) as FieldElementCache["connections"],
      };
    };

    mobileElementCacheRef.current = cacheFieldElements(mobileFieldRef.current);
    desktopElementCacheRef.current = cacheFieldElements(desktopFieldRef.current);

    const updateDesktopBounds = () => {
      const bounds = desktopFieldRef.current?.getBoundingClientRect();
      if (!bounds) return;

      const scale = Math.min(bounds.width / 600, bounds.height / 300);
      const width = 600 * scale;
      const height = 300 * scale;

      desktopBoundsRef.current = {
        left: bounds.left + (bounds.width - width) / 2,
        top: bounds.top + (bounds.height - height) / 2,
        width,
        height,
        inverseScale: 1 / scale,
      };
    };

    const updateCompactMotionScale = () => {
      compactMotionScaleRef.current = window.matchMedia("(min-width: 768px)").matches ? 0.84 : 0.6;
      compactTorqueScaleRef.current = window.matchMedia("(min-width: 768px)").matches ? 0.58 : 0.52;
      desktopMotionScaleRef.current = window.innerWidth < 1280 ? 0.84 : 1;
      const desktopVisible = window.matchMedia("(min-width: 1024px)").matches;
      upperBranchVelocity.mobile.initialized = false;
      upperBranchVelocity.desktop.initialized = false;
      if (desktopVisible !== desktopVisibleRef.current) {
        mobileDecisionFollowRef.current = { x: 0, y: 0 };
        desktopDecisionFollowRef.current = { x: 0, y: 0 };
        desktopVisibleRef.current = desktopVisible;
      }
      updateDesktopBounds();
    };
    updateCompactMotionScale();
    window.addEventListener("resize", updateCompactMotionScale);

    const updatePointerPosition = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType !== "mouse") return;

      const bounds = desktopBoundsRef.current;
      if (!bounds) return;

      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      if (x < 0 || y < 0 || x > bounds.width || y > bounds.height) {
        clearPointerPosition();
        return;
      }

      pointerRef.current = { inside: true, x: x * bounds.inverseScale, y: y * bounds.inverseScale };
    };

    const enterPointerRegion = (event: PointerEvent) => {
      updateDesktopBounds();
      updatePointerPosition(event);
    };

    const clearPointerPosition = () => {
      pointerRef.current.inside = false;
    };

    const updatePointerCapability = () => {
      if (!finePointer.matches) clearPointerPosition();
    };

    const desktopField = desktopFieldRef.current;
    desktopField?.addEventListener("pointerenter", enterPointerRegion);
    desktopField?.addEventListener("pointermove", updatePointerPosition);
    desktopField?.addEventListener("pointerleave", clearPointerPosition);
    finePointer.addEventListener("change", updatePointerCapability);

    let frameId: number | null = null;
    let previousTime = 0;
    const createAmbientOffsets = (layout: FieldLayout, scale: number, time: number, lift: number) => Object.fromEntries(
      (Object.keys(layout.nodes) as Concept[]).map((concept) => {
        const drift = nodeOffset(concept, time, scale, lift);
        const relational = relationalOffset(layout, concept, time, scale);
        const independentWeight = concept === "decision" ? 0.25 : 1;
        const relationalWeight = concept === "decision" ? 0.3 : 1;
        return [concept, {
          x: drift.x * independentWeight + relational.x * relationalWeight,
          y: drift.y * independentWeight + relational.y * relationalWeight,
        }];
      })
    ) as NodeOffsets;

    const dampDecisionFollow = (current: Point, target: Point, deltaSeconds: number) => {
      const difference = Math.hypot(target.x - current.x, target.y - current.y);
      const rate = difference > 0.015 ? 7.2 : 5.2;
      const damping = 1 - Math.exp(-rate * deltaSeconds);
      current.x += (target.x - current.x) * damping;
      current.y += (target.y - current.y) * damping;
      return current;
    };

    const connectionTensionTorque = (
      layout: FieldLayout,
      geometry: CircularGeometry,
      restGeometry: RestGeometry,
      concept: "structure",
      offsets: NodeOffsets,
      angles: NodeAngles
    ) => {
      const gain = 520;
      const maximum = 3.2;
      const centre = {
        x: layout.nodes[concept].x + offsets[concept].x,
        y: layout.nodes[concept].y + offsets[concept].y,
      };

      const torque = angularConnections[concept].reduce((total, connection) => {
        const { from } = layout.connections[connection];
        const { start: startWorld, end: endWorld } = connectionAnchors(
          layout,
          geometry,
          offsets,
          angles,
          connection
        );
        const angularNodeIsSource = from === concept;
        const anchor = angularNodeIsSource ? startWorld : endWorld;
        const other = angularNodeIsSource ? endWorld : startWorld;
        const vector = { x: other.x - anchor.x, y: other.y - anchor.y };
        const length = Math.hypot(vector.x, vector.y) || 1;
        const direction = { x: vector.x / length, y: vector.y / length };
        const rest = restGeometry[connection];
        const extension = (length - rest.length) / rest.length;
        const compressionWeight = 0.58;
        const lengthTension = extension >= 0 ? extension : extension * compressionWeight;
        const directionalChange = rest.direction.x * direction.y - rest.direction.y * direction.x;
        const forceStrength = clamp(lengthTension + directionalChange * 0.12, -0.045, 0.07);
        const anchorOffset = { x: anchor.x - centre.x, y: anchor.y - centre.y };
        const anchorLength = Math.hypot(anchorOffset.x, anchorOffset.y) || 1;
        const normalizedTorque = (anchorOffset.x * direction.y - anchorOffset.y * direction.x) / anchorLength;
        return total + normalizedTorque * forceStrength * gain;
      }, 0);

      return clamp(torque, -maximum, maximum);
    };

    const decisionTorqueComponents = (
      layout: FieldLayout,
      geometry: CircularGeometry,
      restGeometry: RestGeometry,
      offsets: NodeOffsets,
      angles: NodeAngles
    ) => {
      const centre = {
        x: layout.nodes.decision.x + offsets.decision.x,
        y: layout.nodes.decision.y + offsets.decision.y,
      };

      return angularConnections.decision.reduce((components, connection) => {
        const { start: startWorld, end: endWorld } = connectionAnchors(
          layout,
          geometry,
          offsets,
          angles,
          connection
        );
        const anchor = endWorld;
        const other = startWorld;
        const vector = { x: other.x - anchor.x, y: other.y - anchor.y };
        const length = Math.hypot(vector.x, vector.y) || 1;
        const direction = { x: vector.x / length, y: vector.y / length };
        const rest = restGeometry[connection];
        const extension = (length - rest.length) / rest.length;
        const lengthTension = extension >= 0 ? extension : extension * 0.58;
        const directionalChange = rest.direction.x * direction.y - rest.direction.y * direction.x;
        const anchorOffset = { x: anchor.x - centre.x, y: anchor.y - centre.y };
        const anchorLength = Math.hypot(anchorOffset.x, anchorOffset.y) || 1;
        const normalizedTorque = (anchorOffset.x * direction.y - anchorOffset.y * direction.x) / anchorLength;
        const branchWeight = connection === "circleDecision" ? 1.2 : 0.9;
        const gain = 460 * branchWeight;

        const forceStrength = clamp(lengthTension + directionalChange * 0.12, -0.045, 0.07);
        components.tension += normalizedTorque * forceStrength * gain;
        return components;
      }, { tension: 0 });
    };

    const upperBranchAngleDelta = (layout: FieldLayout, offsets: NodeOffsets, restAngle: number) => {
      const vector = {
        x: layout.nodes.decision.x + offsets.decision.x - layout.nodes.clarity.x - offsets.clarity.x,
        y: layout.nodes.decision.y + offsets.decision.y - layout.nodes.clarity.y - offsets.clarity.y,
      };
      const currentAngle = Math.atan2(vector.y, vector.x);
      return Math.atan2(Math.sin(currentAngle - restAngle), Math.cos(currentAngle - restAngle));
    };

    const upperBranchAngleTorque = (delta: number) => {
      const degrees = (delta * 180) / Math.PI;

      return clamp(degrees * 2.16, -2.3, 2.3);
    };

    const upperBranchVelocityTorque = (
      state: { initialized: boolean; previousDelta: number; filtered: number },
      delta: number,
      deltaSeconds: number,
      synchronize: boolean
    ) => {
      if (synchronize || !state.initialized) {
        state.initialized = true;
        state.previousDelta = delta;
        state.filtered = 0;
        return 0;
      }

      const difference = Math.atan2(
        Math.sin(delta - state.previousDelta),
        Math.cos(delta - state.previousDelta)
      );
      const rawVelocity = difference / deltaSeconds;
      const smoothing = 1 - Math.exp(-12 * deltaSeconds);
      state.filtered += (rawVelocity - state.filtered) * smoothing;
      state.previousDelta = delta;

      return Math.tanh(((state.filtered * 180) / Math.PI) / 10) * 0.4;
    };

    const pointerTorque = (
      concept: "structure" | "decision",
      layout: FieldLayout,
      offsets: NodeOffsets,
      resistance: Point,
      scale: number
    ) => {
      const pointer = pointerRef.current;
      if (!pointer.inside) return 0;

      const centre = {
        x: layout.nodes[concept].x + offsets[concept].x,
        y: layout.nodes[concept].y + offsets[concept].y,
      };
      const vector = { x: pointer.x - centre.x, y: pointer.y - centre.y };
      const distance = Math.hypot(vector.x, vector.y);
      if (distance < 6) return 0;

      const resistanceStrength = clamp(
        Math.hypot(resistance.x, resistance.y) / resistanceProfile[concept].max,
        0,
        1
      );
      const directionalTorque = (2 * vector.x * vector.y) / (distance * distance);
      const maximum = concept === "structure" ? 1.5 : 0.9;

      return directionalTorque * resistanceStrength * maximum * scale;
    };

    const dampAngles = (current: NodeAngles, targets: NodeAngles, deltaSeconds: number) => {
      (['structure', 'decision'] as const).forEach((concept) => {
        const meaningfulTorque = Math.abs(targets[concept]) > 0.08;
        const rate = concept === "structure"
          ? meaningfulTorque ? 8.2 : 5.1
          : meaningfulTorque ? 9 : 6;
        const damping = 1 - Math.exp(-rate * deltaSeconds);
        current[concept] += (targets[concept] - current[concept]) * damping;
      });

      return current;
    };

    const applyMotion = (
      cache: FieldElementCache | null,
      layout: FieldLayout,
      geometry: CircularGeometry,
      offsets: NodeOffsets,
      angles: NodeAngles
    ) => {
      if (!cache) return;

      (Object.keys(offsets) as Concept[]).forEach((concept) => {
        const angle = angles[concept];
        const centre = layout.nodes[concept];
        const offset = offsets[concept];
        if (
          !centre ||
          !offset ||
          !Number.isFinite(centre.x) ||
          !Number.isFinite(centre.y) ||
          !Number.isFinite(offset.x) ||
          !Number.isFinite(offset.y) ||
          !Number.isFinite(angle)
        ) {
          return;
        }
        cache.nodes[concept]?.setAttribute(
            "transform",
            `translate(${offset.x} ${offset.y}) rotate(${angle} ${centre.x} ${centre.y})`
          );
      });

      (Object.keys(layout.connections) as Connection[]).forEach((connection) => {
        const anchors = connectionAnchors(layout, geometry, offsets, angles, connection);
        if (
          !Number.isFinite(anchors.start.x) ||
          !Number.isFinite(anchors.start.y) ||
          !Number.isFinite(anchors.end.x) ||
          !Number.isFinite(anchors.end.y)
        ) {
          return;
        }
        cache.connections[connection]?.setAttribute(
          "d",
          `M ${anchors.start.x} ${anchors.start.y} L ${anchors.end.x} ${anchors.end.y}`,
        );
      });
    };

    const renderStaticComposition = () => {
      resistanceRef.current = zeroNodeOffsets();
      mobileDecisionFollowRef.current = { x: 0, y: 0 };
      desktopDecisionFollowRef.current = { x: 0, y: 0 };
      mobileAnglesRef.current = zeroNodeAngles();
      desktopAnglesRef.current = zeroNodeAngles();
      upperBranchVelocity.mobile.initialized = false;
      upperBranchVelocity.desktop.initialized = false;
      applyMotion(
        mobileElementCacheRef.current,
        mobileFieldLayout,
        mobileCircularGeometry,
        zeroNodeOffsets(),
        mobileAnglesRef.current
      );
      applyMotion(
        desktopElementCacheRef.current,
        desktopFieldLayout,
        desktopCircularGeometry,
        zeroNodeOffsets(),
        desktopAnglesRef.current
      );
    };

    const animate = (time: number) => {
      frameId = null;
      if (reducedMotionActive) return;

      const elapsedSeconds = previousTime ? (time - previousTime) / 1000 : 0;
      const synchronizeVelocity = !previousTime || elapsedSeconds > 0.25;
      const deltaSeconds = previousTime ? Math.min(elapsedSeconds, 0.05) : 1 / 60;
      previousTime = time;
      const mobileAmbient = createAmbientOffsets(mobileFieldLayout, compactMotionScaleRef.current, time, 1.05);
      const desktopAmbient = createAmbientOffsets(desktopFieldLayout, desktopMotionScaleRef.current, time, 1.08);
      const mobileDecisionFollow = dampDecisionFollow(
        mobileDecisionFollowRef.current,
        {
          x: mobileAmbient.clarity.x * 0.32 + mobileAmbient.trust.x * 0.15,
          y: mobileAmbient.clarity.y * 0.28 + mobileAmbient.trust.y * 0.18,
        },
        deltaSeconds
      );
      const mobileOffsets: NodeOffsets = {
        ...mobileAmbient,
        decision: {
          x: mobileAmbient.decision.x + mobileDecisionFollow.x,
          y: mobileAmbient.decision.y + mobileDecisionFollow.y,
        },
      };
      const desktopOffsets = zeroNodeOffsets();
      const desktopResistance = zeroNodeOffsets();

      const updateDesktopOffset = (concept: Concept, baseOffset: Point) => {
        const profile = resistanceProfile[concept];
        const pointer = pointerRef.current;
        let target = { x: 0, y: 0 };

        if (pointer.inside && finePointer.matches) {
          const centre = desktopFieldLayout.nodes[concept];
          const vector = { x: centre.x + baseOffset.x - pointer.x, y: centre.y + baseOffset.y - pointer.y };
          const distance = Math.hypot(vector.x, vector.y);

          if (distance < profile.radius) {
            const falloff = 1 - distance / profile.radius;
            const strength = falloff * falloff * (3 - 2 * falloff) * profile.max;
            const direction = distance > 0.001
              ? { x: vector.x / distance, y: vector.y / distance }
              : profile.fallback;
            target = { x: direction.x * strength, y: direction.y * strength };
          }
        }

        target = {
          x: Math.max(profile.inset.x - desktopFieldLayout.nodes[concept].x - baseOffset.x, Math.min(target.x, 600 - profile.inset.x - desktopFieldLayout.nodes[concept].x - baseOffset.x)),
          y: Math.max(profile.inset.y - desktopFieldLayout.nodes[concept].y - baseOffset.y, Math.min(target.y, 300 - profile.inset.y - desktopFieldLayout.nodes[concept].y - baseOffset.y)),
        };

        const current = resistanceRef.current[concept];
        const targetMagnitude = Math.hypot(target.x, target.y);
        const currentMagnitude = Math.hypot(current.x, current.y);
        const damping = 1 - Math.exp(-(targetMagnitude > currentMagnitude ? profile.approach : profile.return) * deltaSeconds);
        const resistance = {
          x: current.x + (target.x - current.x) * damping,
          y: current.y + (target.y - current.y) * damping,
        };

        resistanceRef.current[concept] = resistance;
        desktopResistance[concept] = resistance;
        desktopOffsets[concept] = { x: baseOffset.x + resistance.x, y: baseOffset.y + resistance.y };
      };

      (['structure', 'clarity', 'trust'] as const).forEach((concept) => {
        updateDesktopOffset(concept, desktopAmbient[concept]);
      });

      const desktopDecisionFollow = dampDecisionFollow(
        desktopDecisionFollowRef.current,
        {
          x: desktopOffsets.clarity.x * 0.32 + desktopOffsets.trust.x * 0.15,
          y: desktopOffsets.clarity.y * 0.28 + desktopOffsets.trust.y * 0.18,
        },
        deltaSeconds
      );
      updateDesktopOffset("decision", {
        x: desktopAmbient.decision.x + desktopDecisionFollow.x,
        y: desktopAmbient.decision.y + desktopDecisionFollow.y,
      });

      const mobileTorqueFactor = compactTorqueScaleRef.current / compactMotionScaleRef.current;
      const mobileTargets = zeroNodeAngles();
      const desktopTargets = zeroNodeAngles();

      (['structure', 'decision'] as const).forEach((concept) => {
        if (concept === "decision") {
          const mobileComponents = decisionTorqueComponents(
            mobileFieldLayout,
            mobileCircularGeometry,
            mobileRestGeometry,
            mobileOffsets,
            mobileAnglesRef.current
          );
          const desktopComponents = decisionTorqueComponents(
            desktopFieldLayout,
            desktopCircularGeometry,
            desktopRestGeometry,
            desktopOffsets,
            desktopAnglesRef.current
          );
          const mobileUpperDelta = upperBranchAngleDelta(
            mobileFieldLayout,
            mobileOffsets,
            decisionUpperRestAngles.mobile
          );
          const desktopUpperDelta = upperBranchAngleDelta(
            desktopFieldLayout,
            desktopOffsets,
            decisionUpperRestAngles.desktop
          );
          const mobileVelocityTorque = upperBranchVelocityTorque(
            upperBranchVelocity.mobile,
            mobileUpperDelta,
            deltaSeconds,
            synchronizeVelocity
          );
          const desktopVelocityTorque = upperBranchVelocityTorque(
            upperBranchVelocity.desktop,
            desktopUpperDelta,
            deltaSeconds,
            synchronizeVelocity
          );
          const mobileNetworkTorque =
            upperBranchAngleTorque(mobileUpperDelta) * 0.8 +
            mobileComponents.tension * 0.2;
          const desktopNetworkTorque =
            upperBranchAngleTorque(desktopUpperDelta) * 0.8 +
            desktopComponents.tension * 0.2;
          const desktopTorqueScale = desktopMotionScaleRef.current;
          const mobileVelocityScale = Math.min(compactTorqueScaleRef.current, 0.55);
          const mobileNetworkTarget = clamp((mobileNetworkTorque + 1) * mobileTorqueFactor, -1.4 * mobileTorqueFactor, 3 * mobileTorqueFactor);
          const desktopNetworkTarget = clamp(desktopNetworkTorque + desktopTorqueScale, -1.4 * desktopTorqueScale, 3 * desktopTorqueScale);
          const mobileActiveBias = activeRef.current === "decision" ? 0.51 : 0;
          const desktopActiveBias = activeRef.current === "decision" ? 0.85 * desktopTorqueScale : 0;

          mobileTargets.decision = clamp(
            mobileNetworkTarget + mobileActiveBias + mobileVelocityTorque * mobileVelocityScale,
            -2 * mobileTorqueFactor,
            4 * mobileTorqueFactor
          );
          desktopTargets.decision = clamp(
            desktopNetworkTarget +
              desktopActiveBias +
              desktopVelocityTorque * desktopTorqueScale +
              pointerTorque(
              concept,
              desktopFieldLayout,
              desktopOffsets,
              desktopResistance[concept],
              desktopMotionScaleRef.current
            ),
            -2 * desktopTorqueScale,
            4 * desktopTorqueScale
          );
          return;
        }

        const mobileTension = connectionTensionTorque(
          mobileFieldLayout,
          mobileCircularGeometry,
          mobileRestGeometry,
          concept,
          mobileAmbient,
          mobileAnglesRef.current
        );
        const desktopTension = connectionTensionTorque(
          desktopFieldLayout,
          desktopCircularGeometry,
          desktopRestGeometry,
          concept,
          desktopOffsets,
          desktopAnglesRef.current
        );
        mobileTargets.structure = mobileTension * mobileTorqueFactor;
        desktopTargets.structure = clamp(
          desktopTension + pointerTorque(
            concept,
            desktopFieldLayout,
            desktopOffsets,
            desktopResistance[concept],
            desktopMotionScaleRef.current
          ),
          -4,
          4
        );
      });

      const mobileAngles = dampAngles(mobileAnglesRef.current, mobileTargets, deltaSeconds);
      const desktopAngles = dampAngles(desktopAnglesRef.current, desktopTargets, deltaSeconds);
      applyMotion(mobileElementCacheRef.current, mobileFieldLayout, mobileCircularGeometry, mobileOffsets, mobileAngles);
      applyMotion(desktopElementCacheRef.current, desktopFieldLayout, desktopCircularGeometry, desktopOffsets, desktopAngles);
      startAnimation();
    };

    const stopAnimation = () => {
      if (frameId === null) return;
      window.cancelAnimationFrame(frameId);
      frameId = null;
    };

    let sectionInView = false;
    let pageVisible = document.visibilityState === "visible";

    const startAnimation = () => {
      if (reducedMotionActive || frameId !== null) return;
      if (!sectionInView || !pageVisible) return;
      frameId = window.requestAnimationFrame(animate);
    };

    const syncAnimation = () => {
      if (reducedMotionActive) {
        stopAnimation();
        return;
      }
      if (sectionInView && pageVisible) {
        previousTime = 0;
        startAnimation();
      } else {
        stopAnimation();
        pointerRef.current = { inside: false, x: 0, y: 0 };
      }
    };

    const updateReducedMotion = (event: MediaQueryListEvent) => {
      reducedMotionActive = event.matches;
      previousTime = 0;
      upperBranchVelocity.mobile.initialized = false;
      upperBranchVelocity.desktop.initialized = false;
      if (reducedMotionActive) {
        stopAnimation();
        renderStaticComposition();
      } else {
        syncAnimation();
      }
    };

    reducedMotion.addEventListener("change", updateReducedMotion);

    const host = hostRef.current;
    let io: IntersectionObserver | null = null;
    if (host && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          sectionInView =
            !!entry?.isIntersecting && (entry.intersectionRatio ?? 0) > 0.15;
          syncAnimation();
        },
        { threshold: [0, 0.15, 0.35, 0.6, 1] },
      );
      io.observe(host);
    } else {
      sectionInView = true;
    }

    const onVisibility = () => {
      pageVisible = document.visibilityState === "visible";
      syncAnimation();
    };
    document.addEventListener("visibilitychange", onVisibility);

    if (reducedMotionActive) renderStaticComposition();
    else syncAnimation();
    return () => {
      stopAnimation();
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", updateCompactMotionScale);
      desktopField?.removeEventListener("pointerenter", enterPointerRegion);
      desktopField?.removeEventListener("pointermove", updatePointerPosition);
      desktopField?.removeEventListener("pointerleave", clearPointerPosition);
      finePointer.removeEventListener("change", updatePointerCapability);
      reducedMotion.removeEventListener("change", updateReducedMotion);
    };
  }, []);

  const handleNodePointerEnter = (concept: Concept) => (event: ReactPointerEvent<SVGGElement>) => {
    if (isPointerPreview(event)) onPreview(concept);
  };

  const handleNodePointerLeave = (event: ReactPointerEvent<SVGGElement>) => {
    if (!isPointerPreview(event)) return;

    const related = event.relatedTarget;
    if (related instanceof Element && related.closest(".mini-system-selectable")) return;

    onClearPreview();
  };

  const handleFieldPointerLeave = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!isPointerPreview(event)) return;

    const related = event.relatedTarget;
    if (related instanceof Element && event.currentTarget.contains(related)) return;

    onClearPreview();
  };

  return (
    <div ref={hostRef} className="h-full w-full">
      <svg
        aria-hidden="true"
        className="mini-system-field-mobile pointer-events-auto h-full w-full lg:hidden"
        fill="none"
        focusable="false"
        onPointerLeave={handleFieldPointerLeave}
        preserveAspectRatio="xMidYMid meet"
        ref={mobileFieldRef}
        viewBox="12 4 456 280"
      >
        <g aria-hidden="true" className="mini-system-micro-a" stroke="rgba(255,255,255,0.18)" strokeWidth="1">
          <path d="M18 21H36V39" />
          <path d="M456 191L474 197" />
        </g>
        <g aria-hidden="true" className="mini-system-micro-b" fill="rgba(255,255,255,0.22)">
          <circle cx="310" cy="265" r="2.5" />
        </g>
        <g aria-hidden="true" className="mini-system-micro-c" stroke="rgba(255,255,255,0.13)" strokeWidth="1">
          <path d="M104 278H124V258" />
        </g>

        <g aria-hidden="true" fill="none" strokeWidth="1">
          <path className="mini-system-connection mini-system-connection--square-circle" d="M89 23L230.6 71.86" data-system-connection="squareCircle" stroke={connectionStroke("squareCircle", committed, preview, true)} />
          <path className="mini-system-connection mini-system-connection--square-ring" d="M89 60L170.07 200.28" data-system-connection="squareRing" stroke={connectionStroke("squareRing", committed, preview, true)} />
          <path className="mini-system-connection mini-system-connection--circle-decision" d="M285 100.5L396.5 183" data-system-connection="circleDecision" stroke={connectionStroke("circleDecision", committed, preview, true)} />
          <path className="mini-system-connection mini-system-connection--ring-decision" d="M193.69 211.77L396.5 183" data-system-connection="ringDecision" stroke={connectionStroke("ringDecision", committed, preview, true)} />
        </g>

        <g className="mini-system-selectable" data-system-node="structure" onClick={() => onSelect("structure")} onPointerEnter={handleNodePointerEnter("structure")} onPointerLeave={handleNodePointerLeave}>
          <rect className="mini-system-element" height="48" width="48" x="41" y="23" stroke={nodeStrokeColor("structure", committed, preview)} strokeWidth="1.2" />
          <rect className="mini-system-hit" height="84" width="84" x="23" y="5" />
        </g>
        <g className="mini-system-selectable" data-system-node="clarity" onClick={() => onSelect("clarity")} onPointerEnter={handleNodePointerEnter("clarity")} onPointerLeave={handleNodePointerLeave}>
          <circle className="mini-system-element" cx="260" cy="82" r="28.5" stroke={nodeStrokeColor("clarity", committed, preview)} strokeWidth="1.2" />
          <circle className="mini-system-hit" cx="260" cy="82" r="43.5" />
        </g>
        <g className="mini-system-selectable" data-system-node="trust" onClick={() => onSelect("trust")} onPointerEnter={handleNodePointerEnter("trust")} onPointerLeave={handleNodePointerLeave}>
          <circle className="mini-system-element" cx="178" cy="214" r="14" stroke={nodeStrokeColor("trust", committed, preview)} strokeWidth="1.2" />
          <circle className="mini-system-element" cx="178" cy="214" r="2.7" fill={nodeFillColor("trust", committed, preview)} />
          <circle className="mini-system-hit" cx="178" cy="214" r="31" />
        </g>
        <g className="mini-system-selectable" data-system-node="decision" onClick={() => onSelect("decision")} onPointerEnter={handleNodePointerEnter("decision")} onPointerLeave={handleNodePointerLeave}>
          <path className="mini-system-element" d="M414 165.5L431.5 183L414 200.5L396.5 183Z" stroke={nodeStrokeColor("decision", committed, preview)} strokeWidth="1.2" />
          <circle className="mini-system-element" cx="414" cy="183" r="2.7" fill={nodeFillColor("decision", committed, preview)} />
          <path className="mini-system-hit" d="M414 149.5L447.5 183L414 216.5L380.5 183Z" />
        </g>
      </svg>

      <svg
        aria-hidden="true"
        className="pointer-events-auto hidden h-full w-full lg:block"
        fill="none"
        focusable="false"
        onPointerLeave={handleFieldPointerLeave}
        preserveAspectRatio="xMidYMid meet"
        ref={desktopFieldRef}
        viewBox="0 0 600 300"
      >
        <g aria-hidden="true" className="mini-system-micro-a" stroke="rgba(255,255,255,0.18)" strokeWidth="1">
          <path d="M35 66H55V86" />
          <circle cx="407" cy="36" r="3" />
          <path d="M577 188L594 195" />
        </g>
        <g aria-hidden="true" className="mini-system-micro-b" fill="rgba(255,255,255,0.22)">
          <circle cx="33" cy="194" r="2" />
          <circle cx="348" cy="274" r="2.5" />
          <circle cx="388" cy="276" r="1.5" />
        </g>
        <g aria-hidden="true" className="mini-system-micro-c" stroke="rgba(255,255,255,0.13)" strokeWidth="1">
          <path d="M150 278L168 260" />
          <path d="M452 278H474V256" />
        </g>

        <g aria-hidden="true" fill="none" strokeWidth="1">
          <path className="mini-system-connection mini-system-connection--square-circle" d="M113 122L293.82 77.65" data-system-connection="squareCircle" stroke={connectionStroke("squareCircle", committed, preview)} />
          <path className="mini-system-connection mini-system-connection--square-ring" d="M113 161L223.15 222.29" data-system-connection="squareRing" stroke={connectionStroke("squareRing", committed, preview)} />
          <path className="mini-system-connection mini-system-connection--circle-decision" d="M353.71 84.36L517 166" data-system-connection="circleDecision" stroke={connectionStroke("circleDecision", committed, preview)} />
          <path className="mini-system-connection mini-system-connection--ring-decision" d="M252.45 226.47L517 166" data-system-connection="ringDecision" stroke={connectionStroke("ringDecision", committed, preview)} />
        </g>

        <g className="mini-system-selectable" data-system-node="structure" onClick={() => onSelect("structure")} onPointerEnter={handleNodePointerEnter("structure")} onPointerLeave={handleNodePointerLeave}>
          <rect className="mini-system-element" height="50" width="50" x="63" y="122" stroke={nodeStrokeColor("structure", committed, preview)} strokeWidth="1.2" />
          <rect className="mini-system-hit" height="86" width="86" x="45" y="104" />
        </g>
        <g className="mini-system-selectable" data-system-node="clarity" onClick={() => onSelect("clarity")} onPointerEnter={handleNodePointerEnter("clarity")} onPointerLeave={handleNodePointerLeave}>
          <circle className="mini-system-element" cx="325" cy="70" r="29.5" stroke={nodeStrokeColor("clarity", committed, preview)} strokeWidth="1.2" />
          <circle className="mini-system-hit" cx="325" cy="70" r="44.5" />
        </g>
        <g className="mini-system-selectable" data-system-node="trust" onClick={() => onSelect("trust")} onPointerEnter={handleNodePointerEnter("trust")} onPointerLeave={handleNodePointerLeave}>
          <circle className="mini-system-element" cx="237" cy="230" r="14" stroke={nodeStrokeColor("trust", committed, preview)} strokeWidth="1.2" />
          <circle className="mini-system-element" cx="237" cy="230" r="2.7" fill={nodeFillColor("trust", committed, preview)} />
          <circle className="mini-system-hit" cx="237" cy="230" r="31.5" />
        </g>
        <g className="mini-system-selectable" data-system-node="decision" onClick={() => onSelect("decision")} onPointerEnter={handleNodePointerEnter("decision")} onPointerLeave={handleNodePointerLeave}>
          <path className="mini-system-element" d="M535 148L553 166L535 184L517 166Z" stroke={nodeStrokeColor("decision", committed, preview)} strokeWidth="1.2" />
          <circle className="mini-system-element" cx="535" cy="166" r="2.7" fill={nodeFillColor("decision", committed, preview)} />
          <path className="mini-system-hit" d="M535 132L569 166L535 200L501 166Z" />
        </g>
      </svg>

      <style>{`
        .mini-system-element,
        .mini-system-connection {
          transition: stroke 160ms ${EASE}, fill 160ms ${EASE}, opacity 200ms ${EASE};
        }

        .mini-system-selectable {
          cursor: pointer;
          pointer-events: all;
        }

        .mini-system-connection,
        .mini-system-micro-a,
        .mini-system-micro-b,
        .mini-system-micro-c {
          pointer-events: none;
        }

        .mini-system-hit {
          fill: transparent;
          stroke: none;
        }

        .mini-system-connection--square-circle {
          animation: mini-system-line-breathe-a 8.6s ease-in-out infinite;
        }

        .mini-system-connection--square-ring {
          animation: mini-system-line-breathe-b 10.4s ease-in-out -2.7s infinite;
        }

        .mini-system-connection--circle-decision {
          animation: mini-system-line-breathe-c 9.3s ease-in-out -5.1s infinite;
        }

        .mini-system-connection--ring-decision {
          animation: mini-system-line-breathe-d 7.8s ease-in-out -1.8s infinite;
        }

        .mini-system-description {
          display: block;
          animation: mini-system-description-fade 180ms ease;
        }

        .mini-system-micro-a,
        .mini-system-micro-b,
        .mini-system-micro-c {
          transform-box: fill-box;
          transform-origin: center;
        }

        .mini-system-micro-a {
          animation: mini-system-drift-a 16.8s ease-in-out infinite;
        }

        .mini-system-micro-b {
          animation: mini-system-drift-b 17.6s ease-in-out -4.2s infinite;
        }

        .mini-system-micro-c {
          animation: mini-system-drift-c 13.8s ease-in-out -2.1s infinite;
        }

        @keyframes mini-system-drift-a {
          0%, 100% { opacity: 0.5; transform: translate3d(0, 0, 0); }
          50% { opacity: 0.58; transform: translate3d(0.5px, -1px, 0); }
        }

        @keyframes mini-system-drift-b {
          0%, 100% { opacity: 0.4; transform: translate3d(0, 0, 0); }
          50% { opacity: 0.58; transform: translate3d(2px, 3px, 0); }
        }

        @keyframes mini-system-drift-c {
          0%, 100% { opacity: 0.32; transform: translate3d(0, 0, 0); }
          50% { opacity: 0.56; transform: translate3d(-4px, 3px, 0); }
        }

        @keyframes mini-system-description-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes mini-system-line-breathe-a {
          0%, 100% { opacity: 0.94; }
          50% { opacity: 1; }
        }

        @keyframes mini-system-line-breathe-b {
          0%, 100% { opacity: 0.96; }
          50% { opacity: 1; }
        }

        @keyframes mini-system-line-breathe-c {
          0%, 100% { opacity: 0.95; }
          50% { opacity: 1; }
        }

        @keyframes mini-system-line-breathe-d {
          0%, 100% { opacity: 0.98; }
          50% { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .mini-system-element,
          .mini-system-connection,
          .mini-system-description,
          .mini-system-micro-a,
          .mini-system-micro-b,
          .mini-system-micro-c {
            animation: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

function ContextualDescription({
  concept,
  description,
}: {
  concept: Concept;
  description: string;
}) {
  return (
    <p className="mt-4 min-h-[3rem] max-w-[46ch] text-sm leading-6 text-white/55">
      <span className="mini-system-description" key={concept}>
        {description}
      </span>
    </p>
  );
}

export default function SystemGraphic({
  copy = DEFAULT_COPY,
}: {
  copy?: SystemGraphicCopy;
}) {
  const [committed, setCommitted] = useState<Concept>("structure");
  const [preview, setPreview] = useState<Concept | null>(null);
  const committedConcept = copy.concepts.find(({ id }) => id === committed)!;

  const handleCommit = (concept: Concept) => {
    setCommitted(concept);
    setPreview(null);
  };

  const handlePreview = (concept: Concept) => {
    setPreview(concept);
  };

  const handleClearPreview = () => {
    setPreview(null);
  };

  const handleConceptGroupPointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isPointerPreview(event)) return;

    const related = event.relatedTarget;
    if (related instanceof Node && event.currentTarget.contains(related)) return;

    handleClearPreview();
  };

  return (
    <section
      className="relative overflow-hidden border-t border-white/10 bg-[#0a0a0a] py-20 text-white sm:py-24 lg:py-28"
    >
      <div className="mini-page-rail grid min-w-0 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="min-w-0">
          <span id="system" data-anchor-marker aria-hidden="true" />
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
            {copy.eyebrow}
          </p>

          <h2 className="home-primary-heading mt-5 max-w-[11ch]">
            {copy.headline}
          </h2>

          <p className="mt-6 max-w-[48ch] text-base leading-7 text-white/55">
            {copy.body}
          </p>

          <div className="mt-7 max-w-[48ch]">
            <div
              aria-label={copy.conceptsAria}
              className="flex flex-wrap items-center gap-x-2 gap-y-2"
              onPointerLeave={handleConceptGroupPointerLeave}
              role="group"
            >
              {copy.concepts.map((concept, index) => {
                const isCommitted = committed === concept.id;
                const isPreview = preview === concept.id && !isCommitted;

                return (
                <span className="flex items-center gap-x-2" key={concept.id}>
                  {index > 0 && <span aria-hidden="true" className="text-xs text-white/28">·</span>}
                  <button
                    aria-pressed={isCommitted}
                    className={[
                      "cursor-pointer rounded-sm text-sm font-medium tracking-[-0.01em] transition-colors duration-[160ms]",
                      "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/70",
                      isCommitted
                        ? "text-[#D1A45F]"
                        : isPreview
                          ? "text-[#D1A45F]/42"
                          : "text-white/55",
                    ].join(" ")}
                    onClick={() => handleCommit(concept.id)}
                    onFocus={() => {
                      setCommitted(concept.id);
                      setPreview(null);
                    }}
                    onPointerEnter={(event) => {
                      if (isPointerPreview(event)) handlePreview(concept.id);
                    }}
                    style={{ transitionTimingFunction: EASE }}
                    type="button"
                  >
                    {concept.label}
                  </button>
                </span>
                );
              })}
            </div>

            <ContextualDescription
              concept={committedConcept.id}
              description={committedConcept.description}
            />
          </div>
        </div>

        <figure
          aria-labelledby="system-view-title"
          className="relative min-w-0 w-full max-lg:aspect-[456/280] lg:h-[320px]"
        >
          <figcaption id="system-view-title" className="sr-only">
            An abstract relational system: a structured foundation connects to clarity and trust, which support a user decision.
          </figcaption>
          <SystemField
            committed={committed}
            onClearPreview={handleClearPreview}
            onPreview={handlePreview}
            onSelect={handleCommit}
            preview={preview}
          />
        </figure>
      </div>
    </section>
  );
}
