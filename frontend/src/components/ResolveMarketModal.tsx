import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Outcome, MarketState } from '../config/contracts';
import { useResolveMarket } from '../hooks/useTruceMarket';
import { type Address } from 'viem';

interface MarketData {
  address: Address;
  question: string;
  category: string;
  categoryIcon: string;
  resolutionDeadline: number;
  state: MarketState;
  createdAt: number;
}

interface ResolveMarketModalProps {
  isOpen: boolean;
  onClose: () => void;
  market: MarketData;
  userAddress?: Address;
}

const ResolveMarketModal: React.FC<ResolveMarketModalProps> = ({
  isOpen,
  onClose,
  market,
  userAddress,
}) => {
  const [selectedOutcome, setSelectedOutcome] = useState<Outcome | null>(null);
  const { resolveMarket, isPending, isConfirming, isSuccess, error } = useResolveMarket(market.address);

  // Check if market can be resolved
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const canResolve = market.state === MarketState.Active && 
                     currentTimestamp >= market.resolutionDeadline;
  const deadlineDate = new Date(market.resolutionDeadline * 1000);
  const timeUntilDeadline = market.resolutionDeadline - currentTimestamp;
  
  // Debug logging
  console.log('Resolve Modal Debug:', {
    marketState: market.state,
    expectedActiveState: MarketState.Active,
    isActive: market.state === MarketState.Active,
    currentTimestamp,
    resolutionDeadline: market.resolutionDeadline,
    deadlinePassed: currentTimestamp >= market.resolutionDeadline,
    canResolve,
    timeUntilDeadline,
  });
  
  // Format deadline date
  const formatDeadline = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };
  
  // Calculate time remaining
  const getTimeRemaining = (seconds: number) => {
    if (seconds <= 0) return 'Deadline passed';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  };
  
  // Get market state name
  const getStateName = (state: MarketState): string => {
    switch (state) {
      case MarketState.Active:
        return 'Active';
      case MarketState.PendingDispute:
        return 'Pending Dispute (24hr wait)';
      case MarketState.Disputed:
        return 'Disputed (Factory reviewing)';
      case MarketState.Resolved:
        return 'Resolved (Finalized)';
      case MarketState.Cancelled:
        return 'Cancelled';
      default:
        return `Unknown (${state})`;
    }
  };

  // Debug market state
  useEffect(() => {
    if (isOpen) {
      console.log('🔍 Resolve Modal Debug:', {
        marketState: market.state,
        marketStateType: typeof market.state,
        isActive: market.state === MarketState.Active,
        stateName: getStateName(market.state),
        allStates: {
          Active: MarketState.Active,
          PendingDispute: MarketState.PendingDispute,
          Disputed: MarketState.Disputed,
          Resolved: MarketState.Resolved,
          Cancelled: MarketState.Cancelled,
        }
      });
    }
  }, [isOpen, market.state]);

  // Reset selection when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedOutcome(null);
    }
  }, [isOpen]);

  // Close modal on success
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [isSuccess, onClose]);

  const handleResolve = async () => {
    if (!selectedOutcome === null || !canResolve) return;
    
    try {
      await resolveMarket(selectedOutcome as Outcome);
    } catch (err) {
      console.error('Error resolving market:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
            border: '2px solid #2A2A2A',
            borderRadius: '12px',
            width: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 0 50px rgba(0, 255, 153, 0.2)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '24px 32px',
              borderBottom: '1px solid #2A2A2A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '8px',
                  background: 'rgba(0, 255, 153, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(0, 255, 153, 0.2)',
                }}
              >
                <Image
                  src={market.categoryIcon}
                  alt={market.category}
                  width={32}
                  height={32}
                  style={{ opacity: 0.9 }}
                />
              </div>
              <div>
                <h2
                  className="font-orbitron"
                  style={{
                    fontFamily: 'Orbitron',
                    fontWeight: 700,
                    fontSize: '20px',
                    color: '#FFFFFF',
                    margin: 0,
                  }}
                >
                  Resolve Market
                </h2>
                <p
                  className="font-orbitron"
                  style={{
                    fontFamily: 'Orbitron',
                    fontWeight: 400,
                    fontSize: '12px',
                    color: '#888888',
                    margin: '4px 0 0 0',
                  }}
                >
                  {market.category.toUpperCase()}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#888888',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '0',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#888888')}
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '32px' }}>
            {/* Market Question */}
            <div style={{ marginBottom: '32px' }}>
              <label
                className="font-orbitron"
                style={{
                  fontFamily: 'Orbitron',
                  fontWeight: 600,
                  fontSize: '12px',
                  color: '#CCCCCC',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                Market Question
              </label>
              <p
                className="font-orbitron"
                style={{
                  fontFamily: 'Orbitron',
                  fontWeight: 600,
                  fontSize: '16px',
                  color: '#FFFFFF',
                  lineHeight: '140%',
                  margin: 0,
                }}
              >
                {market.question}
              </p>
            </div>

            {/* Deadline Information */}
            <div
              style={{
                padding: '16px',
                background: canResolve 
                  ? 'rgba(0, 255, 153, 0.1)' 
                  : 'rgba(255, 165, 0, 0.1)',
                border: canResolve 
                  ? '1px solid rgba(0, 255, 153, 0.3)' 
                  : '1px solid rgba(255, 165, 0, 0.3)',
                borderRadius: '8px',
                marginBottom: '24px',
              }}
            >
              <div style={{ marginBottom: '12px' }}>
                <p
                  className="font-orbitron"
                  style={{
                    fontFamily: 'Orbitron',
                    fontWeight: 600,
                    fontSize: '11px',
                    color: '#888888',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    margin: '0 0 6px 0',
                  }}
                >
                  Resolution Deadline
                </p>
                <p
                  className="font-orbitron"
                  style={{
                    fontFamily: 'Orbitron',
                    fontWeight: 700,
                    fontSize: '15px',
                    color: '#FFFFFF',
                    margin: 0,
                  }}
                >
                  📅 {formatDeadline(market.resolutionDeadline)}
                </p>
              </div>
              
              <div
                style={{
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {canResolve ? (
                  <>
                    <p
                      className="font-orbitron"
                      style={{
                        fontFamily: 'Orbitron',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#00FF99',
                        margin: '0 0 6px 0',
                      }}
                    >
                      ✓ Market is ready to resolve
                    </p>
                    <p
                      className="font-orbitron"
                      style={{
                        fontFamily: 'Orbitron',
                        fontWeight: 400,
                        fontSize: '12px',
                        color: '#CCCCCC',
                        margin: 0,
                      }}
                    >
                      The deadline has passed. You can now resolve this market.
                    </p>
                  </>
                ) : market.state !== MarketState.Active ? (
                  <>
                    <p
                      className="font-orbitron"
                      style={{
                        fontFamily: 'Orbitron',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#FF3366',
                        margin: '0 0 6px 0',
                      }}
                    >
                      ⚠️ Cannot resolve this market
                    </p>
                    <p
                      className="font-orbitron"
                      style={{
                        fontFamily: 'Orbitron',
                        fontWeight: 400,
                        fontSize: '12px',
                        color: '#CCCCCC',
                        margin: 0,
                      }}
                    >
                      Current state: <span style={{ color: '#FFFFFF', fontWeight: 600 }}>
                        {getStateName(market.state)}
                      </span>
                      <br />
                      Only active markets with passed deadlines can be resolved.
                    </p>
                  </>
                ) : (
                  <>
                    <p
                      className="font-orbitron"
                      style={{
                        fontFamily: 'Orbitron',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#FFA500',
                        margin: '0 0 6px 0',
                      }}
                    >
                      ⏳ Waiting for deadline
                    </p>
                    <p
                      className="font-orbitron"
                      style={{
                        fontFamily: 'Orbitron',
                        fontWeight: 400,
                        fontSize: '12px',
                        color: '#CCCCCC',
                        margin: 0,
                      }}
                    >
                      Time remaining: <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{getTimeRemaining(timeUntilDeadline)}</span>
                      <br />
                      You can resolve this market after the deadline passes.
                    </p>
                  </>
                )}
              </div>
            </div>


            {/* Success Message */}
            {isSuccess && (
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(0, 255, 153, 0.1)',
                  border: '1px solid rgba(0, 255, 153, 0.3)',
                  borderRadius: '8px',
                  marginBottom: '24px',
                }}
              >
                <p
                  className="font-orbitron"
                  style={{
                    fontFamily: 'Orbitron',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#00FF99',
                    margin: 0,
                  }}
                >
                  ✓ Market resolved successfully!
                </p>
                <p
                  className="font-orbitron"
                  style={{
                    fontFamily: 'Orbitron',
                    fontWeight: 400,
                    fontSize: '12px',
                    color: '#CCCCCC',
                    margin: '8px 0 0 0',
                  }}
                >
                  The market is now in dispute period (24 hours)
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(255, 51, 102, 0.1)',
                  border: '1px solid rgba(255, 51, 102, 0.3)',
                  borderRadius: '8px',
                  marginBottom: '24px',
                }}
              >
                <p
                  className="font-orbitron"
                  style={{
                    fontFamily: 'Orbitron',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#FF3366',
                    margin: 0,
                  }}
                >
                  ✗ Error resolving market
                </p>
                <p
                  className="font-orbitron"
                  style={{
                    fontFamily: 'Orbitron',
                    fontWeight: 400,
                    fontSize: '12px',
                    color: '#CCCCCC',
                    margin: '8px 0 0 0',
                  }}
                >
                  {error.message || 'Transaction failed'}
                </p>
              </div>
            )}

            {/* Outcome Selection */}
            {canResolve && !isSuccess && (
              <>
                <label
                  className="font-orbitron"
                  style={{
                    fontFamily: 'Orbitron',
                    fontWeight: 600,
                    fontSize: '12px',
                    color: '#CCCCCC',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'block',
                    marginBottom: '16px',
                  }}
                >
                  Select Outcome
                </label>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                  {/* YES Button */}
                  <button
                    onClick={() => setSelectedOutcome(Outcome.Yes)}
                    disabled={isPending || isConfirming}
                    style={{
                      flex: 1,
                      padding: '20px',
                      background:
                        selectedOutcome === Outcome.Yes
                          ? 'rgba(0, 255, 153, 0.15)'
                          : 'rgba(0, 255, 153, 0.05)',
                      border:
                        selectedOutcome === Outcome.Yes
                          ? '2px solid #00FF99'
                          : '2px solid rgba(0, 255, 153, 0.3)',
                      borderRadius: '8px',
                      cursor: isPending || isConfirming ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      opacity: isPending || isConfirming ? 0.5 : 1,
                    }}
                  >
                    <div
                      className="font-orbitron"
                      style={{
                        fontFamily: 'Orbitron',
                        fontWeight: 700,
                        fontSize: '24px',
                        color: '#00FF99',
                        marginBottom: '8px',
                      }}
                    >
                      YES
                    </div>
                    <div
                      className="font-orbitron"
                      style={{
                        fontFamily: 'Orbitron',
                        fontWeight: 400,
                        fontSize: '12px',
                        color: '#888888',
                      }}
                    >
                      Outcome: True
                    </div>
                  </button>

                  {/* NO Button */}
                  <button
                    onClick={() => setSelectedOutcome(Outcome.No)}
                    disabled={isPending || isConfirming}
                    style={{
                      flex: 1,
                      padding: '20px',
                      background:
                        selectedOutcome === Outcome.No
                          ? 'rgba(255, 51, 102, 0.15)'
                          : 'rgba(255, 51, 102, 0.05)',
                      border:
                        selectedOutcome === Outcome.No
                          ? '2px solid #FF3366'
                          : '2px solid rgba(255, 51, 102, 0.3)',
                      borderRadius: '8px',
                      cursor: isPending || isConfirming ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      opacity: isPending || isConfirming ? 0.5 : 1,
                    }}
                  >
                    <div
                      className="font-orbitron"
                      style={{
                        fontFamily: 'Orbitron',
                        fontWeight: 700,
                        fontSize: '24px',
                        color: '#FF3366',
                        marginBottom: '8px',
                      }}
                    >
                      NO
                    </div>
                    <div
                      className="font-orbitron"
                      style={{
                        fontFamily: 'Orbitron',
                        fontWeight: 400,
                        fontSize: '12px',
                        color: '#888888',
                      }}
                    >
                      Outcome: False
                    </div>
                  </button>
                </div>

                {/* Info Box */}
                <div
                  style={{
                    padding: '16px',
                    background: 'rgba(0, 170, 255, 0.08)',
                    border: '1px solid rgba(0, 170, 255, 0.2)',
                    borderRadius: '8px',
                    marginBottom: '24px',
                  }}
                >
                  <p
                    className="font-orbitron"
                    style={{
                      fontFamily: 'Orbitron',
                      fontWeight: 600,
                      fontSize: '13px',
                      color: '#00AAFF',
                      margin: '0 0 8px 0',
                    }}
                  >
                    ℹ️ What happens next?
                  </p>
                  <ul
                    className="font-orbitron"
                    style={{
                      fontFamily: 'Orbitron',
                      fontWeight: 400,
                      fontSize: '12px',
                      color: '#CCCCCC',
                      margin: 0,
                      paddingLeft: '20px',
                    }}
                  >
                    <li style={{ marginBottom: '4px' }}>
                      Market enters 24-hour dispute period
                    </li>
                    <li style={{ marginBottom: '4px' }}>
                      Users on losing side can submit disputes
                    </li>
                    <li>After dispute period, market finalizes and winners can claim</li>
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '24px 32px',
              borderTop: '1px solid #2A2A2A',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
            }}
          >
            <button
              onClick={onClose}
              disabled={isPending || isConfirming}
              className="font-orbitron"
              style={{
                fontFamily: 'Orbitron',
                fontWeight: 600,
                fontSize: '14px',
                padding: '12px 24px',
                background: 'transparent',
                border: '1px solid #444444',
                borderRadius: '6px',
                color: '#CCCCCC',
                cursor: isPending || isConfirming ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: isPending || isConfirming ? 0.5 : 1,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleResolve}
              disabled={selectedOutcome === null || !canResolve || isPending || isConfirming || isSuccess}
              className="font-orbitron"
              style={{
                fontFamily: 'Orbitron',
                fontWeight: 700,
                fontSize: '14px',
                padding: '12px 32px',
                background:
                  selectedOutcome === null || !canResolve || isPending || isConfirming || isSuccess
                    ? 'rgba(0, 255, 153, 0.2)'
                    : '#00FF99',
                border: 'none',
                borderRadius: '6px',
                color: '#000000',
                cursor:
                  selectedOutcome === null || !canResolve || isPending || isConfirming || isSuccess
                    ? 'not-allowed'
                    : 'pointer',
                transition: 'all 0.2s',
                opacity:
                  selectedOutcome === null || !canResolve || isPending || isConfirming || isSuccess
                    ? 0.5
                    : 1,
              }}
            >
              {isPending || isConfirming ? 'Resolving...' : 'Resolve Market'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResolveMarketModal;

