// ItemDetailModal.js
import React, { useState } from "react";
import styles from "../styles/ItemDetailModal.module.css";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3100/api";

const ItemDetailModal = ({ item = {}, onClose = () => {}, onClaimSuccess }) => {
  const [claiming, setClaiming] = useState(false);
  const [statusMessage, setStatusMessage] = useState(""); // info / error messages
  const [statusError, setStatusError] = useState(false);
  const [mainImage, setMainImage] = useState(
    (item.images && item.images.length && item.images[0]) || "/placeholder.png"
  );

  // Helper: transform Cloudinary image or return absolute/local path
  const getTransformed = (url, transform) => {
    if (!url) return "/placeholder.png";
    if (url.includes("/upload/")) {
      // insert transform after /upload/
      return url.replace("/upload/", `/upload/${transform}/`);
    }
    if (url.startsWith("http")) return url;
    // local path fallback
    const base = process.env.REACT_APP_API_URL
      ? process.env.REACT_APP_API_URL.replace(/\/api$/, "")
      : "http://localhost:3100";
    return `${base}${url}`;
  };

  // Claim handler — uses credentials (cookie-based auth)
  const handleClaim = async () => {
    setStatusMessage("");
    setStatusError(false);

    // If your app uses cookie auth (recommended), don't rely on localStorage token
    // check for login UI or let server reject with 401 and handle it gracefully.
    const maybeToken = localStorage.getItem("access_token");
    if (!maybeToken) {
      // If you prefer to require token in localStorage, keep this check.
      // But note: backend auth checks cookie (httpOnly). You should instead open login flow.
      setStatusError(true);
      setStatusMessage("You must be logged in to claim an item.");
      return;
    }

    if (!window.confirm("Are you sure you want to claim this item?")) return;

    setClaiming(true);
    setStatusMessage("Submitting claim...");
    setStatusError(false);

    try {
      // NOTE: backend route is /api/claims/addclaim/:id
      const res = await fetch(`${API_BASE_URL}/claims/addclaim/${item._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Do NOT send Authorization header if backend uses cookie-based auth.
          // If your backend also accepts Bearer token, you can include it here.
        },
        credentials: "include", // important — sends httpOnly cookie
        body: JSON.stringify({ message: "I want to claim this item" }),
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errMsg =
          payload?.message ||
          payload?.error ||
          payload?.message ||
          "Claim failed";
        throw new Error(errMsg);
      }

      setStatusMessage("Claim submitted successfully.");
      setStatusError(false);

      if (onClaimSuccess) onClaimSuccess();
      // Optionally close the modal after short delay so user sees message
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      console.error("Claim error:", err);
      setStatusError(true);
      setStatusMessage(err.message || "Claim failed.");
    } finally {
      setClaiming(false);
    }
  };

  const images = item.images && item.images.length ? item.images : [];
  // Keep mainImage in state (already init above). Ensure it updates when item prop changes.
  React.useEffect(() => {
    setMainImage(images[0] || "/placeholder.png");
  }, [item]); // eslint-disable-line react-hooks/exhaustive-deps

  const safeDate = (() => {
    try {
      if (!item.date) return "";
      const d = new Date(item.date);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleString();
    } catch {
      return "";
    }
  })();

  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modal} role="dialog" aria-modal="true">
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <div className={styles.content}>
          {item.status !== "lost" && (
            <div className={styles.left}>
              <img
                src={getTransformed(mainImage, "w_900,c_fill,q_auto,f_auto")}
                alt={item.title || "item image"}
                className={styles.mainImage}
                onError={(e) => (e.target.src = "/placeholder.png")}
              />

              <div className={styles.gallery}>
                {images.length > 0 ? (
                  images.map((img, idx) => (
                    <img
                      key={idx}
                      src={getTransformed(img, "w_300,c_fill,q_auto,f_auto")}
                      alt={`${item.title || "item"}-${idx}`}
                      className={styles.thumb}
                      onClick={() => setMainImage(img)}
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
          )}

          <div className={styles.right}>
            <h2>{item.title || "Untitled item"}</h2>

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
                {(item.status || "").toUpperCase()}
              </span>
              <span style={{ color: "#555" }}>{safeDate}</span>
            </div>

            <p style={{ whiteSpace: "pre-wrap", color: "#333" }}>
              {item.description || "No description provided."}
            </p>

            <p style={{ marginTop: 12 }}>
              <strong>Location:</strong> {item.location || "Unknown"}
            </p>

            {statusMessage && (
              <div
                style={{
                  marginTop: 12,
                  padding: "8px 10px",
                  borderRadius: 6,
                  background: statusError ? "#ffecec" : "#ecffed",
                  color: statusError ? "#9b1111" : "#175b12",
                  fontWeight: 600,
                }}
              >
                {statusMessage}
              </div>
            )}

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
