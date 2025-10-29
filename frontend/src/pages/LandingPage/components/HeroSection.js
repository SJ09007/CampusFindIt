import React from "react";
import styles from "../styles/HeroSection.module.css";

// CRITICAL CHANGE: Accept onNavigate prop
const HeroSection = ({ onNavigate }) => {
  return (
    <section className={styles.hero}>
      <div className={styles.textContent}>
        <h1>Lost Something? Found Something?</h1>
        <p>
          Connect with your campus community to reunite lost items with their
          owners quickly and securely.
        </p>
        <div className={styles.buttons}>
          {/* CRITICAL CHANGE: Call onNavigate on button click */}
          <button
            className={styles.btnPrimary}
            onClick={() => onNavigate("auth")}
          >
            Report Lost Item
          </button>
          <button
            className={styles.btnSecondary}
            onClick={() => onNavigate("auth")}
          >
            Report Found Item
          </button>
        </div>
      </div>
      <div className={styles.illustration}>
        Campus Lost & Found Illustration
      </div>
    </section>
  );
};

export default HeroSection;
