import { useEffect, useRef } from "react";
import styles from "./StampBalanceSection.module.css";

const PORTRAIT_SRC =
  "https://www.figma.com/api/mcp/asset/309575f4-8958-4547-bc24-047532a64022";

export function StampBalanceSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      section.style.setProperty("--intro-image-progress", "1");
      return;
    }

    let raf = 0;
    const syncScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const viewportH = window.innerHeight || 1;
        const start = viewportH * 0.92;
        const end = viewportH * 0.38;
        const raw = (start - rect.top) / (start - end);
        const progress = Math.max(0, Math.min(1, raw));
        const delayedProgress = Math.max(
          0,
          Math.min(1, (progress - 0.12) / 0.88),
        );
        section.style.setProperty(
          "--intro-image-progress",
          String(delayedProgress),
        );
      });
    };

    window.addEventListener("scroll", syncScroll, { passive: true });
    window.addEventListener("resize", syncScroll);
    syncScroll();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", syncScroll);
      window.removeEventListener("resize", syncScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      id="intro"
      aria-labelledby="intro-heading"
    >
      <div className={styles.imageCard}>
        <img
          className={styles.portraitImg}
          src={PORTRAIT_SRC}
          alt="Michelle smiling at her desk"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className={styles.right}>
        <div className={styles.copyBlock}>
          <h2 className={styles.headline} id="intro-heading">
            Hello from Chicago
          </h2>
          <p className={styles.body}>
            I&apos;m Michelle - a Sr Product Designer who thrives at the
            intersection of systems thinking, craft and making a real impact on
            users. I&apos;m currently helping teams do their best work on{" "}
            <a
              href="https://www.loom.com"
              className={styles.inlineLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Loom
            </a>{" "}
            Meeting Recordings at{" "}
            <a
              href="https://www.atlassian.com"
              className={styles.inlineLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Atlassian
            </a>
            .
          </p>
          <a
            className={styles.cta}
            href="https://www.linkedin.com/in/michelleovalle/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
}
