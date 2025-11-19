import React from "react";
import styles from "../styles/HomeNavbar.module.css";

/**
 * @param {object} props
 * @param {function} props.onNavigate - Function to switch the view between 'list' and 'report' in HomePage.
 * @param {function} props.onLogout - Function to log the user out and redirect to the landing page (comes from App.js).
 * @param {function} props.onFilterChange - Function to change the filter between 'all', 'lost', and 'found'.
 * @param {string} props.currentFilter - Current filter state ('all', 'lost', or 'found').
 */
const HomeNavbar = ({ onNavigate, onLogout, onFilterChange, currentFilter }) => {
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
          onClick={() => onFilterChange && onFilterChange("all")}
          style={{ 
            fontWeight: currentFilter === "all" ? "bold" : "normal",
            color: currentFilter === "all" ? "#007bff" : "inherit"
          }}
        >
          Browse items
        </li>
        <li 
          onClick={() => onFilterChange && onFilterChange("lost")}
          style={{ 
            fontWeight: currentFilter === "lost" ? "bold" : "normal",
            color: currentFilter === "lost" ? "#007bff" : "inherit"
          }}
        >
          Lost items
        </li>
        <li 
          onClick={() => onFilterChange && onFilterChange("found")}
          style={{ 
            fontWeight: currentFilter === "found" ? "bold" : "normal",
            color: currentFilter === "found" ? "#007bff" : "inherit"
          }}
        >
          Found items
        </li>
        <li
          onClick={() => {
            console.log("Navigating to report view");
            onNavigate && onNavigate("report");
          }}
          style={{ fontWeight: "bold", color: "#007bff", cursor: "pointer" }}
        >
          Report item
        </li>
      </ul>
      <div className={styles.profile}>
        <div
          className={styles.avatar}
          onClick={() => (window.location.href = "/profile")}
          style={{ cursor: "pointer" }}
        ></div>
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
