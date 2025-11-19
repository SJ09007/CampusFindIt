import React from "react";
import styles from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <footer id="contact" className={styles.footer}>
      <h2 className={styles.footerHeading}>Quick Links and Contact</h2>
      <div className={styles.footerContent}>
        <div className={styles.col}>
          <h3>CampusFindIt</h3>
          <p>
            Connecting campus community to reunite lost items with their owners quickly and securely.
          </p>
        </div>
        <div className={styles.col}>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="/auth">Login / Sign Up</a></li>
            <li><a href="/home">Browse Items</a></li>
          </ul>
        </div>
        <div className={styles.col}>
          <h4>Contact</h4>
          <ul>
            <li>Email: support@campusfindit.com</li>
            <li>
              <a 
                href="https://maps.app.goo.gl/YourShortLink" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                📍 DAVV University, Indore
              </a>
            </li>
            <li>Hours: 24/7 Online</li>
          </ul>
        </div>
        <div className={styles.col}>
          <h4>Connect With Developer</h4>
          <div className={styles.socialLinks}>
            <a 
              href="https://www.linkedin.com/in/izzshrutiii/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.linkedinLink}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; 2025 CampusFindIt. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
