// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ITruce.sol";
import "./TruceAMM.sol";
import "./ITruceFactory.sol";

contract TruceMarket is ITruceMarket {
    using TruceAMM for uint256;

    uint256 private constant MIN_LIQUIDITY = 0.01 ether;
    uint256 private constant PLATFORM_FEE = 200; // 2%
    uint256 private constant BASIS_POINTS = 10000;
    uint256 private constant DEFAULT_GROWTH_MULTIPLIER = 200; // 2x
    uint256 private constant DEFAULT_GROWTH_THRESHOLD = 8000; // 80%
    uint256 private constant DEFAULT_MIN_GROWTH_INTERVAL = 1 hours;

    // Market metadata
    string public question;
    address public creator;
    address public factory;
    uint256 public createdAt;
    uint256 public resolutionDeadline;
    MarketState public state;
    Outcome public result;
    ITruceFactory.MarketCategory public category;

    // Market state
    uint256 public totalYesShares;
    uint256 public totalNoShares;
    uint256 public k;
    uint256 public tradeCount;
    MarketCap public capConfig;

    // User data
    mapping(address => uint256) public yesShares;
    mapping(address => uint256) public noShares;
    mapping(address => bool) public hasRedeemed;

    modifier onlyCreator() {
        require(msg.sender == creator, "Not creator");
        _;
    }

    modifier onlyActive() {
        require(state == MarketState.Active, "Market not active");
        require(block.timestamp < resolutionDeadline, "Market expired");
        _;
    }

    constructor(
        string memory _question,
        uint256 _resolutionDeadline,
        uint256 _initialLiquidity,
        ITruceFactory.MarketCategory _category,
        address _creator,
        uint256 _maxCap
    ) payable {
        require(bytes(_question).length > 0, "Empty question");
        require(msg.value >= _initialLiquidity, "Insufficient ETH");
        require(_initialLiquidity >= MIN_LIQUIDITY, "Below minimum");
        require(_initialLiquidity <= _maxCap, "Exceeds max cap");

        question = _question;
        creator = _creator;
        factory = msg.sender;
        category = _category;
        createdAt = block.timestamp;
        resolutionDeadline = _resolutionDeadline;
        state = MarketState.Active;

        // Initialize liquidity (50/50 split)
        uint256 halfLiquidity = _initialLiquidity / 2;
        totalYesShares = halfLiquidity;
        totalNoShares = halfLiquidity;
        k = halfLiquidity * halfLiquidity;

        // Give creator initial shares
        yesShares[_creator] = halfLiquidity;
        noShares[_creator] = halfLiquidity;

        // Initialize cap config
        capConfig = MarketCap({
            currentCap: _initialLiquidity,
            growthMultiplier: DEFAULT_GROWTH_MULTIPLIER,
            growthThreshold: DEFAULT_GROWTH_THRESHOLD,
            maxCap: _maxCap,
            lastGrowthTime: block.timestamp,
            minGrowthInterval: DEFAULT_MIN_GROWTH_INTERVAL
        });

        // Refund excess
        if (msg.value > _initialLiquidity) {
            payable(_creator).transfer(msg.value - _initialLiquidity);
        }
    }

    function buyShares(Outcome _outcome) external payable override onlyActive returns (uint256) {
        require(msg.value > 0, "Must send ETH");

        // Try to grow cap
        _tryGrowCap();

        bool isYes = _outcome == Outcome.Yes;

        // Check cap before calculating shares
        uint256 totalReserves = totalYesShares + totalNoShares;
        require(totalReserves + msg.value <= capConfig.currentCap, "Would exceed cap");

        // Calculate shares
        uint256 sharesOut = TruceAMM.calculateSharesOut(totalYesShares, totalNoShares, msg.value, isYes);

        // Take fee and send to factory
        uint256 fee = (msg.value * PLATFORM_FEE) / BASIS_POINTS;
        uint256 netAmount = msg.value - fee;

        if (fee > 0) {
            payable(factory).transfer(fee);
        }

        // Update reserves
        if (isYes) {
            totalYesShares += sharesOut;
            totalNoShares += (netAmount - sharesOut);
            yesShares[msg.sender] += sharesOut;
        } else {
            totalNoShares += sharesOut;
            totalYesShares += (netAmount - sharesOut);
            noShares[msg.sender] += sharesOut;
        }

        // Update invariant
        k = totalYesShares * totalNoShares;
        tradeCount++;

        emit SharesPurchased(msg.sender, _outcome, sharesOut, msg.value);

        return sharesOut;
    }

    function sellShares(Outcome _outcome, uint256 _shares) external override onlyActive returns (uint256) {
        require(_shares > 0, "Must sell positive shares");

        bool isYes = _outcome == Outcome.Yes;

        // Check balance
        if (isYes) {
            require(yesShares[msg.sender] >= _shares, "Insufficient YES shares");
        } else {
            require(noShares[msg.sender] >= _shares, "Insufficient NO shares");
        }

        uint256 ethOut = TruceAMM.calculateEthOut(totalYesShares, totalNoShares, _shares, isYes);

        // Take fee
        uint256 fee = (ethOut * PLATFORM_FEE) / BASIS_POINTS;
        uint256 netPayout = ethOut - fee;

        if (fee > 0) {
            payable(factory).transfer(fee);
        }

        // Update reserves
        if (isYes) {
            totalYesShares -= _shares;
            yesShares[msg.sender] -= _shares;
        } else {
            totalNoShares -= _shares;
            noShares[msg.sender] -= _shares;
        }

        // Update invariant
        k = totalYesShares * totalNoShares;
        tradeCount++;

        payable(msg.sender).transfer(netPayout);

        emit SharesSold(msg.sender, _outcome, _shares, netPayout);

        return netPayout;
    }

    function addLiquidity() external payable override onlyActive {
        require(msg.value > 0, "Must send ETH");

        uint256 totalReserves = totalYesShares + totalNoShares;
        require(totalReserves + msg.value <= capConfig.currentCap, "Would exceed cap");

        uint256 halfAmount = msg.value / 2;

        totalYesShares += halfAmount;
        totalNoShares += halfAmount;
        k = totalYesShares * totalNoShares;

        yesShares[msg.sender] += halfAmount;
        noShares[msg.sender] += halfAmount;

        emit LiquidityAdded(msg.sender, msg.value);
    }

    function resolveMarket(Outcome _result) external override onlyCreator {
        require(state == MarketState.Active, "Market not active");
        require(block.timestamp >= resolutionDeadline, "Too early to resolve");

        state = MarketState.Resolved;
        result = _result;

        emit MarketResolved(_result);
    }

    function redeemWinnings() external override returns (uint256) {
        require(state == MarketState.Resolved, "Market not resolved");
        require(!hasRedeemed[msg.sender], "Already redeemed");

        uint256 winningShares;
        if (result == Outcome.Yes) {
            winningShares = yesShares[msg.sender];
            yesShares[msg.sender] = 0;
        } else {
            winningShares = noShares[msg.sender];
            noShares[msg.sender] = 0;
        }

        require(winningShares > 0, "No winning shares");

        uint256 totalWinningShares = result == Outcome.Yes ? totalYesShares : totalNoShares;
        uint256 totalLosingReserves = result == Outcome.Yes ? totalNoShares : totalYesShares;

        uint256 payout = (winningShares * totalLosingReserves) / totalWinningShares;

        hasRedeemed[msg.sender] = true;
        payable(msg.sender).transfer(payout);

        emit Redeemed(msg.sender, payout);

        return payout;
    }

    function _tryGrowCap() internal {
        if (capConfig.currentCap >= capConfig.maxCap) {
            return;
        }

        uint256 totalReserves = totalYesShares + totalNoShares;
        uint256 utilization = TruceAMM.getCapUtilization(totalReserves, capConfig.currentCap);

        if (utilization >= capConfig.growthThreshold) {
            uint256 oldCap = capConfig.currentCap;
            uint256 newCap = (oldCap * capConfig.growthMultiplier) / 100;

            if (newCap > capConfig.maxCap) {
                newCap = capConfig.maxCap;
            }

            capConfig.currentCap = newCap;
            capConfig.lastGrowthTime = block.timestamp;

            emit CapIncreased(oldCap, newCap, "Utilization threshold reached");
        }
    }

    function getMarketData() external view override returns (MarketData memory) {
        return MarketData({
            question: question,
            creator: creator,
            factory: factory,
            createdAt: createdAt,
            resolutionDeadline: resolutionDeadline,
            state: state,
            result: result,
            totalYesShares: totalYesShares,
            totalNoShares: totalNoShares,
            k: k,
            tradeCount: tradeCount,
            capConfig: capConfig
        });
    }

    function getUserShares(address _user) external view override returns (uint256, uint256) {
        return (yesShares[_user], noShares[_user]);
    }

    function getCurrentCap() external view override returns (uint256) {
        return capConfig.currentCap;
    }

    receive() external payable {}
}
