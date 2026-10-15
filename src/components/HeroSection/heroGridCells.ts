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

export const HERO_IMAGE_CELL_INDICES = HERO_GRID_CELLS.map((cell, index) =>
  cell.imageSrc ? index : -1,
).filter((index) => index >= 0);
