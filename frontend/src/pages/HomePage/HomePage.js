import React from "react";
import styles from "./styles/HomePage.module.css";
import Navbar from "./components/HomeNavbar";

const HomePage = () => {
  return (
    <div className={styles.pageContainer}>
      <Navbar />

      {/* Search bar */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search for your lost item..."
          className={styles.searchInput}
        />
        <button className={styles.filterButton}>☰</button>
      </div>

      {/* Recently Lost Items */}
      <section className={styles.section}>
        <h3>Recently Lost items</h3>
        <div className={styles.grid}>
          <div className={styles.card}></div>
          <div className={styles.card}></div>
          <div className={styles.card}></div>
          <div className={styles.card}></div>
        </div>
        <a href="#" className={styles.viewMore}>
          view more
        </a>
      </section>

      {/* Recently Found Items */}
      <section className={styles.section}>
        <h3>Recently Found items</h3>
        <div className={styles.grid}>
          <div className={styles.card}></div>
          <div className={styles.card}></div>
          <div className={styles.card}></div>
        </div>
        <a href="#" className={styles.viewMore}>
          view more
        </a>
      </section>
    </div>
  );
};

export default HomePage;
