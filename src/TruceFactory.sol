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
    mapping(MarketCategory => uint256) public categoryMaxCaps;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;

        // Set max caps per category
        categoryMaxCaps[MarketCategory.CRYPTO] = 1000 ether;
        categoryMaxCaps[MarketCategory.SPORTS] = 500 ether;
        categoryMaxCaps[MarketCategory.POLITICS] = 2000 ether;
        categoryMaxCaps[MarketCategory.WEATHER] = 100 ether;
        categoryMaxCaps[MarketCategory.ENTERTAINMENT] = 300 ether;
        categoryMaxCaps[MarketCategory.OTHER] = 200 ether;
    }

    function createMarket(
        string memory _question,
        uint256 _resolutionDeadline,
        uint256 _initialLiquidity,
        MarketCategory _category
    ) external payable override returns (address) {
        require(_resolutionDeadline > block.timestamp + MIN_RESOLUTION_TIME, "Resolution too soon");
        require(_resolutionDeadline < block.timestamp + MAX_RESOLUTION_TIME, "Resolution too late");

        uint256 maxCap = categoryMaxCaps[_category];

        // Deploy new market contract
        TruceMarket market = new TruceMarket{value: msg.value}(
            _question, _resolutionDeadline, _initialLiquidity, _category, msg.sender, maxCap
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

    function updateCategoryMaxCap(MarketCategory _category, uint256 _maxCap) external onlyOwner {
        categoryMaxCaps[_category] = _maxCap;
    }

    function withdrawFees() external onlyOwner {
        uint256 amount = totalPlatformFees;
        totalPlatformFees = 0;
        payable(owner).transfer(amount);
    }

    receive() external payable {}
}
