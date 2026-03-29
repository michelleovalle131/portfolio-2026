import heroStyles from "../components/Hero/Hero.module.css";
import { ABOUT_EXPERIENCE } from "./aboutExperience";
import { ABOUT_RECOGNITION } from "./aboutRecognition";
import styles from "./AboutPage.module.css";

export function AboutPage() {
  return (
    <main className={styles.main} id="about">
      <header className={styles.header} aria-labelledby="about-page-title">
        <p className={styles.eyebrow}>About</p>
        <h1 className={styles.title} id="about-page-title">
          Michelle Ovalle
        </h1>
        <p className={styles.lede}>
          Shaping products through thoughtful, intentional design.
        </p>
        <p className={styles.headerLinkedin}>
          <a
            className={heroStyles.secondaryLink}
            href="https://www.linkedin.com/in/michelleovalle/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Connect on LinkedIn
            <span className={heroStyles.arrow} aria-hidden>
              ↗
            </span>
          </a>
        </p>
      </header>

      <section
        className={styles.experience}
        aria-labelledby="about-experience-heading"
      >
        <p className={styles.eyebrow} id="about-experience-heading">
          Experience
        </p>
        <div className={styles.experienceBody}>
          {ABOUT_EXPERIENCE.map((job) => (
            <article key={job.id} className={styles.jobBlock}>
              <div className={styles.jobTopRow}>
                <h3 className={styles.jobTitle}>{job.headline}</h3>
                <p className={styles.jobDates}>{job.dateRange}</p>
              </div>
              <p className={styles.jobLevel}>{job.levelLine}</p>
              <p className={styles.jobDescription}>{job.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className={styles.recognition}
        id="about-recognition"
        aria-labelledby="about-recognition-heading"
      >
        <h2 className={styles.sectionHeading} id="about-recognition-heading">
          Recognition
        </h2>
        <div className={styles.experienceBody}>
          {ABOUT_RECOGNITION.map((item) => (
            <article key={item.id} className={styles.jobBlock}>
              <div className={styles.jobTopRow}>
                <h3 className={styles.jobTitle}>{item.headline}</h3>
                <p className={styles.jobDates}>{item.dateRange}</p>
              </div>
              <p className={styles.jobDescription}>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
