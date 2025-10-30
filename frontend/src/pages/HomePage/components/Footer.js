import React from "react";
import styles from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.columns}>
        <div className={styles.logo}>
          <h3>🔍 FindIt</h3>
          <p>Connecting communities to reunite lost items with their owners.</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            <li>Browse Items</li>
            <li>Report Lost</li>
            <li>Report Found</li>
            <li>Success Stories</li>
          </ul>
        </div>

        <div>
          <h4>Support</h4>
          <ul>
            <li>Help Center</li>
            <li>Contact Us</li>
            <li>Safety Tips</li>
            <li>Community Guidelines</li>
          </ul>
        </div>

        <div>
          <h4>Legal</h4>
          <ul>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Cookie Policy</li>
          </ul>
        </div>
      </div>
      <p className={styles.copy}>© 2024 FindIt. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
