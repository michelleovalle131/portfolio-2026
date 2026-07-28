import styles from "./ContactSection.module.css";

const EMAIL = "hello@michelleovalle.com";

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
          Let&apos;s build something worth talking about.
        </h2>
        <p className={styles.body}>
          I&apos;m always happy to connect about product design, systems
          thinking, or just to say hello.
        </p>
        <a className={styles.cta} href={`mailto:${EMAIL}`}>
          Say hello
        </a>
      </div>
    </section>
  );
}
