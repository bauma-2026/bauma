/**
 * Lab query parsing — server + client.
 * Only documented edge-context params affect behavior (see README.md).
 */

export type LabSearchParams = Record<string, string | string[] | undefined>;

export type StabilityId = "E0" | "E1" | "E2";
export type EdgeVisId = "V0" | "VB";
export type TrafficId = "T0" | "T1" | "T2" | "T3" | "T4" | "T5" | "off";

export type EdgeContextParams = {
  study: "edge-context";
  stability: StabilityId;
  visibility: EdgeVisId;
  traffic: TrafficId;
  debug: boolean;
  showZones: boolean;
  hideChrome: boolean;
  lowBright: boolean;
  reduced: boolean;
  enabled: boolean;
  drawerOpen: boolean;
  scrubProgress: number | null;
};

export function getParam(
  sp: LabSearchParams | URLSearchParams,
  key: string,
): string | null {
  if (sp instanceof URLSearchParams) return sp.get(key);
  const v = sp[key];
  if (v == null) return null;
  return Array.isArray(v) ? (v[0] ?? null) : v;
}

export function toURLSearchParams(
  sp: LabSearchParams | URLSearchParams,
): URLSearchParams {
  if (sp instanceof URLSearchParams) return new URLSearchParams(sp);
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v == null) continue;
    if (Array.isArray(v)) {
      for (const item of v) q.append(k, item);
    } else {
      q.set(k, v);
    }
  }
  return q;
}

export function searchParamsFromWindow(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

function parseStability(raw: string | null): StabilityId {
  const v = (raw || "E1").toUpperCase();
  return v === "E0" || v === "E2" || v === "E1" ? v : "E1";
}

function parseVis(raw: string | null): EdgeVisId {
  return raw === "VB" ? "VB" : "V0";
}

function parseTraffic(raw: string | null): TrafficId {
  const v = (raw || "off").toUpperCase();
  if (
    v === "T0" ||
    v === "T1" ||
    v === "T2" ||
    v === "T3" ||
    v === "T4" ||
    v === "T5"
  ) {
    return v;
  }
  return "off";
}

/** Canonical edge-context query reader (aliases: e, v, t). */
export function parseEdgeContextParams(
  q: LabSearchParams | URLSearchParams,
): EdgeContextParams {
  const ip = getParam(q, "ip");
  let scrubProgress: number | null = null;
  if (ip != null && ip !== "") {
    const p = Math.min(1, Math.max(0, Number(ip)));
    if (!Number.isNaN(p)) scrubProgress = p;
  }

  return {
    study: "edge-context",
    stability: parseStability(getParam(q, "stability") || getParam(q, "e")),
    visibility: parseVis(getParam(q, "visibility") || getParam(q, "v")),
    traffic: parseTraffic(getParam(q, "traffic") || getParam(q, "t")),
    debug: getParam(q, "debug") === "1",
    showZones: getParam(q, "zones") === "1",
    hideChrome: getParam(q, "chrome") === "0",
    lowBright: getParam(q, "dim") === "1",
    reduced: getParam(q, "reduced") === "1",
    enabled: getParam(q, "interaction") !== "0",
    drawerOpen: getParam(q, "drawer") === "1",
    scrubProgress,
  };
}
