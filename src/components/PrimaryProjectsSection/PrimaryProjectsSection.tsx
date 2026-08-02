import { type CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import { FEATURED_PROJECTS } from "../../data/projects";
import styles from "./PrimaryProjectsSection.module.css";

const VIDEO_SRC_PATTERN = /\.(mp4|webm)$/i;

export function PrimaryProjectsSection() {
  const location = useLocation();
  return (
    <>
      {FEATURED_PROJECTS.map((project) => (
        <section
          key={project.id}
          id={project.id}
          className={styles.section}
          aria-label="Project highlight"
        >
          <Link
            to={`/projects/${project.id}`}
            state={{ backgroundLocation: location }}
            className={styles.card}
          >
            {/* Full-bleed atmospheric background */}
            {VIDEO_SRC_PATTERN.test(project.imageSrc) ? (
              <video
                className={styles.cardBgImage}
                src={project.imageSrc}
                aria-hidden="true"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                style={project.imgPosition ? { objectPosition: project.imgPosition } : undefined}
              />
            ) : (
              <img
                className={styles.cardBgImage}
                src={project.imageSrc}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                style={project.imgPosition ? { objectPosition: project.imgPosition } : undefined}
              />
            )}

            {/* Editorial color plate — anchored bottom-left */}
            <div
              className={styles.cardPlate}
              style={
                project.plateColor
                  ? ({ ["--project-card-bg" as string]: project.plateColor } as CSSProperties)
                  : undefined
              }
            >
              <p className={styles.kicker}>{project.kicker}</p>
              <h2 className={styles.cardTitle}>{project.title}</h2>
              <p className={styles.cardDescription}>{project.description}</p>
              <div className={styles.ctaRow}>
                <span>View project</span>
              </div>
            </div>
          </Link>
        </section>
      ))}
    </>
  );
}
