"use client";

import { useEffect, useRef, useState } from "react";

export default function PencilCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [overArt, setOverArt] = useState(false);
  const [label, setLabel] = useState("");
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: PointerEvent) => {
      pos.current.tx = e.clientX;
      pos.current.ty = e.clientY;
      setVisible(true);
    };
    const onLeave = () => setVisible(false);

    const loop = () => {
      const p = pos.current;
      p.x += (p.tx - p.x) * 0.22;
      p.y += (p.ty - p.y) * 0.22;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`;
      }
      raf.current = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    raf.current = requestAnimationFrame(loop);

    const artEls = document.querySelectorAll("[data-cursor-label]");
    const enter = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      setOverArt(true);
      setLabel(el.dataset.cursorLabel || "VER");
    };
    const leave = () => { setOverArt(false); setLabel(""); };
    artEls.forEach((el) => {
      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointerleave", leave);
    });

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf.current);
      artEls.forEach((el) => {
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointerleave", leave);
      });
    };
  }, []);

  if (!visible && typeof document !== "undefined" && document.querySelector(".pencil-cursor")) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={`pencil-cursor${overArt ? " over-art" : ""}`}
      aria-hidden="true"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" fill="#fff" />
        <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="0.6" opacity="0.4" />
      </svg>
      <span className="cursor-label">{label}</span>
    </div>
  );
}
