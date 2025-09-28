// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// ========== ITruce.sol ==========
interface ITruce {
   enum MarketState { Active, Resolved, Cancelled }
    enum Outcome { Yes, No }
    enum MarketCategory { CRYPTO, SPORTS, POLITICS, WEATHER, ENTERTAINMENT, OTHER }
    
    struct MarketCap {
        uint256 currentCap;        // Current maximum liquidity allowed
        uint256 growthMultiplier;  // Multiplier for growth (e.g., 200 = 2x)
        uint256 growthThreshold;   // Percentage threshold to trigger growth (e.g., 80 = 80%)
        uint256 maxCap;            // Absolute maximum cap
        uint256 lastGrowthTime;    // Last time cap was increased
        uint256 minGrowthInterval; // Minimum time between growth events
    }
    
    struct Market {
        string question;
        address creator;
        uint256 createdAt;
        uint256 resolutionDeadline;
        MarketState state;
        Outcome result;
        uint256 totalYesShares;
        uint256 totalNoShares;
        uint256 k;
        MarketCategory category;
        MarketCap capConfig;
        uint256 tradeCount;        // Track market activity
    }
    
    event MarketCreated(uint256 indexed marketId, string question, address indexed creator, MarketCategory category);
    event SharesPurchased(uint256 indexed marketId, address indexed buyer, Outcome outcome, uint256 shares, uint256 cost, uint256 slippage);
    event SharesSold(uint256 indexed marketId, address indexed seller, Outcome outcome, uint256 shares, uint256 payout);
    event MarketResolved(uint256 indexed marketId, Outcome result);
    event Redeemed(uint256 indexed marketId, address indexed user, uint256 amount);
    event CapIncreased(uint256 indexed marketId, uint256 oldCap, uint256 newCap, string reason);
    
    function createMarket(
        string memory _question, 
        uint256 _resolutionDeadline, 
        uint256 _initialLiquidity,
        MarketCategory _category
    ) external payable returns (uint256);
    
    function buyShares(uint256 _marketId, Outcome _outcome, uint256 _maxCost) external payable returns (uint256);
    function sellShares(uint256 _marketId, Outcome _outcome, uint256 _shares, uint256 _minPayout) external returns (uint256);
    function getExpectedSlippage(uint256 _marketId, Outcome _outcome, uint256 _ethAmount) external view returns (uint256);
    function getCurrentCap(uint256 _marketId) external view returns (uint256);
    function canGrowCap(uint256 _marketId) external view returns (bool, string memory);
}
