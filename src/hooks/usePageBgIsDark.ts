import { useEffect, useState } from "react";
import { isDarkPageBackground } from "../lib/pageBgContrast";

const PAGE_BG_STORAGE_KEY = "portfolio-page-bg";
const DEFAULT_PAGE_BG = "#faf9f6";

function readStoredHex(): string | null {
  try {
    const v = localStorage.getItem(PAGE_BG_STORAGE_KEY);
    if (v && /^#[0-9a-fA-F]{6}$/.test(v)) {
      return v;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function readPageBgComputed(): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue("--page-bg")
    .trim();
}

/**
 * Tracks whether :root `--page-bg` is dark (for hero text contrast).
 * Matches FieldNotesNav storage key so first paint aligns with saved color.
 */
export function usePageBgIsDark(): boolean {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    const stored = readStoredHex();
    return isDarkPageBackground(stored ?? DEFAULT_PAGE_BG);
  });

  useEffect(() => {
    const sync = () => {
      setDark(isDarkPageBackground(readPageBgComputed()));
    };
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });
    return () => {
      mo.disconnect();
    };
  }, []);

  return dark;
}
