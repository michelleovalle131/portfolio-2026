import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./Nav.module.css";

const DEFAULT_NAV_HEIGHT_PX = 64;

export function Nav() {
  const { pathname } = useLocation();
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      setShowTitle(false);
      return;
    }

    const target = document.getElementById("hero-title");
    if (!target) {
      setShowTitle(false);
      return;
    }

    const navHeight =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--nav-height",
        ),
      ) || DEFAULT_NAV_HEIGHT_PX;

    // Fires once the hero title scrolls up out from under the fixed nav bar.
    const observer = new IntersectionObserver(
      ([entry]) => setShowTitle(!entry.isIntersecting),
      { rootMargin: `-${navHeight}px 0px 0px 0px` },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <nav className={styles.nav} aria-label="Site navigation">
      <div className={styles.navInner}>
        <NavLink className={styles.logoLink} to="/" end aria-label="Home">
          <img
            className={styles.logo}
            src="/imgs/MO-Logo.svg"
            alt=""
            width={24}
            height={24}
            decoding="async"
          />
        </NavLink>

        <p
          className={[styles.navTitle, showTitle ? styles.navTitleVisible : ""]
            .filter(Boolean)
            .join(" ")}
          aria-hidden="true"
        >
          Design with heart &amp; mind
        </p>

        <NavLink
          className={({ isActive }) =>
            isActive ? `${styles.aboutLink} ${styles.aboutLinkActive}` : styles.aboutLink
          }
          to="/about"
        >
          About
        </NavLink>
      </div>
    </nav>
  );
}
