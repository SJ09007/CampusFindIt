// src/pages/HomePage/HomePage.js
import React, { useEffect, useState } from "react";
import styles from "./styles/HomePage.module.css";
import HomeNavbar from "./components/HomeNavbar";
import ReportItemForm from "./components/ReportItemForm";
import ItemDetailModal from "./components/ItemDetailModal";
import ItemCard from "../../components/ItemCard";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3100/api";

const HomePage = ({ onLogout }) => {
  // Read URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const initialFilter = urlParams.get("filter") || "all";
  const initialView = urlParams.get("view") || "list";

  const [items, setItems] = useState([]);
  const [currentView, setCurrentView] = useState(initialView); // 'list' or 'report'
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState(initialFilter); // 'all', 'lost', 'found'
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllFound, setShowAllFound] = useState(false);
  const [showAllLost, setShowAllLost] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/items/getall`, {
        credentials: "include", // not required for public but safe & consistent
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to fetch items");
      setItems(data);
    } catch (err) {
      console.error("fetchItems error:", err);
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Filter items by search query
  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const lostItems = filteredItems.filter((i) => i.status === "lost");
  const foundItems = filteredItems.filter((i) => i.status === "found");

  // Limit to 2 rows (assuming 4 items per row on average)
  const ITEMS_PER_ROW = 4;
  const MAX_ROWS = 2;
  const MAX_ITEMS = ITEMS_PER_ROW * MAX_ROWS;

  const displayedFoundItems = showAllFound ? foundItems : foundItems.slice(0, MAX_ITEMS);
  const displayedLostItems = showAllLost ? lostItems : lostItems.slice(0, MAX_ITEMS);

  const openModal = (item) => setSelectedItem(item);
  const closeModal = () => setSelectedItem(null);

  const handleClaimSuccess = () => {
    closeModal();
    fetchItems();
  };

  const handleReportSuccess = () => {
    console.log("Report submitted successfully. Switching to list view.");
    fetchItems();
    setCurrentView("list");
  };

  const handleNavigate = (view) => {
    console.log(`Navigating to view: ${view}`);
    setCurrentView(view);
    if (view === "report") {
      setSelectedItem(null); // Reset selected item to avoid conflicts
    }
  };

  const handleFilterChange = (filterType) => {
    console.log(`Filter changed to: ${filterType}`);
    setFilter(filterType);
  };

  return (
    <div className={styles.pageContainer}>
      <HomeNavbar 
        onNavigate={handleNavigate} 
        onLogout={onLogout}
        onFilterChange={handleFilterChange}
        currentFilter={filter}
      />

      {currentView === "list" && (
        <>
          <div className={styles.header}>
            <h1 className={styles.title}>Campus Lost & Found</h1>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search by item name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  className={styles.clearBtn}
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {loading && (
            <p className={styles.loadingText}>Loading items, please wait...</p>
          )}
          {error && <p className={styles.errorText}>Error: {error}</p>}

          {!loading && !error && (
            <>
              {(filter === "all" || filter === "found") && (
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>Found Items</h2>
                  <div className={styles.grid}>
                    {foundItems.length === 0 && (
                      <p className={styles.emptyText}>No found items yet.</p>
                    )}
                    {displayedFoundItems.map((item) => (
                      <ItemCard key={item._id} item={item} onClick={openModal} />
                    ))}
                  </div>
                  {foundItems.length > MAX_ITEMS && (
                    <div className={styles.viewAllContainer}>
                      <button
                        className={styles.viewAllBtn}
                        onClick={() => setShowAllFound(!showAllFound)}
                      >
                        {showAllFound ? "Show Less" : `View All (${foundItems.length})`}
                      </button>
                    </div>
                  )}
                </section>
              )}

              {(filter === "all" || filter === "lost") && (
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>Lost Items</h2>
                  <div className={styles.grid}>
                    {lostItems.length === 0 && (
                      <p className={styles.emptyText}>No lost items yet.</p>
                    )}
                    {displayedLostItems.map((item) => (
                      <ItemCard key={item._id} item={item} onClick={openModal} />
                    ))}
                  </div>
                  {lostItems.length > MAX_ITEMS && (
                    <div className={styles.viewAllContainer}>
                      <button
                        className={styles.viewAllBtn}
                        onClick={() => setShowAllLost(!showAllLost)}
                      >
                        {showAllLost ? "Show Less" : `View All (${lostItems.length})`}
                      </button>
                    </div>
                  )}
                </section>
              )}
            </>
          )}
        </>
      )}

      {currentView === "report" && (
        <div className={styles.section}>
          <button
            className={styles.backBtn}
            onClick={() => setCurrentView("list")}
          >
            ◀ Back to List
          </button>
          <ReportItemForm key={Date.now()} onSuccess={handleReportSuccess} />
        </div>
      )}

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
