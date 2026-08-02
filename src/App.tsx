import { Route, Routes, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";
import { Nav } from "./components/Nav/Nav";
import { AboutPage } from "./pages/AboutPage";
import { HomePage } from "./pages/HomePage";
import { ProjectPage } from "./pages/ProjectPage";
import { ProjectModalRoute } from "./pages/ProjectModalRoute";
import styles from "./App.module.css";
import { useEffect } from "react";

function ScrollToTop({ skip }: { skip: boolean }) {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (skip) return;
    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, skip]);
  return null;
}

function App() {
  const location = useLocation();
  // When a project card is clicked, its Link carries `state.backgroundLocation`
  // set to wherever the user was — that lets the main Routes keep rendering
  // that page underneath while a second Routes block renders the project as
  // a modal on top, matching Dribbble's shot-overlay pattern. Visiting
  // /projects/:id directly (no backgroundLocation) falls through to the
  // full ProjectPage instead, so links stay shareable.
  const backgroundLocation = (location.state as { backgroundLocation?: Location } | null)
    ?.backgroundLocation;

  return (
    <div className={styles.shell}>
      <ScrollToTop skip={!!backgroundLocation} />
      <Nav />
      <div className={styles.main}>
        <Routes location={backgroundLocation ?? location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects/:id" element={<ProjectPage />} />
        </Routes>
      </div>
      {backgroundLocation && (
        <Routes>
          <Route path="/projects/:id" element={<ProjectModalRoute />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
