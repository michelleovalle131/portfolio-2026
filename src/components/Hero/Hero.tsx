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
import { usePageBgIsDark } from "../../hooks/usePageBgIsDark";
import { STAMP_META } from "./stampMeta";
import styles from "./Hero.module.css";

/** Extracts the URL from a CSS background shorthand like `url("...") center / cover no-repeat`. */
function extractImgSrc(background: string): string | null {
  const m = background.match(/url\(\s*["']?([^"')]+)["']?\s*\)/);
  return m ? m[1]! : null;
}

const FALLBACK_BACKGROUNDS = STAMP_META.map((s) => s.fallbackBg);

type HeroImageSize = "small" | "medium" | "large";

type HeroImagePlacement = {
  size: HeroImageSize;
  left: string;
  top: string;
};

const HERO_IMAGE_LAYOUT: HeroImagePlacement[] = [
  // top zone — settle above the headline
  { size: "large", left: "-3%", top: "5%" },
  { size: "small", left: "14%", top: "10%" },
  { size: "large", left: "31%", top: "2%" },
  { size: "medium", left: "59%", top: "4%" },
  { size: "medium", left: "87%", top: "8%" },
  // middle zone — overlap the headline
  { size: "small", left: "-2%", top: "42%" },
  { size: "small", left: "75%", top: "38%" },
  { size: "medium", left: "91%", top: "44%" },
  // bottom zone — settle below the headline
  { size: "small", left: "16%", top: "68%" },
  { size: "large", left: "38%", top: "72%" },
  { size: "medium", left: "2%", top: "78%" },
  { size: "medium", left: "63%", top: "74%" },
  { size: "large", left: "85%", top: "65%" },
] as const;

const FOREGROUND_IMAGE_COUNT = 3;

/**
 * How fast each stamp rises per scroll-pixel (higher = arrives sooner).
 * translateY reaches 0 at scrollY = 100dvh / speed.
 * Speeds ≥ 0.85 so all stamps arrive within the hero's 120dvh max scroll.
 */
const STAMP_SCROLL_SPEEDS = [
  1.0, 1.4, 0.9, 1.2, 1.55, 1.3, 1.5, 0.88, 1.1, 0.95, 1.45, 1.2, 0.85,
] as const;

/** Lower values = silkier but slower catch-up. */
const SCROLL_LERP = 0.09;
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
  /** Increments on Reprint so stamp photos + scallops reshuffle like a full page reload. */
  remixEpoch?: number;
};

export function Hero({ remixEpoch = 0 }: HeroProps) {
  const pageBgIsDark = usePageBgIsDark();
  const frameRef = useRef<HTMLDivElement>(null);
  const [stampBackgrounds, setStampBackgrounds] = useState(() =>
    initialBackgrounds(),
  );
  const [foregroundIndices, setForegroundIndices] = useState(() =>
    randomForegroundIndices(HERO_IMAGE_LAYOUT.length, FOREGROUND_IMAGE_COUNT),
  );
  const [imageAspectRatios, setImageAspectRatios] = useState<number[]>([]);

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
          styles[`size${slot.size[0]!.toUpperCase()}${slot.size.slice(1)}`],
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
    let raf = 0;
    let targetY = window.scrollY;
    let currentY = targetY;

    const tick = () => {
      const delta = targetY - currentY;
      currentY += delta * SCROLL_LERP;
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
  }, []);

  return (
    <section
      id="home"
      className={styles.hero}
      data-hero-contrast={pageBgIsDark ? "dark" : "light"}
    >
      {/* Sticky frame keeps stamps + text locked to the viewport while the section scrolls */}
      <div ref={frameRef} className={styles.stickyFrame}>
        <div
          className={`${styles.stampLayer} ${styles.stampLayerBack}`}
          aria-hidden
        >
          {HERO_IMAGE_LAYOUT.map((slot, i) => {
            if (foregroundIndices.has(i)) return null;
            return renderStamp(slot, i, "back");
          })}
        </div>

        <div className={styles.textViewport}>
          <h1 className={styles.displayTitle}>
            Design with
            <br />
            heart &amp; mind
          </h1>
        </div>

        <div className={`${styles.stampLayer} ${styles.stampLayerFront}`} aria-hidden>
          {HERO_IMAGE_LAYOUT.map((slot, i) => {
            if (!foregroundIndices.has(i)) return null;
            return renderStamp(slot, i, "front");
          })}
        </div>
      </div>
    </section>
  );
}
