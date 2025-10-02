import React from 'react';
import Image from 'next/image';
import styles from '../styles/HeroSection.module.css';

const HeroSection: React.FC = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.backgroundContainer}>
        {/* First futuristic figure - left side using pic2.png */}
        <div className={styles.figureLeft}>
          <Image
            src="/images/pic2.png"
            alt="Futuristic masked character with glowing eyes"
            width={392}
            height={729}
            className={styles.figureImage}
            priority
            unoptimized
          />
        </div>
        
        {/* Second futuristic figure - right side using pic3.png */}
        <div className={styles.figureRight}>
          <Image
            src="/images/pic3.png"
            alt="Futuristic masked character with glowing eyes"
            width={526}
            height={646}
            className={styles.figureImage}
            priority
            unoptimized
          />
        </div>
      </div>
      
      {/* Hero content */}
      <div className={styles.heroContent}>
        {/* Main headline */}
        <div className={styles.headlineContainer}>
          <h1 className={styles.headline}>Turn Opinions into Outcomes</h1>
        </div>
        
        {/* Subheadline */}
        <div className={styles.subheadlineContainer}>
          <p className={styles.subheadline}>
            Harness the Power of the Blockchain, Forecast the future of Digital Assets in Our High Stakes Prediction Arena and Claim Legendary Reward
          </p>
        </div>
        
        {/* Stats row */}
        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <Image src="/images/Icon2.png" alt="Digital Currency" width={80} height={80} className={styles.statIcon} unoptimized />
            <div className={styles.statContent}>
              <span className={styles.statNumber}>$30B</span>
              <span className={styles.statDescription}>Digital Currency Exchanged</span>
            </div>
          </div>
          
          <div className={styles.statItem}>
            <Image src="/images/Icon1.png" alt="Active Users" width={80} height={80} className={styles.statIcon} unoptimized />
            <div className={styles.statContent}>
              <span className={styles.statNumber}>1,000+</span>
              <span className={styles.statDescription}>Active Users</span>
            </div>
          </div>
          
          <div className={styles.statItem}>
            <Image src="/images/Icon3.png" alt="Total Volume" width={80} height={80} className={styles.statIcon} unoptimized />
            <div className={styles.statContent}>
              <span className={styles.statNumber}>2.5k+</span>
              <span className={styles.statDescription}>Total Volume</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
