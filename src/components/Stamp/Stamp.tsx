import { forwardRef, type CSSProperties } from "react";
import styles from "./Stamp.module.css";

type PolaroidProps = {
  /** Accessible name for the photo (no visible caption). */
  label: string;
  /** CSS background for the photo area (gradients, colors, or url(...)) */
  imageBackground: string;
  className?: string;
  style?: CSSProperties;
  /** Sets inline `--stamp-index` (Paul Smith pattern) for DevTools / `var()` use. */
  stampIndex?: number;
};

export const Stamp = forwardRef<HTMLDivElement, PolaroidProps>(
  function Stamp({ label, imageBackground, className = "", style, stampIndex }, ref) {
    const polaroidStyle =
      stampIndex !== undefined
        ? ({ "--stamp-index": stampIndex } as CSSProperties)
        : undefined;

    return (
      <div
        ref={ref}
        className={`${styles.polaroid} ${className}`}
        style={{ ...polaroidStyle, ...style }}
        role="img"
        aria-label={label}
      >
        <div
          className={styles.image}
          style={{ background: imageBackground }}
          aria-hidden
        />
      </div>
    );
  },
);

Stamp.displayName = "Stamp";
