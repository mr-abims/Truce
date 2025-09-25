// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ITruce.sol";

library TruceAMM {
    uint256 private constant PRECISION = 1e18;
    uint256 private constant MIN_LIQUIDITY = 1000;
    
    error InsufficientLiquidity();
    error SlippageExceeded();
    error InvalidAmount();
    
    /**
     * @dev Calculate shares received for given ETH using constant product formula
     * For truce markets: (x + Δx)(y + Δy) = k, where Δx + Δy = ETH_in
     * This ensures that buying YES and NO shares for same amount always costs exactly 1 ETH per complete set
     */
    function calculateSharesOut(
        uint256 yesReserves,
        uint256 noReserves,
        uint256 ethAmount,
        ITruce.Outcome outcome
    ) internal pure returns (uint256 sharesOut) {
        if (ethAmount == 0) revert InvalidAmount();
        
        // For initial liquidity
        if (yesReserves == 0 || noReserves == 0) {
            return ethAmount;
        }
        
        uint256 k = yesReserves * noReserves;
        
        if (outcome == ITruce.Outcome.Yes) {
            // Calculate new yes reserves after adding liquidity
            // We need to solve: (yesReserves + sharesOut) * (noReserves + (ethAmount - sharesOut)) = k
            // This simplifies to finding sharesOut such that the invariant holds
            uint256 newTotalReserves = yesReserves + noReserves + ethAmount;
            uint256 newYesReserves = (k + ethAmount * yesReserves) / newTotalReserves;
            sharesOut = newYesReserves - yesReserves;
        } else {
            // Similar calculation for NO shares
            uint256 newTotalReserves = yesReserves + noReserves + ethAmount;
            uint256 newNoReserves = (k + ethAmount * noReserves) / newTotalReserves;
            sharesOut = newNoReserves - noReserves;
        }
        
        if (sharesOut == 0) revert InsufficientLiquidity();
    }
    
    /**
     * @dev Calculate ETH received for selling shares
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
        
        // Ensure we don't drain all liquidity
        if (ethOut >= (yesReserves + noReserves) / 2) revert InsufficientLiquidity();
    }
    
    /**
     * @dev Get current price of outcome shares (in ETH per share)
     */
    function getPrice(
        uint256 yesReserves,
        uint256 noReserves,
        ITruce.Outcome outcome
    ) internal pure returns (uint256 price) {
        if (yesReserves == 0 || noReserves == 0) {
            return PRECISION / 2; // 0.5 ETH per share when no liquidity
        }
        
        uint256 totalReserves = yesReserves + noReserves;
        
        if (outcome == ITruce.Outcome.Yes) {
            price = (noReserves * PRECISION) / totalReserves;
        } else {
            price = (yesReserves * PRECISION) / totalReserves;
        }
    }
}