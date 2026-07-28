import styles from "./ContactSection.module.css";

const EMAIL = "movallecreative@gmail.com";

export function ContactSection() {
  return (
    <section
      id="contact"
      className={styles.section}
      aria-labelledby="closing-heading"
    >
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Get in touch</p>
        <h2 className={styles.heading} id="closing-heading">
          I&apos;m always happy to connect — about work, ideas, or just to
          say hello.
        </h2>
        <p className={styles.body}>
          Shoot me an email and I&apos;ll get back to you shortly.
        </p>
        <a className={styles.cta} href={`mailto:${EMAIL}`}>
          Say hello
        </a>
      </div>
    </section>
  );
}
