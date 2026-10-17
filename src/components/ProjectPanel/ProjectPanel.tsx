import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import styles from "./ProjectPanel.module.css";

const CLOSE_MS = 420;

type ProjectPanelProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Bold line in the left column (a date, company, role…) */
  meta?: string;
  /** Your role, as a line under the meta */
  role?: string;
  /** Pill tags under the meta line */
  tags?: string[];
  /** The visual at the top of the panel */
  media: ReactNode;
  /** Body copy in the right column */
  children: ReactNode;
};

/**
 * A project detail panel that slides in from the right over a dimmed page.
 * Closes on the X, Escape, or a click on the dimmed page; focus moves into
 * the panel on open, stays inside while open, and returns to whatever opened
 * it on close. The page behind doesn't scroll while it's open.
 */
export function ProjectPanel({
  open,
  onClose,
  title,
  meta,
  role,
  tags = [],
  media,
  children,
}: ProjectPanelProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  // Stay mounted through the closing slide
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (open) {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setMounted(true);
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(raf);
    }
    setShown(false);
    const t = window.setTimeout(() => setMounted(false), CLOSE_MS);
    returnFocus.current?.focus?.();
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!mounted || !open) return;
    closeRef.current?.focus();
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = previousOverflow;
    };
  }, [mounted, open, onClose]);

  if (!mounted) return null;

  return (
    <div
      className={[styles.layer, shown ? styles.shown : ""].filter(Boolean).join(" ")}
      data-project-panel
    >
      <div className={styles.backdrop} onClick={onClose} aria-hidden />
      <aside
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.toolbar}>
          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close project"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={styles.media}>{media}</div>

        <h2 className={styles.title} id={titleId}>
          {title}
        </h2>

        <div className={styles.details}>
          <div className={styles.meta}>
            {meta && <p className={styles.metaLine}>{meta}</p>}
            {role && <p className={styles.roleLine}>{role}</p>}
            {tags.length > 0 && (
              <ul className={styles.tags}>
                {tags.map((tag) => (
                  <li key={tag} className={styles.tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.body}>{children}</div>
        </div>
      </aside>
    </div>
  );
}
