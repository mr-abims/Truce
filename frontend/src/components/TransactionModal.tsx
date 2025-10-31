import React from 'react';
import { useRouter } from 'next/router';

interface TransactionModalProps {
  isOpen: boolean;
  status: 'pending' | 'confirming' | 'success' | 'error';
  errorMessage?: string;
  txHash?: string;
  onClose?: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  status,
  errorMessage,
  txHash,
  onClose,
}) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleClose = () => {
    if (status === 'success') {
      router.push('/Markets');
    } else if (onClose) {
      onClose();
    }
  };

  // Format error messages to be user-friendly
  const formatErrorMessage = (error?: string): string => {
    if (!error) return 'An unexpected error occurred. Please try again.';

    const errorLower = error.toLowerCase();

    // User rejected/cancelled transaction
    if (errorLower.includes('user rejected') || 
        errorLower.includes('user denied') || 
        errorLower.includes('user cancelled') ||
        errorLower.includes('rejected the request')) {
      return 'You cancelled the transaction in your wallet.';
    }

    // Insufficient funds
    if (errorLower.includes('insufficient funds') || 
        errorLower.includes('insufficient balance')) {
      return 'Insufficient funds in your wallet to complete this transaction.';
    }

    // Gas estimation failed
    if (errorLower.includes('gas required exceeds') || 
        errorLower.includes('gas estimation failed') ||
        errorLower.includes('cannot estimate gas')) {
      return 'Transaction would fail. Please check your inputs and wallet balance.';
    }

    // Network errors
    if (errorLower.includes('network') || 
        errorLower.includes('connection') ||
        errorLower.includes('timeout')) {
      return 'Network connection error. Please check your internet and try again.';
    }

    // Contract revert errors
    if (errorLower.includes('execution reverted')) {
      // Try to extract the revert reason
      const reasonMatch = error.match(/execution reverted:?\s*([^"'\n]+)/i);
      if (reasonMatch && reasonMatch[1]) {
        return `Transaction failed: ${reasonMatch[1].trim()}`;
      }
      return 'Transaction was rejected by the smart contract. Please check your inputs.';
    }

    // Nonce errors
    if (errorLower.includes('nonce') || errorLower.includes('replacement transaction')) {
      return 'Transaction conflict detected. Please try again.';
    }

    // Chain/Network mismatch
    if (errorLower.includes('chain') || errorLower.includes('wrong network')) {
      return 'Please switch to the correct network in your wallet.';
    }

    // Generic deadline/slippage errors
    if (errorLower.includes('deadline') || errorLower.includes('expired')) {
      return 'Transaction deadline exceeded. Please try again.';
    }

    // If error is too long, truncate it
    if (error.length > 150) {
      return error.substring(0, 147) + '...';
    }

    // Return cleaned error (remove technical prefixes)
    return error
      .replace(/^Error:\s*/i, '')
      .replace(/^TransactionExecutionError:\s*/i, '')
      .replace(/^ContractFunctionExecutionError:\s*/i, '')
      .trim();
  };

  const getStatusContent = () => {
    switch (status) {
      case 'pending':
        return {
          title: 'Confirm Transaction',
          message: 'Please confirm the transaction in your wallet',
          icon: (
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-t-[#00FF73] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
              <div className="absolute inset-2 border-4 border-t-transparent border-r-[#00FF99] border-b-transparent border-l-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-10 h-10 text-[#00FF73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          ),
          showClose: true,
        };
      case 'confirming':
        return {
          title: 'Transaction Pending',
          message: 'Your market is being created on the blockchain',
          icon: (
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-t-[#00FF73] border-r-[#00FF99] border-b-transparent border-l-transparent rounded-full animate-spin" />
              <div className="absolute inset-2 border-4 border-t-transparent border-r-transparent border-b-[#00FF73] border-l-[#00FF99] rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.75s' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-10 h-10 text-[#00FF73] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          ),
          showClose: false,
        };
      case 'success':
        return {
          title: 'Market Created!',
          message: 'Your prediction market has been successfully created',
          icon: (
            <div className="relative w-20 h-20">
              <div 
                className="absolute inset-0 rounded-full bg-[#00FF73] opacity-20 animate-ping"
                style={{ animationDuration: '1s', animationIterationCount: '2' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-20 h-20 text-[#00FF73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          ),
          showClose: true,
        };
      case 'error':
        return {
          title: 'Transaction Failed',
          message: formatErrorMessage(errorMessage),
          icon: (
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-20 h-20 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          ),
          showClose: true,
        };
    }
  };

  const content = getStatusContent();

  return (
    <div 
      className="fixed z-[9999]"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(12px)',
      }}
      onClick={content.showClose ? handleClose : undefined}
    >
      {/* Enhanced background glow effects */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {/* Animated glow orbs */}
        <div
          className="absolute animate-pulse"
          style={{
            width: '600px',
            height: '600px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: status === 'error'
              ? 'radial-gradient(circle, rgba(255, 0, 0, 0.15) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(0, 255, 115, 0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animationDuration: '3s',
          }}
        />
        <div
          className="absolute animate-pulse"
          style={{
            width: '400px',
            height: '400px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: status === 'error'
              ? 'radial-gradient(circle, rgba(255, 0, 0, 0.2) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(0, 255, 153, 0.2) 0%, transparent 70%)',
            filter: 'blur(30px)',
            animationDuration: '2s',
            animationDelay: '0.5s',
          }}
        />
      </div>

      <div
        className="relative rounded-2xl"
        style={{
          width: '550px',
          maxWidth: '90vw',
          margin: '20px',
          background: 'linear-gradient(135deg, #1f1f1f 0%, #0f0f0f 50%, #050505 100%)',
          border: `3px solid ${status === 'error' ? '#FF0000' : '#00FF73'}`,
          boxShadow: status === 'error' 
            ? '0 0 40px rgba(255, 0, 0, 0.6), 0 0 80px rgba(255, 0, 0, 0.4), 0 0 120px rgba(255, 0, 0, 0.3), inset 0 0 30px rgba(255, 0, 0, 0.1), inset 0 0 60px rgba(255, 0, 0, 0.05)'
            : '0 0 40px rgba(0, 255, 115, 0.6), 0 0 80px rgba(0, 255, 153, 0.4), 0 0 120px rgba(0, 255, 115, 0.3), inset 0 0 30px rgba(0, 255, 115, 0.1), inset 0 0 60px rgba(0, 255, 153, 0.05)',
          animation: 'fadeIn 0.3s ease-out, pulse-glow 2s ease-in-out infinite',
          zIndex: 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.9) translateY(20px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          @keyframes pulse-glow {
            0%, 100% {
              filter: brightness(1);
            }
            50% {
              filter: brightness(1.1);
            }
          }
          @keyframes scan {
            0% {
              transform: translateY(-100%);
            }
            100% {
              transform: translateY(100%);
            }
          }
        `}</style>
        {/* Close button */}
        {content.showClose && (
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-white transition-all duration-300 hover:rotate-90"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Content */}
        <div className="flex flex-col items-center p-10">
          {/* Icon */}
          <div className="mb-6">
            {content.icon}
          </div>

          {/* Title */}
          <h2
            className="text-white text-center mb-4"
            style={{
              fontFamily: 'Orbitron',
              fontSize: '32px',
              fontWeight: 700,
              textShadow: status === 'error' 
                ? '0 0 20px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.5), 0 0 60px rgba(255, 0, 0, 0.3)'
                : '0 0 20px rgba(0, 255, 115, 0.8), 0 0 40px rgba(0, 255, 153, 0.5), 0 0 60px rgba(0, 255, 115, 0.3)',
              letterSpacing: '1px',
            }}
          >
            {content.title}
          </h2>

          {/* Message */}
          <p
            className="text-center mb-6"
            style={{
              fontFamily: 'Orbitron',
              fontSize: status === 'error' ? '15px' : '16px',
              color: status === 'error' ? '#FFAAAA' : '#CCCCCC',
              maxWidth: '420px',
              lineHeight: '1.6',
              padding: status === 'error' ? '12px 20px' : '0',
              background: status === 'error' ? 'rgba(255, 0, 0, 0.05)' : 'transparent',
              borderRadius: status === 'error' ? '8px' : '0',
              border: status === 'error' ? '1px solid rgba(255, 0, 0, 0.2)' : 'none',
            }}
          >
            {content.message}
          </p>

          {/* Transaction hash link (only show for confirming and success) */}
          {txHash && (status === 'confirming' || status === 'success') && (
            <div className="mb-6">
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-[#00FF73] hover:text-[#00FF99] transition-all duration-300 hover:scale-105"
                style={{
                  fontFamily: 'Orbitron',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: '2px solid rgba(0, 255, 115, 0.3)',
                  background: 'rgba(0, 255, 115, 0.05)',
                  boxShadow: '0 0 10px rgba(0, 255, 115, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 115, 0.4), 0 0 40px rgba(0, 255, 153, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(0, 255, 115, 0.6)';
                  e.currentTarget.style.background = 'rgba(0, 255, 115, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 115, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(0, 255, 115, 0.3)';
                  e.currentTarget.style.background = 'rgba(0, 255, 115, 0.05)';
                }}
              >
                <span>View on Explorer</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}

          {/* Action button (only for success and error) */}
          {(status === 'success' || status === 'error') && (
            <button
              onClick={handleClose}
              className="transition-all duration-300 hover:scale-105"
              style={{
                width: '220px',
                height: '52px',
                borderRadius: '12px',
                border: `3px solid ${status === 'error' ? '#FF0000' : '#00FF73'}`,
                background: status === 'error' 
                  ? 'linear-gradient(135deg, rgba(255, 0, 0, 0.1), rgba(255, 0, 0, 0.05))'
                  : 'linear-gradient(135deg, rgba(0, 255, 115, 0.1), rgba(0, 255, 153, 0.05))',
                color: status === 'error' ? '#FF0000' : '#00FF73',
                fontFamily: 'Orbitron',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                boxShadow: status === 'error'
                  ? '0 0 15px rgba(255, 0, 0, 0.3)'
                  : '0 0 15px rgba(0, 255, 115, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = status === 'error'
                  ? '0 0 25px rgba(255, 0, 0, 0.6), 0 0 50px rgba(255, 0, 0, 0.4)'
                  : '0 0 25px rgba(0, 255, 115, 0.6), 0 0 50px rgba(0, 255, 153, 0.4)';
                e.currentTarget.style.background = status === 'error'
                  ? 'linear-gradient(135deg, rgba(255, 0, 0, 0.2), rgba(255, 0, 0, 0.1))'
                  : 'linear-gradient(135deg, rgba(0, 255, 115, 0.2), rgba(0, 255, 153, 0.1))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = status === 'error'
                  ? '0 0 15px rgba(255, 0, 0, 0.3)'
                  : '0 0 15px rgba(0, 255, 115, 0.3)';
                e.currentTarget.style.background = status === 'error'
                  ? 'linear-gradient(135deg, rgba(255, 0, 0, 0.1), rgba(255, 0, 0, 0.05))'
                  : 'linear-gradient(135deg, rgba(0, 255, 115, 0.1), rgba(0, 255, 153, 0.05))';
              }}
            >
              {status === 'success' ? 'View Markets' : 'Close'}
            </button>
          )}
        </div>

        {/* Decorative border glow effect */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: status === 'error'
              ? 'radial-gradient(circle at top left, rgba(255, 0, 0, 0.2), transparent 50%), radial-gradient(circle at bottom right, rgba(255, 0, 0, 0.2), transparent 50%), radial-gradient(circle at top right, rgba(255, 0, 0, 0.15), transparent 50%), radial-gradient(circle at bottom left, rgba(255, 0, 0, 0.15), transparent 50%)'
              : 'radial-gradient(circle at top left, rgba(0, 255, 115, 0.2), transparent 50%), radial-gradient(circle at bottom right, rgba(0, 255, 153, 0.2), transparent 50%), radial-gradient(circle at top right, rgba(0, 255, 115, 0.15), transparent 50%), radial-gradient(circle at bottom left, rgba(0, 255, 153, 0.15), transparent 50%)',
          }}
        />

        {/* Animated corner accents */}
        <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none overflow-hidden rounded-tl-2xl">
          <div
            className="absolute -top-10 -left-10 w-20 h-20 animate-pulse"
            style={{
              background: status === 'error'
                ? 'radial-gradient(circle, rgba(255, 0, 0, 0.4), transparent 70%)'
                : 'radial-gradient(circle, rgba(0, 255, 115, 0.4), transparent 70%)',
              animationDuration: '2s',
            }}
          />
        </div>
        <div className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none overflow-hidden rounded-br-2xl">
          <div
            className="absolute -bottom-10 -right-10 w-20 h-20 animate-pulse"
            style={{
              background: status === 'error'
                ? 'radial-gradient(circle, rgba(255, 0, 0, 0.4), transparent 70%)'
                : 'radial-gradient(circle, rgba(0, 255, 153, 0.4), transparent 70%)',
              animationDuration: '2s',
              animationDelay: '1s',
            }}
          />
        </div>

        {/* Scanning line effect for confirming state */}
        {status === 'confirming' && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
            style={{
              background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 255, 115, 0.1) 50%, transparent 100%)',
              animation: 'scan 2s linear infinite',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TransactionModal;

