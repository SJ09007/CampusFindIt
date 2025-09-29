import React, { useState } from "react";
import styles from "../styles/PasswordInput.module.css";

const PasswordInput = ({ placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.passwordContainer}>
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={styles.input}
      />
      <button
        type="button"
        className={styles.eyeBtn}
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? "🙈" : "👁️"}{" "}
      </button>{" "}
    </div>
  );
};

export default PasswordInput;
