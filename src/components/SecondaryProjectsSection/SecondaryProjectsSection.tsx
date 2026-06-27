import { type CSSProperties } from "react";
import styles from "./SecondaryProjectsSection.module.css";

type SecondaryProject = {
  id: string;
  imageSrc: string;
  imageAlt: string;
  meta: string;
  title: string;
  description: string;
  href: string;
  cardBg?: string;
};

const SECONDARY_PROJECTS: SecondaryProject[] = [
  {
    id: "activation-strategy",
    imageSrc:
      "https://www.figma.com/api/mcp/asset/bee7ff00-bed8-46cd-99ee-4fe13685a78f",
    imageAlt: "Confluence interface with suggested action prompts",
    meta: "Confluence · Activation Strategy",
    title: "From Aha to mastery strategy",
    description:
      "Built a clearer path from first value moment to repeat usage through rapid experiments and message testing.",
    href: "https://www.atlassian.com/software/confluence",
  },
  {
    id: "rovo-awareness",
    imageSrc:
      "https://www.figma.com/api/mcp/asset/1b1dcee8-1a78-47f6-8ff9-22b624c80bd8",
    imageAlt: "Product marketing composition highlighting Atlassian AI",
    meta: "Rovo · Awareness Campaign",
    title: "Increasing AI feature discoverability",
    description:
      "Led a one-week sprint that improved awareness and engagement for Atlassian AI touchpoints in Confluence.",
    href: "https://www.atlassian.com/software/rovo",
    cardBg: "#dee7f6",
  },
  {
    id: "editor-foundations",
    imageSrc:
      "https://www.figma.com/api/mcp/asset/c896dd1a-52a2-41a7-8838-ff554bce1c21",
    imageAlt: "Company Hub editing interface and publishing workflow",
    meta: "Confluence Company Hub · Editing Foundations",
    title: "Building a platform app experience",
    description:
      "Defined reusable patterns and scalable editing foundations to support teams shipping trusted company knowledge.",
    href: "https://www.atlassian.com/software/confluence",
    cardBg: "#e6def7",
  },
];

export function SecondaryProjectsSection() {
  return (
    <section className={styles.section} aria-label="Secondary project highlights">
      <div className={styles.grid}>
        {SECONDARY_PROJECTS.map((project) => (
          <article
            key={project.id}
            className={styles.card}
            style={
              project.cardBg
                ? ({ ["--secondary-card-bg" as string]: project.cardBg } as CSSProperties)
                : undefined
            }
          >
            <div className={styles.imageWrap}>
              <img
                className={styles.image}
                src={project.imageSrc}
                alt={project.imageAlt}
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className={styles.content}>
              <p className={styles.meta}>{project.meta}</p>
              <h3 className={styles.title}>{project.title}</h3>
              <p className={styles.description}>{project.description}</p>
              <a
                className={styles.cta}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                View project
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
