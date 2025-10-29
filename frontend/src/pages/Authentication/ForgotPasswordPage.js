import React, { useState } from "react";
import styles from "./styles/ForgotPasswordPage.module.css";
// CRITICAL FIX: Import Navbar from the correct shared location
import Navbar from "../LandingPage/components/Navbar";

const ForgotPasswordPage = ({ onNavigate }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state when submission begins
    setMessage("Note: API integration for password reset is required here.");

    // In a real application, you would call your backend API here (e.g., /api/users/forgotpassword)

    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      // You would update the message based on the API response (success/failure)
      // setMessage("If the email is registered, a reset link has been sent.");
    }, 1500);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Navbar now correctly imported and displays the logo/back button */}
      <Navbar onNavigate={onNavigate} />

      <div className={styles.formBox}>
        <h2 className={styles.title}>Reset Password</h2>
        <p className={styles.infoText}>
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
            disabled={loading}
          />
          {message && <p className={styles.message}>{message}</p>}
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          <p className={styles.backLink} onClick={() => onNavigate("auth")}>
            ← Back to Login/Signup
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
