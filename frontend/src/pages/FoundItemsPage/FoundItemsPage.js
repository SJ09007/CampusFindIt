// src/pages/FoundItemsPage/FoundItemsPage.js
import React, { useEffect, useState } from "react";
import ItemCard from "../../components/ItemCard";
import styles from "../HomePage/styles/HomePage.module.css";
import HomeNavbar from "../HomePage/components/HomeNavbar";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3100/api";

const FoundItemsPage = ({ onLogout }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/items/getall`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setItems(data.filter((i) => i.status === "found")));
  }, []);

  const handleNavigate = (view) => {
    window.location.href = "/home";
  };

  return (
    <div className={styles.pageContainer}>
      <HomeNavbar onNavigate={handleNavigate} onLogout={onLogout} />
      <h1>Found Items</h1>
      <div className={styles.grid}>
        {items.length === 0 ? (
          <p>No found items yet.</p>
        ) : (
          items.map((item) => <ItemCard key={item._id} item={item} onClick={() => {}} />)
        )}
      </div>
    </div>
  );
};

export default FoundItemsPage;
