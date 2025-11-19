import React, { useState, useEffect } from "react";
import styles from "../pages/HomePage/styles/HomePage.module.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3100/api";

const ItemCard = ({ item, onClick }) => {
  const [claimCount, setClaimCount] = useState(0);
  const rawUrl = item.images && item.images.length ? item.images[0] : null;
  let thumbnail = "/placeholder.png";

  if (rawUrl) {
    if (rawUrl.includes("/upload/")) {
      thumbnail = rawUrl.replace(
        "/upload/",
        "/upload/w_400,h_260,c_fill,q_auto,f_auto/"
      );
    } else if (rawUrl.startsWith("http")) {
      thumbnail = rawUrl;
    } else {
      const base = (
        process.env.REACT_APP_API_URL || "http://localhost:3100/api"
      ).replace(/\/api$/, "");
      thumbnail = `${base}${rawUrl}`;
    }
  }

  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  // Fetch claim count for this item
  useEffect(() => {
    if (item._id && item.status !== "claimed" && item.status !== "reported") {
      fetch(`${API_BASE_URL}/claims/count/${item._id}`)
        .then(res => res.json())
        .then(data => setClaimCount(data.count || 0))
        .catch(err => console.error("Error fetching claim count:", err));
    }
  }, [item._id, item.status]);

  return (
    <div
      className={styles.card}
      onClick={() => onClick(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick(item);
      }}
      style={{
        borderLeft:
          item.status === "lost" ? "4px solid #e53e3e" : "4px solid #38a169",
      }}
    >
      <div className={styles.cardImageWrap}>
        {rawUrl ? (
          <img
            src={thumbnail}
            alt={item.title}
            className={styles.cardImage}
            onError={(e) => {
              e.target.src = "/placeholder.png";
            }}
          />
        ) : (
          <div className={styles.lostItemPlaceholder}>
            <h3 className={styles.lostItemTitle}>{item.title}</h3>
          </div>
        )}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{item.title}</h3>
          <span
            className={styles.statusPill}
            style={{
              backgroundColor: item.status === "lost" ? "#ffe6e6ff" : "#c6f6d5",
              color: item.status === "lost" ? "#e53e3e" : "#38a169",
            }}
          >
            {item.status.toUpperCase()}
          </span>
        </div>

        <p className={styles.cardDescription}>
          {item.description.length > 120
            ? item.description.substring(0, 120) + "..."
            : item.description}
        </p>

        <div className={styles.cardMeta}>
          <span className={styles.cardLocation}>📍 {item.location}</span>
          <span className={styles.cardDate}>📅 {formattedDate}</span>
        </div>
        
        {claimCount > 0 && (
          <div className={styles.claimBadge}>
            📢 {claimCount} {claimCount === 1 ? 'claim' : 'claims'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCard;