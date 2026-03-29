/**
 * Soft remix backgrounds aligned with the palette on michelleovalle.vercel.app
 * (pastels + muted accents from the deployed bundle — no browns / near-blacks).
 */
export const REMIX_HERO_BACKGROUNDS = [
  "#E8F4F8",
  "#E3F2FD",
  "#D4E4FF",
  "#CFE1FD",
  "#E0F2F1",
  "#E1F5F3",
  "#E8F5E9",
  "#E7E1FF",
  "#E8DFFF",
  "#E8EAF6",
  "#F3E5F5",
  "#FCE4EC",
  "#FFE5E1",
  "#FFF3E0",
  "#FFF4E6",
  "#FFF7EA",
  "#FFF8E7",
  "#FFF9C4",
  "#7EB5D4",
  "#85B891",
  "#26A69A",
  "#42A5F5",
  "#66BB6A",
  "#7986CB",
  "#5C6BC0",
  "#BA68C8",
  "#8A2BE2",
  "#7B1FA2",
  "#1565C0",
  "#1558BC",
  "#00695C",
  "#2E7D32",
  "#EC407A",
  "#C2185B",
  "#F57F17",
  "#F9A825",
  "#FF9800",
  "#FF8C42",
  "#E65100",
] as const;

function parseRgb(hex: string): [number, number, number] | null {
  const n = hex.replace("#", "").trim();
  if (n.length === 3) {
    return [
      Number.parseInt(n[0] + n[0], 16),
      Number.parseInt(n[1] + n[1], 16),
      Number.parseInt(n[2] + n[2], 16),
    ];
  }
  if (n.length === 6) {
    return [
      Number.parseInt(n.slice(0, 2), 16),
      Number.parseInt(n.slice(2, 4), 16),
      Number.parseInt(n.slice(4, 6), 16),
    ];
  }
  return null;
}

/** WCAG relative luminance (sRGB), 0–1 */
function relativeLuminance(hex: string): number {
  const rgb = parseRgb(hex);
  if (!rgb) {
    return 0;
  }
  const linear = rgb.map((c) => {
    const x = c / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0]! + 0.7152 * linear[1]! + 0.0722 * linear[2]!;
}

/** Pastel / light fills need dark type; deeper accents keep light type. */
export function heroContentTheme(backgroundHex: string): "light" | "dark" {
  return relativeLuminance(backgroundHex) > 0.52 ? "light" : "dark";
}

export function randomRemixHeroBackground(exclude?: string): string {
  const list = REMIX_HERO_BACKGROUNDS;
  if (exclude === undefined) {
    return list[Math.floor(Math.random() * list.length)]!;
  }
  let pick: string;
  let guard = 0;
  do {
    pick = list[Math.floor(Math.random() * list.length)]!;
    guard += 1;
  } while (pick === exclude && guard < 48);
  return pick;
}
