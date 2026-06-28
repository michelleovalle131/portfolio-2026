import { useLayoutEffect, useMemo, useRef, type CSSProperties } from "react";
import { labelFromStampBackground } from "../Hero/stampImagePool";
import FUN_FACTS_URLS from "virtual:fun-facts-imgs";
import styles from "./SplitViewportSection.module.css";

const TIERS = [
  {
    id: "life",
    label: "Life",
    panelSurface: "var(--surface-warm)",
    imageSrc: "/imgs/fun-facts/My lovely family.JPEG",
    panelImageSrc: "/imgs/fun-facts/Born in El Paso.jpeg",
    body: "From El Paso to Sydney and Shanghai, I've lived in 3 countries and 6 cities. Each place has shaped how I see, connect and create.",
  },
  {
    id: "craft",
    label: "Craft",
    panelSurface: "var(--accent-life)",
    imageSrc: "/imgs/paint-1.jpg",
    panelImageSrc: "/imgs/fun-facts/Linocut love.png",
    body: "I love disconnecting from the computer and crafting with my hands. Linocutting is currently my hobby of choice and reminds me to embrace imperfection.",
  },
  {
    id: "mind",
    label: "Mind",
    panelSurface: "var(--surface-blue)",
    imageSrc: "/imgs/fun-facts/stamp-balance-intro-sky.png",
    panelImageSrc: "/imgs/fun-facts/Collaging fun.jpg",
    body: "When I'm not designing you'll find me aspiring to be a yogi, wandering my city, reading or planning our next adventure.",
  },
] as const;

function resolveImageSrc(preferredSrc: string): string {
  const filename = preferredSrc.split("/").pop() ?? preferredSrc;
  let decodedFilename = filename;
  try {
    decodedFilename = decodeURIComponent(filename);
  } catch {
    /* keep encoded */
  }

  const fromPool = FUN_FACTS_URLS.find((url) => {
    const poolFile = url.split("/").pop() ?? "";
    try {
      return decodeURIComponent(poolFile) === decodedFilename;
    } catch {
      return poolFile === filename;
    }
  });

  return fromPool ?? preferredSrc;
}

/** Triangular weights centered at t = 0, 0.5, 1 for three tiers. */
function photoOpacities(scrollT: number, count: number): number[] {
  if (count <= 1) {
    return [1];
  }
  const segmentSize = 1 / (count - 1);
  return Array.from({ length: count }, (_, index) => {
    const center = index * segmentSize;
    const distance = Math.abs(scrollT - center) / segmentSize;
    return Math.max(0, 1 - distance);
  });
}

export function SplitViewportSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoPanelRef = useRef<HTMLDivElement>(null);
  const rightViewportRef = useRef<HTMLDivElement>(null);
  const rightStackRef = useRef<HTMLDivElement>(null);

  const tierPhotos = useMemo(
    () =>
      TIERS.map((tier) => {
        const src = resolveImageSrc(tier.imageSrc);
        const alt =
          labelFromStampBackground(`url("${src}")`) ||
          tier.label;
        return { src, alt };
      }),
    [],
  );

  const tierPanelImages = useMemo(
    () =>
      TIERS.map((tier) => {
        const src = resolveImageSrc(tier.panelImageSrc);
        const alt =
          labelFromStampBackground(`url("${src}")`) ||
          tier.label;
        return { src, alt };
      }),
    [],
  );

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const photoPanel = photoPanelRef.current;
    const viewport = rightViewportRef.current;
    const stack = rightStackRef.current;
    if (!section || !viewport || !stack) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const updateTierShift = () => {
      const vh = window.innerHeight;
      const docTop = section.getBoundingClientRect().top + window.scrollY;
      const sectionH = section.offsetHeight;
      const span = sectionH - vh;
      let t = span > 0 ? (window.scrollY - docTop) / span : 0;
      t = Math.max(0, Math.min(1, t));

      const viewH = viewport.clientHeight;
      const maxShift = Math.max(0, TIERS.length - 1) * viewH;
      const shift = t * maxShift;
      stack.style.transform = `translateY(${-shift}px)`;

      if (photoPanel && tierPhotos.length > 0) {
        const scrollT = reducedMotion
          ? Math.round(t * (TIERS.length - 1)) / (TIERS.length - 1)
          : t;
        const opacities = photoOpacities(scrollT, tierPhotos.length);
        opacities.forEach((opacity, index) => {
          photoPanel.style.setProperty(
            `--photo-${index}-opacity`,
            String(opacity),
          );
        });
      }
    };

    window.addEventListener("scroll", updateTierShift, { passive: true });
    window.addEventListener("resize", updateTierShift);
    const ro = new ResizeObserver(updateTierShift);
    ro.observe(section);
    ro.observe(viewport);
    updateTierShift();

    return () => {
      window.removeEventListener("scroll", updateTierShift);
      window.removeEventListener("resize", updateTierShift);
      ro.disconnect();
    };
  }, [tierPhotos.length]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={styles.section}
      aria-label="Life, craft, and mind"
    >
      <div className={styles.sectionSticky}>
        <div className={styles.sectionMain}>
          <div className={styles.left}>
            <div
              ref={photoPanelRef}
              className={styles.photoPanel}
              aria-hidden={tierPhotos.length === 0}
            >
              {tierPhotos.map((photo, index) => (
                <img
                  key={photo.src}
                  className={styles.photoLayer}
                  style={{
                    opacity: `var(--photo-${index}-opacity, ${index === 0 ? 1 : 0})`,
                  }}
                  src={photo.src}
                  alt={photo.alt}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                />
              ))}
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div
              ref={rightViewportRef}
              className={styles.rightViewport}
              aria-label="Life, Craft, and Mind — follows page scroll"
            >
              <div ref={rightStackRef} className={styles.rightStack}>
                {TIERS.map((tier, index) => {
                  const panelImage = tierPanelImages[index];
                  return (
                    <article
                      key={tier.id}
                      className={styles.snapPanel}
                      style={
                        { backgroundColor: tier.panelSurface } as CSSProperties
                      }
                      aria-labelledby={`tier-heading-${tier.id}`}
                    >
                      <p className={styles.meta}>
                        {`${String(index + 1).padStart(2, "0")} / ${String(TIERS.length).padStart(2, "0")}`}
                      </p>
                      {panelImage?.src ? (
                        <div className={styles.imageWrap}>
                          <img
                            className={styles.image}
                            src={panelImage.src}
                            alt={panelImage.alt}
                            loading="lazy"
                            decoding="async"
                            draggable={false}
                          />
                        </div>
                      ) : null}
                      <div className={styles.copyBlock}>
                        <h3
                          className={styles.tierTitle}
                          id={`tier-heading-${tier.id}`}
                        >
                          {tier.label}
                        </h3>
                        <p className={styles.tierBody}>{tier.body}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
