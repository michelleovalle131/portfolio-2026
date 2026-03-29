import { FieldNotesNav } from "./components/FieldNotesNav/FieldNotesNav";
import { Hero } from "./components/Hero/Hero";
import { MouseTrail } from "./components/MouseTrail/MouseTrail";
import { MemberBenefitsSection } from "./components/MemberBenefitsSection/MemberBenefitsSection";
import { SplitViewportSection } from "./components/SplitViewportSection/SplitViewportSection";
import { StampBalanceSection } from "./components/StampBalanceSection/StampBalanceSection";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.shell}>
      <div className={styles.main}>
        <Hero />
        <StampBalanceSection />
        <MemberBenefitsSection />
        <SplitViewportSection />
      </div>
      <MouseTrail />
      <FieldNotesNav />
    </div>
  );
}

export default App;
