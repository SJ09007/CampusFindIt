import React from "react";
import styles from "../styles/StatsSection.module.css";

const StatsSection = () => {
  return (
    <section className={styles.stats}>
      <div>
        <h3>2,847</h3>
        <p>Items Reunited</p>
      </div>
      <div>
        <h3>15,000+</h3>
        <p>Active Users</p>
      </div>
      <div>
        <h3>24hrs</h3>
        <p>Average Recovery Time</p>
      </div>
    </section>
  );
};

export default StatsSection;
