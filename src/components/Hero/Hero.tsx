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
import {
  labelFromStampBackground,
  STAMP_IMAGE_URLS,
  uniqueStampBackgrounds,
} from "./stampImagePool";
import { stampGridStyle } from "./stampGridLayout";
import { usePageBgIsDark } from "../../hooks/usePageBgIsDark";
import { STAMP_META } from "./stampMeta";
import styles from "./Hero.module.css";

const FALLBACK_BACKGROUNDS = STAMP_META.map((s) => s.fallbackBg);

/**
 * Shrinks r only; pitch stays `pitchInR × r` (same scallop-to-pitch look, finer repeat).
 * Cumulative: 0.7 vs pre-scale hero, then ×0.8 (~20% smaller again) ⇒ 0.56.
 */
const HERO_PERFORATION_PATTERN_SCALE = 0.7 * 0.8;

/**
 * Punch radius for hero stamps (includes prior ×1.1 tuning). Single scallop size for
 * every stamp; pitch stays `pitchInR × r` per stamp.
 */
const HERO_PERFORATION_R =
  (8 / (1.25 * 1.25)) * 0.92 * 0.8 * HERO_PERFORATION_PATTERN_SCALE * 1.1;

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

type HeroProps = {
  /** Increments on Reprint so stamp photos + scallops reshuffle like a full page reload. */
  remixEpoch?: number;
};

export function Hero({ remixEpoch = 0 }: HeroProps) {
  const pageBgIsDark = usePageBgIsDark();
  const layerRef = useRef<HTMLDivElement>(null);
  const polaroidRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [stampBackgrounds, setStampBackgrounds] = useState(() =>
    initialBackgrounds(),
  );
  const [perforations, setPerforations] = useState(emptyPerforations);

  useLayoutEffect(() => {
    if (remixEpoch === 0) {
      return;
    }
    setStampBackgrounds(initialBackgrounds());
    setPerforations(emptyPerforations());
  }, [remixEpoch]);

  const stampLabels = useMemo(
    () =>
      stampBackgrounds.map((bg, i) => {
        const fromFile = labelFromStampBackground(bg);
        return fromFile || STAMP_META[i]!.label;
      }),
    [stampBackgrounds],
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
    });
    setPerforations(next);
  }, []);

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
    <section
      id="home"
      className={styles.hero}
      data-hero-contrast={pageBgIsDark ? "dark" : "light"}
    >
      <div
        ref={layerRef}
        className={`${styles.stampLayer} ${styles.stampGrid}`}
        aria-hidden
      >
        {STAMP_META.map((s, i) => (
          <div
            key={`hero-stamp-${i}`}
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
              label={stampLabels[i] ?? s.label}
              imageBackground={stampBackgrounds[i] ?? s.fallbackBg}
              stampIndex={i}
              perforation={perforations[i] ?? null}
            />
          </div>
        ))}
      </div>

      {/* Viewport-centered type (sticky); section is 125dvh for longer parallax scroll. */}
      <div className={styles.textViewport}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            <LogoMark className={styles.logo} />
          </h1>
          <p className={styles.lede}>
            <span className={styles.ledeText}>
              Hi, I&apos;m Michelle—a Sr Product Designer who thrives at the
              intersection of systems, craft, and making a real impact for
              users.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
