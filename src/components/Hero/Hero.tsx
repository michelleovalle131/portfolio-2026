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
import { LogoMark } from "./LogoMark";
import { STAMP_IMAGE_URLS, uniqueStampBackgrounds } from "./stampImagePool";
import { stampGridStyle } from "./stampGridLayout";
import { STAMP_META } from "./stampMeta";
import styles from "./Hero.module.css";

const FALLBACK_BACKGROUNDS = STAMP_META.map((s) => s.fallbackBg);

/**
 * Shrinks r only; pitch stays `pitchInR × r` (same scallop-to-pitch look, finer repeat).
 * Cumulative: 0.7 vs pre-scale hero, then ×0.8 (~20% smaller again) ⇒ 0.56.
 */
const HERO_PERFORATION_PATTERN_SCALE = 0.7 * 0.8;

/**
 * Reference punch radius for “size 1” (includes prior ×1.1 tuning). Variants scale this;
 * pitch stays `pitchInR × r` per stamp so proportion is unchanged within each variant.
 */
const HERO_PERFORATION_R_BASE =
  (8 / (1.25 * 1.25)) * 0.92 * 0.8 * HERO_PERFORATION_PATTERN_SCALE * 1.1;

/** [size1, −20%, +21% vs base] — third variant is +10% on prior +10% (1.1 × 1.1). */
const HERO_SCALLOP_VARIANT_SCALES = [1, 0.8, 1.21] as const;

/** New random variant per stamp on each full page load (refresh). */
function randomScallopVariantIndexPerStamp(count: number): number[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 3));
}

/**
 * Center-to-center spacing = this × r. Kept at 4r: same flat-between-dips look, scaled with r.
 */
const HERO_PERFORATION_PITCH_R = 4;

/** Unitless multipliers: translateY = scrollY × factor (floaty, varied speeds) */
const STAMP_PARALLAX_FACTORS = [
  0.14, -0.1, 0.18, -0.12, 0.11, -0.16, 0.09, -0.14, 0.15, -0.08, 0.13,
] as const;

/** Shuffled per load; `uniqueStampBackgrounds` assigns distinct photo URLs (no repeats on hero). */
function initialBackgrounds(): string[] {
  return uniqueStampBackgrounds(
    STAMP_META.length,
    STAMP_IMAGE_URLS,
    FALLBACK_BACKGROUNDS,
  );
}

function emptyPerforations(): (StampMaskGeometry | null)[] {
  return Array.from({ length: STAMP_META.length }, () => null);
}

export function Hero() {
  const layerRef = useRef<HTMLDivElement>(null);
  const polaroidRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [stampBackgrounds] = useState(() => initialBackgrounds());
  const [perforations, setPerforations] = useState(emptyPerforations);

  const stampScallopVariantIndices = useMemo(
    () => randomScallopVariantIndexPerStamp(STAMP_META.length),
    [],
  );

  const measureHeroPerforations = useCallback(() => {
    const layer = layerRef.current;
    if (!layer) {
      return;
    }
    const lr = layer.getBoundingClientRect();
    const next: (StampMaskGeometry | null)[] = STAMP_META.map((_, i) => {
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
      const variantIdx = stampScallopVariantIndices[i] ?? 0;
      const variantScale = HERO_SCALLOP_VARIANT_SCALES[variantIdx];
      const rHero =
        HERO_PERFORATION_R_BASE * variantScale;
      const { r, circles } = buildStampPerforationCirclesSeamless(
        w,
        h,
        offX,
        offY,
        {
          r: rHero,
          pitchInR: HERO_PERFORATION_PITCH_R,
        },
      );
      if (circles.length === 0) {
        return null;
      }
      return { w, h, r, circles };
    });
    setPerforations(next);
  }, [stampScallopVariantIndices]);

  useLayoutEffect(() => {
    measureHeroPerforations();
  }, [measureHeroPerforations]);

  useLayoutEffect(() => {
    const layer = layerRef.current;
    if (!layer) {
      return;
    }
    const ro = new ResizeObserver(() => {
      measureHeroPerforations();
    });
    ro.observe(layer);
    return () => {
      ro.disconnect();
    };
  }, [measureHeroPerforations]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const root = layerRef.current;
    if (!root) {
      return;
    }
    let raf = 0;
    let rafMeasure = 0;
    const syncScroll = () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(rafMeasure);
      raf = requestAnimationFrame(() => {
        root.style.setProperty("--scroll-y", `${window.scrollY}px`);
        rafMeasure = requestAnimationFrame(() => {
          measureHeroPerforations();
        });
      });
    };
    window.addEventListener("scroll", syncScroll, { passive: true });
    syncScroll();
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(rafMeasure);
      window.removeEventListener("scroll", syncScroll);
    };
  }, [measureHeroPerforations]);

  return (
    <section id="home" className={styles.hero} data-theme="dark">
      <div
        ref={layerRef}
        className={`${styles.stampLayer} ${styles.stampGrid}`}
        aria-hidden
      >
        {STAMP_META.map((s, i) => (
          <div
            key={s.label}
            className={styles.stampParallax}
            style={{
              ...stampGridStyle(i),
              ["--parallax-factor" as string]: String(
                STAMP_PARALLAX_FACTORS[i] ?? 0.1,
              ),
            }}
          >
            <Stamp
              ref={(el) => {
                polaroidRefs.current[i] = el;
              }}
              label={s.label}
              imageBackground={stampBackgrounds[i] ?? s.fallbackBg}
              stampIndex={i}
              perforation={perforations[i] ?? null}
            />
          </div>
        ))}
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>
          <LogoMark className={styles.logo} />
        </h1>
        <p className={styles.lede}>
          Sr Product Designer who thrives at the intersection of systems,
          craft, and real impact.
        </p>
        <div className={styles.actions}>
          <a className={styles.secondaryLink} href="#contact">
            Get in touch
            <span className={styles.arrow} aria-hidden>
              ↗
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
