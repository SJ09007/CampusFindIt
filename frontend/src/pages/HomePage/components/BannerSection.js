import React from "react";
import styles from "../styles/BannerSection.module.css";


const BannerSection = () => {
  return (
    <section className={styles.banner}>
      <div className={styles.content}>
        <h1>Lost Something?</h1>
        <p>
          Our community-driven platform helps reunite people with their lost belongings.
          Browse found items or report what you lost.
        </p>
        <div className={styles.buttons}>
          <button className={styles.primary}>Browse Found Items</button>
          <button className={styles.secondary}>Report Lost Item</button>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
