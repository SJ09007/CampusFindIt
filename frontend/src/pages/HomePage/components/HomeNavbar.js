import React from "react";
import styles from "../styles/HomeNavbar.module.css";

const HomeNavbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>TheLOGO</div>
      <ul className={styles.menu}>
        <li>Lost items</li>
        <li>Found items</li>
        <li>About us</li>
        <li>Report item</li>
      </ul>
      <div className={styles.profile}>
        <div className={styles.avatar}></div>
        <span>You</span>
      </div>
    </nav>
  );
};

export default HomeNavbar;
