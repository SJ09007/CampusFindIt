import React, { useState } from "react";
import styles from "../styles/PasswordInput.module.css";

const PasswordInput = ({
  placeholder,
  value,
  onChange,
  name,
  required,
  onFocus,
  onBlur,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.passwordContainer}>
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={styles.input}
        value={value}
        onChange={onChange}
        name={name}
        required={required}
        onFocus={onFocus}
        onBlur={onBlur}
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
