import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/LoginForm.module.css";
import PasswordInput from "./PasswordInput";

const LoginForm = ({ onToggleForm }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState("");

  const API_URL = "http://localhost:3100/api/users/login";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Prefill email if navigated here after OTP verification
  React.useEffect(() => {
    const preEmail = location.state?.email;
    const verified = location.state?.verified;
    if (preEmail) {
      setFormData((prev) => ({ ...prev, email: preEmail }));
    }
    if (verified) {
      setInfo("Your account was verified. Please log in.");
      // clear the info after a short time
      setTimeout(() => setInfo(""), 3000);
    }
  }, [location.state]);

  // Add cleanup effect
  React.useEffect(() => {
    // Clear any stale auth data on component mount
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    localStorage.removeItem("isVerified");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Clear any existing auth data
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    localStorage.removeItem("isVerified");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        // Prevent caching of the request
        cache: 'no-store'
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        throw new Error(data.message || data.error || "Login failed.");
      }

      if (!data.token) {
        throw new Error("No token received from server");
      }

      const { token, ...user } = data;
      
      // Store new auth data
      localStorage.setItem("access_token", token);
      localStorage.setItem("user_info", JSON.stringify(user));
      localStorage.setItem("isVerified", "true");

      console.log("Auth data stored successfully");

      // Navigate to home page
      setError(null);
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || "An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      <h2>Login</h2>

      <input
        type="email"
        name="email"
        placeholder="Email"
        className={styles.input}
        value={formData.email}
        onChange={handleChange}
        required
      />
      <PasswordInput
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />

      {info && (
        <p style={{ color: "green", fontSize: "0.9rem", textAlign: "center" }}>
          {info}
        </p>
      )}

      {error && (
        <p style={{ color: "red", fontSize: "0.9rem", textAlign: "center" }}>
          {error}
        </p>
      )}

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? "Logging In..." : "Login"}
      </button>

      {/* CRITICAL CHANGE: Attach navigation handler to go to the reset screen */}
      <p
        className={styles.forgotPassword}
        onClick={() => navigate("/forgot-password")}
      >
        Forgot Password?
      </p>

      <p className={styles.toggleForm}>
        Don't have an account? <span onClick={onToggleForm}>Sign Up</span>
      </p>
    </form>
  );
};

export default LoginForm;
