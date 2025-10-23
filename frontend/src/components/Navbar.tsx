import React from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar: React.FC = () => {

  return (
    <header className="w-full max-w-[1440px] h-[126px] flex justify-between items-center pr-[90px] pl-[90px] bg-transparent relative mx-auto min-w-[1200px]">
      <div className="flex items-center">
        <Link href="/" className="w-[127px] h-[60px] flex items-center justify-center p-[10px] text-white font-orbitron text-[32px] font-bold tracking-[1px] transition-all duration-300 cursor-pointer hover:text-[#00FF99] hover:drop-shadow-[0_0_10px_#00FF99] hover:scale-105">
          Truce
        </Link>
      </div>
      
      <div className="flex items-center">
        <nav className="w-[372px] h-[40px] flex items-center gap-[30px]">
          <Link href="/Create" className="text-white no-underline font-orbitron text-[16px] font-medium transition-colors duration-300 hover:text-[#00FF99]">Create</Link>
          <a href="#" className="text-white no-underline font-orbitron text-[16px] font-medium transition-colors duration-300 hover:text-[#00FF99]">Markets</a>
          <a href="#" className="text-white no-underline font-orbitron text-[16px] font-medium transition-colors duration-300 hover:text-[#00FF99]">Leaderboard</a>
        </nav>
      </div>
      
      <div className="flex items-center justify-end min-w-[215px] max-w-[500px] flex-1 [&_[data-testid='rk-connect-button']]:!bg-transparent [&_[data-testid='rk-connect-button']]:!border-2 [&_[data-testid='rk-connect-button']]:!border-[#00FF99] [&_[data-testid='rk-connect-button']]:!text-[#00FF99] [&_[data-testid='rk-connect-button']]:!rounded [&_[data-testid='rk-connect-button']:hover]:!bg-transparent [&_[data-testid='rk-connect-button']:hover]:!border-[#00FF99] [&_[data-testid='rk-connect-button']:hover]:!text-[#00FF99] [&_[data-testid='rk-connect-button']:hover]:!shadow-[0_0_20px_#00FF99,0_0_40px_#00FF99] [&_[data-testid='rk-account-button']:hover]:!shadow-[0_0_20px_#00FF99,0_0_40px_#00FF99] [&_[data-testid='rk-network-button']:hover]:!shadow-[0_0_20px_#00FF99,0_0_40px_#00FF99] [&_button[data-testid='rk-network-button']:hover]:!shadow-[0_0_20px_#00FF99,0_0_40px_#00FF99] [&_[data-testid='rk-network-button']_button:hover]:!shadow-[0_0_20px_#00FF99,0_0_40px_#00FF99] [&_[data-testid='rk-network-button']_*:hover]:!shadow-[0_0_20px_#00FF99,0_0_40px_#00FF99]">
        <ConnectButton />
      </div>
    </header>
  );
};

export default Navbar;
