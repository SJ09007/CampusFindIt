import React from "react";
import styles from "../styles/HowItWorks.module.css";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className={styles.howItWorks}>
      <h2>How It Works</h2>
      <p>Simple steps to reunite lost items with their owners</p>
      <div className={styles.steps}>
        <div className={styles.step}>
          <div className={styles.stepNumber}>1</div>
          <h3>📝 Report Your Item</h3>
          <p>Create an account and report your lost or found item with photos, description, location, and date. Your contact info stays private.</p>
        </div>
        <div className={styles.step}>
          <div className={styles.stepNumber}>2</div>
          <h3>🔍 Browse & Search</h3>
          <p>Search through posted items by category, location, or date. Found something that matches? Click to view details and submit a claim.</p>
        </div>
        <div className={styles.step}>
          <div className={styles.stepNumber}>3</div>
          <h3>✅ Submit a Claim</h3>
          <p>Prove ownership by providing details about the item. For found items, describe where and when you found it. Claims are sent to the owner for review.</p>
        </div>
        <div className={styles.step}>
          <div className={styles.stepNumber}>4</div>
          <h3>🔔 Get Notified</h3>
          <p>Receive instant email and in-app notifications when someone claims your item or when your claim is reviewed by the owner.</p>
        </div>
        <div className={styles.step}>
          <div className={styles.stepNumber}>5</div>
          <h3>👍 Review Claims</h3>
          <p>Item owners review all claims in their profile. Approve legitimate claims to share contact information with the claimer securely.</p>
        </div>
        <div className={styles.step}>
          <div className={styles.stepNumber}>6</div>
          <h3>🤝 Connect & Reunite</h3>
          <p>Once approved, both parties receive each other's contact info via email. Arrange a safe meetup to return the item!</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
