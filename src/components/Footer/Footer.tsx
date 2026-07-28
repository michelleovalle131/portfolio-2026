import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const LINKEDIN_URL = "https://www.linkedin.com/in/michelleovalle/";
const EMAIL = "movallecreative@gmail.com";

export function Footer() {
  return (
    <footer
      id="thank-you"
      className={styles.footer}
      aria-labelledby="thank-you-heading"
    >
      <div className={styles.bar}>
        <Link className={styles.logoLink} to="/" aria-label="Home">
          <img
            className={styles.logo}
            src="/imgs/MO-Logo.svg"
            alt=""
            width={24}
            height={24}
            decoding="async"
          />
        </Link>

        <h2 className={styles.heading} id="thank-you-heading">
          Thank you
        </h2>

        <div className={styles.links}>
          <a
            className={styles.link}
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a className={styles.link} href={`mailto:${EMAIL}`}>
            Connect
          </a>
        </div>
      </div>
    </footer>
  );
}
