import { useEffect, useRef, useState } from "react";
import { getInkFromPageBg, type InkColors } from "../../lib/pageBgInk";
import styles from "./MouseTrail.module.css";

const TRAIL_MAX_AGE_MS = 1350;
const LERP = 0.1;
/** Denser samples so Catmull–Rom splines stay smooth through tight turns. */
const MIN_DIST_SQ = 0.22;
/** >1 fades the tail a bit faster than linear. */
const FADE_CURVE = 1.22;

type TrailPoint = { x: number; y: number; t: number };

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

function inkGradient(
  ctx: CanvasRenderingContext2D,
  pts: TrailPoint[],
  now: number,
  alphaScale: number,
  ink: InkColors,
): CanvasGradient {
  const first = pts[0]!;
  const last = pts[pts.length - 1]!;
  const g = ctx.createLinearGradient(first.x, first.y, last.x, last.y);
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const pos = n === 1 ? 0 : i / (n - 1);
    const age = now - pts[i]!.t;
    const alpha =
      age < TRAIL_MAX_AGE_MS
        ? Math.max(
            0,
            alphaScale *
              0.38 *
              (1 - age / TRAIL_MAX_AGE_MS) ** FADE_CURVE,
          )
        : 0;
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
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const brushRef = useRef({ x: -9999, y: -9999 });
  const trailRef = useRef<TrailPoint[]>([]);
  const rafRef = useRef(0);
  const initializedRef = useRef(false);
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

    const onPointerMove = (e: PointerEvent) => {
      if (!initializedRef.current) {
        brushRef.current = { x: e.clientX, y: e.clientY };
        initializedRef.current = true;
      }
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const tick = (now: number) => {
      const mouse = mouseRef.current;
      const brush = brushRef.current;

      if (initializedRef.current) {
        brush.x += (mouse.x - brush.x) * LERP;
        brush.y += (mouse.y - brush.y) * LERP;
      }

      const trail = trailRef.current;
      if (initializedRef.current) {
        const last = trail[trail.length - 1];
        if (!last) {
          trail.push({ x: brush.x, y: brush.y, t: now });
        } else {
          const dx = brush.x - last.x;
          const dy = brush.y - last.y;
          if (dx * dx + dy * dy >= MIN_DIST_SQ) {
            trail.push({ x: brush.x, y: brush.y, t: now });
          }
        }
      }

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
        const gradWash = inkGradient(ctx, trail, now, 0.55, ink);
        const gradCore = inkGradient(ctx, trail, now, 1, ink);

        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        /* Outer wash: soft bleed like ink into paper. */
        ctx.save();
        ctx.shadowBlur = 4;
        ctx.shadowColor = `rgba(${ink.shadowR},${ink.shadowG},${ink.shadowB},0.44)`;
        ctx.lineWidth = 2.35;
        ctx.strokeStyle = gradWash;
        ctx.stroke(path);
        ctx.restore();

        /* Core line: slightly sharper body. */
        ctx.save();
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1.05;
        ctx.strokeStyle = gradCore;
        ctx.stroke(path);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(rafRef.current);
      trailRef.current = [];
      initializedRef.current = false;
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
