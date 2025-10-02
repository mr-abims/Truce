import type { NextPage } from 'next';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import WhyChooseTruce from '../components/WhyChooseTruce';
import MarketCategories from '../components/MarketCategories';
import Footer from '../components/Footer';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Truce - Landing Page</title>
        <meta
          content="Truce - Your decentralized platform"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Navbar />

      <main className={styles.main}>
        <HeroSection />
        <HowItWorks />
        <WhyChooseTruce />
        <MarketCategories />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
