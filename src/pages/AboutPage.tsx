import { Footer } from "../components/Footer/Footer";
import { SiteHeader } from "../components/SiteHeader/SiteHeader";
import { ABOUT_EXPERIENCE } from "./aboutExperience";
import { ABOUT_RECOGNITION } from "./aboutRecognition";
import styles from "./AboutPage.module.css";

export function AboutPage() {
  return (
    <>
      <main className={styles.main} id="about">
        {/* Intro + experience on the homepage's 16-column grid */}
        <div className={styles.grid}>
          <SiteHeader className={styles.siteHeader} />

          {/* No visible title — the page opens straight on Experience */}
          <h1 className={styles.visuallyHidden}>About Michelle Ovalle</h1>

          <section
            className={styles.experience}
            aria-labelledby="about-experience-heading"
          >
            <div className={styles.sectionIntro}>
              <p className={styles.pageNumber}>01/02</p>
              <h2 className={styles.sectionHeading} id="about-experience-heading">
                Experience through the years
              </h2>
            </div>
            <div className={styles.entries}>
              {ABOUT_EXPERIENCE.map((job) => (
                <article key={job.id} className={styles.jobBlock}>
                  <h3 className={styles.jobTitle}>{job.headline}</h3>
                  {/* Roles held there, each with its team and dates */}
                  {job.roles.map((role) => (
                    <div key={role.title} className={styles.role}>
                      <div className={styles.jobTopRow}>
                        <p className={styles.jobLevel}>{role.title}</p>
                        <p className={styles.jobDates}>{role.dateRange}</p>
                      </div>
                      <p className={styles.jobDescription}>{role.description}</p>
                    </div>
                  ))}
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      <section
        className={styles.recognition}
        id="about-recognition"
        aria-labelledby="about-recognition-heading"
      >
        <div className={styles.grid}>
          <div className={styles.sectionIntro}>
            <p className={styles.pageNumber}>02/02</p>
            <h2 className={styles.sectionHeading} id="about-recognition-heading">
              Highlights and Recognition
            </h2>
          </div>
          <div className={styles.entries}>
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
        </div>
      </section>

      <Footer />
    </>
  );
}
