import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo} onClick={scrollToTop} style={{ cursor: "pointer" }}>
        CampusFindIt
      </div>
      <ul className={styles.navLinks}>
        <li onClick={scrollToTop}>Home</li>
        <li onClick={() => scrollToSection("how-it-works")}>How It Works</li>
        <li onClick={() => scrollToSection("contact")}>Contact</li>
      </ul>
      <div className={styles.authButtons}>
        <button
          className={styles.login}
          onClick={() => navigate("/auth", { state: { initialView: "login" } })}
        >
          Login
        </button>
        <button
          className={styles.signup}
          onClick={() =>
            navigate("/auth", { state: { initialView: "signup" } })
          }
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
