import { NavLink } from "react-router-dom";
import styles from "./FieldNotesNav.module.css";

export function FieldNotesNav() {
  return (
    <nav className={styles.nav} aria-label="Site navigation">
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
      <NavLink
        className={({ isActive }) =>
          isActive ? `${styles.aboutLink} ${styles.aboutLinkActive}` : styles.aboutLink
        }
        to="/about"
      >
        About
      </NavLink>
    </nav>
  );
}
