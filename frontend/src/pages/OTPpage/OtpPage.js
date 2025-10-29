import React, { useState } from "react";
// Assuming styles is correctly imported for CSS Modules
import styles from "./OtpPage.module.css";
import Navbar from "../Authentication/components/Navbar";
// Assume you have a way to get the email, e.g., from location state or a global context
const USER_EMAIL = "example@user.com"; // REPLACE with actual email retrieval logic

const API_BASE_URL = "http://localhost:3100";

const OtpPage = () => {
  const [otp, setOtp] = useState("");
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
        body: JSON.stringify({ email: USER_EMAIL }),
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
        body: JSON.stringify({ email: USER_EMAIL, otp: otp }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "OTP verification failed.");
      }

      // Success response (from your OTPController: { success: true, message: "OTP verified successfully" })
      const result = await response.json();

      setStatus(
        result.message || "OTP verified! Redirecting to login...",
        false
      );
      setOtp(""); // Clear OTP input

      // Logic to redirect to LoginPage or HomePage after successful verification
      // Example: navigate('/login');
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
