import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  labelFromStampBackground,
  STAMP_IMAGE_URLS,
  uniqueStampBackgrounds,
} from "./stampImagePool";
import { STAMP_META } from "./stampMeta";
import styles from "./HeroSection.module.css";

/** Extracts the URL from a CSS background shorthand like `url("...") center / cover no-repeat`. */
function extractImgSrc(background: string): string | null {
  const m = background.match(/url\(\s*["']?([^"')]+)["']?\s*\)/);
  return m ? m[1]! : null;
}

const FALLBACK_BACKGROUNDS = STAMP_META.map((s) => s.fallbackBg);

type HeroImageSize = "medium" | "large";

type HeroImagePlacement = {
  size: HeroImageSize;
  left: string;
  top: string;
};

const HERO_IMAGE_LAYOUT: HeroImagePlacement[] = [
  // top zone — settle above the headline
  { size: "medium", left: "3%", top: "70%" },
  { size: "medium", left: "0%", top: "8%" },
  { size: "large", left: "31%", top: "2%" },
  { size: "medium", left: "59%", top: "4%" },
  { size: "medium", left: "87%", top: "8%" },
  // middle zone — overlap the headline
  { size: "medium", left: "14%", top: "26%" },
  { size: "medium", left: "75%", top: "38%" },
  { size: "medium", left: "90%", top: "28%" },
  // bottom zone — settle below the headline
  { size: "medium", left: "48%", top: "58%" },
  { size: "large", left: "38%", top: "72%" },
  { size: "large", left: "2%", top: "68%" },
  { size: "medium", left: "58%", top: "78%" },
  { size: "large", left: "86%", top: "58%" },
] as const;

const FOREGROUND_IMAGE_COUNT = 3;

/** On mobile, only these stamps render — cuts clutter from 13 down to 7 and
 *  skips the mid-zone stamps that otherwise overlap the headline. A tight
 *  top row (1,2,3,4 — all top ≈2-8%) and a tight bottom row (8,10,12 — all
 *  top ≈58-68%) leave a ~50% vertical gap between the two rows, so the two
 *  groups never collide even though stamps render larger on mobile now (see
 *  renderStamp's isMobile size override below). */
const MOBILE_VISIBLE_INDICES = new Set([1, 2, 3, 4, 8, 10, 12]);
const MOBILE_QUERY = "(max-width: 768px)";

/**
 * How fast each stamp rises per scroll-pixel (higher = arrives sooner).
 * translateY reaches 0 at scrollY = 100dvh / speed. The sticky frame's pin
 * duration is `.hero`'s height minus 100dvh — at 180dvh that's ~80dvh.
 * Speeds are tuned (3x the original pre-130dvh values, slower than the
 * ~3.5x used at 150dvh) so the rise itself reads even more gradual, and
 * even the slowest stamp settles at only ~49% of the pin duration —
 * leaving a long held pause before the frame unpins.
 */
const STAMP_SCROLL_SPEEDS = [
  3.0, 4.65, 2.7, 3.6, 4.65, 3.9, 4.5, 2.64, 3.3, 2.85, 4.35, 3.6, 2.55,
] as const;

/** Lower values = silkier but slower catch-up. */
const SCROLL_LERP = 0.09;
/** Close to the desktop value so stamps visibly trail the scroll on mobile
 *  too, instead of snapping to position almost instantly. */
const SCROLL_LERP_MOBILE = 0.13;
const SCROLL_SNAP_EPSILON = 0.08;

/** Shuffled per load; `uniqueStampBackgrounds` assigns distinct photo URLs (no repeats on hero). */
function initialBackgrounds(): string[] {
  return uniqueStampBackgrounds(HERO_IMAGE_LAYOUT.length, STAMP_IMAGE_URLS, [
    ...FALLBACK_BACKGROUNDS,
    FALLBACK_BACKGROUNDS[0]!,
    FALLBACK_BACKGROUNDS[1]!,
  ]);
}

function randomForegroundIndices(total: number, count: number): Set<number> {
  const indices = Array.from({ length: total }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j]!, indices[i]!];
  }
  return new Set(indices.slice(0, Math.min(count, total)));
}

type HeroProps = {
  /** Increments on Reprint so stamp photos reshuffle like a full page reload. */
  remixEpoch?: number;
};

export function HeroSection({ remixEpoch = 0 }: HeroProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [stampBackgrounds, setStampBackgrounds] = useState(() =>
    initialBackgrounds(),
  );
  const [foregroundIndices, setForegroundIndices] = useState(() =>
    randomForegroundIndices(HERO_IMAGE_LAYOUT.length, FOREGROUND_IMAGE_COUNT),
  );
  const [imageAspectRatios, setImageAspectRatios] = useState<number[]>([]);
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(MOBILE_QUERY).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (remixEpoch === 0) return;
    setStampBackgrounds(initialBackgrounds());
    setForegroundIndices(
      randomForegroundIndices(HERO_IMAGE_LAYOUT.length, FOREGROUND_IMAGE_COUNT),
    );
  }, [remixEpoch]);

  const stampLabels = useMemo(() => {
    const labels = STAMP_META.map((s) => s.label);
    return stampBackgrounds.map((bg, i) => {
      const fromFile = labelFromStampBackground(bg);
      return fromFile || labels[i % labels.length]!;
    });
  }, [stampBackgrounds]);

  useEffect(() => {
    let cancelled = false;
    const nextRatios = Array<number>(stampBackgrounds.length).fill(3 / 4);
    const loads = stampBackgrounds.map((background, index) => {
      const src = extractImgSrc(background);
      if (!src) return Promise.resolve();
      return new Promise<void>((resolve) => {
        const image = new Image();
        image.onload = () => {
          if (!cancelled && image.naturalWidth > 0 && image.naturalHeight > 0) {
            nextRatios[index] = image.naturalWidth / image.naturalHeight;
          }
          resolve();
        };
        image.onerror = () => resolve();
        image.src = src;
      });
    });
    Promise.all(loads).then(() => {
      if (!cancelled) setImageAspectRatios(nextRatios);
    });
    return () => {
      cancelled = true;
    };
  }, [stampBackgrounds]);

  const renderStamp = (slot: HeroImagePlacement, i: number, layer: "back" | "front") => {
    const bg = stampBackgrounds[i] ?? FALLBACK_BACKGROUNDS[0]!;
    const src = extractImgSrc(bg);
    const aspectRatio = imageAspectRatios[i] ?? 3 / 4;
    /** On mobile all visible stamps render at the larger size — the "medium"
     *  size read as noticeably too small once the set was pared down to 7. */
    const size: HeroImageSize = isMobile ? "large" : slot.size;
    const stampStyle = {
      ["--stamp-left" as string]: slot.left,
      ["--stamp-top" as string]: slot.top,
      ["--stamp-speed" as string]: String(STAMP_SCROLL_SPEEDS[i] ?? 1),
      ["--stamp-aspect" as string]: String(aspectRatio),
    } satisfies CSSProperties;

    return (
      <div
        key={`hero-stamp-${layer}-${i}`}
        className={[
          styles.stampParallax,
          styles[`size${size[0]!.toUpperCase()}${size.slice(1)}`],
        ].join(" ")}
        style={stampStyle}
      >
        {src ? (
          <img
            className={styles.heroPhoto}
            src={src}
            alt={stampLabels[i] ?? "Hero image"}
            draggable={false}
          />
        ) : (
          <div
            className={styles.heroPhotoFallback}
            style={{ background: bg }}
            aria-label={stampLabels[i] ?? "Hero image"}
          />
        )}
      </div>
    );
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = frameRef.current;
    if (!root) return;
    const lerp = isMobile ? SCROLL_LERP_MOBILE : SCROLL_LERP;
    let raf = 0;
    let targetY = window.scrollY;
    let currentY = targetY;

    const tick = () => {
      const delta = targetY - currentY;
      currentY += delta * lerp;
      if (Math.abs(delta) < SCROLL_SNAP_EPSILON) {
        currentY = targetY;
      }
      root.style.setProperty("--scroll-y", `${currentY}px`);
      raf = currentY === targetY ? 0 : requestAnimationFrame(tick);
    };

    const sync = () => {
      targetY = window.scrollY;
      if (raf === 0) {
        raf = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    sync();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [isMobile]);

  return (
    <section id="home" className={styles.hero}>
      {/* Sticky frame keeps stamps + text locked to the viewport while the section scrolls */}
      <div ref={frameRef} className={styles.stickyFrame}>
        <div
          className={`${styles.stampLayer} ${styles.stampLayerBack}`}
          aria-hidden
        >
          {HERO_IMAGE_LAYOUT.map((slot, i) => {
            if (isMobile && !MOBILE_VISIBLE_INDICES.has(i)) return null;
            if (foregroundIndices.has(i)) return null;
            return renderStamp(slot, i, "back");
          })}
        </div>

        <div className={styles.textViewport}>
          <div className={styles.textStack}>
            <p className={styles.kicker}>Michelle Ovalle</p>
            <h1 id="hero-title" className={styles.displayTitle}>
              Design with
              <br />
              heart &amp; mind
            </h1>
            <p className={styles.standfirst}>
              Shaping and shipping. One thoughtfully crafted decision at a
              time.
            </p>
          </div>
        </div>

        <div className={`${styles.stampLayer} ${styles.stampLayerFront}`} aria-hidden>
          {HERO_IMAGE_LAYOUT.map((slot, i) => {
            if (isMobile && !MOBILE_VISIBLE_INDICES.has(i)) return null;
            if (!foregroundIndices.has(i)) return null;
            return renderStamp(slot, i, "front");
          })}
        </div>
      </div>
    </section>
  );
}
