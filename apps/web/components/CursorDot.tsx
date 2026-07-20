"use client";

import { useEffect, useRef } from "react";

/** Decorative graphite-point cursor companion. Desktop fine-pointer only;
 * CSS hides it on touch and reduced-motion. Never replaces the real cursor. */
export default function CursorDot() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return <div ref={ref} className="cursor-dot" aria-hidden="true" />;
}
