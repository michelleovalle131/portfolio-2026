import { Link } from "react-router-dom";
import { SECONDARY_PROJECTS } from "../../data/projects";
import styles from "./SecondaryProjectsSection.module.css";

export function SecondaryProjectsSection() {
  return (
    <section className={styles.section} aria-label="Secondary project highlights">
      <div className={styles.grid}>
        {SECONDARY_PROJECTS.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className={styles.card}
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
              <p className={styles.meta}>{project.kicker}</p>
              <h3 className={styles.title}>{project.title}</h3>
              <p className={styles.description}>{project.description}</p>
              <div className={styles.cta}>View project</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
