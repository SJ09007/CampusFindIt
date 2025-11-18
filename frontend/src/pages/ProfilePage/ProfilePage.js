// src/pages/ProfilePage/ProfilePage.js
import React, { useEffect, useState } from "react";
import styles from "./styles/ProfilePage.module.css";
import UserDetails from "./UserDetails";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3100/api";

const ProfilePage = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const username = localStorage.getItem("username") || "";

  useEffect(() => {
    // Fetch user's posts and claims (hardcoded API)
    fetch(`${API_BASE_URL}/user/myposts`, { credentials: "include" })
      .then(res => res.json())
      .then(data => setMyPosts(data || []));
    fetch(`${API_BASE_URL}/user/myclaims`, { credentials: "include" })
      .then(res => res.json())
      .then(data => setMyClaims(data || []));
  }, []);

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.title}>My Profile</h1>
      <UserDetails />
      <div className={styles.tabs}>
        <button onClick={() => setActiveTab("posts")} className={activeTab === "posts" ? styles.activeTab : ""}>My Posts</button>
        <button onClick={() => setActiveTab("claims")} className={activeTab === "claims" ? styles.activeTab : ""}>My Claims</button>
      </div>
      <div className={styles.tabContent}>
        {activeTab === "posts" && (
          <div>
            <h2>Items I Posted</h2>
            {myPosts.length === 0 ? <p>No posts yet.</p> : (
              <ul>
                {myPosts.map(post => (
                  <li key={post._id} className={styles.itemCard}>
                    <strong>{post.title}</strong> ({post.status})<br />
                    <span>{post.description}</span><br />
                    <button className={styles.deleteBtn}>Delete</button>
                    {post.requests && post.requests.length > 0 && (
                      <div className={styles.requestsSection}>
                        <h4>Requests:</h4>
                        {post.requests.map(req => (
                          <div key={req._id} className={styles.requestCard}>
                            <span>User: {req.username}</span><br />
                            <span>Email: {req.email}</span><br />
                            <span>Type: {req.type}</span><br />
                            <button className={styles.approveBtn}>Approve</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {activeTab === "claims" && (
          <div>
            <h2>Items I Claimed/Reported</h2>
            {myClaims.length === 0 ? <p>No claims yet.</p> : (
              <ul>
                {myClaims.map(claim => (
                  <li key={claim._id} className={styles.itemCard}>
                    <strong>{claim.itemTitle}</strong> ({claim.status})<br />
                    <span>{claim.message}</span><br />
                    <span>Status: {claim.approved ? "Approved" : "Pending"}</span>
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
