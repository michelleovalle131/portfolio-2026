import { useEffect, useMemo, useRef, useState } from "react";
import {
  HERO_GRID_CELLS,
  HERO_GRID_CELLS_3X3,
  type HeroGridCell,
} from "./heroGridCells";
import { STAMP_IMAGE_URLS } from "./stampImagePool";
import styles from "./HeroSection.module.css";
import { InkText } from "../InkText/InkText";
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
    return base.map((cell, i) => {
      const { photoMultiply: _unused, ...rest } = cell;
      return filled.has(i)
        ? { ...rest, blank: false, imageSrc: cell.imageSrc ?? "placeholder" }
        : { ...rest, blank: true, imageSrc: undefined };
    });
  }
}

type HeroProps = {
  /** Reshuffles the gallery (photos, and in 3×3 which cells are filled). */
  remixEpoch?: number;
  /** "4x3": 12 cells on the page grid (Figma). "3x3": 9 larger cells in the same area. */
  gallery?: "4x3" | "3x3";
};

export function HeroSection({ remixEpoch = 0, gallery = "4x3" }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const layout = gallery === "3x3" ? HERO_GRID_CELLS_3X3 : HERO_GRID_CELLS;
  // 3×3: the original composition on a visitor's first load (per browser
  // session), then a new arrangement of filled and empty cells each load after
  const arrange = (firstLoad = false) =>
    cellsWithShuffledPhotos(
      gallery === "3x3" && !firstLoad ? randomGalleryPattern(layout) : layout,
      STAMP_IMAGE_URLS,
    );
  const [cells, setCells] = useState(() => arrange(FIRST_LOAD_THIS_SESSION));

  useEffect(() => {
    if (remixEpoch === 0) return;
    setCells(arrange());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remixEpoch, layout]);

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
      key={`hero-cell-${index}`}
      className={styles.imageCell}
      style={gridCellStyles[index]}
    >
      <div className={styles.printFrame}>
        {cell.imageSrc ? (
          <img
            className={[
              styles.printPhoto,
              cell.photoMultiply ? styles.printPhotoMultiply : "",
            ]
              .filter(Boolean)
              .join(" ")}
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
      className={[styles.hero, gallery === "3x3" ? styles.is3x3 : ""]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby="hero-title"
    >
      <div className={styles.neutralPanel} aria-hidden />

      <div className={`editorialGrid ${styles.grid}`}>
        <SiteHeader className={styles.siteHeader} />

        <LocalTime className={styles.localTime} />

        <h1 id="hero-title" className={styles.headline}>
          <InkText>
            {"Shaping and shipping delightful products, one thoughtfully crafted decision at a time."}
          </InkText>
        </h1>

        {gallery === "3x3" ? (
          <div className={styles.gallery3x3}>{galleryCells}</div>
        ) : (
          galleryCells
        )}

        <StampBadge areaRef={heroRef} className={styles.tagline} />

      </div>
    </section>
  );
}
