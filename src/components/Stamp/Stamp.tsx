import type { CSSProperties } from "react";
import styles from "./Stamp.module.css";

type PolaroidProps = {
  label: string;
  /** CSS background for the photo area (gradients, colors, or url(...)) */
  imageBackground: string;
  className?: string;
  style?: CSSProperties;
  /** Sets inline `--stamp-index` (Paul Smith pattern) for DevTools / `var()` use. */
  stampIndex?: number;
};

export function Stamp({
  label,
  imageBackground,
  className = "",
  style,
  stampIndex,
}: PolaroidProps) {
  const stampStyle =
    stampIndex !== undefined
      ? ({ "--stamp-index": stampIndex } as React.CSSProperties)
      : undefined;

  return (
    <div
      className={`${styles.polaroid} ${className}`}
      style={{ ...stampStyle, ...style }}
    >
      <div
        className={styles.image}
        style={{ background: imageBackground }}
        aria-hidden
      />
      <p className={styles.caption}>{label}</p>
    </div>
  );
}
