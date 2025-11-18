import React from "react";
import styles from "../styles/HomeNavbar.module.css";

/**
 * @param {object} props
 * @param {function} props.onNavigate - Function to switch the view between 'list' and 'report' in HomePage.
 * @param {function} props.onLogout - Function to log the user out and redirect to the landing page (comes from App.js).
 */
const HomeNavbar = ({ onNavigate, onLogout }) => {
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
        <li onClick={() => (window.location.href = "/home")}>Browse items</li>
        <li onClick={() => (window.location.href = "/lost-items")}>Lost items</li>
        <li onClick={() => (window.location.href = "/found-items")}>Found items</li>
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
