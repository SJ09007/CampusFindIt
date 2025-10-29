import React from "react";
import styles from "../styles/CTASection.module.css";

// CRITICAL CHANGE: Accept onNavigate prop
const CTASection = ({ onNavigate }) => {
  return (
    <section className={styles.cta}>
      <h2>Ready to Get Started?</h2>
      <p>Join thousands of students using our platform to recover lost items</p>
      {/* CRITICAL CHANGE: Call onNavigate on button click */}
      <button
        className={styles.createAccount}
        onClick={() => onNavigate("auth")}
      >
        Create Account
      </button>
    </section>
  );
};

export default CTASection;
