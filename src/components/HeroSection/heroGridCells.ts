export type HeroGridCell = {
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
  /** Local path under /public — omitted for empty plate cells */
  imageSrc?: string;
  /** Pure negative space: no frame, no photo, no number */
  blank?: boolean;
};

/** The hero gallery: positions are within the gallery's own 3-column grid
 * (see .gallery3x3), not the 16-column page grid. Three cells are left as
 * negative space so the photos step down the grid; the photos themselves are
 * shuffled from the hero pool on load. */
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
    blank: true,
  },
  {
    col: 1,
    row: 2,
    colSpan: 1,
    rowSpan: 1,
    blank: true,
  },
  {
    col: 2,
    row: 2,
    colSpan: 1,
    rowSpan: 1,
    imageSrc: "/imgs/hero-grid/59729.png",
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
    blank: true,
  },
];
