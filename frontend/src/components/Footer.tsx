import React from 'react';
import styles from '../styles/Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Left: Brand */}
        <div className={styles.brandSection}>
          <h3 className={styles.brandName}>Truce</h3>
        </div>

        {/* Center: Columns */}
        <div className={styles.columnsSection}>
          {/* Support Column */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Support</h4>
            <ul className={styles.columnList}>
              <li><a href="#" className={styles.link}>Pricing Plan</a></li>
              <li><a href="#" className={styles.link}>Documentation</a></li>
              <li><a href="#" className={styles.link}>Guide</a></li>
              <li><a href="#" className={styles.link}>Tutorial</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Company</h4>
            <ul className={styles.columnList}>
              <li><a href="#" className={styles.link}>About</a></li>
              <li><a href="#" className={styles.link}>Blog</a></li>
              <li><a href="#" className={styles.link}>Join Us</a></li>
              <li><a href="#" className={styles.link}>Press</a></li>
              <li><a href="#" className={styles.link}>Partners</a></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Legal</h4>
            <ul className={styles.columnList}>
              <li><a href="#" className={styles.link}>Claim</a></li>
              <li><a href="#" className={styles.link}>Privacy</a></li>
              <li><a href="#" className={styles.link}>Terms</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom: Copyright */}
      <div className={styles.copyrightSection}>
        <p className={styles.copyright}>© Truce 2025. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
