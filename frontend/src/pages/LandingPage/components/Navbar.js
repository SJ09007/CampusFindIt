import React from "react";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Campus Lost & Found</div>
      <ul className={styles.navLinks}>
        <li>Home</li>
        <li>How It Works</li>
        <li>Contact</li>
      </ul>
      <div className={styles.authButtons}>
        <button className={styles.login}>Login</button>
        <button className={styles.signup}>Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;
