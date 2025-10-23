import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black border-t border-[#333333] pt-[60px] pb-5 mt-20">
      <div className="w-full max-w-[1200px] mx-auto px-5 flex justify-between items-start gap-[60px] lg:gap-10 md:flex-col md:gap-10 md:items-center md:text-center">
        <div className="flex-none">
          <h3 className="font-orbitron font-bold text-[32px] text-[#00FF99] m-0 leading-none tracking-[0%] drop-shadow-[0_0_10px_rgba(0,255,153,0.3)] md:text-[28px] sm:text-[24px]">Truce</h3>
        </div>

        <div className="flex-1 flex justify-between gap-[60px] lg:gap-10 md:w-full md:flex-col md:gap-[30px] sm:gap-[25px]">
          <div className="flex-1 flex flex-col">
            <h4 className="font-orbitron font-semibold text-[18px] text-white m-0 mb-5 leading-[1.2] tracking-[0%] md:text-[16px] sm:text-[15px] sm:mb-[15px]">Support</h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              <li><a href="#" className="font-orbitron font-normal text-[14px] text-[#CCCCCC] no-underline transition-all duration-300 leading-[1.4] tracking-[0%] hover:text-[#00FF99] hover:drop-shadow-[0_0_8px_rgba(0,255,153,0.5)] hover:translate-x-[5px] md:text-[13px] sm:text-[12px]">Pricing Plan</a></li>
              <li><a href="#" className="font-orbitron font-normal text-[14px] text-[#CCCCCC] no-underline transition-all duration-300 leading-[1.4] tracking-[0%] hover:text-[#00FF99] hover:drop-shadow-[0_0_8px_rgba(0,255,153,0.5)] hover:translate-x-[5px] md:text-[13px] sm:text-[12px]">Documentation</a></li>
              <li><a href="#" className="font-orbitron font-normal text-[14px] text-[#CCCCCC] no-underline transition-all duration-300 leading-[1.4] tracking-[0%] hover:text-[#00FF99] hover:drop-shadow-[0_0_8px_rgba(0,255,153,0.5)] hover:translate-x-[5px] md:text-[13px] sm:text-[12px]">Guide</a></li>
              <li><a href="#" className="font-orbitron font-normal text-[14px] text-[#CCCCCC] no-underline transition-all duration-300 leading-[1.4] tracking-[0%] hover:text-[#00FF99] hover:drop-shadow-[0_0_8px_rgba(0,255,153,0.5)] hover:translate-x-[5px] md:text-[13px] sm:text-[12px]">Tutorial</a></li>
            </ul>
          </div>

          <div className="flex-1 flex flex-col">
            <h4 className="font-orbitron font-semibold text-[18px] text-white m-0 mb-5 leading-[1.2] tracking-[0%] md:text-[16px] sm:text-[15px] sm:mb-[15px]">Company</h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              <li><a href="#" className="font-orbitron font-normal text-[14px] text-[#CCCCCC] no-underline transition-all duration-300 leading-[1.4] tracking-[0%] hover:text-[#00FF99] hover:drop-shadow-[0_0_8px_rgba(0,255,153,0.5)] hover:translate-x-[5px] md:text-[13px] sm:text-[12px]">About</a></li>
              <li><a href="#" className="font-orbitron font-normal text-[14px] text-[#CCCCCC] no-underline transition-all duration-300 leading-[1.4] tracking-[0%] hover:text-[#00FF99] hover:drop-shadow-[0_0_8px_rgba(0,255,153,0.5)] hover:translate-x-[5px] md:text-[13px] sm:text-[12px]">Blog</a></li>
              <li><a href="#" className="font-orbitron font-normal text-[14px] text-[#CCCCCC] no-underline transition-all duration-300 leading-[1.4] tracking-[0%] hover:text-[#00FF99] hover:drop-shadow-[0_0_8px_rgba(0,255,153,0.5)] hover:translate-x-[5px] md:text-[13px] sm:text-[12px]">Join Us</a></li>
              <li><a href="#" className="font-orbitron font-normal text-[14px] text-[#CCCCCC] no-underline transition-all duration-300 leading-[1.4] tracking-[0%] hover:text-[#00FF99] hover:drop-shadow-[0_0_8px_rgba(0,255,153,0.5)] hover:translate-x-[5px] md:text-[13px] sm:text-[12px]">Press</a></li>
              <li><a href="#" className="font-orbitron font-normal text-[14px] text-[#CCCCCC] no-underline transition-all duration-300 leading-[1.4] tracking-[0%] hover:text-[#00FF99] hover:drop-shadow-[0_0_8px_rgba(0,255,153,0.5)] hover:translate-x-[5px] md:text-[13px] sm:text-[12px]">Partners</a></li>
            </ul>
          </div>

          <div className="flex-1 flex flex-col">
            <h4 className="font-orbitron font-semibold text-[18px] text-white m-0 mb-5 leading-[1.2] tracking-[0%] md:text-[16px] sm:text-[15px] sm:mb-[15px]">Legal</h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              <li><a href="#" className="font-orbitron font-normal text-[14px] text-[#CCCCCC] no-underline transition-all duration-300 leading-[1.4] tracking-[0%] hover:text-[#00FF99] hover:drop-shadow-[0_0_8px_rgba(0,255,153,0.5)] hover:translate-x-[5px] md:text-[13px] sm:text-[12px]">Claim</a></li>
              <li><a href="#" className="font-orbitron font-normal text-[14px] text-[#CCCCCC] no-underline transition-all duration-300 leading-[1.4] tracking-[0%] hover:text-[#00FF99] hover:drop-shadow-[0_0_8px_rgba(0,255,153,0.5)] hover:translate-x-[5px] md:text-[13px] sm:text-[12px]">Privacy</a></li>
              <li><a href="#" className="font-orbitron font-normal text-[14px] text-[#CCCCCC] no-underline transition-all duration-300 leading-[1.4] tracking-[0%] hover:text-[#00FF99] hover:drop-shadow-[0_0_8px_rgba(0,255,153,0.5)] hover:translate-x-[5px] md:text-[13px] sm:text-[12px]">Terms</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-[1200px] mt-10 mx-auto pt-5 px-5 border-t border-[#333333] text-center">
        <p className="font-orbitron font-normal text-[14px] text-[#888888] m-0 leading-[1.4] tracking-[0%] sm:text-[12px]">© Truce 2025. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
