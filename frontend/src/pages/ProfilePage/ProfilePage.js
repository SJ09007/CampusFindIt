// src/pages/ProfilePage/ProfilePage.js
import React, { useEffect, useState } from "react";
import styles from "./styles/ProfilePage.module.css";
import UserDetails from "./UserDetails";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3100/api";

const ProfilePage = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    // ---- FIX 1: Correct endpoint for user's posts ----
    fetch(`${API_BASE_URL}/items/getmyposted`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setMyPosts(data || []))
      .catch(() => setMyPosts([]));

    // ---- FIX 2: Correct endpoint for user's claims ----
    fetch(`${API_BASE_URL}/claims/getclaims/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setMyClaims(data || []))
      .catch(() => setMyClaims([]));
  }, [token]);

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.title}>My Profile</h1>

      <UserDetails />

      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab("posts")}
          className={activeTab === "posts" ? styles.activeTab : ""}
        >
          My Posts
        </button>
        <button
          onClick={() => setActiveTab("claims")}
          className={activeTab === "claims" ? styles.activeTab : ""}
        >
          My Claims
        </button>
      </div>

      <div className={styles.tabContent}>
        {/* -------------------- POSTS TAB -------------------- */}
        {activeTab === "posts" && (
          <div>
            <h2>Items I Posted</h2>
            {myPosts.length === 0 ? (
              <p>No posts yet.</p>
            ) : (
              <ul>
                {myPosts.map((post) => (
                  <li key={post._id} className={styles.itemCard}>
                    <strong>{post.title}</strong> ({post.status})
                    <br />
                    <span>{post.description}</span>
                    <br />
                    <button className={styles.deleteBtn}>Delete</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* -------------------- CLAIMS TAB -------------------- */}
        {activeTab === "claims" && (
          <div>
            <h2>Items I Claimed/Reported</h2>
            {myClaims.length === 0 ? (
              <p>No claims yet.</p>
            ) : (
              <ul>
                {myClaims.map((claim) => (
                  <li key={claim._id} className={styles.itemCard}>
                    <strong>{claim.itemTitle}</strong> ({claim.status})
                    <br />
                    <span>{claim.message}</span>
                    <br />
                    <span>
                      Status: {claim.approved ? "Approved" : "Pending"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
