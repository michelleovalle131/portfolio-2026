import { useEffect, useRef, useState } from "react";
import styles from "./PrintPreview.module.css";

const CLOSE_MS = 260;

export type PreviewPrint = {
  src: string;
  /** Shown under the image and read out to screen readers */
  title: string;
  /** The print's number in the gallery (1, 2…) */
  number: number;
};

type PrintPreviewProps = {
  prints: PreviewPrint[];
  /** Index into `prints` to show, or null when closed */
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

/**
 * A larger look at one gallery print, in full colour, over a dimmed page.
 * Closes on the X, Escape, or a click outside the image; ← / → (or the
 * arrow buttons) step through the other prints. Focus moves to the close
 * button on open and returns to the print that opened it on close.
 */
export function PrintPreview({ prints, index, onClose, onNavigate }: PrintPreviewProps) {
  const open = index !== null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  // Stay mounted (showing the last print) through the closing fade
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  const [lastIndex, setLastIndex] = useState(index ?? 0);
  if (index !== null && index !== lastIndex) setLastIndex(index);

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

  const count = prints.length;
  const step = (by: number) => {
    if (index === null || count < 2) return;
    onNavigate((index + by + count) % count);
  };

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
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "Tab") {
        // Keep focus on the preview's own buttons
        const buttons = [
          ...document.querySelectorAll<HTMLButtonElement>(`.${styles.root} button`),
        ];
        if (!buttons.length) return;
        const first = buttons[0]!;
        const last = buttons[buttons.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = previousOverflow;
    };
    // step reads the latest index via closure; re-bind when it changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, open, index, onClose]);

  if (!mounted) return null;
  const print = prints[lastIndex];
  if (!print) return null;

  return (
    <div
      className={[styles.root, shown ? styles.shown : ""].filter(Boolean).join(" ")}
      role="dialog"
      aria-modal="true"
      aria-label={`Print ${print.number}: ${print.title}`}
    >
      <div className={styles.backdrop} onClick={onClose} aria-hidden />

      <button
        ref={closeRef}
        type="button"
        className={`${styles.iconButton} ${styles.close}`}
        onClick={onClose}
        aria-label="Close preview"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {count > 1 && (
        <>
          <button
            type="button"
            className={`${styles.iconButton} ${styles.prev}`}
            onClick={() => step(-1)}
            aria-label="Previous print"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            className={`${styles.iconButton} ${styles.next}`}
            onClick={() => step(1)}
            aria-label="Next print"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      <figure className={styles.figure} onClick={onClose}>
        <img
          // Remount per print so each one fades in
          key={print.src}
          className={styles.image}
          src={print.src}
          alt={print.title}
          draggable={false}
          onClick={(e) => e.stopPropagation()}
        />
        <figcaption className={styles.caption} onClick={(e) => e.stopPropagation()}>
          <span className={styles.number}>{String(print.number).padStart(2, "0")}</span>
          <span className={styles.title}>{print.title}</span>
        </figcaption>
      </figure>
    </div>
  );
}

