import React from "react";
import styles from "../styles/FoundItemsSection.module.css";

const FoundItemsSection = () => {
  const items = [
    { title: "Black Leather Wallet", time: "2 hours ago", location: "Central Park" },
    { title: "iPhone 14 Pro", time: "5 days ago", location: "Campus NPC" },
    { title: "Red Bike Helmet", time: "1 day ago", location: "Riverside Park" },
    { title: "House Keys", time: "2 days ago", location: "Urban Station" },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>Recently Found Items</h2>
        <a href="#">View All</a>
      </div>
      <div className={styles.grid}>
        {items.map((item, idx) => (
          <div className={styles.card} key={idx}>
            <div className={styles.tag}>FOUND</div>
            <h4>{item.title}</h4>
            <p>{item.time}</p>
            <span>{item.location}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FoundItemsSection;
