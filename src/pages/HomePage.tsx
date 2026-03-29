import { Hero } from "../components/Hero/Hero";
import { MemberBenefitsSection } from "../components/MemberBenefitsSection/MemberBenefitsSection";
import { SplitViewportSection } from "../components/SplitViewportSection/SplitViewportSection";
import { ThankYouStampsSection } from "../components/ThankYouStampsSection/ThankYouStampsSection";
import { StampBalanceSection } from "../components/StampBalanceSection/StampBalanceSection";

type HomePageProps = {
  remixEpoch: number;
};

export function HomePage({ remixEpoch }: HomePageProps) {
  return (
    <>
      <Hero remixEpoch={remixEpoch} />
      <StampBalanceSection />
      <MemberBenefitsSection />
      <SplitViewportSection />
      <ThankYouStampsSection remixEpoch={remixEpoch} />
    </>
  );
}
