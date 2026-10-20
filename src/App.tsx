import { Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import { AboutPage } from "./pages/AboutPage";
import { HomePage } from "./pages/HomePage";
import { useEffect } from "react";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  // POP covers the browser back button — it should restore the scroll
  // position the user had, not jump to top.
  const navigationType = useNavigationType();
  useEffect(() => {
    if (navigationType === "POP") return;
    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, navigationType]);
  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </>
  );
}

export default App;
