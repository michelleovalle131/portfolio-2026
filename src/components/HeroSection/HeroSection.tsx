import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  HERO_GRID_CELLS,
  HERO_GRID_CELLS_3X3,
  type HeroGridCell,
} from "./heroGridCells";
import { STAMP_IMAGE_URLS } from "./stampImagePool";
import {
  CARDSTOCK_COLORS,
  applyCardstock,
  readCardstockIndex,
} from "../../styles/cardstock";
import styles from "./HeroSection.module.css";
import { InkText } from "../InkText/InkText";
import { LocalTime } from "../LocalTime/LocalTime";

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

type HeroProps = {
  /** Reshuffles grid photos (keeps layout slots). */
  remixEpoch?: number;
  /** "4x3": 12 cells on the page grid (Figma). "3x3": 9 larger cells in the same area. */
  gallery?: "4x3" | "3x3";
};

export function HeroSection({ remixEpoch = 0, gallery = "4x3" }: HeroProps) {
  const layout = gallery === "3x3" ? HERO_GRID_CELLS_3X3 : HERO_GRID_CELLS;
  const [cells, setCells] = useState(() =>
    cellsWithShuffledPhotos(layout, STAMP_IMAGE_URLS),
  );

  useEffect(() => {
    if (remixEpoch === 0) return;
    setCells(cellsWithShuffledPhotos(layout, STAMP_IMAGE_URLS));
  }, [remixEpoch, layout]);

  const [cardstockIndex, setCardstockIndex] = useState(readCardstockIndex);
  const nextCardstock = CARDSTOCK_COLORS[(cardstockIndex + 1) % CARDSTOCK_COLORS.length]!;
  const cycleCardstock = () =>
    setCardstockIndex((i) => (i + 1) % CARDSTOCK_COLORS.length);

  useEffect(() => {
    applyCardstock(cardstockIndex);
  }, [cardstockIndex]);

  const gridCellStyles = useMemo(
    () =>
      cells.map((cell) => ({
        gridColumn: `${cell.col} / span ${cell.colSpan}`,
        gridRow: `${cell.row} / span ${cell.rowSpan}`,
      })),
    [cells],
  );

  const galleryCells = cells.map((cell, index) => (
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
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  ));

  return (
    <section
      id="home"
      className={[styles.hero, gallery === "3x3" ? styles.is3x3 : ""]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby="hero-title"
    >
      <div className={styles.neutralPanel} aria-hidden />

      <div className={`editorialGrid ${styles.grid}`}>
        <p className={styles.name}>michelle ovalle</p>

        {/* Icon-only controls; their labels show as tooltips on hover/focus */}
        <div className={styles.utils}>
          <button
            type="button"
            className={`${styles.utilCardstock} ${styles.tip}`}
            onClick={cycleCardstock}
            data-tooltip={`Cardstock · ${CARDSTOCK_COLORS[cardstockIndex]!.name}`}
            aria-label={`Cardstock color: ${CARDSTOCK_COLORS[cardstockIndex]!.name}. Switch to ${nextCardstock.name}`}
          >
            <span className={styles.swatch} aria-hidden />
          </button>

          <span
            className={`${styles.utilLight} ${styles.tip}`}
            data-tooltip="Light mode"
            role="img"
            aria-label="Light mode"
          >
            <img
              className={styles.utilIcon}
              src="/imgs/hero-grid/b37d3.svg"
              alt=""
              width={20}
              height={20}
              decoding="async"
            />
          </span>
        </div>

        <NavLink className={styles.aboutLink} to="/about">
          about
        </NavLink>

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

        <div className={styles.tagline} aria-hidden data-ink="float">
          <span>design</span>
          <span>with</span>
          <span>heart</span>
          <span>and</span>
          <span>mind</span>
        </div>

        <LocalTime className={styles.role} />
      </div>
    </section>
  );
}
