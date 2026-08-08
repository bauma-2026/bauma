"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { getWorkPreviewProject } from "./workPreviewData";

type OpenMeta = {
  fromTrigger: boolean;
  triggerRect: DOMRectReadOnly | null;
};

type WorkPreviewContextValue = {
  activeId: string | null;
  openMeta: OpenMeta | null;
  openPreview: (id: string, trigger: HTMLElement) => void;
  closePreview: () => void;
  registerTrigger: (id: string, element: HTMLElement | null) => void;
  getTriggerElement: (id: string) => HTMLElement | null;
};

const WorkPreviewContext = createContext<WorkPreviewContextValue | null>(null);

export function useWorkPreview() {
  const ctx = useContext(WorkPreviewContext);
  if (!ctx) {
    throw new Error("useWorkPreview must be used within WorkPreviewProvider");
  }
  return ctx;
}

export function WorkPreviewProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const triggerMapRef = useRef<Map<string, HTMLElement>>(new Map());
  const pendingTriggerMetaRef = useRef<OpenMeta | null>(null);
  const openedViaNavigationRef = useRef(false);
  const [openMeta, setOpenMeta] = useState<OpenMeta | null>(null);

  const paramId = searchParams.get("work");
  const activeId =
    paramId && getWorkPreviewProject(paramId) ? paramId : null;

  const openPreview = useCallback(
    (id: string, trigger: HTMLElement) => {
      if (!getWorkPreviewProject(id)) return;

      pendingTriggerMetaRef.current = {
        fromTrigger: true,
        triggerRect: trigger.getBoundingClientRect(),
      };
      openedViaNavigationRef.current = true;

      const params = new URLSearchParams(searchParams.toString());
      params.set("work", id);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const closePreview = useCallback(() => {
    if (!searchParams.get("work")) return;

    if (openedViaNavigationRef.current) {
      openedViaNavigationRef.current = false;
      router.back();
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("work");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    }
  }, [pathname, router, searchParams]);

  const registerTrigger = useCallback((id: string, element: HTMLElement | null) => {
    if (element) {
      triggerMapRef.current.set(id, element);
    } else {
      triggerMapRef.current.delete(id);
    }
  }, []);

  useEffect(() => {
    if (paramId && !getWorkPreviewProject(paramId)) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("work");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    }
  }, [paramId, pathname, router, searchParams]);

  const getTriggerElement = useCallback(
    (id: string) => triggerMapRef.current.get(id) ?? null,
    [],
  );

  useEffect(() => {
    if (activeId) {
      if (pendingTriggerMetaRef.current) {
        setOpenMeta(pendingTriggerMetaRef.current);
        pendingTriggerMetaRef.current = null;
      } else {
        setOpenMeta({ fromTrigger: false, triggerRect: null });
      }
      return;
    }

    setOpenMeta(null);
  }, [activeId]);

  return (
    <WorkPreviewContext.Provider
      value={{
        activeId,
        openMeta,
        openPreview,
        closePreview,
        registerTrigger,
        getTriggerElement,
      }}
    >
      {children}
    </WorkPreviewContext.Provider>
  );
}
