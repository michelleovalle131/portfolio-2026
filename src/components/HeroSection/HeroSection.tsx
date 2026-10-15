import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { HERO_GRID_CELLS, type HeroGridCell } from "./heroGridCells";
import { STAMP_IMAGE_URLS } from "./stampImagePool";
import styles from "./HeroSection.module.css";

function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
}

function cellsWithShuffledPhotos(urls: string[]): HeroGridCell[] {
  const shuffled = [...urls];
  shuffleInPlace(shuffled);
  let photoIndex = 0;
  return HERO_GRID_CELLS.map((cell) => {
    if (!cell.imageSrc) return cell;
    const next = shuffled[photoIndex % shuffled.length] ?? cell.imageSrc;
    photoIndex += 1;
    return { ...cell, imageSrc: next };
  });
}

type HeroProps = {
  /** Reshuffles grid photos (keeps layout slots). */
  remixEpoch?: number;
};

export function HeroSection({ remixEpoch = 0 }: HeroProps) {
  const [cells, setCells] = useState(() =>
    cellsWithShuffledPhotos(STAMP_IMAGE_URLS),
  );

  useEffect(() => {
    if (remixEpoch === 0) return;
    setCells(cellsWithShuffledPhotos(STAMP_IMAGE_URLS));
  }, [remixEpoch]);

  const gridCellStyles = useMemo(
    () =>
      cells.map((cell) => ({
        gridColumn: `${cell.col} / span ${cell.colSpan}`,
        gridRow: `${cell.row} / span ${cell.rowSpan}`,
      })),
    [cells],
  );

  return (
    <section id="home" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.neutralPanel} aria-hidden />

      <div className={`editorialGrid ${styles.grid}`}>
        <p className={styles.name}>michelle ovalle</p>

        <div className={styles.utilCardstock}>
          <img
            className={styles.utilIcon}
            src="/imgs/hero-grid/64ed1.svg"
            alt=""
            width={24}
            height={24}
            decoding="async"
          />
          <span>cardstock</span>
        </div>

        <div className={styles.utilLight}>
          <img
            className={styles.utilIcon}
            src="/imgs/hero-grid/b37d3.svg"
            alt=""
            width={24}
            height={24}
            decoding="async"
          />
          <span>light mode</span>
        </div>

        <NavLink className={styles.aboutLink} to="/about">
          about
        </NavLink>

        <h1 id="hero-title" className={styles.headline}>
          Shaping and shipping delightful products, one thoughtfully crafted
          decision at a time.
        </h1>

        {cells.map((cell, index) => (
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
        ))}

        <div className={styles.tagline} aria-hidden>
          <span>design</span>
          <span>with</span>
          <span>heart</span>
          <span>and</span>
          <span>mind</span>
        </div>

        <p className={styles.role}>Sr product designer</p>
      </div>
    </section>
  );
}
