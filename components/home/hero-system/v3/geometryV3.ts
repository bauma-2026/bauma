/**
 * Production V3 — exact S0 Rest geometry only (P1 pass).
 *
 * Source: locked lab / production V2 Balanced Volume Rest projection
 * (V2_FRONT_POINTS / V2_REAR_POINTS + selective rear stubs).
 * No fitted pose, path, or interaction constants.
 */

export type Point = { x: number; y: number };

export const V3_CANVAS = {
  width: 520,
  height: 440,
  anchor: { x: 260, y: 235 },
  tiltDeg: -2.0,
} as const;

/** Exact S0 front plate — locked Rest. */
export const V3_S0_FRONT: readonly Point[] = [
  { x: 108, y: 152 },
  { x: 352, y: 114 },
  { x: 390, y: 298 },
  { x: 78, y: 286 },
];

/** Exact S0 rear plane — locked Rest. */
export const V3_S0_REAR: readonly Point[] = [
  { x: 124, y: 160 },
  { x: 368, y: 122 },
  { x: 408, y: 308 },
  { x: 98, y: 310 },
];

/** Selective rear stubs visible at Rest (not full rear quad). */
export const V3_S0_REAR_STUBS = {
  upperStart: { x: 248, y: 128 },
  leftReturnEnd: { x: 110, y: 268 },
} as const;

/** V0 / F2 line hierarchy bases at Rest (no active brightening). */
export const V3_S0_MATERIAL = {
  frontStroke: "rgba(244,241,234,0.80)",
  frontStrokeWidth: 1.2,
  /** P9 — constant front-plane fill; not animated across S0→S2. */
  frontFill: "#1B1B1B",
  frontFillOpacity: 1,
  rearBase: 0.2,
  joinBase: 0.16,
  joinStrokeWidth: 0.65,
} as const;

export function rgba(r: number, g: number, b: number, a: number) {
  return `rgba(${r},${g},${b},${a})`;
}

export function pointsAttr(points: readonly Point[]) {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}

export type V3Segment = {
  id: string;
  a: Point;
  b: Point;
  opacity: number;
  strokeWidth: number;
};

/** Exact S0 selective rear edges (clipped by front mask). */
export function s0RearStubSegments(): V3Segment[] {
  const rear = V3_S0_REAR;
  return [
    {
      id: "rear-upper",
      a: V3_S0_REAR_STUBS.upperStart,
      b: rear[1],
      opacity: 1,
      strokeWidth: 0.75,
    },
    {
      id: "rear-right",
      a: rear[1],
      b: rear[2],
      opacity: 1,
      strokeWidth: 0.75,
    },
    {
      id: "rear-lower",
      a: rear[2],
      b: rear[3],
      opacity: 0.92,
      strokeWidth: 0.8,
    },
    {
      id: "rear-left",
      a: rear[3],
      b: V3_S0_REAR_STUBS.leftReturnEnd,
      opacity: 0.5,
      strokeWidth: 0.75,
    },
  ];
}

/** Exact S0 joins — upper-left suppressed at Rest. */
export function s0JoinSegments(): V3Segment[] {
  const front = V3_S0_FRONT;
  const rear = V3_S0_REAR;
  return [
    {
      id: "join-upperRight",
      a: front[1],
      b: rear[1],
      opacity: 1,
      strokeWidth: V3_S0_MATERIAL.joinStrokeWidth,
    },
    {
      id: "join-lowerRight",
      a: front[2],
      b: rear[2],
      opacity: 1,
      strokeWidth: V3_S0_MATERIAL.joinStrokeWidth,
    },
    {
      id: "join-lowerLeft",
      a: front[3],
      b: rear[3],
      opacity: 1,
      strokeWidth: V3_S0_MATERIAL.joinStrokeWidth,
    },
  ];
}
