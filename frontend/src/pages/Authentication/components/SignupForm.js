import React from "react";
import styles from "../styles/SignupForm.module.css";
import PasswordInput from "./PasswordInput";

const SignupForm = () => {
  return (
    <form className={styles.signupForm}>
      {" "}
      <h2>Sign Up</h2>{" "}
      <input type="text" placeholder="Full Name" className={styles.input} />{" "}
      <input type="text" placeholder="Username" className={styles.input} />{" "}
      <input type="email" placeholder="Email" className={styles.input} />{" "}
      <PasswordInput placeholder="Password" />{" "}
      <input
        type="text"
        placeholder="Contact Number"
        className={styles.input}
      />{" "}
      <input
        type="text"
        placeholder="Enrollment Number (Optional)"
        className={styles.input}
      />{" "}
      <button type="button" className={styles.submitBtn}>
        Sign Up
      </button>{" "}
    </form>
  );
};

export default SignupForm;
