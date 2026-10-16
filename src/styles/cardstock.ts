/**
 * Cardstock — the site's one spot colour (`--accent-spot`), swappable by the
 * visitor from the hero. Values from Figma (MO-SCRATCH, node 265:2069).
 * The choice is remembered per browser and applied before first paint.
 */
export const CARDSTOCK_COLORS = [
  { name: "Blue", value: "#c8e9ff" },
  { name: "Mint", value: "#b4dfd4" },
  { name: "Butter", value: "#f6e08c" },
  { name: "Lilac", value: "#e1c9fa" },
  { name: "Peach", value: "#ffd9ab" },
  { name: "Pink", value: "#f4c5e1" },
] as const;

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
  document.documentElement.style.setProperty("--accent-spot", color.value);
  try {
    window.localStorage.setItem(STORAGE_KEY, String(index));
  } catch {
    /* storage unavailable — the colour still applies for this visit */
  }
}
