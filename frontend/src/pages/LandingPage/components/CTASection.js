import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/CTASection.module.css";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.cta}>
      <h2>Ready to Get Started?</h2>
      <p>Join thousands of students using our platform to recover lost items</p>
      <button
        className={styles.createAccount}
        onClick={() => navigate("/auth", { state: { initialView: "signup" } })}
      >
        Create Account
      </button>
    </section>
  );
};

export default CTASection;
