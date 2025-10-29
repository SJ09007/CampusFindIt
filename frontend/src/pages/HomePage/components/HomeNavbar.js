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
      <div className={styles.logo}>TheLOGO</div>
      <ul className={styles.menu}>
        {/* Navigation to the Item List View */}
        <li onClick={() => onNavigate("list")}>Lost items</li>
        <li onClick={() => onNavigate("list")}>Found items</li>
        <li>About us</li>

        {/* Navigation to the Report Item Form View */}
        <li
          onClick={() => onNavigate("report")}
          style={{ fontWeight: "bold", color: "#007bff", cursor: "pointer" }}
        >
          Report item
        </li>
      </ul>
      <div className={styles.profile}>
        <div className={styles.avatar}></div>
        <span>You</span>

        {/* Logout Button */}
        <li
          onClick={onLogout}
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
