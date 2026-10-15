import { HeroSection } from "../components/HeroSection/HeroSection";
import { FunFactsSection } from "../components/FunFactsSection/FunFactsSection";
import { Footer } from "../components/Footer/Footer";
import { IntroSection } from "../components/IntroSection/IntroSection";
import { FeaturedProjectSection } from "../components/FeaturedProjectSection/FeaturedProjectSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <FeaturedProjectSection
        id="ai-overlays"
        pageNumber="02/03"
        title="From Talking Head Video to Dynamic Presentation"
        description="An AI agent that turns a talking-head Loom into a dynamic video presentation, generating motion graphics from your words and your team’s context."
        backgroundSrc="/imgs/ai-overlays-bg.webp"
        screenshotSrc="/imgs/ai-overlays-ui.webp"
        screenshotAlt="Loom AI Overlays panel with type style options beside a sample video presentation"
      />
      {/*
        Shelved for now — M1CA, Company Hub, Cositas Bonitas and Rovo.
        Components and case-study data are intact (src/data/projects.ts), and
        /projects/:id links still work. To bring them back, re-import and render:
          <PrimaryProjectsSection />   — M1CA + Company Hub
          <SecondaryProjectsSection /> — Cositas Bonitas + Rovo awareness
      */}
      <FunFactsSection />
      <Footer />
    </>
  );
}
