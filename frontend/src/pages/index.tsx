import type { NextPage } from 'next';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import WhyChooseTruce from '../components/WhyChooseTruce';
import MarketCategories from '../components/MarketCategories';
import Footer from '../components/Footer';

const Home: NextPage = () => {
  return (
    <div className="p-0 bg-black min-h-screen">
      <Head>
        <title>Truce - Landing Page</title>
        <meta
          content="Truce - Your decentralized platform"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Navbar />

      <main className="min-h-[calc(100vh-126px)] p-0 flex-1 flex flex-col justify-start items-center bg-black">
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
