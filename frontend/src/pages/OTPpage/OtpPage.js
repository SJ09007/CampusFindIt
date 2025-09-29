import React, { useState } from "react";
import styles from "./OtpPage.module.css";
import Navbar from "../Authentication/components/Navbar";

const OtpPage = () => {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // frontend pov: bas console
    console.log("Entered OTP:", otp);
    alert("OTP Verified!");
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />

      <div className={styles.otpBox}>
        <h2 className={styles.title}>Enter OTP</h2>
        <p className={styles.infoText}>
          A 4-digit OTP has been sent to your email.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            maxLength="4"
            placeholder="____"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className={styles.otpInput}
            required
          />
          <button type="submit" className={styles.verifyButton}>
            Verify OTP
          </button>
        </form>

        <p className={styles.resendText}>
          Didn’t receive the code? <span>Resend OTP</span>
        </p>
      </div>
    </div>
  );
};

export default OtpPage;
