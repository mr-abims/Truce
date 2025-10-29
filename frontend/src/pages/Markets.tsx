import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const mockMarkets = [
  // Crypto markets
  {
    id: 'm1',
    title: 'Will Bitcoin reach $100,000 by end of 2025?',
    category: 'Crypto',
    icon: '/images/crypto.png',
    volume: '2,450 HBAR',
    ends: 'Dec 15, 2025',
    trades: 834,
    users: 290,
  },
  {
    id: 'm2',
    title: 'Will Ethereum surpass $5,000 in November?',
    category: 'Crypto',
    icon: '/images/crypto.png',
    volume: '1,890 HBAR',
    ends: 'Nov 30, 2025',
    trades: 621,
    users: 245,
  },
  {
    id: 'm3',
    title: 'Will HBAR reach $1 by Q1 2026?',
    category: 'Crypto',
    icon: '/images/crypto.png',
    volume: '1,340 HBAR',
    ends: 'Mar 31, 2026',
    trades: 478,
    users: 187,
  },
  {
    id: 'm4',
    title: 'Will any altcoin flip Bitcoin in 2025?',
    category: 'Crypto',
    icon: '/images/crypto.png',
    volume: '820 HBAR',
    ends: 'Oct 10, 2025',
    trades: 256,
    users: 112,
  },
  
  // Sports markets
  {
    id: 'm5',
    title: 'Will Team A win the championship this season?',
    category: 'Sports',
    icon: '/images/sports.png',
    volume: '1,120 HBAR',
    ends: 'Nov 05, 2025',
    trades: 567,
    users: 156,
  },
  {
    id: 'm6',
    title: 'Will Messi win the Ballon d\'Or 2025?',
    category: 'Sports',
    icon: '/images/sports.png',
    volume: '950 HBAR',
    ends: 'Dec 01, 2025',
    trades: 445,
    users: 198,
  },
  {
    id: 'm7',
    title: 'Will Lakers make the NBA playoffs?',
    category: 'Sports',
    icon: '/images/sports.png',
    volume: '780 HBAR',
    ends: 'Apr 15, 2026',
    trades: 334,
    users: 142,
  },
  
  // Politics markets
  {
    id: 'm8',
    title: 'Will there be a recession in Q1 2025?',
    category: 'Politics',
    icon: '/images/politics.png',
    volume: '1,650 HBAR',
    ends: 'Oct 15, 2025',
    trades: 712,
    users: 289,
  },
  {
    id: 'm9',
    title: 'Will inflation rate drop below 2% in 2025?',
    category: 'Politics',
    icon: '/images/politics.png',
    volume: '1,240 HBAR',
    ends: 'Dec 31, 2025',
    trades: 523,
    users: 201,
  },
  {
    id: 'm10',
    title: 'Will EU introduce new crypto regulations?',
    category: 'Politics',
    icon: '/images/politics.png',
    volume: '890 HBAR',
    ends: 'Nov 20, 2025',
    trades: 367,
    users: 145,
  },
  
  // Entertainment markets
  {
    id: 'm11',
    title: 'Will Avatar 3 break box office records?',
    category: 'Entertainment',
    icon: '/images/opera.png',
    volume: '1,450 HBAR',
    ends: 'Dec 25, 2025',
    trades: 589,
    users: 223,
  },
  {
    id: 'm12',
    title: 'Will Taylor Swift release a new album in 2025?',
    category: 'Entertainment',
    icon: '/images/opera.png',
    volume: '720 HBAR',
    ends: 'Nov 15, 2025',
    trades: 298,
    users: 134,
  },
  {
    id: 'm13',
    title: 'Will Stranger Things S5 air before 2026?',
    category: 'Entertainment',
    icon: '/images/opera.png',
    volume: '610 HBAR',
    ends: 'Dec 20, 2025',
    trades: 245,
    users: 109,
  },
  
  // Weather markets
  {
    id: 'm14',
    title: 'Will City X record snowfall over 10cm this weekend?',
    category: 'Weather',
    icon: '/images/weath.png',
    volume: '540 HBAR',
    ends: 'Nov 30, 2025',
    trades: 218,
    users: 67,
  },
  {
    id: 'm15',
    title: 'Will there be a hurricane in November?',
    category: 'Weather',
    icon: '/images/weath.png',
    volume: '430 HBAR',
    ends: 'Nov 10, 2025',
    trades: 187,
    users: 89,
  },
  {
    id: 'm16',
    title: 'Will 2025 be the hottest year on record?',
    category: 'Weather',
    icon: '/images/weath.png',
    volume: '1,120 HBAR',
    ends: 'Jan 15, 2026',
    trades: 456,
    users: 178,
  },
  
  // Other markets
  {
    id: 'm17',
    title: 'Will AI achieve AGI in 2025?',
    category: 'Other',
    icon: '/images/idea.png',
    volume: '2,100 HBAR',
    ends: 'Dec 31, 2025',
    trades: 923,
    users: 334,
  },
  {
    id: 'm18',
    title: 'Will SpaceX land on Mars in 2025?',
    category: 'Other',
    icon: '/images/idea.png',
    volume: '1,780 HBAR',
    ends: 'Dec 10, 2025',
    trades: 678,
    users: 267,
  },
  {
    id: 'm19',
    title: 'Will quantum computers break encryption?',
    category: 'Other',
    icon: '/images/idea.png',
    volume: '920 HBAR',
    ends: 'Nov 25, 2025',
    trades: 401,
    users: 156,
  },
];

type FilterKey = 'Trending' | 'Ending Soon' | 'High Value' | 'Newest' | 'Closed';
type CategoryKey = 'All' | 'Crypto' | 'Sports' | 'Politics' | 'Entertainment' | 'Weather' | 'Other';

const Markets: NextPage = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>('Trending');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const marketsPerPage = 4;

  const parseVolumeHBAR = (v: string): number => {
    const num = v.replace(/[^0-9.]/g, '');
    return Number(num || '0');
  };

  const parseEndsDate = (d: string): number => {
    const ts = Date.parse(d);
    return Number.isNaN(ts) ? 0 : ts;
  };

  const getClosingText = (endDate: string): string => {
    const now = Date.now();
    const end = parseEndsDate(endDate);
    if (end < now) {
      return 'Ended';
    }
    const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    if (daysLeft === 1) return 'Closes in 1 day';
    return `Closes in ${daysLeft} days`;
  };

  const filteredMarkets = useMemo(() => {
    const now = Date.now();
    let list = [...mockMarkets];
    
    // Apply category filter first
    if (selectedCategory !== 'All') {
      list = list.filter(m => m.category === selectedCategory);
    }
    
    // Then apply status filter
    if (selectedFilter === 'Closed') {
      // Show only closed markets
      list = list.filter(m => parseEndsDate(m.ends) < now);
    } else {
      // Exclude closed markets from all other filters
      list = list.filter(m => parseEndsDate(m.ends) >= now);
      
      switch (selectedFilter) {
        case 'Ending Soon':
          list.sort((a, b) => parseEndsDate(a.ends) - parseEndsDate(b.ends));
          break;
        case 'High Value':
        case 'Trending':
          list.sort((a, b) => parseVolumeHBAR(b.volume) - parseVolumeHBAR(a.volume));
          break;
        case 'Newest':
        default:
          // keep insertion order for demo
          break;
      }
    }
    
    return list;
  }, [selectedFilter, selectedCategory]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredMarkets.length / marketsPerPage);
  const startIndex = (currentPage - 1) * marketsPerPage;
  const endIndex = startIndex + marketsPerPage;
  const currentMarkets = filteredMarkets.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (filter: FilterKey) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: CategoryKey) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

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
          <h1 className="font-orbitron font-semibold text-[32px] text-white" style={{ margin: 0, marginBottom: '8px' }}>
            Prediction Markets
          </h1>
          
          <p className="font-orbitron text-[16px] text-[#CCCCCC]" style={{ margin: 0, marginBottom: '50px' }}>
            Trade on future event with transparent price and instant liquidity
          </p>

          {/* Status Filters Row */}
          <div
            className="flex items-center"
            style={{
              width: '601px',
              height: '38px',
              borderRadius: '6px',
              justifyContent: 'space-between',
              opacity: 1,
              marginBottom: '20px',
              background: '#1A1A1A',
              padding: '4px',
              gap: '4px',
            }}
          >
            {(['Trending','Ending Soon','High Value','Newest','Closed'] as FilterKey[]).map((key) => (
              <button
                key={key}
                onClick={() => handleFilterChange(key)}
                className="font-orbitron transition-colors duration-200"
                style={{
                  fontFamily: 'Orbitron',
                  fontSize: '14px',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '4px',
                  background: selectedFilter === key ? '#24c786' : 'transparent',
                  color: selectedFilter === key ? '#000000' : '#FFFFFF',
                  
                  cursor: 'pointer',
                  flex: 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {key}
              </button>
            ))}
          </div>

          {/* Category Filters Row */}
          <div
            className="flex items-center"
            style={{
              width: '700px',
              height: '38px',
              borderRadius: '6px',
              justifyContent: 'space-between',
              opacity: 1,
              marginBottom: '40px',
              background: '#1A1A1A',
              padding: '4px',
              gap: '4px',
            }}
          >
            {(['All','Crypto','Sports','Politics','Entertainment','Weather','Other'] as CategoryKey[]).map((key) => (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                className="font-orbitron transition-colors duration-200"
                style={{
                  fontFamily: 'Orbitron',
                  fontSize: '14px',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '4px',
                  background: selectedCategory === key ? '#24c786' : 'transparent',
                  color: selectedCategory === key ? '#000000' : '#FFFFFF',
                  cursor: 'pointer',
                  flex: 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {key}
              </button>
            ))}
          </div>

          {/* markets list */}
          <div className="flex flex-col" style={{ gap: '14px' }}>
            {currentMarkets.map((m) => (
              <div
                key={m.id}
                className="cursor-pointer relative"
                style={{
                  background: '#1a1a1a',
                  width: '1241px',
                  height: '148px',
                  borderRadius: '2px',
                  opacity: 1,
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {/* User Icon and Count */}
                <div style={{ position: 'absolute', top: '4px', left: '1px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Image 
                    src="/images/user.png" 
                    alt="user" 
                    width={15} 
                    height={15} 
                    style={{ 
                      opacity: 1,
                      filter: 'brightness(0) saturate(100%) invert(82%) sepia(47%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)'
                    }} 
                  />
                  <span 
                    className="font-orbitron"
                    style={{
                      fontFamily: 'Orbitron',
                      fontWeight: 700,
                      fontSize: '10px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      textAlign: 'center',
                      color: '#00FF99',
                    }}
                  >
                    {m.users}
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '55%' }}>
                  <Image src={m.icon} alt={m.category} width={32} height={32} className="rounded" />
                  <div>
                    <div className="text-white font-orbitron" style={{ fontWeight: 700, fontSize: '14px' }}>{m.category}</div>
                    <div className="text-white font-orbitron" style={{ fontWeight: 600, fontSize: '16px', lineHeight: '120%', marginTop: '4px' }}>{m.title}</div>
                  </div>
                </div>
                {/* Yes/No Buttons */}
                <div 
                  style={{ 
                    position: 'absolute',
                    display: 'flex', 
                    width: '247px',
                    height: '34px',
                    justifyContent: 'space-between',
                    gap: '10px',
                    opacity: 1,
                    top: '23px',
                    left: '968px',
                  }}
                >
                    <button
                      className="font-orbitron transition-all duration-200"
                      style={{
                        width: '115px',
                        height: '34px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '8px',
                        border: '1px solid #00FF99',
                        borderRadius: '2px',
                        background: 'transparent',
                        color: '#00FF99',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        opacity: 1,
                      }}
                    >
                      <span>👍</span>
                      <span>Yes</span>
                    </button>
                    <button
                      className="font-orbitron transition-all duration-200"
                      style={{
                        width: '115px',
                        height: '34px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '8px',
                        border: '1px solid #FF3366',
                        borderRadius: '2px',
                        background: 'transparent',
                        color: '#FF3366',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        opacity: 1,
                      }}
                    >
                      <span>👎</span>
                      <span>No</span>
                    </button>
                </div>
                
                {/* Closes in badge */}
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '17px',
                    left: '18px',
                    minWidth: '102px',
                    height: '18px',
                    borderRadius: '10px',
                    padding: '4px 8px',
                    gap: '4px',
                    background: '#FEC428',
                    opacity: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    className="font-orbitron"
                    style={{
                      fontFamily: 'Orbitron',
                      fontWeight: 700,
                      fontSize: '8px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      textAlign: 'center',
                      color: '#000000',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {getClosingText(m.ends)}
                  </span>
                </div>

                {/* Volume and Trades */}
                <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', gap: '24px', bottom: '23px', right: '18px' }}>
                  <div className="font-orbitron text-[#CCCCCC] text-[12px]">
                    <div>Volume</div>
                    <div className="text-white text-[14px]" style={{ marginTop: '2px', textAlign: 'right' }}>{m.volume}</div>
                  </div>
                  <div className="font-orbitron text-[#CCCCCC] text-[12px] text-right">
                    <div>Trades</div>
                    <div className="text-white text-[14px]" style={{ marginTop: '2px' }}>{m.trades}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Navigation */}
          {filteredMarkets.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '408px',
                height: '56px',
                padding: '8px',
                gap: '20px',
                opacity: 1,
                marginTop: '40px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {/* Left Arrow */}
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="font-orbitron transition-all duration-200"
                style={{
                  width: '25px',
                  height: '25px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  background: 'transparent',
                  color: currentPage === 1 ? '#666666' : '#CCCCCC',
                  fontFamily: 'Orbitron',
                  fontWeight: 700,
                  fontSize: '24px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.3 : 1,
                }}
              >
                ‹
              </button>

              {/* Page Numbers */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className="font-orbitron transition-all duration-200"
                    style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      background: currentPage === page ? '#00FF99' : 'transparent',
                      color: currentPage === page ? '#000000' : '#FFFFFF',
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
              </div>

              {/* Right Arrow */}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="font-orbitron transition-all duration-200"
                style={{
                  width: '25px',
                  height: '25px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  background: 'transparent',
                  color: currentPage === totalPages ? '#666666' : '#CCCCCC',
                  fontFamily: 'Orbitron',
                  fontWeight: 700,
                  fontSize: '24px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === totalPages ? 0.3 : 1,
                }}
              >
                ›
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Markets;

