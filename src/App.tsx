import { Hero } from "./components/Hero/Hero";
import { MemberBenefitsSection } from "./components/MemberBenefitsSection/MemberBenefitsSection";
import { SplitViewportSection } from "./components/SplitViewportSection/SplitViewportSection";
import { StampBalanceSection } from "./components/StampBalanceSection/StampBalanceSection";

function App() {
  return (
    <>
      <Hero />
      <StampBalanceSection />
      <MemberBenefitsSection />
      <SplitViewportSection />
    </>
  );
}

export default App;
