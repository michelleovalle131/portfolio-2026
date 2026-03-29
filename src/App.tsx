import { useCallback, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { FieldNotesNav } from "./components/FieldNotesNav/FieldNotesNav";
import { MouseTrail } from "./components/MouseTrail/MouseTrail";
import { AboutPage } from "./pages/AboutPage";
import { HomePage } from "./pages/HomePage";
import styles from "./App.module.css";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function App() {
  const [stampEpoch, setStampEpoch] = useState(0);
  const onPortfolioRefresh = useCallback(() => {
    setStampEpoch((n) => n + 1);
  }, []);

  return (
    <div className={styles.shell}>
      <ScrollToTop />
      <div className={styles.main}>
        <Routes>
          <Route
            path="/"
            element={<HomePage remixEpoch={stampEpoch} />}
          />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
      <MouseTrail />
      <FieldNotesNav onPortfolioRefresh={onPortfolioRefresh} />
    </div>
  );
}

export default App;
