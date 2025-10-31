import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Navbar from '../components/Navbar';

const Analytics: NextPage = () => {

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Head>
        <title>Truce - Analytics</title>
        <meta name="description" content="Platform analytics and insights" />
      </Head>

      <Navbar />

      <main className="flex-1 w-full flex justify-center">
        <div className="w-full" style={{ maxWidth: '1312px', minWidth: '1200px', padding: '40px 64px', position: 'relative' }}>
          <div className="mb-8">
            <h1 className="font-orbitron font-semibold text-[32px] text-white mb-2">Analytics</h1>
            <p className="font-orbitron text-[16px] text-[#CCCCCC]">Platform-wide performance and market insights</p>
          </div>


          <div style={{ width: '1256px', height: '111px', borderRadius: '2px', borderWidth: '2px', background: '#222222', border: '2px solid #61616133', marginTop: '16px', position: 'relative' }}>
            <div style={{ position: 'absolute', width: '77px', height: '75px', top: '18px', left: '50px', padding: '4px', gap: '8px', display: 'flex', flexDirection: 'column' }}>
              <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '10px', lineHeight: '100%', color: '#FFFFFF' }}>Total Market</div>
              <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 600, fontSize: '24px', lineHeight: '100%', color: '#FFFFFF' }}>427</div>
            </div>
            <div style={{ position: 'absolute', width: '0px', height: '69px', top: '21px', left: '253.83px', opacity: 0.3, borderLeft: '1px solid #FFFFFF' }} />
            <div style={{ position: 'absolute', width: '214px', height: '75px', top: '18px', left: '315.67px', padding: '4px', gap: '8px', display: 'flex', flexDirection: 'column' }}>
              <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '10px', lineHeight: '100%', color: '#FFFFFF' }}>Total Volume</div>
              <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 600, fontSize: '24px', lineHeight: '100%', color: '#FFFFFF' }}>128499.47 HBAR</div>
            </div>
            <div style={{ position: 'absolute', width: '0px', height: '69px', top: '21px', left: '650px', opacity: 0.3, borderLeft: '1px solid #FFFFFF' }} />
            <div style={{ position: 'absolute', width: '77px', height: '75px', top: '18px', left: '711.33px', padding: '4px', gap: '8px', display: 'flex', flexDirection: 'column' }}>
              <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '10px', lineHeight: '100%', color: '#FFFFFF' }}>Active Users</div>
              <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 600, fontSize: '24px', lineHeight: '100%', color: '#FFFFFF' }}>1,543</div>
            </div>
            <div style={{ position: 'absolute', width: '0px', height: '69px', top: '21px', left: '978px', opacity: 0.3, borderLeft: '1px solid #FFFFFF' }} />
            <div style={{ position: 'absolute', width: '164px', height: '75px', top: '18px', left: '1042px', padding: '4px', gap: '8px', display: 'flex', flexDirection: 'column' }}>
              <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '10px', lineHeight: '100%', color: '#FFFFFF' }}>Aug Market Size</div>
              <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 600, fontSize: '24px', lineHeight: '100%', color: '#FFFFFF' }}>8,921 HBAR</div>
            </div>
          </div>

          <div style={{ width: '1256px', display: 'flex', gap: '55px', margin: '48px auto 0 auto' }}>
            <div style={{ width: '617px', height: '497px', borderRadius: '2px', borderWidth: '2px', background: '#222222', border: '2px solid #61616133', padding: '24px', position: 'relative' }}>
              <h2 className="font-orbitron" style={{ position: 'absolute', width: '259px', height: '30px', top: '34px', left: '21px', fontFamily: 'Orbitron', fontWeight: 500, fontSize: '20px', lineHeight: '150%', color: '#FFFFFF', margin: 0 }}>Market Cap Distribution</h2>
              <div style={{ width: '583px', height: '371px', position: 'absolute', top: '106px', left: '17px', gap: '29px', display: 'flex', flexDirection: 'column' }}>
                {[
                  { range: '5 - 20 ETH', market: '45 Market (35.4%)', barWidth: '350px' },
                  { range: '20 - 50 ETH', market: '32 Market (25.2%)', barWidth: '250px' },
                  { range: '50 - 100 ETH', market: '28 Market (22.0%)', barWidth: '220px' },
                  { range: '100+ ETH', market: '22 Market (17.4%)', barWidth: '170px' },
                ].map((item, index) => (
                  <div key={index} style={{ width: '583px', height: '51px', display: 'flex', flexDirection: 'column', padding: '4px', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="font-orbitron" style={{ width: '350px', height: '18px', fontFamily: 'Orbitron', fontWeight: 700, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', color: '#FFFFFF' }}>{item.range}</span>
                      <span className="font-orbitron" style={{ width: '143px', height: '18px', fontFamily: 'Orbitron', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', color: '#FFFFFFB2', textAlign: 'right', whiteSpace: 'nowrap' }}>{item.market}</span>
                    </div>
                    <div style={{ width: item.barWidth, height: '10px', borderRadius: '0px', background: '#00FF99' }} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ width: '584px', height: '497px', borderRadius: '2px', borderWidth: '2px', border: '2px solid #61616133', background: '#222222', padding: '24px', position: 'relative' }}>
              <h2 className="font-orbitron" style={{ position: 'absolute', width: '257px', height: '30px', top: '30px', left: '13px', fontFamily: 'Orbitron', fontWeight: 500, fontSize: '20px', lineHeight: '150%', color: '#FFFFFF', margin: 0 }}>Volume by Categories</h2>
              <div style={{ width: '564px', height: '394px', position: 'absolute', top: '93px', left: '10px', padding: '8px', gap: '12px', display: 'flex', flexDirection: 'column' }}>
                {[
                  { icon: '/images/crypto.png', name: 'Crypto', volume: '109.00 ETH', percent: '3.8%' },
                  { icon: '/images/sports.png', name: 'Sports', volume: '95.50 ETH', percent: '3.3%' },
                  { icon: '/images/pol.png', name: 'Politics', volume: '87.20 ETH', percent: '3.0%' },
                  { icon: '/images/opera.png', name: 'Entertainment', volume: '76.80 ETH', percent: '2.7%' },
                  { icon: '/images/weath.png', name: 'Weather', volume: '64.30 ETH', percent: '2.2%' },
                  { icon: '/images/idea.png', name: 'Other', volume: '52.40 ETH', percent: '1.8%' },
                ].map((item, index) => (
                  <div key={index} style={{ width: '548px', height: '46px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px' }}>
                    <div style={{ width: '141px', height: '38px', display: 'flex', alignItems: 'center', padding: '4px', gap: '8px' }}>
                      <Image src={item.icon} alt={item.name} width={30} height={30} />
                      <span className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', color: '#FFFFFF' }}>{item.name}</span>
                    </div>
                    <div style={{ width: '79px', height: '36px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                      <span className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '12px', lineHeight: '18px', letterSpacing: '0%', textAlign: 'right', color: '#FFFFFF' }}>{item.volume}</span>
                      <span className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '12px', lineHeight: '18px', letterSpacing: '0%', textAlign: 'right', color: '#FFFFFF' }}>{item.percent}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ width: '1256px', height: '344px', borderRadius: '2px', borderWidth: '2px', padding: '20px', gap: '24px', background: '#222222', border: '2px solid #61616133', margin: '48px auto 0 auto' }}>
            <h2 className="font-orbitron" style={{ width: '1220px', height: '30px', fontFamily: 'Orbitron', fontWeight: 500, fontSize: '20px', lineHeight: '150%', color: '#FFFFFF', margin: 0 }}>Volume Over Time</h2>
            <div style={{ width: '1220px', height: '250px', marginTop: '24px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[100, 80, 60, 40, 20, 0].map((value, index) => (
                  <div key={index} style={{ width: '1219px', height: '18px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ width: '23px', height: '18px', fontFamily: 'Outfit', fontWeight: 400, fontSize: '12px', lineHeight: '150%', textAlign: 'right', color: '#FFFFFF' }}>{value}</span>
                    <div style={{ width: '1180px', height: '0px', borderTop: '1px solid #616161' }} />
                  </div>
                ))}
              </div>
              <div style={{ width: '1144px', height: '18px', display: 'flex', justifyContent: 'space-between', marginTop: '12px', marginLeft: '39px' }}>
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((month, index) => (
                  <span key={index} style={{ width: '20px', height: '18px', fontFamily: 'Outfit', fontWeight: 400, fontSize: '12px', lineHeight: '150%', color: '#FFFFFF', textAlign: 'center' }}>{month}</span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ width: '1260px', height: '502px', borderRadius: '2px', borderWidth: '2px', background: '#222222', border: '2px solid #61616133', margin: '48px auto 0 auto', padding: '20px', position: 'relative' }}>
            <h2 className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 500, fontSize: '20px', lineHeight: '150%', color: '#FFFFFF', margin: 0 }}>Top Market by Volume</h2>
            <div style={{ width: '1195px', height: '315px', position: 'absolute', top: '140px', left: '33px', padding: '8px', gap: '12px', display: 'flex', flexDirection: 'column' }}>
              {[
                { icon: '/images/crypto.png', name: 'Crypto', volume: '234.50 ETH', percent: '2.5%', isPositive: true },
                { icon: '/images/sports.png', name: 'Sports', volume: '198.30 ETH', percent: '1.8%', isPositive: true },
                { icon: '/images/pol.png', name: 'Politics', volume: '176.90 ETH', percent: '-0.5%', isPositive: false },
                { icon: '/images/opera.png', name: 'Entertainment', volume: '154.20 ETH', percent: '3.2%', isPositive: true },
                { icon: '/images/weath.png', name: 'Weather', volume: '132.80 ETH', percent: '-1.2%', isPositive: false },
                { icon: '/images/idea.png', name: 'Other', volume: '108.40 ETH', percent: '0.9%', isPositive: true },
              ].map((item, index) => (
                <div key={index} style={{ width: '1179px', height: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px' }}>
                  <div style={{ width: '303px', height: '28px', display: 'flex', alignItems: 'center', padding: '4px', gap: '8px' }}>
                    <Image src={item.icon} alt={item.name} width={30} height={30} />
                    <span className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '14px', lineHeight: '100%', color: '#FFFFFF' }}>{item.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span className="font-orbitron" style={{ width: '83px', height: '18px', fontFamily: 'Orbitron', fontWeight: 400, fontSize: '12px', lineHeight: '18px', textAlign: 'right', color: '#FFFFFF' }}>{item.volume}</span>
                    <span className="font-orbitron" style={{ width: '39px', height: '18px', fontFamily: 'Orbitron', fontWeight: 400, fontSize: '12px', lineHeight: '18px', textAlign: 'right', color: item.isPositive ? '#0F9C14' : '#A31111' }}>{item.percent}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;

