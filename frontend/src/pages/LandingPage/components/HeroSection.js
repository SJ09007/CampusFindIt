import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/HeroSection.module.css";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.hero}>
      <div className={styles.textContent}>
        <h1>Lost Something? Found Something?</h1>
        <p>
          Connect with your campus community to reunite lost items with their
          owners quickly and securely.
        </p>
        <div className={styles.buttons}>
          <button
            className={styles.btnPrimary}
            onClick={() => navigate("/auth")}
          >
            Report Lost Item
          </button>
          <button
            className={styles.btnSecondary}
            onClick={() => navigate("/auth")}
          >
            Report Found Item
          </button>
        </div>
      </div>
      <div className={styles.illustration}>
        <img 
          src="/landing_page_illustration.png" 
          alt="Campus Lost & Found Illustration"
          className={styles.illustrationImage}
        />
      </div>
    </section>
  );
};

export default HeroSection;
