import React from "react";
import styles from "../styles/Navbar.module.css";


const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>🔍 FindIt</div>
      <ul className={styles.links}>
        <li>Home</li>
        <li>Browse Items</li>
        <li>Report Lost</li>
        <li>Report Found</li>
      </ul>
      <div className={styles.actions}>
        <input type="text" placeholder="Search for lost or found items" />
        <button>Post Item</button>
      </div>
    </nav>
  );
};

export default Navbar;
