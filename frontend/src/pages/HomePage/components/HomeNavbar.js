import React, { useState, useEffect } from "react";
import styles from "../styles/HomeNavbar.module.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3100/api";

/**
 * @param {object} props
 * @param {function} props.onLogout - Function to log the user out and redirect to the landing page (comes from App.js).
 * @param {function} props.onFilterChange - Function to change the filter between 'all', 'lost', and 'found'.
 * @param {string} props.currentFilter - Current filter state ('all', 'lost', or 'found').
 */
const HomeNavbar = ({ onLogout, onFilterChange, currentFilter }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      fetch(`${API_BASE_URL}/notifications/unread-count`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setUnreadCount(data.count || 0))
        .catch(err => console.error("Error fetching unread count:", err));
    };

    fetchUnreadCount();
    // Refresh count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Get user initial from localStorage
  const getUserInitial = () => {
    const userInfo = localStorage.getItem("user_info");
    if (userInfo) {
      try {
        const userData = JSON.parse(userInfo);
        const username = userData.username || "";
        return username ? username[0].toUpperCase() : "U";
      } catch (err) {
        return "U";
      }
    }
    return "U";
  };

  const handleFilterClick = (filterType) => {
    if (onFilterChange) {
      // If on HomePage, use the filter function
      onFilterChange(filterType);
    } else {
      // If on other pages, navigate to home with filter
      window.location.href = `/home?filter=${filterType}`;
    }
  };

  const handleReportClick = () => {
    // Navigate to the report item page
    window.location.href = "/report-item";
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <img
          src="/csf 2.png"
          alt="CampusFindIt Logo"
          style={{
            height: "48px",
            width: "auto",
            verticalAlign: "middle",
          }}
        />
      </div>
      <ul className={styles.menu}>
        <li 
          onClick={() => window.location.href = "/"}
          style={{ cursor: "pointer" }}
        >
          Home
        </li>
        <li 
          onClick={() => handleFilterClick("all")}
          style={{ 
            fontWeight: currentFilter === "all" ? "bold" : "normal",
            color: currentFilter === "all" ? "#007bff" : "inherit"
          }}
        >
          Browse items
        </li>
        <li 
          onClick={() => handleFilterClick("lost")}
          style={{ 
            fontWeight: currentFilter === "lost" ? "bold" : "normal",
            color: currentFilter === "lost" ? "#007bff" : "inherit"
          }}
        >
          Lost items
        </li>
        <li 
          onClick={() => handleFilterClick("found")}
          style={{ 
            fontWeight: currentFilter === "found" ? "bold" : "normal",
            color: currentFilter === "found" ? "#007bff" : "inherit"
          }}
        >
          Found items
        </li>
        <li
          onClick={handleReportClick}
          style={{ fontWeight: "bold", color: "#007bff", cursor: "pointer" }}
        >
          Report item
        </li>
      </ul>
      <div className={styles.profile}>
        {/* Notification Bell */}
        <div 
          className={styles.notificationBell}
          onClick={() => (window.location.href = "/profile?tab=notifications")}
          title="Notifications"
        >
          <span className={`${styles.bellIcon} ${unreadCount > 0 ? styles.bellRing : ''}`}>🔔</span>
          {unreadCount > 0 && (
            <span className={styles.notificationBadge}>{unreadCount}</span>
          )}
        </div>

        <div
          className={styles.avatar}
          onClick={() => (window.location.href = "/profile")}
          style={{ cursor: "pointer" }}
        >
          {getUserInitial()}
        </div>
        <span
          style={{ cursor: "pointer" }}
          onClick={() => (window.location.href = "/profile")}
        >
          You
        </span>
        <li
          onClick={() => {
            console.log("Logout button clicked");
            onLogout && onLogout();
          }}
          style={{
            marginLeft: "1rem",
            fontWeight: "bold",
            color: "#e74c3c",
            cursor: "pointer",
            listStyle: "none", // Remove bullet point for list item
          }}
        >
          Logout
        </li>
      </div>
    </nav>
  );
};

export default HomeNavbar;
