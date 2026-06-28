import { Hero } from "../components/Hero/Hero";
import { MemberBenefitsSection } from "../components/MemberBenefitsSection/MemberBenefitsSection";
import { SecondaryProjectsSection } from "../components/SecondaryProjectsSection/SecondaryProjectsSection";
import { SplitViewportSection } from "../components/SplitViewportSection/SplitViewportSection";
import { ThankYouStampsSection } from "../components/ThankYouStampsSection/ThankYouStampsSection";
import { StampBalanceSection } from "../components/StampBalanceSection/StampBalanceSection";

export function HomePage() {
  return (
    <>
      <Hero />
      <StampBalanceSection />
      <MemberBenefitsSection />
      <SecondaryProjectsSection />
      <SplitViewportSection />
      <ThankYouStampsSection />
    </>
  );
}
