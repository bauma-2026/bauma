"use client";

import { useEffect, useRef } from "react";

/**
 * The real hero clip of `FlexidoHomeProof` (tablet/desktop background), rendered with the same markup as before; the only
 * addition is reduced-motion handling. Under `prefers-reduced-motion: reduce` the clip is paused on mount (which also
 * cancels an autoplay that has not started yet) and whenever the preference switches to reduce; when it switches back,
 * the clip resumes, but only while it is visible, so the hidden mobile `<video>` never starts decoding. Normal motion
 * keeps the browser's own muted autoplay loop, unchanged.
 */
export default function FlexidoHeroVideo({ src, className }: { src: string; className: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (query.matches) video.pause();

    const onChange = () => {
      if (query.matches) video.pause();
      else if (video.getClientRects().length) video.play().catch(() => {});
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <video
      ref={ref}
      aria-hidden="true"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      className={className}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
