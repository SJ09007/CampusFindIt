import React from "react";
import styles from "../styles/HowItWorks.module.css";

const HowItWorks = () => {
  return (
    <section className={styles.howItWorks}>
      <h2>How It Works</h2>
      <p>Simple steps to reunite lost items with their owners</p>
      <div className={styles.steps}>
        <div>
          <h3>Report Lost/Found</h3>
          <p>Submit details with photos and description.</p>
        </div>
        <div>
          <h3>Search & Match</h3>
          <p>System automatically matches lost and found items.</p>
        </div>
        <div>
          <h3>Connect & Reunite</h3>
          <p>Get notified and arrange safe pickup.</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
