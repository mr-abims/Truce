import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import Navbar from '../components/Navbar';

const mockMarkets = [
  {
    id: 'm1',
    title: 'Will Bitcoin reach $100,000 by end of 2025?',
    category: 'Crypto',
    icon: '/images/crypto.png',
    volume: '2,450 HBAR',
    ends: 'Dec 31, 2025',
  },
  {
    id: 'm2',
    title: 'Will Team A win the championship this season?',
    category: 'Sports',
    icon: '/images/sports.png',
    volume: '1,120 HBAR',
    ends: 'Jun 02, 2025',
  },
  {
    id: 'm3',
    title: 'Will there be a recession in Q1 2025?',
    category: 'Politics',
    icon: '/images/pol.png',
    volume: '980 HBAR',
    ends: 'Mar 31, 2025',
  },
  {
    id: 'm4',
    title: 'Will City X record snowfall over 10cm this weekend?',
    category: 'Weather',
    icon: '/images/weath.png',
    volume: '540 HBAR',
    ends: 'Nov 17, 2025',
  },
];

type FilterKey = 'Trending' | 'Ending Soon' | 'High Value' | 'Newest' | 'Closed';

const Markets: NextPage = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>('Trending');

  const parseVolumeHBAR = (v: string): number => {
    const num = v.replace(/[^0-9.]/g, '');
    return Number(num || '0');
  };

  const parseEndsDate = (d: string): number => {
    const ts = Date.parse(d);
    return Number.isNaN(ts) ? 0 : ts;
  };

  const filteredMarkets = useMemo(() => {
    const now = Date.now();
    let list = [...mockMarkets];
    switch (selectedFilter) {
      case 'Ending Soon':
        list.sort((a, b) => parseEndsDate(a.ends) - parseEndsDate(b.ends));
        break;
      case 'High Value':
      case 'Trending':
        list.sort((a, b) => parseVolumeHBAR(b.volume) - parseVolumeHBAR(a.volume));
        break;
      case 'Closed':
        list = list.filter(m => parseEndsDate(m.ends) < now);
        break;
      case 'Newest':
      default:
        // keep insertion order for demo
        break;
    }
    return list;
  }, [selectedFilter]);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Head>
        <title>Truce - Markets</title>
        <meta name="description" content="Browse active prediction markets on Truce" />
      </Head>

      <Navbar />

      <main className="flex-1 w-full flex justify-center">
        <div
          className="w-full"
          style={{
            maxWidth: '1312px',
            minWidth: '1200px',
            padding: '40px 64px',
            position: 'relative',
          }}
        >
          <div
            className="flex items-center"
            style={{
              width: '100%',
              height: '65px',
              gap: '10px',
            }}
          >
            <h1 className="font-orbitron font-semibold text-[32px] text-white">Prediction Markets</h1>
          </div>
          
          <p className="font-orbitron text-[16px] text-[#CCCCCC] mt-2 mb-8">
            Trade on future event with transparent price and instant liquidity
            
          </p>

          {/* Filters bar (absolute per Figma) */}
          <div
            className="flex items-center"
            style={{
              width: '601px',
              height: '38px',
              position: 'absolute',
              top: '253px',
              left: '113px',
              borderRadius: '2px',
              justifyContent: 'space-between',
              opacity: 1,
            }}
          >
            {(['Trending','Ending Soon','High Value','Newest','Closed'] as FilterKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedFilter(key)}
                className="font-orbitron transition-colors duration-200"
                style={{
                  fontFamily: 'Orbitron',
                  fontSize: '14px',
                  padding: '8px 12px',
                  border: '1px solid #2F2F2F',
                  borderRadius: '6px',
                  background: selectedFilter === key ? '#00FF99' : 'transparent',
                  color: selectedFilter === key ? '#000000' : '#FFFFFF',
                  boxShadow: selectedFilter === key ? '0 0 14px #00FF99' : 'none',
                }}
              >
                {key}
              </button>
            ))}
          </div>

          {/* List format markets */}
          <div className="flex flex-col" style={{ gap: '14px', marginTop: '72px' }}>
            {filteredMarkets.map((m) => (
              <div
                key={m.id}
                className="rounded-lg cursor-pointer relative"
                style={{
                  background: '#1a1a1a',
                  border: '2px solid #00FF73',
                  boxShadow: '0 0 18px #00FF99, 0 0 35px rgba(0, 255, 153, 0.4)',
                  minHeight: '110px',
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '70%' }}>
                  <Image src={m.icon} alt={m.category} width={32} height={32} className="rounded" />
                  <div>
                    <div className="text-white font-orbitron" style={{ fontWeight: 700, fontSize: '14px' }}>{m.category}</div>
                    <div className="text-white font-orbitron" style={{ fontWeight: 600, fontSize: '16px', lineHeight: '120%', marginTop: '4px' }}>{m.title}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div className="font-orbitron text-[#CCCCCC] text-[12px]">
                    <div>Volume</div>
                    <div className="text-white text-[14px]" style={{ marginTop: '2px', textAlign: 'right' }}>{m.volume}</div>
                  </div>
                  <div className="font-orbitron text-[#CCCCCC] text-[12px] text-right">
                    <div>Ends</div>
                    <div className="text-white text-[14px]" style={{ marginTop: '2px' }}>{m.ends}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Markets;

//Explore active prediction markets and join the quest.

