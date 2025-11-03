import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./styles/AuthenticationPage.module.css";
import Navbar from "../LandingPage/components/Navbar";
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

  return (
    <div className={styles.pageContainer}>
      <Navbar />

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
