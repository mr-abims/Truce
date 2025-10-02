import React from 'react';
import Image from 'next/image';
import styles from '../styles/HowItWorks.module.css';

const HowItWorks: React.FC = () => {
  return (
    <section className={styles.howItWorksSection}>
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>How Truce Works</h2>
        </div>
        
        <div className={styles.subtitleContainer}>
          <p className={styles.subtitle}>
          Turn complex markets into easy, trusted experiences.
          </p>
        </div>
      </div>
      
      {/* Three Step Cards */}
      <div className={styles.stepsContainer}>
        <div className={styles.stepCard}>
          <Image src="/images/checkmark.png" alt="Step 1" width={24} height={24} className={styles.stepIcon} unoptimized />
          <p className={styles.stepText}>Create a market question, outcomes, closing time, bond.</p>
        </div>
        
        <div className={styles.stepCard}>
          <Image src="/images/checkmark.png" alt="Step 2" width={24} height={24} className={styles.stepIcon} unoptimized />
          <p className={styles.stepText}>Users place positions (on-chain) using stablecoins and tokens.</p>
        </div>
        
        <div className={styles.stepCard}>
          <Image src="/images/checkmark.png" alt="Step 3" width={24} height={24} className={styles.stepIcon} unoptimized />
          <p className={styles.stepText}>At resolution, oracles report and funds auto-distribute.</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
