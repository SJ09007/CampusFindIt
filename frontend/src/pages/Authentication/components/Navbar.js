import React from "react";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      {" "}
      <div className={styles.logo}>TheLOGO</div>{" "}
    </nav>
  );
};

export default Navbar;
