import React from 'react';
import Image from 'next/image';

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
    <section className="w-full min-h-[700px] bg-[#101010] relative flex flex-col items-center justify-start pt-[50px] overflow-visible before:content-[''] before:absolute before:w-[324px] before:h-[270.67px] before:top-[200px] before:left-[-117px] before:bg-gradient-to-b before:from-white before:to-[#00FF99] before:rounded-full before:opacity-30 before:blur-[50px] before:z-0">
      <div className="w-[737px] flex flex-col gap-[10px] p-[10px] relative z-[1] mb-16 md:w-[90%] md:p-5">
        <div className="w-full flex items-center justify-center gap-[10px] p-[10px]">
          <h2 className="font-orbitron font-semibold text-[32px] text-white text-center m-0 leading-none tracking-[0%] md:text-[28px]">Market Categories</h2>
        </div>
        <div className="w-full flex items-center justify-center gap-[10px] p-[10px]">
          <p className="font-orbitron font-normal text-[15px] text-white m-0 leading-[1.2] opacity-80 text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-full md:text-[16px]">
            Specialized markets with tailored liquidity parameters for different types of events.
          </p>
        </div>
      </div>
      
      
      <div className="w-full max-w-[1200px] grid grid-cols-3 grid-rows-2 gap-[24px] p-10 px-[50px] z-[1] md:grid-cols-2 md:grid-rows-3 md:gap-5 md:p-5">
        {categories.map((category, index) => (
          <div key={index} className="flex flex-row items-center justify-start rounded-lg border-none bg-[#222222] transition-all duration-300 cursor-pointer hover:bg-[rgba(0,255,153,0.1)] hover:shadow-[0_0_20px_rgba(0,255,153,0.3)] hover:-translate-y-[2px]" style={{ width: '266px', height: '75px', padding: '10px', gap: '10px' }}>
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 md:w-8 md:h-8">
              {category.isImage ? (
                <Image
                  src={category.icon}
                  alt={category.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-contain filter hue-rotate-[120deg] saturate-[1.5] brightness-[1.2]"
                  unoptimized
                  priority
                />
              ) : (
                <span className="text-[32px] leading-none flex items-center justify-center filter hue-rotate-[120deg] saturate-[1.5] brightness-[1.2] md:text-[24px]">{category.icon}</span>
              )}
            </div>
            <div className="font-orbitron font-semibold text-[18px] text-white text-left m-0 leading-[1.2] tracking-[0%] md:text-[16px]">{category.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MarketCategories;
