import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/SignupForm.module.css";
import PasswordInput from "./PasswordInput";

const SignupForm = ({ onToggleForm }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    phonenumber: "",
    studentId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // NEW STATE: To show password requirements
  const [showPasswordHint, setShowPasswordHint] = useState(false);

  const API_URL = "http://localhost:3100/api/users/register";

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

    // Client-side validation
    if (formData.phonenumber && formData.phonenumber.length !== 10) {
      setError("❌ Phone number must be exactly 10 digits.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("❌ Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

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
        // Enhanced error messages
        let errorMessage = data.message || data.error || "Registration failed.";
        
        // Provide more specific error messages
        if (errorMessage.toLowerCase().includes("already exists") || errorMessage.toLowerCase().includes("already registered")) {
          errorMessage = "❌ This email is already registered. Please login instead.";
        } else if (errorMessage.toLowerCase().includes("username")) {
          errorMessage = "❌ This username is already taken. Please choose another.";
        } else if (errorMessage.toLowerCase().includes("phone")) {
          errorMessage = "❌ Please enter a valid 10-digit phone number.";
        } else if (errorMessage.toLowerCase().includes("password")) {
          errorMessage = "❌ Password must contain at least 8 characters, including uppercase, lowercase, number, and symbol.";
        } else if (errorMessage.toLowerCase().includes("email")) {
          errorMessage = "❌ Please enter a valid email address.";
        }
        
        throw new Error(errorMessage);
      }

      // Navigate to OTP page with email
      navigate("/otp", {
        state: { email: formData.email },
      });
    } catch (err) {
      console.error("Signup Error:", err);
      setError(err.message || "An unexpected error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.signupForm} onSubmit={handleSubmit}>
      <h2>Sign Up</h2>

      <input
        type="text"
        name="fullname"
        placeholder="Full Name"
        className={styles.input}
        value={formData.fullname}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="username"
        placeholder="Username"
        className={styles.input}
        value={formData.username}
        onChange={handleChange}
        required
      />
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
        required
        // NEW EVENT HANDLERS for showing hint
        onFocus={() => setShowPasswordHint(true)}
        onBlur={() => setShowPasswordHint(false)}
      />

      {/* NEW FEATURE: Password Requirements Hint */}
      {showPasswordHint && (
        <div className={styles.passwordHint}>
          <p>Password must contain:</p>
          <ul>
            <li>At least 8 characters</li>
            <li>1 lowercase letter</li>
            <li>1 uppercase letter</li>
            <li>1 number</li>
            <li>1 symbol</li>
          </ul>
        </div>
      )}

      <input
        type="text"
        name="phonenumber"
        placeholder="Contact Number"
        className={styles.input}
        value={formData.phonenumber}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="studentId"
        placeholder="Enrollment Number (Optional)"
        className={styles.input}
        value={formData.studentId}
        onChange={handleChange}
      />

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? "Registering..." : "Sign Up"}
      </button>

      <p className={styles.toggleForm}>
        Already have an account? <span onClick={onToggleForm}>Login</span>
      </p>
    </form>
  );
};

export default SignupForm;
