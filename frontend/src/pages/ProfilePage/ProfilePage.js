// src/pages/ProfilePage/ProfilePage.js
import React, { useEffect, useState } from "react";
import styles from "./styles/ProfilePage.module.css";
import HomeNavbar from "../HomePage/components/HomeNavbar";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3100/api";

const ProfilePage = ({ onLogout }) => {
  const [myPosts, setMyPosts] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [expandedPosts, setExpandedPosts] = useState({});
  const [profileData, setProfileData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    studentId: "",
  });

  const toggleDescription = (postId) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  useEffect(() => {
    // Get user info from localStorage (stored during login/signup)
    const userInfo = localStorage.getItem("user_info");
    if (userInfo) {
      try {
        const userData = JSON.parse(userInfo);
        console.log("User data from localStorage:", userData); // Debug log
        setProfileData({
          username: userData.username || "",
          fullName: userData.fullName || userData.fullname || userData.name || "",
          email: userData.email || "",
          phone: userData.phone || userData.phonenumber || userData.contactNumber || userData.phoneNumber || "",
          studentId: userData.studentId || userData.enrollmentNumber || userData.enrollment_number || "",
        });
      } catch (err) {
        console.error("Error parsing user info:", err);
      }
    }

    fetchMyPosts();
    fetchMyClaims();
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    // Mock notifications for now - you can replace with actual API call
    const mockNotifications = [
      {
        id: 1,
        type: "claim",
        message: "Someone claimed your found item: Water Bottle",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false
      },
      {
        id: 2,
        type: "match",
        message: "A new item matching your lost item description was posted",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        read: false
      },
      {
        id: 3,
        type: "approved",
        message: "Your claim for 'Laptop Charger' has been approved",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: true
      }
    ];
    setNotifications(mockNotifications);
  };

  const fetchMyPosts = () => {
    const token = localStorage.getItem("access_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    fetch(`${API_BASE_URL}/items/getmyposted`, { 
      credentials: "include",
      headers 
    })
      .then(res => {
        console.log("Posts response status:", res.status);
        return res.json();
      })
      .then(data => {
        console.log("Fetched posts:", data);
        setMyPosts(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Error fetching posts:", err);
        setMyPosts([]);
      });
  };

  const fetchMyClaims = () => {
    fetch(`${API_BASE_URL}/user/myclaims`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        console.log("Fetched claims:", data);
        setMyClaims(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Error fetching claims:", err);
        setMyClaims([]);
      });
  };

  const handleDeletePost = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await fetch(`${API_BASE_URL}/items/delete/${itemId}`, {
        method: "DELETE",
        credentials: "include",
        headers
      });

      if (response.ok) {
        alert("Post deleted successfully");
        fetchMyPosts(); // Refresh the posts list
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete post");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Error deleting post");
    }
  };

  const handleNavigate = (view) => {
    window.location.href = "/home";
  };

  return (
    <div className={styles.profileContainer}>
      <HomeNavbar onNavigate={handleNavigate} onLogout={onLogout} />
      <h1 className={styles.title}>My Profile</h1>
      <div className={styles.subNavbar}>
        <button onClick={() => setActiveTab("profile")} className={activeTab === "profile" ? styles.activeTab : ""}>My Profile</button>
        <button onClick={() => setActiveTab("posts")} className={activeTab === "posts" ? styles.activeTab : ""}>My Posts</button>
        <button onClick={() => setActiveTab("claims")} className={activeTab === "claims" ? styles.activeTab : ""}>My Claims</button>
        <button onClick={() => setActiveTab("notifications")} className={activeTab === "notifications" ? styles.activeTab : ""}>
          Notifications
          {notifications.filter(n => !n.read).length > 0 && (
            <span className={styles.notificationBadge}>
              {notifications.filter(n => !n.read).length}
            </span>
          )}
        </button>
      </div>
      <div className={styles.tabContent}>
        {activeTab === "profile" && (
          <div className={styles.profileDetails}>
            <div className={styles.avatar}>
              {profileData.username ? profileData.username[0].toUpperCase() : "U"}
            </div>
            <div className={styles.fieldGroup}>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={profileData.username}
                readOnly
                disabled
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Full Name:</label>
              <input
                type="text"
                name="fullName"
                value={profileData.fullName}
                readOnly
                disabled
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Email ID:</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                readOnly
                disabled
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Phone Number:</label>
              <input
                type="text"
                name="phone"
                value={profileData.phone}
                readOnly
                disabled
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Student ID:</label>
              <input
                type="text"
                name="studentId"
                value={profileData.studentId}
                readOnly
                disabled
              />
            </div>
          </div>
        )}
        {activeTab === "posts" && (
          <div className={styles.postsSection}>
            <h2>Items I Posted</h2>
            {!Array.isArray(myPosts) || myPosts.length === 0 ? (
              <p className={styles.noItems}>No posts yet.</p>
            ) : (
              <div className={styles.postsGrid}>
                {myPosts.map(post => {
                  const isExpanded = expandedPosts[post._id];
                  const descriptionLines = post.description.split('\n').length;
                  const isLongDescription = post.description.length > 100 || descriptionLines > 2;
                  
                  return (
                    <div key={post._id} className={styles.postCard}>
                      {post.images && post.images.length > 0 ? (
                        <img 
                          src={post.images[0]} 
                          alt={post.title} 
                          className={styles.postImage}
                        />
                      ) : (
                        <div className={styles.postImagePlaceholder}>
                          <h3 className={styles.placeholderTitle}>{post.title}</h3>
                        </div>
                      )}
                      <div className={styles.postContent}>
                        <div className={styles.postInfo}>
                          <h3 className={styles.postTitle}>{post.title}</h3>
                          <span className={`${styles.statusBadge} ${styles[post.status]}`}>
                            {post.status.toUpperCase()}
                          </span>
                          <p className={styles.postCategory}>{post.category}</p>
                          <div className={styles.descriptionWrapper}>
                            <p className={isExpanded ? styles.postDescriptionExpanded : styles.postDescription}>
                              {post.description}
                            </p>
                            {isLongDescription && (
                              <button 
                                className={styles.readMoreBtn}
                                onClick={() => toggleDescription(post._id)}
                              >
                                {isExpanded ? 'Read less' : 'Read more'}
                              </button>
                            )}
                          </div>
                          <p className={styles.postLocation}>📍 {post.location}</p>
                          <p className={styles.postDate}>
                            {new Date(post.date).toLocaleDateString()}
                          </p>
                        </div>
                        <button 
                          className={styles.deleteBtn}
                          onClick={() => handleDeletePost(post._id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {activeTab === "claims" && (
          <div>
            <h2>Items I Claimed/Reported</h2>
            {!Array.isArray(myClaims) || myClaims.length === 0 ? <p>No claims yet.</p> : (
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
        {activeTab === "notifications" && (
          <div className={styles.notificationsSection}>
            <h2>Notifications</h2>
            {notifications.length === 0 ? (
              <p className={styles.noItems}>No notifications yet.</p>
            ) : (
              <div className={styles.notificationsList}>
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`${styles.notificationCard} ${!notification.read ? styles.unread : ''}`}
                  >
                    <div className={styles.notificationIcon}>
                      {notification.type === 'claim' && '📢'}
                      {notification.type === 'match' && '🔍'}
                      {notification.type === 'approved' && '✅'}
                    </div>
                    <div className={styles.notificationContent}>
                      <p className={styles.notificationMessage}>{notification.message}</p>
                      <span className={styles.notificationTime}>
                        {notification.timestamp.toLocaleString()}
                      </span>
                    </div>
                    {!notification.read && (
                      <div className={styles.unreadDot}></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
