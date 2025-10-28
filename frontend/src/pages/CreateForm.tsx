import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

const CreateForm: NextPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(2);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (router.query.category) {
      setSelectedCategory(router.query.category as string);
      setCurrentStep(2); 
    }

    // Prevent going back to previous page on reload
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', window.location.href);
      const handlePopState = () => {
        window.history.pushState(null, '', window.location.href);
      };
      window.addEventListener('popstate', handlePopState);
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [router.query.category]);

  const categories = [
    {
      id: 'sports',
      name: 'Sports',
      icon: '/images/sports.png',
      description: 'Game outcomes, tournaments, player performance',
      cap: 'Cap: 20 HBAR - 2,000 HBAR'
    },
    {
      id: 'politics',
      name: 'Politics',
      icon: '/images/pol.png',
      description: 'Local, States, Federal - Predict changes in the political landscape',
      cap: 'Cap: 20 HBAR - 2,000 HBAR'
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      icon: '/images/opera.png',
      description: 'Award, releases, box office, Celebrity events',
      cap: 'Cap: 10 HBAR - 300 HBAR'
    },
    {
      id: 'weather',
      name: 'Weather',
      icon: '/images/weath.png',
      description: 'Local forecasts climate events, natural phenomenal',
      cap: 'Cap: 20 HBAR - 200 HBAR'
    },
    {
      id: 'other',
      name: 'Other',
      icon: '/images/idea.png',
      description: 'See the world shift before the headlines do',
      cap: 'Cap: 200 HBAR - 900 HBAR'
    },
    {
      id: 'crypto',
      name: 'Crypto',
      icon: '/images/crypto.png',
      description: 'Token prices, DeFi events, blockchain developments',
      cap: 'Cap: 20 HBAR - 1,000 HBAR'
    }
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleNext = () => {
    if (currentStep === 2) {
      // Validate that both inputs are filled before proceeding
      if (questionValue.trim() && descriptionValue.trim()) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      // Validate that deadline is set before proceeding
      if (deadlineValue.trim()) {
        setCurrentStep(4);
      }
    } else if (currentStep === 4) {
      // Handle final step - create market
      console.log('Creating market...');
    }
    // Add more steps as needed
  };

  const handleBack = () => {
    if (currentStep > 2) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/Create'); // Go back to category selection page
    }
  };

  const handleSubmit = () => {
    // Basic validation for liquidity before submit
    if (!initialLiquidity.trim() || Number(initialLiquidity) <= 0) return;
    // TODO: hook up real create API/contract call here
    router.push('/');
  };

  const renderStep1 = () => (
    <div 
      className="grid grid-cols-2 gap-9"
      style={{
        width: '1142px',
        height: '673px',
        boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.25)',
        opacity: 1
      }}
    >
      {categories.map((category) => (
        <div 
          key={category.id}
          className="rounded-lg flex flex-col p-6 cursor-pointer transition-all duration-300 hover:scale-105"
          style={{
            width: '504px',
            height: '194.33px',
            background: selectedCategory === category.id ? '#2F2F2F' : '#2F2F2F80',
            border: selectedCategory === category.id ? '2px solid #00FF73' : '2px solid #00FF73',
            boxShadow: selectedCategory === category.id 
              ? '4px 4px 30px 0px #00FF99, 4px 4px 120px 0px rgba(0,0,0,0.25)' 
              : '4px 4px 30px 0px #00FF99, 4px 4px 120px 0px rgba(0,0,0,0.25)',
            opacity: 1
          }}
          onClick={() => handleCategorySelect(category.id)}
        >
          <div 
            className="flex items-center"
            style={{
              width: '152px',
              height: '50px',
              top: '23px',
              left: '13px',
              padding: '10px',
              gap: '10px',
              position: 'absolute'
            }}
          >
            <Image 
              src={category.icon} 
              alt={category.name} 
              width={40} 
              height={40}
              className="rounded"
            />
            <span 
              className="text-white"
              style={{
                fontFamily: 'Orbitron',
                fontWeight: 700,
                fontSize: '20px',
                lineHeight: '100%',
                letterSpacing: '0%'
              }}
            >
              {category.name}
            </span>
          </div>
          
          <div 
            className="text-left"
            style={{
              width: '448px',
              height: '60px',
              top: '70px',
              left: '13px',
              padding: '10px',
              gap: '10px',
              position: 'absolute'
            }}
          >
            <p 
              className="text-white"
              style={{
                fontFamily: 'Orbitron',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '100%',
                letterSpacing: '0%'
              }}
            >
              {category.description}
            </p>
          </div>
          
          <div 
            className="text-left"
            style={{
              width: '448px',
              height: '40px',
              top: '120px',
              left: '13px',
              padding: '10px',
              gap: '10px',
              position: 'absolute'
            }}
          >
            <p 
              className="text-white"
              style={{
                fontFamily: 'Orbitron',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '100%',
                letterSpacing: '0%'
              }}
            >
              {category.cap}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const [questionValue, setQuestionValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [deadlineValue, setDeadlineValue] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const [initialLiquidity, setInitialLiquidity] = useState('');

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionValue(e.target.value);
    setShowExamples(e.target.value.length > 0);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescriptionValue(e.target.value);
  };

  const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeadlineValue(e.target.value);
  };

  const handleLiquidityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInitialLiquidity(e.target.value);
  };

  const renderStep2 = () => {

    return (
      <>
        {/* Question Input */}
        <div 
          className="absolute"
          style={{
            width: '761px',
            height: '200px',
            top: '220px',
            left: '272px',
            padding: '8px',
            gap: '8px',
            opacity: 1
          }}
        >
          <label 
            className="block text-white font-orbitron"
            style={{
              fontFamily: 'Orbitron',
              fontWeight: 500,
              fontSize: '24px',
              lineHeight: '100%',
              letterSpacing: '0%',
              marginBottom: '20px'
            }}
          >
            Question*
          </label>
          <input
            type="text"
            value={questionValue}
            onChange={handleQuestionChange}
            className="w-full bg-[#1a1a1a] rounded font-orbitron"
            placeholder="Enter your prediction market question..."
            style={{
              fontFamily: 'Orbitron',
              fontSize: '16px',
              padding: '12px',
              height: '120px',
              border: '2px solid #00FF73',
              boxShadow: '0 0 18px #00FF99, 0 0 35px rgba(0, 255, 153, 0.4)',
              color: '#FFFFFF'
            }}
          />
        </div>

        {/* Example Questions (shows when typing) */}
        {showExamples && (
          <div 
            className="absolute bg-[#1a1a1a] rounded font-orbitron"
            style={{
              width: '761px',
              height: '175px',
              top: '445px',
              left: '272px',
              padding: '8px',
              gap: '8px',
              opacity: 1,
              fontFamily: 'Orbitron'
            }}
          >
            <p className="text-white font-orbitron text-sm mb-2" style={{ fontFamily: 'Orbitron' }}>Example questions:</p>
            <div className="space-y-2">
              <p className="text-[#CCCCCC] font-orbitron text-xs cursor-pointer hover:text-white" style={{ fontFamily: 'Orbitron' }}>
                • Will Bitcoin reach $100,000 by end of 2025?
              </p>
              <p className="text-[#CCCCCC] font-orbitron text-xs cursor-pointer hover:text-white" style={{ fontFamily: 'Orbitron' }}>
                • Will Team A win the championship this season?
              </p>
              <p className="text-[#CCCCCC] font-orbitron text-xs cursor-pointer hover:text-white" style={{ fontFamily: 'Orbitron' }}>
                • Will there be a recession in Q1 2025?
              </p>
            </div>
          </div>
        )}

        {/* Description Input */}
        <div 
          className="absolute"
          style={{
            width: '761px',
            height: '200px',
            top: showExamples ? '645px' : '445px',
            left: '272px',
            padding: '8px',
            gap: '8px',
            opacity: 1,
            transition: 'top 0.3s ease'
          }}
        >
          <label 
            className="block text-white font-orbitron"
            style={{
              fontFamily: 'Orbitron',
              fontWeight: 500,
              fontSize: '24px',
              lineHeight: '100%',
              letterSpacing: '0%',
              marginBottom: '20px'
            }}
          >
            Description*
          </label>
          <textarea
            value={descriptionValue}
            onChange={handleDescriptionChange}
            className="w-full bg-[#1a1a1a] rounded font-orbitron resize-none"
            placeholder="Provide detailed description of the market..."
            style={{
              fontFamily: 'Orbitron',
              fontSize: '16px',
              padding: '12px',
              height: '120px',
              border: '2px solid #00FF73',
              boxShadow: '0 0 18px #00FF99, 0 0 35px rgba(0, 255, 153, 0.4)',
              color: '#FFFFFF'
            }}
          />
        </div>
      </>
    );
  };

  const renderStep3 = () => (
    <div 
          className="absolute"
          style={{
            width: '761px',
            height: '200px',
            top: '220px',
            left: '272px',
            padding: '8px',
            gap: '8px',
            opacity: 1
          }}
        >
           <label 
             className="block text-white font-orbitron"
             style={{
               fontFamily: 'Orbitron',
               fontWeight: 500,
               fontSize: '24px',
               lineHeight: '100%',
               letterSpacing: '0%',
               marginBottom: '20px'
             }}
           >
             Set Resolution Deadline
           </label>
           <div className="relative w-full">
             {!deadlineValue && (
               <div 
                 className="absolute pointer-events-none"
                 style={{
                   top: '50%',
                   left: '12px',
                   transform: 'translateY(-50%)',
                   color: '#CCCCCC',
                   fontFamily: 'Orbitron',
                   fontSize: '16px',
                   zIndex: 1
                 }}
               >
                 Select resolution Date and Time...
               </div>
             )}
             <input
               type="datetime-local"
               value={deadlineValue}
               onChange={handleDeadlineChange}
               className="w-full bg-[#1a1a1a] rounded font-orbitron datetime-input"
               step="60"
               style={{
                 fontFamily: 'Orbitron',
                 fontSize: '16px',
                 padding: '12px',
                 height: '120px',
                 border: '2px solid #00FF73',
                 boxShadow: '0 0 18px #00FF99, 0 0 35px rgba(0, 255, 153, 0.4)',
                 color: deadlineValue ? '#FFFFFF' : 'transparent',
                 colorScheme: 'dark',
                 position: 'relative'
               }}
             />
             <style jsx>{`
               .datetime-input::-webkit-calendar-picker-indicator {
                 filter: brightness(0) invert(1);
                 cursor: pointer;
                 font-size: 28px;
                 width: 35px;
                 height: 35px;
                 position: absolute;
                 right: 12px;
                 opacity: 1;
               }
               .datetime-input::-webkit-datetime-edit {
                 color: ${deadlineValue ? '#FFFFFF' : 'transparent'};
               }
               .datetime-input::-webkit-datetime-edit-fields-wrapper {
                 color: ${deadlineValue ? '#FFFFFF' : 'transparent'};
               }
               .datetime-input::-webkit-datetime-edit-text {
                 color: ${deadlineValue ? '#FFFFFF' : 'transparent'};
               }
             `}</style>
           </div>
        </div>
  );

  const renderStep4 = () => {
    return (
      <div
        className="absolute"
        style={{
          width: '761px',
          height: '320px',
          top: '320px',
          left: '272px',
          padding: '8px',
          gap: '8px',
          opacity: 1
        }}
      >
        {/* Initial Liquidity */}
        <label 
          className="block text-white font-orbitron"
          style={{
            fontFamily: 'Orbitron',
            fontWeight: 500,
            fontSize: '24px',
            lineHeight: '100%',
            letterSpacing: '0%',
            marginBottom: '20px'
          }}
        >
          Initial Liquidity (HBAR)*
        </label>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          value={initialLiquidity}
          onChange={handleLiquidityChange}
          className="w-full bg-[#1a1a1a] rounded font-orbitron"
          placeholder="Enter amount in HBAR"
          style={{
            fontFamily: 'Orbitron',
            fontSize: '16px',
            padding: '12px',
            height: '120px',
            border: '2px solid #00FF73',
            boxShadow: '0 0 18px #00FF99, 0 0 35px rgba(0, 255, 153, 0.4)',
            color: '#FFFFFF'
          }}
        />
      </div>
    );
  };

  const selected = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Head>
        <title>Truce - Create Form</title>
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
            height: currentStep === 2 ? '940px' : '700px',
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
            <h1 className="font-orbitron font-semibold text-[32px] text-white">Forge a Prediction</h1>
          </div>
          {currentStep === 4 && selected && (
            <div 
              className="absolute flex items-center"
              style={{
                width: '448px',
                height: '107px',
                top: '186px',
                left: '289px',
                gap: '6px',
                opacity: 1
              }}
            >
              <Image src={selected.icon} alt={selected.name} width={40} height={40} className="rounded" />
              <span
                className="text-white"
                style={{
                  fontFamily: 'Orbitron',
                  fontWeight: 700,
                  fontSize: '20px',
                  lineHeight: '100%',
                  letterSpacing: '0%'
                }}
              >
                {selected.name}
              </span>
            </div>
          )}
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
            <p className="font-orbitron font-normal text-[16px] text-[#CCCCCC]">Design a new quest for the community to embark upon</p>
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
            <span className="font-orbitron font-bold text-[14px] text-white">{currentStep}</span>
          </div>

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          <div 
            className="absolute flex justify-between items-center"
            style={{
              width: '1111px',
              height: '56px',
              top: currentStep === 2 ? '864px' : '620px',
              left: '101px',
              padding: '8px',
              opacity: 1
            }}
          >
            <button 
              onClick={handleBack}
              className="flex items-center justify-center gap-2"
              style={{
                width: '115px',
                height: '40px',
                padding: '10px',
                gap: '10px',
                borderRadius: '8px',
                background: currentStep === 1 ? '#D9D9D980' : '#D9D9D980',
                opacity: 1
              }}
              disabled={currentStep === 1}
            >
              <span className="text-black font-orbitron text-[14px]">‹ Back</span>
            </button>
            
            <button 
              onClick={currentStep === 4 ? handleSubmit : handleNext}
              className="flex items-center justify-center gap-2 transition-all duration-300"
              style={{
                width: '159px',
                height: '40px',
                padding: '10px',
                gap: '10px',
                borderRadius: '8px',
                border: '2px solid #FFFFFF',
                background: 'transparent',
                opacity: (currentStep === 2 && (!questionValue.trim() || !descriptionValue.trim())) || (currentStep === 3 && !deadlineValue.trim()) || (currentStep === 4 && (!initialLiquidity.trim() || Number(initialLiquidity) <= 0)) ? 0.5 : 1,
                cursor: (currentStep === 2 && (!questionValue.trim() || !descriptionValue.trim())) || (currentStep === 3 && !deadlineValue.trim()) || (currentStep === 4 && (!initialLiquidity.trim() || Number(initialLiquidity) <= 0)) ? 'not-allowed' : 'pointer'
              }}
              disabled={(currentStep === 2 && (!questionValue.trim() || !descriptionValue.trim())) || (currentStep === 3 && !deadlineValue.trim()) || (currentStep === 4 && (!initialLiquidity.trim() || Number(initialLiquidity) <= 0))}
            >
              <span 
                className="font-orbitron text-[14px]"
                style={{
                  color: (currentStep === 2 && (!questionValue.trim() || !descriptionValue.trim())) || (currentStep === 3 && !deadlineValue.trim()) || (currentStep === 4 && (!initialLiquidity.trim() || Number(initialLiquidity) <= 0)) ? '#666666' : '#FFFFFF'
                }}
              >
                {currentStep === 4 ? 'Create Market' : 'Next ›'}
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateForm;
