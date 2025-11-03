import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./OtpPage.module.css";
import Navbar from "../Authentication/components/Navbar";

const API_BASE_URL = "http://localhost:3100";

const OtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const userEmail = location.state?.email;

  useEffect(() => {
    // If no email is provided, redirect to signup
    if (!userEmail) {
      navigate("/auth");
    }
  }, [userEmail, navigate]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(
    "A 4-digit OTP has been sent to your email."
  );
  const [isError, setIsError] = useState(false);

  // Helper to set colored messages
  const setStatus = (msg, error = false) => {
    setMessage(msg);
    setIsError(error);
  };

  // --- API Call: Send OTP ---
  const handleSendOtp = async () => {
    setLoading(true);
    setStatus("Requesting new OTP...", false);

    try {
      const response = await fetch(`${API_BASE_URL}/api/otp/sendotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to send OTP.");
      }

      // Success response (from your OTPController: { success: true, message: "OTP sent successfully" })
      setStatus("New OTP sent successfully! Check your email.", false);
    } catch (err) {
      console.error("Send OTP Error:", err.message);
      setStatus(`Failed to send OTP. ${err.message}`, true);
    } finally {
      setLoading(false);
    }
  };

  // --- API Call: Verify OTP ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Verifying OTP...", false);

    // Validation based on your backend logic (4-digit expected)
    if (otp.length !== 4) {
      setStatus("Please enter a 4-digit OTP.", true);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/otp/verifyotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, otp: otp }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "OTP verification failed.");
      }

      const result = await response.json();

      if (result.success) {
        setStatus("OTP verified successfully! Redirecting to login...", false);
        setOtp(""); // Clear OTP input

        // Mark account as verified and store email
        localStorage.setItem("isVerified", "true");
        localStorage.setItem("user_email", userEmail);

        // Navigate to login with verification success message
        setTimeout(() => {
          navigate("/auth", {
            state: {
              email: userEmail,
              verified: true,
              initialView: "login", // Ensure we show login form
            },
          });
        }, 1500);
      } else {
        setStatus(result.message || "Verification failed", true);
      }
    } catch (err) {
      console.error("Verify OTP Error:", err.message);
      setStatus(`Verification failed. ${err.message}`, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />

      <div className={styles.otpBox}>
        <h2 className={styles.title}>Enter OTP</h2>

        {/* Dynamic Message Display */}
        <p
          className={`${styles.infoText} ${
            isError ? "text-red-500" : "text-gray-600"
          }`}
        >
          {message}
        </p>

        <form onSubmit={handleVerifyOtp} className={styles.form}>
          <input
            type="text"
            maxLength="4"
            placeholder="____"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/[^0-9]/g, "").substring(0, 4))
            } // Filter non-digits
            className={styles.otpInput}
            required
            disabled={loading}
          />
          <button
            type="submit"
            className={styles.verifyButton}
            disabled={loading || otp.length !== 4}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className={styles.resendText}>
          Didn’t receive the code?
          <span
            onClick={!loading ? handleSendOtp : null}
            className={loading ? styles.disabledResend : styles.activeResend}
          >
            {loading ? " Sending..." : " Resend OTP"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default OtpPage;
