// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ITruceFactory.sol";
import "./Truce.sol";
import "./ITruce.sol";

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

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

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

    function collectFee() external payable {
        require(isValidMarket[msg.sender], "Only valid markets");
        totalPlatformFees += msg.value;
        emit FeeCollected(msg.sender, msg.value);
    }

    function getAllMarkets() external view override returns (address[] memory) {
        return allMarkets;
    }

    function getMarketsByCreator(address _creator) external view override returns (address[] memory) {
        return marketsByCreator[_creator];
    }

    function getMarketsByCategory(MarketCategory _category) external view override returns (address[] memory) {
        return marketsByCategory[_category];
    }

    function getMarketCount() external view override returns (uint256) {
        return allMarkets.length;
    }

    function getMarket(uint256 _index) external view returns (address) {
        require(_index < allMarkets.length, "Index out of bounds");
        return allMarkets[_index];
    }

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

    function getCreatorReputation(address _creator)
        external
        view
        returns (uint256 marketsCreated, uint256 disputesLost, uint256 reputationScore)
    {
        marketsCreated = marketsByCreator[_creator].length;
        disputesLost = creatorDisputeCount[_creator];

        reputationScore = marketsCreated > 0 ? 100 - ((disputesLost * 100) / marketsCreated) : 100;
    }

    function withdrawFees() external onlyOwner {
        uint256 amount = totalPlatformFees;
        totalPlatformFees = 0;
        payable(owner).transfer(amount);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner).transfer(balance);
    }

    receive() external payable {}
}
