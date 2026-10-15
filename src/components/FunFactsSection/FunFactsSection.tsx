import { useCallback, useEffect, useState } from "react";
import FUN_FACTS_URLS from "virtual:fun-facts-imgs";
import styles from "./FunFactsSection.module.css";

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

export function FunFactsSection() {
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
    if (isPaused) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % SLIDE_COUNT),
      AUTO_ADVANCE_MS,
    );
    return () => window.clearInterval(id);
  }, [isPaused, stepEpoch]);

  const slideClass = (index: number, base: string) =>
    [base, index === active ? styles.isActive : ""].filter(Boolean).join(" ");

  return (
    <section
      className={styles.section}
      id="beyond-the-screen"
      aria-labelledby="fun-facts-heading"
      aria-roledescription="carousel"
    >
      <div className={`editorialGrid ${styles.grid}`}>
        <p className={styles.pageNumber} aria-hidden>
          03/03
        </p>
        <p className={styles.label}>Life beyond the screen</p>

        <h2 className={styles.headline} id="fun-facts-heading">
          When I&rsquo;m not designing for screens, you&rsquo;ll find me making
          things, exploring new places, and getting grounded again.
        </h2>

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

        <div className={styles.body} aria-live={isPaused ? "polite" : "off"}>
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

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.control}
            onClick={() => step(-1)}
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
            onClick={() => step(1)}
            aria-label="Next"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>
    </section>
  );
}
