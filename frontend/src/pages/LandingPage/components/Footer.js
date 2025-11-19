import React from "react";
import styles from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <footer id="contact" className={styles.footer}>
      <h2 className={styles.footerHeading}>Quick Links and Contact</h2>
      <div className={styles.footerContent}>
        <div className={styles.col}>
          <h3>Campus Lost & Found</h3>
          <p>
            Connecting campus community to reunite lost items with their owners.
          </p>
        </div>
        <div className={styles.col}>
          <h4>Quick Links</h4>
        <ul>
          <li>Report Lost</li>
          <li>Report Found</li>
          <li>Search Items</li>
        </ul>
      </div>
      <div className={styles.col}>
        <h4>Support</h4>
        <ul>
          <li>Help Center</li>
          <li>Contact Us</li>
          <li>Privacy Policy</li>
        </ul>
      </div>
        <div className={styles.col}>
          <h4>Connect</h4>
          <p>Twitter | Facebook | Instagram</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
