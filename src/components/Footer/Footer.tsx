import styles from "./Footer.module.css";
import { InkText } from "../InkText/InkText";

const LINKEDIN_URL = "https://www.linkedin.com/in/michelleovalle/";
const EMAIL = "movallecreative@gmail.com";

export function Footer() {
  return (
    <footer id="contact" className={styles.footer} aria-labelledby="contact-heading">
      <div className={`editorialGrid ${styles.grid}`}>
        <p className={styles.label} data-ink="stamp">Thanks for visiting</p>

        <h2 className={styles.heading} id="contact-heading">
          <InkText>
            {"I'm always happy to connect — about work, ideas, or just to say hello."}
          </InkText>
        </h2>

        <a
          className={`${styles.button} ${styles.email}`}
          href={`mailto:${EMAIL}`}
          data-ink="stamp"
        >
          Email
        </a>
        <a
          className={`${styles.button} ${styles.linkedin}`}
          data-ink="stamp"
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>

        <p className={styles.copyright} data-ink="stamp">
          © {new Date().getFullYear()} Michelle Ovalle. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
