import React, { useState } from "react";
import styles from "../styles/LoginForm.module.css";
import PasswordInput from "./PasswordInput";

// Component must now accept onNavigate prop
const LoginForm = ({ onLoginSuccess, onToggleForm, onNavigate }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:3100/api/users/login";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Login failed.");
      }

      const { token, ...user } = data;
      localStorage.setItem("access_token", token);
      localStorage.setItem("user_info", JSON.stringify(user));

      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
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

      {error && (
        <p style={{ color: "red", fontSize: "0.9rem", textAlign: "center" }}>
          {error}
        </p>
      )}

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? "Logging In..." : "Login"}
      </button>

      {/* CRITICAL CHANGE: Attach navigation handler to go to the reset screen */}
      <p className={styles.forgotPassword} onClick={() => onNavigate("reset")}>
        Forgot Password?
      </p>
    </form>
  );
};

export default LoginForm;
