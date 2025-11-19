// src/pages/ProfilePage/ProfilePage.js
import React, { useEffect, useState } from "react";
import styles from "./styles/ProfilePage.module.css";
import HomeNavbar from "../HomePage/components/HomeNavbar";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3100/api";

const ProfilePage = ({ onLogout }) => {
  const [myPosts, setMyPosts] = useState([]);
  const [postClaims, setPostClaims] = useState({}); // Store claims for each post
  const [myClaims, setMyClaims] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [expandedPosts, setExpandedPosts] = useState({});
  const [expandedClaims, setExpandedClaims] = useState({}); // Track which post's claims are expanded
  const [profileData, setProfileData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    studentId: "",
  });

  // Check URL parameters for tab
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && ['profile', 'posts', 'claims', 'notifications'].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

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
    const token = localStorage.getItem("access_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    fetch(`${API_BASE_URL}/notifications`, { 
      credentials: "include",
      headers 
    })
      .then(res => res.json())
      .then(data => {
        console.log("Fetched notifications:", data);
        setNotifications(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Error fetching notifications:", err);
        setNotifications([]);
      });
  };

  const fetchClaimsForPost = async (postId) => {
    try {
      const token = localStorage.getItem("access_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await fetch(`${API_BASE_URL}/claims/getclaims/${postId}`, {
        credentials: "include",
        headers
      });
      
      if (response.ok) {
        const claims = await response.json();
        setPostClaims(prev => ({ ...prev, [postId]: claims }));
      }
    } catch (err) {
      console.error("Error fetching claims:", err);
    }
  };

  const toggleClaimsView = (postId) => {
    setExpandedClaims(prev => {
      const newState = { ...prev, [postId]: !prev[postId] };
      // Fetch claims when expanding
      if (newState[postId] && !postClaims[postId]) {
        fetchClaimsForPost(postId);
      }
      return newState;
    });
  };

  const handleApproveClaim = async (claimId, postId) => {
    if (!window.confirm("Are you sure you want to approve this claim?")) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await fetch(`${API_BASE_URL}/claims/approve/${claimId}`, {
        method: "POST",
        credentials: "include",
        headers
      });

      if (response.ok) {
        alert("Claim approved! Contact information has been shared with both parties.");
        fetchClaimsForPost(postId); // Refresh claims
        fetchMyPosts(); // Refresh posts to update status
      } else {
        const data = await response.json();
        alert(data.message || "Failed to approve claim");
      }
    } catch (err) {
      console.error("Error approving claim:", err);
      alert("Error approving claim");
    }
  };

  const handleRejectClaim = async (claimId, postId) => {
    if (!window.confirm("Are you sure you want to reject this claim?")) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await fetch(`${API_BASE_URL}/claims/reject/${claimId}`, {
        method: "POST",
        credentials: "include",
        headers
      });

      if (response.ok) {
        alert("Claim rejected");
        fetchClaimsForPost(postId); // Refresh claims
      } else {
        const data = await response.json();
        alert(data.message || "Failed to reject claim");
      }
    } catch (err) {
      console.error("Error rejecting claim:", err);
      alert("Error rejecting claim");
    }
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
    const token = localStorage.getItem("access_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    fetch(`${API_BASE_URL}/claims/myclaims`, { 
      credentials: "include",
      headers 
    })
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
                  const claims = postClaims[post._id] || [];
                  const pendingClaims = claims.filter(c => c.status === 'pending');
                  const claimsExpanded = expandedClaims[post._id];
                  
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
                          
                          {/* Claims Section */}
                          {post.status !== 'claimed' && post.status !== 'reported' && (
                            <div className={styles.claimsSection}>
                              <button 
                                className={styles.viewClaimsBtn}
                                onClick={() => toggleClaimsView(post._id)}
                              >
                                {pendingClaims.length > 0 ? (
                                  <>📢 {pendingClaims.length} Pending Claim{pendingClaims.length !== 1 ? 's' : ''}</>
                                ) : (
                                  <>View Claims ({claims.length})</>
                                )}
                              </button>
                              
                              {claimsExpanded && (
                                <div className={styles.claimsList}>
                                  {claims.length === 0 ? (
                                    <p className={styles.noClaims}>No claims yet</p>
                                  ) : (
                                    claims.map(claim => (
                                      <div key={claim._id} className={styles.claimCard}>
                                        <div className={styles.claimHeader}>
                                          <span className={styles.claimerName}>
                                            👤 {claim.claimerId?.username || 'Anonymous'}
                                          </span>
                                          <span className={`${styles.claimStatus} ${styles[claim.status]}`}>
                                            {claim.status.toUpperCase()}
                                          </span>
                                        </div>
                                        <div className={styles.claimDetails}>
                                          <p><strong>Message:</strong> {claim.message}</p>
                                          {claim.foundLocation && (
                                            <p><strong>Location/Details:</strong> {claim.foundLocation}</p>
                                          )}
                                          {claim.foundDate && (
                                            <p><strong>Date:</strong> {claim.foundDate}</p>
                                          )}
                                          <p className={styles.claimTime}>
                                            Submitted: {new Date(claim.createdAt).toLocaleString()}
                                          </p>
                                        </div>
                                        
                                        {claim.status === 'pending' && (
                                          <div className={styles.claimActions}>
                                            <button 
                                              className={styles.approveBtn}
                                              onClick={() => handleApproveClaim(claim._id, post._id)}
                                            >
                                              ✅ Approve
                                            </button>
                                            <button 
                                              className={styles.rejectBtn}
                                              onClick={() => handleRejectClaim(claim._id, post._id)}
                                            >
                                              ❌ Reject
                                            </button>
                                          </div>
                                        )}
                                        
                                        {claim.status === 'approved' && claim.claimerId && (
                                          <div className={styles.contactInfo}>
                                            <h4>📞 Contact Information:</h4>
                                            <p><strong>Email:</strong> {post.contactEmail || claim.claimerId.email || 'Not provided'}</p>
                                            <p><strong>Phone:</strong> {post.contactPhone || claim.claimerId.phone || 'Not provided'}</p>
                                          </div>
                                        )}
                                      </div>
                                    ))
                                  )}
                                </div>
                              )}
                            </div>
                          )}
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
          <div className={styles.claimsTabSection}>
            <h2>Items I Claimed/Reported</h2>
            {!Array.isArray(myClaims) || myClaims.length === 0 ? (
              <p className={styles.noItems}>No claims yet.</p>
            ) : (
              <div className={styles.myClaimsGrid}>
                {myClaims.map(claim => (
                  <div key={claim._id} className={styles.myClaimCard}>
                    <div className={styles.myClaimHeader}>
                      <h3 className={styles.myClaimTitle}>
                        {claim.itemId?.title || 'Item'}
                      </h3>
                      <span className={`${styles.claimStatus} ${styles[claim.status]}`}>
                        {claim.status.toUpperCase()}
                      </span>
                    </div>
                    
                    {claim.itemId?.images && claim.itemId.images.length > 0 && (
                      <img 
                        src={claim.itemId.images[0]} 
                        alt={claim.itemId.title}
                        className={styles.myClaimImage}
                      />
                    )}
                    
                    <div className={styles.myClaimDetails}>
                      <p><strong>Type:</strong> {claim.claimType === 'found' ? 'Found Report' : 'Claim'}</p>
                      <p><strong>Your Message:</strong> {claim.message}</p>
                      {claim.foundLocation && (
                        <p><strong>Location/Details:</strong> {claim.foundLocation}</p>
                      )}
                      <p className={styles.claimTime}>
                        Submitted: {new Date(claim.createdAt).toLocaleString()}
                      </p>
                    </div>
                    
                    {claim.status === 'approved' && claim.itemId?.postedBy && (
                      <div className={styles.ownerContactInfo}>
                        <h4>✅ Claim Approved - Owner Contact:</h4>
                        <p><strong>Email:</strong> {claim.itemId.contactEmail || claim.itemId.postedBy.email || 'Not provided'}</p>
                        <p><strong>Phone:</strong> {claim.itemId.contactPhone || claim.itemId.postedBy.phone || 'Not provided'}</p>
                      </div>
                    )}
                    
                    {claim.status === 'pending' && (
                      <div className={styles.pendingNote}>
                        ⏳ Waiting for owner to review your claim
                      </div>
                    )}
                    
                    {claim.status === 'rejected' && (
                      <div className={styles.rejectedNote}>
                        ❌ This claim was not approved by the owner
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
                {notifications.map(notification => {
                  const handleNotificationClick = async () => {
                    // Mark as read in backend and update UI immediately
                    const token = localStorage.getItem("access_token");
                    if (token && !notification.read) {
                      try {
                        await fetch(`${API_BASE_URL}/notifications/${notification._id}/read`, {
                          method: 'PUT',
                          credentials: 'include',
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        
                        // Update local state immediately
                        setNotifications(prev => 
                          prev.map(n => 
                            n._id === notification._id 
                              ? { ...n, read: true } 
                              : n
                          )
                        );
                      } catch (err) {
                        console.error("Error marking as read:", err);
                      }
                    }

                    // Navigate based on notification type
                    if (notification.type === 'claim') {
                      // Owner received a claim - go to My Posts
                      setActiveTab('posts');
                    } else if (notification.type === 'approved' || notification.type === 'rejected') {
                      // Claimer's claim was approved/rejected - go to My Claims
                      setActiveTab('claims');
                    }
                  };

                  return (
                    <div 
                      key={notification._id} 
                      className={`${styles.notificationCard} ${!notification.read ? styles.unread : ''}`}
                      onClick={handleNotificationClick}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={styles.notificationIcon}>
                        {notification.type === 'claim' && '📢'}
                        {notification.type === 'match' && '🔍'}
                        {notification.type === 'approved' && '✅'}
                        {notification.type === 'rejected' && '❌'}
                      </div>
                      <div className={styles.notificationContent}>
                        <p className={styles.notificationMessage}>{notification.message}</p>
                        <span className={styles.notificationTime}>
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {!notification.read && (
                        <div className={styles.unreadDot}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
