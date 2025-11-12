// ItemDetailModal.js
import React, { useState } from "react";
import styles from "../styles/ItemDetailModal.module.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE || "http://localhost:3100";

const ItemDetailModal = ({ item, onClose, onClaimSuccess }) => {
  const [claiming, setClaiming] = useState(false);

  const handleClaim = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("You must be logged in to claim an item.");
      return;
    }

    if (!window.confirm("Are you sure you want to claim this item?")) return;

    setClaiming(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/claims/add/${item._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: "I want to claim this item" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to submit claim");
      }

      alert("Claim submitted successfully.");
      if (onClaimSuccess) onClaimSuccess();
      onClose();
    } catch (err) {
      console.error("Claim error:", err);
      alert(err.message || "Claim failed.");
    } finally {
      setClaiming(false);
    }
  };

  // Determine main image and thumbs (handle cloudinary and local paths)
  const images = item.images && item.images.length ? item.images : [];
  const mainImage = images[0] || "/placeholder.png";

  const getTransformed = (url, transform) => {
    if (!url) return "/placeholder.png";
    if (url.includes("/upload/")) {
      return url.replace("/upload/", `/upload/${transform}/`);
    }
    if (url.startsWith("http")) return url;
    return `${process.env.REACT_APP_API_BASE || "http://localhost:3100"}${url}`;
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <div className={styles.content}>
          <div className={styles.left}>
            <img
              src={getTransformed(mainImage, "w_900,c_fill,q_auto,f_auto")}
              alt={item.title}
              className={styles.mainImage}
              onError={(e) => (e.target.src = "/placeholder.png")}
            />

            <div className={styles.gallery}>
              {images.length > 0 ? (
                images.map((img, idx) => (
                  <img
                    key={idx}
                    src={getTransformed(img, "w_300,c_fill,q_auto,f_auto")}
                    alt={`${item.title}-${idx}`}
                    className={styles.thumb}
                    onClick={() => {
                      // replace main image on click
                      const el = document.querySelector(`.${styles.mainImage}`);
                      if (el)
                        el.src = getTransformed(
                          img,
                          "w_900,c_fill,q_auto,f_auto"
                        );
                    }}
                  />
                ))
              ) : (
                <img
                  src="/placeholder.png"
                  alt="placeholder"
                  className={styles.thumb}
                />
              )}
            </div>
          </div>

          <div className={styles.right}>
            <h2>{item.title}</h2>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <span
                className={styles.statusPill}
                style={{
                  background: item.status === "lost" ? "#ffecec" : "#ecffef",
                  color: item.status === "lost" ? "#b91c1c" : "#15803d",
                }}
              >
                {item.status.toUpperCase()}
              </span>
              <span style={{ color: "#555" }}>
                {new Date(item.date).toLocaleString()}
              </span>
            </div>

            <p style={{ whiteSpace: "pre-wrap", color: "#333" }}>
              {item.description}
            </p>

            <p style={{ marginTop: 12 }}>
              <strong>Location:</strong> {item.location}
            </p>

            <div style={{ marginTop: 18 }}>
              {item.status === "found" ? (
                <button
                  className={styles.primary}
                  onClick={handleClaim}
                  disabled={claiming}
                >
                  {claiming ? "Submitting..." : "Claim this item"}
                </button>
              ) : (
                <div style={{ color: "#666" }}>
                  If this is your item, mark it as reunited from your posted
                  items.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;
