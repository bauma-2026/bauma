"use client";

import { useEffect, useRef } from "react";

type ScrollLockState = {
  scrollY: number;
  paddingRight: string;
};

export function useScrollLock(active: boolean) {
  const stateRef = useRef<ScrollLockState | null>(null);

  useEffect(() => {
    if (!active) return;

    const scrollY = window.scrollY;
    const paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;

    stateRef.current = { scrollY, paddingRight };

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    if (paddingRight !== "0px") {
      document.body.style.paddingRight = paddingRight;
    }

    return () => {
      const state = stateRef.current;
      if (!state) return;

      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      window.scrollTo(0, state.scrollY);
      stateRef.current = null;
    };
  }, [active]);
}
