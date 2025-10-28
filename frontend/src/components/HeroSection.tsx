import React from 'react';
import Image from 'next/image';

const HeroSection: React.FC = () => {
  return (
    <section className="w-full min-h-[800px] bg-[#101010] relative overflow-visible flex items-center justify-center">
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">

        <div className="absolute top-[147px] left-[72px] w-[392px] h-[729px] opacity-100 rotate-0 z-[1] xl:left-[20px] lg:hidden">
          <Image
            src="/images/pic2.png"
            alt="Futuristic masked character with glowing eyes"
            width={392}
            height={729}
            className="w-full h-full object-contain"
            priority
            unoptimized
          />
        </div>
        
        
        <div className="absolute top-[148px] left-[894px] w-[526px] h-[646px] opacity-100 rotate-0 z-[1] xl:left-[calc(100%-546px)] lg:hidden">
          <Image
            src="/images/pic3.png"
            alt="Futuristic masked character with glowing eyes"
            width={526}
            height={646}
            className="w-full h-full object-contain"
            priority
            unoptimized
          />
        </div>
      </div>
      
      
      <div className="absolute z-[2] w-[1024px] h-[306px] top-[205px] left-1/2 transform -translate-x-1/2 flex flex-col gap-4 items-center">
      
        <div className="w-[1024px] h-[240px] flex items-center justify-center">
          <h1 className="font-orbitron font-semibold text-[96px] leading-[100%] tracking-[0%] text-center text-white m-0 drop-shadow-[1px_1px_5px_rgba(0,255,153,0.3)] filter drop-shadow-[0_0_3px_#00FF99]">Turn Opinions into Outcomes</h1>
        </div>
        
        <div className="w-[869px] h-[50px] mx-auto flex items-center justify-center">
          <p className="font-orbitron font-semibold text-[20px] leading-[100%] tracking-[0%] text-center text-white/50 m-0">
            Harness the Power of the Blockchain, Forecast the future of Digital Assets in Our High Stakes Prediction Board and Claim Reward
          </p>
        </div>
        
        <div className="w-[1075px] h-[120px] absolute top-[450px] left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-[99px] z-[3]">
          <div className="flex flex-row items-center justify-center gap-6 p-4 box-border w-[334px] h-[120px]">
            <Image src="/images/Icon2.png" alt="Digital Currency" width={80} height={80} className="w-[80px] h-[80px] flex-shrink-0 object-contain" unoptimized />
            <div className="flex-1 flex flex-col items-center justify-center gap-1">
              <span className="font-orbitron font-bold text-[40px] text-white text-center drop-shadow-[0_0_5px_rgba(0,255,153,0.3)] leading-[150%] tracking-[0%]">$30B</span>
              <span className="font-orbitron font-normal text-[16px] text-white text-center drop-shadow-[0_0_5px_rgba(0,255,153,0.3)] leading-7 tracking-[1%]">Digital Currency Exchanged</span>
            </div>
          </div>
          
          <div className="flex flex-row items-center justify-center gap-6 p-4 box-border w-[265px] h-[120px]">
            <Image src="/images/Icon1.png" alt="Active Users" width={80} height={80} className="w-[80px] h-[80px] flex-shrink-0 object-contain" unoptimized />
            <div className="flex-1 flex flex-col items-center justify-center gap-1">
              <span className="font-orbitron font-bold text-[40px] text-white text-center drop-shadow-[0_0_5px_rgba(0,255,153,0.3)] leading-[150%] tracking-[0%]">1,000+</span>
              <span className="font-orbitron font-normal text-[16px] text-white text-center drop-shadow-[0_0_5px_rgba(0,255,153,0.3)] leading-7 tracking-[1%]">Active Users</span>
            </div>
          </div>
          
          <div className="flex flex-row items-center justify-center gap-6 p-4 box-border w-[278px] h-[120px]">
            <Image src="/images/Icon3.png" alt="Total Volume" width={80} height={80} className="w-[80px] h-[80px] flex-shrink-0 object-contain" unoptimized />
            <div className="flex-1 flex flex-col items-center justify-center gap-1">
              <span className="font-orbitron font-bold text-[40px] text-white text-center drop-shadow-[0_0_5px_rgba(0,255,153,0.3)] leading-[150%] tracking-[0%]">2.5k+</span>
              <span className="font-orbitron font-normal text-[16px] text-white text-center drop-shadow-[0_0_5px_rgba(0,255,153,0.3)] leading-7 tracking-[1%]">Total Volume</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
