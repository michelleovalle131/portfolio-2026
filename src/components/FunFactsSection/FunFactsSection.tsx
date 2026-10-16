import { useCallback, useEffect, useRef, useState } from "react";
import FUN_FACTS_URLS from "virtual:fun-facts-imgs";
import styles from "./FunFactsSection.module.css";
import { InkText } from "../InkText/InkText";

type Photo = { src: string; caption: string };

const SLIDES: { id: string; label: string; print: Photo; color: Photo; body: string }[] = [
  {
    id: "life",
    label: "A life with heart",
    print: { src: "/imgs/fun-facts/Sister cities copy.jpeg", caption: "Hometown love" },
    color: { src: "/imgs/fun-facts/My lovely family.JPEG", caption: "My little family" },
    body: "From El Paso to Sydney to Shanghai, I've called three countries and six cities home. Each place has shaped how I see, connect, and create. Today, my husband, our sweet dog Abu, and I call Chicago home — my favorite city yet.",
  },
  {
    id: "craft",
    label: "A life of craft",
    print: { src: "/imgs/paint-1.jpg", caption: "Mixing colors" },
    color: { src: "/imgs/fun-facts/Linocut love.png", caption: "Linocut love" },
    body: "I love stepping away from the screen to make things with my hands. Linocutting is my hobby of choice right now, and it's taught me to embrace imperfection.",
  },
  {
    id: "mind",
    label: "A life of calm",
    print: { src: "/imgs/fun-facts/IMG_0303.jpg", caption: "Looking up" },
    color: { src: "/imgs/fun-facts/New Zealand.jpeg", caption: "Sketching New Zealand" },
    body: "When I'm not designing, you'll find me on a yoga mat, wandering my city, reading a physical book, or planning our next adventure.",
  },
];

const SLIDE_COUNT = SLIDES.length;
const AUTO_ADVANCE_MS = 6000;

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

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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

function PauseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" fill="currentColor" />
      <rect x="14" y="5" width="4" height="14" fill="currentColor" />
    </svg>
  );
}

/* Material "play_arrow" (filled), as in the Figma frame */
function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 5v14l11-7L8 5Z" fill="currentColor" />
    </svg>
  );
}

/** Desktop only: the slides ride a horizontal strip. Phones keep the
 * crossfading slideshow. */
function useWideStrip(requested: boolean) {
  const query = "(min-width: 901px)";
  const [wide, setWide] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setWide(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return requested && wide;
}

const MARQUEE_PX_PER_S = 50;
const GLIDE_MS = 700;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

type FunFactsSectionProps = {
  /** Desktop: the slides drift sideways as a continuous marquee (with
   * controls) and the section parks briefly so the footer can slide over it. */
  scrollStrip?: boolean;
};

export function FunFactsSection({ scrollStrip = false }: FunFactsSectionProps) {
  const strip = useWideStrip(scrollStrip);
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  // Bumped on every manual step so the auto-advance timer restarts from zero.
  const [stepEpoch, setStepEpoch] = useState(0);

  const step = useCallback((direction: 1 | -1) => {
    setActive((i) => (i + direction + SLIDE_COUNT) % SLIDE_COUNT);
    setStepEpoch((n) => n + 1);
  }, []);

  useEffect(() => {
    if (isPaused || strip) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % SLIDE_COUNT),
      AUTO_ADVANCE_MS,
    );
    return () => window.clearInterval(id);
  }, [isPaused, stepEpoch, strip]);

  // Strip marquee: the spreads drift right-to-left continuously and loop.
  // Two copies of the set are rendered so the wrap is seamless. The arrows
  // glide the strip by one spread, then the drift carries on.
  const trackRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0); // px travelled into the current set
  const glide = useRef<{ from: number; to: number; start: number } | null>(null);
  const pausedRef = useRef(isPaused);
  pausedRef.current = isPaused;

  useEffect(() => {
    const track = trackRef.current;
    if (!strip || !track) return;
    let raf = 0;
    let last = performance.now();
    const spreadStep = () => {
      const first = track.children[0] as HTMLElement | undefined;
      const second = track.children[1] as HTMLElement | undefined;
      return first && second ? second.offsetLeft - first.offsetLeft : 0;
    };
    const frame = (now: number) => {
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      const stepPx = spreadStep();
      const setWidth = stepPx * SLIDE_COUNT;
      if (setWidth > 0) {
        const g = glide.current;
        if (g) {
          const t = Math.min(1, (now - g.start) / GLIDE_MS);
          offset.current = g.from + (g.to - g.from) * easeInOut(t);
          if (t === 1) glide.current = null;
        } else if (!pausedRef.current) {
          offset.current += MARQUEE_PX_PER_S * dt;
        }
        offset.current = ((offset.current % setWidth) + setWidth) % setWidth;
        track.style.transform = `translateX(${-offset.current}px)`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [strip]);

  const marqueeStep = (direction: 1 | -1) => {
    const track = trackRef.current;
    const first = track?.children[0] as HTMLElement | undefined;
    const second = track?.children[1] as HTMLElement | undefined;
    if (!first || !second) return;
    const stepPx = second.offsetLeft - first.offsetLeft;
    // Land on the next/previous spread edge
    const base = direction === 1
      ? (Math.floor(offset.current / stepPx) + 1) * stepPx
      : (Math.ceil(offset.current / stepPx) - 1) * stepPx;
    glide.current = { from: offset.current, to: base, start: performance.now() };
  };

  const slideClass = (index: number, base: string) =>
    [base, index === active ? styles.isActive : ""].filter(Boolean).join(" ");

  const controls = (onStep: (direction: 1 | -1) => void) => (
    <div className={styles.controls} data-ink="stamp">
      <button
        type="button"
        className={styles.control}
        onClick={() => onStep(-1)}
        aria-label="Previous"
      >
        <ChevronIcon direction="left" />
      </button>
      <button
        type="button"
        className={styles.control}
        onClick={() => setIsPaused((prev) => !prev)}
        aria-label={isPaused ? "Play" : "Pause"}
        aria-pressed={isPaused}
      >
        {isPaused ? <PlayIcon /> : <PauseIcon />}
      </button>
      <button
        type="button"
        className={styles.control}
        onClick={() => onStep(1)}
        aria-label="Next"
      >
        <ChevronIcon direction="right" />
      </button>
    </div>
  );

  const masthead = (
    <>
      <p className={styles.pageNumber} aria-hidden data-ink="pen">
        03/03
      </p>

      <h2 className={styles.headline} id="fun-facts-heading">
        <InkText>
          {"When I’m not designing for screens, you’ll find me making things, exploring new places, and getting grounded again."}
        </InkText>
      </h2>
    </>
  );

  if (strip) {
    // The masthead stays put while the spreads drift by as a marquee. The
    // section parks briefly at the end so the footer can slide over it.
    return (
      <div className={styles.pin} data-ink-pin>
        <section
          className={styles.section}
          id="beyond-the-screen"
          aria-labelledby="fun-facts-heading"
          aria-roledescription="carousel"
        >
          <div className={`editorialGrid ${styles.grid}`}>
            {masthead}
            <div className={styles.strip} data-ink="stamp">
              <div className={styles.stripTrack} ref={trackRef}>
                {[...SLIDES, ...SLIDES].map((slide, i) => (
                  <div
                    key={`${slide.id}-${i}`}
                    className={styles.spread}
                    aria-hidden={i >= SLIDE_COUNT}
                  >
                    <div className={`${styles.photo} ${styles.photoPrint}`}>
                      <img
                        className={`${styles.photoImg} ${styles.isActive}`}
                        src={resolveImageSrc(slide.print.src)}
                        alt={slide.print.caption}
                        decoding="async"
                        draggable={false}
                      />
                    </div>
                    <div className={`${styles.photo} ${styles.photoColor}`}>
                      <img
                        className={`${styles.photoImg} ${styles.isActive}`}
                        src={resolveImageSrc(slide.color.src)}
                        alt={slide.color.caption}
                        decoding="async"
                        draggable={false}
                      />
                    </div>
                    <p className={`${styles.bodyText} ${styles.isActive} ${styles.spreadBody}`}>
                      {slide.body}
                    </p>
                    <div className={`${styles.caption} ${styles.captionPrint}`} aria-hidden>
                      <span className={`${styles.captionText} ${styles.isActive}`}>
                        {slide.print.caption}
                      </span>
                    </div>
                    <div className={`${styles.caption} ${styles.captionColor}`} aria-hidden>
                      <span className={`${styles.captionText} ${styles.isActive}`}>
                        {slide.color.caption}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {controls(marqueeStep)}
          </div>
        </section>
      </div>
    );
  }

  return (
    <section
      className={styles.section}
      id="beyond-the-screen"
      aria-labelledby="fun-facts-heading"
      aria-roledescription="carousel"
    >
      <div className={`editorialGrid ${styles.grid}`}>
        {masthead}

        <div className={`${styles.photo} ${styles.photoPrint}`}>
          {SLIDES.map((slide, i) => (
            <img
              key={slide.id}
              className={slideClass(i, styles.photoImg)}
              src={resolveImageSrc(slide.print.src)}
              alt={i === active ? slide.print.caption : ""}
              aria-hidden={i !== active}
              decoding="async"
              draggable={false}
            />
          ))}
        </div>

        <div className={`${styles.photo} ${styles.photoColor}`}>
          {SLIDES.map((slide, i) => (
            <img
              key={slide.id}
              className={slideClass(i, styles.photoImg)}
              src={resolveImageSrc(slide.color.src)}
              alt={i === active ? slide.color.caption : ""}
              aria-hidden={i !== active}
              decoding="async"
              draggable={false}
            />
          ))}
        </div>

        <div
          className={styles.body}
          aria-live={isPaused ? "polite" : "off"}
          data-ink="stamp"
        >
          {SLIDES.map((slide, i) => (
            <p
              key={slide.id}
              className={slideClass(i, styles.bodyText)}
              aria-hidden={i !== active}
            >
              {slide.body}
            </p>
          ))}
        </div>

        <div className={`${styles.caption} ${styles.captionPrint}`} aria-hidden>
          {SLIDES.map((slide, i) => (
            <span key={slide.id} className={slideClass(i, styles.captionText)}>
              {slide.print.caption}
            </span>
          ))}
        </div>
        <div className={`${styles.caption} ${styles.captionColor}`} aria-hidden>
          {SLIDES.map((slide, i) => (
            <span key={slide.id} className={slideClass(i, styles.captionText)}>
              {slide.color.caption}
            </span>
          ))}
        </div>

        {controls(step)}
      </div>
    </section>
  );
}
