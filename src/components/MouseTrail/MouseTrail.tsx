import { useEffect, useRef, useState } from "react";
import { getInkFromPageBg, type InkColors } from "../../lib/pageBgInk";
import styles from "./MouseTrail.module.css";

/** How long ink stays on screen before fully gone (longer = gentler dissolve). */
const TRAIL_MAX_AGE_MS = 2200;
/** Denser samples so Catmull–Rom splines stay smooth through tight turns. */
const MIN_DIST_SQ = 0.22;
/**
 * Fade curve: (1 - age/max) ** FADE_POWER. Higher = tail vanishes faster;
 * lower = softer, more “ink hanging in the paper” linger.
 * Other directions to try later: hold full opacity for first N ms then ease;
 * per-point velocity-based width; grain/dither in a second pass; “dry brush”
 * width taper as points age; very short max age for snappy UI sketch.
 */
const FADE_POWER = 2.35;

/** Thin marker: soft feather + crisp core (CSS px, before DPR transform). */
const MARKER_FEATHER_WIDTH = 1.2;
const MARKER_FEATHER_SHADOW_BLUR = 1.85;
const MARKER_FEATHER_SHADOW_ALPHA = 0.2;
const MARKER_CORE_WIDTH = 0.68;

type TrailPoint = { x: number; y: number; t: number };

/** Links, controls, and fields — skip drawing so clicks behave normally. */
function isInteractiveSurface(target: EventTarget | null): boolean {
  if (!target || !(target instanceof Element)) {
    return false;
  }
  if (target.closest('nav[aria-label="Site navigation"]')) {
    return true;
  }
  return (
    target.closest(
      [
        "a[href]",
        "button",
        "input",
        "textarea",
        "select",
        "option",
        "label",
        "summary",
        '[role="button"]',
        '[role="link"]',
        '[role="menuitem"]',
        '[role="option"]',
        '[role="tab"]',
        "[contenteditable]:not([contenteditable='false'])",
      ].join(", "),
    ) != null
  );
}

/** Uniform Catmull–Rom (centripetal-style tension via standard /6 handles). */
function buildCatmullRomPath(pts: TrailPoint[]): Path2D {
  const path = new Path2D();
  const n = pts.length;
  if (n < 2) return path;
  path.moveTo(pts[0]!.x, pts[0]!.y);
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[Math.min(n - 1, i + 2)]!;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }
  return path;
}

/** Opacity vs age: ease-out style dissolve (strong while young, smooth tail-off). */
function fadeForAge(ageMs: number, peakAlpha: number): number {
  if (ageMs >= TRAIL_MAX_AGE_MS) return 0;
  const t = ageMs / TRAIL_MAX_AGE_MS;
  const life = (1 - t) ** FADE_POWER;
  return Math.max(0, peakAlpha * life);
}

function inkGradient(
  ctx: CanvasRenderingContext2D,
  pts: TrailPoint[],
  now: number,
  peakAlpha: number,
  ink: InkColors,
): CanvasGradient {
  const first = pts[0]!;
  const last = pts[pts.length - 1]!;
  const g = ctx.createLinearGradient(first.x, first.y, last.x, last.y);
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const pos = n === 1 ? 0 : i / (n - 1);
    const age = now - pts[i]!.t;
    const alpha = fadeForAge(age, peakAlpha);
    g.addColorStop(
      pos,
      `rgba(${ink.r},${ink.g},${ink.b},${alpha})`,
    );
  }
  return g;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}

export function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const brushRef = useRef({ x: -9999, y: -9999 });
  const trailRef = useRef<TrailPoint[]>([]);
  const rafRef = useRef(0);
  const drawingRef = useRef(false);
  const prevUserSelectRef = useRef<string>("");
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const pushPoint = (x: number, y: number, now: number) => {
      const trail = trailRef.current;
      const last = trail[trail.length - 1];
      if (!last) {
        trail.push({ x, y, t: now });
        return;
      }
      const dx = x - last.x;
      const dy = y - last.y;
      if (dx * dx + dy * dy >= MIN_DIST_SQ) {
        trail.push({ x, y, t: now });
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      if (isInteractiveSurface(e.target)) return;

      drawingRef.current = true;
      prevUserSelectRef.current = document.body.style.userSelect;
      document.body.style.userSelect = "none";

      const x = e.clientX;
      const y = e.clientY;
      const now = performance.now();
      brushRef.current = { x, y };
      pushPoint(x, y, now);

      try {
        e.preventDefault();
      } catch {
        /* ignore */
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      const x = e.clientX;
      const y = e.clientY;
      const now = performance.now();
      brushRef.current = { x, y };
      pushPoint(x, y, now);
    };

    const endStroke = () => {
      if (!drawingRef.current) return;
      drawingRef.current = false;
      document.body.style.userSelect = prevUserSelectRef.current;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.button === 0) {
        endStroke();
      }
    };

    const onPointerCancel = () => {
      endStroke();
    };

    const tick = (now: number) => {
      const trail = trailRef.current;

      const cutoff = now - TRAIL_MAX_AGE_MS;
      while (trail.length > 0 && trail[0]!.t < cutoff) {
        trail.shift();
      }

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      if (trail.length > 1) {
        const ink = getInkFromPageBg();
        const path = buildCatmullRomPath(trail);
        /* Feather: marker bleed into “paper” — wide, soft, low alpha */
        const gradFeather = inkGradient(ctx, trail, now, 0.32, ink);
        /* Core: thin, dense line like a fine-tip marker */
        const gradCore = inkGradient(ctx, trail, now, 0.94, ink);

        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.save();
        ctx.shadowBlur = MARKER_FEATHER_SHADOW_BLUR;
        ctx.shadowColor = `rgba(${ink.r},${ink.g},${ink.b},${MARKER_FEATHER_SHADOW_ALPHA})`;
        ctx.lineWidth = MARKER_FEATHER_WIDTH;
        ctx.strokeStyle = gradFeather;
        ctx.stroke(path);
        ctx.restore();

        ctx.save();
        ctx.shadowBlur = 0;
        ctx.lineWidth = MARKER_CORE_WIDTH;
        ctx.strokeStyle = gradCore;
        ctx.stroke(path);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointerdown", onPointerDown, { capture: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { capture: true });
    window.addEventListener("pointercancel", onPointerCancel, {
      capture: true,
    });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onPointerDown, {
        capture: true,
      });
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp, { capture: true });
      window.removeEventListener("pointercancel", onPointerCancel, {
        capture: true,
      });
      cancelAnimationFrame(rafRef.current);
      document.body.style.userSelect = prevUserSelectRef.current;
      trailRef.current = [];
      drawingRef.current = false;
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return null;
  }

  return (
    <div className={styles.layer} aria-hidden>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
