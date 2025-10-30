import React from "react";
import styles from "../styles/LostItemsSection.module.css";

const LostItemsSection = () => {
  const items = [
    { title: "Small Brown Dog", time: "2 hours ago", location: "City Park" },
    { title: "Brown Leather Backpack", time: "3 hours ago", location: "Metro Station" },
    { title: "Gold Wedding Ring", time: "6 hours ago", location: "Royal Street" },
    { title: "Black Sunglasses", time: "1 day ago", location: "Square Garden" },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>Recently Lost Items</h2>
        <a href="#">View All</a>
      </div>
      <div className={styles.grid}>
        {items.map((item, idx) => (
          <div className={styles.card} key={idx}>
            <div className={styles.tag}>LOST</div>
            <h4>{item.title}</h4>
            <p>{item.time}</p>
            <span>{item.location}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LostItemsSection;
