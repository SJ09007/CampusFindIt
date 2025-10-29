import React, { useState } from "react";
import styles from "./styles/AuthenticationPage.module.css";
import Navbar from "../LandingPage/components/Navbar"; // CRITICAL: Use the main Navbar
import AuthPanel from "./components/AuthPanel";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";

// Accepts onNavigate to handle navigation back to Landing or to Forgot Password
const AuthenticationPage = ({
  onLoginSuccess,
  onSignupSuccess,
  onNavigate,
}) => {
  // true = Login Form, false = Signup Form
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  const handleAuthSuccess = (userData) => {
    if (isLogin && onLoginSuccess) {
      onLoginSuccess(userData);
    } else if (!isLogin && onSignupSuccess) {
      onSignupSuccess(userData);
    } else {
      console.log("Success handler not fully configured for this page.");
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* CRITICAL: Navbar added for back navigation (click on logo) */}
      <Navbar onNavigate={onNavigate} />

      <div className={styles.authContainer}>
        {/* Left panel */}
        <div className={styles.panelContainer}>
          <AuthPanel isLogin={isLogin} toggleForm={toggleForm} />
        </div>

        {/* Right form container */}
        <div className={styles.formContainer}>
          {isLogin ? (
            <LoginForm
              onLoginSuccess={handleAuthSuccess}
              onToggleForm={toggleForm}
              onNavigate={onNavigate} // CRITICAL: Pass onNavigate for 'Forgot Password'
            />
          ) : (
            <SignupForm
              onSignupSuccess={handleAuthSuccess}
              onToggleForm={toggleForm}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;
