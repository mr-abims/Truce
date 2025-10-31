# Truce Prediction Market Protocol - Smart Contract Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Core Architecture](#core-architecture)
3. [Market Creation](#market-creation)
4. [LP Token System (ERC20)](#lp-token-system-erc20)
5. [Fee Structure](#fee-structure)
6. [Dynamic Market Cap System](#dynamic-market-cap-system)
7. [Trading Mechanics](#trading-mechanics)
8. [Market Resolution & Disputes](#market-resolution--disputes)
9. [Key Functions Reference](#key-functions-reference)
10. [Security Features](#security-features)
11. [Constants & Parameters](#constants--parameters)
12. [Usage Examples](#usage-examples)

---

## System Overview

Truce is a decentralized prediction market protocol that allows users to:
- **Create binary outcome markets** (YES/NO questions)
- **Trade shares** representing outcomes using an automated market maker (AMM)
- **Provide liquidity** and earn fees through ERC20 LP tokens
- **Resolve markets** with dispute mechanisms
- Markets grow **dynamically without hard caps**

### Key Features
✅ **No Maximum Caps** - Markets grow organically based on demand
✅ **ERC20 LP Tokens** - Transferable, composable with DeFi
✅ **Low Fees** - 0.5% total (0.1% platform, 0.4% LP)
✅ **Constant Product AMM** - Proven x * y = k formula
✅ **Dispute Mechanism** - Community-driven resolution verification
✅ **Reputation System** - Tracks creator reliability

---

## Core Architecture

### Contract Structure

```
┌─────────────────────────────────────────────────────────┐
│                    TruceFactory                         │
│  - Deploy markets                                       │
│  - Track all markets                                    │
│  - Collect platform fees (0.1%)                        │
│  - Resolve disputes                                     │
└──────────────────┬──────────────────────────────────────┘
                   │ creates
                   ▼
┌─────────────────────────────────────────────────────────┐
│              TruceMarket (ERC20)                        │
│  - Individual prediction market                         │
│  - Inherits ERC20 for LP tokens                        │
│  - Implements constant product AMM                      │
│  - Manages trading, liquidity, resolution               │
└──────────────────┬──────────────────────────────────────┘
                   │ uses
                   ▼
┌─────────────────────────────────────────────────────────┐
│                   TruceAMM (Library)                    │
│  - Pure math functions                                  │
│  - Calculate share prices                               │
│  - Calculate swap amounts                               │
│  - x * y = k formula                                    │
└─────────────────────────────────────────────────────────┘
```

### Contracts

#### **TruceFactory** (`src/TruceFactory.sol`)
- **Purpose**: Factory contract for deploying and managing markets
- **Functions**: Deploy markets, track markets, resolve disputes, collect fees
- **State**:
  - `allMarkets[]` - Array of all market addresses
  - `marketsByCreator` - Markets indexed by creator
  - `marketsByCategory` - Markets indexed by category
  - `creatorDisputeCount` - Reputation tracking

#### **TruceMarket** (`src/Truce.sol`)
- **Purpose**: Individual prediction market contract
- **Inheritance**: ERC20, ReentrancyGuard
- **Functions**: Buy/sell shares, add/remove liquidity, resolve market, dispute
- **State**:
  - `totalYesShares` - YES outcome reserves
  - `totalNoShares` - NO outcome reserves
  - `k` - Constant product invariant
  - `accumulatedFees` - Fees earned by LPs
  - `capConfig` - Dynamic cap configuration
  - `yesShares[user]` - User YES share balances
  - `noShares[user]` - User NO share balances
  - ERC20 balances for LP tokens

#### **TruceAMM** (`src/TruceAmm.sol`)
- **Purpose**: Pure math library for AMM calculations
- **Functions**:
  - `calculateSharesOut()` - Calculate shares received for ETH
  - `calculateEthOut()` - Calculate ETH received for shares
  - `getPrice()` - Calculate current price for outcome
  - `getCapUtilization()` - Calculate cap utilization percentage

### Interfaces

#### **ITruceFactory** (`src/ITruceFactory.sol`)
Defines factory interface and market categories:
```solidity
enum MarketCategory {
    CRYPTO,
    SPORTS,
    POLITICS,
    ENTERTAINMENT,
    SCIENCE,
    OTHER
}
```

#### **ITruceMarket** (`src/ITruce.sol`)
Defines market interface, states, and events:
```solidity
enum MarketState {
    Active,          // Trading allowed
    PendingDispute,  // Resolved, awaiting disputes
    Disputed,        // Dispute submitted
    Resolved,        // Finalized
    Cancelled        // Cancelled (unused)
}

enum Outcome {
    Yes,
    No
}
```

---

## Market Creation

### Creation Process

```
┌──────────────┐
│ User/Creator │
└──────┬───────┘
       │ createMarket{value: 10 ETH}
       ▼
┌─────────────────┐
│  TruceFactory   │
├─────────────────┤
│ 1. Validate     │
│ 2. Deploy       │
│ 3. Track        │
└──────┬──────────┘
       │ deploys
       ▼
┌─────────────────────────┐
│     TruceMarket         │
├─────────────────────────┤
│ 1. Initialize reserves  │
│    - 5 ETH → YES        │
│    - 5 ETH → NO         │
│ 2. Mint LP tokens       │
│    - 1000 wei → DEAD    │
│    - 9.999... → Creator │
│ 3. Set cap = 10 ETH     │
└─────────────────────────┘
```

### Function Call

```solidity
address market = factory.createMarket{value: initialLiquidity}(
    string memory question,      // "Will ETH hit $10k in 2025?"
    uint256 resolutionDeadline,  // block.timestamp + 30 days
    uint256 initialLiquidity,    // Must match msg.value
    MarketCategory category      // CRYPTO, SPORTS, etc.
);
```

### Requirements

| Parameter | Constraint |
|-----------|-----------|
| **Question** | Non-empty string |
| **Resolution Deadline** | Current time + 1 hour to +365 days |
| **Initial Liquidity** | ≥ 1000 wei (MIN_LIQUIDITY) |
| **ETH Sent** | Must equal or exceed initial liquidity |
| **Category** | Valid MarketCategory enum value |

### Initialization Details

**Reserves Setup:**
```
Initial Liquidity = 10 ETH
├─> YES reserves = 10 ETH / 2 = 5 ETH
├─> NO reserves = 10 ETH / 2 = 5 ETH
└─> k = 5 * 5 = 25 ETH²
```

**LP Token Distribution:**
```
Total LP tokens minted = 10 ETH
├─> 0.000000000000001 ETH (1000 wei) → DEAD_ADDRESS (burned)
└─> 9.999999999999999 ETH → Creator
```

**Cap Configuration:**
```solidity
capConfig = {
    currentCap: 10 ETH,
    growthMultiplier: 200,      // 2x
    growthThreshold: 8000,      // 80%
    lastGrowthTime: block.timestamp,
    minGrowthInterval: 1 hours
}
```

### Example

```solidity
// Deploy factory
TruceFactory factory = new TruceFactory();

// Create crypto market
address btcMarket = factory.createMarket{value: 100 ether}(
    "Will Bitcoin reach $100k in 2025?",
    block.timestamp + 90 days,
    100 ether,
    ITruceFactory.MarketCategory.CRYPTO
);

// Create sports market
address sportsMarket = factory.createMarket{value: 50 ether}(
    "Will Lakers win NBA Championship 2025?",
    block.timestamp + 180 days,
    50 ether,
    ITruceFactory.MarketCategory.SPORTS
);
```

---

## LP Token System (ERC20)

### What are LP Tokens?

LP (Liquidity Provider) tokens represent **proportional ownership** in a market's liquidity pool.

**Key Characteristics:**
- ✅ **ERC20 Standard** - Fully transferable, approved standard
- ✅ **Proportional Claims** - Represent share of pool value
- ✅ **Fee Earning** - Automatically accumulate 0.4% of all trades
- ✅ **Composable** - Can be used in other DeFi protocols
- ✅ **Redeemable** - Remove liquidity anytime (Active) or redeem after resolution

### Token Naming

```
Market Question: "Will ETH hit $10k in 2025?"
├─> Name: "Truce LP: Will ETH hit $10k in 2025?"
└─> Symbol: "TRUCE-LP"
```

### How LP Tokens Work

#### **Initial LP Token Minting (Market Creation)**

```
Creator provides: 10 ETH
│
├─> Market initialized:
│   ├─> 5 ETH added to YES reserves
│   ├─> 5 ETH added to NO reserves
│   └─> k = 25 ETH²
│
└─> LP tokens minted:
    ├─> 1000 wei → DEAD_ADDRESS (0x...dEaD)  [BURNED]
    └─> 9.999999999999999 ETH → Creator
```

**Why burn MIN_LIQUIDITY?**
- Prevents inflation attacks
- Ensures pool value can never be manipulated to zero
- Standard practice (Uniswap V2)

#### **Adding Liquidity (Subsequent)**

**Formula:**
```
LP tokens minted = (ETH deposited × total LP supply) / pool value
```

**Example:**
```
Current State:
├─> Total YES reserves: 5 ETH
├─> Total NO reserves: 5 ETH
├─> Accumulated fees: 0.5 ETH
├─> Pool value: 5 + 5 + 0.5 = 10.5 ETH
└─> Total LP supply: 10 ETH

LP adds 5 ETH:
├─> LP tokens = (5 × 10) / 10.5 = 4.762 LP tokens
├─> New reserves: YES += 2.5, NO += 2.5
├─> New total supply: 14.762 LP tokens
└─> LP owns: 4.762 / 14.762 = 32.26% of pool
```

#### **Removing Liquidity**

**Formula:**
```
ETH received = (LP tokens burned × pool value) / total LP supply
```

**Example:**
```
LP owns 5 LP tokens
Total LP supply: 15 LP tokens
Pool value: 20 ETH reserves + 1 ETH fees = 21 ETH

ETH received:
├─> (5 / 15) × 21 = 7 ETH
├─> Proportional reserves removed:
│   ├─> YES: (5/15) × 10 = 3.33 ETH
│   ├─> NO: (5/15) × 10 = 3.33 ETH
│   └─> Fees: (5/15) × 1 = 0.33 ETH
├─> LP tokens burned: 5
└─> Total received: 7 ETH
```

### LP Token Operations

#### Add Liquidity
```solidity
uint256 lpTokens = market.addLiquidity{value: 10 ether}();
```

**Requirements:**
- Market state = Active
- Minimum deposit: 0.001 ETH
- Respects current cap

#### Remove Liquidity
```solidity
uint256 ethOut = market.removeLiquidity(lpAmount);
```

**Requirements:**
- Market state = Active (only during trading)
- Sufficient LP token balance
- lpAmount > 0

#### Transfer LP Tokens (ERC20)
```solidity
// Standard ERC20 transfer
market.transfer(recipient, 5 ether);

// Approve and transferFrom
market.approve(spender, 10 ether);
market.transferFrom(owner, recipient, 5 ether);
```

#### Redeem LP Tokens (After Resolution)
```solidity
uint256 ethOut = market.redeemLPTokens();
```

**Requirements:**
- Market state = Resolved
- User has LP tokens
- Can only redeem once

### LP Token Value Calculation

**Pool Value Components:**
```
Pool Value = YES reserves + NO reserves + accumulated fees

Example:
├─> YES reserves: 10 ETH
├─> NO reserves: 12 ETH
├─> Accumulated fees: 0.8 ETH
└─> Total pool value: 22.8 ETH
```

**LP Token Price:**
```
LP token price = Pool value / Total LP supply

Example:
├─> Pool value: 22.8 ETH
├─> Total LP supply: 20 ETH
└─> 1 LP token = 22.8 / 20 = 1.14 ETH
```

### Fee Accumulation Example

```
Initial State:
├─> Pool: 10 ETH (5 YES, 5 NO)
├─> LP tokens: 10 ETH (all owned by creator)
└─> LP token value: 1.0 ETH each

After 100 ETH of trading volume:
├─> LP fees earned: 100 × 0.4% = 0.4 ETH
├─> Pool: 10 + 0.4 = 10.4 ETH
├─> LP tokens: still 10 ETH
└─> LP token value: 10.4 / 10 = 1.04 ETH each
    └─> 4% appreciation from fees!
```

---

## Fee Structure

### Total Fee: 0.5% per trade

**Split:**
```
Every trade pays 0.5% total fee
│
├─> 0.1% → Platform Fee
│   └─> Sent to TruceFactory
│       └─> Collectable by factory owner
│
└─> 0.4% → LP Fee
    └─> Stays in market contract
        └─> Increases pool value
            └─> Benefits all LP token holders
```

**Percentage Breakdown:**
- Platform gets 20% of fees (0.1% of 0.5%)
- LPs get 80% of fees (0.4% of 0.5%)

### Fee Calculation Example

#### Buying Shares
```solidity
User buys with 10 ETH:

├─> Platform fee: 10 × 0.1% = 0.01 ETH
│   └─> Sent to factory via collectFee()
│
├─> LP fee: 10 × 0.4% = 0.04 ETH
│   └─> Added to accumulatedFees
│
└─> Net amount: 10 - 0.01 - 0.04 = 9.95 ETH
    └─> Used for AMM calculation
```

#### Selling Shares
```solidity
AMM calculates payout: 5 ETH

├─> Platform fee: 5 × 0.1% = 0.005 ETH
├─> LP fee: 5 × 0.4% = 0.02 ETH
└─> User receives: 5 - 0.005 - 0.02 = 4.975 ETH
```

### Fee Flow Diagram

```
┌─────────┐
│  Trader │
└────┬────┘
     │ 10 ETH trade
     ▼
┌──────────────────────┐
│   Fee Splitting      │
├──────────────────────┤
│ Total: 0.05 ETH      │
│ ├─> 0.01 → Platform  │
│ └─> 0.04 → LP        │
└─────┬────────┬───────┘
      │        │
      ▼        ▼
┌──────────┐  ┌────────────────┐
│ Factory  │  │ Market Contract│
│          │  │ accumulatedFees│
│ Platform │  │ += 0.04 ETH    │
│ Balance  │  │                │
│ += 0.01  │  │ Pool Value ⬆   │
└──────────┘  │ LP token value⬆│
              └────────────────┘
```

### Fee Accumulation Tracking

```solidity
// State variable in TruceMarket
uint256 public accumulatedFees;

// Updated on every buy/sell
accumulatedFees += lpFee;

// Used in pool value calculation
uint256 poolValue = totalYesShares + totalNoShares + accumulatedFees;

// LPs benefit when removing liquidity
ethOut = (lpAmount * poolValue) / totalSupply();
```

### Fee Comparison with Competitors

| Platform | Total Fee | LP Share | Platform Share |
|----------|-----------|----------|----------------|
| **Truce** | **0.5%** | **0.4% (80%)** | **0.1% (20%)** |
| Polymarket | 2% | 0% | 2% |
| Augur | 1-2% | Varies | Varies |
| Omen | 2% | 0% | 2% |

**Advantages:**
- ✅ **4x lower fees** than competitors
- ✅ **80% goes to LPs** - better incentives
- ✅ **Sustainable** for platform at scale

---

## Dynamic Market Cap System

### Overview

Markets use a **dynamic cap** that grows automatically based on demand:
- ✅ **No hard maximum** - can grow indefinitely
- ✅ **Automatic growth** - triggered at 80% utilization
- ✅ **Doubles each time** - 2x multiplier
- ✅ **Rate limited** - 1 hour minimum between growth
- ✅ **Prevents manipulation** - Can't instant-dump huge trades

### How It Works

```
┌─────────────────────────────────────────────────────────┐
│               Market Cap Lifecycle                      │
└─────────────────────────────────────────────────────────┘

Initial: Cap = 10 ETH
│
├─> Reserves: 4 ETH → Utilization: 40% → No growth
├─> Reserves: 7 ETH → Utilization: 70% → No growth
├─> Reserves: 8 ETH → Utilization: 80% ✓ TRIGGER!
│   └─> Cap grows: 10 ETH → 20 ETH
│
├─> Reserves: 12 ETH → Utilization: 60% → No growth
├─> Reserves: 16 ETH → Utilization: 80% ✓ TRIGGER!
│   └─> Cap grows: 20 ETH → 40 ETH
│
└─> Process continues forever...
```

### Growth Formula

**Utilization:**
```
Utilization = (totalReserves × 10000) / currentCap

Example:
├─> Total reserves: 8 ETH
├─> Current cap: 10 ETH
└─> Utilization: (8 × 10000) / 10 = 8000 (80%)
```

**Growth Trigger:**
```
IF utilization ≥ 8000 (80%) THEN
    newCap = currentCap × growthMultiplier / 100
    newCap = currentCap × 200 / 100
    newCap = currentCap × 2
END IF
```

### Configuration Parameters

```solidity
struct MarketCap {
    uint256 currentCap;           // Current cap value
    uint256 growthMultiplier;     // 200 = 2x growth
    uint256 growthThreshold;      // 8000 = 80% utilization
    uint256 lastGrowthTime;       // Last growth timestamp
    uint256 minGrowthInterval;    // 1 hour minimum
}
```

**Defaults:**
- `growthMultiplier`: 200 (2x)
- `growthThreshold`: 8000 (80%)
- `minGrowthInterval`: 1 hour

### Growth Example Timeline

```
Time 0:00 - Market created
├─> Cap: 10 ETH
├─> Reserves: 10 ETH (5 YES, 5 NO)
└─> Utilization: 100%
    └─> Cap grows to 20 ETH

Time 0:30 - Trading happens
├─> Cap: 20 ETH
├─> Reserves: 14 ETH
└─> Utilization: 70% (no growth)

Time 1:15 - More trading
├─> Cap: 20 ETH
├─> Reserves: 16 ETH
└─> Utilization: 80%
    └─> Cap grows to 40 ETH (>1hr since last growth)

Time 1:45 - Heavy trading
├─> Cap: 40 ETH
├─> Reserves: 33 ETH
└─> Utilization: 82%
    └─> NO GROWTH (only 30 min since last growth)

Time 2:20 - Check again
├─> Cap: 40 ETH
├─> Reserves: 33 ETH
└─> Utilization: 82%
    └─> Cap grows to 80 ETH (>1hr since last growth)
```

### Growth Enforcement

**In buyShares():**
```solidity
function buyShares(Outcome _outcome) external payable {
    // Try to grow cap first
    _tryGrowCap();

    // Check cap limit
    uint256 totalReserves = totalYesShares + totalNoShares;
    require(totalReserves + msg.value <= capConfig.currentCap, "Would exceed cap");

    // ... continue with trade
}
```

**In addLiquidity():**
```solidity
function addLiquidity() external payable {
    // Try to grow cap
    _tryGrowCap();

    // Add liquidity (respects cap)
    // ...
}
```

### Cap Growth Event

```solidity
event CapIncreased(
    uint256 oldCap,
    uint256 newCap,
    string reason
);

// Example emission:
emit CapIncreased(10 ether, 20 ether, "Utilization threshold reached");
```

### Why Dynamic Caps?

**Prevents Instant Manipulation:**
```
❌ Without caps:
Whale dumps 1000 ETH instantly → Market price crashes → Manipulation

✓ With dynamic caps:
Whale tries to dump 1000 ETH:
├─> First 8 ETH accepted (80% of 10 ETH cap)
├─> Cap grows to 20 ETH
├─> Must wait 1 hour
├─> Next 16 ETH accepted (80% of 20 ETH)
├─> Must wait 1 hour
└─> Process continues... gives market time to react
```

**Allows Organic Growth:**
```
Popular market with high demand:
├─> Cap: 10 ETH → 20 ETH → 40 ETH → 80 ETH → 160 ETH...
├─> No artificial ceiling
├─> Growth matches actual demand
└─> Can reach any size needed
```

---

## Trading Mechanics

### Automated Market Maker (AMM)

Truce uses the **constant product formula**: `x × y = k`

```
YES reserves × NO reserves = k (constant)
```

This formula ensures:
- ✅ **Continuous liquidity** - Always possible to trade
- ✅ **Automatic pricing** - Price adjusts based on supply/demand
- ✅ **No order books** - No need for counterparty matching
- ✅ **Proven model** - Battle-tested by Uniswap

### Price Calculation

**Formula:**
```
YES price = NO reserves / (YES reserves + NO reserves)
NO price = YES reserves / (YES reserves + NO reserves)
```

**Properties:**
- Prices always sum to 1.0 (100%)
- Prices represent probability
- More reserves = lower price = less likely outcome

**Example:**
```
YES reserves: 3 ETH
NO reserves: 7 ETH
Total: 10 ETH

YES price = 7 / 10 = 0.7 ETH (70%)
NO price = 3 / 10 = 0.3 ETH (30%)

Interpretation: Market thinks YES is 70% likely
```

### Buying Shares

#### Process Flow

```
1. User sends ETH
   └─> msg.value = 5 ETH

2. Fees deducted
   ├─> Platform: 5 × 0.1% = 0.005 ETH → Factory
   ├─> LP: 5 × 0.4% = 0.020 ETH → accumulatedFees
   └─> Net: 5 - 0.025 = 4.975 ETH

3. AMM calculation
   ├─> Current: 5 YES, 5 NO, k = 25
   ├─> Buying YES: add to NO reserves
   ├─> New NO: 5 + 4.975 = 9.975 ETH
   ├─> New YES: 25 / 9.975 = 2.506 ETH
   └─> Shares out: 5 - 2.506 = 2.494 YES shares

4. State updated
   ├─> totalYesShares = 2.506
   ├─> totalNoShares = 9.975
   ├─> yesShares[user] += 2.494
   ├─> k = 2.506 × 9.975 = 25
   └─> tradeCount++

5. Event emitted
   └─> SharesPurchased(user, Yes, 2.494, 5 ETH)
```

#### Code Interface

```solidity
function buyShares(Outcome _outcome)
    external
    payable
    returns (uint256 sharesOut)
{
    // Implementation
}

// Usage
uint256 shares = market.buyShares{value: 10 ether}(
    ITruceMarket.Outcome.Yes
);
```

#### Requirements

| Check | Requirement |
|-------|-------------|
| Market State | Must be Active |
| Time | Before resolution deadline |
| Amount | msg.value > 0 |
| Cap | totalReserves + msg.value ≤ currentCap |

#### AMM Math for Buying

**Buying YES:**
```
Step 1: Add ETH to opposite reserve (NO)
newNoReserves = oldNoReserves + netAmount

Step 2: Calculate new YES reserves (maintain k)
newYesReserves = k / newNoReserves

Step 3: Shares out is the difference
sharesOut = oldYesReserves - newYesReserves
```

**Buying NO:**
```
Step 1: Add ETH to opposite reserve (YES)
newYesReserves = oldYesReserves + netAmount

Step 2: Calculate new NO reserves (maintain k)
newNoReserves = k / newYesReserves

Step 3: Shares out is the difference
sharesOut = oldNoReserves - newNoReserves
```

### Selling Shares

#### Process Flow

```
1. User specifies shares to sell
   └─> shares = 2 YES shares

2. Check balance
   └─> require(yesShares[user] >= 2)

3. AMM calculation
   ├─> Current: 5 YES, 5 NO
   ├─> Selling YES: remove from YES reserves
   ├─> New YES: 5 - 2 = 3 ETH
   ├─> New NO: 25 / 3 = 8.333 ETH
   └─> ETH out: 8.333 - 5 = 3.333 ETH

4. Fees deducted
   ├─> Platform: 3.333 × 0.1% = 0.003 ETH
   ├─> LP: 3.333 × 0.4% = 0.013 ETH
   └─> User gets: 3.333 - 0.016 = 3.317 ETH

5. State updated
   ├─> totalYesShares = 3
   ├─> totalNoShares = 8.333
   ├─> yesShares[user] -= 2
   ├─> accumulatedFees += 0.013
   └─> k = 3 × 8.333 = 25

6. Transfer ETH
   └─> payable(user).transfer(3.317 ETH)

7. Event emitted
   └─> SharesSold(user, Yes, 2, 3.317 ETH)
```

#### Code Interface

```solidity
function sellShares(Outcome _outcome, uint256 _shares)
    external
    returns (uint256 ethOut)
{
    // Implementation
}

// Usage
uint256 payout = market.sellShares(
    ITruceMarket.Outcome.Yes,
    5 ether  // 5 shares
);
```

#### AMM Math for Selling

**Selling YES:**
```
Step 1: Remove shares from YES reserves
newYesReserves = oldYesReserves - sharesIn

Step 2: Calculate new NO reserves (maintain k)
newNoReserves = k / newYesReserves

Step 3: ETH out is the difference in NO reserves
ethOut = newNoReserves - oldNoReserves
```

### Price Impact Examples

```
Initial State: 10 ETH per side (50/50)
├─> YES: 10 ETH, NO: 10 ETH
├─> k = 100
└─> YES price: 0.5 ETH (50%)

After buying 5 ETH of YES:
├─> YES: 6.67 ETH, NO: 15 ETH
├─> YES price: 15/21.67 = 0.69 ETH (69%)
└─> Price increased by 19%

After buying another 5 ETH of YES:
├─> YES: 4.76 ETH, NO: 21 ETH
├─> YES price: 21/25.76 = 0.82 ETH (82%)
└─> Price increased by 32% total

Interpretation: Large trades have higher price impact
```

### Slippage

**Definition:** Difference between expected price and execution price

```
Initial YES price: 0.5 ETH
User wants to buy 10 YES shares

Expected cost (at 0.5): 10 × 0.5 = 5 ETH
Actual cost (due to slippage): ~7.5 ETH
Slippage: 50%

Why? Each share purchased increases the price for the next
```

**Mitigation:**
- Split large trades into multiple smaller trades
- Wait for market to rebalance between trades
- Add more liquidity to reduce price impact

### Trading Examples

#### Example 1: Small Buy Trade
```solidity
// Market state
YES: 10 ETH, NO: 10 ETH, k = 100

// User buys YES with 1 ETH
// Net amount after fees: 0.995 ETH
uint256 shares = market.buyShares{value: 1 ether}(Outcome.Yes);

// New state
YES: 9.048 ETH
NO: 10.995 ETH
k = 99.5 (slightly less due to fees)
Shares received: ~0.952 YES shares

// Effective price: 1 / 0.952 = 1.05 ETH per share
```

#### Example 2: Selling Shares
```solidity
// Market state
YES: 5 ETH, NO: 15 ETH

// User sells 2 YES shares
uint256 payout = market.sellShares(Outcome.Yes, 2 ether);

// Calculation
// New YES: 5 + 2 = 7 ETH
// New NO: 75 / 7 = 10.714 ETH
// ETH before fees: 15 - 10.714 = 4.286 ETH
// Fees: 4.286 × 0.5% = 0.021 ETH
// Payout: 4.286 - 0.021 = 4.265 ETH
```

---

## Market Resolution & Disputes

### Resolution Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│                  Resolution Flow                        │
└─────────────────────────────────────────────────────────┘

1. ACTIVE
   ├─> Trading enabled
   ├─> Liquidity operations enabled
   └─> Before resolution deadline

2. RESOLVE (Creator action)
   ├─> resolveMarket(Outcome)
   ├─> Can only be called by creator
   ├─> Only after resolution deadline
   └─> State → PENDING_DISPUTE

3. PENDING_DISPUTE (1 day)
   ├─> Anyone can submit dispute
   ├─> Requires 0.05 ETH bond
   ├─> If disputed → DISPUTED
   └─> If no dispute → can finalize

4. DISPUTED (if dispute submitted)
   ├─> Factory owner reviews
   ├─> Calls resolveMarketDispute()
   ├─> If valid: outcome changed, bond returned
   ├─> If invalid: outcome stays, bond forfeited
   └─> Can then finalize

5. FINALIZE
   ├─> finalizeResolution()
   ├─> Can be called by anyone
   ├─> State → RESOLVED
   └─> Redemption enabled

6. RESOLVED
   ├─> redeemWinnings() for traders
   └─> redeemLPTokens() for LPs
```

### Step-by-Step Breakdown

#### 1. Resolution (Creator)

**Timing:**
- Must wait until `block.timestamp >= resolutionDeadline`
- Example: Market created for 30 days, must wait 30 days

**Code:**
```solidity
function resolveMarket(Outcome _result) external onlyCreator {
    require(state == MarketState.Active, "Market not active");
    require(block.timestamp >= resolutionDeadline, "Too early");

    result = _result;
    state = MarketState.PendingDispute;
    disputePeriodEnd = block.timestamp + DISPUTE_PERIOD;

    emit MarketResolved(_result);
}
```

**Usage:**
```solidity
// Creator resolves market as YES
market.resolveMarket(ITruceMarket.Outcome.Yes);
```

**State Changes:**
```
Before:
├─> state: Active
└─> result: undefined

After:
├─> state: PendingDispute
├─> result: Yes
├─> disputePeriodEnd: now + 1 day
└─> Anyone can dispute for next 24 hours
```

#### 2. Dispute Submission (Anyone)

**Requirements:**
- State = PendingDispute
- Within dispute period (1 day)
- Send 0.05 ETH bond
- Haven't disputed already

**Code:**
```solidity
function submitDispute(
    Outcome _proposedOutcome,
    string memory _reason
) external payable {
    require(state == MarketState.PendingDispute, "Not in dispute period");
    require(block.timestamp <= disputePeriodEnd, "Dispute period ended");
    require(msg.value >= DISPUTE_BOND, "Insufficient bond");
    require(!hasDisputed[msg.sender], "Already disputed");
    require(_proposedOutcome != result, "Same as current result");

    disputes.push(Dispute({
        disputer: msg.sender,
        bond: msg.value,
        proposedOutcome: _proposedOutcome,
        reason: _reason,
        timestamp: block.timestamp
    }));

    hasDisputed[msg.sender] = true;
    state = MarketState.Disputed;

    emit DisputeSubmitted(msg.sender, _proposedOutcome, _reason);
}
```

**Usage:**
```solidity
// User disputes resolution
market.submitDispute{value: 0.05 ether}(
    ITruceMarket.Outcome.No,
    "Evidence shows outcome was NO, not YES"
);
```

**What Happens:**
```
Dispute submitted:
├─> Bond: 0.05 ETH locked
├─> State: Disputed
├─> Dispute stored with reason
└─> Factory owner must resolve
```

#### 3. Dispute Resolution (Factory Owner)

**Authority:** Only factory owner can resolve disputes

**Code:**
```solidity
function resolveMarketDispute(address _market, bool _disputeValid)
    external
    onlyOwner
{
    require(isValidMarket[_market], "Invalid market");
    ITruceMarket market = ITruceMarket(_market);

    // Get market data
    MarketData memory data = market.getMarketData();
    require(data.state == MarketState.Disputed, "No active dispute");

    // Update reputation if needed
    if (_disputeValid) {
        creatorDisputeCount[data.creator]++;
    }

    // Resolve on market contract
    market.resolveDispute(_disputeValid);
}
```

**In Market Contract:**
```solidity
function resolveDispute(bool _disputeValid) external {
    require(msg.sender == factory, "Only factory");
    require(state == MarketState.Disputed, "No dispute");
    require(disputes.length > 0, "No disputes");

    Dispute storage dispute = disputes[disputes.length - 1];

    if (_disputeValid) {
        // Dispute was valid - change outcome
        result = dispute.proposedOutcome;
        payable(dispute.disputer).transfer(dispute.bond);
        emit DisputeResolved(true, result);
    } else {
        // Dispute was invalid - keep original
        // Bond is forfeited (stays in contract)
        emit DisputeResolved(false, result);
    }

    state = MarketState.PendingDispute;
    disputePeriodEnd = block.timestamp + DISPUTE_PERIOD;
}
```

**Outcomes:**
```
If Dispute Valid:
├─> Outcome changed to disputed outcome
├─> Bond returned to disputer
├─> Creator reputation damaged
├─> New 1-day dispute period starts
└─> State: PendingDispute

If Dispute Invalid:
├─> Original outcome maintained
├─> Bond forfeited (stays in contract)
├─> New 1-day dispute period starts
└─> State: PendingDispute
```

#### 4. Finalization (Anyone)

**Requirements:**
- State = PendingDispute
- After dispute period ends
- No active disputes

**Code:**
```solidity
function finalizeResolution() external {
    require(state == MarketState.PendingDispute, "Not pending");
    require(block.timestamp > disputePeriodEnd, "Dispute period active");

    state = MarketState.Resolved;
    emit MarketFinalized(result);
}
```

**Usage:**
```solidity
// Wait for dispute period to end
vm.warp(disputePeriodEnd + 1);

// Anyone can finalize
market.finalizeResolution();
```

#### 5. Redemption (Traders)

**Code:**
```solidity
function redeemWinnings() external returns (uint256 payout) {
    require(state == MarketState.Resolved, "Not resolved");
    require(!hasRedeemed[msg.sender], "Already redeemed");

    uint256 winningShares;
    uint256 totalWinningShares;

    if (result == Outcome.Yes) {
        winningShares = yesShares[msg.sender];
        totalWinningShares = totalYesShares;
    } else {
        winningShares = noShares[msg.sender];
        totalWinningShares = totalNoShares;
    }

    require(winningShares > 0, "No winning shares");

    uint256 totalReserves = totalYesShares + totalNoShares;
    payout = (winningShares * totalReserves) / totalWinningShares;

    hasRedeemed[msg.sender] = true;
    payable(msg.sender).transfer(payout);

    emit Redeemed(msg.sender, payout);
}
```

**Calculation:**
```
Market resolved as YES
├─> Total reserves: 20 ETH (8 YES, 12 NO)
├─> User has 2 YES shares
├─> Total YES shares: 8
└─> Payout: (2 / 8) × 20 = 5 ETH
```

#### 6. Redemption (LPs)

**Code:**
```solidity
function redeemLPTokens() external returns (uint256 payout) {
    require(state == MarketState.Resolved, "Not resolved");
    require(!hasRedeemed[msg.sender], "Already redeemed");

    uint256 userLPTokens = balanceOf(msg.sender);
    require(userLPTokens > 0, "No LP tokens");

    uint256 poolValue = totalYesShares + totalNoShares + accumulatedFees;
    payout = (userLPTokens * poolValue) / totalSupply();

    hasRedeemed[msg.sender] = true;
    _burn(msg.sender, userLPTokens);
    payable(msg.sender).transfer(payout);

    emit LPTokensRedeemed(msg.sender, payout, userLPTokens);
}
```

**Calculation:**
```
Market resolved
├─> Pool: 20 ETH reserves + 2 ETH fees = 22 ETH
├─> LP has 5 LP tokens
├─> Total supply: 10 LP tokens
└─> Payout: (5 / 10) × 22 = 11 ETH
```

### Reputation System

**Tracking:**
```solidity
mapping(address => uint256) public creatorDisputeCount;

function getCreatorReputation(address _creator)
    external
    view
    returns (
        uint256 marketsCreated,
        uint256 disputesLost,
        uint256 reputationScore
    )
{
    marketsCreated = marketsByCreator[_creator].length;
    disputesLost = creatorDisputeCount[_creator];

    reputationScore = marketsCreated > 0
        ? 100 - ((disputesLost * 100) / marketsCreated)
        : 100;
}
```

**Example:**
```
Creator A:
├─> Markets created: 10
├─> Disputes lost: 2
└─> Reputation: 100 - (2×100/10) = 80%

Creator B:
├─> Markets created: 20
├─> Disputes lost: 1
└─> Reputation: 100 - (1×100/20) = 95%
```

### Resolution Timeline Example

```
Day 0:     Market created (30-day duration)
Day 30:    Resolution deadline reached
Day 30.1:  Creator resolves as YES
           ├─> State: PendingDispute
           └─> Dispute period: 24 hours

Day 30.5:  User submits dispute (says should be NO)
           ├─> Pays 0.05 ETH bond
           └─> State: Disputed

Day 31:    Factory owner reviews evidence
           ├─> Determines dispute invalid
           ├─> Bond forfeited
           ├─> Outcome stays YES
           └─> New 24hr dispute period

Day 32.5:  No more disputes, anyone finalizes
           └─> State: Resolved

Day 32.6:  Users redeem winnings
           ├─> YES holders get payouts
           └─> LPs redeem with fees included
```

---

## Key Functions Reference

### TruceFactory Functions

#### Market Creation
```solidity
function createMarket(
    string memory _question,
    uint256 _resolutionDeadline,
    uint256 _initialLiquidity,
    MarketCategory _category
) external payable returns (address)
```
**Purpose:** Deploy new prediction market
**Access:** Public
**Payable:** Yes (initial liquidity)
**Returns:** Address of deployed market

#### Market Queries
```solidity
function getAllMarkets() external view returns (address[])
```
**Purpose:** Get all market addresses
**Returns:** Array of all market contracts

```solidity
function getMarketsByCreator(address _creator)
    external view returns (address[])
```
**Purpose:** Get markets created by specific address
**Returns:** Array of market addresses

```solidity
function getMarketsByCategory(MarketCategory _category)
    external view returns (address[])
```
**Purpose:** Get markets in specific category
**Returns:** Array of market addresses

```solidity
function getMarketCount() external view returns (uint256)
```
**Purpose:** Get total number of markets
**Returns:** Count of markets

```solidity
function isValidMarket(address _market) external view returns (bool)
```
**Purpose:** Check if address is valid market
**Returns:** True if valid market

#### Dispute Management
```solidity
function getPendingDisputes() external view returns (address[])
```
**Purpose:** Get all markets with active disputes
**Returns:** Array of disputed market addresses

```solidity
function resolveMarketDispute(address _market, bool _disputeValid)
    external onlyOwner
```
**Purpose:** Resolve dispute for a market
**Access:** Owner only
**Parameters:**
- `_market`: Market address
- `_disputeValid`: True if dispute is valid

#### Reputation
```solidity
function getCreatorReputation(address _creator)
    external view
    returns (
        uint256 marketsCreated,
        uint256 disputesLost,
        uint256 reputationScore
    )
```
**Purpose:** Get creator reputation metrics
**Returns:** Market count, dispute count, score (0-100)

#### Fee Management
```solidity
function collectFee() external payable
```
**Purpose:** Receive platform fees from markets
**Access:** Valid markets only
**Payable:** Yes

```solidity
function withdrawFees() external onlyOwner
```
**Purpose:** Withdraw accumulated platform fees
**Access:** Owner only

### TruceMarket Functions

#### Trading Functions
```solidity
function buyShares(Outcome _outcome)
    external payable
    onlyActive
    nonReentrant
    returns (uint256 sharesOut)
```
**Purpose:** Buy YES or NO shares
**Access:** Public (during Active state)
**Payable:** Yes
**Returns:** Number of shares purchased

```solidity
function sellShares(Outcome _outcome, uint256 _shares)
    external
    onlyActive
    nonReentrant
    returns (uint256 ethOut)
```
**Purpose:** Sell YES or NO shares
**Access:** Public (during Active state)
**Returns:** ETH received

#### Liquidity Functions
```solidity
function addLiquidity()
    external payable
    onlyActive
    nonReentrant
    returns (uint256 lpTokens)
```
**Purpose:** Add liquidity, receive LP tokens
**Access:** Public (during Active state)
**Payable:** Yes (min 0.001 ETH)
**Returns:** LP tokens minted

```solidity
function removeLiquidity(uint256 lpAmount)
    external
    nonReentrant
    returns (uint256 ethOut)
```
**Purpose:** Remove liquidity, burn LP tokens
**Access:** Public (during Active state)
**Requirements:** Sufficient LP token balance
**Returns:** ETH received

#### Resolution Functions
```solidity
function resolveMarket(Outcome _result)
    external
    onlyCreator
```
**Purpose:** Resolve market with outcome
**Access:** Creator only
**Requirements:** After resolution deadline

```solidity
function submitDispute(
    Outcome _proposedOutcome,
    string memory _reason
) external payable
```
**Purpose:** Dispute market resolution
**Access:** Public (during dispute period)
**Payable:** Yes (0.05 ETH bond)

```solidity
function resolveDispute(bool _disputeValid) external
```
**Purpose:** Resolve dispute (called by factory)
**Access:** Factory only

```solidity
function finalizeResolution() external
```
**Purpose:** Finalize market after dispute period
**Access:** Public
**Requirements:** Dispute period ended

#### Redemption Functions
```solidity
function redeemWinnings()
    external
    nonReentrant
    returns (uint256 payout)
```
**Purpose:** Redeem winning shares for ETH
**Access:** Public (after Resolved)
**Requirements:** Has winning shares, not redeemed
**Returns:** ETH payout

```solidity
function redeemLPTokens()
    external
    nonReentrant
    returns (uint256 payout)
```
**Purpose:** Redeem LP tokens for ETH
**Access:** Public (after Resolved)
**Requirements:** Has LP tokens, not redeemed
**Returns:** ETH payout

#### View Functions
```solidity
function getMarketData()
    external view
    returns (MarketData memory)
```
**Purpose:** Get complete market state
**Returns:** Struct with all market data

```solidity
function getUserShares(address _user)
    external view
    returns (uint256 yesShares, uint256 noShares)
```
**Purpose:** Get user's YES and NO share balances
**Returns:** YES shares, NO shares

```solidity
function getCurrentCap()
    external view
    returns (uint256)
```
**Purpose:** Get current market cap
**Returns:** Current cap value

```solidity
function getDisputes()
    external view
    returns (Dispute[] memory)
```
**Purpose:** Get all disputes for market
**Returns:** Array of dispute structs

### ERC20 Functions (LP Tokens)

```solidity
function balanceOf(address account) external view returns (uint256)
```
**Purpose:** Get LP token balance

```solidity
function transfer(address to, uint256 amount) external returns (bool)
```
**Purpose:** Transfer LP tokens

```solidity
function approve(address spender, uint256 amount) external returns (bool)
```
**Purpose:** Approve LP token spending

```solidity
function transferFrom(
    address from,
    address to,
    uint256 amount
) external returns (bool)
```
**Purpose:** Transfer LP tokens from approved account

```solidity
function totalSupply() external view returns (uint256)
```
**Purpose:** Get total LP token supply

```solidity
function allowance(address owner, address spender)
    external view returns (uint256)
```
**Purpose:** Get approved spending amount

---

## Security Features

### 1. Reentrancy Protection

**Implementation:**
```solidity
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TruceMarket is ITruceMarket, ERC20, ReentrancyGuard {

    function buyShares() external payable nonReentrant { }
    function sellShares() external nonReentrant { }
    function addLiquidity() external payable nonReentrant { }
    function removeLiquidity() external nonReentrant { }
    function redeemWinnings() external nonReentrant { }
    function redeemLPTokens() external nonReentrant { }
}
```

**Why:** Prevents reentrant calls that could drain funds or manipulate state

### 2. Checks-Effects-Interactions Pattern

**Example:**
```solidity
function sellShares(Outcome _outcome, uint256 _shares) external {
    // 1. CHECKS
    require(_shares > 0, "Must sell positive shares");
    require(yesShares[msg.sender] >= _shares, "Insufficient shares");

    // 2. EFFECTS (state changes)
    yesShares[msg.sender] -= _shares;
    totalYesShares -= sharesRemoved;
    totalNoShares += ethAmount;
    accumulatedFees += lpFee;
    k = totalYesShares * totalNoShares;

    // 3. INTERACTIONS (external calls)
    ITruceFactory(factory).collectFee{value: platformFee}();
    payable(msg.sender).transfer(netPayout);
}
```

**Why:** Ensures state is updated before external calls

### 3. Inflation Attack Prevention

**Implementation:**
```solidity
uint256 private constant MIN_LIQUIDITY = 10**3;
address private constant DEAD_ADDRESS = 0x...dEaD;

constructor() {
    // Burn minimum liquidity
    _mint(DEAD_ADDRESS, MIN_LIQUIDITY);
    _mint(creator, initialLiquidity - MIN_LIQUIDITY);
}
```

**Attack Prevented:**
```
Without MIN_LIQUIDITY burn:
1. Attacker creates market with 1 wei
2. Mints 1 LP token
3. Donates 1000 ETH to pool
4. LP token now worth 1000 ETH
5. New LP adds 10 ETH
6. Gets (10 * 1) / 1000 = 0.01 LP tokens (rounds to 0!)
7. Attacker steals their deposit

With MIN_LIQUIDITY burn:
1. Attacker creates market with 1000 wei minimum
2. Always meaningful total supply
3. Rounding exploits prevented
```

### 4. Access Controls

**Modifiers:**
```solidity
modifier onlyCreator() {
    require(msg.sender == creator, "Not creator");
    _;
}

modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
}

modifier onlyActive() {
    require(state == MarketState.Active, "Market not active");
    require(block.timestamp < resolutionDeadline, "Market expired");
    _;
}
```

**Usage:**
- `resolveMarket()` - Only creator
- `resolveMarketDispute()` - Only factory owner
- `buyShares()`, `sellShares()` - Only during Active state

### 5. Input Validation

**Examples:**
```solidity
// Non-zero amounts
require(msg.value > 0, "Must send ETH");
require(_shares > 0, "Must sell positive shares");

// Sufficient balances
require(yesShares[msg.sender] >= _shares, "Insufficient shares");
require(balanceOf(msg.sender) >= lpAmount, "Insufficient LP tokens");

// Time constraints
require(
    _resolutionDeadline > block.timestamp + MIN_RESOLUTION_TIME,
    "Resolution too soon"
);

// Cap enforcement
require(
    totalReserves + msg.value <= capConfig.currentCap,
    "Would exceed cap"
);

// Bond requirements
require(msg.value >= DISPUTE_BOND, "Insufficient bond");

// Valid outcomes
require(_proposedOutcome != result, "Same as current result");
```

### 6. Safe Math

**Automatic in Solidity 0.8+:**
```solidity
pragma solidity ^0.8.19;

// Automatic overflow/underflow protection
uint256 result = a + b;  // Reverts on overflow
uint256 result = a - b;  // Reverts on underflow
uint256 result = a * b;  // Reverts on overflow
```

**Division by Zero Protection:**
```solidity
// In TruceAMM library
if (yesReserves == 0 || noReserves == 0) {
    revert InsufficientLiquidity();
}

uint256 k = yesReserves * noReserves;
uint256 newYesReserves = k / newNoReserves;  // Safe, checked above
```

### 7. State Machine Protection

**State Transitions:**
```
Active → PendingDispute → Disputed → PendingDispute → Resolved
   ↓
Cancelled (unused)

Each function checks required state:
- buyShares(): requires Active
- resolveMarket(): requires Active
- submitDispute(): requires PendingDispute
- redeemWinnings(): requires Resolved
```

### 8. Oracle-Free Design

**No external dependencies:**
- ✅ Market resolution by creator (incentivized to be honest)
- ✅ Dispute mechanism for verification
- ✅ No reliance on price feeds or external data
- ✅ Community governance via disputes

### 9. Pausability (Factory Level)

**Owner Controls:**
```solidity
// Factory owner can:
- Resolve disputes
- Withdraw platform fees
- Deploy new markets (permissionless)

// Factory owner CANNOT:
- Pause trading
- Seize user funds
- Change market outcomes directly
- Modify market parameters
```

### 10. Known Limitations

**Front-Running:**
- ⚠️ Trades can be front-run due to public mempool
- Mitigation: Use private RPCs or flashbots
- Impact: Moderate (inherent to blockchain)

**MEV Extraction:**
- ⚠️ Sandwich attacks possible on large trades
- Mitigation: Split large trades, use MEV protection
- Impact: Moderate (affects all AMMs)

**Creator Manipulation:**
- ⚠️ Malicious creator could resolve incorrectly
- Mitigation: Dispute mechanism, reputation system
- Impact: Low (0.05 ETH bond incentivizes disputes)

---

## Constants & Parameters

### Fee Constants
```solidity
uint256 private constant PLATFORM_FEE = 10;      // 0.1% (10 basis points)
uint256 private constant LP_FEE = 40;            // 0.4% (40 basis points)
uint256 private constant TOTAL_FEE = 50;         // 0.5% (50 basis points)
uint256 private constant BASIS_POINTS = 10000;   // Denominator
```

### Liquidity Constants
```solidity
uint256 private constant MIN_LIQUIDITY = 10**3;  // 1000 wei
address private constant DEAD_ADDRESS = 0x000000000000000000000000000000000000dEaD;
```

### Cap Growth Constants
```solidity
uint256 private constant DEFAULT_GROWTH_MULTIPLIER = 200;      // 2x (200%)
uint256 private constant DEFAULT_GROWTH_THRESHOLD = 8000;      // 80% (8000/10000)
uint256 private constant DEFAULT_MIN_GROWTH_INTERVAL = 1 hours;
```

### Resolution Constants
```solidity
uint256 private constant DISPUTE_PERIOD = 1 days;
uint256 private constant DISPUTE_BOND = 0.05 ether;
uint256 private constant MIN_RESOLUTION_TIME = 1 hours;
uint256 private constant MAX_RESOLUTION_TIME = 365 days;
```

### Summary Table

| Constant | Value | Description |
|----------|-------|-------------|
| **PLATFORM_FEE** | 10 bp (0.1%) | Factory fee per trade |
| **LP_FEE** | 40 bp (0.4%) | Liquidity provider fee |
| **TOTAL_FEE** | 50 bp (0.5%) | Combined fee |
| **MIN_LIQUIDITY** | 1000 wei | Burned on init (inflation protection) |
| **DEAD_ADDRESS** | 0x...dEaD | Where MIN_LIQUIDITY sent |
| **GROWTH_MULTIPLIER** | 200% | Cap doubles when triggered |
| **GROWTH_THRESHOLD** | 80% | Utilization trigger for growth |
| **MIN_GROWTH_INTERVAL** | 1 hour | Cooldown between cap increases |
| **DISPUTE_PERIOD** | 1 day | Time window to submit disputes |
| **DISPUTE_BOND** | 0.05 ETH | Required to dispute resolution |
| **MIN_RESOLUTION_TIME** | 1 hour | Minimum market duration |
| **MAX_RESOLUTION_TIME** | 365 days | Maximum market duration |

---

## Usage Examples

### Example 1: Complete Market Lifecycle

```solidity
// ========== SETUP ==========
TruceFactory factory = new TruceFactory();
address creator = address(0x1);
address trader1 = address(0x2);
address trader2 = address(0x3);
address lp = address(0x4);

// Fund accounts
vm.deal(creator, 100 ether);
vm.deal(trader1, 50 ether);
vm.deal(trader2, 50 ether);
vm.deal(lp, 50 ether);

// ========== CREATE MARKET ==========
vm.prank(creator);
address market = factory.createMarket{value: 10 ether}(
    "Will ETH hit $10k in 2025?",
    block.timestamp + 30 days,
    10 ether,
    ITruceFactory.MarketCategory.CRYPTO
);

ITruceMarket marketContract = ITruceMarket(market);

// Creator has LP tokens (not YES/NO shares)
uint256 creatorLP = TruceMarket(payable(market)).balanceOf(creator);
// creatorLP = 9.999999999999999 ETH

// ========== ADD LIQUIDITY ==========
vm.prank(lp);
uint256 lpTokens = marketContract.addLiquidity{value: 10 ether}();
// lpTokens = ~9.52 ETH (proportional to pool value)

// ========== TRADING ==========
// Trader1 buys YES
vm.prank(trader1);
uint256 yesShares = marketContract.buyShares{value: 5 ether}(
    ITruceMarket.Outcome.Yes
);
// yesShares = ~2.49 shares (after fees)

// Trader2 buys NO
vm.prank(trader2);
uint256 noShares = marketContract.buyShares{value: 3 ether}(
    ITruceMarket.Outcome.No
);
// noShares = ~1.44 shares

// Trader1 sells some YES
vm.prank(trader1);
uint256 ethBack = marketContract.sellShares(
    ITruceMarket.Outcome.Yes,
    1 ether // 1 share
);
// ethBack = ~2.1 ETH (depends on current reserves)

// ========== WAIT FOR DEADLINE ==========
vm.warp(block.timestamp + 31 days);

// ========== RESOLVE ==========
vm.prank(creator);
marketContract.resolveMarket(ITruceMarket.Outcome.Yes);
// State: PendingDispute

// ========== DISPUTE (OPTIONAL) ==========
// Trader2 disagrees, submits dispute
vm.prank(trader2);
marketContract.submitDispute{value: 0.05 ether}(
    ITruceMarket.Outcome.No,
    "Evidence shows NO outcome"
);
// State: Disputed

// Factory owner reviews and rejects dispute
factory.resolveMarketDispute(market, false);
// Outcome stays YES, bond forfeited
// State: PendingDispute

// ========== FINALIZE ==========
vm.warp(block.timestamp + 2 days);
marketContract.finalizeResolution();
// State: Resolved

// ========== REDEEM WINNINGS ==========
// Trader1 redeems (has YES shares, YES won)
vm.prank(trader1);
uint256 payout1 = marketContract.redeemWinnings();
// payout1 = proportional share of total reserves

// LP redeems LP tokens
vm.prank(lp);
uint256 lpPayout = marketContract.redeemLPTokens();
// lpPayout = proportional share including fees
```

### Example 2: Liquidity Provider Strategy

```solidity
// Create market with initial liquidity
vm.prank(creator);
address market = factory.createMarket{value: 50 ether}(
    "Will Bitcoin reach $100k?",
    block.timestamp + 90 days,
    50 ether,
    ITruceFactory.MarketCategory.CRYPTO
);

TruceMarket marketContract = TruceMarket(payable(market));

// Check initial LP tokens
uint256 initialLP = marketContract.balanceOf(creator);
// = 49.999999999999999 ETH

// Add more liquidity
vm.prank(creator);
uint256 newLP = marketContract.addLiquidity{value: 50 ether}();
// newLP = ~50 ETH (pool doubled)

// Total LP tokens now = ~100 ETH
uint256 totalLP = marketContract.balanceOf(creator);

// Transfer some LP tokens to another user
vm.prank(creator);
marketContract.transfer(lp1, 25 ether);

// LP1 can now remove liquidity
vm.prank(lp1);
uint256 ethOut = marketContract.removeLiquidity(25 ether);
// Gets proportional ETH back

// Or LP1 can hold until after resolution to get fees
```

### Example 3: Arbitrage Trading

```solidity
// Market state: YES price = 0.3, NO price = 0.7
// Trader believes YES should be 0.5

// Buy undervalued YES shares
vm.prank(arbitrageur);
uint256 yesShares = marketContract.buyShares{value: 10 ether}(
    ITruceMarket.Outcome.Yes
);

// Price moves: YES now 0.4, NO now 0.6

// Buy more YES
vm.prank(arbitrageur);
marketContract.buyShares{value: 10 ether}(ITruceMarket.Outcome.Yes);

// Price moves: YES now 0.5, NO now 0.5 (balanced)

// If confident, hold until resolution
// If hedging, sell some now
vm.prank(arbitrageur);
marketContract.sellShares(ITruceMarket.Outcome.Yes, 5 ether);
```

### Example 4: Market Growth

```solidity
// Market starts with 10 ETH cap
address market = factory.createMarket{value: 10 ether}(
    "Question",
    block.timestamp + 30 days,
    10 ether,
    ITruceFactory.MarketCategory.CRYPTO
);

ITruceMarket m = ITruceMarket(market);

// Initial cap = 10 ETH
assert(m.getCurrentCap() == 10 ether);

// Trade up to 80% utilization (8 ETH total reserves)
// This will trigger automatic growth

// Cap grows to 20 ETH
assert(m.getCurrentCap() == 20 ether);

// Continue trading...
// Cap grows to 40 ETH, then 80 ETH, then 160 ETH...
// No limit!
```

### Example 5: Dispute Scenario

```solidity
// Create and resolve market
vm.prank(creator);
address market = factory.createMarket{value: 10 ether}(
    "Will X happen?",
    block.timestamp + 7 days,
    10 ether,
    ITruceFactory.MarketCategory.OTHER
);

// Wait and resolve
vm.warp(block.timestamp + 8 days);
vm.prank(creator);
ITruceMarket(market).resolveMarket(ITruceMarket.Outcome.Yes);

// User disagrees and disputes
vm.prank(disputer);
ITruceMarket(market).submitDispute{value: 0.05 ether}(
    ITruceMarket.Outcome.No,
    "Clear evidence shows NO outcome, not YES"
);

// Factory owner reviews dispute
// Checks evidence, determines dispute is valid
factory.resolveMarketDispute(market, true);

// Result:
// - Outcome changed to NO
// - Disputer gets bond back
// - Creator loses reputation
// - New dispute period begins
```

---

## Gas Optimization Tips

1. **Batch operations**: Combine multiple trades when possible
2. **Remove liquidity during Active**: Cheaper than redeeming after resolution
3. **Avoid tiny trades**: Fixed gas costs make small trades expensive
4. **Transfer LP tokens**: Instead of removing and re-adding liquidity
5. **Let markets grow**: Wait for cap growth instead of hitting limits

---

## Development & Testing

**Framework:** Foundry
**Solidity Version:** ^0.8.19
**Dependencies:** OpenZeppelin Contracts v5.4.0

**Run tests:**
```bash
forge test -vv
```

**Deploy:**
```bash
forge create src/TruceFactory.sol:TruceFactory --private-key $PRIVATE_KEY
```

---

## License

MIT License

---

## Contract Addresses

*Mainnet addresses will be added after deployment*

**Testnet (Sepolia):**
- Factory: TBD
- Example Market: TBD

---

## Additional Resources

- [Uniswap V2 Whitepaper](https://uniswap.org/whitepaper.pdf) - AMM design inspiration
- [Polymarket](https://polymarket.com) - Prediction market competitor
- [Augur](https://augur.net) - Decentralized prediction market protocol
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts) - Security standards

---

*Last Updated: 2025*
