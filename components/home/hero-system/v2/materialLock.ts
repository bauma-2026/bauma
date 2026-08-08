/**
 * Production material lock — F1 / A2 / L1 (approved transfer).
 */

import type { Point } from "./volumeScene";

export const FRONT_FILL_RGB = { r: 244, g: 241, b: 234 } as const;

/** Production amber authority — matches #D1A45F. */
export const AMBER_TONE = {
  r: 209,
  g: 164,
  b: 95,
  hex: "#D1A45F",
} as const;

export const FILL_OPACITY = {
  rest: 0.02,
  active: 0.036,
} as const;

/** L1 Restrained Expansion — T1 upper front. */
export const LENGTH_SPAN = {
  rest: { start: 0.53, end: 0.67 },
  active: { start: 0.51, end: 0.69 },
} as const;

export const MATERIAL_LOCK = {
  rest: {
    rearBase: 0.2,
    joinBase: 0.16,
    frontStroke: 0.8,
    amber: 0,
  },
  active: {
    rearBase: 0.295,
    joinBase: 0.275,
    frontStroke: 0.82,
    amber: 0.58,
  },
  strongAmber: 0.68,
} as const;

export const ACTIVATION_TIMING = {
  enterMs: 360,
  leaveMs: 750,
} as const;

export const FRONT_STROKE_WIDTH = 1.2;

export function easeOutCubic(t: number) {
  const u = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - u, 3);
}

export function easeOutQuad(t: number) {
  const u = Math.min(1, Math.max(0, t));
  return 1 - (1 - u) * (1 - u);
}

function lerpPoint(a: Point, b: Point, t: number): Point {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

export type TraceSample = {
  start: number;
  end: number;
  lengthNorm: number;
  a: Point;
  b: Point;
};

export function sampleT1Trace(front: Point[], activation: number): TraceSample {
  const a = Math.min(1, Math.max(0, activation));
  const start =
    LENGTH_SPAN.rest.start +
    (LENGTH_SPAN.active.start - LENGTH_SPAN.rest.start) * a;
  const end =
    LENGTH_SPAN.rest.end + (LENGTH_SPAN.active.end - LENGTH_SPAN.rest.end) * a;
  const ea = front[0];
  const eb = front[1];
  return {
    start,
    end,
    lengthNorm: end - start,
    a: lerpPoint(ea, eb, start),
    b: lerpPoint(ea, eb, end),
  };
}

export type MaterialSample = {
  activation: number;
  rearBase: number;
  joinBase: number;
  frontStroke: number;
  frontFill: number;
  amber: number;
  frontStrokeCss: string;
  frontFillCss: string;
  amberCss: string;
};

export function materialsFromLock(
  activation: number,
  poseBlend: number,
  opts?: { amberOff?: boolean; fillOff?: boolean },
): MaterialSample {
  const a = Math.min(1, Math.max(0, activation));
  const r = MATERIAL_LOCK.rest;
  const v = MATERIAL_LOCK.active;
  const force = Math.min(1, Math.max(0, poseBlend));

  const rearBase = r.rearBase + (v.rearBase - r.rearBase) * a;
  const joinBase = r.joinBase + (v.joinBase - r.joinBase) * a;
  const frontStroke = r.frontStroke + (v.frontStroke - r.frontStroke) * a;
  const frontFill = opts?.fillOff
    ? 0
    : FILL_OPACITY.rest + (FILL_OPACITY.active - FILL_OPACITY.rest) * a;

  const amberBase =
    v.amber + (MATERIAL_LOCK.strongAmber - v.amber) * easeOutQuad(force);
  const amber = opts?.amberOff ? 0 : a * amberBase;

  return {
    activation: a,
    rearBase,
    joinBase,
    frontStroke,
    frontFill,
    amber,
    frontStrokeCss: `rgba(${FRONT_FILL_RGB.r},${FRONT_FILL_RGB.g},${FRONT_FILL_RGB.b},${frontStroke.toFixed(3)})`,
    frontFillCss: `rgba(${FRONT_FILL_RGB.r},${FRONT_FILL_RGB.g},${FRONT_FILL_RGB.b},${frontFill.toFixed(3)})`,
    amberCss: `rgba(${AMBER_TONE.r},${AMBER_TONE.g},${AMBER_TONE.b},${amber.toFixed(3)})`,
  };
}
