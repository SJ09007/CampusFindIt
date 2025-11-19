// ItemDetailModal.js
import React, { useState } from "react";
import styles from "../styles/ItemDetailModal.module.css";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3100/api";

const ItemDetailModal = ({ item = {}, onClose = () => {}, onClaimSuccess }) => {
  // Get current user info
  const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
  const currentUserId = userInfo.id || userInfo._id;
  const isOwner = item?.postedBy === currentUserId;
  
  const [claiming, setClaiming] = useState(false);
  const [claimCount, setClaimCount] = useState(0);
  const [showDeclaration, setShowDeclaration] = useState(false);
  const [declarationAgreed, setDeclarationAgreed] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [description, setDescription] = useState("");
  const [descError, setDescError] = useState("");
  const [statusMessage, setStatusMessage] = useState(""); // info / error messages
  const [statusError, setStatusError] = useState(false);
  // Lost item found flow
  const [showFoundDeclaration, setShowFoundDeclaration] = useState(false);
  const [foundDeclarationAgreed, setFoundDeclarationAgreed] = useState(false);
  const [showFoundForm, setShowFoundForm] = useState(false);
  const [foundDetails, setFoundDetails] = useState({ whenWhere: "", extra: "" });
  const [foundError, setFoundError] = useState("");
    // Step 1: Show found declaration
    const handleFoundClick = () => {
      console.log("Found button clicked!");
      setShowFoundDeclaration(true);
      setStatusMessage("");
      setStatusError(false);
    };

    // Step 2: Agree to found declaration
    const handleFoundAgree = () => {
      if (!foundDeclarationAgreed) return;
      setShowFoundDeclaration(false);
      setShowFoundForm(true);
      setFoundError("");
    };

    // Step 3: Submit found report
    const handleSendToOwner = async () => {
      setStatusMessage("");
      setStatusError(false);
      setFoundError("");
      if (!foundDetails.whenWhere.trim()) {
        setFoundError("Please specify when and where you found the item.");
        return;
      }
      const maybeToken = localStorage.getItem("access_token");
      if (!maybeToken) {
        setStatusError(true);
        setStatusMessage("You must be logged in to report a found item.");
        return;
      }
      setClaiming(true);
      setStatusMessage("Submitting found report...");
      setStatusError(false);
      try {
        const res = await fetch(`${API_BASE_URL}/claims/addclaim/${item._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${maybeToken}`
          },
          credentials: "include",
          body: JSON.stringify({
            message: foundDetails.extra || "I found this item",
            foundLocation: foundDetails.whenWhere,
            foundDate: new Date().toISOString(),
            claimType: "found", // Reporting found a lost item
          }),
        });
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) {
          const errMsg = payload?.message || payload?.error || "Report failed";
          throw new Error(errMsg);
        }
        setStatusMessage("Report sent to owner successfully. They will review your report.");
        setStatusError(false);
        if (onClaimSuccess) onClaimSuccess();
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (err) {
        setStatusError(true);
        setStatusMessage(err.message || "Report failed.");
      } finally {
        setClaiming(false);
        setShowFoundForm(false);
      }
    };
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
  // Step 1: Show declaration
  const handleClaimClick = () => {
    console.log("Claim button clicked!");
    setShowDeclaration(true);
    setStatusMessage("");
    setStatusError(false);
  };

  // Step 2: Agree to declaration
  const handleAgree = () => {
    if (!declarationAgreed) return;
    setShowDeclaration(false);
    setShowDescription(true);
    setDescError("");
  };

  // Step 3: Submit claim with description
  const handleSendToFinder = async () => {
    setStatusMessage("");
    setStatusError(false);
    setDescError("");
    if (!description.trim() || description.length > 200) {
      setDescError("Please describe the item (max 200 words).");
      return;
    }
    const maybeToken = localStorage.getItem("access_token");
    if (!maybeToken) {
      setStatusError(true);
      setStatusMessage("You must be logged in to claim an item.");
      return;
    }
    setClaiming(true);
    setStatusMessage("Submitting claim...");
    setStatusError(false);
    try {
      const res = await fetch(`${API_BASE_URL}/claims/addclaim/${item._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${maybeToken}`
        },
        credentials: "include",
        body: JSON.stringify({
          message: description,
          claimType: "claim", // Claiming a found item
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errMsg = payload?.message || payload?.error || "Claim failed";
        throw new Error(errMsg);
      }
      setStatusMessage("Claim submitted successfully. The finder will review your claim.");
      setStatusError(false);
      if (onClaimSuccess) onClaimSuccess();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setStatusError(true);
      setStatusMessage(err.message || "Claim failed.");
    } finally {
      setClaiming(false);
      setShowDescription(false);
    }
  };

  const images = item.images && item.images.length ? item.images : [];
  
  // Keep mainImage in state (already init above). Ensure it updates when item prop changes.
  React.useEffect(() => {
    setMainImage(images[0] || "/placeholder.png");
  }, [item]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch claim count
  React.useEffect(() => {
    if (item._id && item.status !== "claimed" && item.status !== "reported") {
      fetch(`${API_BASE_URL}/claims/count/${item._id}`)
        .then(res => res.json())
        .then(data => setClaimCount(data.count || 0))
        .catch(err => console.error("Error fetching claim count:", err));
    }
  }, [item._id, item.status]);

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

            {claimCount > 0 && (
              <div style={{ 
                marginTop: 12, 
                padding: "8px 12px", 
                background: "#ebf8ff", 
                borderRadius: 6,
                color: "#2c5282",
                fontWeight: 600,
                fontSize: "0.95rem"
              }}>
                📢 {claimCount} {claimCount === 1 ? 'person has' : 'people have'} claimed this item
              </div>
            )}

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
                <>
                  {!showDeclaration && !showDescription && !isOwner && (
                    <button
                      className={styles.primary}
                      onClick={handleClaimClick}
                      disabled={claiming}
                    >
                      Claim this item
                    </button>
                  )}
                  {showDeclaration && (
                    <div style={{ background: "#f9f9f9", padding: 16, borderRadius: 8, marginBottom: 12 }}>
                      <h3>Declaration for Claiming a Lost Item</h3>
                      <p style={{ fontSize: "0.97em", marginBottom: 8 }}>
                        <strong>Declaration of Ownership and Responsibility</strong><br />
                        I hereby declare that I am the rightful owner of the item I am claiming through the Lost and Found Portal. I affirm that all information provided by me regarding the identity, description, and loss of this item is true, accurate, and complete to the best of my knowledge.<br /><br />
                        I fully understand that submitting false, misleading, or incomplete information is a serious offense. I accept complete responsibility for the authenticity of my claim and acknowledge that if any part of my statement is found to be incorrect, fabricated, or intentionally deceptive, strict disciplinary or legal action may be taken against me as per the applicable rules, regulations, and laws.<br /><br />
                        By submitting this declaration, I confirm my willingness to comply with all verification processes and agree that the authorities may revoke the item or take necessary action if discrepancies are discovered at any stage.
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input
                          type="checkbox"
                          id="declarationAgree"
                          checked={declarationAgreed}
                          onChange={e => setDeclarationAgreed(e.target.checked)}
                        />
                        <label htmlFor="declarationAgree">I have read and agree to the above declaration.</label>
                      </div>
                      <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
                        <button
                          className={styles.primary}
                          onClick={handleAgree}
                          disabled={!declarationAgreed}
                        >
                          I agree
                        </button>
                        <button
                          className={styles.secondary}
                          onClick={() => { setShowDeclaration(false); setDeclarationAgreed(false); }}
                        >
                          I do not agree
                        </button>
                      </div>
                    </div>
                  )}
                  {showDescription && (
                    <div style={{ background: "#f9f9f9", padding: 16, borderRadius: 8 }}>
                      <h3>Tell something about the item to prove it belongs to you:</h3>
                      <textarea
                        style={{ width: "100%", minHeight: 80, marginTop: 8, resize: "vertical" }}
                        maxLength={200}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Describe the item (max 200 words)"
                      />
                      <div style={{ color: "#b91c1c", fontSize: "0.95em", marginTop: 4 }}>{descError}</div>
                      <button
                        className={styles.primary}
                        style={{ marginTop: 10 }}
                        onClick={handleSendToFinder}
                        disabled={claiming}
                      >
                        {claiming ? "Sending..." : "Send to Finder"}
                      </button>
                    </div>
                  )}
                </>
              ) : item.status === "lost" ? (
                <>
                  {!showFoundDeclaration && !showFoundForm && !isOwner && (
                    <button
                      className={styles.primary}
                      onClick={handleFoundClick}
                      disabled={claiming}
                    >
                      Found this item
                    </button>
                  )}
                  {showFoundDeclaration && (
                    <div style={{ background: "#f9f9f9", padding: 16, borderRadius: 8, marginBottom: 12 }}>
                      <h3>Declaration of Reporting a Found Property</h3>
                      <p style={{ fontSize: "0.97em", marginBottom: 8 }}>
                        I hereby declare that the item I am submitting to the Lost and Found Portal was found by me at the stated location and under the circumstances I have described. I confirm that I am not making any false claims and that the item does not belong to me in any manner.<br /><br />
                        I affirm that all information provided by me is true, accurate, and complete to the best of my knowledge. I understand that providing incorrect or misleading details is a serious violation, and I accept full responsibility for the truthfulness of my report.<br /><br />
                        I acknowledge that if any part of my submission is later found to be untrue or intentionally falsified, strict disciplinary or legal action may be taken against me as per the applicable rules and laws. I agree to cooperate with any verification or follow-up that may be required by the authorities.
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input
                          type="checkbox"
                          id="foundDeclarationAgree"
                          checked={foundDeclarationAgreed}
                          onChange={e => setFoundDeclarationAgreed(e.target.checked)}
                        />
                        <label htmlFor="foundDeclarationAgree">I have read and agree to the above declaration.</label>
                      </div>
                      <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
                        <button
                          className={styles.primary}
                          onClick={handleFoundAgree}
                          disabled={!foundDeclarationAgreed}
                        >
                          I agree
                        </button>
                        <button
                          className={styles.secondary}
                          onClick={() => { setShowFoundDeclaration(false); setFoundDeclarationAgreed(false); }}
                        >
                          I do not agree
                        </button>
                      </div>
                    </div>
                  )}
                  {showFoundForm && (
                    <div style={{ background: "#f9f9f9", padding: 16, borderRadius: 8 }}>
                      <h3>Report Found Item</h3>
                      <label style={{ fontWeight: 500 }}>When and where did you find this item?</label>
                      <input
                        style={{ width: "100%", marginTop: 8, marginBottom: 8, padding: 6 }}
                        type="text"
                        value={foundDetails.whenWhere}
                        onChange={e => setFoundDetails({ ...foundDetails, whenWhere: e.target.value })}
                        placeholder="E.g., Found near library on Nov 10th"
                      />
                      <label style={{ fontWeight: 500 }}>Anything else to tell about the item?</label>
                      <textarea
                        style={{ width: "100%", minHeight: 60, marginTop: 8, resize: "vertical" }}
                        maxLength={200}
                        value={foundDetails.extra}
                        onChange={e => setFoundDetails({ ...foundDetails, extra: e.target.value })}
                        placeholder="Additional details (optional)"
                      />
                      <div style={{ color: "#b91c1c", fontSize: "0.95em", marginTop: 4 }}>{foundError}</div>
                      <button
                        className={styles.primary}
                        style={{ marginTop: 10 }}
                        onClick={handleSendToOwner}
                        disabled={claiming}
                      >
                        {claiming ? "Sending..." : "Send to Owner"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ color: "#666" }}>
                  If this is your item, mark it as reunited from your posted items.
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
