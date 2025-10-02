import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from '../styles/Navbar.module.css';

const Navbar: React.FC = () => {

  return (
    <header className={styles.navbar}>
      <div className={styles.leftSection}>
        <div className={styles.brand}>
          Truce
        </div>
      </div>
      
      <div className={styles.centerSection}>
        <nav className={styles.navLinks}>
          <a href="#" className={styles.navLink}>Create</a>
          <a href="#" className={styles.navLink}>Markets</a>
          <a href="#" className={styles.navLink}>Leaderboard</a>
        </nav>
      </div>
      
      <div className={styles.rightSection}>
        <ConnectButton />
      </div>
    </header>
  );
};

export default Navbar;
