import companyHubImg from "../../../imgs/hero-imgs/company-hub-preview.png";
import goldenPathImg from "../../../imgs/hero-imgs/Golden path strategy.png";
import rovoCampaignImg from "../../../imgs/hero-imgs/Rovo Campaign.png";
import styles from "./MemberBenefitsSection.module.css";

const IMPACT_CARDS = [
  {
    id: "company-hub",
    image: companyHubImg,
    imageAlt:
      "Laptop mockup of Company Hub with Idea Thread hub UI, floating editor panels, and launch controls",
    subtitle: "Confluence",
    title:
      "Company Hub—one place for trusted information, built for the whole company",
    description:
      "Led the design and launch of a centralized knowledge experience that helped users more easily find what they needed.",
  },
  {
    id: "aha-mastery-strategy",
    image: goldenPathImg,
    imageAlt:
      "Strategy and journey visuals for guiding users through Confluence value moments",
    subtitle: "Confluence",
    title: "From Aha to Mastery Strategy",
    description:
      "Engaging users by understanding their needs and guiding them through key value moments in Confluence.",
    imageRight: true,
  },
  {
    id: "rovo-awareness",
    image: rovoCampaignImg,
    imageAlt: "Rovo awareness campaign creative and messaging",
    subtitle: "Confluence",
    title: "Increasing Rovo awareness campaign",
    description:
      "Led a one-week sprint with successful results in increasing Rovo awareness among Atlassian Cloud users.",
  },
];

export function MemberBenefitsSection() {
  return (
    <section
      id="recent-impact"
      className={styles.section}
      aria-labelledby="recent-impact-heading"
    >
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Recent Impact</p>
        <h2 className={styles.headline} id="recent-impact-heading">
          A few recent highlights
        </h2>

        <div className={styles.cardList}>
          {IMPACT_CARDS.map((card) => (
            <article
              key={card.id}
              className={
                card.imageRight
                  ? `${styles.card} ${styles.cardImageRight}`
                  : styles.card
              }
            >
              <div className={styles.cardImage}>
                <img
                  src={card.image}
                  alt={card.imageAlt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className={styles.cardBody}>
                <p className={styles.cardSubtitle}>{card.subtitle}</p>
                <div className={styles.bodySpacer} aria-hidden />
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDescription}>{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
