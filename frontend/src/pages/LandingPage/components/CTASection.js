import React from "react";
import styles from "../styles/CTASection.module.css";

const CTASection = () => {
  return (
    <section className={styles.cta}>
      <h2>Ready to Get Started?</h2>
      <p>Join thousands of students using our platform to recover lost items</p>
      <button className={styles.createAccount}>Create Account</button>
    </section>
  );
};

export default CTASection;
