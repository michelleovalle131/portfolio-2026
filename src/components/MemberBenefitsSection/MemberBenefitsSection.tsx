import styles from "./MemberBenefitsSection.module.css";

/** Files in `public/imgs/hero-imgs/` (served at `/imgs/hero-imgs/...`). */
function publicHeroImg(fileName: string): string {
  return `/imgs/hero-imgs/${encodeURIComponent(fileName)}`;
}

/** Files in `public/imgs/` (served at `/imgs/...`). */
function publicImg(fileName: string): string {
  return `/imgs/${encodeURIComponent(fileName)}`;
}

type ImpactCard = {
  id: string;
  image?: string;
  /** Public URL for MP4 (e.g. `/imgs/...`) — renders `<video>` instead of `<img>`. */
  videoSrc?: string;
  imageAlt: string;
  subtitle: string;
  title: string;
  description: string;
  imageRight?: boolean;
  imagePanelLight?: boolean;
  imageFitContain?: boolean;
  /** With cover, pin focal point to center (good for wide art). */
  imageCoverCenter?: boolean;
};

const IMPACT_CARDS: ImpactCard[] = [
  {
    id: "aha-mastery-strategy",
    image: publicHeroImg("Golden Path strategy.png"),
    imagePanelLight: true,
    imageAlt:
      "Strategy and journey visuals for guiding users through Confluence value moments",
    subtitle: "Improving Engagement and Activation",
    title: "From Aha to Mastery Strategy",
    description:
      "Led the vision for building a better engagement model for users by understanding their needs and guiding them through key value moment in Confluence. Experiments actively being run based off this strategy.",
  },
  {
    id: "rovo-awareness",
    image: publicHeroImg("Atlassian Rovo Campaign.png"),
    imageAlt: "Rovo awareness campaign creative and messaging",
    subtitle:
      "Increasing Discoverability of Atlassian's AI in Confluence",
    title: "Increasing Rovo awareness campaign",
    description:
      "Led a one-week sprint with successful results in increasing Rovo awareness among Atlassian Cloud users.",
    imageRight: true,
  },
  {
    id: "company-hub",
    videoSrc: publicImg("Wanderly hub.mp4"),
    imagePanelLight: true,
    imageCoverCenter: true,
    imageAlt:
      "Wanderly Hub product experience video with interface and motion",
    subtitle: "Building a platform app experience",
    title:
      "Company Hub—one place for trusted information, built for the whole company",
    description:
      "Led the design and launch of a centralized knowledge experience that helped users more easily find what they needed. Now being built as a platform app for other teams to adopt the framework we established.",
  },
];

type RecentImpactContentProps = {
  headingId: string;
};

/** Shared “Recent highlights / Working towards impact” block (home + About resume). */
export function RecentImpactContent({ headingId }: RecentImpactContentProps) {
  return (
    <div className={styles.inner}>
      <p className={styles.eyebrow}>Recent Highlights</p>
      <h2 className={styles.headline} id={headingId}>
        Working towards impact
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
            <div
              className={
                card.imagePanelLight
                  ? `${styles.cardImage} ${styles.cardImageLight}`
                  : styles.cardImage
              }
            >
              {card.videoSrc ? (
                <video
                  className={
                    card.imageCoverCenter ? styles.cardImageCoverCenter : undefined
                  }
                  src={card.videoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label={card.imageAlt}
                />
              ) : (
                <img
                  className={
                    [
                      card.imageFitContain ? styles.cardImageImgContain : "",
                      card.imageCoverCenter ? styles.cardImageCoverCenter : "",
                    ]
                      .filter(Boolean)
                      .join(" ") || undefined
                  }
                  src={card.image}
                  alt={card.imageAlt}
                  loading="lazy"
                  decoding="async"
                />
              )}
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardTopRow}>
                <p className={styles.cardSubtitle}>{card.subtitle}</p>
                <div className={styles.stampPlaceholder} aria-hidden />
              </div>
              <div className={styles.bodySpacer} aria-hidden />
              <div className={styles.cardTitleBlock}>
                <h3 className={styles.cardTitle}>
                  <span className={styles.cardTitleText}>{card.title}</span>
                </h3>
              </div>
              <p className={styles.cardDescription}>{card.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function MemberBenefitsSection() {
  return (
    <section
      id="recent-impact"
      className={styles.section}
      aria-labelledby="recent-impact-heading"
    >
      <RecentImpactContent headingId="recent-impact-heading" />
    </section>
  );
}
