import React from 'react';
import Image from 'next/image';

const HowItWorks: React.FC = () => {
  return (
    <section className="w-full min-h-[500px] bg-[#101010] relative flex flex-col items-center justify-start pt-[50px] overflow-visible before:content-[''] before:absolute before:top-[50px] before:left-[-150px] before:w-[324px] before:h-[270px] before:bg-gradient-to-b before:from-white/30 before:to-[#00FF99]/30 before:rounded-full before:opacity-80 before:blur-[50px] before:z-0">
      <div className="w-[737px] flex flex-col gap-[10px] p-[10px] relative z-[1] mb-16 md:w-[90%] md:p-5">
        <div className="w-full flex items-center justify-center p-[10px]">
          <h2 className="font-orbitron font-bold text-[32px] text-white m-0 drop-shadow-[0_0_5px_rgba(0,255,153,0.3)] text-center md:text-[28px]">How Truce Works</h2>
        </div>
        
        <div className="w-full flex items-center justify-center p-[10px]">
          <p className="font-orbitron font-normal text-[15px] text-white m-0 leading-[1.2] opacity-80 text-center whitespace-nowrap max-w-full md:text-[16px]">
            Turn complex markets into easy, trusted experiences.
          </p>
        </div>
      </div>
      
      <div className="w-full max-w-[1200px] h-[146px] flex justify-between p-1 px-5 z-[1] md:w-[90%] md:flex-col md:gap-5 md:relative md:top-auto md:left-auto md:h-auto">
        <div className="w-[350px] h-[138px] flex flex-col items-center justify-center gap-[10px] p-[10px] rounded-lg border-2 border-dashed border-[#00FF99] bg-transparent transition-all duration-300 cursor-pointer flex-shrink-0 hover:bg-[rgba(0,255,153,0.1)] hover:border-[#00FF99] hover:shadow-[0_0_20px_rgba(0,255,153,0.3)] hover:-translate-y-[2px] md:w-full md:h-auto md:min-h-[120px]">
          <Image src="/images/checkmark.png" alt="Step 1" width={24} height={24} className="w-6 h-6 filter brightness-0 saturate-100 invert-100 sepia-100 saturate-10000 hue-rotate-90" unoptimized />
          <p className="font-orbitron font-normal text-[16px] text-white text-center leading-7 tracking-[1%] m-0">Create a market question, outcomes, closing time, bond.</p>
        </div>
        
        <div className="w-[350px] h-[138px] flex flex-col items-center justify-center gap-[10px] p-[10px] rounded-lg border-2 border-dashed border-[#00FF99] bg-transparent transition-all duration-300 cursor-pointer flex-shrink-0 hover:bg-[rgba(0,255,153,0.1)] hover:border-[#00FF99] hover:shadow-[0_0_20px_rgba(0,255,153,0.3)] hover:-translate-y-[2px] md:w-full md:h-auto md:min-h-[120px]">
          <Image src="/images/checkmark.png" alt="Step 2" width={24} height={24} className="w-6 h-6 filter brightness-0 saturate-100 invert-100 sepia-100 saturate-10000 hue-rotate-90" unoptimized />
          <p className="font-orbitron font-normal text-[16px] text-white text-center leading-7 tracking-[1%] m-0">Users place positions (on-chain) using stablecoins and tokens.</p>
        </div>
        
        <div className="w-[350px] h-[138px] flex flex-col items-center justify-center gap-[10px] p-[10px] rounded-lg border-2 border-dashed border-[#00FF99] bg-transparent transition-all duration-300 cursor-pointer flex-shrink-0 hover:bg-[rgba(0,255,153,0.1)] hover:border-[#00FF99] hover:shadow-[0_0_20px_rgba(0,255,153,0.3)] hover:-translate-y-[2px] md:w-full md:h-auto md:min-h-[120px]">
          <Image src="/images/checkmark.png" alt="Step 3" width={24} height={24} className="w-6 h-6 filter brightness-0 saturate-100 invert-100 sepia-100 saturate-10000 hue-rotate-90" unoptimized />
          <p className="font-orbitron font-normal text-[16px] text-white text-center leading-7 tracking-[1%] m-0">At resolution, oracles report and funds auto-distribute.</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
