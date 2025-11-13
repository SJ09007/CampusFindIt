// src/pages/HomePage/HomePage.js
import React, { useEffect, useState } from "react";
import styles from "./styles/HomePage.module.css";
import HomeNavbar from "./components/HomeNavbar";
import ReportItemForm from "./components/ReportItemForm";
import ItemDetailModal from "./components/ItemDetailModal";

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
    fetchItems();
    setCurrentView("list");
  };

  return (
    <div className={styles.pageContainer}>
      <HomeNavbar onNavigate={setCurrentView} onLogout={onLogout} />

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
          <ReportItemForm onSuccess={handleReportSuccess} />
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

const ItemCard = ({ item, onClick }) => {
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
        <img
          src={thumbnail}
          alt={item.title}
          className={styles.cardImage}
          onError={(e) => {
            e.target.src = "/placeholder.png";
          }}
        />
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{item.title}</h3>
          <span
            className={styles.statusPill}
            style={{
              backgroundColor: item.status === "lost" ? "#fed7d7" : "#c6f6d5",
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
      </div>
    </div>
  );
};

export default HomePage;
