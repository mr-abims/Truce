// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ITruceMarket} from "./ITruce.sol";

/// @title TruceAMM - Automated Market Maker Library
/// @notice Implements constant product (x*y=k) AMM for binary prediction markets
/// @dev Used by TruceMarket for share pricing and liquidity calculations
library TruceAMM {
    uint256 private constant PRECISION = 1e18;

    error InsufficientLiquidity();
    error InvalidAmount();

    /// @notice Calculate shares received for a given ETH amount
    /// @param yesReserves Current YES share reserves
    /// @param noReserves Current NO share reserves
    /// @param ethAmount Amount of ETH being spent
    /// @param isYes Whether buying YES (true) or NO (false) shares
    /// @return sharesOut Amount of shares to be received
    /// @dev Uses constant product formula: k = x * y
    function calculateSharesOut(uint256 yesReserves, uint256 noReserves, uint256 ethAmount, bool isYes)
        internal
        pure
        returns (uint256 sharesOut)
    {
        if (ethAmount == 0) revert InvalidAmount();

        uint256 totalReserves = yesReserves + noReserves;

        if (yesReserves == 0 || noReserves == 0) {
            return ethAmount;
        }

        uint256 k = yesReserves * noReserves;

        if (isYes) {
            // Add ETH to NO reserves, calculate new YES reserves to maintain k
            uint256 newNoReserves = noReserves + ethAmount;
            uint256 newYesReserves = k / newNoReserves;
            sharesOut = yesReserves - newYesReserves;
        } else {
            // Add ETH to YES reserves, calculate new NO reserves to maintain k
            uint256 newYesReserves = yesReserves + ethAmount;
            uint256 newNoReserves = k / newYesReserves;
            sharesOut = noReserves - newNoReserves;
        }

        if (sharesOut == 0) revert InsufficientLiquidity();
    }

    /// @notice Calculate ETH received for selling shares
    /// @param yesReserves Current YES share reserves
    /// @param noReserves Current NO share reserves
    /// @param sharesIn Amount of shares being sold
    /// @param isYes Whether selling YES (true) or NO (false) shares
    /// @return ethOut Amount of ETH to be received
    /// @dev Uses constant product formula: k = x * y
    function calculateEthOut(uint256 yesReserves, uint256 noReserves, uint256 sharesIn, bool isYes)
        internal
        pure
        returns (uint256 ethOut)
    {
        if (sharesIn == 0) revert InvalidAmount();
        if (yesReserves == 0 || noReserves == 0) revert InsufficientLiquidity();

        uint256 k = yesReserves * noReserves;

        if (isYes) {
            require(sharesIn < yesReserves, "Insufficient YES reserves");
            uint256 newYesReserves = yesReserves - sharesIn;
            uint256 newNoReserves = k / newYesReserves;
            ethOut = newNoReserves - noReserves;
        } else {
            require(sharesIn < noReserves, "Insufficient NO reserves");
            uint256 newNoReserves = noReserves - sharesIn;
            uint256 newYesReserves = k / newNoReserves;
            ethOut = newYesReserves - yesReserves;
        }

        if (ethOut >= (yesReserves + noReserves) / 2) revert InsufficientLiquidity();
    }

    /// @notice Get current price for YES or NO shares
    /// @param yesReserves Current YES share reserves
    /// @param noReserves Current NO share reserves
    /// @param isYes Whether getting price for YES (true) or NO (false)
    /// @return price Price in wei (scaled by PRECISION)
    /// @dev Price is the ratio of opposite reserve to total reserves
    function getPrice(uint256 yesReserves, uint256 noReserves, bool isYes) internal pure returns (uint256 price) {
        if (yesReserves == 0 || noReserves == 0) {
            return PRECISION / 2;
        }

        uint256 totalReserves = yesReserves + noReserves;

        if (isYes) {
            price = (noReserves * PRECISION) / totalReserves;
        } else {
            price = (yesReserves * PRECISION) / totalReserves;
        }
    }

    /// @notice Calculate market cap utilization percentage
    /// @param totalReserves Total reserves (YES + NO)
    /// @param currentCap Current market cap limit
    /// @return Utilization in basis points (0-10000, where 10000 = 100%)
    /// @dev Used to determine when to grow market cap
    function getCapUtilization(uint256 totalReserves, uint256 currentCap) internal pure returns (uint256) {
        if (currentCap == 0) return 0;
        return (totalReserves * 10000) / currentCap;
    }
}
