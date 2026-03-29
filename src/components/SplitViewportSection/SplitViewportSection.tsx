import type { CSSProperties } from "react";
import { useMemo } from "react";
import { Stamp } from "../Stamp/Stamp";
import { STAMP_META } from "../Hero/stampMeta";
import { STAMP_IMAGE_URLS } from "../Hero/stampImagePool";
import { buildScatterSlots } from "./scatterStampLayout";
import styles from "./SplitViewportSection.module.css";

const SCATTER_COUNT = 26;
const SCATTER_SLOTS = buildScatterSlots(SCATTER_COUNT);

const TIERS = [
  {
    id: "life",
    label: "Life",
    bg: "#f8d4e0",
    body: "From El Paso to Sydney and Shanghai, I've lived in 3 countries and 6 cities. Each place has shaped how I see, connect and create.",
  },
  {
    id: "craft",
    label: "Craft",
    bg: "#fff3b8",
    body: "I love disconnecting from the computer and crafting with my hands. Linocutting is currently my hobby of choice and reminds me to embrace imperfection.",
  },
  {
    id: "mind",
    label: "Mind",
    bg: "#bfe8fa",
    body: "When I'm not designing you'll find me aspiring to be a yogi, wandering my city, reading or planning our next adventure.",
  },
] as const;

function scatterBackgrounds(count: number): string[] {
  const urls = STAMP_IMAGE_URLS;
  const fallbacks = STAMP_META.map((s) => s.fallbackBg);
  if (urls.length === 0) {
    return Array.from({ length: count }, (_, i) => fallbacks[i % fallbacks.length]!);
  }
  return Array.from({ length: count }, (_, i) => {
    const url = urls[(i * 7) % urls.length]!;
    return `url("${url}") center / cover no-repeat, #ffffff`;
  });
}

export function SplitViewportSection() {
  const backgrounds = useMemo(
    () => scatterBackgrounds(SCATTER_COUNT),
    [],
  );

  return (
    <section className={styles.section} aria-label="Life, craft, and mind">
      <div className={styles.left}>
        <div className={styles.stampCanvas} aria-hidden>
          {SCATTER_SLOTS.map((slot, i) => {
            const meta = STAMP_META[i % STAMP_META.length]!;
            const bg = backgrounds[i] ?? meta.fallbackBg;
            return (
              <div
                key={`${slot.top}-${slot.left}-${i}`}
                className={styles.stampWrap}
                style={
                  {
                    "--scatter-top": slot.top,
                    "--scatter-left": slot.left,
                    "--scatter-z": slot.z,
                    "--scatter-r": `${slot.rotate}deg`,
                    "--scatter-s": slot.scale,
                  } as CSSProperties
                }
              >
                <Stamp
                  label={meta.label}
                  imageBackground={bg}
                  stampIndex={i}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={styles.rightScroller}
        tabIndex={0}
        aria-label="Scroll through Life, Craft, and Mind"
      >
        {TIERS.map((tier, index) => (
          <article
            key={tier.id}
            className={styles.snapPanel}
            style={{ backgroundColor: tier.bg }}
            aria-labelledby={`tier-heading-${tier.id}`}
          >
            <header className={styles.panelHeader}>
              <span className={styles.panelHeaderLabel}>{tier.label}</span>
              <span className={styles.panelHeaderIndex}>
                {`${String(index + 1).padStart(2, "0")}/${String(TIERS.length).padStart(2, "0")}`}
              </span>
            </header>
            <div className={styles.panelBody}>
              <h3 className={styles.tierTitle} id={`tier-heading-${tier.id}`}>
                {tier.label}
              </h3>
              <p className={styles.tierBody}>{tier.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
