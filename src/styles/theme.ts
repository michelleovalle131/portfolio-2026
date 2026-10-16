/**
 * Light / dark mode. A visitor's pick is remembered per browser; until they
 * pick, the site follows the system setting. index.html applies it before
 * first paint; see the dark tokens in index.css.
 */
export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

function systemTheme(): Theme {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function readSavedTheme(): Theme | null {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null;
  }
}

export function readTheme(): Theme {
  return readSavedTheme() ?? systemTheme();
}

export function applyTheme(theme: Theme, remember = false): void {
  document.documentElement.dataset.theme = theme;
  if (!remember) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* storage unavailable — the mode still applies for this visit */
  }
}
