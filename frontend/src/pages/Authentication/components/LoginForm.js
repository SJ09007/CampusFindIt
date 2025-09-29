import React from "react";
import styles from "../styles/LoginForm.module.css";
import PasswordInput from "./PasswordInput";

const LoginForm = () => {
  return (
    <form className={styles.loginForm}>
      {" "}
      <h2>Login</h2>{" "}
      <input type="text" placeholder="Username" className={styles.input} />{" "}
      <PasswordInput placeholder="Password" />{" "}
      <button type="button" className={styles.submitBtn}>
        Login
      </button>{" "}
      <p className={styles.forgotPassword}>Forgot Password?</p>{" "}
    </form>
  );
};

export default LoginForm;
