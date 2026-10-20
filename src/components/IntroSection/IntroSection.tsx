import styles from "./IntroSection.module.css";

const PORTRAIT_SRC = "/imgs/intro-portrait.jpg";

export function IntroSection() {
  return (
    <section className={styles.section} id="intro" aria-labelledby="intro-heading">
      <div className={`editorialGrid ${styles.grid}`}>
        <p className={styles.pageNumber} aria-hidden>
          01/03
        </p>

        <h2 className={styles.headline} id="intro-heading">
          {"I'm Michelle—an experienced Product Designer who thrives at the intersection of systems thinking, craft, and making a real impact."}
        </h2>

        <div className={styles.body}>
          <p>
            I love untangling ambiguous problems, partnering closely with my
            cross-functional peers, and staying curious as design tools and
            practices keep evolving.
          </p>
          <p>
            Right now, I&apos;m helping teams do their best work on{" "}
            <a
              className="link-inline"
              href="https://www.loom.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Loom
            </a>{" "}
            at{" "}
            <a
              className="link-inline"
              href="https://www.atlassian.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Atlassian
            </a>
            .
          </p>
        </div>

        <div className={styles.portrait} data-ink-box>
          <img
            className={styles.portraitImg}
            data-ink="rise"
            src={PORTRAIT_SRC}
            alt="Michelle smiling at her desk"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
