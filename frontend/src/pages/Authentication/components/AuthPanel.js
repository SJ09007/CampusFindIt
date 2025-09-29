import React from "react";
import styles from "../styles/AuthPanel.module.css";

const AuthPanel = ({ isLogin, toggleForm }) => {
  return (
    <div className={styles.panel}>
      {isLogin ? (
        <>
          {" "}
          <h2>Don't have an account?</h2>{" "}
          <button onClick={toggleForm} className={styles.switchBtn}>
            Sign Up{" "}
          </button>
        </>
      ) : (
        <>
          {" "}
          <h2>Already have an account?</h2>{" "}
          <button onClick={toggleForm} className={styles.switchBtn}>
            Login{" "}
          </button>
        </>
      )}{" "}
    </div>
  );
};

export default AuthPanel;
