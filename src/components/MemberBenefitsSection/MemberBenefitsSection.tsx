import { type CSSProperties, useEffect, useRef } from "react";
import styles from "./MemberBenefitsSection.module.css";

const PROJECT_BG_SRC =
  "https://www.figma.com/api/mcp/asset/bee7ff00-bed8-46cd-99ee-4fe13685a78f";
const COMPANY_HUB_BG_SRC =
  "https://www.figma.com/api/mcp/asset/1b1dcee8-1a78-47f6-8ff9-22b624c80bd8";
const COMPANY_HUB_CARD_IMG_SRC =
  "https://www.figma.com/api/mcp/asset/c896dd1a-52a2-41a7-8838-ff554bce1c21";

type ProjectSection = {
  id: string;
  bgSrc: string;
  cardImgSrc: string;
  cardImgAlt: string;
  cardBg?: string;
  cardImageContain?: boolean;
  cardImageTall?: boolean;
  kicker: string;
  title: string;
  description: string;
  ctaHref: string;
};

const PROJECT_SECTIONS: ProjectSection[] = [
  {
    id: "recent-impact-loom",
    bgSrc: PROJECT_BG_SRC,
    cardImgSrc: PROJECT_BG_SRC,
    cardImgAlt:
      "Suggested Actions experience in Confluence with AI prompts and meeting follow-up guidance",
    kicker: "Loom Meeting Recordings · AI Suggestions",
    title: "Turning meetings into progress with 1-click AI suggestions",
    description:
      "Led a one-week sprint with successful results in increasing Rovo awareness among Atlassian Cloud users in Confluence.",
    ctaHref: "https://www.atlassian.com/software/confluence",
  },
  {
    id: "recent-impact-company-hub",
    bgSrc: COMPANY_HUB_BG_SRC,
    cardImgSrc: COMPANY_HUB_CARD_IMG_SRC,
    cardImgAlt: "Company Hub editor and publishing interface in Confluence",
    cardBg: "#e6def7",
    cardImageContain: true,
    cardImageTall: true,
    kicker: "Confluence Company Hub • Building an editing experience",
    title: "Company Hub - one place for trusted information, built for the whole company",
    description:
      "Led the design and launch of a centralized knowledge experience that helped users more easily find what they needed. Now being built as a platform app for other teams to adopt the framework we established.",
    ctaHref: "https://www.atlassian.com/software/confluence",
  },
];

export function MemberBenefitsSection() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const sections = sectionRefs.current.filter(
      (section): section is HTMLElement => section !== null,
    );
    if (sections.length === 0) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      sections.forEach((section) => {
        section.style.setProperty("--card-progress", "1");
      });
      return;
    }

    let raf = 0;
    const syncScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const viewportH = window.innerHeight || 1;
        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const start = viewportH * 0.92;
          const end = viewportH * 0.38;
          const raw = (start - rect.top) / (start - end);
          const progress = Math.max(0, Math.min(1, raw));
          // Slight delay: keep card low briefly, then progress motion.
          const delayedProgress = Math.max(
            0,
            Math.min(1, (progress - 0.12) / 0.88),
          );
          section.style.setProperty("--card-progress", String(delayedProgress));
        });
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
    <>
      {PROJECT_SECTIONS.map((project, index) => (
        <section
          key={project.id}
          ref={(el) => {
            sectionRefs.current[index] = el;
          }}
          id={project.id}
          className={styles.section}
          aria-label="Project highlight"
        >
          <img
            className={styles.bgImage}
            src={project.bgSrc}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
          />
          <article
            className={styles.card}
            style={
              project.cardBg
                ? ({ ["--project-card-bg" as string]: project.cardBg } as CSSProperties)
                : undefined
            }
          >
            <div
              className={[
                styles.cardImageWrap,
                project.cardImageTall ? styles.cardImageWrapTall : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <img
                className={[
                  styles.cardImage,
                  project.cardImageContain ? styles.cardImageContain : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                src={project.cardImgSrc}
                alt={project.cardImgAlt}
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className={styles.cardContent}>
              <p className={styles.kicker}>{project.kicker}</p>
              <h2 className={styles.cardTitle}>{project.title}</h2>
              <p className={styles.cardDescription}>{project.description}</p>
              <a
                className={styles.ctaRow}
                href={project.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>View project</span>
              </a>
            </div>
          </article>
        </section>
      ))}
    </>
  );
}
