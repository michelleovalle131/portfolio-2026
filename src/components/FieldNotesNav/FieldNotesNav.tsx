import {
  useCallback,
  useId,
  useLayoutEffect,
  useState,
  type ChangeEvent,
} from "react";
import { NavLink } from "react-router-dom";
import { pickRandomRisoPageBg } from "../../lib/risoBackgrounds";
import styles from "./FieldNotesNav.module.css";

const PAGE_BG_STORAGE_KEY = "portfolio-page-bg";
const DEFAULT_PAGE_BG = "#faf9f6";

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

/** Heroicons outline “swatches” (Tailwind UI). */
function SwatchesIcon() {
  return (
    <svg
      className={styles.colorWheelIcon}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden
      focusable="false"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z"
      />
    </svg>
  );
}

type FieldNotesNavProps = {
  onPortfolioRefresh?: () => void;
};

export function FieldNotesNav({ onPortfolioRefresh }: FieldNotesNavProps) {
  const [pageBg, setPageBg] = useState(DEFAULT_PAGE_BG);
  const colorInputId = useId().replace(/:/g, "");

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

  const onRefreshClick = useCallback(() => {
    const next = pickRandomRisoPageBg(pageBg);
    setPageBg(next);
    applyPageBgToRoot(next);
    try {
      localStorage.setItem(PAGE_BG_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    onPortfolioRefresh?.();
  }, [pageBg, onPortfolioRefresh]);

  return (
    <nav className={styles.nav} aria-label="Site navigation">
      <ul className={styles.list}>
        <li>
          <NavLink
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.linkActive}` : styles.link
            }
            to="/"
            end
          >
            Home
          </NavLink>
        </li>
        <li className={styles.divider} aria-hidden="true" />
        <li>
          <NavLink
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.linkActive}` : styles.link
            }
            to="/about"
          >
            About
          </NavLink>
        </li>
        <li className={styles.divider} aria-hidden="true" />
        <li>
          <button
            type="button"
            className={styles.actionButton}
            onClick={onRefreshClick}
            title="New stamp photos and a Risograph-style paper color"
          >
            Refresh
          </button>
        </li>
        <li className={styles.colorItem}>
          <label className={styles.colorWheelLabel} htmlFor={colorInputId}>
            <span className={styles.srOnly}>Page background color</span>
            <SwatchesIcon />
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
