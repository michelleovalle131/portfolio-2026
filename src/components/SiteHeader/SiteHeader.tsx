import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  CARDSTOCK_COLORS,
  applyCardstock,
  readCardstockIndex,
} from "../../styles/cardstock";
import { applyTheme, readSavedTheme, readTheme, type Theme } from "../../styles/theme";
import styles from "./SiteHeader.module.css";

/**
 * The site's top row: name, cardstock + light/dark mode toggles, and About. Sits on
 * the 16-column page grid — the hero places it in its own grid's first row,
 * other pages wrap it in the same frame.
 */
export function SiteHeader({ className }: { className?: string }) {
  const { pathname } = useLocation();
  const [cardstockIndex, setCardstockIndex] = useState(readCardstockIndex);
  const nextCardstock = CARDSTOCK_COLORS[(cardstockIndex + 1) % CARDSTOCK_COLORS.length]!;
  const cycleCardstock = () =>
    setCardstockIndex((i) => (i + 1) % CARDSTOCK_COLORS.length);

  useEffect(() => {
    applyCardstock(cardstockIndex);
  }, [cardstockIndex]);

  const [theme, setTheme] = useState<Theme>(readTheme);
  // Bumped on each click so the icon's swap animation replays
  const [themeFlips, setThemeFlips] = useState(0);
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next, true);
    setTheme(next);
    setThemeFlips((n) => n + 1);
  };

  // Until the visitor picks, follow the system setting as it changes
  useEffect(() => {
    const query = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!query) return;
    const onChange = () => {
      if (readSavedTheme()) return;
      const next = query.matches ? "dark" : "light";
      applyTheme(next);
      setTheme(next);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <header className={[styles.header, className].filter(Boolean).join(" ")}>
      {/* On the homepage the name is just a label; elsewhere it leads home */}
      {pathname === "/" ? (
        <p className={styles.name}>michelle ovalle</p>
      ) : (
        <Link className={`${styles.name} link-ui`} to="/">
          michelle ovalle
        </Link>
      )}

      {/* Icon-only controls (labels show as tooltips on hover/focus), then
          About — one evenly spaced group at the right edge */}
      <div className={styles.utils}>
        <button
          type="button"
          className={`${styles.utilButton} ${styles.tip}`}
          onClick={cycleCardstock}
          data-tooltip="Cardstock"
          aria-label={`Cardstock color: ${CARDSTOCK_COLORS[cardstockIndex]!.name}. Switch to ${nextCardstock.name}`}
        >
          <span className={styles.swatch} aria-hidden />
        </button>

        <button
          type="button"
          className={`${styles.utilButton} ${styles.tip}`}
          onClick={toggleTheme}
          data-tooltip={theme === "dark" ? "Dark mode" : "Light mode"}
          aria-label={theme === "dark" ? "Dark mode. Switch to light mode" : "Light mode. Switch to dark mode"}
        >
          {/* Half paper, half ink — drawn in the page's own colours, so it
              reverses with the mode. On a click the colours flip at once, so
              the half starts turned round (looking unchanged) and spins back,
              sweeping the light and dark sides across. */}
          <svg className={styles.utilIcon} viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="11.5" fill="var(--surface-cardstock)" stroke="var(--ink-print-muted)" />
            <path
              key={themeFlips}
              className={themeFlips > 0 ? styles.modeHalfFlip : undefined}
              d="M11.625 24C18.2524 24 23.625 18.6274 23.625 12C23.625 5.37258 18.2524 0 11.625 0V24Z"
              fill="var(--ink)"
            />
          </svg>
        </button>

        <NavLink className={`${styles.aboutLink} link-ui`} to="/about">
          about
        </NavLink>
      </div>
    </header>
  );
}
