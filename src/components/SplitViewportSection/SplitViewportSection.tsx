import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { buildStampPerforationCircles } from "../Stamp/stampPerforationMask";
import styles from "./SplitViewportSection.module.css";

const FAMILY_PORTRAIT_SRC =
  "/imgs/" + encodeURIComponent("My lovely family.JPEG");

/** Matches StampBalanceSection intro stamp enter delay. */
const STAMP_ENTER_DELAY_MS = 320;

type MaskGeom = {
  w: number;
  h: number;
  r: number;
  circles: { cx: number; cy: number }[];
};

const TIERS = [
  {
    id: "life",
    label: "Life",
    bg: "#ffd2ec",
    body: "From El Paso to Sydney and Shanghai, I've lived in 3 countries and 6 cities. Each place has shaped how I see, connect and create.",
  },
  {
    id: "craft",
    label: "Craft",
    bg: "#fff3b8",
    body: "I love disconnecting from the computer and crafting with my hands. Linocutting is currently my hobby of choice and reminds me to embrace imperfection.",
  },
  {
    id: "mind",
    label: "Mind",
    bg: "#bfe8fa",
    body: "When I'm not designing you'll find me aspiring to be a yogi, wandering my city, reading or planning our next adventure.",
  },
] as const;

export function SplitViewportSection() {
  const maskId = useId().replace(/:/g, "");
  const stampRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const rightViewportRef = useRef<HTMLDivElement>(null);
  const rightStackRef = useRef<HTMLDivElement>(null);
  const [geom, setGeom] = useState<MaskGeom | null>(null);
  const [stampEntered, setStampEntered] = useState(false);
  const stampEnterTriggeredRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let delayTimer: number | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || stampEnterTriggeredRef.current) {
          return;
        }
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
      if (delayTimer !== undefined) {
        window.clearTimeout(delayTimer);
      }
    };
  }, []);

  useLayoutEffect(() => {
    const el = stampRef.current;
    if (!el) {
      return;
    }

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.round(rect.width * 1000) / 1000;
      const h = Math.round(rect.height * 1000) / 1000;
      if (w < 8 || h < 8) {
        return;
      }
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
    return () => {
      ro.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const viewport = rightViewportRef.current;
    const stack = rightStackRef.current;
    if (!section || !viewport || !stack) {
      return;
    }

    const updateTierShift = () => {
      const vh = window.innerHeight;
      const docTop = section.getBoundingClientRect().top + window.scrollY;
      const sectionH = section.offsetHeight;
      const span = sectionH - vh;
      let t = span > 0 ? (window.scrollY - docTop) / span : 0;
      t = Math.max(0, Math.min(1, t));

      const viewH = viewport.clientHeight;
      const maxShift = Math.max(0, TIERS.length - 1) * viewH;
      const shift = t * maxShift;
      stack.style.transform = `translateY(${-shift}px)`;
    };

    window.addEventListener("scroll", updateTierShift, { passive: true });
    window.addEventListener("resize", updateTierShift);
    const ro = new ResizeObserver(updateTierShift);
    ro.observe(section);
    ro.observe(viewport);
    updateTierShift();

    return () => {
      window.removeEventListener("scroll", updateTierShift);
      window.removeEventListener("resize", updateTierShift);
      ro.disconnect();
    };
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
      id="contact"
      className={styles.section}
      aria-label="Life, craft, and mind"
    >
      <div className={styles.sectionSticky}>
        <div className={styles.sectionMain}>
          <div className={styles.left}>
            <div className={styles.paintPanel}>
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
              <div className={styles.contactStampParallax}>
                <div
                  className={`${styles.contactStampMotion}${stampEntered ? ` ${styles.contactStampMotionEntered}` : ""}`}
                >
                  <div
                    ref={stampRef}
                    className={styles.contactStampClip}
                    style={maskStyle}
                  >
                    <div className={styles.contactStampInner}>
                      <div className={styles.contactPortraitPanel}>
                        <img
                          className={styles.contactPortraitImg}
                          src={FAMILY_PORTRAIT_SRC}
                          alt="My lovely family"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className={styles.contactStampFooter}>
                        <p className={styles.contactStampValue}>03</p>
                        <p className={styles.contactStampSub}>
                          LIFE WITH HEART AND MIND
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div
              ref={rightViewportRef}
              className={styles.rightViewport}
              aria-label="Life, Craft, and Mind — follows page scroll"
            >
              <div ref={rightStackRef} className={styles.rightStack}>
                {TIERS.map((tier, index) => (
                  <article
                    key={tier.id}
                    className={styles.snapPanel}
                    style={{ backgroundColor: tier.bg }}
                    aria-labelledby={`tier-heading-${tier.id}`}
                  >
                    <header className={styles.panelHeader}>
                      <span className={styles.panelHeaderLabel}>{tier.label}</span>
                      <span className={styles.panelHeaderIndex}>
                        {`${String(index + 1).padStart(2, "0")}/${String(TIERS.length).padStart(2, "0")}`}
                      </span>
                    </header>
                    <div className={styles.panelBody}>
                      <h3
                        className={styles.tierTitle}
                        id={`tier-heading-${tier.id}`}
                      >
                        {tier.label}
                      </h3>
                      <p className={styles.tierBody}>{tier.body}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
