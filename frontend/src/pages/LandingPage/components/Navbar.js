import React from "react";
import styles from "../styles/Navbar.module.css";

// CRITICAL CHANGE: Accept onNavigate prop
const Navbar = ({ onNavigate }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Campus Lost & Found</div>
      <ul className={styles.navLinks}>
        <li>Home</li>
        <li>How It Works</li>
        <li>Contact</li>
      </ul>
      <div className={styles.authButtons}>
        {/* CRITICAL CHANGE: Call onNavigate on button click */}
        <button className={styles.login} onClick={() => onNavigate("auth")}>
          Login
        </button>
        <button className={styles.signup} onClick={() => onNavigate("auth")}>
          Sign Up
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
