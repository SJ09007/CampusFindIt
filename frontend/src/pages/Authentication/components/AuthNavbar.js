import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/AuthNavbar.module.css";

const AuthNavbar = ({ onSwitchToLogin, onSwitchToSignup }) => {
  const navigate = useNavigate();

  const navigateToSection = (sectionId) => {
    navigate("/", { state: { scrollTo: sectionId } });
  };

  return (
    <nav className={styles.navbar}>
      <div
        className={styles.logo}
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        Campus Lost & Found
      </div>
      <ul className={styles.navLinks}>
        <li onClick={() => navigate("/")}>Home</li>
        <li onClick={() => navigateToSection("how-it-works")}>How It Works</li>
        <li onClick={() => navigateToSection("contact")}>Contact</li>
      </ul>
      <div className={styles.authButtons}>
        <button
          className={styles.login}
          onClick={onSwitchToLogin}
        >
          Login
        </button>
        <button
          className={styles.signup}
          onClick={onSwitchToSignup}
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
};

export default AuthNavbar;
