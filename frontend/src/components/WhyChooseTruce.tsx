import React from 'react';
import Image from 'next/image';
import styles from '../styles/WhyChooseTruce.module.css';

const WhyChooseTruce: React.FC = () => {
  return (
    <section className={styles.whyChooseTruceSection}>
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>Why Choose Truce?</h2>
        </div>
        <div className={styles.subtitleContainer}>
          <p className={styles.subtitle}>
            Advanced features that make prediction markets accessible, fair and rewarding.
          </p>
        </div>
      </div>
      
      {/* Character Cards Container */}
      <div className={styles.cardsContainer}>
        {/* Card 1 - Community */}
        <div className={styles.characterCard}>
          <div className={styles.cardTop}>
            <Image
              src="/images/mon1.png"
              alt="Community Monster"
              width={379}
              height={207}
              className={styles.monsterImage}
              unoptimized
              priority
            />
          </div>
          <div className={styles.cardBelow}>
            <h3 className={styles.cardTitle}>Community</h3>
            <p className={styles.cardDescription}>
              Constant product AMM with real-time slippage calculation ensures you know exactly what you're getting with no hidden outcomes.
            </p>
          </div>
        </div>

        {/* Card 2 - Liquidity */}
        <div className={styles.characterCard}>
          <div className={styles.cardTop}>
            <Image
              src="/images/mon2.png"
              alt="Liquidity Monster"
              width={379}
              height={207}
              className={styles.monsterImage}
              unoptimized
              priority
            />
          </div>
          <div className={styles.cardBelow}>
            <h3 className={styles.cardTitle}>Liquidity</h3>
            <p className={styles.cardDescription}>
              Always-on liquidity powered by automated market makers allows you to trade anytime without waiting for counterparties.
            </p>
          </div>
        </div>

        {/* Card 3 - Transparency */}
        <div className={styles.characterCard}>
          <div className={styles.cardTop}>
            <Image
              src="/images/mon3.png"
              alt="Transparency Monster"
              width={379}
              height={207}
              className={styles.monsterImage}
              unoptimized
              priority
            />
          </div>
          <div className={styles.cardBelow}>
            <h3 className={styles.cardTitle}>Transparency</h3>
            <p className={styles.cardDescription}>
              Collective wisdom is aggregated into accurate probability estimates, rewarding users with credibility and real benefits for correct predictions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseTruce;
