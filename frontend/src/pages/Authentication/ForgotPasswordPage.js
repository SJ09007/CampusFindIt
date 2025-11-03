import React, { useState } from "react";
import styles from "./styles/ForgotPasswordPage.module.css";
import Navbar from "../LandingPage/components/Navbar";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = ({ onNavigate }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1); // 1: send email, 2: verify otp & reset

  const navigate = useNavigate();

  // Default to the backend PORT you shared (3100). You can override with REACT_APP_API_BASE.
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3100";

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        // If user not registered show message with signup link
        setMessage(
          typeof data === "string" ? data : data.message || "Error sending OTP"
        );
      } else {
        setMessage("OTP sent to your email. Check your inbox.");
        setStep(2);
      }
    } catch (err) {
      setMessage("Failed to send OTP. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/users/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(
          typeof data === "string"
            ? data
            : data.message || "OTP verification failed"
        );
      } else {
        setMessage("OTP verified. You can now set a new password.");
        setOtpVerified(true);
      }
    } catch (err) {
      setMessage("Failed to verify OTP. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/users/reset-password/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(
          typeof data === "string"
            ? data
            : data.message || "Failed to reset password"
        );
      } else {
        setMessage(
          "Password updated successfully. Please login with your new password."
        );
        setTimeout(() => navigate("/auth"), 1500);
      }
    } catch (err) {
      setMessage("Failed to reset password. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar onNavigate={onNavigate} />

      <div className={styles.formBox}>
        <h2 className={styles.title}>Reset Password</h2>
        {step === 1 && (
          <>
            <p className={styles.infoText}>
              Enter your email address and we'll send a verification code (OTP)
              to reset your password.
            </p>
            <form onSubmit={handleSendOtp} className={styles.form}>
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
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
              <p className={styles.smallText}>
                Not registered?{" "}
                <span
                  className={styles.link}
                  onClick={() =>
                    navigate("/auth", { state: { initialView: "signup" } })
                  }
                >
                  Create an account
                </span>
              </p>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <p className={styles.infoText}>
              Enter the OTP sent to your email to verify, then set a new
              password.
            </p>

            {!otpVerified && (
              <form onSubmit={handleVerifyOtp} className={styles.form}>
                <input
                  type="text"
                  placeholder="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={styles.input}
                  required
                  disabled={loading}
                />
                {message && <p className={styles.message}>{message}</p>}
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
                <p className={styles.backLink} onClick={() => setStep(1)}>
                  ← Back
                </p>
              </form>
            )}

            {otpVerified && (
              <form onSubmit={handleConfirmReset} className={styles.form}>
                <input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  required
                  disabled={loading}
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={styles.input}
                  required
                  disabled={loading}
                />
                {message && <p className={styles.message}>{message}</p>}
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
                <p
                  className={styles.backLink}
                  onClick={() => {
                    setOtpVerified(false);
                    setStep(1);
                  }}
                >
                  ← Back
                </p>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
