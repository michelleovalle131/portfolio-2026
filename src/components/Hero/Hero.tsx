import { useEffect, useRef, useState } from "react";
import { Stamp } from "../Stamp/Stamp";
import { LogoMark } from "./LogoMark";
import { randomStampBackgrounds, STAMP_IMAGE_URLS } from "./stampImagePool";
import { stampGridStyle } from "./stampGridLayout";
import { STAMP_META } from "./stampMeta";
import styles from "./Hero.module.css";

const FALLBACK_BACKGROUNDS = STAMP_META.map((s) => s.fallbackBg);

/** Unitless multipliers: translateY = scrollY × factor (floaty, varied speeds) */
const STAMP_PARALLAX_FACTORS = [
  0.14, -0.1, 0.18, -0.12, 0.11, -0.16, 0.09, -0.14, 0.15, -0.08, 0.13,
] as const;

function initialBackgrounds(): string[] {
  return randomStampBackgrounds(
    STAMP_META.length,
    STAMP_IMAGE_URLS,
    FALLBACK_BACKGROUNDS,
  );
}

export function Hero() {
  const layerRef = useRef<HTMLDivElement>(null);
  const [stampBackgrounds] = useState(() => initialBackgrounds());

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const root = layerRef.current;
    if (!root) {
      return;
    }
    let raf = 0;
    const syncScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        root.style.setProperty("--scroll-y", `${window.scrollY}px`);
      });
    };
    window.addEventListener("scroll", syncScroll, { passive: true });
    syncScroll();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", syncScroll);
    };
  }, []);

  return (
    <section className={styles.hero} data-theme="dark">
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
              label={s.label}
              imageBackground={stampBackgrounds[i] ?? s.fallbackBg}
              stampIndex={i}
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
