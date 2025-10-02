import React from 'react';
import Image from 'next/image';
import styles from '../styles/MarketCategories.module.css';

const MarketCategories: React.FC = () => {
  const categories = [
    { name: 'Crypto', icon: '/images/crypto.png', isImage: true },
    { name: 'Politics', icon: '🏛️', isImage: false },
    { name: 'Weather', icon: '🌤️', isImage: false },
    { name: 'Sport', icon: '/images/sports.png', isImage: true },
    { name: 'Entertainment', icon: '/images/fun2.png', isImage: true },
    { name: 'Other', icon: '📊', isImage: false }
  ];

  return (
    <section className={styles.marketCategoriesSection}>
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>Market Categories</h2>
        </div>
        <div className={styles.subtitleContainer}>
          <p className={styles.subtitle}>
            Specialized markets with tailored liquidity parameters for different types of events.
          </p>
        </div>
      </div>
      
      {/* Categories Grid */}
      <div className={styles.categoriesGrid}>
        {categories.map((category, index) => (
          <div key={index} className={styles.categoryCard}>
            <div className={styles.categoryIcon}>
              {category.isImage ? (
                <Image
                  src={category.icon}
                  alt={category.name}
                  width={40}
                  height={40}
                  className={styles.iconImage}
                  unoptimized
                  priority
                />
              ) : (
                <span className={styles.emojiIcon}>{category.icon}</span>
              )}
            </div>
            <div className={styles.categoryName}>{category.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MarketCategories;
