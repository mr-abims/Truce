// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ITruceFactory.sol";
import "./Truce.sol";
import "./ITruce.sol";

/// @title TruceFactory - Prediction Market Factory
/// @notice Creates and manages prediction markets, handles disputes and fees
/// @dev Deploys TruceMarket contracts and tracks them by creator and category
contract TruceFactory is ITruceFactory {
    uint256 private constant MIN_RESOLUTION_TIME = 1 hours;
    uint256 private constant MAX_RESOLUTION_TIME = 365 days;

    address public owner;
    uint256 public totalPlatformFees;

    // Market tracking
    address[] public allMarkets;
    mapping(address => bool) public isValidMarket;
    mapping(address => address[]) public marketsByCreator;
    mapping(MarketCategory => address[]) public marketsByCategory;

    // Dispute tracking
    mapping(address => uint256) public creatorDisputeCount;

    /// @notice Restricts function access to factory owner only
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    /// @notice Initializes the factory with deployer as owner
    constructor() {
        owner = msg.sender;
    }

    /// @notice Create a new prediction market
    /// @param _question The question or statement to predict
    /// @param _resolutionDeadline Timestamp when market can be resolved (1 hour to 365 days from now)
    /// @param _initialLiquidity Initial ETH liquidity amount
    /// @param _category Market category (Politics, Sports, Crypto, Entertainment, Other)
    /// @return Address of the newly created market
    /// @dev Deploys new TruceMarket contract and tracks it
    function createMarket(
        string memory _question,
        uint256 _resolutionDeadline,
        uint256 _initialLiquidity,
        MarketCategory _category
    ) external payable override returns (address) {
        require(_resolutionDeadline > block.timestamp + MIN_RESOLUTION_TIME, "Resolution too soon");
        require(_resolutionDeadline < block.timestamp + MAX_RESOLUTION_TIME, "Resolution too late");

        // Deploy new market contract
        TruceMarket market = new TruceMarket{value: msg.value}(
            _question, _resolutionDeadline, _initialLiquidity, _category, msg.sender
        );

        address marketAddress = address(market);

        // Track market
        allMarkets.push(marketAddress);
        isValidMarket[marketAddress] = true;
        marketsByCreator[msg.sender].push(marketAddress);
        marketsByCategory[_category].push(marketAddress);

        emit MarketCreated(marketAddress, _question, msg.sender, _category, _initialLiquidity);

        return marketAddress;
    }

    /// @notice Collect platform fees from markets
    /// @dev Called by markets when fees are charged, only valid markets can call
    function collectFee() external payable {
        require(isValidMarket[msg.sender], "Only valid markets");
        totalPlatformFees += msg.value;
        emit FeeCollected(msg.sender, msg.value);
    }

    /// @notice Get all created markets
    /// @return Array of all market addresses
    function getAllMarkets() external view override returns (address[] memory) {
        return allMarkets;
    }

    /// @notice Get all markets created by a specific address
    /// @param _creator Address of the creator
    /// @return Array of market addresses
    function getMarketsByCreator(address _creator) external view override returns (address[] memory) {
        return marketsByCreator[_creator];
    }

    /// @notice Get all markets in a specific category
    /// @param _category Category to filter by
    /// @return Array of market addresses
    function getMarketsByCategory(MarketCategory _category) external view override returns (address[] memory) {
        return marketsByCategory[_category];
    }

    /// @notice Get total number of markets created
    /// @return Total market count
    function getMarketCount() external view override returns (uint256) {
        return allMarkets.length;
    }

    /// @notice Get market address by index
    /// @param _index Index in allMarkets array
    /// @return Market address
    function getMarket(uint256 _index) external view returns (address) {
        require(_index < allMarkets.length, "Index out of bounds");
        return allMarkets[_index];
    }

    /// @notice Owner resolves a market dispute
    /// @param _market Address of the disputed market
    /// @param _disputeValid Whether the dispute is valid
    /// @dev If valid, increments creator's dispute count and calls market's resolveDispute
    function resolveMarketDispute(address _market, bool _disputeValid) external onlyOwner {
        require(isValidMarket[_market], "Invalid market");

        ITruceMarket market = ITruceMarket(_market);
        ITruceMarket.MarketData memory data = market.getMarketData();

        require(data.state == ITruceMarket.MarketState.Disputed, "No active dispute");

        if (_disputeValid) {
            creatorDisputeCount[data.creator]++;
        }

        market.resolveDispute(_disputeValid);
    }

    /// @notice Get all markets with pending disputes
    /// @return Array of disputed market addresses
    /// @dev Iterates through all markets to find those in Disputed state
    function getPendingDisputes() external view returns (address[] memory) {
        uint256 count = 0;

        for (uint256 i = 0; i < allMarkets.length; i++) {
            ITruceMarket market = ITruceMarket(allMarkets[i]);
            ITruceMarket.MarketData memory data = market.getMarketData();
            if (data.state == ITruceMarket.MarketState.Disputed) {
                count++;
            }
        }

        address[] memory disputed = new address[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < allMarkets.length; i++) {
            ITruceMarket market = ITruceMarket(allMarkets[i]);
            ITruceMarket.MarketData memory data = market.getMarketData();
            if (data.state == ITruceMarket.MarketState.Disputed) {
                disputed[index] = allMarkets[i];
                index++;
            }
        }

        return disputed;
    }

    /// @notice Get reputation metrics for a market creator
    /// @param _creator Address of the creator
    /// @return marketsCreated Total number of markets created
    /// @return disputesLost Number of disputes lost
    /// @return reputationScore Score from 0-100 based on dispute rate
    function getCreatorReputation(address _creator)
        external
        view
        returns (uint256 marketsCreated, uint256 disputesLost, uint256 reputationScore)
    {
        marketsCreated = marketsByCreator[_creator].length;
        disputesLost = creatorDisputeCount[_creator];

        reputationScore = marketsCreated > 0 ? 100 - ((disputesLost * 100) / marketsCreated) : 100;
    }

    /// @notice Owner withdraws accumulated platform fees
    /// @dev Transfers totalPlatformFees to owner and resets counter
    function withdrawFees() external onlyOwner {
        uint256 amount = totalPlatformFees;
        totalPlatformFees = 0;
        payable(owner).transfer(amount);
    }

    /// @notice Owner withdraws entire contract balance
    /// @dev Emergency function to withdraw all ETH from factory
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner).transfer(balance);
    }

    receive() external payable {}
}
