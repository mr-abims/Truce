// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ITruceMarket} from "./ITruce.sol";
import {TruceAMM} from "./TruceAMM.sol";
import {ITruceFactory} from "./ITruceFactory.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TruceMarket is ITruceMarket, ERC20, ReentrancyGuard {
    using TruceAMM for uint256;

    uint256 private constant MIN_LIQUIDITY = 10**3; // Uniswap V2 protection
    address private constant DEAD_ADDRESS = 0x000000000000000000000000000000000000dEaD; // For burning LP tokens
    uint256 private constant PLATFORM_FEE = 10; // 0.1%
    uint256 private constant LP_FEE = 40; // 0.4%
    uint256 private constant TOTAL_FEE = 50; // 0.5%
    uint256 private constant BASIS_POINTS = 10000;
    uint256 private constant DEFAULT_GROWTH_MULTIPLIER = 200; // 2x
    uint256 private constant DEFAULT_GROWTH_THRESHOLD = 8000; // 80%
    uint256 private constant DEFAULT_MIN_GROWTH_INTERVAL = 1 hours;
    uint256 private constant DISPUTE_PERIOD = 1 days;
    uint256 private constant DISPUTE_BOND = 0.05 ether;

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
    uint256 public accumulatedFees;

    // Dispute state
    uint256 public disputePeriodEnd;
    Dispute[] public disputes;
    mapping(address => bool) public hasDisputed;

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
        address _creator
    )
        payable
        ERC20(
            string(abi.encodePacked("Truce LP: ", _question)),
            "TRUCE-LP"
        )
    {
        require(bytes(_question).length > 0, "Empty question");
        require(msg.value >= _initialLiquidity, "Insufficient ETH");
        require(_initialLiquidity >= MIN_LIQUIDITY, "Below minimum");

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

        // MINT LP TOKENS (not YES/NO shares!)
        _mint(DEAD_ADDRESS, MIN_LIQUIDITY); // Burn minimum for inflation protection
        _mint(_creator, _initialLiquidity - MIN_LIQUIDITY); // Mint to creator

        // Initialize cap config (no maxCap!)
        capConfig = MarketCap({
            currentCap: _initialLiquidity,
            growthMultiplier: DEFAULT_GROWTH_MULTIPLIER,
            growthThreshold: DEFAULT_GROWTH_THRESHOLD,
            lastGrowthTime: block.timestamp,
            minGrowthInterval: DEFAULT_MIN_GROWTH_INTERVAL
        });

        // Refund excess
        if (msg.value > _initialLiquidity) {
            payable(_creator).transfer(msg.value - _initialLiquidity);
        }
    }

    function buyShares(Outcome _outcome) external payable override onlyActive nonReentrant returns (uint256) {
        require(msg.value > 0, "Must send ETH");

        // Try to grow cap
        _tryGrowCap();

        bool isYes = _outcome == Outcome.Yes;

        // Check cap before calculating shares
        uint256 totalReserves = totalYesShares + totalNoShares;
        require(totalReserves + msg.value <= capConfig.currentCap, "Would exceed cap");

        // SPLIT FEES: 0.1% platform, 0.4% LP
        uint256 platformFee = (msg.value * PLATFORM_FEE) / BASIS_POINTS;
        uint256 lpFee = (msg.value * LP_FEE) / BASIS_POINTS;
        uint256 netAmount = msg.value - platformFee - lpFee;

        // Send platform fee to factory
        if (platformFee > 0) {
            ITruceFactory(factory).collectFee{value: platformFee}();
        }

        // Keep LP fee in contract
        accumulatedFees += lpFee;

        // Calculate shares with net amount
        uint256 sharesOut = TruceAMM.calculateSharesOut(totalYesShares, totalNoShares, netAmount, isYes);

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

    function sellShares(Outcome _outcome, uint256 _shares) external override onlyActive nonReentrant returns (uint256) {
        require(_shares > 0, "Must sell positive shares");

        bool isYes = _outcome == Outcome.Yes;

        // Check balance
        if (isYes) {
            require(yesShares[msg.sender] >= _shares, "Insufficient YES shares");
        } else {
            require(noShares[msg.sender] >= _shares, "Insufficient NO shares");
        }

        uint256 ethOut = TruceAMM.calculateEthOut(totalYesShares, totalNoShares, _shares, isYes);

        // SPLIT FEES: 0.1% platform, 0.4% LP
        uint256 platformFee = (ethOut * PLATFORM_FEE) / BASIS_POINTS;
        uint256 lpFee = (ethOut * LP_FEE) / BASIS_POINTS;
        uint256 netPayout = ethOut - platformFee - lpFee;

        // Send platform fee to factory
        if (platformFee > 0) {
            ITruceFactory(factory).collectFee{value: platformFee}();
        }

        // Keep LP fee in contract
        accumulatedFees += lpFee;

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

    function addLiquidity() external payable override onlyActive nonReentrant returns (uint256 lpTokens) {
        require(msg.value > 0, "Must send ETH");
        require(msg.value >= 0.001 ether, "Minimum 0.001 ETH");

        _tryGrowCap();

        // Calculate pool value (reserves + fees)
        uint256 poolValue = totalYesShares + totalNoShares + accumulatedFees;

        // Calculate LP tokens to mint
        uint256 _totalSupply = totalSupply();
        if (_totalSupply == 0) {
            // Should never happen (MINIMUM_LIQUIDITY minted in constructor)
            lpTokens = msg.value - MIN_LIQUIDITY;
            _mint(DEAD_ADDRESS, MIN_LIQUIDITY);
        } else {
            // Proportional to existing pool value
            lpTokens = (msg.value * _totalSupply) / poolValue;
        }

        require(lpTokens > 0, "Insufficient LP tokens");

        // Add balanced liquidity (50/50)
        uint256 halfAmount = msg.value / 2;
        totalYesShares += halfAmount;
        totalNoShares += halfAmount;
        k = totalYesShares * totalNoShares;

        // MINT ERC20 LP TOKENS
        _mint(msg.sender, lpTokens);

        emit LiquidityAdded(msg.sender, msg.value, lpTokens);
        return lpTokens;
    }

    function removeLiquidity(uint256 lpAmount) external override nonReentrant returns (uint256 ethOut) {
        require(balanceOf(msg.sender) >= lpAmount, "Insufficient LP tokens");
        require(lpAmount > 0, "Cannot remove 0");
        require(state == MarketState.Active, "Market not active");

        // Calculate pool value
        uint256 poolValue = totalYesShares + totalNoShares + accumulatedFees;
        uint256 _totalSupply = totalSupply();

        // Calculate ETH to return (proportional to LP share)
        ethOut = (lpAmount * poolValue) / _totalSupply;
        require(ethOut > 0, "Insufficient output");

        // Remove proportional amounts from reserves and fees
        uint256 yesRemoval = (lpAmount * totalYesShares) / _totalSupply;
        uint256 noRemoval = (lpAmount * totalNoShares) / _totalSupply;
        uint256 feeRemoval = (lpAmount * accumulatedFees) / _totalSupply;

        totalYesShares -= yesRemoval;
        totalNoShares -= noRemoval;
        accumulatedFees -= feeRemoval;
        k = totalYesShares * totalNoShares;

        // BURN ERC20 LP TOKENS
        _burn(msg.sender, lpAmount);

        // Transfer ETH
        payable(msg.sender).transfer(ethOut);

        emit LiquidityRemoved(msg.sender, ethOut, lpAmount);
        return ethOut;
    }

    function resolveMarket(Outcome _result) external override onlyCreator {
        require(state == MarketState.Active, "Market not active");
        require(block.timestamp >= resolutionDeadline, "Too early to resolve");

        state = MarketState.PendingDispute;
        result = _result;
        disputePeriodEnd = block.timestamp + DISPUTE_PERIOD;

        emit MarketResolved(_result);
    }

    function submitDispute(Outcome _proposedOutcome, string memory _reason) external payable override {
        require(state == MarketState.PendingDispute, "Not in dispute window");
        require(block.timestamp <= disputePeriodEnd, "Dispute period ended");
        require(msg.value >= DISPUTE_BOND, "Insufficient bond");
        require(_proposedOutcome != result, "Same as current result");
        require(!hasDisputed[msg.sender], "Already disputed");

        // Only losing side can dispute
        uint256 disputerShares = result == Outcome.Yes ? noShares[msg.sender] : yesShares[msg.sender];
        require(disputerShares > 0, "No losing shares");

        // First dispute changes state
        if (disputes.length == 0) {
            state = MarketState.Disputed;
        }

        disputes.push(
            Dispute({
                disputer: msg.sender,
                bond: msg.value,
                proposedOutcome: _proposedOutcome,
                reason: _reason,
                timestamp: block.timestamp
            })
        );

        hasDisputed[msg.sender] = true;

        emit DisputeSubmitted(msg.sender, _proposedOutcome, _reason);
    }

    function resolveDispute(bool _disputeValid) external override {
        require(msg.sender == factory, "Only factory");
        require(state == MarketState.Disputed, "No active dispute");
        require(disputes.length > 0, "No disputes");

        if (_disputeValid) {
            // Dispute succeeds - overturn resolution to most common disputed outcome
            Outcome newOutcome = _getMostCommonDisputedOutcome();
            result = newOutcome;

            // Calculate total penalty from creator
            uint256 creatorTotalShares = yesShares[creator] + noShares[creator];
            uint256 totalPenalty = creatorTotalShares / 10; // 10% total

            // Reward all disputers proportionally
            uint256 totalBonds = 0;
            for (uint256 i = 0; i < disputes.length; i++) {
                totalBonds += disputes[i].bond;
            }

            for (uint256 i = 0; i < disputes.length; i++) {
                Dispute memory dispute = disputes[i];

                // Return bond + 50% reward
                uint256 reward = dispute.bond + (dispute.bond / 2);
                payable(dispute.disputer).transfer(reward);

                // Share of creator penalty proportional to bond
                uint256 penaltyShare = (totalPenalty * dispute.bond) / totalBonds;

                if (result == Outcome.Yes) {
                    yesShares[creator] -= penaltyShare;
                    yesShares[dispute.disputer] += penaltyShare;
                } else {
                    noShares[creator] -= penaltyShare;
                    noShares[dispute.disputer] += penaltyShare;
                }
            }

            emit DisputeResolved(true, newOutcome);
        } else {
            // Dispute fails - keep original resolution, factory keeps all bonds
            for (uint256 i = 0; i < disputes.length; i++) {
                payable(factory).transfer(disputes[i].bond);
            }

            emit DisputeResolved(false, result);
        }

        state = MarketState.Resolved;
        delete disputes;
    }

    function _getMostCommonDisputedOutcome() internal view returns (Outcome) {
        uint256 yesCount = 0;
        uint256 noCount = 0;

        for (uint256 i = 0; i < disputes.length; i++) {
            if (disputes[i].proposedOutcome == Outcome.Yes) {
                yesCount++;
            } else {
                noCount++;
            }
        }

        return yesCount > noCount ? Outcome.Yes : Outcome.No;
    }

    function finalizeResolution() external override {
        require(state == MarketState.PendingDispute, "Wrong state");
        require(block.timestamp > disputePeriodEnd, "Dispute period active");

        state = MarketState.Resolved;
        emit MarketFinalized(result);
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

    function redeemLPTokens() external override nonReentrant returns (uint256) {
        require(state == MarketState.Resolved, "Market not resolved");
        uint256 lpBalance = balanceOf(msg.sender);
        require(lpBalance > 0, "No LP tokens");

        // After winners redeem, LPs get remaining pool
        uint256 remainingValue = address(this).balance;
        uint256 lpShare = (lpBalance * remainingValue) / totalSupply();

        _burn(msg.sender, lpBalance);
        payable(msg.sender).transfer(lpShare);

        emit LPTokensRedeemed(msg.sender, lpShare, lpBalance);
        return lpShare;
    }

    function _tryGrowCap() internal {
        uint256 totalReserves = totalYesShares + totalNoShares;
        uint256 utilization = TruceAMM.getCapUtilization(totalReserves, capConfig.currentCap);

        if (utilization >= capConfig.growthThreshold) {
            uint256 oldCap = capConfig.currentCap;
            uint256 newCap = (oldCap * capConfig.growthMultiplier) / 100;

            // No max cap limit - grows forever!
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
            capConfig: capConfig,
            category: uint256(category),
            accumulatedFees: accumulatedFees
        });
    }

    function getUserShares(address _user) external view override returns (uint256, uint256) {
        return (yesShares[_user], noShares[_user]);
    }

    function getCurrentCap() external view override returns (uint256) {
        return capConfig.currentCap;
    }

    function getDisputes() external view override returns (Dispute[] memory) {
        return disputes;
    }

    receive() external payable {}
}
