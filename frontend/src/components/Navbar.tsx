import React from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar: React.FC = () => {

  return (
    <header className="w-full max-w-[1440px] h-[126px] grid grid-cols-[1fr_auto_1fr] items-center pr-[90px] pl-[90px] bg-black relative mx-auto min-w-[1200px]">
      <div className="flex items-center">
        <Link href="/" className="w-[127px] h-[60px] flex items-center justify-center p-[10px] text-white font-orbitron text-[32px] font-bold tracking-[1px] transition-all duration-300 cursor-pointer hover:text-[#00FF99] hover:drop-shadow-[0_0_10px_#00FF99] hover:scale-105">
          Truce
        </Link>
      </div>
      
      <div className="flex items-center justify-center">
        <nav className="w-[650px] h-[40px] flex items-center gap-[25px]">
        <Link href="/Dashboard" className="text-white no-underline font-orbitron text-[16px] font-medium transition-colors duration-300 hover:text-[#00FF99]">Dashboard</Link>
          <Link href="/Create" className="text-white no-underline font-orbitron text-[16px] font-medium transition-colors duration-300 hover:text-[#00FF99]">Predict</Link>
          <Link href="/Markets" className="text-white no-underline font-orbitron text-[16px] font-medium transition-colors duration-300 hover:text-[#00FF99]">Markets</Link>
          <Link href="/Analytics" className="text-white no-underline font-orbitron text-[16px] font-medium transition-colors duration-300 hover:text-[#00FF99]">Analytics</Link>
          <Link href="/docs" className="text-white no-underline font-orbitron text-[16px] font-medium transition-colors duration-300 hover:text-[#00FF99]">Docs</Link>
        </nav>
      </div>
      
      <div className="flex items-center justify-end min-w-[215px] max-w-[500px] [&_[data-testid='rk-connect-button']]:!bg-transparent [&_[data-testid='rk-connect-button']]:!border-2 [&_[data-testid='rk-connect-button']]:!border-[#00FF99] [&_[data-testid='rk-connect-button']]:!text-[#00FF99] [&_[data-testid='rk-connect-button']]:!rounded [&_[data-testid='rk-connect-button']:hover]:!bg-transparent [&_[data-testid='rk-connect-button']:hover]:!border-[#00FF99] [&_[data-testid='rk-connect-button']:hover]:!text-[#00FF99] [&_[data-testid='rk-connect-button']:hover]:!shadow-[0_0_20px_#00FF99,0_0_40px_#00FF99] [&_[data-testid='rk-account-button']:hover]:!shadow-[0_0_20px_#00FF99,0_0_40px_#00FF99] [&_[data-testid='rk-network-button']:hover]:!shadow-[0_0_20px_#00FF99,0_0_40px_#00FF99] [&_button[data-testid='rk-network-button']:hover]:!shadow-[0_0_20px_#00FF99,0_0_40px_#00FF99] [&_[data-testid='rk-network-button']_button:hover]:!shadow-[0_0_20px_#00FF99,0_0_40px_#00FF99] [&_[data-testid='rk-network-button']_*:hover]:!shadow-[0_0_20px_#00FF99,0_0_40px_#00FF99]">
        <ConnectButton />
      </div>
    </header>
  );
};

export default Navbar;
