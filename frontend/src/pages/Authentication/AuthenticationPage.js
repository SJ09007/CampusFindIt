import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./styles/AuthenticationPage.module.css";
import AuthNavbar from "./components/AuthNavbar";
import AuthPanel from "./components/AuthPanel";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";

const AuthenticationPage = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(
    location.state?.initialView === "signup" ? false : true
  );

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  const switchToSignup = () => {
    setIsLogin(false);
  };

  return (
    <div className={styles.pageContainer}>
      <AuthNavbar onSwitchToLogin={switchToLogin} onSwitchToSignup={switchToSignup} />

      <div className={styles.authContainer}>
        <div className={styles.panelContainer}>
          <AuthPanel isLogin={isLogin} toggleForm={toggleForm} />
        </div>

        <div className={styles.formContainer}>
          {isLogin ? (
            <LoginForm onToggleForm={toggleForm} />
          ) : (
            <SignupForm onToggleForm={toggleForm} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;
