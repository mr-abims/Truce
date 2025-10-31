import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatEther, parseEther, type Address } from 'viem';
import {
  useAddLiquidity,
  useRemoveLiquidity,
  useRedeemLPTokens,
  useGetLPTokenBalance,
  useGetAccumulatedFees,
  useGetTotalLPSupply,
  useGetMarketData,
  useTransferLPTokens,
} from '../hooks/useTruceMarket';
import { MarketState } from '../config/contracts';

interface LPManagerProps {
  marketAddress: Address;
  marketState: MarketState;
}

export default function LPManager({ marketAddress, marketState }: LPManagerProps) {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<'add' | 'remove' | 'transfer'>('add');
  const [amount, setAmount] = useState('');
  const [transferAddress, setTransferAddress] = useState('');

  // Hooks
  const { addLiquidity, isPending: isAddPending, isConfirming: isAddConfirming, isSuccess: isAddSuccess } = useAddLiquidity(marketAddress);
  const { removeLiquidity, isPending: isRemovePending, isConfirming: isRemoveConfirming, isSuccess: isRemoveSuccess } = useRemoveLiquidity(marketAddress);
  const { redeemLPTokens, isPending: isRedeemPending, isConfirming: isRedeemConfirming, isSuccess: isRedeemSuccess } = useRedeemLPTokens(marketAddress);
  const { transferLPTokens, isPending: isTransferPending, isConfirming: isTransferConfirming, isSuccess: isTransferSuccess } = useTransferLPTokens(marketAddress);

  const { lpBalance, refetch: refetchBalance } = useGetLPTokenBalance(marketAddress, address);
  const { accumulatedFees, refetch: refetchFees } = useGetAccumulatedFees(marketAddress);
  const { totalSupply, refetch: refetchSupply } = useGetTotalLPSupply(marketAddress);
  const { marketData, refetch: refetchMarketData } = useGetMarketData(marketAddress);

  // Calculate pool value and user share
  const poolValue = marketData ?
    (marketData.totalYesShares + marketData.totalNoShares + marketData.accumulatedFees) : BigInt(0);

  const userSharePercent = totalSupply > BigInt(0) ?
    (Number(lpBalance) / Number(totalSupply)) * 100 : 0;

  const userPoolValue = totalSupply > BigInt(0) ?
    (lpBalance * poolValue) / totalSupply : BigInt(0);

  // Refetch data on success
  useEffect(() => {
    if (isAddSuccess || isRemoveSuccess || isRedeemSuccess || isTransferSuccess) {
      refetchBalance();
      refetchFees();
      refetchSupply();
      refetchMarketData();
      setAmount('');
      setTransferAddress('');
    }
  }, [isAddSuccess, isRemoveSuccess, isRedeemSuccess, isTransferSuccess, refetchBalance, refetchFees, refetchSupply, refetchMarketData]);

  const handleAddLiquidity = async () => {
    try {
      await addLiquidity(amount);
    } catch (error) {
      console.error('Error adding liquidity:', error);
    }
  };

  const handleRemoveLiquidity = async () => {
    try {
      const lpAmount = parseEther(amount);
      await removeLiquidity(lpAmount);
    } catch (error) {
      console.error('Error removing liquidity:', error);
    }
  };

  const handleRedeemLP = async () => {
    try {
      await redeemLPTokens();
    } catch (error) {
      console.error('Error redeeming LP tokens:', error);
    }
  };

  const handleTransfer = async () => {
    try {
      const lpAmount = parseEther(amount);
      await transferLPTokens(transferAddress as Address, lpAmount);
    } catch (error) {
      console.error('Error transferring LP tokens:', error);
    }
  };

  const isProcessing = isAddPending || isAddConfirming || isRemovePending || isRemoveConfirming ||
                        isRedeemPending || isRedeemConfirming || isTransferPending || isTransferConfirming;

  const canAddLiquidity = marketState === MarketState.Active;
  const canRemoveLiquidity = marketState === MarketState.Active && lpBalance > BigInt(0);
  const canRedeemLP = marketState === MarketState.Resolved && lpBalance > BigInt(0);

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%)',
        border: '2px solid #00FF99',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 0 20px rgba(0, 255, 153, 0.3)',
      }}
    >
      {/* Header */}
      <h2
        className="font-orbitron text-white"
        style={{
          fontSize: '24px',
          fontWeight: 700,
          marginBottom: '16px',
        }}
      >
        LP Token Management
      </h2>

      {/* LP Stats */}
      <div
        style={{
          background: '#0F0F0F',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px',
          border: '1px solid #00FF99',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <p className="font-orbitron text-[#CCCCCC]" style={{ fontSize: '12px', marginBottom: '4px' }}>
              Your LP Tokens
            </p>
            <p className="font-orbitron text-white" style={{ fontSize: '18px', fontWeight: 700 }}>
              {Number(formatEther(lpBalance)).toFixed(6)}
            </p>
          </div>
          <div>
            <p className="font-orbitron text-[#CCCCCC]" style={{ fontSize: '12px', marginBottom: '4px' }}>
              Your Pool Share
            </p>
            <p className="font-orbitron text-[#00FF99]" style={{ fontSize: '18px', fontWeight: 700 }}>
              {userSharePercent.toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="font-orbitron text-[#CCCCCC]" style={{ fontSize: '12px', marginBottom: '4px' }}>
              Your Pool Value
            </p>
            <p className="font-orbitron text-white" style={{ fontSize: '18px', fontWeight: 700 }}>
              {Number(formatEther(userPoolValue)).toFixed(6)} ETH
            </p>
          </div>
          <div>
            <p className="font-orbitron text-[#CCCCCC]" style={{ fontSize: '12px', marginBottom: '4px' }}>
              Accumulated Fees
            </p>
            <p className="font-orbitron text-[#FEC428]" style={{ fontSize: '18px', fontWeight: 700 }}>
              {Number(formatEther(accumulatedFees)).toFixed(6)} ETH
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      {marketState !== MarketState.Resolved && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '20px',
            borderBottom: '2px solid #1A1A1A',
            paddingBottom: '8px',
          }}
        >
          {['add', 'remove', 'transfer'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className="font-orbitron"
              style={{
                padding: '8px 16px',
                background: activeTab === tab ? '#00FF99' : 'transparent',
                color: activeTab === tab ? '#000000' : '#FFFFFF',
                border: activeTab === tab ? 'none' : '1px solid #00FF99',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'capitalize',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Add Liquidity */}
      {activeTab === 'add' && marketState === MarketState.Active && (
        <div>
          <p className="font-orbitron text-[#CCCCCC]" style={{ fontSize: '14px', marginBottom: '12px' }}>
            Add liquidity to earn 0.4% of all trading fees. You&apos;ll receive LP tokens representing your share.
          </p>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount in ETH (min: 0.001)"
            className="font-orbitron"
            style={{
              width: '100%',
              padding: '12px',
              background: '#1A1A1A',
              border: '2px solid #00FF99',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '16px',
              marginBottom: '16px',
            }}
          />
          <button
            onClick={handleAddLiquidity}
            disabled={!amount || Number(amount) <= 0 || isProcessing}
            className="font-orbitron"
            style={{
              width: '100%',
              padding: '14px',
              background: !amount || Number(amount) <= 0 || isProcessing ? '#666666' : '#00FF99',
              color: '#000000',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: !amount || Number(amount) <= 0 || isProcessing ? 'not-allowed' : 'pointer',
              boxShadow: !amount || Number(amount) <= 0 || isProcessing ? 'none' : '0 0 20px rgba(0, 255, 153, 0.4)',
            }}
          >
            {isAddPending ? 'Confirm in Wallet...' : isAddConfirming ? 'Adding Liquidity...' : 'Add Liquidity'}
          </button>
        </div>
      )}

      {/* Remove Liquidity */}
      {activeTab === 'remove' && marketState === MarketState.Active && (
        <div>
          <p className="font-orbitron text-[#CCCCCC]" style={{ fontSize: '14px', marginBottom: '12px' }}>
            Remove liquidity by burning your LP tokens. You&apos;ll receive your proportional share of the pool.
          </p>
          <div style={{ marginBottom: '12px' }}>
            <p className="font-orbitron text-[#CCCCCC]" style={{ fontSize: '12px', marginBottom: '4px' }}>
              Available: {Number(formatEther(lpBalance)).toFixed(6)} LP tokens
            </p>
            <button
              onClick={() => setAmount(formatEther(lpBalance))}
              className="font-orbitron text-[#00FF99]"
              style={{
                fontSize: '12px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Use Max
            </button>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount of LP tokens"
            className="font-orbitron"
            style={{
              width: '100%',
              padding: '12px',
              background: '#1A1A1A',
              border: '2px solid #00FF99',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '16px',
              marginBottom: '16px',
            }}
          />
          <button
            onClick={handleRemoveLiquidity}
            disabled={!amount || Number(amount) <= 0 || !canRemoveLiquidity || isProcessing}
            className="font-orbitron"
            style={{
              width: '100%',
              padding: '14px',
              background: !amount || Number(amount) <= 0 || !canRemoveLiquidity || isProcessing ? '#666666' : '#FF3366',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: !amount || Number(amount) <= 0 || !canRemoveLiquidity || isProcessing ? 'not-allowed' : 'pointer',
            }}
          >
            {isRemovePending ? 'Confirm in Wallet...' : isRemoveConfirming ? 'Removing Liquidity...' : 'Remove Liquidity'}
          </button>
        </div>
      )}

      {/* Transfer LP Tokens */}
      {activeTab === 'transfer' && marketState === MarketState.Active && (
        <div>
          <p className="font-orbitron text-[#CCCCCC]" style={{ fontSize: '14px', marginBottom: '12px' }}>
            Transfer your LP tokens to another address. LP tokens are ERC20 compatible!
          </p>
          <input
            type="text"
            value={transferAddress}
            onChange={(e) => setTransferAddress(e.target.value)}
            placeholder="Recipient address (0x...)"
            className="font-orbitron"
            style={{
              width: '100%',
              padding: '12px',
              background: '#1A1A1A',
              border: '2px solid #00FF99',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '14px',
              marginBottom: '12px',
            }}
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount of LP tokens"
            className="font-orbitron"
            style={{
              width: '100%',
              padding: '12px',
              background: '#1A1A1A',
              border: '2px solid #00FF99',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '16px',
              marginBottom: '16px',
            }}
          />
          <button
            onClick={handleTransfer}
            disabled={!amount || !transferAddress || Number(amount) <= 0 || isProcessing}
            className="font-orbitron"
            style={{
              width: '100%',
              padding: '14px',
              background: !amount || !transferAddress || Number(amount) <= 0 || isProcessing ? '#666666' : '#00FF99',
              color: '#000000',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: !amount || !transferAddress || Number(amount) <= 0 || isProcessing ? 'not-allowed' : 'pointer',
            }}
          >
            {isTransferPending ? 'Confirm in Wallet...' : isTransferConfirming ? 'Transferring...' : 'Transfer LP Tokens'}
          </button>
        </div>
      )}

      {/* Redeem LP Tokens (After Resolution) */}
      {marketState === MarketState.Resolved && canRedeemLP && (
        <div>
          <p className="font-orbitron text-[#CCCCCC]" style={{ fontSize: '14px', marginBottom: '12px' }}>
            Market has been resolved. Redeem your LP tokens to claim your share of the pool including accumulated fees!
          </p>
          <div
            style={{
              background: '#0F0F0F',
              border: '1px solid #00FF99',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
            }}
          >
            <p className="font-orbitron text-[#CCCCCC]" style={{ fontSize: '12px' }}>
              You&apos;ll receive approximately:
            </p>
            <p className="font-orbitron text-[#00FF99]" style={{ fontSize: '24px', fontWeight: 700, marginTop: '8px' }}>
              {Number(formatEther(userPoolValue)).toFixed(6)} ETH
            </p>
          </div>
          <button
            onClick={handleRedeemLP}
            disabled={isProcessing}
            className="font-orbitron"
            style={{
              width: '100%',
              padding: '14px',
              background: isProcessing ? '#666666' : '#00FF99',
              color: '#000000',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              boxShadow: isProcessing ? 'none' : '0 0 20px rgba(0, 255, 153, 0.6)',
            }}
          >
            {isRedeemPending ? 'Confirm in Wallet...' : isRedeemConfirming ? 'Redeeming...' : 'Redeem LP Tokens'}
          </button>
        </div>
      )}

      {/* Info Message when market not active */}
      {marketState !== MarketState.Active && marketState !== MarketState.Resolved && (
        <div
          style={{
            background: '#1A1A1A',
            border: '1px solid #FEC428',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <p className="font-orbitron text-[#FEC428]" style={{ fontSize: '14px' }}>
            LP operations are only available while the market is Active or after it&apos;s Resolved.
          </p>
        </div>
      )}
    </div>
  );
}
