/**
 * Riso-inspired page backgrounds + Reprint palette (random pick on “Reprint”).
 * Excludes colors dark enough for `isDarkPageBackground` (relative luminance below 0.5)
 * so default body/hero text stays dark-on-light without inversion.
 * Saturated rows echo SplitViewport “Life” (#ffd2ec), “Craft” (#fff3b8), “Mind” (#bfe8fa).
 */
export const RISO_PAGE_BACKGROUNDS = [
  /* Soft paper */
  "#FAF9F6",
  "#F5F5F0",
  "#EBEAE6",
  /* Life — rose / blush (tier: #ffd2ec) */
  "#ffd2ec",
  "#f5c4d4",
  "#f0b0c8",
  "#fcd4e2",
  "#ffc8d6",
  "#f4a9bc",
  "#f8e0eb",
  /* Craft — butter / lemon (tier: #fff3b8) */
  "#fff3b8",
  "#ffea8f",
  "#ffe566",
  "#fff9a8",
  "#fff176",
  "#ffee99",
  "#ffe082",
  /* Mind — pool / sky (tier: #bfe8fa) */
  "#bfe8fa",
  "#a5daf5",
  "#8acef0",
  "#c5ecf8",
  "#9dd8ed",
  "#7ec8eb",
  "#b2ebf2",
  /* Riso-style mixes (still light, punchy) */
  "#e8f5e4",
  "#fce8c4",
  /* Stamp balance intro lavender (was full-bleed left column) */
  "#e4daf5",
  "#e4e0fc",
  "#d4f0f7",
  "#fff8e1",
  "#f3e5f5",
  "#e0f7fa",
  "#fce4ec",
  /* Reprint palette additions */
  "#14d6ff",
  "#86eaff",
  "#b3f2ff",
  "#ffa3e4",
  "#fdcdf4",
  "#ffe457",
  "#ffed92",
  "#fff5be",
  "#ced2ff",
  "#8be2c1",
  "#c8f2e2",
] as const;

function normalizeHex(h: string): string {
  return h.trim().toLowerCase();
}

export function pickRandomRisoPageBg(currentHex: string): string {
  const cur = normalizeHex(currentHex);
  const pool = RISO_PAGE_BACKGROUNDS.filter((h) => normalizeHex(h) !== cur);
  const list = pool.length > 0 ? pool : [...RISO_PAGE_BACKGROUNDS];
  return list[Math.floor(Math.random() * list.length)]!;
}
