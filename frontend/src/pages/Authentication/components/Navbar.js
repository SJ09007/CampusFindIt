import React from "react";
import styles from "../styles/Navbar.module.css";

// Now accepts onNavigate prop
const Navbar = ({ onNavigate }) => {
  // Determine if we are on the Landing Page (showing all links) or Auth Page (only showing logo/back)
  // We assume if onNavigate is present, it's the AuthPage Navbar being rendered,
  // but since we are using the same component for both, we keep the logic universal.

  const isLandingPage = !onNavigate || onNavigate.name !== "navigateTo"; // Simple heuristic

  return (
    <nav className={styles.navbar}>
      {/* CRITICAL CHANGE: Click handler on the logo to go back to landing screen */}
      <div
        className={styles.logo}
        onClick={() => onNavigate("landing")} // Navigates to the landing screen
        style={{ cursor: "pointer" }}
      >
        Campus Lost & Found
      </div>

      {/* Show navigation links and auth buttons only on the true Landing Page */}
      {/* We check if onNavigate is defined to prevent routing conflicts on the Auth Page */}
      {onNavigate && (
        <>
          <ul className={styles.navLinks}>
            {/* Anchor links for in-page scrolling */}
            <li>
              <a href="#hero">Home</a>
            </li>
            <li>
              <a href="#how-it-works">How It Works</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
          <div className={styles.authButtons}>
            {/* These buttons route to the auth page */}
            <button className={styles.login} onClick={() => onNavigate("auth")}>
              Login
            </button>
            <button
              className={styles.signup}
              onClick={() => onNavigate("auth")}
            >
              Sign Up
            </button>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
