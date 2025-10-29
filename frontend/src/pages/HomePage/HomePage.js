import React, { useState, useEffect } from "react";
import styles from "./styles/HomePage.module.css";
import Navbar from "./components/HomeNavbar";
import ReportItemForm from "./components/ReportItemForm";
import ItemDetailModal from "./components/ItemDetailModal";

// Component to represent an item card (now clickable)
const ItemCard = ({ item, onClick }) => (
  <div
    className={styles.card}
    style={{
      background: item.status === "lost" ? "#fde0e0" : "#e0fde0",
      border: item.status === "lost" ? "1px solid #e99" : "1px solid #9e9",
      cursor: "pointer", // Indicate clickability
    }}
    onClick={() => onClick(item)} // Pass the whole item object on click
  >
    <h4
      style={{
        fontSize: "1rem",
        fontWeight: "bold",
        textTransform: "capitalize",
      }}
    >
      {item.title}
    </h4>
    <p style={{ fontSize: "0.8rem" }}>{item.description.substring(0, 50)}...</p>
    <p style={{ fontSize: "0.7rem", marginTop: "5px" }}>
      **Status:**{" "}
      <span style={{ textTransform: "capitalize" }}>{item.status}</span>
    </p>
  </div>
);

// Component now accepts the onLogout prop from App.js
const HomePage = ({ onLogout }) => {
  // State for internal page view: 'list' (default) or 'report' (form)
  const [currentView, setCurrentView] = useState("list");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    // Only fetch items when the view is 'list'
    if (currentView === "list") {
      fetchItems();
    }
  }, [currentView]);

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
      <a href="#" className={styles.viewMore}>
        view more
      </a>
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
          {/* onReportSuccess callback returns to list view and refreshes */}
          <ReportItemForm
            onReportSuccess={() => {
              setCurrentView("list");
              fetchItems();
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
