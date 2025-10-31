// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ITruceMarket} from "./ITruce.sol";

interface ITruceFactory {
    enum MarketCategory {
        CRYPTO,
        SPORTS,
        POLITICS,
        WEATHER,
        ENTERTAINMENT,
        OTHER
    }

    event MarketCreated(
        address indexed marketAddress,
        string question,
        address indexed creator,
        MarketCategory indexed category,
        uint256 initialLiquidity
    );
    event FeeCollected(address indexed market, uint256 amount);

    function createMarket(
        string memory _question,
        uint256 _resolutionDeadline,
        uint256 _initialLiquidity,
        MarketCategory _category
    ) external payable returns (address);

    function collectFee() external payable;

    function getAllMarkets() external view returns (address[] memory);
    function getMarketsByCreator(address _creator) external view returns (address[] memory);
    function getMarketsByCategory(MarketCategory _category) external view returns (address[] memory);
    function getMarketCount() external view returns (uint256);
    function isValidMarket(address _market) external view returns (bool);
    function resolveMarketDispute(address _market, bool _disputeValid) external;
    function getPendingDisputes() external view returns (address[] memory);
    function getCreatorReputation(address _creator)
        external
        view
        returns (uint256 marketsCreated, uint256 disputesLost, uint256 reputationScore);
}
