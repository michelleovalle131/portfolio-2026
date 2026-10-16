export type HeroGridCell = {
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
  /** Local path under /public — omitted for empty plate cells */
  imageSrc?: string;
  /** Extra multiply on the photo layer (Figma uses this on some cells) */
  photoMultiply?: boolean;
};

/** Static layout from Figma node 249:1547; image paths are exported hero-grid assets.
 * Keep cells in row-major order — labels are numbered 01, 02… from array position. */
export const HERO_GRID_CELLS: HeroGridCell[] = [
  {
    col: 9,
    row: 4,
    colSpan: 2,
    rowSpan: 3,
    imageSrc: "/imgs/hero-grid/ccf64.png",
  },
  {
    col: 11,
    row: 4,
    colSpan: 2,
    rowSpan: 3,
    imageSrc: "/imgs/hero-grid/602b6.png",
  },
  {
    col: 13,
    row: 4,
    colSpan: 2,
    rowSpan: 3,
  },
  {
    col: 15,
    row: 4,
    colSpan: 2,
    rowSpan: 3,
  },
  {
    col: 9,
    row: 8,
    colSpan: 2,
    rowSpan: 3,
  },
  {
    col: 11,
    row: 8,
    colSpan: 2,
    rowSpan: 3,
    imageSrc: "/imgs/hero-grid/59729.png",
    photoMultiply: true,
  },
  {
    col: 13,
    row: 8,
    colSpan: 2,
    rowSpan: 3,
  },
  {
    col: 15,
    row: 8,
    colSpan: 2,
    rowSpan: 3,
    imageSrc: "/imgs/hero-grid/0c2de.png",
  },
  {
    col: 9,
    row: 12,
    colSpan: 2,
    rowSpan: 3,
    imageSrc: "/imgs/hero-grid/1a035.png",
  },
  {
    col: 11,
    row: 12,
    colSpan: 2,
    rowSpan: 3,
  },
  {
    col: 13,
    row: 12,
    colSpan: 2,
    rowSpan: 3,
    imageSrc: "/imgs/hero-grid/add46.png",
  },
  {
    col: 15,
    row: 12,
    colSpan: 2,
    rowSpan: 3,
    imageSrc: "/imgs/hero-grid/e0394.png",
  },
];

/** 3×3 alternative: positions are within the gallery's own 3-column grid
 * (see .gallery3x3), not the 16-column page grid. Every cell shows a photo;
 * the photos themselves are shuffled from the hero pool on load. */
export const HERO_GRID_CELLS_3X3: HeroGridCell[] = [
  {
    col: 1,
    row: 1,
    colSpan: 1,
    rowSpan: 1,
    imageSrc: "/imgs/hero-grid/ccf64.png",
  },
  {
    col: 2,
    row: 1,
    colSpan: 1,
    rowSpan: 1,
    imageSrc: "/imgs/hero-grid/602b6.png",
  },
  {
    col: 3,
    row: 1,
    colSpan: 1,
    rowSpan: 1,
    imageSrc: "/imgs/hero-grid/e0394.png",
  },
  {
    col: 1,
    row: 2,
    colSpan: 1,
    rowSpan: 1,
    imageSrc: "/imgs/hero-grid/602b6.png",
  },
  {
    col: 2,
    row: 2,
    colSpan: 1,
    rowSpan: 1,
    imageSrc: "/imgs/hero-grid/59729.png",
    photoMultiply: true,
  },
  {
    col: 3,
    row: 2,
    colSpan: 1,
    rowSpan: 1,
    imageSrc: "/imgs/hero-grid/0c2de.png",
  },
  {
    col: 1,
    row: 3,
    colSpan: 1,
    rowSpan: 1,
    imageSrc: "/imgs/hero-grid/1a035.png",
  },
  {
    col: 2,
    row: 3,
    colSpan: 1,
    rowSpan: 1,
    imageSrc: "/imgs/hero-grid/59729.png",
  },
  {
    col: 3,
    row: 3,
    colSpan: 1,
    rowSpan: 1,
    imageSrc: "/imgs/hero-grid/add46.png",
  },
];

export const HERO_IMAGE_CELL_INDICES = HERO_GRID_CELLS.map((cell, index) =>
  cell.imageSrc ? index : -1,
).filter((index) => index >= 0);
