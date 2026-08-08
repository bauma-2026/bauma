"use client";

import { useSearchParams } from "next/navigation";

import { resolveStudyMode, type ModalStudyMode } from "./modalSurface";

export function useModalStudyMode(): ModalStudyMode {
  const searchParams = useSearchParams();
  return resolveStudyMode(searchParams.get("modalStudy"));
}
