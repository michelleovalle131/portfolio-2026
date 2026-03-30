import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { usePageBgIsDark } from "../../hooks/usePageBgIsDark";
import { buildStampPerforationCircles } from "../Stamp/stampPerforationMask";
import styles from "./StampBalanceSection.module.css";

const PORTRAIT_SRC = "/imgs/MOportrait.jpg";

type MaskGeom = {
  w: number;
  h: number;
  r: number;
  circles: { cx: number; cy: number }[];
};

const STAMP_ENTER_DELAY_MS = 320;

export function StampBalanceSection() {
  const pageBgIsDark = usePageBgIsDark();
  const maskId = useId().replace(/:/g, "");
  const stampRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [geom, setGeom] = useState<MaskGeom | null>(null);
  const [stampEntered, setStampEntered] = useState(false);
  const stampEnterTriggeredRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let delayTimer: number | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || stampEnterTriggeredRef.current) return;
        stampEnterTriggeredRef.current = true;

        if (reducedMotion) {
          setStampEntered(true);
          return;
        }

        delayTimer = window.setTimeout(() => {
          delayTimer = undefined;
          setStampEntered(true);
        }, STAMP_ENTER_DELAY_MS);
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      if (delayTimer !== undefined) window.clearTimeout(delayTimer);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const section = sectionRef.current;
    if (!section) return;

    let raf = 0;
    const syncScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        section.style.setProperty("--intro-scroll-y", `${window.scrollY}px`);
      });
    };

    window.addEventListener("scroll", syncScroll, { passive: true });
    syncScroll();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", syncScroll);
    };
  }, []);

  useLayoutEffect(() => {
    const el = stampRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.round(rect.width * 1000) / 1000;
      const h = Math.round(rect.height * 1000) / 1000;
      if (w < 8 || h < 8) return;
      const { r, circles } = buildStampPerforationCircles(w, h, {
        rTarget: 8,
        rMin: 6,
        rMax: 10,
      });
      setGeom({ w, h, r, circles });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const maskStyle: CSSProperties | undefined =
    geom && geom.circles.length > 0
      ? {
          WebkitMask: `url(#${maskId})`,
          mask: `url(#${maskId})`,
        }
      : undefined;

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      id="intro"
      aria-labelledby="intro-heading"
      data-page-contrast={pageBgIsDark ? "dark" : "light"}
    >
      <div className={`${styles.left} ${styles.leftParallax}`}>
        {geom && geom.circles.length > 0 ? (
          <svg className={styles.maskDefs} width="0" height="0" aria-hidden>
            <defs>
              <mask
                id={maskId}
                maskUnits="userSpaceOnUse"
                maskContentUnits="userSpaceOnUse"
                x="0"
                y="0"
                width={geom.w}
                height={geom.h}
              >
                <rect width={geom.w} height={geom.h} fill="white" />
                {geom.circles.map((c, i) => (
                  <circle
                    key={i}
                    cx={c.cx}
                    cy={c.cy}
                    r={geom.r}
                    fill="black"
                  />
                ))}
              </mask>
            </defs>
          </svg>
        ) : null}
        <div
          className={`${styles.stampMotion}${stampEntered ? ` ${styles.stampMotionEntered}` : ""}`}
        >
          <div ref={stampRef} className={styles.stampClip} style={maskStyle}>
            <div className={styles.stampInner}>
              <div className={styles.portraitPanel}>
                <img
                  className={styles.portraitImg}
                  src={PORTRAIT_SRC}
                  alt="Michelle"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className={styles.stampFooter}>
                <p className={styles.stampValue}>26</p>
                <p className={styles.stampSub}>
                  DESIGN WITH HEART AND MIND
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.right} ${styles.rightParallax}`}>
        <div className={styles.copyBlock}>
          <h2 className={styles.headline} id="intro-heading">
            Hello from Chicago
          </h2>
          <div className={styles.paragraphGroup}>
            <p className={styles.body}>
              I help teams turn complex problems into scalable product
              experiences—from shaping and shipping new features to driving
              adoption and awareness.
            </p>
            <p className={styles.body}>
              Currently helping teams do their best work on{" "}
              <a
                href="https://www.loom.com"
                className={styles.inlineLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Loom
              </a>{" "}
              at Atlassian.
            </p>
          </div>
          <a
            className={styles.cta}
            href="https://www.linkedin.com/in/michelleovalle/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Let&apos;s connect
            <span className={styles.ctaArrow} aria-hidden>
              ↗
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
