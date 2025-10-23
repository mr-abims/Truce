import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';

const Create: NextPage = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Head>
        <title>Truce - Create</title>
        <meta
          content="Truce - Create a new prediction market"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Navbar />

      <main className="flex-1 relative w-full max-w-full h-[calc(100vh-126px)] flex items-center justify-center p-4 box-border overflow-y-auto overflow-x-hidden">
        <div 
          className="relative mx-auto"
          style={{
            width: '1312px',
            height: '1085px',
            top: '50px',
            background: '#151515',
            opacity: 1
          }}
        >
          <div 
            className="absolute"
            style={{
              width: '387px',
              height: '65px',
              top: '21px',
              left: '415px',
              padding: '10px',
              gap: '10px',
              opacity: 1
            }}
          >
            <h1 className="font-orbitron font-semibold text-[28px] text-white">Forge a Prediction</h1>
          </div>
          <div 
            className="absolute"
            style={{
              width: '504px',
              height: '40px',
              top: '88px',
              left: '356px',
              padding: '10px',
              gap: '10px',
              opacity: 1
            }}
          >
            <p className="font-orbitron font-normal text-[14px] text-[#CCCCCC]">Design a new quest for the community to embark upon</p>
          </div>
          <div 
            className="absolute flex items-center justify-center"
            style={{
              width: '50px',
              height: '50px',
              top: '48px',
              left: '1149px',
              borderRadius: '1000px',
              background: '#555454',
              opacity: 1
            }}
          >
            <span className="font-orbitron font-bold text-[14px] text-white">1</span>
          </div>

          <div 
            className="absolute grid grid-cols-2"
            style={{
              width: '1142px',
              height: '673px',
              top: '206px',
              left: '85px',
              gap: '37px',
              boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.25)',
              opacity: 1
            }}
          >
            <div 
              className="rounded-lg flex items-center justify-center"
              style={{
                width: '504px',
                height: '194.33px',
                background: '#2F2F2F80',
                border: '2px solid #00FF73',
                boxShadow: '4px 4px 30px 0px #00FF99, 4px 4px 120px 0px rgba(0,0,0,0.25)',
                opacity: 1
              }}
            >
              <span className="text-[#666666] font-orbitron text-sm">Card 1</span>
            </div>
            
            
            <div 
              className="rounded-lg flex items-center justify-center"
              style={{
                width: '504px',
                height: '194.33px',
                background: '#2F2F2F80',
                border: '2px solid #00FF73',
                boxShadow: '4px 4px 30px 0px #00FF99, 4px 4px 120px 0px rgba(0,0,0,0.25)',
                opacity: 1
              }}
            >
              <span className="text-[#666666] font-orbitron text-sm">Card 2</span>
            </div>
            
            <div 
              className="rounded-lg flex items-center justify-center"
              style={{
                width: '504px',
                height: '194.33px',
                background: '#2F2F2F80',
                border: '2px solid #00FF73',
                boxShadow: '4px 4px 30px 0px #00FF99, 4px 4px 120px 0px rgba(0,0,0,0.25)',
                opacity: 1
              }}
            >
              <span className="text-[#666666] font-orbitron text-sm">Card 3</span>
            </div>
            
            
            <div 
              className="rounded-lg flex items-center justify-center"
              style={{
                width: '504px',
                height: '194.33px',
                background: '#2F2F2F80',
                border: '2px solid #00FF73',
                boxShadow: '4px 4px 30px 0px #00FF99, 4px 4px 120px 0px rgba(0,0,0,0.25)',
                opacity: 1
              }}
            >
              <span className="text-[#666666] font-orbitron text-sm">Card 4</span>
            </div>
            
            
            <div 
              className="rounded-lg flex items-center justify-center"
              style={{
                width: '504px',
                height: '194.33px',
                background: '#2F2F2F80',
                border: '2px solid #00FF73',
                boxShadow: '4px 4px 30px 0px #00FF99, 4px 4px 120px 0px rgba(0,0,0,0.25)',
                opacity: 1
              }}
            >
              <span className="text-[#666666] font-orbitron text-sm">Card 5</span>
            </div>
            
            <div 
              className="rounded-lg flex items-center justify-center"
              style={{
                width: '504px',
                height: '194.33px',
                background: '#2F2F2F80',
                border: '2px solid #00FF73',
                boxShadow: '4px 4px 30px 0px #00FF99, 4px 4px 120px 0px rgba(0,0,0,0.25)',
                opacity: 1
              }}
            >
              <span className="text-[#666666] font-orbitron text-sm">Card 6</span>
            </div>
          </div>

          <div 
            className="absolute flex justify-between items-center"
            style={{
              width: '1111px',
              height: '56px',
              top: '964px',
              left: '101px',
              padding: '8px',
              opacity: 1
            }}
          >

            <Link 
              href="/" 
              className="flex items-center justify-center gap-2"
              style={{
                width: '115px',
                height: '40px',
                padding: '10px',
                gap: '10px',
                borderRadius: '8px',
                background: '#D9D9D980',
                opacity: 1
              }}
            >
              <span className="text-black font-orbitron text-[14px]">‹ Back</span>
            </Link>
            
           
            <button 
              className="flex items-center justify-center gap-2"
              style={{
                width: '159px',
                height: '40px',
                padding: '10px',
                gap: '10px',
                borderRadius: '8px',
                border: '2px solid #00FF99',
                background: 'transparent',
                opacity: 1
              }}
            >
              <span className="text-[#00FF99] font-orbitron text-[14px]">Next ›</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Create;
