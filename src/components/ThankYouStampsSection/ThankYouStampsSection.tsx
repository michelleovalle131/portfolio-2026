import type { CSSProperties } from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Stamp } from "../Stamp/Stamp";
import {
  buildStampPerforationCirclesSeamless,
  type StampMaskGeometry,
} from "../Stamp/stampPerforationMask";
import { STAMP_META } from "../Hero/stampMeta";
import {
  labelFromStampBackground,
  uniqueStampBackgrounds,
} from "../Hero/stampImagePool";
import FUN_FACTS_URLS from "virtual:fun-facts-imgs";
import styles from "./ThankYouStampsSection.module.css";

const FALLBACK_BACKGROUNDS = STAMP_META.map((s) => s.fallbackBg);

const HERO_PERFORATION_PATTERN_SCALE = 0.7 * 0.8;
const HERO_PERFORATION_R =
  (8 / (1.25 * 1.25)) * 0.92 * 0.8 * HERO_PERFORATION_PATTERN_SCALE * 1.1;
const HERO_PERFORATION_PITCH_R = 4;

function fract(n: number): number {
  return n - Math.floor(n);
}

/** Spread stamps across the full band (deterministic per seed + index); 0–100%. */
function sprawlSlot(seed: number, index: number): {
  leftPct: number;
  topPct: number;
  rotateDeg: number;
} {
  const a = fract(Math.sin(seed * 127.1 + index * 311.7) * 43758.5453123);
  const b = fract(Math.sin(seed * 269.5 + index * 183.3) * 23421.14159265);
  const c = fract(Math.sin(seed * 419.2 + index * 97.4) * 99123.456789);
  return {
    leftPct: a * 100,
    topPct: b * 100,
    rotateDeg: -22 + c * 44,
  };
}

/**
 * Pass 0: `entry` (first appearance). Pass 1: `cover` (second appearance after entry
 * has finished — cover runs later in the view timeline).
 */
const SCROLL_PASSES = 2;

type StampScrollRange = {
  rangeStart: string;
  rangeEnd: string;
  phase: "entry" | "cover";
};

function stampScrollRangeForStamp(
  slotIndex: number,
  imageCount: number,
  remixSeed: number,
): StampScrollRange {
  if (imageCount <= 0) {
    return { rangeStart: "0%", rangeEnd: "100%", phase: "entry" };
  }

  const pass = Math.floor(slotIndex / imageCount);
  const localIndex = slotIndex % imageCount;
  const jitter =
    fract(Math.sin(remixSeed * 0.011 + slotIndex * 4.27) * 9999) * 2.8;
  const t = imageCount === 1 ? 0 : localIndex / (imageCount - 1);

  if (pass === 0) {
    const bandStart = 70;
    const bandEnd = 100;
    const bandW = bandEnd - bandStart;
    /* Tighter start spread + longer dur → wider animation-range (slower scroll feel). */
    const slotStart = bandStart + t * (bandW * 0.52) + jitter * 0.35;
    const dur =
      58 +
      fract(Math.sin(remixSeed * 0.017 + localIndex * 2.9) * 9999) * 38;
    const slotEnd = Math.min(bandEnd, slotStart + dur);
    return {
      rangeStart: `${slotStart.toFixed(1)}%`,
      rangeEnd: `${slotEnd.toFixed(1)}%`,
      phase: "entry",
    };
  }

  /** Second pass: same images, `cover` 0–50%, longer spans for slower motion */
  const bandStart = 0;
  const bandEnd = 50;
  const bandW = bandEnd - bandStart;
  const slotStart = bandStart + t * (bandW * 0.52) + jitter * 0.35;
  let dur =
    20 +
    fract(Math.sin(remixSeed * 0.041 + localIndex * 3.15) * 9999) * 30;
  if (dur < 1) {
    dur = 1;
  }
  const slotEnd = Math.min(bandEnd, slotStart + dur);
  return {
    rangeStart: `${slotStart.toFixed(1)}%`,
    rangeEnd: `${slotEnd.toFixed(1)}%`,
    phase: "cover",
  };
}

/** Shorter rise than hero so fewer stamps sit clipped under overflow before their range. */
function maxSlidePx(index: number, remixSeed: number): number {
  const raw = 118 + fract(Math.sin(remixSeed * 0.019 + index * 2.91) * 10000) * 22;
  return Math.round(raw * 0.55);
}

type ThankYouStampsSectionProps = {
  remixEpoch?: number;
};

export function ThankYouStampsSection({
  remixEpoch = 0,
}: ThankYouStampsSectionProps) {
  const imageCount = Math.max(0, FUN_FACTS_URLS.length);
  const stampSlotCount = imageCount * SCROLL_PASSES;

  const [stampBackgrounds, setStampBackgrounds] = useState<string[]>(() =>
    imageCount > 0
      ? uniqueStampBackgrounds(
          imageCount,
          FUN_FACTS_URLS,
          FALLBACK_BACKGROUNDS,
        )
      : [],
  );
  const [perforations, setPerforations] = useState<(StampMaskGeometry | null)[]>(
    () => [],
  );
  const [sprawlRevealed, setSprawlRevealed] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const polaroidRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    if (remixEpoch === 0) {
      return;
    }
    if (imageCount > 0) {
      setStampBackgrounds(
        uniqueStampBackgrounds(
          imageCount,
          FUN_FACTS_URLS,
          FALLBACK_BACKGROUNDS,
        ),
      );
    }
    setPerforations([]);
  }, [remixEpoch, imageCount]);

  const stampLabels = useMemo(
    () =>
      stampBackgrounds.map((bg, i) => {
        const fromFile = labelFromStampBackground(bg);
        return fromFile || STAMP_META[i % STAMP_META.length]!.label;
      }),
    [stampBackgrounds],
  );

  const sprawlSlotsByPass = useMemo(() => {
    const base = remixEpoch * 1009 + 42;
    return {
      0: Array.from({ length: imageCount }, (_, i) => sprawlSlot(base, i)),
      1: Array.from({ length: imageCount }, (_, i) =>
        sprawlSlot(base + 5021, i),
      ),
    } as const;
  }, [imageCount, remixEpoch]);

  const measureStackPerforations = useCallback(() => {
    const layer = layerRef.current;
    if (!layer || !sprawlRevealed || stampSlotCount === 0) {
      return;
    }
    const lr = layer.getBoundingClientRect();
    const next: (StampMaskGeometry | null)[] = Array.from(
      { length: stampSlotCount },
      (_, i) => {
        const el = polaroidRefs.current[i];
        if (!el) {
          return null;
        }
        const br = el.getBoundingClientRect();
        const w = Math.round(br.width * 1000) / 1000;
        const h = Math.round(br.height * 1000) / 1000;
        if (w < 24 || h < 24) {
          return null;
        }
        const offX = br.left - lr.left;
        const offY = br.top - lr.top;
        const { r, circles } = buildStampPerforationCirclesSeamless(
          w,
          h,
          offX,
          offY,
          {
            r: HERO_PERFORATION_R,
            pitchInR: HERO_PERFORATION_PITCH_R,
          },
        );
        if (circles.length === 0) {
          return null;
        }
        return { w, h, r, circles };
      },
    );
    setPerforations(next);
  }, [stampSlotCount, sprawlRevealed]);

  useLayoutEffect(() => {
    measureStackPerforations();
  }, [measureStackPerforations]);

  useLayoutEffect(() => {
    const layer = layerRef.current;
    if (!layer) {
      return;
    }
    const ro = new ResizeObserver(() => {
      measureStackPerforations();
    });
    ro.observe(layer);
    return () => {
      ro.disconnect();
    };
  }, [measureStackPerforations]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSprawlRevealed(true);
      return;
    }

    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const tryReveal = () => {
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.top < vh * 0.92 && r.bottom > r.height * 0.08) {
        setSprawlRevealed(true);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.12) {
          setSprawlRevealed(true);
        }
      },
      { threshold: [0, 0.12, 0.25], rootMargin: "0px 0px -8% 0px" },
    );

    tryReveal();
    io.observe(section);
    return () => {
      io.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="thank-you"
      className={`${styles.sectionTrack} ${styles.sectionScrollDriven}`}
      aria-labelledby="thank-you-heading"
    >
      <div className={styles.sectionStickyVisual}>
        <div
          ref={layerRef}
          className={styles.stampSprawl}
          aria-hidden
          data-revealed={sprawlRevealed}
        >
          <div className={styles.stampSprawlInner}>
            {sprawlRevealed &&
              stampSlotCount > 0 &&
              Array.from({ length: stampSlotCount }, (__, slotIndex) => {
                const imageIndex = slotIndex % imageCount;
                const pass = Math.floor(slotIndex / imageCount) as 0 | 1;
                const pos = sprawlSlotsByPass[pass][imageIndex]!;
                const seed = remixEpoch * 1009 + 42 + pass * 17;
                const { rangeStart, rangeEnd, phase } = stampScrollRangeForStamp(
                  slotIndex,
                  imageCount,
                  seed,
                );
                return (
                  <div
                    key={`thank-you-sprawl-${remixEpoch}-${slotIndex}`}
                    className={
                      phase === "cover"
                        ? `${styles.stampSprawlItem} ${styles.stampSprawlItemCover}`
                        : styles.stampSprawlItem
                    }
                    style={
                      {
                        "--sprawl-r": `${pos.rotateDeg}deg`,
                        "--max-slide": `${maxSlidePx(imageIndex, seed)}px`,
                        "--entry-range-start": rangeStart,
                        "--entry-range-end": rangeEnd,
                        left: `${pos.leftPct}%`,
                        top: `${pos.topPct}%`,
                        zIndex: 10 + imageIndex + pass * 60,
                      } as CSSProperties
                    }
                  >
                    <div className={styles.stampSprawlScale}>
                      <Stamp
                        ref={(el) => {
                          polaroidRefs.current[slotIndex] = el;
                        }}
                        label={
                          stampLabels[imageIndex] ??
                          STAMP_META[imageIndex % STAMP_META.length]!.label
                        }
                        imageBackground={
                          stampBackgrounds[imageIndex] ??
                          STAMP_META[imageIndex % STAMP_META.length]!.fallbackBg
                        }
                        stampIndex={slotIndex}
                        perforation={perforations[slotIndex] ?? null}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className={styles.thankYouChrome}>
          <h2 className={styles.thankYouHeading} id="thank-you-heading">
            Thank you
          </h2>
        </div>
      </div>
    </section>
  );
}
