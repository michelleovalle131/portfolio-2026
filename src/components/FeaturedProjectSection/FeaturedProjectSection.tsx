import styles from "./FeaturedProjectSection.module.css";

type FeaturedProjectSectionProps = {
  id: string;
  /** Handwritten section counter, e.g. "02/03". */
  pageNumber: string;
  title: string;
  description: string;
  /** Atmospheric backdrop, multiplied onto the accent plate. */
  backgroundSrc: string;
  /** Product UI shown centered over the backdrop. */
  screenshotSrc: string;
  screenshotAlt: string;
};

export function FeaturedProjectSection({
  id,
  pageNumber,
  title,
  description,
  backgroundSrc,
  screenshotSrc,
  screenshotAlt,
}: FeaturedProjectSectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section className={styles.section} id={id} aria-labelledby={headingId}>
      <div className={`editorialGrid ${styles.grid}`}>
        <p className={styles.pageNumber} aria-hidden>
          {pageNumber}
        </p>
        <p className={styles.label}>Featured project</p>

        <h2 className={styles.title} id={headingId}>
          {title}
        </h2>

        <div className={styles.media}>
          <img
            className={styles.backdrop}
            src={backgroundSrc}
            alt=""
            loading="lazy"
            decoding="async"
          />
          <img
            className={styles.screenshot}
            src={screenshotSrc}
            alt={screenshotAlt}
            loading="lazy"
            decoding="async"
          />
        </div>

        <p className={styles.description}>{description}</p>
      </div>
    </section>
  );
}
