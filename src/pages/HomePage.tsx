import { ContactSection } from "../components/ContactSection/ContactSection";
import { HeroSection } from "../components/HeroSection/HeroSection";
import { PrimaryProjectsSection } from "../components/PrimaryProjectsSection/PrimaryProjectsSection";
import { SecondaryProjectsSection } from "../components/SecondaryProjectsSection/SecondaryProjectsSection";
import { FunFactsSection } from "../components/FunFactsSection/FunFactsSection";
import { Footer } from "../components/Footer/Footer";
import { IntroSection } from "../components/IntroSection/IntroSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <PrimaryProjectsSection />
      <SecondaryProjectsSection />
      <FunFactsSection />
      <ContactSection />
      <Footer />
    </>
  );
}
