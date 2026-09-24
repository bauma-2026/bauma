"use client";

import { useEffect, useRef } from "react";
import {
  hoverFollowCurve,
  pocketHoverFollowK,
} from "@/lib/pocketHoverFollow";
import { MINI_OBJECT_FILL } from "./miniObjectMaterial";

type Vec3 = { x: number; y: number; z: number };
type Vec2 = { x: number; y: number; z: number };

const VW = 520;
const VH = 400;
/** Projection centre, offset so the rest silhouette keeps the previous bbox centre (268, 194.5). */
const CX = 273;
const CY = 181.5;
/** Screen-space pocket size is calibrated by rendered bbox, not vs Pristop SCALE. */
const SCALE = 102;
const FOCAL = 3.4;
const CAMERA_Z = 2.45;

/**
 * Rest pose: camera slightly above-right (~23° pitch, ~31° yaw).
 * Main face dominant on the left, right side a real plane, top visible but secondary.
 */
const REST_RX = 0.4;
const REST_RY = -0.54;

/**
 * Interaction copied from gb-next MobileCubeScene
 * (`/lab/mobile-cube`). Constants kept in lockstep with that file.
 */
const DRAG_SENSITIVITY_X = 0.014;
const DRAG_SENSITIVITY_Y = 0.012;
const MAX_ROTATION_X = 0.78;
const MAX_ROTATION_Y = 1.15;
const RELEASE_VELOCITY_MULTIPLIER = 0.55;
const SPRING_STRENGTH = 0.085;
const SPRING_DAMPING = 0.82;
const EXTENDED_SETTLE_SPRING_STRENGTH = 0.062;
const EXTENDED_SETTLE_DAMPING = 0.875;
const RETURN_POSITION_THRESHOLD = 0.0005;
const RETURN_VELOCITY_THRESHOLD = 0.0005;
const MAX_VELOCITY_X = 0.045;
const MAX_VELOCITY_Y = 0.065;
const RESISTANCE_START_RATIO = 0.68;
const MIN_RESISTANCE_FACTOR = 0.22;
const RESISTANCE_CURVE_POWER = 1.8;
const MAX_TENSION_RESISTANCE_RELIEF = 0.18;
const MAX_TENSION_ROTATION_BONUS = 0.28;
const MAX_TENSION_RELEASE_BONUS = 0.18;
const MAX_TENSION_SPRING_REDUCTION = 0.018;
const MAX_VERTICAL_TENSION_ROTATION_BONUS = 0.16;
const MAX_VERTICAL_TENSION_RELEASE_BONUS = 0.12;
const MAX_VERTICAL_TENSION_SPRING_REDUCTION = 0.012;

const PERSISTENCE_GAIN_PER_SWIPE = 0.34;
const PERSISTENCE_DECAY_PER_SECOND = 0.16;
const PERSISTENCE_CONTINUATION_WINDOW_MS = 1800;
const VERTICAL_PERSISTENCE_GAIN_PER_SWIPE = 0.28;
const VERTICAL_PERSISTENCE_CONTINUATION_WINDOW_MS = 2800;
const MIN_QUALIFYING_SWIPE_DISTANCE = 42;
const HORIZONTAL_DOMINANCE_RATIO = 1.35;
const DIRECTION_COMMIT_RATIO = 0.72;
const OPPOSITE_DIRECTION_PENALTY = 0.48;
const VERTICAL_OPPOSITE_DIRECTION_PENALTY = 0.5;
const MIN_QUALIFYING_VERTICAL_SWIPE_DISTANCE = 48;
const VERTICAL_DOMINANCE_RATIO = 1.5;
const VERTICAL_DIRECTION_COMMIT_RATIO = 0.76;
const FULL_TURN_THRESHOLD = 0.84;
const VERTICAL_FULL_TURN_THRESHOLD = 0.84;
const FULL_TURN_DURATION_MS = 720;
const PRE_TURN_HOLD_MS = 90;
const PRE_TURN_COMPRESSION = 0.06;
const POST_TURN_HOLD_MS = 110;
const X_PRE_TURN_COMPRESSION = 0.055;
const X_PRE_TURN_HOLD_MS = 105;
const X_FULL_TURN_DURATION_MS = 820;
const X_POST_TURN_HOLD_MS = 125;

const HIT_PAD = 22;

/** True cube in local space so depth recedes as volume, not a slab. */
const EX = 1;
const EY = 1;
const EZ = 1;

/**
 * Face fills are opaque pre-composites from miniObjectMaterial
 * (same set as Vizualna plast). Cube edge alphas stay close enough
 * that every structural edge reads as a closed volume; ghost stays quiet.
 */
const STROKE = {
  front: "rgba(255,255,255,0.35)",
  mid: "rgba(255,255,255,0.29)",
  rear: "rgba(255,255,255,0.22)",
  ghost: "rgba(255,255,255,0.06)",
} as const;

const FILL = {
  near: MINI_OBJECT_FILL.front,
  top: MINI_OBJECT_FILL.rear,
  side: MINI_OBJECT_FILL.side,
} as const;

/** Local-space: top-front, then front-right vertical. */
const ACCENT_EDGE_INDICES = new Set([0, 1]);
const ACCENT_RGB = [209, 164, 95] as const;
const ACCENT_HOVER = 0.72;
const ACCENT_DRAG = 0.94;
const ACCENT_TURN = 1;
const ACCENT_ALPHA_PEAK = 0.66;
const ACCENT_IDLE_MIN = 0.24;
const ACCENT_IDLE_MAX = 0.44;

const IDLE_AMP_X = 0.022;
const IDLE_AMP_Y = 0.046;
const IDLE_RESUME_MS = 880;
const IDLE_START_MS = 220;
const IDLE_FREQ_X1 = 0.36;
const IDLE_FREQ_X2 = 0.52;
const IDLE_FREQ_Y1 = 0.4;
const IDLE_FREQ_Y2 = 0.48;
const IDLE_REST_MIN_S = 2.8;
const IDLE_REST_MAX_S = 7.4;
const IDLE_DRIFT_MIN_S = 1.5;
const IDLE_DRIFT_MAX_S = 3.2;
const IDLE_PITCH_SCALE = 0.68;
const IDLE_YAW_EMPHASIS = 1.28;

/** gb MobileCubeScene intro flip + idle tease (Spline not used). */
const INTRO_VISIBLE_RATIO = 0.5;
const INTRO_DELAY_MS = 650;
const INTRO_FLIP_DIRECTION: -1 | 1 = 1;
const INTRO_ANTICIPATION_X = -0.16;
const INTRO_ANTICIPATION_DURATION_MS = 520;
const INTRO_ANTICIPATION_HOLD_MS = 85;
const INTRO_FLIP_COMPRESSION = 0.045;
const INTRO_FLIP_COMPRESSION_MS = 110;
const INTRO_X_FLIP_DURATION_MS = 980;
const INTRO_FLIP_HOLD_MS = 0;
const INTRO_RECOIL_FORWARD = 0.19;
const INTRO_RECOIL_FORWARD_MS = 360;
const INTRO_LANDING_SWAY_1 = 0.085;
const INTRO_LANDING_SWAY_2 = 0.038;
const INTRO_LANDING_SWAY_1_MS = 360;
const INTRO_LANDING_SWAY_2_MS = 300;
const INTRO_LANDING_RETURN_MS = 360;
const IDLE_TEASE_MIN_MS = 20000;
const IDLE_TEASE_MAX_MS = 42000;
const IDLE_TEASE_MOVE_MS = 520;
const IDLE_TEASE_HOLD_MS = 120;

/** Pre-drag pointer-follow, weaker than drag. */
const HOVER_YAW_MAX = 0.08;
const HOVER_PITCH_MAX = 0.048;

/** Mobile-only ambient scroll nudge (radians). Preset B: ~4.0° yaw, ~2.0° pitch caps. */
const MOBILE_SCROLL_MQ = "(max-width: 1023px)";
const SCROLL_OFFSET_MAX_RY = (4.0 * Math.PI) / 180;
const SCROLL_OFFSET_MAX_RX = (2.0 * Math.PI) / 180;
const SCROLL_IMPULSE_PER_PX = 0.000112;
const SCROLL_VEL_DAMP_PER_S = 9.5;
const SCROLL_OFFSET_RETURN_PER_S = 5.8;
const SCROLL_VEL_CLAMP_RY = 0.014;
const SCROLL_VEL_CLAMP_RX = 0.0085;
const SCROLL_PITCH_MIX = 0.26;

const CORNERS: Vec3[] = [
  { x: -EX, y: -EY, z: -EZ },
  { x: EX, y: -EY, z: -EZ },
  { x: EX, y: EY, z: -EZ },
  { x: -EX, y: EY, z: -EZ },
  { x: -EX, y: -EY, z: EZ },
  { x: EX, y: -EY, z: EZ },
  { x: EX, y: EY, z: EZ },
  { x: -EX, y: EY, z: EZ },
];

const EDGES: readonly [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

const FACES: readonly {
  i: readonly [number, number, number, number];
  fill: string;
}[] = [
  { i: [0, 1, 2, 3], fill: FILL.near },
  { i: [4, 5, 1, 0], fill: FILL.top },
  { i: [1, 5, 6, 2], fill: FILL.side },
  { i: [4, 0, 3, 7], fill: FILL.side },
  { i: [5, 4, 7, 6], fill: FILL.near },
  { i: [3, 2, 6, 7], fill: FILL.top },
];

const EDGE_FACES: readonly number[][] = EDGES.map(([ia, ib]) =>
  FACES.flatMap((face, faceIndex) =>
    face.i.includes(ia) && face.i.includes(ib) ? [faceIndex] : [],
  ),
);

type DragState = {
  pointerId: number;
  previousX: number;
  previousY: number;
  previousTime: number;
  totalHorizontalDistance: number;
  totalVerticalDistance: number;
  netHorizontalDistance: number;
  netVerticalDistance: number;
  targetRotationX: number;
  targetRotationY: number;
  velocityX: number;
  velocityY: number;
};

type PersistenceAxisState = {
  value: number;
  direction: -1 | 0 | 1;
  lastGestureTime: number;
};

type PersistenceResult = {
  direction: -1 | 0 | 1;
  persistence: number;
};

type GestureAxis = "horizontal" | "vertical" | "ambiguous";
type EarnedTurnAxis = "x" | "y";

function rotate(p: Vec3, rx: number, ry: number): Vec3 {
  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  const x1 = p.x * cy - p.z * sy;
  const z1 = p.x * sy + p.z * cy;
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  const y2 = p.y * cx - z1 * sx;
  const z2 = p.y * sx + z1 * cx;
  return { x: x1, y: y2, z: z2 };
}

function project(p: Vec3, rx: number, ry: number, scale = SCALE): Vec2 {
  const r = rotate(p, rx, ry);
  const s = FOCAL / (FOCAL + r.z + CAMERA_Z);
  return {
    x: CX + r.x * scale * s,
    y: CY + r.y * scale * s,
    z: r.z,
  };
}

function poly(pts: Vec2[]) {
  return pts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
}

/** Positive screen-space signed area = face points at the camera (exact under perspective). */
function faceFacing(pts: Vec2[], face: readonly number[]) {
  let area = 0;
  for (let k = 0; k < face.length; k++) {
    const a = pts[face[k]];
    const b = pts[face[(k + 1) % face.length]];
    area += a.x * b.y - b.x * a.y;
  }
  return area > 0;
}

/** An edge is drawn only when at least one adjacent face is visible — solid cube, no see-through wire. */
function edgeVisible(facing: boolean[], edgeIndex: number) {
  return EDGE_FACES[edgeIndex].some((faceIndex) => facing[faceIndex]);
}

function edgeWeight(a: Vec2, b: Vec2) {
  const z = (a.z + b.z) / 2;
  if (z < -0.1) return { stroke: STROKE.front, width: 1, opacity: 1 };
  if (z < 0.18) return { stroke: STROKE.mid, width: 1, opacity: 1 };
  return { stroke: STROKE.rear, width: 0.9, opacity: 1 };
}

/** Tint a white structural stroke toward Bauma amber without changing its alpha. */
function withAccent(stroke: string, amount: number) {
  if (amount <= 0.001) return stroke;
  const match = /^rgba\(255,255,255,([0-9.]+)\)$/.exec(stroke);
  if (!match) return stroke;
  const t = clamp(amount, 0, 1);
  const baseA = Number(match[1]);
  const a = (baseA + (ACCENT_ALPHA_PEAK - baseA) * t).toFixed(3);
  const r = Math.round(255 + (ACCENT_RGB[0] - 255) * t);
  const g = Math.round(255 + (ACCENT_RGB[1] - 255) * t);
  const b = Math.round(255 + (ACCENT_RGB[2] - 255) * t);
  return `rgba(${r},${g},${b},${a})`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function smoothstep(value: number) {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

/** gb-next MobileCubeScene.applyHorizontalResistance */
function applyHorizontalResistance({
  baseY,
  currentY,
  deltaY,
  maxRotationY,
  tension,
}: {
  baseY: number;
  currentY: number;
  deltaY: number;
  maxRotationY: number;
  tension: number;
}) {
  if (deltaY === 0) return 0;

  const displacement = currentY - baseY;
  const draggingAwayFromBase =
    Math.sign(deltaY) === Math.sign(displacement) || displacement === 0;

  if (!draggingAwayFromBase) {
    return deltaY;
  }

  const normalizedDistance = clamp(Math.abs(displacement) / maxRotationY, 0, 1);
  const resistanceProgress = smoothstep(
    clamp(
      (normalizedDistance - RESISTANCE_START_RATIO) /
        (1 - RESISTANCE_START_RATIO),
      0,
      1,
    ),
  );
  const relievedResistanceProgress =
    resistanceProgress * (1 - tension * MAX_TENSION_RESISTANCE_RELIEF);
  const resistanceFactor =
    1 -
    (1 - MIN_RESISTANCE_FACTOR) *
      Math.pow(relievedResistanceProgress, RESISTANCE_CURVE_POWER);

  return deltaY * clamp(resistanceFactor, MIN_RESISTANCE_FACTOR, 1);
}

function easeOutCubic(value: number) {
  const t = clamp(value, 0, 1);
  return 1 - Math.pow(1 - t, 3);
}

function fullTurnEase(value: number) {
  const t = clamp(value, 0, 1);

  if (t < 0.15) {
    const local = t / 0.15;
    return 0.08 * local * local;
  }

  if (t < 0.76) {
    const local = (t - 0.15) / 0.61;
    return 0.08 + 0.72 * (0.5 - Math.cos(local * Math.PI) / 2);
  }

  const local = (t - 0.76) / 0.24;
  return 0.8 + 0.2 * (1 - Math.pow(1 - local, 3));
}

function introFlipEase(value: number) {
  const t = clamp(value, 0, 1);
  if (t < 0.17) {
    const local = t / 0.17;
    return 0.075 * local * local;
  }
  if (t < 0.76) {
    const local = (t - 0.17) / 0.59;
    return 0.075 + 0.73 * (0.5 - Math.cos(local * Math.PI) / 2);
  }
  const local = (t - 0.76) / 0.24;
  return 0.805 + 0.195 * (1 - Math.pow(1 - local, 3));
}

function introContinuationEase(value: number) {
  return 1 - Math.pow(1 - clamp(value, 0, 1), 2.4);
}

function introAnticipationEase(value: number) {
  const t = clamp(value, 0, 1);
  return 0.5 - Math.cos(t * Math.PI) / 2;
}

function introRecoilEase(value: number) {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

function introLandingFinalEase(value: number) {
  return 1 - Math.pow(1 - clamp(value, 0, 1), 3.2);
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

type IdleTeaseName =
  | "horizontal-glance"
  | "opposite-glance"
  | "diagonal-nudge"
  | "vertical-curiosity";

function getIdleTease(previous: IdleTeaseName | null) {
  const variants: Array<{
    name: IdleTeaseName;
    x: [number, number];
    y: [number, number];
  }> = [
    { name: "horizontal-glance", x: [-0.04, -0.04], y: [0.18, 0.25] },
    { name: "opposite-glance", x: [0.05, 0.05], y: [-0.22, -0.14] },
    { name: "diagonal-nudge", x: [0.07, 0.1], y: [0.1, 0.16] },
    { name: "vertical-curiosity", x: [-0.11, -0.08], y: [-0.06, -0.06] },
  ];
  const pool =
    previous == null
      ? variants
      : variants.filter((variant) => variant.name !== previous);
  const selected = pool[Math.floor(Math.random() * pool.length)] ?? variants[0];
  return {
    name: selected.name,
    x: randomBetween(selected.x[0], selected.x[1]),
    y: randomBetween(selected.y[0], selected.y[1]),
  };
}

function getQualifiedSwipeDirection(drag: DragState): -1 | 0 | 1 {
  const absoluteHorizontal = Math.abs(drag.netHorizontalDistance);

  if (absoluteHorizontal < MIN_QUALIFYING_SWIPE_DISTANCE) {
    return 0;
  }

  if (
    absoluteHorizontal <
    drag.totalVerticalDistance * HORIZONTAL_DOMINANCE_RATIO
  ) {
    return 0;
  }

  if (
    drag.totalHorizontalDistance > 0 &&
    absoluteHorizontal / drag.totalHorizontalDistance < DIRECTION_COMMIT_RATIO
  ) {
    return 0;
  }

  return drag.netHorizontalDistance > 0 ? 1 : -1;
}

function getQualifiedVerticalSwipeDirection(drag: DragState): -1 | 0 | 1 {
  const absoluteVertical = Math.abs(drag.netVerticalDistance);

  if (absoluteVertical < MIN_QUALIFYING_VERTICAL_SWIPE_DISTANCE) {
    return 0;
  }

  if (
    absoluteVertical <
    drag.totalHorizontalDistance * VERTICAL_DOMINANCE_RATIO
  ) {
    return 0;
  }

  if (
    drag.totalVerticalDistance > 0 &&
    absoluteVertical / drag.totalVerticalDistance <
      VERTICAL_DIRECTION_COMMIT_RATIO
  ) {
    return 0;
  }

  return drag.netVerticalDistance < 0 ? 1 : -1;
}

function classifyGestureAxis(drag: DragState): GestureAxis {
  if (getQualifiedSwipeDirection(drag) !== 0) {
    return "horizontal";
  }

  if (getQualifiedVerticalSwipeDirection(drag) !== 0) {
    return "vertical";
  }

  return "ambiguous";
}

function getCommittedHorizontalRotationDirection(
  drag: DragState,
  releaseVelocityY: number,
): -1 | 1 {
  const velocityThreshold = 0.002;
  const committedDirection = drag.netHorizontalDistance > 0 ? 1 : -1;

  if (Math.abs(releaseVelocityY) >= velocityThreshold) {
    const velocityDirection = releaseVelocityY > 0 ? 1 : -1;

    if (velocityDirection === committedDirection) {
      return velocityDirection;
    }
  }

  return committedDirection;
}

function getCommittedVerticalRotationDirection(
  drag: DragState,
  releaseVelocityX: number,
): -1 | 1 {
  const velocityThreshold = 0.002;

  if (Math.abs(releaseVelocityX) >= velocityThreshold) {
    return releaseVelocityX > 0 ? 1 : -1;
  }

  return drag.netVerticalDistance < 0 ? 1 : -1;
}

function emptyPersistence(): PersistenceAxisState {
  return { value: 0, direction: 0, lastGestureTime: 0 };
}

function hitBox(pts: Vec2[]) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of pts) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return {
    x: minX - HIT_PAD,
    y: minY - HIT_PAD,
    w: maxX - minX + HIT_PAD * 2,
    h: maxY - minY + HIT_PAD * 2,
  };
}

type MiniNextStepCubeProps = {
  className?: string;
};

export default function MiniNextStepCube({
  className = "",
}: MiniNextStepCubeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const objectRef = useRef<SVGGElement>(null);
  const ghostRef = useRef<SVGGElement>(null);
  const hitRef = useRef<SVGRectElement>(null);
  const rxRef = useRef(REST_RX);
  const ryRef = useRef(REST_RY);
  const rafRef = useRef<number | null>(null);
  const turnRafRef = useRef<number | null>(null);
  const decayRafRef = useRef<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const object = objectRef.current;
    const ghost = ghostRef.current;
    const hit = hitRef.current;
    if (!root || !object || !ghost || !hit) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = media.matches;

    const faceEls = FACES.map((_, index) =>
      object.querySelector(`[data-face="${index}"]`),
    );
    const edgeEls = EDGES.map((_, index) =>
      object.querySelector(`[data-edge="${index}"]`),
    );
    const ghostEls = EDGES.map((_, index) =>
      ghost.querySelector(`[data-ghost="${index}"]`),
    );
    let drag: DragState | null = null;
    let hovering = false;
    let accent = 0;
    let idleGain = 0;
    let idleClock = 0;
    let idleRx = 0;
    let idleRy = 0;
    let idlePhrase: "rest" | "drift" = "rest";
    let idlePhraseUntil = 0;
    let idleEnvelope = 0;
    let idleSpeed = 1;
    let idlePhaseX = 0.4;
    let idlePhaseY = 0;
    let idleYawScale = 1;
    let idleResumeAt = Number.POSITIVE_INFINITY;
    let hoverRx = 0;
    let hoverRy = 0;
    let hoverTargetRx = 0;
    let hoverTargetRy = 0;
    let introConsumed = false;
    let introCancelledByPointer = false;
    let draggedAfterIntroCancel = false;
    let autoRaf: number | null = null;
    let autoKind: "none" | "intro" | "tease" = "none";
    let idleTeaseTimeout: number | null = null;
    let lastIdleTease: IdleTeaseName | null = null;
    let startIdleTease = () => {};

    const mobileScrollMq = window.matchMedia(MOBILE_SCROLL_MQ);
    let isMobile = mobileScrollMq.matches;
    let scrollOffsetRx = 0;
    let scrollOffsetRy = 0;
    let scrollVelRx = 0;
    let scrollVelRy = 0;
    let lastScrollY = window.scrollY;

    const resetScrollNudge = () => {
      scrollOffsetRx = 0;
      scrollOffsetRy = 0;
      scrollVelRx = 0;
      scrollVelRy = 0;
      lastScrollY = window.scrollY;
    };

    const onWindowScroll = () => {
      if (!isMobile || reduced || drag != null) return;
      const y = window.scrollY;
      const dy = y - lastScrollY;
      lastScrollY = y;
      if (dy === 0) return;
      scrollVelRy += -dy * SCROLL_IMPULSE_PER_PX;
      scrollVelRx += dy * SCROLL_IMPULSE_PER_PX * SCROLL_PITCH_MIX;
      scrollVelRy = clamp(scrollVelRy, -SCROLL_VEL_CLAMP_RY, SCROLL_VEL_CLAMP_RY);
      scrollVelRx = clamp(scrollVelRx, -SCROLL_VEL_CLAMP_RX, SCROLL_VEL_CLAMP_RX);
    };

    const syncMobileScroll = () => {
      isMobile = mobileScrollMq.matches;
      if (!isMobile || reduced) resetScrollNudge();
      else lastScrollY = window.scrollY;
    };

    const paint = (rx: number, ry: number) => {
      const pts = CORNERS.map((c) => project(c, rx, ry));
      const ghostPts = CORNERS.map((c) => project(c, rx, ry, SCALE * 1.035));
      const ghostActive =
        drag != null || turnRafRef.current != null || autoRaf != null;
      ghost.style.opacity = ghostActive ? "0.4" : "1";

      const facing = FACES.map((face) => faceFacing(pts, face.i));

      for (const [index, face] of FACES.entries()) {
        const el = faceEls[index];
        if (!(el instanceof SVGPolygonElement)) continue;
        const corners = face.i.map((i) => pts[i]);
        el.setAttribute("points", poly(corners));
        el.setAttribute("opacity", facing[index] ? "1" : "0");
      }

      for (const [index, [ia, ib]] of EDGES.entries()) {
        const el = edgeEls[index];
        if (!(el instanceof SVGLineElement)) continue;
        const a = pts[ia];
        const b = pts[ib];
        const w = edgeWeight(a, b);
        const stroke = ACCENT_EDGE_INDICES.has(index)
          ? withAccent(w.stroke, accent)
          : w.stroke;
        el.setAttribute("x1", a.x.toFixed(2));
        el.setAttribute("y1", a.y.toFixed(2));
        el.setAttribute("x2", b.x.toFixed(2));
        el.setAttribute("y2", b.y.toFixed(2));
        el.setAttribute("stroke", stroke);
        el.setAttribute("stroke-width", String(w.width));
        el.setAttribute(
          "opacity",
          edgeVisible(facing, index) ? String(w.opacity) : "0",
        );
      }

      for (const [index, [ia, ib]] of EDGES.entries()) {
        const el = ghostEls[index];
        if (!(el instanceof SVGLineElement)) continue;
        const a = ghostPts[ia];
        const b = ghostPts[ib];
        el.setAttribute("x1", (a.x + 3).toFixed(2));
        el.setAttribute("y1", (a.y + 2.5).toFixed(2));
        el.setAttribute("x2", (b.x + 3).toFixed(2));
        el.setAttribute("y2", (b.y + 2.5).toFixed(2));
      }

      const box = hitBox(pts);
      hit.setAttribute("x", box.x.toFixed(2));
      hit.setAttribute("y", box.y.toFixed(2));
      hit.setAttribute("width", box.w.toFixed(2));
      hit.setAttribute("height", box.h.toFixed(2));
    };

    const visiblePose = () => {
      const scrollRx =
        isMobile && !reduced && drag == null ? scrollOffsetRx : 0;
      const scrollRy =
        isMobile && !reduced && drag == null ? scrollOffsetRy : 0;
      return {
        rx: rxRef.current + idleGain * idleRx + hoverRx + scrollRx,
        ry: ryRef.current + idleGain * idleRy + hoverRy + scrollRy,
      };
    };

    const applyPose = (rx: number, ry: number) => {
      rxRef.current = rx;
      ryRef.current = ry;
      const vis = visiblePose();
      paint(vis.rx, vis.ry);
    };

    const bakeIdleIntoPose = () => {
      if (idleGain === 0 && hoverRx === 0 && hoverRy === 0) return;
      rxRef.current += idleGain * idleRx + hoverRx;
      ryRef.current += idleGain * idleRy + hoverRy;
      idleGain = 0;
      idleRx = 0;
      idleRy = 0;
      idleClock = 0;
      idlePhrase = "rest";
      idlePhraseUntil = 0;
      idleEnvelope = 0;
      idleYawScale = 1;
      hoverRx = 0;
      hoverRy = 0;
      hoverTargetRx = 0;
      hoverTargetRy = 0;
    };

    const setHoverTargetFromPointer = (event: PointerEvent) => {
      const svg = hit.ownerSVGElement;
      const ctm = svg?.getScreenCTM();
      if (!svg || !ctm) return;
      const pointer = new DOMPoint(event.clientX, event.clientY).matrixTransform(
        ctm.inverse(),
      );
      const base = {
        rx: rxRef.current + idleGain * idleRx,
        ry: ryRef.current + idleGain * idleRy,
      };
      const pts = CORNERS.map((c) => project(c, base.rx, base.ry));
      let minX = pts[0].x;
      let maxX = pts[0].x;
      let minY = pts[0].y;
      let maxY = pts[0].y;
      let ox = 0;
      let oy = 0;
      for (const p of pts) {
        ox += p.x;
        oy += p.y;
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      }
      ox /= pts.length;
      oy /= pts.length;
      const halfW = Math.max((maxX - minX) * 0.5, 1);
      const halfH = Math.max((maxY - minY) * 0.5, 1);
      const nx = clamp((pointer.x - ox) / halfW, -1, 1);
      const ny = clamp((pointer.y - oy) / halfH, -1, 1);
      hoverTargetRy = hoverFollowCurve(nx, 2.25, 0.2) * HOVER_YAW_MAX;
      hoverTargetRx = hoverFollowCurve(ny, 1.85, 0.52) * HOVER_PITCH_MAX;
    };

    const scheduleIdle = (delay = IDLE_RESUME_MS) => {
      idleResumeAt = performance.now() + delay;
    };

    const clearIdleTease = () => {
      if (idleTeaseTimeout != null) {
        window.clearTimeout(idleTeaseTimeout);
        idleTeaseTimeout = null;
      }
    };

    const stopAuto = () => {
      if (autoRaf != null) {
        cancelAnimationFrame(autoRaf);
        autoRaf = null;
      }
      autoKind = "none";
    };

    const cancelAutonomous = (consumeIntro = false) => {
      if (autoKind === "intro") introCancelledByPointer = true;
      clearIdleTease();
      stopAuto();
      if (consumeIntro) introConsumed = true;
    };

    const scheduleIdleTease = () => {
      clearIdleTease();
      if (reduced || !introConsumed || hovering || drag != null) return;
      idleTeaseTimeout = window.setTimeout(() => {
        idleTeaseTimeout = null;
        if (Math.random() < 0.28) {
          scheduleIdleTease();
          return;
        }
        startIdleTease();
      }, randomBetween(IDLE_TEASE_MIN_MS, IDLE_TEASE_MAX_MS));
    };

    const afterAutonomousSettle = () => {
      if (hovering || reduced) return;
      scheduleIdle();
      scheduleIdleTease();
    };

    applyPose(REST_RX, REST_RY);

    let horizontalPersistence = emptyPersistence();
    let verticalPersistence = emptyPersistence();

    const setCursor = (value: "grab" | "grabbing" | "") => {
      hit.style.cursor = reduced ? "" : value;
    };

    const stopReturn = () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const stopTurn = () => {
      if (turnRafRef.current != null) {
        cancelAnimationFrame(turnRafRef.current);
        turnRafRef.current = null;
      }
    };

    const resetPersistence = () => {
      horizontalPersistence = emptyPersistence();
      verticalPersistence = emptyPersistence();
    };

    const startElasticReturn = (
      releaseVelocityX: number,
      releaseVelocityY: number,
      options?: {
        mode?: "normal" | "extended-settle";
        onComplete?: () => void;
      },
    ) => {
      stopReturn();

      const extended = options?.mode === "extended-settle";
      const horizontalTension = horizontalPersistence.value;
      const verticalTension = verticalPersistence.value;
      const releaseMultiplierX =
        RELEASE_VELOCITY_MULTIPLIER +
        verticalTension * MAX_VERTICAL_TENSION_RELEASE_BONUS;
      const releaseMultiplierY =
        RELEASE_VELOCITY_MULTIPLIER +
        horizontalTension * MAX_TENSION_RELEASE_BONUS;
      const springStrengthX = extended
        ? EXTENDED_SETTLE_SPRING_STRENGTH
        : SPRING_STRENGTH -
          verticalTension * MAX_VERTICAL_TENSION_SPRING_REDUCTION;
      const springStrengthY = extended
        ? EXTENDED_SETTLE_SPRING_STRENGTH
        : SPRING_STRENGTH -
          horizontalTension * MAX_TENSION_SPRING_REDUCTION;
      const dampingBase = extended ? EXTENDED_SETTLE_DAMPING : SPRING_DAMPING;

      let velocityX = releaseVelocityX * releaseMultiplierX;
      let velocityY = releaseVelocityY * releaseMultiplierY;
      let previousTime = performance.now();

      const animate = (now: number) => {
        const elapsed = Math.max(now - previousTime, 0);
        const frameRatio = Math.min(elapsed / 16.67, 2.5);
        previousTime = now;

        velocityX += (REST_RX - rxRef.current) * springStrengthX * frameRatio;
        velocityY += (REST_RY - ryRef.current) * springStrengthY * frameRatio;

        const damping = Math.pow(dampingBase, frameRatio);
        velocityX *= damping;
        velocityY *= damping;

        const maxRotationX =
          MAX_ROTATION_X +
          verticalTension * MAX_VERTICAL_TENSION_ROTATION_BONUS;
        const maxRotationY =
          MAX_ROTATION_Y +
          horizontalTension * MAX_TENSION_ROTATION_BONUS;
        const minX = REST_RX - maxRotationX;
        const maxX = REST_RX + maxRotationX;
        const minY = REST_RY - maxRotationY;
        const maxY = REST_RY + maxRotationY;

        const nextX = clamp(rxRef.current + velocityX * frameRatio, minX, maxX);
        const nextY = clamp(ryRef.current + velocityY * frameRatio, minY, maxY);

        if ((nextX <= minX && velocityX < 0) || (nextX >= maxX && velocityX > 0)) {
          velocityX = 0;
        }
        if ((nextY <= minY && velocityY < 0) || (nextY >= maxY && velocityY > 0)) {
          velocityY = 0;
        }

        applyPose(nextX, nextY);

        const remainingX = Math.abs(REST_RX - nextX);
        const remainingY = Math.abs(REST_RY - nextY);

        if (
          remainingX <= RETURN_POSITION_THRESHOLD &&
          remainingY <= RETURN_POSITION_THRESHOLD &&
          Math.abs(velocityX) <= RETURN_VELOCITY_THRESHOLD &&
          Math.abs(velocityY) <= RETURN_VELOCITY_THRESHOLD
        ) {
          applyPose(REST_RX, REST_RY);
          rafRef.current = null;
          options?.onComplete?.();
          if (!hovering && !reduced) afterAutonomousSettle();
          return;
        }

        rafRef.current = requestAnimationFrame(animate);
      };

      rafRef.current = requestAnimationFrame(animate);
    };

    const userBusy = () =>
      reduced ||
      drag != null ||
      hovering ||
      turnRafRef.current != null ||
      rafRef.current != null ||
      document.visibilityState !== "visible";

    const startIntro = () => {
      clearIdleTease();
      if (introConsumed) {
        afterAutonomousSettle();
        return;
      }
      introConsumed = true;
      if (reduced || document.visibilityState !== "visible") {
        scheduleIdle(IDLE_START_MS);
        return;
      }

      bakeIdleIntoPose();
      stopReturn();
      stopAuto();
      autoKind = "intro";

      const startedAt = performance.now();
      const baseX = REST_RX;
      const baseY = REST_RY;
      const anticipationStart = INTRO_DELAY_MS;
      const anticipationHoldStart =
        anticipationStart + INTRO_ANTICIPATION_DURATION_MS;
      const compressionStart =
        anticipationHoldStart + INTRO_ANTICIPATION_HOLD_MS;
      const flipStart = compressionStart + INTRO_FLIP_COMPRESSION_MS;
      const flipHoldStart = flipStart + INTRO_X_FLIP_DURATION_MS;
      const recoilForwardStart = flipHoldStart + INTRO_FLIP_HOLD_MS;
      const landingForwardStart =
        recoilForwardStart + INTRO_RECOIL_FORWARD_MS;
      const landingBackStart = landingForwardStart + INTRO_LANDING_SWAY_1_MS;
      const landingFinalStart = landingBackStart + INTRO_LANDING_SWAY_2_MS;
      const settleStart = landingFinalStart + INTRO_LANDING_RETURN_MS;
      const anticipationX = baseX + INTRO_ANTICIPATION_X;
      const compressionX =
        anticipationX + INTRO_FLIP_DIRECTION * INTRO_FLIP_COMPRESSION;
      const completedTurnBaseX =
        baseX + INTRO_FLIP_DIRECTION * Math.PI * 2;
      const recoilForwardTargetX =
        completedTurnBaseX +
        INTRO_FLIP_DIRECTION * Math.abs(INTRO_RECOIL_FORWARD);
      const firstLandingTargetX =
        completedTurnBaseX - INTRO_FLIP_DIRECTION * INTRO_LANDING_SWAY_1;
      const secondLandingTargetX =
        completedTurnBaseX + INTRO_FLIP_DIRECTION * INTRO_LANDING_SWAY_2;

      const animate = (now: number) => {
        if (userBusy()) {
          autoRaf = null;
          autoKind = "none";
          return;
        }

        const elapsed = now - startedAt;

        if (elapsed < anticipationStart) {
          applyPose(baseX, baseY);
          autoRaf = requestAnimationFrame(animate);
          return;
        }

        if (elapsed < anticipationHoldStart) {
          const progress = clamp(
            (elapsed - anticipationStart) / INTRO_ANTICIPATION_DURATION_MS,
            0,
            1,
          );
          const eased = introAnticipationEase(progress);
          applyPose(baseX + (anticipationX - baseX) * eased, baseY);
          autoRaf = requestAnimationFrame(animate);
          return;
        }

        if (elapsed < compressionStart) {
          applyPose(anticipationX, baseY);
          autoRaf = requestAnimationFrame(animate);
          return;
        }

        if (elapsed < flipStart) {
          const progress = clamp(
            (elapsed - compressionStart) / INTRO_FLIP_COMPRESSION_MS,
            0,
            1,
          );
          const eased = easeOutCubic(progress);
          applyPose(
            anticipationX + (compressionX - anticipationX) * eased,
            baseY,
          );
          autoRaf = requestAnimationFrame(animate);
          return;
        }

        if (elapsed < flipHoldStart) {
          const progress = clamp(
            (elapsed - flipStart) / INTRO_X_FLIP_DURATION_MS,
            0,
            1,
          );
          const eased = introFlipEase(progress);
          applyPose(
            compressionX + (completedTurnBaseX - compressionX) * eased,
            baseY,
          );
          autoRaf = requestAnimationFrame(animate);
          return;
        }

        if (elapsed < landingForwardStart) {
          const progress = clamp(
            (elapsed - recoilForwardStart) / INTRO_RECOIL_FORWARD_MS,
            0,
            1,
          );
          const eased = introContinuationEase(progress);
          applyPose(
            completedTurnBaseX +
              (recoilForwardTargetX - completedTurnBaseX) * eased,
            baseY,
          );
          autoRaf = requestAnimationFrame(animate);
          return;
        }

        if (elapsed < landingBackStart) {
          const progress = clamp(
            (elapsed - landingForwardStart) / INTRO_LANDING_SWAY_1_MS,
            0,
            1,
          );
          const eased = introRecoilEase(progress);
          applyPose(
            recoilForwardTargetX +
              (firstLandingTargetX - recoilForwardTargetX) * eased,
            baseY,
          );
          autoRaf = requestAnimationFrame(animate);
          return;
        }

        if (elapsed < landingFinalStart) {
          const progress = clamp(
            (elapsed - landingBackStart) / INTRO_LANDING_SWAY_2_MS,
            0,
            1,
          );
          const eased = introRecoilEase(progress);
          applyPose(
            firstLandingTargetX +
              (secondLandingTargetX - firstLandingTargetX) * eased,
            baseY,
          );
          autoRaf = requestAnimationFrame(animate);
          return;
        }

        if (elapsed < settleStart) {
          const progress = clamp(
            (elapsed - landingFinalStart) / INTRO_LANDING_RETURN_MS,
            0,
            1,
          );
          const eased = introLandingFinalEase(progress);
          applyPose(
            secondLandingTargetX +
              (completedTurnBaseX - secondLandingTargetX) * eased,
            baseY,
          );
          autoRaf = requestAnimationFrame(animate);
          return;
        }

        applyPose(baseX, baseY);
        autoRaf = null;
        autoKind = "none";
        afterAutonomousSettle();
      };

      autoRaf = requestAnimationFrame(animate);
    };

    startIdleTease = () => {
      if (
        userBusy() ||
        autoRaf != null ||
        !introConsumed
      ) {
        if (introConsumed && !hovering && !reduced) scheduleIdleTease();
        return;
      }

      bakeIdleIntoPose();
      const variant = getIdleTease(lastIdleTease);
      lastIdleTease = variant.name;
      const startX = rxRef.current;
      const startY = ryRef.current;
      const targetX = REST_RX + variant.x;
      const targetY = REST_RY + variant.y;
      const startedAt = performance.now();
      const holdStart = IDLE_TEASE_MOVE_MS;
      const returnStart = holdStart + IDLE_TEASE_HOLD_MS;
      autoKind = "tease";

      const animate = (now: number) => {
        if (userBusy()) {
          autoRaf = null;
          autoKind = "none";
          return;
        }

        const elapsed = now - startedAt;

        if (elapsed < holdStart) {
          const progress = clamp(elapsed / IDLE_TEASE_MOVE_MS, 0, 1);
          const eased = easeOutCubic(progress);
          applyPose(
            startX + (targetX - startX) * eased,
            startY + (targetY - startY) * eased,
          );
          autoRaf = requestAnimationFrame(animate);
          return;
        }

        if (elapsed < returnStart) {
          applyPose(targetX, targetY);
          autoRaf = requestAnimationFrame(animate);
          return;
        }

        autoRaf = null;
        autoKind = "none";
        startElasticReturn(0, 0, { mode: "extended-settle" });
      };

      autoRaf = requestAnimationFrame(animate);
    };

    const startEarnedTurn = ({
      axis,
      direction,
    }: {
      axis: EarnedTurnAxis;
      direction: -1 | 1;
    }) => {
      if (turnRafRef.current !== null) return;

      cancelAutonomous(true);
      stopReturn();

      const startedAt = performance.now();
      const startX = rxRef.current;
      const startY = ryRef.current;
      const isXTurn = axis === "x";
      const compressionX = clamp(
        startX + direction * X_PRE_TURN_COMPRESSION,
        REST_RX - MAX_ROTATION_X,
        REST_RX + MAX_ROTATION_X,
      );
      const compressionY = startY + direction * PRE_TURN_COMPRESSION;
      const turnStart = isXTurn ? X_PRE_TURN_HOLD_MS : PRE_TURN_HOLD_MS;
      const turnDuration = isXTurn
        ? X_FULL_TURN_DURATION_MS
        : FULL_TURN_DURATION_MS;
      const holdStart = turnStart + turnDuration;
      const settleStart =
        holdStart + (isXTurn ? X_POST_TURN_HOLD_MS : POST_TURN_HOLD_MS);
      const turnTargetX = isXTurn
        ? compressionX + direction * Math.PI * 2
        : clamp(
            REST_RX + (startX - REST_RX) * 0.3,
            REST_RX - MAX_ROTATION_X,
            REST_RX + MAX_ROTATION_X,
          );
      const retainedY = clamp(
        REST_RY + (startY - REST_RY) * 0.32,
        REST_RY - MAX_ROTATION_Y,
        REST_RY + MAX_ROTATION_Y,
      );
      const turnTargetY = isXTurn
        ? retainedY
        : compressionY + direction * Math.PI * 2;

      const animate = (now: number) => {
        const elapsed = now - startedAt;

        if (elapsed < turnStart) {
          const progress = clamp(elapsed / turnStart, 0, 1);
          const eased = easeOutCubic(progress);
          applyPose(
            isXTurn ? startX + (compressionX - startX) * eased : startX,
            isXTurn ? startY : startY + (compressionY - startY) * eased,
          );
          turnRafRef.current = requestAnimationFrame(animate);
          return;
        }

        if (elapsed < holdStart) {
          const progress = clamp(
            (elapsed - turnStart) / turnDuration,
            0,
            1,
          );
          const eased = fullTurnEase(progress);
          applyPose(
            (isXTurn ? compressionX : startX) +
              (turnTargetX - (isXTurn ? compressionX : startX)) * eased,
            (isXTurn ? startY : compressionY) +
              (turnTargetY - (isXTurn ? startY : compressionY)) * eased,
          );
          turnRafRef.current = requestAnimationFrame(animate);
          return;
        }

        if (elapsed < settleStart) {
          applyPose(turnTargetX, turnTargetY);
          turnRafRef.current = requestAnimationFrame(animate);
          return;
        }

        applyPose(
          isXTurn ? compressionX : turnTargetX,
          isXTurn ? retainedY : compressionY,
        );
        turnRafRef.current = null;

        if (isXTurn) {
          verticalPersistence = emptyPersistence();
          horizontalPersistence.value *= 0.55;
        } else {
          horizontalPersistence = emptyPersistence();
          verticalPersistence.value *= 0.55;
        }

        startElasticReturn(0, 0, { mode: "extended-settle" });
      };

      turnRafRef.current = requestAnimationFrame(animate);
    };

    const registerPersistenceGesture = (
      state: PersistenceAxisState,
      direction: -1 | 1,
      {
        gain,
        continuationWindow,
        oppositePenalty,
      }: {
        gain: number;
        continuationWindow: number;
        oppositePenalty: number;
      },
    ): PersistenceResult => {
      const now = performance.now();

      if (now - state.lastGestureTime > continuationWindow) {
        state.value = 0;
        state.direction = 0;
      }

      if (state.direction === 0 || state.direction === direction) {
        state.direction = direction;
        state.value = clamp(state.value + gain, 0, 1);
      } else {
        state.value = Math.max(0, state.value - oppositePenalty);

        if (state.value <= 0.08) {
          state.direction = direction;
          state.value = gain * 0.65;
        }
      }

      state.lastGestureTime = now;

      return {
        direction,
        persistence: state.value,
      };
    };

    const registerDragPersistence = (
      current: DragState,
      releaseVelocityX: number,
    ): { axis: GestureAxis; result: PersistenceResult } => {
      const axis = classifyGestureAxis(current);

      if (axis === "horizontal") {
        const direction = getQualifiedSwipeDirection(current);

        if (direction !== 0) {
          return {
            axis,
            result: registerPersistenceGesture(
              horizontalPersistence,
              direction,
              {
                gain: PERSISTENCE_GAIN_PER_SWIPE,
                continuationWindow: PERSISTENCE_CONTINUATION_WINDOW_MS,
                oppositePenalty: OPPOSITE_DIRECTION_PENALTY,
              },
            ),
          };
        }
      }

      if (axis === "vertical") {
        const direction = getCommittedVerticalRotationDirection(
          current,
          releaseVelocityX,
        );

        return {
          axis,
          result: registerPersistenceGesture(verticalPersistence, direction, {
            gain: VERTICAL_PERSISTENCE_GAIN_PER_SWIPE,
            continuationWindow: VERTICAL_PERSISTENCE_CONTINUATION_WINDOW_MS,
            oppositePenalty: VERTICAL_OPPOSITE_DIRECTION_PENALTY,
          }),
        };
      }

      return {
        axis: "ambiguous",
        result: { direction: 0, persistence: 0 },
      };
    };

    const syncInteractive = () => {
      reduced = media.matches;
      if (reduced) {
        drag = null;
        hovering = false;
        accent = 0;
        idleGain = 0;
        idleRx = 0;
        idleRy = 0;
        idleClock = 0;
        hoverRx = 0;
        hoverRy = 0;
        hoverTargetRx = 0;
        hoverTargetRy = 0;
        resetScrollNudge();
        cancelAutonomous(true);
        stopReturn();
        stopTurn();
        resetPersistence();
        applyPose(REST_RX, REST_RY);
        setCursor("");
        hit.style.pointerEvents = "none";
        hit.style.touchAction = "auto";
        return;
      }
      hit.style.pointerEvents = "all";
      hit.style.touchAction = "none";
      setCursor("grab");
    };
    syncInteractive();
    media.addEventListener("change", syncInteractive);

    const onPointerDown = (event: PointerEvent) => {
      if (reduced || turnRafRef.current !== null) return;

      event.preventDefault();
      cancelAutonomous(true);
      if (introCancelledByPointer) draggedAfterIntroCancel = true;
      bakeIdleIntoPose();
      resetScrollNudge();
      stopReturn();

      try {
        hit.setPointerCapture(event.pointerId);
      } catch {
        /* capture unsupported */
      }

      drag = {
        pointerId: event.pointerId,
        previousX: event.clientX,
        previousY: event.clientY,
        previousTime: performance.now(),
        totalHorizontalDistance: 0,
        totalVerticalDistance: 0,
        netHorizontalDistance: 0,
        netVerticalDistance: 0,
        targetRotationX: rxRef.current,
        targetRotationY: ryRef.current,
        velocityX: 0,
        velocityY: 0,
      };

      setCursor("grabbing");
      ghost.style.opacity = "0.4";
    };

    const onPointerMove = (event: PointerEvent) => {
      if (reduced) return;

      if (!drag || drag.pointerId !== event.pointerId) {
        if (hovering) setHoverTargetFromPointer(event);
        return;
      }

      event.preventDefault();

      const deltaX = event.clientX - drag.previousX;
      const deltaY = event.clientY - drag.previousY;
      const now = performance.now();
      const elapsed = Math.max(now - drag.previousTime, 8);

      const rawRotationDeltaY = deltaX * DRAG_SENSITIVITY_Y;
      const rotationDeltaX = -deltaY * DRAG_SENSITIVITY_X;
      const horizontalTension = horizontalPersistence.value;
      const verticalTension = verticalPersistence.value;
      const maxRotationX =
        MAX_ROTATION_X +
        verticalTension * MAX_VERTICAL_TENSION_ROTATION_BONUS;
      const maxRotationY =
        MAX_ROTATION_Y +
        horizontalTension * MAX_TENSION_ROTATION_BONUS;
      const rotationDeltaY = applyHorizontalResistance({
        baseY: REST_RY,
        currentY: drag.targetRotationY,
        deltaY: rawRotationDeltaY,
        maxRotationY,
        tension: horizontalTension,
      });

      drag.targetRotationX = clamp(
        drag.targetRotationX + rotationDeltaX,
        REST_RX - maxRotationX,
        REST_RX + maxRotationX,
      );
      drag.targetRotationY = clamp(
        drag.targetRotationY + rotationDeltaY,
        REST_RY - maxRotationY,
        REST_RY + maxRotationY,
      );

      applyPose(drag.targetRotationX, drag.targetRotationY);

      const frameRatio = 16.67 / elapsed;
      drag.velocityX = clamp(
        rotationDeltaX * frameRatio,
        -MAX_VELOCITY_X,
        MAX_VELOCITY_X,
      );
      drag.velocityY = clamp(
        rotationDeltaY * frameRatio,
        -MAX_VELOCITY_Y,
        MAX_VELOCITY_Y,
      );

      drag.previousX = event.clientX;
      drag.previousY = event.clientY;
      drag.previousTime = now;
      drag.totalHorizontalDistance += Math.abs(deltaX);
      drag.totalVerticalDistance += Math.abs(deltaY);
      drag.netHorizontalDistance += deltaX;
      drag.netVerticalDistance += deltaY;
    };

    const finishDrag = (event: PointerEvent) => {
      if (!drag || drag.pointerId !== event.pointerId) return;

      event.preventDefault();

      try {
        if (hit.hasPointerCapture(event.pointerId)) {
          hit.releasePointerCapture(event.pointerId);
        }
      } catch {
        /* already released */
      }

      const wasCancelled = event.type === "pointercancel";
      const releaseVelocityX = wasCancelled ? 0 : drag.velocityX;
      const releaseVelocityY = wasCancelled ? 0 : drag.velocityY;
      const persistenceRegistration = wasCancelled
        ? {
            axis: "ambiguous" as const,
            result: { direction: 0 as const, persistence: 0 },
          }
        : registerDragPersistence(drag, releaseVelocityX);
      const horizontalTurnDirection =
        getCommittedHorizontalRotationDirection(drag, releaseVelocityY);
      const yTurnDirectionMatches =
        horizontalTurnDirection === persistenceRegistration.result.direction;
      const earnedTurnRequest =
        event.type === "pointerup" &&
        !reduced &&
        turnRafRef.current === null &&
        persistenceRegistration.result.direction !== 0
          ? persistenceRegistration.axis === "horizontal" &&
            persistenceRegistration.result.persistence >= FULL_TURN_THRESHOLD &&
            yTurnDirectionMatches
            ? {
                axis: "y" as const,
                direction: persistenceRegistration.result.direction,
              }
            : persistenceRegistration.axis === "vertical" &&
                persistenceRegistration.result.persistence >=
                  VERTICAL_FULL_TURN_THRESHOLD
              ? {
                  axis: "x" as const,
                  direction: persistenceRegistration.result.direction,
                }
              : null
          : null;

      drag = null;
      setCursor("grab");

      if (earnedTurnRequest) {
        startEarnedTurn(earnedTurnRequest);
        return;
      }

      if (event.type === "pointerup") {
        const box = hit.getBoundingClientRect();
        const stillInside =
          event.clientX >= box.left &&
          event.clientX <= box.right &&
          event.clientY >= box.top &&
          event.clientY <= box.bottom;
        if (stillInside) {
          hovering = true;
          setHoverTargetFromPointer(event);
          hoverRx = hoverTargetRx;
          hoverRy = hoverTargetRy;
          rxRef.current -= hoverRx;
          ryRef.current -= hoverRy;
        }
      }

      startElasticReturn(releaseVelocityX, releaseVelocityY);
    };

    const decayPersistence = (now: number, previousTime: number) => {
      const elapsedSeconds = Math.max(now - previousTime, 0) / 1000;

      if (
        !drag &&
        turnRafRef.current === null &&
        horizontalPersistence.value > 0 &&
        now - horizontalPersistence.lastGestureTime >
          PERSISTENCE_CONTINUATION_WINDOW_MS
      ) {
        horizontalPersistence.value = Math.max(
          0,
          horizontalPersistence.value -
            PERSISTENCE_DECAY_PER_SECOND * elapsedSeconds,
        );
        if (horizontalPersistence.value === 0) {
          horizontalPersistence.direction = 0;
          horizontalPersistence.lastGestureTime = 0;
        }
      }

      if (
        !drag &&
        turnRafRef.current === null &&
        verticalPersistence.value > 0 &&
        now - verticalPersistence.lastGestureTime >
          VERTICAL_PERSISTENCE_CONTINUATION_WINDOW_MS
      ) {
        verticalPersistence.value = Math.max(
          0,
          verticalPersistence.value -
            PERSISTENCE_DECAY_PER_SECOND * elapsedSeconds,
        );
        if (verticalPersistence.value === 0) {
          verticalPersistence.direction = 0;
          verticalPersistence.lastGestureTime = 0;
        }
      }
    };

    const onPointerEnter = (event: PointerEvent) => {
      if (reduced) return;
      hovering = true;
      idleResumeAt = Number.POSITIVE_INFINITY;
      cancelAutonomous(true);
      setHoverTargetFromPointer(event);
    };

    const onPointerLeave = () => {
      if (drag) return;
      hovering = false;
      hoverTargetRx = 0;
      hoverTargetRy = 0;
      if (
        introCancelledByPointer &&
        !draggedAfterIntroCancel &&
        turnRafRef.current === null &&
        rafRef.current === null &&
        autoRaf == null
      ) {
        introCancelledByPointer = false;
        const tau = Math.PI * 2;
        let wx = rxRef.current;
        let wy = ryRef.current;
        while (wx - REST_RX > Math.PI) wx -= tau;
        while (REST_RX - wx > Math.PI) wx += tau;
        while (wy - REST_RY > Math.PI) wy -= tau;
        while (REST_RY - wy > Math.PI) wy += tau;
        applyPose(wx, wy);
        if (
          Math.abs(wx - REST_RX) > 0.05 ||
          Math.abs(wy - REST_RY) > 0.05
        ) {
          startElasticReturn(0, 0);
          return;
        }
      }
      if (
        !reduced &&
        turnRafRef.current === null &&
        rafRef.current === null &&
        autoRaf == null
      ) {
        if (introConsumed) afterAutonomousSettle();
        else scheduleIdle();
      }
    };

    hit.addEventListener("pointerdown", onPointerDown);
    hit.addEventListener("pointermove", onPointerMove);
    hit.addEventListener("pointerup", finishDrag);
    hit.addEventListener("pointercancel", finishDrag);
    hit.addEventListener("pointerenter", onPointerEnter);
    hit.addEventListener("pointerleave", onPointerLeave);

    window.addEventListener("scroll", onWindowScroll, { passive: true });
    mobileScrollMq.addEventListener("change", syncMobileScroll);
    syncMobileScroll();

    const io =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              const entry = entries[0];
              if (!entry || reduced || introConsumed) return;
              if (entry.intersectionRatio >= INTRO_VISIBLE_RATIO) {
                startIntro();
                io?.disconnect();
              }
            },
            { threshold: [0, 0.45, 0.5, 0.55, 0.6, 1] },
          );
    io?.observe(root);

    let decayPreviousTime = performance.now();
    const tickDecay = (now: number) => {
      decayPersistence(now, decayPreviousTime);
      const dt = Math.min(Math.max(now - decayPreviousTime, 0) / 1000, 0.05);
      decayPreviousTime = now;

      const interacting =
        drag != null ||
        turnRafRef.current != null ||
        rafRef.current != null ||
        autoRaf != null;
      const canAdvanceIdle =
        !reduced &&
        introConsumed &&
        !hovering &&
        !interacting &&
        now >= idleResumeAt &&
        Math.abs(hoverRx) < 0.0008 &&
        Math.abs(hoverRy) < 0.0008;

      const hoverK = pocketHoverFollowK(dt, hovering);
      if (drag == null && !reduced) {
        hoverRx += (hoverTargetRx - hoverRx) * hoverK;
        hoverRy += (hoverTargetRy - hoverRy) * hoverK;
      }

      if (isMobile && !reduced && drag == null) {
        const velDamp = Math.exp(-SCROLL_VEL_DAMP_PER_S * dt);
        scrollOffsetRy += scrollVelRy;
        scrollOffsetRx += scrollVelRx;
        scrollVelRy *= velDamp;
        scrollVelRx *= velDamp;
        const returnK = 1 - Math.exp(-SCROLL_OFFSET_RETURN_PER_S * dt);
        scrollOffsetRy += (0 - scrollOffsetRy) * returnK;
        scrollOffsetRx += (0 - scrollOffsetRx) * returnK;
        scrollOffsetRy = clamp(
          scrollOffsetRy,
          -SCROLL_OFFSET_MAX_RY,
          SCROLL_OFFSET_MAX_RY,
        );
        scrollOffsetRx = clamp(
          scrollOffsetRx,
          -SCROLL_OFFSET_MAX_RX,
          SCROLL_OFFSET_MAX_RX,
        );
      }

      if (canAdvanceIdle) {
        idleGain += (1 - idleGain) * (1 - Math.exp(-dt / 0.28));
        if (idlePhraseUntil <= 0) {
          idlePhrase = "rest";
          idlePhraseUntil = now + randomBetween(IDLE_REST_MIN_S, IDLE_REST_MAX_S) * 1000;
        }
        if (now >= idlePhraseUntil) {
          if (idlePhrase === "rest") {
            idlePhrase = "drift";
            idlePhraseUntil =
              now + randomBetween(IDLE_DRIFT_MIN_S, IDLE_DRIFT_MAX_S) * 1000;
            idleSpeed = randomBetween(0.62, 1.08);
            idlePhaseX = randomBetween(0, Math.PI * 2);
            idlePhaseY = randomBetween(0, Math.PI * 2);
            idleYawScale = Math.random() < 0.28 ? IDLE_YAW_EMPHASIS : 1;
            idleClock = 0;
          } else {
            idlePhrase = "rest";
            idlePhraseUntil =
              now + randomBetween(IDLE_REST_MIN_S, IDLE_REST_MAX_S) * 1000;
            idleYawScale = 1;
          }
        }

        const envelopeTarget = idlePhrase === "drift" ? 1 : 0;
        idleEnvelope +=
          (envelopeTarget - idleEnvelope) * (1 - Math.exp(-dt / 0.42));
        if (idlePhrase === "drift") idleClock += dt * idleSpeed;

        const motion = idleGain * idleEnvelope;
        idleRx =
          motion *
          IDLE_PITCH_SCALE *
          (IDLE_AMP_X * Math.sin(idleClock * IDLE_FREQ_X1 + idlePhaseX) +
            IDLE_AMP_X * 0.45 * Math.sin(idleClock * IDLE_FREQ_X2 + 1.7));
        idleRy =
          motion *
          idleYawScale *
          (IDLE_AMP_Y * Math.sin(idleClock * IDLE_FREQ_Y1 + idlePhaseY) +
            IDLE_AMP_Y * 0.4 * Math.sin(idleClock * IDLE_FREQ_Y2 + 2.1));
      }

      const idleAway = clamp(
        Math.hypot(
          idleRx / (IDLE_AMP_X * IDLE_PITCH_SCALE * 1.5 + 0.001),
          idleRy / (IDLE_AMP_Y * IDLE_YAW_EMPHASIS * 1.45 + 0.001),
        ),
        0,
        1,
      );
      const idleAccent =
        idleGain *
        (ACCENT_IDLE_MIN +
          (ACCENT_IDLE_MAX - ACCENT_IDLE_MIN) *
            idleAway *
            idleAway *
            (3 - 2 * idleAway));

      const accentTarget = reduced
        ? 0
        : turnRafRef.current != null
          ? ACCENT_TURN
          : drag
            ? ACCENT_DRAG
            : hovering || autoKind === "intro" || autoKind === "tease"
              ? ACCENT_HOVER
              : idleAccent;
      const accentTau = accentTarget > accent ? 0.11 : 0.28;
      const accentK = 1 - Math.exp(-dt / accentTau);
      accent += (accentTarget - accent) * accentK;

      const scrollNudgeActive =
        isMobile &&
        !reduced &&
        drag == null &&
        (Math.abs(scrollOffsetRx) > 0.00015 ||
          Math.abs(scrollOffsetRy) > 0.00015 ||
          Math.abs(scrollVelRx) > 0.00015 ||
          Math.abs(scrollVelRy) > 0.00015);

      if (
        !interacting ||
        accent > 0.001 ||
        accentTarget > 0.001 ||
        scrollNudgeActive
      ) {
        const vis = visiblePose();
        paint(vis.rx, vis.ry);
      }

      decayRafRef.current = requestAnimationFrame(tickDecay);
    };
    decayRafRef.current = requestAnimationFrame(tickDecay);

    return () => {
      window.removeEventListener("scroll", onWindowScroll);
      mobileScrollMq.removeEventListener("change", syncMobileScroll);
      media.removeEventListener("change", syncInteractive);
      hit.removeEventListener("pointerdown", onPointerDown);
      hit.removeEventListener("pointermove", onPointerMove);
      hit.removeEventListener("pointerup", finishDrag);
      hit.removeEventListener("pointercancel", finishDrag);
      hit.removeEventListener("pointerenter", onPointerEnter);
      hit.removeEventListener("pointerleave", onPointerLeave);
      io?.disconnect();
      cancelAutonomous(true);
      stopReturn();
      stopTurn();
      if (decayRafRef.current != null) {
        cancelAnimationFrame(decayRafRef.current);
        decayRafRef.current = null;
      }
    };
  }, []);

  const restPts = CORNERS.map((c) => project(c, REST_RX, REST_RY));
  const restFacing = FACES.map((face) => faceFacing(restPts, face.i));
  const restGhost = CORNERS.map((c) =>
    project(c, REST_RX, REST_RY, SCALE * 1.035),
  );
  const restHit = hitBox(restPts);

  return (
    <div
      ref={rootRef}
      className={`${className} origin-center`}
      aria-hidden="true"
      data-next-step-cube
      style={{ userSelect: "none" }}
    >
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        fill="none"
        className="h-full w-full overflow-visible"
        shapeRendering="geometricPrecision"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g ref={ghostRef} pointerEvents="none">
          {EDGES.map(([ia, ib], index) => (
            <line
              key={`g-${index}`}
              data-ghost={index}
              x1={restGhost[ia].x + 3}
              y1={restGhost[ia].y + 2.5}
              x2={restGhost[ib].x + 3}
              y2={restGhost[ib].y + 2.5}
              stroke={STROKE.ghost}
              strokeWidth={1}
            />
          ))}
        </g>
        <g ref={objectRef} pointerEvents="none">
          {FACES.map((face, index) => (
            <polygon
              key={`f-${index}`}
              data-face={index}
              points={poly(face.i.map((i) => restPts[i]))}
              fill={face.fill}
              opacity={restFacing[index] ? 1 : 0}
            />
          ))}
          {EDGES.map(([ia, ib], index) => {
            const w = edgeWeight(restPts[ia], restPts[ib]);
            return (
              <line
                key={`e-${index}`}
                data-edge={index}
                x1={restPts[ia].x}
                y1={restPts[ia].y}
                x2={restPts[ib].x}
                y2={restPts[ib].y}
                stroke={w.stroke}
                strokeWidth={w.width}
                opacity={edgeVisible(restFacing, index) ? w.opacity : 0}
              />
            );
          })}
        </g>
        <rect
          ref={hitRef}
          data-cube-hit
          x={restHit.x}
          y={restHit.y}
          width={restHit.w}
          height={restHit.h}
          fill="rgba(0,0,0,0.001)"
          stroke="none"
          pointerEvents="all"
          style={{ touchAction: "none", cursor: "grab" }}
        />
      </svg>
    </div>
  );
}
