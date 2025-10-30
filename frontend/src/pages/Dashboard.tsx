import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Dashboard: NextPage = () => {
  const [currentActivityPage, setCurrentActivityPage] = useState(1);
  const activitiesPerPage = 4;

  const mockActivePositions = [
    // Bitcoin prediction - headline.png
    {
      id: 'p1',
      type: 'headline',
      question: 'Bitcoin price',
      time: '2 hours ago',
      profit: '+$500',
    },
    // Ethereum prediction - downline.png
    {
      id: 'p2',
      type: 'downline',
      question: 'Ethereum price',
      time: '4 hours ago',
      profit: '-$250',
    },
    // Sports prediction - headline.png
    {
      id: 'p3',
      type: 'headline',
      question: 'Lakers vs Warriors',
      time: '1 day ago',
      profit: '+$120',
    },
    // Politics prediction - downline.png
    {
      id: 'p4',
      type: 'downline',
      question: 'Election outcome',
      time: '3 days ago',
      profit: '-$80',
    },
    // User created prediction - create.png
    {
      id: 'p5',
      type: 'create',
      question: 'Nigeria World Cup Qualification',
      time: '1 week ago',
      profit: '+$300',
    },
    // Weather prediction - headline.png
    {
      id: 'p6',
      type: 'headline',
      question: 'Weather forecast',
      time: '5 days ago',
      profit: '+$75',
    },
  ];

  // Calculate pagination for activities
  const totalActivityPages = Math.ceil(mockActivePositions.length / activitiesPerPage);
  const startActivityIndex = (currentActivityPage - 1) * activitiesPerPage;
  const endActivityIndex = startActivityIndex + activitiesPerPage;
  const currentActivities = mockActivePositions.slice(startActivityIndex, endActivityIndex);

  const handleActivityPrevPage = () => {
    setCurrentActivityPage(prev => Math.max(prev - 1, 1));
  };

  const handleActivityNextPage = () => {
    setCurrentActivityPage(prev => Math.min(prev + 1, totalActivityPages));
  };

  const goToActivityPage = (page: number) => {
    setCurrentActivityPage(page);
  };

  const mockHistory = [
    {
      id: 'h1',
      market: 'Will there be snow in December?',
      position: 'YES',
      outcome: 'WON',
      invested: '20 HBAR',
      returned: '38 HBAR',
      profit: '+18 HBAR',
      date: 'Jan 05, 2025',
    },
    {
      id: 'h2',
      market: 'Will ETH reach $5000 in Q4?',
      position: 'NO',
      outcome: 'LOST',
      invested: '15 HBAR',
      returned: '0 HBAR',
      profit: '-15 HBAR',
      date: 'Dec 31, 2024',
    },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Head>
        <title>Truce - Dashboard</title>
        <meta name="description" content="View your positions and trading history" />
      </Head>

      <Navbar />

      <main className="flex-1 w-full flex justify-center">
        <div
          className="w-full"
          style={{
            maxWidth: '1312px',
            minWidth: '1200px',
            padding: '40px 64px',
          }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-orbitron font-semibold text-[32px] text-white mb-2">
             Dashboard
            </h1>
            <p className="font-orbitron text-[16px] text-[#CCCCCC]">
              Track your positions and performance
            </p>
          </div>

          {/* Stats Overview */}
          <div 
            style={{
              width: '1256px',
              height: '133px',
              borderRadius: '2px',
              borderWidth: '2px',
              opacity: 1,
              background: '#222222',
              border: '2px solid #61616133',
              position: 'relative',
              marginBottom: '40px',
            }}
          >
            {/* Contents Container */}
            <div
              style={{
                width: '1146px',
                height: '114px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                opacity: 1,
                position: 'absolute',
                top: '10px',
                left: '55px',
                padding: '8px',
              }}
            >
              {/* 1st Content - Portfolio Value */}
              <div
                style={{
                  width: '167px',
                  height: '98px',
                  opacity: 1,
                  padding: '4px',
                  gap: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div className="font-orbitron text-[14px] text-[#CCCCCC]">Portfolio Value</div>
                <div className="font-orbitron text-[28px] font-bold text-white">$12,745.57</div>
                <div className="font-orbitron text-[14px] font-bold text-[#00FF99]">+12.5%</div>
              </div>

              {/* 2nd Content - Active Predictions */}
              <div
                style={{
                  width: '157px',
                  height: '98px',
                  opacity: 1,
                  padding: '4px',
                  gap: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div className="font-orbitron text-[14px] text-[#CCCCCC]">Active Prediction</div>
                <div className="font-orbitron text-[28px] font-bold text-white">3</div>
                <div className="font-orbitron text-[12px] text-[#CCCCCC]">Total payout: $1,593.20</div>
              </div>

              {/* 3rd Content - Win Rate */}
              <div
                style={{
                  width: '111px',
                  height: '98px',
                  opacity: 1,
                  padding: '4px',
                  gap: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div className="font-orbitron text-[14px] text-[#CCCCCC]">Win Rate</div>
                <div className="font-orbitron text-[28px] font-bold text-white">66.7%</div>
                <div className="font-orbitron text-[12px] text-[#CCCCCC]">9 Won/ 3 Lost</div>
              </div>

              {/* 4th Content - Net Profit */}
              <div
                style={{
                  width: '95px',
                  height: '98px',
                  opacity: 1,
                  padding: '4px',
                  gap: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div className="font-orbitron text-[14px] text-[#CCCCCC]">Net Profit</div>
                <div className="font-orbitron text-[28px] font-bold text-[#00FF99]">$750</div>
                <div className="font-orbitron text-[12px] text-[#CCCCCC]">Total: $4049.12</div>
              </div>
            </div>
          </div>

          {/* Recent Activity Container */}
          <div
            style={{
              width: '1256px',
              height: '619px',
              borderRadius: '2px',
              border: '1px solid #B3B3B380',
              opacity: 1,
              padding: '24px',
            }}
          >
            {/* Recent Activity Header */}
            <div
              style={{
                width: '191px',
                height: '61px',
                borderRadius: '12px',
                gap: '10px',
                paddingTop: '4px',
                paddingRight: '8px',
                paddingBottom: '4px',
                paddingLeft: '8px',
                opacity: 1,
                marginBottom: '24px',
              }}
            >
              <h2
                className="font-orbitron"
                style={{
                  fontFamily: 'Orbitron',
                  fontWeight: 700,
                  fontSize: '16px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#FFFFFF',
                  margin: 0,
                }}
              >
                Recent Activity
              </h2>
            </div>

            {/* Active Positions */}
            <div className="flex flex-col" style={{ gap: '12px' }}>
              {currentActivities.map((pos) => (
                <div
                  key={pos.id}
                  className="rounded-lg"
                  style={{
                    width: '1171px',
                    height: '93px',
                    gap: '12px',
                    opacity: 1,
                    background: '#222222',
                    border: '1px solid #FFFFFF1A',
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '50px',
                        height: '40px',
                        borderRadius: '5px',
                        padding: '10px',
                        gap: '10px',
                        opacity: 1,
                        background: 
                          pos.type === 'headline' 
                            ? '#0F9C141A' 
                            : pos.type === 'downline' 
                            ? '#A705051A' 
                            : '#0066CC1A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Image
                        src={
                          pos.type === 'headline' 
                            ? '/images/headline.png' 
                            : pos.type === 'downline' 
                            ? '/images/downline.png' 
                            : '/images/create.png'
                        }
                        alt={
                          pos.type === 'headline' 
                            ? 'Headline' 
                            : pos.type === 'downline' 
                            ? 'Downline' 
                            : 'Create'
                        }
                        width={30}
                        height={20}
                        style={{
                          transform: pos.type === 'downline' ? 'rotate(180deg)' : 'none',
                        }}
                      />
                    </div>
                    <div
                      style={{
                        width: '174px',
                        height: '44px',
                        gap: '12px',
                        opacity: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <div
                        className="font-orbitron"
                        style={{
                          fontFamily: 'Orbitron',
                          fontWeight: 500,
                          fontSize: '14px',
                          lineHeight: '100%',
                          letterSpacing: '0%',
                          color: '#FFFFFF',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {pos.question}
                      </div>
                      <div
                        className="font-orbitron"
                        style={{
                          fontFamily: 'Orbitron',
                          fontWeight: 400,
                          fontSize: '12px',
                          lineHeight: '100%',
                          letterSpacing: '0%',
                          color: '#CCCCCC',
                        }}
                      >
                        {pos.time} • {pos.profit}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Activity Pagination */}
            <div
              style={{
                width: '100%',
                height: '56px',
                padding: '8px',
                gap: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '8px',
              }}
            >
              <button
                onClick={handleActivityPrevPage}
                disabled={currentActivityPage === 1}
                style={{
                  width: '25px',
                  height: '25px',
                  border: 'none',
                  background: 'transparent',
                  color: currentActivityPage === 1 ? '#666666' : '#CCCCCC',
                  cursor: currentActivityPage === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                ←
              </button>
              
              {Array.from({ length: totalActivityPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToActivityPage(page)}
                  className="font-orbitron"
                  style={{
                    width: '40px',
                    height: '40px',
                    border: 'none',
                    borderRadius: '4px',
                    background: page === currentActivityPage ? '#00FF99' : 'transparent',
                    color: page === currentActivityPage ? '#000000' : '#FFFFFF',
                    fontFamily: 'Orbitron',
                    fontWeight: 700,
                    fontSize: '12px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={handleActivityNextPage}
                disabled={currentActivityPage === totalActivityPages}
                style={{
                  width: '25px',
                  height: '25px',
                  border: 'none',
                  background: 'transparent',
                  color: currentActivityPage === totalActivityPages ? '#666666' : '#CCCCCC',
                  cursor: currentActivityPage === totalActivityPages ? 'not-allowed' : 'pointer',
                }}
              >
                →
              </button>
            </div>
          </div>

          {/* Active Prediction Container */}
          <div
            style={{
              width: '1256px',
              height: '800px',
              opacity: 1,
              borderRadius: '2px',
              border: '1px solid #B3B3B380',
              marginTop: '24px',
              padding: '32px 34px',
            }}
          >
            <div
              style={{
                width: '183px',
                height: '40px',
                opacity: 1,
                padding: '10px',
                gap: '10px',
                marginBottom: '40px',
              }}
            >
              <h2
                className="font-orbitron"
                style={{
                  fontFamily: 'Orbitron',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#FFFFFF',
                  margin: 0,
                }}
              >
                Active Prediction
              </h2>
            </div>

            {/* Table Header */}
            <div
              style={{
                width: '1171px',
                height: '40px',
                opacity: 1,
                borderRadius: '2px',
                marginTop: '48px',
                marginLeft: '42px',
                padding: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {/* Market Header */}
              <div
                style={{
                  width: '200px',
                  height: '40px',
                  padding: '4px',
                  gap: '14px',
                  opacity: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div
                  className="font-orbitron"
                  style={{
                    fontFamily: 'Orbitron',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#CCCCCC',
                    margin: 0,
                  }}
                >
                  Market
                </div>
              </div>

              {/* Prediction Header */}
              <div
                style={{
                  width: '100px',
                  height: '40px',
                  padding: '4px',
                  gap: '14px',
                  opacity: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div
                  className="font-orbitron"
                  style={{
                    fontFamily: 'Orbitron',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#CCCCCC',
                    margin: 0,
                  }}
                >
                  Prediction
                </div>
              </div>

              {/* Amount Header */}
              <div
                style={{
                  width: '120px',
                  height: '40px',
                  padding: '4px',
                  gap: '14px',
                  opacity: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div
                  className="font-orbitron"
                  style={{
                    fontFamily: 'Orbitron',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#CCCCCC',
                    margin: 0,
                  }}
                >
                  Amount
                </div>
              </div>

              {/* Potential Payout Header */}
              <div
                style={{
                  width: '150px',
                  height: '40px',
                  padding: '4px',
                  gap: '14px',
                  opacity: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div
                  className="font-orbitron"
                  style={{
                    fontFamily: 'Orbitron',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#CCCCCC',
                    margin: 0,
                  }}
                >
                  Potential Payout
                </div>
              </div>
            </div>

            {/* Data Container */}
            <div
              style={{
                width: '1255px',
                height: '457px',
                opacity: 1,
                borderRadius: '2px',
                position: 'relative',
                marginTop: '12px',
              }}
            >

              {/* Data Rows */}
              <div
                style={{
                  position: 'absolute',
                  width: '1171px',
                  height: '102px',
                  top: '100px',
                  left: '42px',
                  padding: '8px',
                  opacity: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #B3B3B380',
                }}
              >
                {/* Market Column */}
                <div style={{width: '200px', height: '52px', padding: '4px', gap: '14px', opacity: 1, display: 'flex', flexDirection: 'column'}}>
                  <div className="font-orbitron" style={{fontFamily: 'Orbitron', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', color: '#FFFFFF', margin: 0}}>
                    Bitcoin price
                  </div>
                </div>

                {/* Prediction Column */}
                <div
                  style={{
                    width: '100px',
                    height: '52px',
                    padding: '4px',
                    gap: '14px',
                    opacity: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div className="font-orbitron" style={{fontFamily: 'Orbitron', fontWeight: 600, fontSize: '12px', lineHeight: '100%', letterSpacing: '0%', color: '#1AB412', margin: 0}}>
                    up
                  </div>
                </div>

                {/* Amount Column */}
                <div
                  style={{
                    width: '120px',
                    height: '52px',
                    padding: '4px',
                    gap: '14px',
                    opacity: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div className="font-orbitron" style={{fontFamily: 'Orbitron', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', color: '#FFFFFF', margin: 0}}>
                    $500
                  </div>
                </div>

                {/* Potential Payout Column */}
                <div
                  style={{
                    width: '150px',
                    height: '52px',
                    padding: '4px',
                    gap: '14px',
                    opacity: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div className="font-orbitron" style={{fontFamily: 'Orbitron', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', color: '#FFFFFF', margin: 0}}>
                    $1000
                  </div>
                </div>
              </div>

              {/* Second row */}
              <div
                style={{
                  position: 'absolute',
                  width: '1171px',
                  height: '102px',
                  top: '220px',
                  left: '42px',
                  padding: '8px',
                  opacity: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #B3B3B380',
                }}
              >
                {/* Market Column */}
                <div style={{width: '200px', height: '52px', padding: '4px', gap: '14px', opacity: 1, display: 'flex', flexDirection: 'column'}}>
                  <div className="font-orbitron" style={{fontFamily: 'Orbitron', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', color: '#FFFFFF', margin: 0}}>
                    Ethereum price
                  </div>
                </div>

                {/* Prediction Column */}
                <div
                  style={{
                    width: '100px',
                    height: '52px',
                    padding: '4px',
                    gap: '14px',
                    opacity: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div className="font-orbitron" style={{fontFamily: 'Orbitron', fontWeight: 600, fontSize: '12px', lineHeight: '100%', letterSpacing: '0%', color: '#FF3366', margin: 0}}>
                    down
                  </div>
                </div>

                {/* Amount Column */}
                <div
                  style={{
                    width: '120px',
                    height: '52px',
                    padding: '4px',
                    gap: '14px',
                    opacity: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div className="font-orbitron" style={{fontFamily: 'Orbitron', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', color: '#FFFFFF', margin: 0}}>
                    $300
                  </div>
                </div>

                {/* Potential Payout Column */}
                <div
                  style={{
                    width: '150px',
                    height: '52px',
                    padding: '4px',
                    gap: '14px',
                    opacity: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div className="font-orbitron" style={{fontFamily: 'Orbitron', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', color: '#FFFFFF', margin: 0}}>
                    $600
                  </div>
                </div>
              </div>

              {/* Third row */}
              <div
                style={{
                  position: 'absolute',
                  width: '1171px',
                  height: '102px',
                  top: '340px',
                  left: '42px',
                  padding: '8px',
                  opacity: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #B3B3B380',
                }}
              >
                {/* Market Column */}
                <div style={{width: '200px', height: '52px', padding: '4px', gap: '14px', opacity: 1, display: 'flex', flexDirection: 'column'}}>
                  <div className="font-orbitron" style={{fontFamily: 'Orbitron', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', color: '#FFFFFF', margin: 0}}>
                    Sports match
                  </div>
                </div>

                {/* Prediction Column */}
                <div
                  style={{
                    width: '100px',
                    height: '52px',
                    padding: '4px',
                    gap: '14px',
                    opacity: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div className="font-orbitron" style={{fontFamily: 'Orbitron', fontWeight: 600, fontSize: '12px', lineHeight: '100%', letterSpacing: '0%', color: '#FF3366', margin: 0}}>
                    down
                  </div>
                </div>

                {/* Amount Column */}
                <div
                  style={{
                    width: '120px',
                    height: '52px',
                    padding: '4px',
                    gap: '14px',
                    opacity: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div className="font-orbitron" style={{fontFamily: 'Orbitron', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', color: '#FFFFFF', margin: 0}}>
                    $150
                  </div>
                </div>

                {/* Potential Payout Column */}
                <div
                  style={{
                    width: '150px',
                    height: '52px',
                    padding: '4px',
                    gap: '14px',
                    opacity: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div className="font-orbitron" style={{fontFamily: 'Orbitron', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', color: '#FFFFFF', margin: 0}}>
                    $300
                  </div>
                </div>
              </div>
            </div>

            {/* Active Prediction Pagination */}
            <div
              style={{
                width: '100%',
                height: '56px',
                padding: '8px',
                gap: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '24px',
              }}
            >
              <button
                style={{
                  width: '25px',
                  height: '25px',
                  border: 'none',
                  background: 'transparent',
                  color: '#CCCCCC',
                  cursor: 'pointer',
                }}
              >
                ←
              </button>
              
              <button
                className="font-orbitron"
                style={{
                  width: '40px',
                  height: '40px',
                  border: 'none',
                  borderRadius: '4px',
                  background: '#00FF99',
                  color: '#000000',
                  fontFamily: 'Orbitron',
                  fontWeight: 700,
                  fontSize: '12px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                1
              </button>
              
              <button
                style={{
                  width: '25px',
                  height: '25px',
                  border: 'none',
                  background: 'transparent',
                  color: '#CCCCCC',
                  cursor: 'pointer',
                }}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
