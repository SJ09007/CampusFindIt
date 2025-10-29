import React, { useState, useEffect } from "react";
import styles from "../styles/ItemDetailModal.module.css";

// Helper component to manage the claims when the current user is the poster
const PosterClaimManager = ({ item, onReuniteSuccess }) => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reuniteLoading, setReuniteLoading] = useState(false);

  // --- API Call: Get Claims for this Item ---
  const fetchClaims = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Authentication required to view claims.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3100/api/claims/getclaims/${item._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch claims.");
      }
      // NOTE: The backend returns an array of ClaimedItem documents.
      // These documents contain a 'users' array (IDs of claimants).
      // We'll need to adjust the UI here if the backend structure is complex (e.g., users are not populated).
      setClaims(data);
    } catch (err) {
      console.error("Fetch Claims Error:", err);
      setError(err.message || "Could not load claim information.");
    } finally {
      setLoading(false);
    }
  };

  // --- API Call: Update Item Status (Reunite) ---
  const handleReunite = async (claimedUserId) => {
    const token = localStorage.getItem("access_token");

    setReuniteLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3100/api/items/updatestatus/${item._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // Send the ID of the user who is confirmed as the owner
          body: JSON.stringify({ userid: claimedUserId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update item status.");
      }

      alert("Item successfully marked as reunited! The list will refresh.");

      if (onReuniteSuccess) {
        onReuniteSuccess();
      }
    } catch (error) {
      console.error("Reunite Error:", error);
      setError(
        error.message || "An error occurred during reunion confirmation."
      );
    } finally {
      setReuniteLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [item._id]);

  if (loading) return <p className={styles.claimSection}>Loading claims...</p>;
  if (error)
    return (
      <p className={styles.claimSection} style={{ color: "red" }}>
        Error: {error}
      </p>
    );

  return (
    <div className={styles.claimSection}>
      <h4 className={styles.claimHeader}>Claim Management Panel</h4>

      {claims.length === 0 ? (
        <p>No claims have been submitted for this item yet.</p>
      ) : (
        claims.map((claim) => (
          <div key={claim._id} className={styles.claimEntry}>
            {/* Assuming the claim object has a populated 'users' array 
                            or that we are iterating over the users array inside the claim.
                            For simplicity, we show the first user ID found in the claim document. */}
            <p>
              Claim submitted by: <strong>User ID: {claim.users[0]}</strong>
            </p>

            <button
              className={styles.reuniteButton}
              onClick={() => handleReunite(claim.users[0])} // Use the first claimed user ID for simplicity
              disabled={reuniteLoading || !item.status === "lost"}
            >
              {reuniteLoading ? "Processing..." : "Mark as Reunited"}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

// --- Main Modal Component ---
const ItemDetailModal = ({ item, onClose, onClaimSuccess }) => {
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimMessage, setClaimMessage] = useState(null);

  // NOTE: This must match the ID stored during login (see LoginForm.js)
  const currentUserId = localStorage.getItem("user_info")
    ? JSON.parse(localStorage.getItem("user_info"))._id
    : null;

  // Check if the current user is the poster of the item
  const isPoster = currentUserId === item.postedBy;

  // Check item status (assuming 'claimed' or 'reported' means no more claims)
  const isClaimable = item.status !== "claimed" && item.status !== "reported";

  // --- API Call to Add Claim (for non-posters) ---
  const handleClaim = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setClaimMessage({
        type: "error",
        text: "You must be logged in to claim an item.",
      });
      return;
    }

    setClaimLoading(true);
    setClaimMessage(null);

    try {
      const response = await fetch(
        `http://localhost:3100/api/claims/addclaim/${item._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Pass token for authentication
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Check for "You have already claimed this item" or "Item has already been claimed"
        throw new Error(data.message || data || "Failed to submit claim.");
      }

      setClaimMessage({
        type: "success",
        text: "Claim submitted successfully! The item poster will be notified.",
      });

      if (onClaimSuccess) {
        onClaimSuccess(); // Refresh parent component list
      }
    } catch (error) {
      console.error("Claim Error:", error);
      // Error handling for string response vs JSON
      const errorMessage =
        typeof error.message === "string" &&
        error.message.startsWith("Failed to submit claim")
          ? error.toString().replace("Error: Failed to submit claim. ", "") // Extract message from plain text
          : error.message || "An error occurred while claiming.";

      setClaimMessage({ type: "error", text: errorMessage });
    } finally {
      setClaimLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <h2 className={styles.title}>{item.title}</h2>
        <p
          className={`${styles.statusPill} ${
            item.status === "lost" ? styles.statusLost : styles.statusFound
          }`}
        >
          {item.status.toUpperCase()}
        </p>

        <div className={styles.detailGrid}>
          <p>
            <strong>Category:</strong> {item.category}
          </p>
          <p>
            <strong>Location:</strong> {item.location}
          </p>
          <p>
            <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Posted By:</strong> {item.postedBy}
          </p>
        </div>

        <p className={styles.description}>
          <strong>Description:</strong> {item.description}
        </p>

        <div className={styles.actionArea}>
          {/* Conditional rendering for the ORIGINAL POSTER */}
          {isPoster ? (
            <PosterClaimManager
              item={item}
              onReuniteSuccess={onClaimSuccess} // Use onClaimSuccess to tell HomePage to refresh
            />
          ) : item.status === "claimed" || item.status === "reported" ? (
            <button className={styles.claimedButton} disabled>
              Item Has Been Reunited
            </button>
          ) : (
            // Standard CLAIM button for non-posters
            <button
              className={styles.claimButton}
              onClick={handleClaim}
              disabled={claimLoading || !isClaimable}
            >
              {claimLoading ? "Submitting Claim..." : "Claim This Item"}
            </button>
          )}

          {/* Display Messages for non-posters */}
          {!isPoster && claimMessage && (
            <p
              className={
                claimMessage.type === "error"
                  ? styles.errorText
                  : styles.successText
              }
            >
              {claimMessage.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;
