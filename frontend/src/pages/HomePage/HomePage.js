import React, { useState, useEffect } from "react";
import styles from "./styles/HomePage.module.css";
import Navbar from "./components/HomeNavbar";
import ReportItemForm from "./components/ReportItemForm";
import ItemDetailModal from "./components/ItemDetailModal";

// Component to represent an item card (now clickable)
const ItemCard = ({ item, onClick }) => {
  const formattedDate = new Date(item.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className={styles.card}
      onClick={() => onClick(item)}
      style={{
        background: item.status === "lost" ? "#fff5f5" : "#f5fff5",
        borderLeft:
          item.status === "lost" ? "4px solid #e53e3e" : "4px solid #38a169",
      }}
    >
      <h3 className={styles.cardTitle}>{item.title}</h3>
      <p className={styles.cardDescription}>
        {item.description.substring(0, 120)}
        {item.description.length > 120 ? "..." : ""}
      </p>
      <div>
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "0.8rem",
            backgroundColor: item.status === "lost" ? "#fed7d7" : "#c6f6d5",
            color: item.status === "lost" ? "#e53e3e" : "#38a169",
            fontWeight: "500",
          }}
        >
          {item.category}
        </span>
      </div>
      <div className={styles.cardMeta}>
        <div className={styles.cardLocation}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          {item.location}
        </div>
        <div className={styles.cardDate}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {formattedDate}
        </div>
      </div>
    </div>
  );
};

// Component now accepts the onLogout prop from App.js
const HomePage = ({ onLogout }) => {
  // State for internal page view: 'list' (default) or 'report' (form)
  const [currentView, setCurrentView] = useState("list");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger

  // State for modal: holds the item object to display in the modal
  const [selectedItem, setSelectedItem] = useState(null);

  // Filtered lists
  const lostItems = items.filter((item) => item.status === "lost");
  const foundItems = items.filter((item) => item.status === "found");

  // --- Modal Handlers ---
  const openModal = (item) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  // This function is called when a claim is successfully submitted in the modal
  const handleClaimSuccess = () => {
    // Close the modal and refresh the list to potentially show updated item status
    closeModal();
    fetchItems();
  };

  // --- API Call to Fetch Items ---
  const fetchItems = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:3100/api/items/getall", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let errorData = await response.json();
        throw new Error(
          errorData.error || errorData.message || "Failed to fetch items."
        );
      }

      const data = await response.json();
      setItems(data);
    } catch (err) {
      console.error("Fetch Items Error:", err);
      setError(err.message || "Could not load items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch items when view changes to list or when refreshTrigger changes
    if (currentView === "list") {
      fetchItems();
    }
  }, [currentView, refreshTrigger]);

  // --- Render Functions ---

  const renderItemGrid = (data, title) => (
    <section className={styles.section}>
      <h3>
        {title} ({data.length})
      </h3>
      {data.length === 0 ? (
        <p>
          No items currently listed as{" "}
          {title.toLowerCase().replace(" items", "")}.
        </p>
      ) : (
        <div className={styles.grid}>
          {data.slice(0, 4).map(
            (
              item // Show only the first 4 for 'Recently'
            ) => (
              // Pass the openModal function to make the card clickable
              <ItemCard key={item._id} item={item} onClick={openModal} />
            )
          )}
        </div>
      )}
      <button
        onClick={() => {
          /* TODO: Implement view more */
        }}
        className={styles.viewMore}
      >
        view more
      </button>
    </section>
  );

  const renderListView = () => (
    <>
      {/* Search bar */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search for your lost item..."
          className={styles.searchInput}
        />
        <button className={styles.filterButton}>☰</button>
      </div>

      {loading && (
        <p style={{ textAlign: "center", margin: "30px" }}>Loading items...</p>
      )}
      {error && (
        <p style={{ textAlign: "center", margin: "30px", color: "red" }}>
          Error: {error}
        </p>
      )}

      {!loading && !error && (
        <>
          {/* Recently Lost Items */}
          {renderItemGrid(lostItems, "Recently Lost Items")}

          {/* Recently Found Items */}
          {renderItemGrid(foundItems, "Recently Found Items")}
        </>
      )}
    </>
  );

  // --- Main Component Render ---
  return (
    <div className={styles.pageContainer}>
      {/* 🎯 CRITICAL CHANGE: Pass the onLogout prop to the Navbar */}
      <Navbar onNavigate={setCurrentView} onLogout={onLogout} />

      {/* Conditional Rendering based on view state */}
      {currentView === "list" && renderListView()}

      {currentView === "report" && (
        <div className={styles.section}>
          <ReportItemForm
            onSuccess={() => {
              setCurrentView("list");
              setRefreshTrigger((prev) => prev + 1); // Trigger refresh
            }}
          />
        </div>
      )}

      {/* Conditional Modal Rendering */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={closeModal}
          onClaimSuccess={handleClaimSuccess}
        />
      )}
    </div>
  );
};

export default HomePage;
