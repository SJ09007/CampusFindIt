// src/pages/ProfilePage/ProfilePage.js
import React, { useEffect, useState } from "react";
import styles from "./styles/ProfilePage.module.css";
import HomeNavbar from "../HomePage/components/HomeNavbar";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3100/api";

const ProfilePage = ({ onLogout }) => {
  const [myPosts, setMyPosts] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    studentId: "",
  });

  useEffect(() => {
    // Fetch user's profile data
    fetch(`${API_BASE_URL}/user/profile`, { credentials: "include" })
      .then(res => res.json())
      .then(data => setProfileData(data || {}))
      .catch(err => console.error("Error fetching profile data:", err));

    // Fetch user's posts and claims
    fetch(`${API_BASE_URL}/user/myposts`, { credentials: "include" })
      .then(res => res.json())
      .then(data => setMyPosts(data || []))
      .catch(err => console.error("Error fetching posts:", err));

    fetch(`${API_BASE_URL}/user/myclaims`, { credentials: "include" })
      .then(res => res.json())
      .then(data => setMyClaims(data || []))
      .catch(err => console.error("Error fetching claims:", err));
  }, []);

  const handleNavigate = (view) => {
    window.location.href = "/home";
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    // Save profile changes
    fetch(`${API_BASE_URL}/user/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(profileData),
    })
      .then(res => res.json())
      .then(data => {
        setIsEditing(false);
        setProfileData(data);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  return (
    <div className={styles.profileContainer}>
      <HomeNavbar onNavigate={handleNavigate} onLogout={onLogout} />
      <h1 className={styles.title}>My Profile</h1>
      <div className={styles.subNavbar}>
        <button onClick={() => setActiveTab("profile")} className={activeTab === "profile" ? styles.activeTab : ""}>My Profile</button>
        <button onClick={() => setActiveTab("posts")} className={activeTab === "posts" ? styles.activeTab : ""}>My Posts</button>
        <button onClick={() => setActiveTab("claims")} className={activeTab === "claims" ? styles.activeTab : ""}>My Claims</button>
      </div>
      <div className={styles.tabContent}>
        {activeTab === "profile" && (
          <div className={styles.profileDetails}>
            <div className={styles.avatar}>{profileData.username[0]}</div>
            <div className={styles.fieldGroup}>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Full Name:</label>
              <input
                type="text"
                name="fullName"
                value={profileData.fullName}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Email ID:</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Phone Number:</label>
              <input
                type="text"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Student ID:</label>
              <input
                type="text"
                name="studentId"
                value={profileData.studentId}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className={styles.buttonGroup}>
              <button onClick={handleEditToggle} className={styles.editBtn}>{isEditing ? "Cancel" : "Edit Profile"}</button>
              {isEditing && <button onClick={handleSaveChanges} className={styles.saveBtn}>Save Changes</button>}
            </div>
          </div>
        )}
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
