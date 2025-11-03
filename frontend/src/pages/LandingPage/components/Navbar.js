import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Campus Lost & Found</div>
      <ul className={styles.navLinks}>
        <li>Home</li>
        <li>How It Works</li>
        <li>Contact</li>
      </ul>
      <div className={styles.authButtons}>
        <button
          className={styles.login}
          onClick={() => navigate("/auth", { state: { initialView: "login" } })}
        >
          Login
        </button>
        <button
          className={styles.signup}
          onClick={() =>
            navigate("/auth", { state: { initialView: "signup" } })
          }
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
