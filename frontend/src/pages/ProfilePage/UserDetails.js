// src/pages/ProfilePage/UserDetails.js
import React, { useEffect, useState } from "react";
import styles from "./styles/ProfilePage.module.css";
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3100/api";
const UserDetails = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch(`${API_BASE_URL}/user/me`, { credentials: "include" })
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);
  if (!user) return <div className={styles.userDetails}>Loading...</div>;
  return (
    <div className={styles.userDetails}>
      <h2>User Details</h2>
      <div><strong>Name:</strong> {user.name}</div>
      <div><strong>Username:</strong> {user.username}</div>
      <div><strong>Email:</strong> {user.email}</div>
      <div><strong>Phone:</strong> {user.phone}</div>
      <div><strong>Roll No:</strong> {user.rollNo}</div>
      {/* Add other details as needed */}
    </div>
  );
};
export default UserDetails;
