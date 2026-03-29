import type { CSSProperties } from "react";

/** Grid resolution — tweak columns/rows in Hero.module.css to match. */
export const GRID_COLS = 12;
export const GRID_ROWS = 13;

/**
 * Each stamp sits in a rectangle of grid lines (1-based, end exclusive).
 * Adjust numbers here to move frames; use DevTools → Grid overlay to visualize.
 *
 * Tip: keep the middle columns (≈5–8) visually clear for the headline, or
 * place stamps only in edge bands.
 */
export const STAMP_PLACEMENT: Array<{
  colStart: number;
  colEnd: number;
  rowStart: number;
  rowEnd: number;
  justifySelf?: CSSProperties["justifySelf"];
  alignSelf?: CSSProperties["alignSelf"];
  transform?: string;
}> = [
  /* 0 Floral Street — top-left band */
  { colStart: 2, colEnd: 4, rowStart: 2, rowEnd: 4, justifySelf: "start", alignSelf: "start" },
  /* 1 Signature Stripe — mid-left, nudge “off” the edge */
  {
    colStart: 1,
    colEnd: 3,
    rowStart: 5,
    rowEnd: 7,
    justifySelf: "start",
    alignSelf: "center",
    transform: "translateX(-35%)",
  },
  /* 2 Kings Cross — lower-left block */
  { colStart: 4, colEnd: 6, rowStart: 9, rowEnd: 11, justifySelf: "start", alignSelf: "center" },
  /* 3 Made to Measure — top-right */
  { colStart: 10, colEnd: 12, rowStart: 1, rowEnd: 3, justifySelf: "end", alignSelf: "start" },
  /* 4 Los Angeles — beside KC cluster, left */
  { colStart: 2, colEnd: 4, rowStart: 8, rowEnd: 10, justifySelf: "start", alignSelf: "center" },
  /* 5 Willoughby — mid-right, cropped toward edge */
  {
    colStart: 11,
    colEnd: 13,
    rowStart: 8,
    rowEnd: 10,
    justifySelf: "end",
    alignSelf: "center",
    transform: "translateX(25%)",
  },
  /* 6 Notting Hill — lower-right */
  { colStart: 8, colEnd: 10, rowStart: 8, rowEnd: 10, justifySelf: "end", alignSelf: "center" },
  /* 7 Tokyo — upper-mid-right */
  { colStart: 10, colEnd: 12, rowStart: 5, rowEnd: 7, justifySelf: "end", alignSelf: "center" },
  /* 8 Berlin — top center (headline / “M” band) */
  { colStart: 5, colEnd: 8, rowStart: 1, rowEnd: 3, justifySelf: "center", alignSelf: "start" },
  /* 9 New York — bottom-right */
  { colStart: 9, colEnd: 12, rowStart: 11, rowEnd: 14, justifySelf: "end", alignSelf: "end" },
  /* 10 — same column band as Los Angeles, two rows below */
  { colStart: 2, colEnd: 4, rowStart: 12, rowEnd: 14, justifySelf: "start", alignSelf: "center" },
];

export function stampGridStyle(index: number): CSSProperties {
  const p = STAMP_PLACEMENT[index];
  if (!p) {
    return {};
  }
  return {
    gridColumn: `${p.colStart} / ${p.colEnd}`,
    gridRow: `${p.rowStart} / ${p.rowEnd}`,
    justifySelf: p.justifySelf ?? "start",
    alignSelf: p.alignSelf ?? "start",
    ...(p.transform ? { transform: p.transform } : {}),
  };
}
