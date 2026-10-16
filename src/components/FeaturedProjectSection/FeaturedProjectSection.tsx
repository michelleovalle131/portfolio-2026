import styles from "./FeaturedProjectSection.module.css";
import { InkText } from "../InkText/InkText";

type FeaturedProjectSectionProps = {
  id: string;
  /** Handwritten section counter, e.g. "02/03". */
  pageNumber: string;
  /** Optional mono label in the top-right corner, e.g. the project name. */
  label?: string;
  title: string;
  description: string;
  /** Atmospheric backdrop, multiplied onto the accent plate. */
  backgroundSrc: string;
  /** Product UI shown centered over the backdrop. */
  screenshotSrc: string;
  screenshotAlt: string;
  /** "stacked": full-width image under the title. "split": image fills the right 10 columns. */
  layout?: "stacked" | "split";
};

export function FeaturedProjectSection({
  id,
  pageNumber,
  label,
  title,
  description,
  backgroundSrc,
  screenshotSrc,
  screenshotAlt,
  layout = "stacked",
}: FeaturedProjectSectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      className={[styles.section, layout === "split" ? styles.split : ""]
        .filter(Boolean)
        .join(" ")}
      id={id}
      aria-labelledby={headingId}
    >
      <div className={`editorialGrid ${styles.grid}`}>
        <p className={styles.pageNumber} aria-hidden data-ink="pen">
          {pageNumber}
        </p>
        {label && (
          <p className={styles.label} data-ink="stamp">
            {label}
          </p>
        )}

        <h2 className={styles.title} id={headingId}>
          <InkText>{title}</InkText>
        </h2>

        <div className={styles.media} data-ink-box>
          <img
            className={styles.backdrop}
            data-ink="rise"
            data-ink-pass="1"
            src={backgroundSrc}
            alt=""
            loading="lazy"
            decoding="async"
          />
          <img
            className={styles.screenshot}
            data-ink="rise"
            data-ink-pass="2"
            src={screenshotSrc}
            alt={screenshotAlt}
            loading="lazy"
            decoding="async"
          />
        </div>

        <p className={styles.description} data-ink="stamp">{description}</p>
      </div>
    </section>
  );
}
