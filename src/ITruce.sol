// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// ========== ITruce.sol ==========
interface ITruce {
    enum MarketState { Active, Resolved, Cancelled }
    enum Outcome { Yes, No }
    
    struct Market {
        string question;
        address creator;
        uint256 createdAt;
        uint256 resolutionDeadline;
        MarketState state;
        Outcome result;
        uint256 totalYesShares;
        uint256 totalNoShares;
        uint256 k; // Constant product invariant
    }
    
    event MarketCreated(uint256 indexed marketId, string question, address indexed creator);
    event SharesPurchased(uint256 indexed marketId, address indexed buyer, Outcome outcome, uint256 shares, uint256 cost);
    event SharesSold(uint256 indexed marketId, address indexed seller, Outcome outcome, uint256 shares, uint256 payout);
    event MarketResolved(uint256 indexed marketId, Outcome result);
    event MarketCancelled(uint256 indexed marketId);
    event Redeemed(uint256 indexed marketId, address indexed user, uint256 amount);
    
    function createMarket(string memory _question, uint256 _resolutionDeadline, uint256 _initialLiquidity) external payable returns (uint256);
    function buyShares(uint256 _marketId, Outcome _outcome, uint256 _maxCost) external payable returns (uint256);
    function sellShares(uint256 _marketId, Outcome _outcome, uint256 _shares, uint256 _minPayout) external returns (uint256);
    function resolveMarket(uint256 _marketId, Outcome _result) external;
    function redeemWinnings(uint256 _marketId) external returns (uint256);
    function getMarket(uint256 _marketId) external view returns (Market memory);
    function getSharePrice(uint256 _marketId, Outcome _outcome, uint256 _shares) external view returns (uint256);
    function getUserShares(uint256 _marketId, address _user) external view returns (uint256 yesShares, uint256 noShares);
}