// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ITruce.sol";

library TruceAMM {
    uint256 private constant PRECISION = 1e18;
    uint256 private constant SLIPPAGE_PRECISION = 10000; // For percentage calculations
    
    error InsufficientLiquidity();
    error SlippageExceeded();
    error InvalidAmount();
    error CapExceeded();
    
    /**
     * @dev Calculate shares out with cap checking
     */
    function calculateSharesOut(
        uint256 yesReserves,
        uint256 noReserves,
        uint256 ethAmount,
        ITruce.Outcome outcome
    ) internal pure returns (uint256 sharesOut) {
        if (ethAmount == 0) revert InvalidAmount();
        
        // Cap check will be done after calculating the new reserves
        
        // For initial liquidity
        if (yesReserves == 0 || noReserves == 0) {
            return ethAmount;
        }
        
        if (outcome == ITruce.Outcome.Yes) {
            // For buying YES shares: sharesOut = (ethAmount * yesReserves) / (noReserves + ethAmount)
            sharesOut = (ethAmount * yesReserves) / (noReserves + ethAmount);
        } else {
            // For buying NO shares: sharesOut = (ethAmount * noReserves) / (yesReserves + ethAmount)
            sharesOut = (ethAmount * noReserves) / (yesReserves + ethAmount);
        }
        
        if (sharesOut == 0) revert InsufficientLiquidity();
    }
    
    /**
     * @dev Calculate ETH out for selling shares
     */
    function calculateEthOut(
        uint256 yesReserves,
        uint256 noReserves,
        uint256 sharesIn,
        ITruce.Outcome outcome
    ) internal pure returns (uint256 ethOut) {
        if (sharesIn == 0) revert InvalidAmount();
        if (yesReserves == 0 || noReserves == 0) revert InsufficientLiquidity();
        
        uint256 k = yesReserves * noReserves;
        
        if (outcome == ITruce.Outcome.Yes) {
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
    
    /**
     * @dev Calculate expected slippage for a trade
     * Returns slippage in basis points (e.g., 250 = 2.5%)
     */
    function calculateSlippage(
        uint256 yesReserves,
        uint256 noReserves,
        uint256 ethAmount,
        ITruce.Outcome outcome
    ) internal pure returns (uint256 slippageBps) {
        if (yesReserves == 0 || noReserves == 0) {
            return 0; // No slippage on first trade
        }
        
        // Get current spot price
        uint256 spotPrice = getPrice(yesReserves, noReserves, outcome);
        
        // Calculate shares we'd get
        uint256 sharesOut;
        
        if (outcome == ITruce.Outcome.Yes) {
            sharesOut = (ethAmount * yesReserves) / (noReserves + ethAmount);
        } else {
            sharesOut = (ethAmount * noReserves) / (yesReserves + ethAmount);
        }
        
        // Expected shares at spot price
        uint256 expectedShares = (ethAmount * PRECISION) / spotPrice;
        
        // Calculate slippage as percentage
        if (sharesOut < expectedShares) {
            uint256 slippageAmount = expectedShares - sharesOut;
            slippageBps = (slippageAmount * SLIPPAGE_PRECISION) / expectedShares;
        } else {
            slippageBps = 0;
        }
    }
    
    /**
     * @dev Get current price of outcome shares
     */
    function getPrice(
        uint256 yesReserves,
        uint256 noReserves,
        ITruce.Outcome outcome
    ) internal pure returns (uint256 price) {
        if (yesReserves == 0 || noReserves == 0) {
            return PRECISION / 2;
        }
        
        uint256 totalReserves = yesReserves + noReserves;
        
        if (outcome == ITruce.Outcome.Yes) {
            price = (noReserves * PRECISION) / totalReserves;
        } else {
            price = (yesReserves * PRECISION) / totalReserves;
        }
    }
    
    /**
     * @dev Calculate utilization percentage of current cap
     * Returns in basis points (e.g., 8000 = 80%)
     */
    function getCapUtilization(
        uint256 totalReserves,
        uint256 currentCap
    ) internal pure returns (uint256) {
        if (currentCap == 0) return 0;
        return (totalReserves * SLIPPAGE_PRECISION) / currentCap;
    }
}