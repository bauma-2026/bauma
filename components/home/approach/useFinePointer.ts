"use client";

import { useSyncExternalStore } from "react";

const query = "(hover: hover) and (pointer: fine)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(query).matches;
}

function getServerSnapshot() {
  return false;
}

export function useFinePointer() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
