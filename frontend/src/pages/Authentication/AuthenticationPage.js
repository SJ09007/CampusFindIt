import React, { useState } from "react";
import styles from "./styles/AuthenticationPage.module.css";
import Navbar from "./components/Navbar";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import AuthPanel from "./components/AuthPanel";

const AuthenticationPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={styles.pageContainer}>
      {/* Navbar added here */}
      <Navbar />

      <div className={styles.authContainer}>
        {/* Left panel */}
        <div className={styles.panelContainer}>
          <AuthPanel
            isLogin={isLogin}
            toggleForm={() => setIsLogin(!isLogin)}
          />
        </div>

        {/* Right form */}
        <div className={styles.formContainer}>
          {isLogin ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;
