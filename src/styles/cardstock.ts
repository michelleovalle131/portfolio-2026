/**
 * Cardstock — the site's one spot colour (`--cardstock-pastel`), swappable by the
 * visitor from the hero. Values from Figma (MO-SCRATCH, node 265:2069).
 * The choice is remembered per browser and applied before first paint.
 */
/* `value` is the pastel paper in light mode; `dark` the deep accent stock in
   dark mode */
export const CARDSTOCK_COLORS: readonly { name: string; value: string; dark: string }[] = [
  { name: "Blue", value: "#c8e9ff", dark: "#1b3a58" },
  { name: "Mint", value: "#b4dfd4", dark: "#193d34" },
  { name: "Butter", value: "#f6e08c", dark: "#3c3915" },
  { name: "Lilac", value: "#e1c9fa", dark: "#2e2a4f" },
  { name: "Peach", value: "#ffd9ab", dark: "#562a1c" },
  { name: "Pink", value: "#f4c5e1", dark: "#4e2138" },
];

const STORAGE_KEY = "cardstock";

export function readCardstockIndex(): number {
  try {
    const saved = Number(window.localStorage.getItem(STORAGE_KEY));
    return Number.isInteger(saved) && saved >= 0 && saved < CARDSTOCK_COLORS.length
      ? saved
      : 0;
  } catch {
    return 0;
  }
}

export function applyCardstock(index: number): void {
  const color = CARDSTOCK_COLORS[index] ?? CARDSTOCK_COLORS[0];
  // --accent-spot reads these in CSS (index.css)
  const root = document.documentElement.style;
  root.setProperty("--cardstock-pastel", color.value);
  root.setProperty("--cardstock-dark", color.dark);
  try {
    window.localStorage.setItem(STORAGE_KEY, String(index));
  } catch {
    /* storage unavailable — the colour still applies for this visit */
  }
}
