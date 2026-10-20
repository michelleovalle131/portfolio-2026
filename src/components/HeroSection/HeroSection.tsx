import { useMemo, useRef, useState, type CSSProperties } from "react";
import { HERO_GRID_CELLS_3X3, type HeroGridCell } from "./heroGridCells";
import { STAMP_IMAGE_URLS } from "./stampImagePool";
import styles from "./HeroSection.module.css";
import { LocalTime } from "../LocalTime/LocalTime";
import { StampBadge } from "./StampBadge";
import { SiteHeader } from "../SiteHeader/SiteHeader";

function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
}

function cellsWithShuffledPhotos(
  layout: HeroGridCell[],
  urls: string[],
): HeroGridCell[] {
  const shuffled = [...urls];
  shuffleInPlace(shuffled);
  let photoIndex = 0;
  return layout.map((cell) => {
    if (!cell.imageSrc) return cell;
    const next = shuffled[photoIndex % shuffled.length] ?? cell.imageSrc;
    photoIndex += 1;
    return { ...cell, imageSrc: next };
  });
}

const SEEN_KEY = "hero-gallery-seen";

/** True the first time this runs in a browser session (then remembers). */
function isFirstLoadThisSession(): boolean {
  try {
    if (window.sessionStorage.getItem(SEEN_KEY)) return false;
    window.sessionStorage.setItem(SEEN_KEY, "1");
    return true;
  } catch {
    return true; // storage unavailable: show the original composition
  }
}

// Read once per page load (not per render — dev mode renders twice)
const FIRST_LOAD_THIS_SESSION = isFirstLoadThisSession();

const MIN_PHOTOS = 4;
/** Fade-out before a reshuffled gallery prints in (matches .leaving in CSS) */
const LEAVE_MS = 220;
const MAX_PHOTOS = 6;

/**
 * A fresh 3×3 arrangement: 4–6 cells get a photo, the rest are left as
 * negative space. Every row keeps at least one photo — an empty row would
 * collapse and pull the gallery out of its frame — and so does every column,
 * so the gallery always reads across its full width.
 */
function randomGalleryPattern(base: HeroGridCell[]): HeroGridCell[] {
  const rows = [...new Set(base.map((c) => c.row))];
  const cols = [...new Set(base.map((c) => c.col))];
  const count = MIN_PHOTOS + Math.floor(Math.random() * (MAX_PHOTOS - MIN_PHOTOS + 1));
  for (;;) {
    const order = base.map((_, i) => i);
    shuffleInPlace(order);
    const filled = new Set(order.slice(0, count));
    const everyRowUsed = rows.every((row) =>
      base.some((c, i) => c.row === row && filled.has(i)),
    );
    const everyColUsed = cols.every((col) =>
      base.some((c, i) => c.col === col && filled.has(i)),
    );
    if (!everyRowUsed || !everyColUsed) continue;
    return base.map((cell, i) =>
      filled.has(i)
        ? { ...cell, blank: false, imageSrc: cell.imageSrc ?? "placeholder" }
        : { ...cell, blank: true, imageSrc: undefined },
    );
  }
}

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  // The original composition on a visitor's first load (per browser
  // session), then a new arrangement of filled and empty cells each load after
  const arrange = (firstLoad = false) =>
    cellsWithShuffledPhotos(
      firstLoad ? HERO_GRID_CELLS_3X3 : randomGalleryPattern(HERO_GRID_CELLS_3X3),
      STAMP_IMAGE_URLS,
    );
  const [cells, setCells] = useState(() => arrange(FIRST_LOAD_THIS_SESSION));

  // Reshuffle button: a new arrangement, as on a fresh load — never the same
  // pattern of filled cells twice in a row. The current prints lift away,
  // then the new ones print in one after another (once their images load).
  const [shuffleEpoch, setShuffleEpoch] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const pattern = (list: HeroGridCell[]) => list.map((c) => (c.blank ? 0 : 1)).join("");
  const remix = () => {
    if (leaving) return;
    let next = arrange();
    for (let i = 0; i < 10 && pattern(next) === pattern(cells); i++) next = arrange();

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setCells(next);
      return;
    }
    setLeaving(true);
    const wait = (ms: number) => new Promise((done) => window.setTimeout(done, ms));
    const loaded = Promise.all(
      next
        .filter((c) => !c.blank && c.imageSrc)
        .map(
          (c) =>
            new Promise<void>((done) => {
              const img = new Image();
              img.onload = img.onerror = () => done();
              img.src = c.imageSrc!;
            }),
        ),
    );
    // At least the fade-out; at most a short wait on slow images
    void Promise.all([wait(LEAVE_MS), Promise.race([loaded, wait(900)])]).then(() => {
      setCells(next);
      setShuffleEpoch((n) => n + 1);
      setLeaving(false);
    });
  };

  const gridCellStyles = useMemo(
    () =>
      cells.map((cell) => ({
        gridColumn: `${cell.col} / span ${cell.colSpan}`,
        gridRow: `${cell.row} / span ${cell.rowSpan}`,
      })),
    [cells],
  );

  // Photos are numbered 01, 02… in order, skipping blank cells
  const photoNumbers = cells.reduce<number[]>((acc, cell) => {
    acc.push(cell.blank ? 0 : (acc.filter(Boolean).length + 1));
    return acc;
  }, []);

  const galleryCells = cells.map((cell, index) => cell.blank ? null : (
    <div
      // A new key per reshuffle, so the new cells mount and print in
      key={`hero-cell-${shuffleEpoch}-${index}`}
      className={[styles.imageCell, shuffleEpoch > 0 ? styles.reprint : ""]
        .filter(Boolean)
        .join(" ")}
      style={{ ...gridCellStyles[index], "--order": photoNumbers[index]! - 1 } as CSSProperties}
    >
      <div className={styles.printFrame}>
        {cell.imageSrc ? (
          <img
            className={styles.printPhoto}
            src={cell.imageSrc}
            alt=""
            draggable={false}
          />
        ) : null}
      </div>
      <span className={styles.cellLabel}>
        {String(photoNumbers[index]).padStart(2, "0")}
      </span>
    </div>
  ));

  return (
    <section
      ref={heroRef}
      id="home"
      className={styles.hero}
      aria-labelledby="hero-title"
    >
      <div className={styles.neutralPanel} aria-hidden />

      <div className={`editorialGrid ${styles.grid}`}>
        <SiteHeader className={styles.siteHeader} />

        <LocalTime className={styles.localTime} />

        <h1 id="hero-title" className={styles.headline}>
          {"Shaping and shipping delightful products, one thoughtfully crafted decision at a time."}
        </h1>

        <div
          className={[styles.gallery3x3, leaving ? styles.leaving : ""]
            .filter(Boolean)
            .join(" ")}
        >
          {galleryCells}
        </div>

        <StampBadge areaRef={heroRef} className={styles.tagline} />

        <button type="button" className={`${styles.remix} link-ui`} onClick={remix}>
          Reshuffle
        </button>
      </div>
    </section>
  );
}
