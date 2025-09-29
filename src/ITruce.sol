// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// ========== ITruce.sol ==========
interface ITruceMarket {
    enum MarketState {
        Active,
        Resolved,
        Cancelled
    }
    enum Outcome {
        Yes,
        No
    }

    struct MarketCap {
        uint256 currentCap;
        uint256 growthMultiplier;
        uint256 growthThreshold;
        uint256 maxCap;
        uint256 lastGrowthTime;
        uint256 minGrowthInterval;
    }

    struct MarketData {
        string question;
        address creator;
        address factory;
        uint256 createdAt;
        uint256 resolutionDeadline;
        MarketState state;
        Outcome result;
        uint256 totalYesShares;
        uint256 totalNoShares;
        uint256 k;
        uint256 tradeCount;
        MarketCap capConfig;
    }

    event SharesPurchased(address indexed buyer, Outcome outcome, uint256 shares, uint256 cost);
    event SharesSold(address indexed seller, Outcome outcome, uint256 shares, uint256 payout);
    event LiquidityAdded(address indexed provider, uint256 amount);
    event MarketResolved(Outcome result);
    event Redeemed(address indexed user, uint256 amount);
    event CapIncreased(uint256 oldCap, uint256 newCap, string reason);

    function buyShares(Outcome _outcome) external payable returns (uint256);
    function sellShares(Outcome _outcome, uint256 _shares) external returns (uint256);
    function addLiquidity() external payable;
    function resolveMarket(Outcome _result) external;
    function redeemWinnings() external returns (uint256);
    function getMarketData() external view returns (MarketData memory);
    function getUserShares(address _user) external view returns (uint256, uint256);
    function getCurrentCap() external view returns (uint256);
}
