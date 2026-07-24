"use client";

import { useEffect, useRef } from "react";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let lenis: any;
    let cleanup: (() => void) | undefined;

    (async () => {
      try {
        const [LenisMod, gsapMod, STMod] = await Promise.all([
          import("lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);

        const Lenis = LenisMod.default || (LenisMod as any).Lenis || LenisMod;
        const gsap = gsapMod.default || (gsapMod as any).gsap;
        const ScrollTrigger = STMod.default || (STMod as any).ScrollTrigger;

        gsap.registerPlugin(ScrollTrigger);

        lenis = new Lenis({
          duration: 1.1,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        });

        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time: number) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);

        cleanup = () => {
          lenis.destroy();
          ScrollTrigger.getAll().forEach((t: any) => t.kill());
        };
      } catch (e) {
        console.warn("[SmoothScroll] init failed:", e);
      }
    })();

    return () => cleanup?.();
  }, []);

  return <>{children}</>;
}
