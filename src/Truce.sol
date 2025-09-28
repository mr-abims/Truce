// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ITruce.sol";
import "./TruceAMM.sol";

contract Truce is ITruce {
    using TruceAMM for uint256;
    
    uint256 private constant MIN_RESOLUTION_TIME = 1 hours;
    uint256 private constant MAX_RESOLUTION_TIME = 365 days;
    uint256 private constant PLATFORM_FEE = 200; // 2%
    uint256 private constant BASIS_POINTS = 10000;
    
    // Dynamic cap defaults
    uint256 private constant DEFAULT_GROWTH_MULTIPLIER = 200; // 2x growth
    uint256 private constant DEFAULT_GROWTH_THRESHOLD = 8000; // 80% utilization
    uint256 private constant DEFAULT_MIN_GROWTH_INTERVAL = 1 hours;
    
    mapping(MarketCategory => uint256) public categoryMaxCaps;
    
    uint256 public nextMarketId;
    address public owner;
    uint256 public totalPlatformFees;
    
    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => uint256)) public yesShares;
    mapping(uint256 => mapping(address => uint256)) public noShares;
    mapping(uint256 => mapping(address => bool)) public hasRedeemed;
    
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
        
        // Set ONLY maximum caps per category (no base caps!)
        categoryMaxCaps[MarketCategory.CRYPTO] = 1000 ether;
        categoryMaxCaps[MarketCategory.SPORTS] = 500 ether;
        categoryMaxCaps[MarketCategory.POLITICS] = 2000 ether;
        categoryMaxCaps[MarketCategory.WEATHER] = 100 ether;
        categoryMaxCaps[MarketCategory.ENTERTAINMENT] = 300 ether;
        categoryMaxCaps[MarketCategory.OTHER] = 200 ether;
    }
    
    /**
     * @dev Create market - cap starts at user's initial liquidity
     */
    function createMarket(
        string memory _question,
        uint256 _resolutionDeadline,
        uint256 _initialLiquidity,
        MarketCategory _category
    ) external payable override returns (uint256) {
        require(bytes(_question).length > 0, "Empty question");
        require(_resolutionDeadline > block.timestamp + MIN_RESOLUTION_TIME, "Resolution too soon");
        require(_resolutionDeadline < block.timestamp + MAX_RESOLUTION_TIME, "Resolution too late");
        require(_initialLiquidity > 0, "Need initial liquidity");
        require(msg.value >= _initialLiquidity, "Insufficient ETH");
        
        uint256 maxCap = categoryMaxCaps[_category];
        require(_initialLiquidity <= maxCap, "Initial liquidity exceeds max cap");
        
        uint256 marketId = nextMarketId++;
        
        // Cap starts at exactly what user provides!
        uint256 startingCap = _initialLiquidity;
        
        markets[marketId] = Market({
            question: _question,
            creator: msg.sender,
            createdAt: block.timestamp,
            resolutionDeadline: _resolutionDeadline,
            state: MarketState.Active,
            result: Outcome.Yes,
            totalYesShares: _initialLiquidity,
            totalNoShares: _initialLiquidity,
            k: _initialLiquidity * _initialLiquidity,
            category: _category,
            capConfig: MarketCap({
                currentCap: startingCap,           // Starts at user's liquidity
                growthMultiplier: DEFAULT_GROWTH_MULTIPLIER,
                growthThreshold: DEFAULT_GROWTH_THRESHOLD,
                maxCap: maxCap,
                lastGrowthTime: block.timestamp,
                minGrowthInterval: DEFAULT_MIN_GROWTH_INTERVAL
            }),
            tradeCount: 0
        });
        
        // Give initial shares to creator
        yesShares[marketId][msg.sender] = _initialLiquidity / 2;
        noShares[marketId][msg.sender] = _initialLiquidity / 2;
        
        // Refund excess
        if (msg.value > _initialLiquidity) {
            payable(msg.sender).transfer(msg.value - _initialLiquidity);
        }
        
        emit MarketCreated(marketId, _question, msg.sender, _category);
        
        return marketId;
    }
    
    /**
     * @dev Buy shares with automatic cap growth checking
     */
    function buyShares(
        uint256 _marketId,
        Outcome _outcome,
        uint256 _maxCost
    ) external payable override marketExists(_marketId) marketActive(_marketId) returns (uint256) {
        require(msg.value > 0, "Must send ETH");
        require(msg.value <= _maxCost, "Cost exceeds maximum");
        
        Market storage market = markets[_marketId];
        
        // Check if we should grow the cap before this trade
        _tryGrowCap(_marketId);
        
        // Calculate expected slippage
        uint256 slippage = TruceAMM.calculateSlippage(
            market.totalYesShares,
            market.totalNoShares,
            msg.value,
            _outcome
        );
        
        // Calculate shares with cap checking
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
        
        // Update reserves
        if (_outcome == Outcome.Yes) {
            market.totalYesShares += sharesOut;
            market.totalNoShares += (netAmount - sharesOut);
            yesShares[_marketId][msg.sender] += sharesOut;
        } else {
            market.totalNoShares += sharesOut;
            market.totalYesShares += (netAmount - sharesOut);
            noShares[_marketId][msg.sender] += sharesOut;
        }
        
        // Update invariant and trade count
        market.k = market.totalYesShares * market.totalNoShares;
        market.tradeCount++;
        
        emit SharesPurchased(_marketId, msg.sender, _outcome, sharesOut, msg.value, slippage);
        
        return sharesOut;
    }
    
    /**
     * @dev Sell shares back to pool
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
        
        // Update reserves
        if (_outcome == Outcome.Yes) {
            market.totalYesShares -= _shares;
            yesShares[_marketId][msg.sender] -= _shares;
        } else {
            market.totalNoShares -= _shares;
            noShares[_marketId][msg.sender] -= _shares;
        }
        
        // Update invariant
        market.k = market.totalYesShares * market.totalNoShares;
        market.tradeCount++;
        
        // Send payout
        payable(msg.sender).transfer(netPayout);
        
        emit SharesSold(_marketId, msg.sender, _outcome, _shares, netPayout);
        
        return netPayout;
    }
    
    /**
     * @dev Internal function to check and grow cap if conditions are met
     */
    function _tryGrowCap(uint256 _marketId) internal {
        Market storage market = markets[_marketId];
        MarketCap storage capConfig = market.capConfig;
        
        // Check if already at max cap
        if (capConfig.currentCap >= capConfig.maxCap) {
            return;
        }
        
        // Check minimum time interval
        if (block.timestamp < capConfig.lastGrowthTime + capConfig.minGrowthInterval) {
            return;
        }
        
        // Check utilization threshold
        uint256 totalReserves = market.totalYesShares + market.totalNoShares;
        uint256 utilization = TruceAMM.getCapUtilization(totalReserves, capConfig.currentCap);
        
        if (utilization >= capConfig.growthThreshold) {
            uint256 oldCap = capConfig.currentCap;
            uint256 newCap = (oldCap * capConfig.growthMultiplier) / 100;
            
            // Cap at maximum
            if (newCap > capConfig.maxCap) {
                newCap = capConfig.maxCap;
            }
            
            capConfig.currentCap = newCap;
            capConfig.lastGrowthTime = block.timestamp;
            
            emit CapIncreased(_marketId, oldCap, newCap, "Utilization threshold reached");
        }
    }
    
    /**
     * @dev Get expected slippage for a potential trade
     */
    function getExpectedSlippage(
        uint256 _marketId,
        Outcome _outcome,
        uint256 _ethAmount
    ) external view override marketExists(_marketId) returns (uint256) {
        Market storage market = markets[_marketId];
        
        return TruceAMM.calculateSlippage(
            market.totalYesShares,
            market.totalNoShares,
            _ethAmount,
            _outcome
        );
    }
    
    /**
     * @dev Get current cap for a market
     */
    function getCurrentCap(uint256 _marketId) external view override marketExists(_marketId) returns (uint256) {
        return markets[_marketId].capConfig.currentCap;
    }
    
    /**
     * @dev Check if market cap can grow and why
     */
    function canGrowCap(uint256 _marketId) external view override marketExists(_marketId) returns (bool, string memory) {
        Market storage market = markets[_marketId];
        MarketCap storage capConfig = market.capConfig;
        
        if (capConfig.currentCap >= capConfig.maxCap) {
            return (false, "Already at maximum cap");
        }
        
        if (block.timestamp < capConfig.lastGrowthTime + capConfig.minGrowthInterval) {
            return (false, "Growth interval not reached");
        }
        
        uint256 totalReserves = market.totalYesShares + market.totalNoShares;
        uint256 utilization = TruceAMM.getCapUtilization(totalReserves, capConfig.currentCap);
        
        if (utilization < capConfig.growthThreshold) {
            return (false, "Utilization threshold not reached");
        }
        
        return (true, "Can grow cap");
    }
    
    /**
     * @dev Resolve market (only creator)
     */
    function resolveMarket(
        uint256 _marketId,
        Outcome _result
    ) external marketExists(_marketId) onlyMarketCreator(_marketId) {
        Market storage market = markets[_marketId];
        require(market.state == MarketState.Active, "Market not active");
        require(block.timestamp >= market.resolutionDeadline, "Too early to resolve");
        
        market.state = MarketState.Resolved;
        market.result = _result;
        
        emit MarketResolved(_marketId, _result);
    }
    
    /**
     * @dev Redeem winnings
     */
    function redeemWinnings(uint256 _marketId) external marketExists(_marketId) returns (uint256) {
        Market storage market = markets[_marketId];
        require(market.state == MarketState.Resolved, "Market not resolved");
        require(!hasRedeemed[_marketId][msg.sender], "Already redeemed");
        
        uint256 winningShares;
        if (market.result == Outcome.Yes) {
            winningShares = yesShares[_marketId][msg.sender];
            yesShares[_marketId][msg.sender] = 0;
        } else {
            winningShares = noShares[_marketId][msg.sender];
            noShares[_marketId][msg.sender] = 0;
        }
        
        require(winningShares > 0, "No winning shares");
        
        uint256 totalWinningShares = market.result == Outcome.Yes ? 
            market.totalYesShares : market.totalNoShares;
        uint256 totalLosingReserves = market.result == Outcome.Yes ? 
            market.totalNoShares : market.totalYesShares;
            
        uint256 payout = (winningShares * totalLosingReserves) / totalWinningShares;
        
        hasRedeemed[_marketId][msg.sender] = true;
        payable(msg.sender).transfer(payout);
        
        emit Redeemed(_marketId, msg.sender, payout);
        
        return payout;
    }
    
    /**
     * @dev Get market information
     */
    function getMarket(uint256 _marketId) external view marketExists(_marketId) returns (Market memory) {
        return markets[_marketId];
    }
    
    /**
     * @dev Admin: Update category caps
     */
    function updateCategoryCaps(
        MarketCategory _category,
        uint256 _maxCap
    ) external {
        require(msg.sender == owner, "Not owner");
        categoryMaxCaps[_category] = _maxCap;
    }
    
    /**
     * @dev Withdraw platform fees
     */
    function withdrawFees() external {
        require(msg.sender == owner, "Not owner");
        uint256 amount = totalPlatformFees;
        totalPlatformFees = 0;
        payable(owner).transfer(amount);
    }
    
    receive() external payable {}
}
