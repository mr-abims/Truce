// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Truce} from "../src/Truce.sol";
import {ITruce} from "../src/ITruce.sol";
import {TruceAMM} from "../src/TruceAmm.sol";

contract TruceTest is Test {
    Truce market;
    
    address creator = makeAddr("creator");
    address trader1 = makeAddr("trader1");
    address trader2 = makeAddr("trader2");
    address trader3 = makeAddr("trader3");
    address whale = makeAddr("whale");
    
    function setUp() public {
        market = new Truce();
        
        // Fund accounts
        vm.deal(creator, 100 ether);
        vm.deal(trader1, 100 ether);
        vm.deal(trader2, 100 ether);
        vm.deal(trader3, 100 ether);
        vm.deal(whale, 1000 ether);
    }
    
    function testDynamicCapGrowth() public {
        // Create a crypto market (20 ETH base cap)
        vm.prank(creator);
        uint256 marketId = market.createMarket{value: 10 ether}(
            "Will ETH hit $10k?",
            block.timestamp + 30 days,
            10 ether,
            ITruce.MarketCategory.CRYPTO
        );
        
        // Initial cap should be 20 ETH
        assertEq(market.getCurrentCap(marketId), 20 ether);
        
        // Fill up to 80% (16 ETH total)
        vm.prank(trader1);
        market.buyShares{value: 6 ether}(
            marketId,
            ITruce.Outcome.Yes,
            6 ether
        );
        
        // Still at base cap
        assertEq(market.getCurrentCap(marketId), 20 ether);
        
        // Push over 80% threshold
        vm.warp(block.timestamp + 2 hours); // Wait for growth interval
        vm.prank(trader2);
        market.buyShares{value: 1 ether}(
            marketId,
            ITruce.Outcome.No,
            1 ether
        );
        
        // Cap should have grown to 40 ETH (2x)
        assertEq(market.getCurrentCap(marketId), 40 ether);
    }
    
    function testSlippageComparison() public {
        // Create market
        vm.prank(creator);
        uint256 marketId = market.createMarket{value: 5 ether}(
            "Will it rain?",
            block.timestamp + 7 days,
            5 ether,
            ITruce.MarketCategory.WEATHER
        );
        
        // Check slippage for small trade (should be low)
        uint256 smallSlippage = market.getExpectedSlippage(
            marketId,
            ITruce.Outcome.Yes,
            0.5 ether
        );
        
        // Check slippage for large trade (should be higher)
        uint256 largeSlippage = market.getExpectedSlippage(
            marketId,
            ITruce.Outcome.Yes,
            2 ether
        );
        
        console.log("Small trade (0.5 ETH) slippage:", smallSlippage, "bps");
        console.log("Large trade (2 ETH) slippage:", largeSlippage, "bps");
        
        // Large trade should have more slippage
        assertTrue(largeSlippage > smallSlippage);
        
        // Small trade should have reasonable slippage (<60%)
        assertTrue(smallSlippage < 6000); // 6000 basis points = 60%
    }
    
    function testMultipleCapGrowths() public {
        // Create market
        vm.prank(creator);
        uint256 marketId = market.createMarket{value: 10 ether}(
            "Will BTC hit $100k?",
            block.timestamp + 90 days,
            10 ether,
            ITruce.MarketCategory.CRYPTO
        );
        
        uint256 initialCap = market.getCurrentCap(marketId);
        console.log("Initial cap:", initialCap / 1 ether, "ETH");
        
        // Growth 1: Fill to 80%
        vm.prank(trader1);
        market.buyShares{value: 6 ether}(marketId, ITruce.Outcome.Yes, 6 ether);
        
        vm.warp(block.timestamp + 2 hours);
        
        vm.prank(trader2);
        market.buyShares{value: 1 ether}(marketId, ITruce.Outcome.No, 1 ether);
        
        uint256 afterGrowth1 = market.getCurrentCap(marketId);
        console.log("After growth 1:", afterGrowth1 / 1 ether, "ETH");
        assertEq(afterGrowth1, initialCap * 2);
        
        // Growth 2: Fill to 80% again
        vm.prank(trader3);
        market.buyShares{value: 10 ether}(marketId, ITruce.Outcome.Yes, 10 ether);
        
        vm.warp(block.timestamp + 2 hours);
        
        vm.prank(whale);
        market.buyShares{value: 1 ether}(marketId, ITruce.Outcome.No, 1 ether);
        
        uint256 afterGrowth2 = market.getCurrentCap(marketId);
        console.log("After growth 2:", afterGrowth2 / 1 ether, "ETH");
        assertEq(afterGrowth2, initialCap * 4);
    }
    
    function testCategorySpecificCaps() public {
        // Crypto market - high caps
        vm.prank(creator);
        uint256 cryptoMarket = market.createMarket{value: 20 ether}(
            "Will ETH flip BTC?",
            block.timestamp + 90 days,
            20 ether,
            ITruce.MarketCategory.CRYPTO
        );
        
        // Weather market - low caps
        vm.prank(creator);
        uint256 weatherMarket = market.createMarket{value: 3 ether}(
            "Will it snow tomorrow?",
            block.timestamp + 2 days,
            3 ether,
            ITruce.MarketCategory.WEATHER
        );
        
        uint256 cryptoCap = market.getCurrentCap(cryptoMarket);
        uint256 weatherCap = market.getCurrentCap(weatherMarket);
        
        console.log("Crypto market cap:", cryptoCap / 1 ether, "ETH");
        console.log("Weather market cap:", weatherCap / 1 ether, "ETH");
        
        // Crypto should have higher cap
        assertTrue(cryptoCap > weatherCap);
    }
    
    function testSlippageImprovementWithGrowth() public {
        // Create market
        vm.prank(creator);
        uint256 marketId = market.createMarket{value: 10 ether}(
            "Will token X moon?",
            block.timestamp + 30 days,
            10 ether,
            ITruce.MarketCategory.CRYPTO
        );
        
        // Check slippage for 5 ETH trade at small pool
        uint256 slippageBeforeGrowth = market.getExpectedSlippage(
            marketId,
            ITruce.Outcome.Yes,
            5 ether
        );
        
        console.log("Slippage before growth (5 ETH on 20 ETH pool):", slippageBeforeGrowth, "bps");
        
        // Grow the pool
        vm.prank(trader1);
        market.buyShares{value: 8 ether}(marketId, ITruce.Outcome.Yes, 8 ether);
        
        vm.warp(block.timestamp + 2 hours);
        
        vm.prank(trader2);
        market.buyShares{value: 10 ether}(marketId, ITruce.Outcome.No, 10 ether);
        
        vm.warp(block.timestamp + 2 hours);
        
        vm.prank(trader3);
        market.buyShares{value: 15 ether}(marketId, ITruce.Outcome.Yes, 15 ether);
        
        // Check slippage for same 5 ETH trade at larger pool
        uint256 slippageAfterGrowth = market.getExpectedSlippage(
            marketId,
            ITruce.Outcome.Yes,
            5 ether
        );
        
        console.log("Slippage after growth (5 ETH on ~80 ETH pool):", slippageAfterGrowth, "bps");
        
        // Slippage should be lower with larger pool
        assertTrue(slippageAfterGrowth < slippageBeforeGrowth);
    }
    
    function testCapExceededReverts() public {
        // Create small weather market
        vm.prank(creator);
        uint256 marketId = market.createMarket{value: 2 ether}(
            "Will it rain?",
            block.timestamp + 1 days,
            2 ether,
            ITruce.MarketCategory.WEATHER
        );
        
        uint256 currentCap = market.getCurrentCap(marketId);
        
        // Try to add more than cap allows
        vm.prank(whale);
        vm.expectRevert(TruceAMM.CapExceeded.selector);
        market.buyShares{value: currentCap}(
            marketId,
            ITruce.Outcome.Yes,
            currentCap
        );
    }
    
    function testGrowthIntervalEnforcement() public {
        vm.prank(creator);
        uint256 marketId = market.createMarket{value: 10 ether}(
            "Test market",
            block.timestamp + 30 days,
            10 ether,
            ITruce.MarketCategory.CRYPTO
        );
        
        // Fill to trigger growth
        vm.prank(trader1);
        market.buyShares{value: 6 ether}(marketId, ITruce.Outcome.Yes, 6 ether);
        
        uint256 capBeforeInterval = market.getCurrentCap(marketId);
        
        // Try to trigger growth immediately (should not grow)
        vm.prank(trader2);
        market.buyShares{value: 0.1 ether}(marketId, ITruce.Outcome.No, 0.1 ether);
        
        uint256 capAfterImmediate = market.getCurrentCap(marketId);
        assertEq(capBeforeInterval, capAfterImmediate);
        
        // Wait for interval and try again
        vm.warp(block.timestamp + 2 hours);
        
        vm.prank(trader3);
        market.buyShares{value: 0.1 ether}(marketId, ITruce.Outcome.Yes, 0.1 ether);
        
        uint256 capAfterInterval = market.getCurrentCap(marketId);
        assertTrue(capAfterInterval > capBeforeInterval);
    }
    
    function testCanGrowCapQuery() public {
        vm.prank(creator);
        uint256 marketId = market.createMarket{value: 10 ether}(
            "Test market",
            block.timestamp + 30 days,
            10 ether,
            ITruce.MarketCategory.CRYPTO
        );
        
        // Initially should not be able to grow
        (bool canGrow, string memory reason) = market.canGrowCap(marketId);
        assertFalse(canGrow);
        console.log("Cannot grow:", reason);
        
        // Fill to 80%
        vm.prank(trader1);
        market.buyShares{value: 9 ether}(marketId, ITruce.Outcome.Yes, 9 ether);
        
        // Still cannot grow (time interval)
        (canGrow, reason) = market.canGrowCap(marketId);
        assertFalse(canGrow);
        console.log("Cannot grow:", reason);
        
        // Wait and check again
        vm.warp(block.timestamp + 2 hours);
        
        (canGrow, reason) = market.canGrowCap(marketId);
        assertTrue(canGrow);
        console.log("Can grow:", reason);
    }
    
    function testMaxCapLimit() public {
        vm.prank(creator);
        uint256 marketId = market.createMarket{value: 2 ether}(
            "Small market",
            block.timestamp + 7 days,
            2 ether,
            ITruce.MarketCategory.WEATHER
        );
        
        uint256 maxCap = 100 ether; // Weather max cap
        
        // Keep growing until we hit max
        for (uint i = 0; i < 20; i++) {
            uint256 currentCap = market.getCurrentCap(marketId);
            
            if (currentCap >= maxCap) {
                console.log("Hit max cap at iteration:", i);
                break;
            }
            
            // Add liquidity to trigger growth
            vm.prank(trader1);
            market.buyShares{value: 1 ether}(
                marketId,
                i % 2 == 0 ? ITruce.Outcome.Yes : ITruce.Outcome.No,
                1 ether
            );
            
            vm.warp(block.timestamp + 2 hours);
        }
        
        // Should be at or near max cap
        uint256 finalCap = market.getCurrentCap(marketId);
        assertTrue(finalCap >= maxCap * 4 / 5); // At least 80% of max cap
        
        // Further growth attempts should not increase cap
        (bool canGrow,) = market.canGrowCap(marketId);
        assertFalse(canGrow);
    }
    
    function testRealisticTradingScenario() public {
        // Simulate a popular crypto prediction market
        vm.prank(creator);
        uint256 marketId = market.createMarket{value: 10 ether}(
            "Will ETH hit $10k by end of 2025?",
            block.timestamp + 364 days,
            10 ether,
            ITruce.MarketCategory.CRYPTO
        );
        
        console.log("\n=== Realistic Trading Scenario ===");
        console.log("Initial pool: 10 ETH");
        console.log("Initial cap:", market.getCurrentCap(marketId) / 1 ether, "ETH");
        
        // Early adopter - small trade
        vm.prank(trader1);
        uint256 slippage1 = market.getExpectedSlippage(marketId, ITruce.Outcome.Yes, 1 ether);
        console.log("\nTrader 1 buys 1 ETH YES - Expected slippage:", slippage1, "bps");
        market.buyShares{value: 1 ether}(marketId, ITruce.Outcome.Yes, 1 ether);
        
        // Contrarian view
        vm.prank(trader2);
        uint256 slippage2 = market.getExpectedSlippage(marketId, ITruce.Outcome.No, 1.5 ether);
        console.log("Trader 2 buys 1.5 ETH NO - Expected slippage:", slippage2, "bps");
        market.buyShares{value: 1.5 ether}(marketId, ITruce.Outcome.No, 1.5 ether);
        
        // More interest builds
        vm.prank(trader3);
        uint256 slippage3 = market.getExpectedSlippage(marketId, ITruce.Outcome.Yes, 2 ether);
        console.log("Trader 3 buys 2 ETH YES - Expected slippage:", slippage3, "bps");
        market.buyShares{value: 2 ether}(marketId, ITruce.Outcome.Yes, 2 ether);
        
        // Check if we can grow
        (bool canGrow, string memory reason) = market.canGrowCap(marketId);
        console.log("\nCan grow cap?", canGrow, "-", reason);
        
        // Wait and trigger growth
        vm.warp(block.timestamp + 2 hours);
        
        vm.prank(trader1);
        market.buyShares{value: 1 ether}(marketId, ITruce.Outcome.No, 1 ether);
        
        console.log("New cap after growth:", market.getCurrentCap(marketId) / 1 ether, "ETH");
        
        // Now whale can enter with better slippage
        vm.prank(whale);
        uint256 slippageWhale = market.getExpectedSlippage(marketId, ITruce.Outcome.Yes, 5 ether);
        console.log("\nWhale buys 5 ETH YES - Expected slippage:", slippageWhale, "bps");
        market.buyShares{value: 5 ether}(marketId, ITruce.Outcome.Yes, 5 ether);
        
        // Compare to what slippage would have been before growth
        // (This would have been much higher on the smaller pool)
        console.log("\nFinal pool size: ~", (market.getMarket(marketId).totalYesShares + market.getMarket(marketId).totalNoShares) / 1 ether, "ETH");
    }
}
