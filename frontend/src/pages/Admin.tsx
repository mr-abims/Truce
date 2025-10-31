import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { formatEther, type Address } from 'viem';
import Navbar from '../components/Navbar';
import TransactionModal from '../components/TransactionModal';
import { 
  useGetFactoryOwner, 
  useGetPlatformFees, 
  useGetPendingDisputes,
  useGetCreatorReputation,
  useWithdrawFees,
  useResolveDispute 
} from '../hooks/useTruceAdmin';
import { useGetMarketCount } from '../hooks/useTruceFactory';
import { useGetMarketData } from '../hooks/useTruceMarket';

type TabType = 'overview' | 'disputes' | 'creators';

const Admin: NextPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showModal, setShowModal] = useState(false);
  const [creatorAddressInput, setCreatorAddressInput] = useState('');
  
  // Get connected wallet
  const { address, isConnected } = useAccount();
  
  // Get factory data
  const { owner, isLoading: isLoadingOwner } = useGetFactoryOwner();
  const { totalFees, refetch: refetchFees } = useGetPlatformFees();
  const { count: marketCount } = useGetMarketCount();
  const { disputes, isLoading: isLoadingDisputes, refetch: refetchDisputes } = useGetPendingDisputes();
  
  // Admin actions
  const { withdrawFees, isPending: isWithdrawPending, isConfirming: isWithdrawConfirming, isSuccess: isWithdrawSuccess, error: withdrawError, hash: withdrawHash } = useWithdrawFees();
  const { resolveDispute, isPending: isResolvePending, isConfirming: isResolveConfirming, isSuccess: isResolveSuccess, error: resolveError, hash: resolveHash } = useResolveDispute();
  
  // Creator reputation
  const { reputation: creatorRep, refetch: refetchRep } = useGetCreatorReputation(
    creatorAddressInput as Address || undefined
  );
  
  // Check if connected user is owner
  const isOwner = useMemo(() => {
    if (!address || !owner) return false;
    return address.toLowerCase() === owner.toLowerCase();
  }, [address, owner]);
  
  // Redirect non-owners to home page
  useEffect(() => {
    if (!isLoadingOwner && isConnected && !isOwner && owner) {
      router.push('/');
    }
  }, [isLoadingOwner, isConnected, isOwner, owner, router]);
  
  // Transaction modal management
  useEffect(() => {
    if (isWithdrawPending || isWithdrawConfirming || isWithdrawSuccess || withdrawError ||
        isResolvePending || isResolveConfirming || isResolveSuccess || resolveError) {
      setShowModal(true);
    }
  }, [isWithdrawPending, isWithdrawConfirming, isWithdrawSuccess, withdrawError,
      isResolvePending, isResolveConfirming, isResolveSuccess, resolveError]);
  
  const getModalStatus = (): 'pending' | 'confirming' | 'success' | 'error' => {
    if (withdrawError || resolveError) return 'error';
    if (isWithdrawSuccess || isResolveSuccess) return 'success';
    if (isWithdrawConfirming || isResolveConfirming) return 'confirming';
    return 'pending';
  };
  
  const handleModalClose = () => {
    setShowModal(false);
    if (isWithdrawSuccess) {
      refetchFees();
    }
    if (isResolveSuccess) {
      refetchDisputes();
    }
  };
  
  const handleWithdraw = async () => {
    if (!isOwner) return;
    try {
      await withdrawFees();
    } catch (error) {
      console.error('Error withdrawing fees:', error);
    }
  };
  
  const handleResolveDispute = async (marketAddress: Address, valid: boolean) => {
    if (!isOwner) return;
    try {
      await resolveDispute(marketAddress, valid);
    } catch (error) {
      console.error('Error resolving dispute:', error);
    }
  };
  
  const handleSearchCreator = () => {
    if (creatorAddressInput) {
      refetchRep();
    }
  };

  // Access control check
  if (isLoadingOwner) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Head>
          <title>Truce - Admin Panel</title>
          <meta content="Admin panel for Truce platform" name="description" />
          <link href="/favicon.ico" rel="icon" />
        </Head>
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-white font-orbitron text-xl">Loading...</div>
        </main>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Head>
          <title>Truce - Admin Panel</title>
          <meta content="Admin panel for Truce platform" name="description" />
          <link href="/favicon.ico" rel="icon" />
        </Head>
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-white font-orbitron text-3xl mb-4">🔐 Connect Wallet</div>
            <div className="text-[#CCCCCC] font-orbitron text-lg">Connect your wallet to access the admin panel</div>
          </div>
        </main>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Head>
          <title>Truce - Admin Panel</title>
          <meta content="Admin panel for Truce platform" name="description" />
          <link href="/favicon.ico" rel="icon" />
        </Head>
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 font-orbitron text-3xl mb-4">⛔ Access Denied</div>
            <div className="text-[#CCCCCC] font-orbitron text-lg">You do not have permission to access this page</div>
            <div className="text-[#888888] font-orbitron text-sm mt-4">Owner: {owner}</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Head>
        <title>Truce - Admin Panel</title>
        <meta content="Admin panel for Truce platform" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Navbar />

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showModal}
        status={getModalStatus()}
        errorMessage={withdrawError?.message || resolveError?.message}
        txHash={withdrawHash || resolveHash}
        onClose={handleModalClose}
      />

      <main className="flex-1 w-full flex justify-center">
        <div className="w-full" style={{ maxWidth: '1312px', minWidth: '1200px', padding: '40px 64px', position: 'relative' }}>
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-orbitron font-semibold text-[32px] text-white mb-2">Admin Panel</h1>
            <p className="font-orbitron text-[16px] text-[#CCCCCC]">Factory Management & Platform Control</p>
          </div>

          {/* Stats Cards */}
          <div style={{ width: '1256px', height: '111px', borderRadius: '2px', borderWidth: '2px', background: '#222222', border: '2px solid #61616133', marginTop: '16px', position: 'relative' }}>
            <div style={{ position: 'absolute', width: '150px', height: '75px', top: '18px', left: '50px', padding: '4px', gap: '8px', display: 'flex', flexDirection: 'column' }}>
              <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '10px', lineHeight: '100%', color: '#FFFFFF' }}>TOTAL MARKETS</div>
              <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 600, fontSize: '24px', lineHeight: '100%', color: '#00FF99' }}>
                {marketCount}
              </div>
            </div>
            
            <div style={{ position: 'absolute', width: '0px', height: '69px', top: '21px', left: '400px', opacity: 0.3, borderLeft: '1px solid #FFFFFF' }} />
            
            <div style={{ position: 'absolute', width: '250px', height: '75px', top: '18px', left: '450px', padding: '4px', gap: '8px', display: 'flex', flexDirection: 'column' }}>
              <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '10px', lineHeight: '100%', color: '#FFFFFF' }}>PLATFORM FEES</div>
              <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 600, fontSize: '24px', lineHeight: '100%', color: '#00FF99' }}>
                {totalFees ? Number(formatEther(totalFees)).toFixed(4) : '0.0000'} ETH
              </div>
            </div>
            
            <div style={{ position: 'absolute', width: '0px', height: '69px', top: '21px', left: '850px', opacity: 0.3, borderLeft: '1px solid #FFFFFF' }} />
            
            <div style={{ position: 'absolute', width: '180px', height: '75px', top: '18px', left: '900px', padding: '4px', gap: '8px', display: 'flex', flexDirection: 'column' }}>
              <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '10px', lineHeight: '100%', color: disputes && disputes.length > 0 ? '#FF3366' : '#FFFFFF' }}>PENDING DISPUTES</div>
              <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 600, fontSize: '24px', lineHeight: '100%', color: disputes && disputes.length > 0 ? '#FF3366' : '#00FF99' }}>
                {disputes?.length || 0}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div
            className="flex items-center"
            style={{
              width: '450px',
              height: '38px',
              borderRadius: '6px',
              justifyContent: 'space-between',
              opacity: 1,
              marginTop: '48px',
              marginBottom: '40px',
              background: '#1A1A1A',
              padding: '4px',
              gap: '4px',
            }}
          >
            {(['overview', 'disputes', 'creators'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="font-orbitron transition-all duration-200 hover:opacity-80"
                style={{
                  fontFamily: 'Orbitron',
                  fontSize: '14px',
                  fontWeight: activeTab === tab ? 700 : 400,
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '4px',
                  background: activeTab === tab ? '#00FF99' : 'transparent',
                  color: activeTab === tab ? '#000000' : '#FFFFFF',
                  cursor: 'pointer',
                  flex: 1,
                  whiteSpace: 'nowrap',
                  textTransform: 'capitalize',
                }}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>

        {/* Tab Content */}
        <div>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div style={{ width: '1256px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Withdraw Fees Section */}
              <div
                style={{
                  width: '1256px',
                  borderRadius: '2px',
                  borderWidth: '2px',
                  background: '#222222',
                  border: '2px solid #61616133',
                  padding: '32px',
                  position: 'relative',
                }}
              >
                <h2 className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 500, fontSize: '20px', lineHeight: '150%', color: '#FFFFFF', marginBottom: '8px' }}>
                  Withdraw Platform Fees
                </h2>
                <p className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '12px', color: '#888888', marginBottom: '32px' }}>
                  Withdraw accumulated platform fees to the owner wallet
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <div>
                    <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '10px', lineHeight: '100%', color: '#888888', marginBottom: '8px' }}>
                      AVAILABLE TO WITHDRAW
                    </div>
                    <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 600, fontSize: '32px', lineHeight: '100%', color: '#00FF99' }}>
                      {totalFees ? Number(formatEther(totalFees)).toFixed(6) : '0.000000'} ETH
                    </div>
                  </div>
                  
                  <button
                    onClick={handleWithdraw}
                    disabled={!totalFees || totalFees === BigInt(0) || isWithdrawPending || isWithdrawConfirming}
                    className="font-orbitron transition-all duration-300"
                    style={{
                      padding: '12px 32px',
                      borderRadius: '2px',
                      background: (!totalFees || totalFees === BigInt(0) || isWithdrawPending || isWithdrawConfirming) 
                        ? '#333333' 
                        : '#00FF99',
                      color: (!totalFees || totalFees === BigInt(0) || isWithdrawPending || isWithdrawConfirming) 
                        ? '#666666' 
                        : '#000000',
                      fontWeight: 600,
                      fontSize: '14px',
                      border: 'none',
                      cursor: (!totalFees || totalFees === BigInt(0) || isWithdrawPending || isWithdrawConfirming) 
                        ? 'not-allowed' 
                        : 'pointer',
                    }}
                  >
                    {isWithdrawPending || isWithdrawConfirming ? 'WITHDRAWING...' : 'WITHDRAW FEES'}
                  </button>
                </div>
                
                <div 
                  style={{
                    padding: '12px 16px',
                    borderRadius: '2px',
                    background: 'rgba(0, 255, 153, 0.05)',
                    border: '1px solid rgba(0, 255, 153, 0.2)',
                  }}
                >
                  <p className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '12px', color: '#00FF99' }}>
                    ℹ️ Platform fees are automatically collected from market trades and resolutions
                  </p>
                </div>
              </div>

              {/* Factory Info */}
              <div
                style={{
                  width: '1256px',
                  borderRadius: '2px',
                  borderWidth: '2px',
                  background: '#222222',
                  border: '2px solid #61616133',
                  padding: '32px',
                }}
              >
                <h2 className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 500, fontSize: '20px', lineHeight: '150%', color: '#FFFFFF', marginBottom: '24px' }}>
                  Factory Information
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  <div>
                    <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '10px', lineHeight: '100%', color: '#888888', marginBottom: '8px' }}>
                      OWNER ADDRESS
                    </div>
                    <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '14px', color: '#FFFFFF', wordBreak: 'break-all' }}>
                      {owner}
                    </div>
                  </div>
                  <div>
                    <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '10px', lineHeight: '100%', color: '#888888', marginBottom: '8px' }}>
                      CONNECTED WALLET
                    </div>
                    <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '14px', color: '#FFFFFF', wordBreak: 'break-all' }}>
                      {address}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Disputes Tab */}
          {activeTab === 'disputes' && (
            <div style={{ width: '1256px' }}>
              {isLoadingDisputes ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#00FF99] mx-auto mb-4"></div>
                  <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '16px', color: '#FFFFFF' }}>
                    Loading disputes...
                  </div>
                </div>
              ) : !disputes || disputes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 600, fontSize: '24px', color: '#FFFFFF', marginBottom: '8px' }}>
                    ✅ No Pending Disputes
                  </div>
                  <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '14px', color: '#888888' }}>
                    All markets are running smoothly
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 500, fontSize: '20px', lineHeight: '150%', color: '#FFFFFF', marginBottom: '24px' }}>
                    Resolve Disputes ({disputes.length})
                  </h2>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {disputes.map((marketAddress) => (
                      <DisputeCard 
                        key={marketAddress}
                        marketAddress={marketAddress}
                        onResolve={handleResolveDispute}
                        isProcessing={isResolvePending || isResolveConfirming}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Creators Tab */}
          {activeTab === 'creators' && (
            <div style={{ width: '1256px' }}>
              {/* Creator Search */}
              <div
                style={{
                  width: '1256px',
                  borderRadius: '2px',
                  borderWidth: '2px',
                  background: '#222222',
                  border: '2px solid #61616133',
                  padding: '32px',
                }}
              >
                <h2 className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 500, fontSize: '20px', lineHeight: '150%', color: '#FFFFFF', marginBottom: '8px' }}>
                  Creator Reputation
                </h2>
                <p className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '12px', color: '#888888', marginBottom: '24px' }}>
                  Check reputation score and statistics for market creators
                </p>
                
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                  <input
                    type="text"
                    value={creatorAddressInput}
                    onChange={(e) => setCreatorAddressInput(e.target.value)}
                    placeholder="Enter creator address (0x...)"
                    className="flex-1 font-orbitron"
                    style={{
                      padding: '12px 16px',
                      borderRadius: '2px',
                      background: '#1a1a1a',
                      border: '1px solid #61616133',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontFamily: 'Orbitron',
                    }}
                  />
                  <button
                    onClick={handleSearchCreator}
                    disabled={!creatorAddressInput}
                    className="font-orbitron transition-all duration-300"
                    style={{
                      padding: '12px 32px',
                      borderRadius: '2px',
                      background: !creatorAddressInput ? '#333333' : '#00FF99',
                      color: !creatorAddressInput ? '#666666' : '#000000',
                      fontWeight: 600,
                      fontSize: '14px',
                      border: 'none',
                      cursor: !creatorAddressInput ? 'not-allowed' : 'pointer',
                    }}
                  >
                    SEARCH
                  </button>
                </div>
                
                {creatorRep && creatorAddressInput && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div
                      style={{
                        padding: '20px',
                        borderRadius: '2px',
                        background: 'rgba(0, 255, 153, 0.05)',
                        border: '1px solid rgba(0, 255, 153, 0.2)',
                      }}
                    >
                      <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '10px', lineHeight: '100%', color: '#00FF99', marginBottom: '12px' }}>
                        MARKETS CREATED
                      </div>
                      <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 600, fontSize: '32px', lineHeight: '100%', color: '#FFFFFF' }}>
                        {creatorRep[0].toString()}
                      </div>
                    </div>
                    
                    <div
                      style={{
                        padding: '20px',
                        borderRadius: '2px',
                        background: 'rgba(255, 51, 102, 0.05)',
                        border: '1px solid rgba(255, 51, 102, 0.2)',
                      }}
                    >
                      <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '10px', lineHeight: '100%', color: '#FF3366', marginBottom: '12px' }}>
                        DISPUTES LOST
                      </div>
                      <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 600, fontSize: '32px', lineHeight: '100%', color: '#FFFFFF' }}>
                        {creatorRep[1].toString()}
                      </div>
                    </div>
                    
                    <div
                      style={{
                        padding: '20px',
                        borderRadius: '2px',
                        background: 'rgba(0, 255, 153, 0.05)',
                        border: '1px solid rgba(0, 255, 153, 0.2)',
                      }}
                    >
                      <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '10px', lineHeight: '100%', color: '#00FF99', marginBottom: '12px' }}>
                        REPUTATION SCORE
                      </div>
                      <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 600, fontSize: '32px', lineHeight: '100%', color: '#FFFFFF' }}>
                        {creatorRep[2].toString()}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        </div>
      </main>
    </div>
  );
};

// Dispute Card Component
interface DisputeCardProps {
  marketAddress: Address;
  onResolve: (marketAddress: Address, valid: boolean) => Promise<void>;
  isProcessing: boolean;
}

const DisputeCard: React.FC<DisputeCardProps> = ({ marketAddress, onResolve, isProcessing }) => {
  const { marketData } = useGetMarketData(marketAddress);
  const [resolving, setResolving] = useState(false);

  const handleResolve = async (valid: boolean) => {
    setResolving(true);
    try {
      await onResolve(marketAddress, valid);
    } finally {
      setResolving(false);
    }
  };

  return (
    <div
      style={{
        width: '1256px',
        borderRadius: '2px',
        borderWidth: '2px',
        background: '#222222',
        border: '2px solid rgba(255, 51, 102, 0.3)',
        padding: '24px',
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <h3 className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 600, fontSize: '16px', lineHeight: '150%', color: '#FFFFFF', marginBottom: '8px' }}>
          {marketData?.question || 'Loading...'}
        </h3>
        <p className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '12px', color: '#888888', wordBreak: 'break-all' }}>
          Market: {marketAddress}
        </p>
      </div>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => handleResolve(true)}
          disabled={isProcessing || resolving}
          className="flex-1 font-orbitron transition-all duration-300"
          style={{
            padding: '12px 24px',
            borderRadius: '2px',
            background: (isProcessing || resolving) ? '#333333' : '#00FF99',
            color: (isProcessing || resolving) ? '#666666' : '#000000',
            fontWeight: 600,
            fontSize: '14px',
            border: 'none',
            cursor: (isProcessing || resolving) ? 'not-allowed' : 'pointer',
          }}
        >
          ✓ DISPUTE VALID
        </button>
        
        <button
          onClick={() => handleResolve(false)}
          disabled={isProcessing || resolving}
          className="flex-1 font-orbitron transition-all duration-300"
          style={{
            padding: '12px 24px',
            borderRadius: '2px',
            background: (isProcessing || resolving) ? '#333333' : '#FF3366',
            color: (isProcessing || resolving) ? '#666666' : '#FFFFFF',
            fontWeight: 600,
            fontSize: '14px',
            border: 'none',
            cursor: (isProcessing || resolving) ? 'not-allowed' : 'pointer',
          }}
        >
          ✗ DISPUTE INVALID
        </button>
      </div>
    </div>
  );
};

export default Admin;

