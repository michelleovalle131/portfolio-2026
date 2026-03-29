import { forwardRef, useId, type CSSProperties } from "react";
import type { StampMaskGeometry } from "./stampPerforationMask";
import styles from "./Stamp.module.css";

type PolaroidProps = {
  label: string;
  /** CSS background for the photo area (gradients, colors, or url(...)) */
  imageBackground: string;
  className?: string;
  style?: CSSProperties;
  /** Sets inline `--stamp-index` (Paul Smith pattern) for DevTools / `var()` use. */
  stampIndex?: number;
  /** SVG punch mask (e.g. hero seamless grid); omit for plain rectangular photo. */
  perforation?: StampMaskGeometry | null;
};

export const Stamp = forwardRef<HTMLDivElement, PolaroidProps>(
  function Stamp(
    {
      label,
      imageBackground,
      className = "",
      style,
      stampIndex,
      perforation,
    },
    ref,
  ) {
    const maskId = useId().replace(/:/g, "");
    const polaroidStyle =
      stampIndex !== undefined
        ? ({ "--stamp-index": stampIndex } as CSSProperties)
        : undefined;

    const maskActive =
      perforation &&
      perforation.circles.length > 0 &&
      perforation.w > 0 &&
      perforation.h > 0;

    const maskStyle: CSSProperties | undefined = maskActive
      ? {
          WebkitMask: `url(#${maskId})`,
          mask: `url(#${maskId})`,
        }
      : undefined;

    return (
      <div
        ref={ref}
        className={`${styles.polaroid} ${className}`}
        style={{ ...polaroidStyle, ...style, ...maskStyle }}
      >
        {maskActive ? (
          <svg className={styles.maskDefs} width="0" height="0" aria-hidden>
            <defs>
              <mask
                id={maskId}
                maskUnits="userSpaceOnUse"
                maskContentUnits="userSpaceOnUse"
                x="0"
                y="0"
                width={perforation.w}
                height={perforation.h}
              >
                <rect width={perforation.w} height={perforation.h} fill="white" />
                {perforation.circles.map((c, i) => (
                  <circle
                    key={i}
                    cx={c.cx}
                    cy={c.cy}
                    r={perforation.r}
                    fill="black"
                  />
                ))}
              </mask>
            </defs>
          </svg>
        ) : null}
        <div
          className={styles.image}
          style={{ background: imageBackground }}
          aria-hidden
        />
        <p className={styles.caption}>{label}</p>
      </div>
    );
  },
);

Stamp.displayName = "Stamp";
