import { Route, Routes, useLocation } from "react-router-dom";
import { FieldNotesNav } from "./components/FieldNotesNav/FieldNotesNav";
import { AboutPage } from "./pages/AboutPage";
import { HomePage } from "./pages/HomePage";
import styles from "./App.module.css";
import { useEffect } from "react";

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
  return (
    <div className={styles.shell}>
      <ScrollToTop />
      <FieldNotesNav />
      <div className={styles.main}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
