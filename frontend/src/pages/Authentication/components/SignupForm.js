import React, { useState } from "react";
import styles from "../styles/SignupForm.module.css";
import PasswordInput from "./PasswordInput";

// Component must now accept onSignupSuccess as a prop
const SignupForm = ({ onSignupSuccess, onToggleForm }) => {
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
        throw new Error(data.message || data.error || "Registration failed.");
      }

      if (onSignupSuccess) {
        onSignupSuccess(data);
      }
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
        <p style={{ color: "red", fontSize: "0.9rem", textAlign: "center" }}>
          {error}
        </p>
      )}

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? "Registering..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignupForm;
