"use client";

import { useEffect, useRef, useCallback } from "react";

export default function ThresholdHero({
  locale,
  onEnterWorld,
}: {
  locale: "es" | "en";
  onEnterWorld?: () => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef<HTMLButtonElement>(null);
  const pencilRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const enterRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const dustTimer = useRef<ReturnType<typeof setInterval>>(undefined);

  const es = locale === "es";

  const applyReveal = useCallback((el: HTMLElement, pct: number) => {
    const hidden = Math.max(0, 100 - pct);
    const clip = `inset(0 0 ${hidden.toFixed(2)}% 0)`;
    el.style.clipPath = clip;
    (el.style as any).webkitClipPath = clip;
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const frame = frameRef.current;
    const drawing = drawingRef.current;
    const pencil = pencilRef.current;
    const dust = dustRef.current;
    const titleWrap = titleRef.current;
    const caption = captionRef.current;
    const enterCue = enterRef.current;
    const cue = cueRef.current;
    if (!section || !stage || !frame || !drawing) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    stage.style.height = window.innerHeight + "px";

    if (reduced) {
      applyReveal(drawing, 100);
      drawing.style.opacity = "1";
      drawing.style.setProperty("--reveal-opacity", "1");
      if (titleWrap) {
        titleWrap.style.setProperty("--title-opacity", "1");
        titleWrap.style.setProperty("--title-y", "0px");
      }
      if (caption) caption.style.setProperty("--caption-opacity", "1");
      if (enterCue) {
        enterCue.style.setProperty("--enter-opacity", "1");
        enterCue.style.setProperty("--enter-y", "0px");
      }
      if (pencil) pencil.style.opacity = "0";
      if (cue) cue.classList.add("hide");
      return;
    }

    applyReveal(drawing, 18);
    drawing.style.setProperty("--reveal-opacity", "0");
    if (pencil) pencil.style.setProperty("--pencil-opacity", "0.9");

    let gsapInstance: any;
    let ScrollTrigger: any;
    let st: any;

    (async () => {
      const [gsapMod, stMod] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsapInstance = gsapMod.default || gsapMod.gsap;
      ScrollTrigger = stMod.default || stMod.ScrollTrigger;
      gsapInstance.registerPlugin(ScrollTrigger);

      st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self: any) => {
          const p = self.progress;

          let revealPct: number;
          if (p < 0.7) {
            const t = p / 0.7;
            const eased = 1 - Math.pow(1 - t, 1.6);
            revealPct = 18 + eased * 82;
          } else {
            revealPct = 100;
          }
          applyReveal(drawing, revealPct);

          const revealFrac = Math.min(1, p / 0.7);
          drawing.style.setProperty("--reveal-opacity", revealFrac.toFixed(3));

          const lineYPct = (revealPct / 100) * 100;
          if (pencil) pencil.style.setProperty("--line-y", lineYPct.toFixed(2) + "%");
          if (dust) dust.style.setProperty("--line-y", lineYPct.toFixed(2) + "%");

          const penOp = p < 0.66 ? 0.9 : Math.max(0, 0.9 - ((p - 0.66) / 0.1) * 0.9);
          if (pencil) pencil.style.setProperty("--pencil-opacity", penOp.toFixed(2));

          const cp = gsapInstance.utils.clamp(0, 1, (p - 0.7) / 0.3);
          frame.style.setProperty("--cam-scale", gsapInstance.utils.interpolate(1, 1.08, cp).toFixed(3));
          frame.style.setProperty("--orbit", gsapInstance.utils.interpolate(0, 4, cp).toFixed(2) + "deg");
          frame.style.setProperty("--tilt", gsapInstance.utils.interpolate(0, -2, cp).toFixed(2) + "deg");
          drawing.style.setProperty("--art-bright", gsapInstance.utils.interpolate(1.0, 1.08, cp).toFixed(3));
          drawing.style.setProperty("--art-contrast", gsapInstance.utils.interpolate(1.04, 1.14, cp).toFixed(3));

          if (titleWrap) {
            const titleP = gsapInstance.utils.clamp(0, 1, (p - 0.8) / 0.2);
            titleWrap.style.setProperty("--title-opacity", titleP.toFixed(2));
            titleWrap.style.setProperty("--title-y", ((1 - titleP) * 14).toFixed(1) + "px");
          }

          if (caption) {
            const capP = gsapInstance.utils.clamp(0, 1, (p - 0.45) / 0.25);
            caption.style.setProperty("--caption-opacity", capP.toFixed(2));
          }

          if (enterCue) {
            const enterP = gsapInstance.utils.clamp(0, 1, (p - 0.92) / 0.08);
            enterCue.style.setProperty("--enter-opacity", enterP.toFixed(2));
            enterCue.style.setProperty("--enter-y", ((1 - enterP) * 20).toFixed(1) + "px");
          }

          if (cue) cue.classList.toggle("hide", p > 0.02);
        },
      });
    })();

    dustTimer.current = setInterval(() => {
      if (!dust) return;
      dust.classList.remove("drift");
      void dust.offsetWidth;
      dust.classList.add("drift");
    }, 4000);

    return () => {
      st?.kill();
      clearInterval(dustTimer.current);
    };
  }, [applyReveal]);

  const handleEnter = useCallback(() => {
    const frame = frameRef.current;
    const portal = portalRef.current;
    if (!frame || !portal) return;

    document.body.classList.add("portal-open");
    portal.classList.add("active");

    setTimeout(() => {
      onEnterWorld?.();
      const worldEl = document.getElementById("ch-2");
      if (worldEl) {
        const target = worldEl.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: target, behavior: "smooth" });
      }
      setTimeout(() => {
        document.body.classList.remove("portal-open");
        portal.classList.remove("active");
      }, 1600);
    }, 700);
  }, [onEnterWorld]);

  return (
    <>
      <div className="paper-grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <section
        ref={sectionRef}
        id="threshold"
        className="threshold"
        aria-label={es ? "Umbral — la revelación" : "Threshold — the revelation"}
      >
        <div ref={stageRef} className="threshold-stage">
          <div ref={frameRef} className="threshold-frame">
            <div className="threshold-artwrap">
              <button
                ref={drawingRef}
                className="threshold-drawing"
                type="button"
                aria-label={
                  es
                    ? "Dibujo anamórfico de Fredo 3D. Haz clic para entrar al mundo."
                    : "Anamorphic drawing by Fredo 3D. Click to enter the world."
                }
                data-cursor-label={es ? "ENTRA" : "ENTER"}
                onClick={handleEnter}
              />
              <div ref={pencilRef} className="threshold-pencil" aria-hidden="true" />
              <div ref={dustRef} className="threshold-dust" aria-hidden="true" />
            </div>

            <div ref={captionRef} className="threshold-caption">
              <div className="threshold-caption-who">Wladimir Inostroza</div>
              <div className="threshold-caption-meta">
                <b>FREDO 3D</b> · {es ? "Artista anamórfico" : "Anamorphic artist"} ·{" "}
                {es ? "Chile" : "Chile"}
              </div>
            </div>
          </div>

          <div ref={titleRef} className="threshold-title">
            <h1>
              {es ? (
                <>
                  Entre el papel y lo <em>imposible</em>.
                </>
              ) : (
                <>
                  Between paper and the <em>impossible</em>.
                </>
              )}
            </h1>
            <div className="threshold-tag">
              {es ? "Anamórfico · Grafito · Chile" : "Anamorphic · Graphite · Chile"}
            </div>
          </div>

          <div ref={enterRef} className="threshold-enter">
            <span className="threshold-enter-label">{es ? "Entra" : "Enter"}</span>
            <span className="threshold-enter-dot" />
          </div>
        </div>

        <div ref={cueRef} className="threshold-cue">
          <span>{es ? "Desplaza para revelar" : "Scroll to reveal"}</span>
          <span className="threshold-cue-line" />
        </div>
      </section>

      <div ref={portalRef} className="threshold-portal" aria-hidden="true" />
    </>
  );
}
