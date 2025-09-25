// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ITruce.sol";
import "./TruceAMM.sol";

contract Truce is ITruce {
    using TruceAMM for uint256;
    
    uint256 private constant MIN_RESOLUTION_TIME = 1 hours;
    uint256 private constant MAX_RESOLUTION_TIME = 365 days;
    uint256 private constant PLATFORM_FEE = 200; // 2% in basis points
    uint256 private constant BASIS_POINTS = 10000;
    
    uint256 public nextMarketId;
    address public owner;
    uint256 public totalPlatformFees;
    
    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => uint256)) public yesShares;
    mapping(uint256 => mapping(address => uint256)) public noShares;
    mapping(uint256 => bool) public hasRedeemed;
    
    modifier onlyMarketCreator(uint256 _marketId) {
        require(markets[_marketId].creator == msg.sender, "Not market creator");
        _;
    }
    
    modifier marketExists(uint256 _marketId) {
        require(_marketId < nextMarketId, "Market does not exist");
        _;
    }
    
    modifier marketActive(uint256 _marketId) {
        require(markets[_marketId].state == MarketState.Active, "Market not active");
        require(block.timestamp < markets[_marketId].resolutionDeadline, "Market expired");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Create a new truce market
     */
    function createMarket(
        string memory _question,
        uint256 _resolutionDeadline,
        uint256 _initialLiquidity
    ) external payable override returns (uint256) {
        require(bytes(_question).length > 0, "Empty question");
        require(_resolutionDeadline > block.timestamp + MIN_RESOLUTION_TIME, "Resolution too soon");
        require(_resolutionDeadline < block.timestamp + MAX_RESOLUTION_TIME, "Resolution too late");
        require(_initialLiquidity > 0, "Need initial liquidity");
        require(msg.value >= _initialLiquidity, "Insufficient ETH for liquidity");
        
        uint256 marketId = nextMarketId++;
        
        markets[marketId] = Market({
            question: _question,
            creator: msg.sender,
            createdAt: block.timestamp,
            resolutionDeadline: _resolutionDeadline,
            state: MarketState.Active,
            result: Outcome.Yes, // Default, will be set on resolution
            totalYesShares: _initialLiquidity,
            totalNoShares: _initialLiquidity,
            k: _initialLiquidity * _initialLiquidity
        });
        
        // Give initial shares to creator
        yesShares[marketId][msg.sender] = _initialLiquidity / 2;
        noShares[marketId][msg.sender] = _initialLiquidity / 2;
        
        // Refund excess ETH
        if (msg.value > _initialLiquidity) {
            payable(msg.sender).transfer(msg.value - _initialLiquidity);
        }
        
        emit MarketCreated(marketId, _question, msg.sender);
        
        return marketId;
    }
    
    /**
     * @dev Buy outcome shares using constant product AMM
     */
    function buyShares(
        uint256 _marketId,
        Outcome _outcome,
        uint256 _maxCost
    ) external payable override marketExists(_marketId) marketActive(_marketId) returns (uint256) {
        require(msg.value > 0, "Must send ETH");
        require(msg.value <= _maxCost, "Cost exceeds maximum");
        
        Market storage market = markets[_marketId];
        
        uint256 sharesOut = TruceAMM.calculateSharesOut(
            market.totalYesShares,
            market.totalNoShares,
            msg.value,
            _outcome
        );
        
        // Take platform fee
        uint256 fee = (msg.value * PLATFORM_FEE) / BASIS_POINTS;
        uint256 netAmount = msg.value - fee;
        totalPlatformFees += fee;
        
        // Update reserves and user shares
        if (_outcome == Outcome.Yes) {
            market.totalYesShares += sharesOut;
            market.totalNoShares += (netAmount - sharesOut);
            yesShares[_marketId][msg.sender] += sharesOut;
        } else {
            market.totalNoShares += sharesOut;
            market.totalYesShares += (netAmount - sharesOut);
            noShares[_marketId][msg.sender] += sharesOut;
        }
        
        // Update constant product invariant
        market.k = market.totalYesShares * market.totalNoShares;
        
        emit SharesPurchased(_marketId, msg.sender, _outcome, sharesOut, msg.value);
        
        return sharesOut;
    }
    
    /**
     * @dev Sell outcome shares back to the AMM
     */
    function sellShares(
        uint256 _marketId,
        Outcome _outcome,
        uint256 _shares,
        uint256 _minPayout
    ) external override marketExists(_marketId) marketActive(_marketId) returns (uint256) {
        require(_shares > 0, "Must sell positive shares");
        
        Market storage market = markets[_marketId];
        
        // Check user has enough shares
        if (_outcome == Outcome.Yes) {
            require(yesShares[_marketId][msg.sender] >= _shares, "Insufficient YES shares");
        } else {
            require(noShares[_marketId][msg.sender] >= _shares, "Insufficient NO shares");
        }
        
        uint256 ethOut = TruceAMM.calculateEthOut(
            market.totalYesShares,
            market.totalNoShares,
            _shares,
            _outcome
        );
        
        require(ethOut >= _minPayout, "Payout below minimum");
        
        // Take platform fee
        uint256 fee = (ethOut * PLATFORM_FEE) / BASIS_POINTS;
        uint256 netPayout = ethOut - fee;
        totalPlatformFees += fee;
        
        // Update reserves and user shares
        if (_outcome == Outcome.Yes) {
            market.totalYesShares -= _shares;
            yesShares[_marketId][msg.sender] -= _shares;
        } else {
            market.totalNoShares -= _shares;
            noShares[_marketId][msg.sender] -= _shares;
        }
        
        // Update constant product invariant
        market.k = market.totalYesShares * market.totalNoShares;
        
        // Send payout
        payable(msg.sender).transfer(netPayout);
        
        emit SharesSold(_marketId, msg.sender, _outcome, _shares, netPayout);
        
        return netPayout;
    }
    
    /**
     * @dev Resolve market (only creator can do this in v1)
     */
    function resolveMarket(
        uint256 _marketId,
        Outcome _result
    ) external override marketExists(_marketId) onlyMarketCreator(_marketId) {
        Market storage market = markets[_marketId];
        require(market.state == MarketState.Active, "Market not active");
        require(block.timestamp >= market.resolutionDeadline, "Too early to resolve");
        
        market.state = MarketState.Resolved;
        market.result = _result;
        
        emit MarketResolved(_marketId, _result);
    }
    
    /**
     * @dev Redeem winnings after market resolution
     */
    function redeemWinnings(uint256 _marketId) external override marketExists(_marketId) returns (uint256) {
        Market storage market = markets[_marketId];
        require(market.state == MarketState.Resolved, "Market not resolved");
        require(!hasRedeemed[_marketId], "Already redeemed");
        
        uint256 winningShares;
        if (market.result == Outcome.Yes) {
            winningShares = yesShares[_marketId][msg.sender];
            yesShares[_marketId][msg.sender] = 0;
        } else {
            winningShares = noShares[_marketId][msg.sender];
            noShares[_marketId][msg.sender] = 0;
        }
        
        require(winningShares > 0, "No winning shares");
        
        // Calculate payout: winning shares get proportional share of losing side's reserves
        uint256 totalWinningShares = market.result == Outcome.Yes ? 
            market.totalYesShares : market.totalNoShares;
        uint256 totalLosingReserves = market.result == Outcome.Yes ? 
            market.totalNoShares : market.totalYesShares;
            
        uint256 payout = (winningShares * totalLosingReserves) / totalWinningShares;
        
        hasRedeemed[_marketId] = true;
        payable(msg.sender).transfer(payout);
        
        emit Redeemed(_marketId, msg.sender, payout);
        
        return payout;
    }
    
    /**
     * @dev Get market information
     */
    function getMarket(uint256 _marketId) external view override marketExists(_marketId) returns (Market memory) {
        return markets[_marketId];
    }
    
    /**
     * @dev Get current price for buying shares
     */
    function getSharePrice(
        uint256 _marketId,
        Outcome _outcome,
        uint256 _shares
    ) external view override marketExists(_marketId) returns (uint256) {
        Market storage market = markets[_marketId];
        
        if (_shares == 0) {
            return TruceAMM.getPrice(
                market.totalYesShares,
                market.totalNoShares,
                _outcome
            );
        }
        
        // For specific share amount, calculate the cost
        return TruceAMM.calculateSharesOut(
            market.totalYesShares,
            market.totalNoShares,
            _shares,
            _outcome
        );
    }
    
    /**
     * @dev Get user's share balances
     */
    function getUserShares(
        uint256 _marketId,
        address _user
    ) external view override marketExists(_marketId) returns (uint256, uint256) {
        return (yesShares[_marketId][_user], noShares[_marketId][_user]);
    }
    
    /**
     * @dev Owner functions
     */
    function withdrawFees() external {
        require(msg.sender == owner, "Not owner");
        uint256 amount = totalPlatformFees;
        totalPlatformFees = 0;
        payable(owner).transfer(amount);
    }
    
    receive() external payable {
        // Allow contract to receive ETH
    }
}
