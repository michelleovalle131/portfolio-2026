import {
  useCallback,
  useId,
  useLayoutEffect,
  useState,
  type ChangeEvent,
} from "react";
import styles from "./FieldNotesNav.module.css";

const PAGE_BG_STORAGE_KEY = "portfolio-page-bg";
const DEFAULT_PAGE_BG = "#1a1a1a";

function readStoredPageBg(): string {
  try {
    const v = localStorage.getItem(PAGE_BG_STORAGE_KEY);
    if (v && /^#[0-9a-fA-F]{6}$/.test(v)) {
      return v;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_PAGE_BG;
}

function applyPageBgToRoot(hex: string) {
  document.documentElement.style.setProperty("--page-bg", hex);
}

function ColorWheelIcon({ gradientId }: { gradientId: string }) {
  return (
    <svg
      className={styles.colorWheelIcon}
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="25%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#4ade80" />
          <stop offset="75%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
      </defs>
      <circle
        cx="12"
        cy="12"
        r="8.25"
        fill={`url(#${gradientId})`}
        stroke="rgba(255, 255, 255, 0.45)"
        strokeWidth="1.25"
      />
      <circle
        cx="12"
        cy="12"
        r="2.75"
        fill="var(--page-bg)"
        stroke="rgba(255, 255, 255, 0.35)"
        strokeWidth="0.75"
      />
    </svg>
  );
}

export function FieldNotesNav() {
  const [pageBg, setPageBg] = useState(DEFAULT_PAGE_BG);
  const colorInputId = useId().replace(/:/g, "");
  const wheelGradId = `${colorInputId}-wheel`;

  useLayoutEffect(() => {
    const stored = readStoredPageBg();
    setPageBg(stored);
    applyPageBgToRoot(stored);
  }, []);

  const onBgColorChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setPageBg(next);
    applyPageBgToRoot(next);
    try {
      localStorage.setItem(PAGE_BG_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <nav className={styles.nav} aria-label="Site navigation">
      <ul className={styles.list}>
        <li>
          <a className={styles.link} href="#home">
            Home
          </a>
        </li>
        <li className={styles.divider} aria-hidden="true" />
        <li>
          <a className={styles.link} href="#intro">
            About
          </a>
        </li>
        <li className={styles.divider} aria-hidden="true" />
        <li className={styles.colorItem}>
          <label className={styles.colorWheelLabel} htmlFor={colorInputId}>
            <span className={styles.srOnly}>Page background color</span>
            <ColorWheelIcon gradientId={wheelGradId} />
            <input
              id={colorInputId}
              className={styles.colorInputHidden}
              type="color"
              value={pageBg}
              onChange={onBgColorChange}
              title="Page background color"
            />
          </label>
        </li>
      </ul>
    </nav>
  );
}
