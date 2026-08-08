"use client";

import { animate, type AnimationPlaybackControls, motionValue, type MotionValue } from "framer-motion";

import {
  SELECTION_STATES,
  type SelectionScene,
} from "@/components/home/approach/approachStates";

import { isFiniteNumber, isFinitePoint } from "@/lib/svgFinite";

import {
  B02_A_AMBER,
  B02_EDGE_NODES,
  NODE_IDS,
  type AmbientPose,
  type NodeOffset,
  getB02APose,
} from "./approachAmbient";
import type { StructuralState } from "./constants";

function isFiniteEndpoints(ep: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}): boolean {
  return (
    isFiniteNumber(ep.x1) &&
    isFiniteNumber(ep.y1) &&
    isFiniteNumber(ep.x2) &&
    isFiniteNumber(ep.y2)
  );
}

export type EdgeChannels = {
  x1: MotionValue<number>;
  y1: MotionValue<number>;
  x2: MotionValue<number>;
  y2: MotionValue<number>;
  /** Open-stub noise edges only — fades with scene morph */
  opacity?: MotionValue<number>;
};

/** Noise stubs that end without a node — opacity driven by morph, not React snap */
const OPEN_STUB_EDGE_IDS = new Set(["fail0", "fail1"]);

function makeEdgeChannels(
  ep: { x1: number; y1: number; x2: number; y2: number },
  opacity?: number,
): EdgeChannels {
  const ch: EdgeChannels = {
    x1: motionValue(ep.x1),
    y1: motionValue(ep.y1),
    x2: motionValue(ep.x2),
    y2: motionValue(ep.y2),
  };
  if (opacity !== undefined) {
    ch.opacity = motionValue(opacity);
  }
  return ch;
}

export type PoseDriver = {
  nodeX: Record<string, MotionValue<number>>;
  nodeY: Record<string, MotionValue<number>>;
  edges: Record<string, EdgeChannels>;
  applyInstant: (pose: AmbientPose) => void;
  applySceneInstant: (state: StructuralState) => void;
  readPose: () => AmbientPose;
  animateToScene: (
    state: StructuralState,
    duration: number,
    ease: readonly [number, number, number, number],
  ) => Promise<void>;
  stopAnimations: () => void;
  /** True while a Framer animate() toward a scene is running */
  isFramerAnimating: () => boolean;
};

function sceneToPose(scene: SelectionScene): AmbientPose {
  const nodes: Record<string, NodeOffset> = {};
  for (const n of scene.nodes) {
    nodes[n.id] = { x: n.x, y: n.y };
  }
  // Non-B02 states: amber from scene edge endpoints if present
  const a0 = scene.edges.find((e) => e.id === "a0");
  const a1 = scene.edges.find((e) => e.id === "a1");
  const amber = {
    start: a0
      ? { x: a0.x1, y: a0.y1 }
      : { ...B02_A_AMBER.start },
    joint: a0
      ? { x: a0.x2, y: a0.y2 }
      : { ...B02_A_AMBER.joint },
    end: a1
      ? { x: a1.x2, y: a1.y2 }
      : { ...B02_A_AMBER.end },
  };
  return { nodes, amber };
}

function edgeEndpointsFromPose(
  edgeId: string,
  sceneEdge: SelectionScene["edges"][number],
  pose: AmbientPose,
  state: StructuralState,
): { x1: number; y1: number; x2: number; y2: number } {
  if (edgeId === "a0") {
    return {
      x1: pose.amber.start.x,
      y1: pose.amber.start.y,
      x2: pose.amber.joint.x,
      y2: pose.amber.joint.y,
    };
  }
  if (edgeId === "a1") {
    return {
      x1: pose.amber.joint.x,
      y1: pose.amber.joint.y,
      x2: pose.amber.end.x,
      y2: pose.amber.end.y,
    };
  }

  // During B02 ambient poses, derive grey edges from nodes when mapped
  if (state === "02") {
    const map = B02_EDGE_NODES[edgeId];
    if (map?.start && map?.end) {
      const a = pose.nodes[map.start];
      const b = pose.nodes[map.end];
      if (a && b) {
        return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
      }
    }
    if (map?.start && !map.end) {
      const a = pose.nodes[map.start];
      if (a) {
        return {
          x1: a.x,
          y1: a.y,
          x2: sceneEdge.x2,
          y2: sceneEdge.y2,
        };
      }
    }
  }

  return {
    x1: sceneEdge.x1,
    y1: sceneEdge.y1,
    x2: sceneEdge.x2,
    y2: sceneEdge.y2,
  };
}

/**
 * Single-authority pose driver.
 * Ambient: MotionValue.set (immediate).
 * State morph: Framer animate() only when authority is stateMorph/handoff.
 */
export function createPoseDriver(initialState: StructuralState = "02"): PoseDriver {
  const initialScene = SELECTION_STATES[initialState];
  const initialPose =
    initialState === "02" ? getB02APose() : sceneToPose(initialScene);

  const nodeX: Record<string, MotionValue<number>> = {};
  const nodeY: Record<string, MotionValue<number>> = {};
  for (const id of NODE_IDS) {
    const p = initialPose.nodes[id] ?? { x: 0, y: 0 };
    nodeX[id] = motionValue(p.x);
    nodeY[id] = motionValue(p.y);
  }

  const edges: Record<string, EdgeChannels> = {};
  for (const edge of initialScene.edges) {
    const ep = edgeEndpointsFromPose(edge.id, edge, initialPose, initialState);
    edges[edge.id] = makeEdgeChannels(
      ep,
      OPEN_STUB_EDGE_IDS.has(edge.id) ? edge.opacity : undefined,
    );
  }

  let controls: AnimationPlaybackControls[] = [];
  let framerAnimating = false;
  let lastState: StructuralState = initialState;

  const stopAnimations = () => {
    for (const c of controls) c.stop();
    controls = [];
    framerAnimating = false;
  };

  const writePose = (pose: AmbientPose, state: StructuralState) => {
    for (const id of NODE_IDS) {
      const p = pose.nodes[id];
      if (!isFinitePoint(p)) continue;
      nodeX[id].set(p.x);
      nodeY[id].set(p.y);
    }
    const scene = SELECTION_STATES[state];
    for (const edge of scene.edges) {
      const ep = edgeEndpointsFromPose(edge.id, edge, pose, state);
      if (!isFiniteEndpoints(ep)) continue;
      const ch = edges[edge.id];
      if (!ch) {
        edges[edge.id] = makeEdgeChannels(
          ep,
          OPEN_STUB_EDGE_IDS.has(edge.id) ? edge.opacity : undefined,
        );
        continue;
      }
      ch.x1.set(ep.x1);
      ch.y1.set(ep.y1);
      ch.x2.set(ep.x2);
      ch.y2.set(ep.y2);
      if (OPEN_STUB_EDGE_IDS.has(edge.id)) {
        if (!ch.opacity) ch.opacity = motionValue(edge.opacity);
        else ch.opacity.set(edge.opacity);
      }
    }
    lastState = state;
  };

  const applyInstant = (pose: AmbientPose) => {
    stopAnimations();
    writePose(pose, "02");
  };

  const applySceneInstant = (state: StructuralState) => {
    stopAnimations();
    const pose =
      state === "02" ? getB02APose() : sceneToPose(SELECTION_STATES[state]);
    // Ensure edge channels exist for this scene
    for (const edge of SELECTION_STATES[state].edges) {
      if (!edges[edge.id]) {
        edges[edge.id] = makeEdgeChannels(
          { x1: edge.x1, y1: edge.y1, x2: edge.x2, y2: edge.y2 },
          OPEN_STUB_EDGE_IDS.has(edge.id) ? edge.opacity : undefined,
        );
      }
    }
    writePose(pose, state);
  };

  const readPose = (): AmbientPose => {
    const nodes: Record<string, NodeOffset> = {};
    for (const id of NODE_IDS) {
      nodes[id] = { x: nodeX[id].get(), y: nodeY[id].get() };
    }
    const a0 = edges.a0;
    const a1 = edges.a1;
    return {
      nodes,
      amber: {
        start: a0
          ? { x: a0.x1.get(), y: a0.y1.get() }
          : { ...B02_A_AMBER.start },
        joint: a0
          ? { x: a0.x2.get(), y: a0.y2.get() }
          : { ...B02_A_AMBER.joint },
        end: a1
          ? { x: a1.x2.get(), y: a1.y2.get() }
          : { ...B02_A_AMBER.end },
      },
    };
  };

  const animateToScene = (
    state: StructuralState,
    duration: number,
    ease: readonly [number, number, number, number],
  ) => {
    stopAnimations();
    framerAnimating = true;
    const scene = SELECTION_STATES[state];
    const target =
      state === "02" ? getB02APose() : sceneToPose(scene);

    for (const edge of scene.edges) {
      if (!edges[edge.id]) {
        edges[edge.id] = makeEdgeChannels(
          { x1: edge.x1, y1: edge.y1, x2: edge.x2, y2: edge.y2 },
          OPEN_STUB_EDGE_IDS.has(edge.id) ? edge.opacity : undefined,
        );
      }
    }

    const anims: Promise<void>[] = [];
    const run = (mv: MotionValue<number>, to: number) => {
      const c = animate(mv, to, { duration, ease: [...ease] });
      controls.push(c);
      anims.push(c.then(() => undefined));
    };

    for (const id of NODE_IDS) {
      const p = target.nodes[id];
      if (!isFinitePoint(p) || !nodeX[id]) continue;
      run(nodeX[id], p.x);
      run(nodeY[id], p.y);
    }

    for (const edge of scene.edges) {
      const ch = edges[edge.id];
      if (!ch) continue;
      const ep = edgeEndpointsFromPose(edge.id, edge, target, state);
      if (!isFiniteEndpoints(ep)) continue;
      run(ch.x1, ep.x1);
      run(ch.y1, ep.y1);
      run(ch.x2, ep.x2);
      run(ch.y2, ep.y2);
      if (OPEN_STUB_EDGE_IDS.has(edge.id)) {
        if (!ch.opacity) ch.opacity = motionValue(edge.opacity);
        run(ch.opacity, edge.opacity);
      }
    }

    lastState = state;
    return Promise.all(anims).then(() => {
      framerAnimating = false;
      controls = [];
    });
  };

  return {
    nodeX,
    nodeY,
    edges,
    applyInstant,
    applySceneInstant,
    readPose,
    animateToScene,
    stopAnimations,
    isFramerAnimating: () => framerAnimating,
  };
}

export type { StructuralState };
