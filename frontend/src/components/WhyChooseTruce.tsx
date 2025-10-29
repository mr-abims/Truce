import React from 'react';
import Image from 'next/image';

const WhyChooseTruce: React.FC = () => {
  return (
    <section className="w-full min-h-[800px] bg-[#101010] relative flex flex-col items-center justify-start pt-[50px] overflow-visible before:content-[''] before:absolute before:w-[324px] before:h-[270.67px] before:top-[200px] before:right-[-117px] before:bg-gradient-to-b before:from-white before:to-[#00FF99] before:rounded-full before:opacity-30 before:blur-[50px] before:z-0">
      <div className="w-[737px] flex flex-col gap-0 relative z-[1] md:w-[90%]" style={{ width: '737px', opacity: 1, marginBottom: '60px' }}>
        <h2 className="font-orbitron font-semibold text-[32px] text-white text-center m-0 leading-none tracking-[0%] md:text-[28px]">Why Choose Truce?</h2>
        <p className="font-orbitron font-normal text-[15px] text-white m-0 mt-1 leading-[1.2] opacity-80 text-center whitespace-normal break-words md:text-[16px]">
          Advanced features that make prediction markets accessible, fair and rewarding.
        </p>
      </div>
      
      <div className="w-full max-w-[1200px] h-[490px] flex justify-between px-5 z-[1] md:w-[90%] md:flex-col md:gap-[30px] md:h-auto">
        
        <div className="group w-[350px] h-[489px] flex flex-col bg-transparent transition-all duration-300 cursor-pointer flex-shrink-0 border-none relative hover:opacity-90 md:w-full md:h-auto hover:scale-[1.01] hover:-rotate-3">
          {/* tape */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-[64px] h-[18px] bg-[#d9d9d9] opacity-80 shadow-sm rounded-[2px] pointer-events-none" />
          <div className="w-full h-[207px] rounded-[14px] border-none flex items-center justify-center overflow-hidden relative bg-[#222222] z-[2]" style={{ border: '8px solid transparent', borderImage: "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'8\\' height=\\'8\\'><path d=\\'M0,8 L4,0 L8,8\\' fill=\\'none\\' stroke=\\'%23000000\\' stroke-opacity=\\'0.2\\' stroke-width=\\'2\\'/></svg>') 8 round" }}>
            <Image
              src="/images/mon1.png"
              alt="Community Monster"
              width={379}
              height={207}
              className="w-[60%] h-[60%] object-contain rounded-[14px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[2]"
              unoptimized
              priority
            />
          </div>
          <div className="w-full h-[306px] flex flex-col items-center justify-start p-5 gap-4 bg-[rgba(0,255,153,0.4)] transition-all duration-300 z-[1] -mt-[2px] md:w-full md:h-auto md:min-h-[200px] hover:bg-transparent rounded-[14px]" style={{ border: '8px solid transparent', borderImage: "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'8\\' height=\\'8\\'><path d=\\'M0,8 L4,0 L8,8\\' fill=\\'none\\' stroke=\\'%23000000\\' stroke-opacity=\\'0.2\\' stroke-width=\\'2\\'/></svg>') 8 round" }}>
            <h3 className="font-orbitron font-bold text-[24px] text-black text-center m-0 leading-[1.2] tracking-[0%] hover:text-[#00FF99]">Community</h3>
            <p className="font-orbitron font-normal text-[16px] text-black text-center leading-7 tracking-[1%] m-0 opacity-80 hover:text-[#00FF99]">
              Constant product AMM with real-time slippage calculation ensures you know exactly what you&apos;re getting with no hidden outcomes.
            </p>
          </div>
        </div>

        
        <div className="group w-[350px] h-[489px] flex flex-col bg-transparent transition-all duration-300 cursor-pointer flex-shrink-0 border-none relative hover:opacity-90 md:w-full md:h-auto hover:scale-[1.01] hover:rotate-[3deg]">
          {/* tape */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-[64px] h-[18px] bg-[#d9d9d9] opacity-80 shadow-sm rounded-[2px] pointer-events-none" />
          <div className="w-full h-[207px] rounded-[14px] border-none flex items-center justify-center overflow-hidden relative bg-[#222222] z-[2]" style={{ border: '8px solid transparent', borderImage: "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'8\\' height=\\'8\\'><path d=\\'M0,8 L4,0 L8,8\\' fill=\\'none\\' stroke=\\'%23000000\\' stroke-opacity=\\'0.2\\' stroke-width=\\'2\\'/></svg>') 8 round" }}>
            <Image
              src="/images/mon2.png"
              alt="Liquidity Monster"
              width={379}
              height={207}
              className="w-[60%] h-[60%] object-contain rounded-[14px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[2]"
              unoptimized
              priority
            />
          </div>
          <div className="w-full h-[306px] flex flex-col items-center justify-start p-5 gap-4 bg-[rgba(0,255,153,0.4)] transition-all duration-300 z-[1] -mt-[2px] md:w-full md:h-auto md:min-h-[200px] hover:bg-transparent rounded-[14px]" style={{ border: '8px solid transparent', borderImage: "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'8\\' height=\\'8\\'><path d=\\'M0,8 L4,0 L8,8\\' fill=\\'none\\' stroke=\\'%23000000\\' stroke-opacity=\\'0.2\\' stroke-width=\\'2\\'/></svg>') 8 round" }}>
            <h3 className="font-orbitron font-bold text-[24px] text-black text-center m-0 leading-[1.2] tracking-[0%] hover:text-[#00FF99]">Liquidity</h3>
            <p className="font-orbitron font-normal text-[16px] text-black text-center leading-7 tracking-[1%] m-0 opacity-80 hover:text-[#00FF99]">
              Always-on liquidity powered by automated market makers allows you to trade anytime without waiting for counterparties.
            </p>
          </div>
        </div>

        
        <div className="group w-[350px] h-[489px] flex flex-col bg-transparent transition-all duration-300 cursor-pointer flex-shrink-0 border-none relative hover:opacity-90 md:w-full md:h-auto hover:scale-[1.01] hover:rotate-[-2deg]">
          {/* tape */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-[64px] h-[18px] bg-[#d9d9d9] opacity-80 shadow-sm rounded-[2px] pointer-events-none" />
          <div className="w-full h-[207px] rounded-[14px] border-none flex items-center justify-center overflow-hidden relative bg-[#222222] z-[2]" style={{ border: '8px solid transparent', borderImage: "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'8\\' height=\\'8\\'><path d=\\'M0,8 L4,0 L8,8\\' fill=\\'none\\' stroke=\\'%23000000\\' stroke-opacity=\\'0.2\\' stroke-width=\\'2\\'/></svg>') 8 round" }}>
            <Image
              src="/images/mon3.png"
              alt="Transparency Monster"
              width={379}
              height={207}
              className="w-[60%] h-[60%] object-contain rounded-[14px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[2]"
              unoptimized
              priority
            />
          </div>
          <div className="w-full h-[306px] flex flex-col items-center justify-start p-5 gap-4 bg-[rgba(0,255,153,0.4)] transition-all duration-300 z-[1] -mt-[2px] md:w-full md:h-auto md:min-h-[200px] hover:bg-transparent rounded-[14px]" style={{ border: '8px solid transparent', borderImage: "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'8\\' height=\\'8\\'><path d=\\'M0,8 L4,0 L8,8\\' fill=\\'none\\' stroke=\\'%23000000\\' stroke-opacity=\\'0.2\\' stroke-width=\\'2\\'/></svg>') 8 round" }}>
            <h3 className="font-orbitron font-bold text-[24px] text-black text-center m-0 leading-[1.2] tracking-[0%] hover:text-[#00FF99]">Transparency</h3>
            <p className="font-orbitron font-normal text-[16px] text-black text-center leading-7 tracking-[1%] m-0 opacity-80 hover:text-[#00FF99]">
              Collective wisdom is aggregated into accurate probability estimates, rewarding users with credibility and real benefits for correct predictions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseTruce;
