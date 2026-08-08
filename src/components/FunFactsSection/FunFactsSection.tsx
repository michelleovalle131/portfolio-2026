import { useEffect, useLayoutEffect, useMemo, useRef, type CSSProperties } from "react";
import FUN_FACTS_URLS from "virtual:fun-facts-imgs";
import styles from "./FunFactsSection.module.css";

const TIERS = [
  {
    id: "life",
    label: "A life with heart",
    panelSurface: "var(--surface-warm)",
    imageSrc: "/imgs/fun-facts/My lovely family.JPEG",
    panelImageSrc: "/imgs/fun-facts/Sister cities copy.jpeg",
    body: "From El Paso to Sydney to Shanghai, I've called three countries and six cities home. Each place has shaped how I see, connect, and create. Today, my husband, our sweet dog Abu, and I call Chicago home — my favorite city yet.",
  },
  {
    id: "craft",
    label: "A life of craft",
    panelSurface: "var(--surface-blush)",
    imageSrc: "/imgs/paint-1.jpg",
    panelImageSrc: "/imgs/fun-facts/Linocut love.png",
    body: "I love stepping away from the screen to make things with my hands. Linocutting is my hobby of choice right now, and it's taught me to embrace imperfection.",
  },
  {
    id: "mind",
    label: "A life of calm",
    panelSurface: "var(--surface-blue)",
    imageSrc: "/imgs/fun-facts/IMG_0303.jpg",
    panelImageSrc: "/imgs/fun-facts/New Zealand.jpeg",
    body: "When I'm not designing, you'll find me on a yoga mat, wandering my city, reading a physical book, or planning our next adventure.",
  },
] as const;

const TIER_COUNT = TIERS.length;
const TIER_NUMBERS: Record<string, string> = Object.fromEntries(
  TIERS.map((tier, i) => [
    tier.id,
    `${String(i + 1).padStart(2, "0")}/${String(TIER_COUNT).padStart(2, "0")}`,
  ]),
);

function resolveImageSrc(preferredSrc: string): string {
  const filename = preferredSrc.split("/").pop() ?? preferredSrc;
  let decodedFilename = filename;
  try {
    decodedFilename = decodeURIComponent(filename);
  } catch {
    /* keep encoded */
  }

  const fromPool = FUN_FACTS_URLS.find((url) => {
    const poolFile = url.split("/").pop() ?? "";
    try {
      return decodeURIComponent(poolFile) === decodedFilename;
    } catch {
      return poolFile === filename;
    }
  });

  return fromPool ?? preferredSrc;
}

type StripItem =
  | { kind: "text"; key: string; tier: (typeof TIERS)[number] }
  | { kind: "photo"; key: string; src: string; alt: string };

// Duplicated copies of the base sequence rendered side by side so the strip can
// be recentered mid-scroll (see the rAF loop below) without ever running out of
// tiles to show, in either scroll direction.
const REPEAT = 4;
const MIDDLE_SET_INDEX = 1;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d={direction === "left" ? "M10 3L5 8L10 13" : "M6 3L11 8L6 13"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FunFactsSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const manualScrollRef = useRef(false);
  const resumeTimeoutRef = useRef<number | undefined>(undefined);

  const baseItems = useMemo<StripItem[]>(
    () =>
      TIERS.flatMap((tier) => [
        {
          kind: "photo",
          key: `${tier.id}-a`,
          src: resolveImageSrc(tier.imageSrc),
          alt: tier.label,
        },
        { kind: "text", key: `${tier.id}-text`, tier },
        {
          kind: "photo",
          key: `${tier.id}-b`,
          src: resolveImageSrc(tier.panelImageSrc),
          alt: tier.label,
        },
      ]),
    [],
  );

  const loopItems = useMemo(
    () =>
      Array.from({ length: REPEAT }, (_, setIndex) =>
        baseItems.map((item) => ({ ...item, key: `${item.key}-set${setIndex}` })),
      ).flat(),
    [baseItems],
  );

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) {
      return;
    }
    const singleSetWidth = wrap.scrollWidth / REPEAT;
    wrap.scrollLeft = MIDDLE_SET_INDEX * singleSetWidth;
  }, [loopItems.length]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const SPEED = 0.4;
    let rafId: number;

    const step = () => {
      // While an arrow-triggered glide is in flight, leave scrollLeft alone —
      // both the auto-scroll increment and the set-recentering below would
      // otherwise fight the manual animation's own frame-by-frame writes.
      if (!manualScrollRef.current) {
        if (!pausedRef.current) {
          wrap.scrollLeft += SPEED;
        }
        const singleSetWidth = wrap.scrollWidth / REPEAT;
        if (singleSetWidth > 0) {
          const setIndex = Math.floor(wrap.scrollLeft / singleSetWidth);
          if (setIndex !== MIDDLE_SET_INDEX) {
            wrap.scrollLeft += (MIDDLE_SET_INDEX - setIndex) * singleSetWidth;
          }
        }
      }
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);

    const pause = () => {
      pausedRef.current = true;
    };
    const resume = () => {
      pausedRef.current = false;
    };
    wrap.addEventListener("pointerenter", pause);
    wrap.addEventListener("pointerleave", resume);

    return () => {
      cancelAnimationFrame(rafId);
      wrap.removeEventListener("pointerenter", pause);
      wrap.removeEventListener("pointerleave", resume);
    };
  }, []);

  const scrollByOneTile = (direction: 1 | -1) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const firstTile = wrap.firstElementChild as HTMLElement | null;
    const tileWidth = firstTile?.getBoundingClientRect().width ?? wrap.clientWidth / 3;
    if (!tileWidth) return;

    pausedRef.current = true;
    manualScrollRef.current = true;

    const startScrollLeft = wrap.scrollLeft;
    const distance = direction * tileWidth;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reducedMotion ? 0 : 500;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = duration > 0 ? Math.min(1, elapsed / duration) : 1;
      wrap.scrollLeft = startScrollLeft + distance * easeInOutCubic(t);
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        manualScrollRef.current = false;
      }
    };
    requestAnimationFrame(tick);

    window.clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = window.setTimeout(() => {
      pausedRef.current = false;
    }, 1800);
  };

  return (
    <>
      <div className={styles.sectionIntro}>
        <p className={styles.introEyebrow}>Life with heart and mind</p>
        <h2 className={styles.introHeading}>Me beyond the screen</h2>
      </div>

      <section className={styles.section} aria-label="Life, craft, and mind">
        <ul className={styles.srTierList}>
          {TIERS.map((tier) => (
            <li key={tier.id}>
              <strong>{tier.label}.</strong> {tier.body}
            </li>
          ))}
        </ul>

        <div ref={wrapRef} className={styles.marqueeWrap} aria-hidden="true">
          {loopItems.map((item) =>
            item.kind === "photo" ? (
              <div key={item.key} className={styles.marqueePhoto} aria-hidden="true">
                <img src={item.src} alt="" draggable={false} decoding="async" />
              </div>
            ) : (
              <article
                key={item.key}
                className={styles.marqueeText}
                style={{ "--plate-bg": item.tier.panelSurface } as CSSProperties}
                aria-hidden="true"
              >
                <p className={styles.tierKicker}>{TIER_NUMBERS[item.tier.id]}</p>
                <h3 className={styles.tierTitle}>{item.tier.label}</h3>
                <p className={styles.tierBody}>{item.tier.body}</p>
              </article>
            ),
          )}
        </div>

        <button
          type="button"
          className={[styles.navArrow, styles.navArrowLeft].join(" ")}
          onClick={() => scrollByOneTile(-1)}
          aria-label="Scroll left"
        >
          <ChevronIcon direction="left" />
        </button>
        <button
          type="button"
          className={[styles.navArrow, styles.navArrowRight].join(" ")}
          onClick={() => scrollByOneTile(1)}
          aria-label="Scroll right"
        >
          <ChevronIcon direction="right" />
        </button>
      </section>
    </>
  );
}
