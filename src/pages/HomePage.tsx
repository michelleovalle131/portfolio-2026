import { HeroSection } from "../components/HeroSection/HeroSection";
import { FunFactsSection } from "../components/FunFactsSection/FunFactsSection";
import { Footer } from "../components/Footer/Footer";
import { IntroSection } from "../components/IntroSection/IntroSection";
import { FeaturedProjectSection } from "../components/FeaturedProjectSection/FeaturedProjectSection";
import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./HomePage.module.css";

/**
 * Scroll motion. The live site always uses Screenprint. On the local dev
 * server the other prototypes stay available to keep testing, from the
 * address bar or the switch at the bottom of the page:
 *   /                  screenprint (default) — images print in on scroll
 *   /?motion=sheets    pulled sheets — sections stack as you scroll
 *   /?motion=fold      fold-out booklet — sections unfold left to right
 */
const MODES = [
  { id: "ink", label: "Screenprint", to: "/" },
  { id: "sheets", label: "Pulled sheets", to: "/?motion=sheets" },
  { id: "fold", label: "Booklet", to: "/?motion=fold" },
] as const;

/** Marks each section (and the footer) [data-inked] once it is well into
 * view, and clears the mark when it has fully left so it prints again on the
 * next visit. src/styles/ink.css plays the heading flood from that cue. */
function useInkOnEnter(root: React.RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const el = root.current;
    if (!enabled || !el) return;
    const sheets = el.querySelectorAll<HTMLElement>("section, footer");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            entry.target.setAttribute("data-inked", "");
          } else if (!entry.isIntersecting) {
            entry.target.removeAttribute("data-inked");
          }
        }
      },
      { threshold: [0, 0.3] },
    );
    sheets.forEach((sheet) => observer.observe(sheet));
    return () => {
      observer.disconnect();
      sheets.forEach((sheet) => sheet.removeAttribute("data-inked"));
    };
  }, [root, enabled]);
}

export function HomePage() {
  // Tolerant of stray punctuation picked up when an address is copied from text
  const motion = new URLSearchParams(useLocation().search)
    .get("motion")
    ?.match(/^[a-z]+/)?.[0];
  const mode = import.meta.env.DEV
    ? (MODES.find((m) => m.id === motion)?.id ?? "ink")
    : "ink";
  const isFold = mode === "fold";
  const pageRef = useRef<HTMLDivElement>(null);
  useInkOnEnter(pageRef, mode === "ink");

  const panels = (
    <>
      {/* gallery="4x3" restores the 12-cell Figma grid */}
      <HeroSection gallery="3x3" />
      <IntroSection />
      <FeaturedProjectSection
        id="ai-overlays"
        layout="split"
        pageNumber="02/03"
        title="From Talking Head Video to Dynamic Presentation"
        description="An AI agent that turns a talking-head Loom into a dynamic video presentation, generating motion graphics from your words and your team’s context."
        backgroundSrc="/imgs/ai-overlays-bg.webp"
        screenshotSrc="/imgs/ai-overlays-ui.webp"
        screenshotAlt="Loom AI Overlays panel with type style options beside a sample video presentation"
        details={{
          meta: "Loom at Atlassian",
          tags: ["AI agent"],
          body: (
            <p>
              An AI agent that turns a talking-head Loom into a dynamic video
              presentation, generating motion graphics from your words and your
              team’s context.
            </p>
          ),
        }}
      />
      {/*
        Shelved for now — M1CA, Company Hub, Cositas Bonitas and Rovo.
        Components and case-study data are intact (src/data/projects.ts), and
        /projects/:id links still work. To bring them back, re-import and render:
          <PrimaryProjectsSection />   — M1CA + Company Hub
          <SecondaryProjectsSection /> — Cositas Bonitas + Rovo awareness
      */}
      <FunFactsSection scrollStrip={mode === "ink"} />
    </>
  );

  return (
    <div
      ref={pageRef}
      className={
        mode === "sheets" ? styles.press : mode === "ink" ? "motion-ink" : undefined
      }
    >
      {import.meta.env.DEV && (
        <nav className={styles.motionSwitch} aria-label="Scroll motion prototype">
          {MODES.map((m) => (
            <Link
              key={m.id}
              to={m.to}
              className={m.id === mode ? styles.motionActive : undefined}
            >
              {m.label}
            </Link>
          ))}
        </nav>
      )}
      {isFold ? (
        <div className={styles.fold}>
          <div className={styles.foldViewport}>
            <div className={styles.foldRow}>{panels}</div>
          </div>
        </div>
      ) : (
        panels
      )}
      <Footer />
    </div>
  );
}
