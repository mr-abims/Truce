import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

const Create: NextPage = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (router.query.category) {
      setSelectedCategory(router.query.category as string);
    }
  }, [router.query.category]);

  const categories = [
    {
      id: 'sports',
      name: 'Sports',
      icon: '/images/sports.png',
      description: 'Game outcomes, tournaments, player performance'

    },
    {
      id: 'politics',
      name: 'Politics',
      icon: '/images/pol.png',
      description: 'Local, States, Federal - Predict changes in the political landscape'
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      icon: '/images/opera.png',
    description: 'Award, releases, box office, Celebrity events'
    },
    {
      id: 'weather',
      name: 'Weather',
      icon: '/images/weath.png',
      description: 'Local forecasts climate events, natural phenomenal'
    },
    {
      id: 'other',
      name: 'Other',
      icon: '/images/idea.png',
      description: 'See the world shift before the headlines do'
    },
    {
      id: 'crypto',
      name: 'Crypto',
      icon: '/images/crypto.png',
      description: 'Token prices, DeFi events, blockchain developments'
    }
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const goNext = () => {
    if (!selectedCategory) return;
    router.push(`/CreateForm?category=${selectedCategory}`);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Head>
        <title>Truce - Create</title>
        <meta
          content="Truce - Create a new prediction market"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Navbar />

      <main className="flex-1 relative w-full max-w-full h-[calc(100vh-126px)] flex items-center justify-center p-4 box-border overflow-y-auto overflow-x-hidden">
        <div 
          className="relative mx-auto"
          style={{
            width: '1312px',
            height: '1085px',
            top: '50px',
            background: '#151515',
            opacity: 1
          }}
        >
          <div 
            className="absolute"
            style={{
              width: '387px',
              height: '65px',
              top: '21px',
              left: '415px',
              padding: '10px',
              gap: '10px',
              opacity: 1
            }}
          >
            <h1 className="font-orbitron font-semibold text-[28px] text-white">Forge a Prediction</h1>
          </div>
          <div 
            className="absolute"
            style={{
              width: '504px',
              height: '40px',
              top: '88px',
              left: '356px',
              padding: '10px',
              gap: '10px',
              opacity: 1
            }}
          >
            <p className="font-orbitron font-normal text-[14px] text-[#CCCCCC]">Design a new quest for the community to embark upon</p>
          </div>
          <div 
            className="absolute flex items-center justify-center"
            style={{
              width: '50px',
              height: '50px',
              top: '48px',
              left: '1149px',
              borderRadius: '1000px',
              background: '#555454',
              opacity: 1
            }}
          >
            <span className="font-orbitron font-bold text-[14px] text-white">1</span>
          </div>

          <div 
            className="absolute grid grid-cols-2"
            style={{
              width: '1142px',
              height: '673px',
              top: '206px',
              left: '85px',
              gap: '37px',
              boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.25)',
              opacity: 1
            }}
          >
            {categories.map((category) => (
              <div 
                key={category.id}
                className="rounded-lg relative cursor-pointer transition-all duration-300 hover:scale-105"
                style={{
                  width: '504px',
                  height: '194.33px',
                  background: selectedCategory === category.id ? '#2F2F2F' : '#2F2F2F80',
                  border: '2px solid #24c786',
                  boxShadow: '4px 4px 30px 0px #00FF99, 4px 4px 120px 0px rgba(0,0,0,0.25)',
                  opacity: 1
                }}
                onClick={() => handleCategorySelect(category.id)}
              >
                <div
                  className="flex items-center"
                  style={{
                    width: '152px',
                    height: '50px',
                    top: '23px',
                    left: '13px',
                    padding: '10px',
                    gap: '10px',
                    position: 'absolute'
                  }}
                >
                  <Image src={category.icon} alt={category.name} width={40} height={40} className="rounded" />
                  <span
                    className="text-white"
                    style={{
                      fontFamily: 'Orbitron',
                      fontWeight: 700,
                      fontSize: '20px',
                      lineHeight: '100%',
                      letterSpacing: '0%'
                    }}
                  >
                    {category.name}
                  </span>
                </div>

                <div
                  className="text-left"
                  style={{
                    width: '448px',
                    height: '60px',
                    top: '70px',
                    left: '13px',
                    padding: '10px',
                    gap: '10px',
                    position: 'absolute'
                  }}
                >
                  <p
                    className="text-white"
                    style={{
                      fontFamily: 'Orbitron',
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: '100%',
                      letterSpacing: '0%'
                    }}
                  >
                    {category.description}
                  </p>
                </div>

                <div
                  className="text-left"
                  style={{
                    width: '448px',
                    height: '40px',
                    top: '120px',
                    left: '13px',
                    padding: '10px',
                    gap: '10px',
                    position: 'absolute'
                  }}
                >
                </div>
              </div>
            ))}
          </div>

          <div 
            className="absolute flex justify-between items-center"
            style={{
              width: '1111px',
              height: '56px',
              top: '964px',
              left: '101px',
              padding: '8px',
              opacity: 1
            }}
          >

            <Link 
              href="/" 
              className="flex items-center justify-center gap-2"
              style={{
                width: '115px',
                height: '40px',
                padding: '10px',
                gap: '10px',
                borderRadius: '8px',
                background: '#D9D9D980',
                opacity: 1
              }}
            >
              <span className="text-black font-orbitron text-[14px]">‹ Back</span>
            </Link>
            
           
            <button 
              onClick={goNext}
              className="flex items-center justify-center gap-2"
              style={{
                width: '159px',
                height: '40px',
                padding: '10px',
                gap: '10px',
                borderRadius: '8px',
                border: '2px solid #00FF99',
                background: 'transparent',
                opacity: selectedCategory ? 1 : 0.5,
                cursor: selectedCategory ? 'pointer' : 'not-allowed'
              }}
              disabled={!selectedCategory}
            >
              <span className="font-orbitron text-[14px]" style={{ color: selectedCategory ? '#00FF99' : '#666666' }}>Next ›</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Create;
