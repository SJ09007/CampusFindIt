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
  const [items, setItems] = useState([]);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'report'
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const lostItems = items.filter((i) => i.status === "lost");
  const foundItems = items.filter((i) => i.status === "found");

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

  return (
    <div className={styles.pageContainer}>
      <HomeNavbar onNavigate={handleNavigate} onLogout={onLogout} />

      {currentView === "list" && (
        <>
          <div className={styles.header}>
            <h1 className={styles.title}>Campus Lost & Found</h1>
            <div className={styles.headerActions}>
              <button
                className={styles.primary}
                onClick={() => setCurrentView("report")}
              >
                Report Item
              </button>
              <button className={styles.secondary} onClick={fetchItems}>
                Refresh
              </button>
            </div>
          </div>

          {loading && (
            <p className={styles.loadingText}>Loading items, please wait...</p>
          )}
          {error && <p className={styles.errorText}>Error: {error}</p>}

          {!loading && !error && (
            <>
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Found Items</h2>
                <div className={styles.grid}>
                  {foundItems.length === 0 && (
                    <p className={styles.emptyText}>No found items yet.</p>
                  )}
                  {foundItems.map((item) => (
                    <ItemCard key={item._id} item={item} onClick={openModal} />
                  ))}
                </div>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Lost Items</h2>
                <div className={styles.grid}>
                  {lostItems.length === 0 && (
                    <p className={styles.emptyText}>No lost items yet.</p>
                  )}
                  {lostItems.map((item) => (
                    <ItemCard key={item._id} item={item} onClick={openModal} />
                  ))}
                </div>
              </section>
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
