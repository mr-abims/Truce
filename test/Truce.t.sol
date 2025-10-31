// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {TruceMarket} from "../src/Truce.sol";
import {ITruceMarket} from "../src/ITruce.sol";
import {TruceFactory} from "../src/TruceFactory.sol";
import {ITruceFactory as Factory} from "../src/ITruceFactory.sol";

contract TruceTest is Test {
    TruceFactory public factory;

    address public owner;
    address public creator;
    address public trader1;
    address public trader2;
    address public trader3;
    address public lp1;
    address public lp2;
    address public whale;

    uint256 constant INITIAL_BALANCE = 100 ether;
    uint256 constant MIN_LIQUIDITY = 10**3;
    address constant DEAD_ADDRESS = 0x000000000000000000000000000000000000dEaD;

    function setUp() public {
        owner = makeAddr("owner");
        creator = makeAddr("creator");
        trader1 = makeAddr("trader1");
        trader2 = makeAddr("trader2");
        trader3 = makeAddr("trader3");
        lp1 = makeAddr("lp1");
        lp2 = makeAddr("lp2");
        whale = makeAddr("whale");

        // Deploy contract
        factory = new TruceFactory();

        // Fund accounts
        vm.deal(creator, INITIAL_BALANCE);
        vm.deal(trader1, INITIAL_BALANCE);
        vm.deal(trader2, INITIAL_BALANCE);
        vm.deal(trader3, INITIAL_BALANCE);
        vm.deal(lp1, INITIAL_BALANCE);
        vm.deal(lp2, INITIAL_BALANCE);
        vm.deal(whale, 10000 ether);
    }

    // ============ BASIC MARKET CREATION TESTS ============

    function testCreateMarket() public {
        vm.prank(creator);
        address market = factory.createMarket{value: 10 ether}(
            "Will ETH hit $10k?", block.timestamp + 30 days, 10 ether, Factory.MarketCategory.CRYPTO
        );

        // Verify market is tracked
        assertTrue(factory.isValidMarket(market));
        assertEq(factory.getMarketCount(), 1);

        address[] memory allMarkets = factory.getAllMarkets();
        assertEq(allMarkets.length, 1);
        assertEq(allMarkets[0], market);

        // Verify creator tracking
        address[] memory creatorMarkets = factory.getMarketsByCreator(creator);
        assertEq(creatorMarkets.length, 1);
        assertEq(creatorMarkets[0], market);
    }

    function testCreatorGetsLPTokens() public {
        vm.prank(creator);
        address market = factory.createMarket{value: 10 ether}(
            "Will ETH hit $10k?", block.timestamp + 30 days, 10 ether, Factory.MarketCategory.CRYPTO
        );

        TruceMarket marketContract = TruceMarket(payable(market));

        // Creator should get LP tokens (not YES/NO shares!)
        uint256 creatorLPBalance = marketContract.balanceOf(creator);
        assertEq(creatorLPBalance, 10 ether - MIN_LIQUIDITY); // Initial liquidity minus burned minimum

        // Creator should NOT have YES/NO shares
        (uint256 yesShares, uint256 noShares) = marketContract.getUserShares(creator);
        assertEq(yesShares, 0);
        assertEq(noShares, 0);
    }

    function testMinimumLiquidityBurned() public {
        vm.prank(creator);
        address market = factory.createMarket{value: 10 ether}(
            "Will ETH hit $10k?", block.timestamp + 30 days, 10 ether, Factory.MarketCategory.CRYPTO
        );

        TruceMarket marketContract = TruceMarket(payable(market));

        // Check that MINIMUM_LIQUIDITY is burned to DEAD_ADDRESS
        uint256 burnedTokens = marketContract.balanceOf(DEAD_ADDRESS);
        assertEq(burnedTokens, MIN_LIQUIDITY);

        // Total supply should equal initial liquidity
        assertEq(marketContract.totalSupply(), 10 ether);
    }

    // ============ TRADING TESTS ============

    function testUserBuyShares() public {
        vm.prank(creator);
        address market = factory.createMarket{value: 10 ether}(
            "Will ETH hit $10k?", block.timestamp + 30 days, 10 ether, Factory.MarketCategory.CRYPTO
        );

        ITruceMarket marketContract = ITruceMarket(market);

        vm.prank(trader1);
        marketContract.buyShares{value: 1 ether}(ITruceMarket.Outcome.Yes);

        vm.prank(trader2);
        marketContract.buyShares{value: 0.5 ether}(ITruceMarket.Outcome.No);

        (uint256 yesShares1, uint256 noShares1) = marketContract.getUserShares(trader1);
        (uint256 yesShares2, uint256 noShares2) = marketContract.getUserShares(trader2);

        // Trader1: Bought YES
        assertGt(yesShares1, 0);
        assertEq(noShares1, 0);

        // Trader2: Bought NO
        assertEq(yesShares2, 0);
        assertGt(noShares2, 0);
    }

    function testFeesSplitCorrectly() public {
        vm.prank(creator);
        address market = factory.createMarket{value: 10 ether}(
            "Will ETH hit $10k?", block.timestamp + 30 days, 10 ether, Factory.MarketCategory.CRYPTO
        );

        TruceMarket marketContract = TruceMarket(payable(market));

        uint256 factoryBalanceBefore = address(factory).balance;

        // Trader buys 10 ETH worth
        vm.prank(trader1);
        marketContract.buyShares{value: 10 ether}(ITruceMarket.Outcome.Yes);

        // Total fee: 0.5% of 10 ETH = 0.05 ETH
        // Platform fee: 0.1% of 10 ETH = 0.01 ETH
        // LP fee: 0.4% of 10 ETH = 0.04 ETH

        uint256 factoryBalanceAfter = address(factory).balance;
        uint256 accumulatedFees = marketContract.accumulatedFees();

        assertEq(factoryBalanceAfter - factoryBalanceBefore, 0.01 ether); // Platform got 0.1%
        assertEq(accumulatedFees, 0.04 ether); // LPs get 0.4%
    }

    // ============ LP TOKEN TESTS ============

    function testAddLiquidity() public {
        vm.prank(creator);
        address market = factory.createMarket{value: 10 ether}(
            "Will ETH hit $10k?", block.timestamp + 30 days, 10 ether, Factory.MarketCategory.CRYPTO
        );

        TruceMarket marketContract = TruceMarket(payable(market));

        // LP adds liquidity
        vm.prank(lp1);
        uint256 lpTokens = marketContract.addLiquidity{value: 10 ether}();

        // Should receive proportional LP tokens
        assertGt(lpTokens, 0);
        assertEq(marketContract.balanceOf(lp1), lpTokens);
    }

    function testRemoveLiquidity() public {
        vm.prank(creator);
        address market = factory.createMarket{value: 10 ether}(
            "Will ETH hit $10k?", block.timestamp + 30 days, 10 ether, Factory.MarketCategory.CRYPTO
        );

        TruceMarket marketContract = TruceMarket(payable(market));

        // LP adds liquidity
        vm.prank(lp1);
        uint256 lpTokens = marketContract.addLiquidity{value: 10 ether}();

        // LP removes liquidity
        uint256 balanceBefore = lp1.balance;
        vm.prank(lp1);
        uint256 ethOut = marketContract.removeLiquidity(lpTokens);

        uint256 balanceAfter = lp1.balance;

        assertGt(ethOut, 0);
        assertEq(balanceAfter - balanceBefore, ethOut);
        assertEq(marketContract.balanceOf(lp1), 0); // LP tokens burned
    }

    function testLPFeesAccumulate() public {
        vm.prank(creator);
        address market = factory.createMarket{value: 10 ether}(
            "Will ETH hit $10k?", block.timestamp + 30 days, 10 ether, Factory.MarketCategory.CRYPTO
        );

        TruceMarket marketContract = TruceMarket(payable(market));

        // Make multiple trades to accumulate fees
        // Cap is 10 ETH, so we can safely trade up to ~7 ETH total
        vm.prank(trader1);
        marketContract.buyShares{value: 2 ether}(ITruceMarket.Outcome.Yes);

        vm.prank(trader2);
        marketContract.buyShares{value: 2 ether}(ITruceMarket.Outcome.No);

        vm.prank(trader3);
        marketContract.buyShares{value: 2 ether}(ITruceMarket.Outcome.Yes);

        // Total traded: 6 ETH
        // LP fee should be 0.4% of 6 ETH = 0.024 ETH
        assertEq(marketContract.accumulatedFees(), 0.024 ether);
    }

    function testLPEarnsFees() public {
        vm.prank(creator);
        address market = factory.createMarket{value: 10 ether}(
            "Will ETH hit $10k?", block.timestamp + 30 days, 10 ether, Factory.MarketCategory.CRYPTO
        );

        TruceMarket marketContract = TruceMarket(payable(market));

        // Creator has initial LP tokens
        uint256 creatorLPTokens = marketContract.balanceOf(creator);

        // Make multiple trades to accumulate fees (staying within cap)
        vm.prank(trader1);
        marketContract.buyShares{value: 2 ether}(ITruceMarket.Outcome.Yes);

        vm.prank(trader2);
        marketContract.buyShares{value: 2 ether}(ITruceMarket.Outcome.No);

        vm.prank(trader3);
        marketContract.buyShares{value: 2 ether}(ITruceMarket.Outcome.Yes);

        // Creator removes liquidity - should get original + fees
        vm.prank(creator);
        uint256 ethOut = marketContract.removeLiquidity(creatorLPTokens);

        // Should get more than 10 ETH back (original + fees from 6 ETH of trades)
        assertGt(ethOut, 10 ether);
    }

    function testMultipleLPs() public {
        vm.prank(creator);
        address market = factory.createMarket{value: 10 ether}(
            "Will ETH hit $10k?", block.timestamp + 30 days, 10 ether, Factory.MarketCategory.CRYPTO
        );

        TruceMarket marketContract = TruceMarket(payable(market));

        // Two LPs add liquidity
        vm.prank(lp1);
        uint256 lpTokens1 = marketContract.addLiquidity{value: 10 ether}();

        vm.prank(lp2);
        uint256 lpTokens2 = marketContract.addLiquidity{value: 10 ether}();

        // Both should have LP tokens
        assertGt(lpTokens1, 0);
        assertGt(lpTokens2, 0);
        assertEq(marketContract.balanceOf(lp1), lpTokens1);
        assertEq(marketContract.balanceOf(lp2), lpTokens2);
    }

    function testLPTokenTransferability() public {
        vm.prank(creator);
        address market = factory.createMarket{value: 10 ether}(
            "Will ETH hit $10k?", block.timestamp + 30 days, 10 ether, Factory.MarketCategory.CRYPTO
        );

        TruceMarket marketContract = TruceMarket(payable(market));

        uint256 creatorTokens = marketContract.balanceOf(creator);

        // Creator transfers LP tokens to lp1
        vm.prank(creator);
        marketContract.transfer(lp1, creatorTokens / 2);

        // Verify transfer
        assertEq(marketContract.balanceOf(lp1), creatorTokens / 2);
        assertEq(marketContract.balanceOf(creator), creatorTokens / 2);
    }

    // ============ RESOLUTION AND REDEMPTION TESTS ============

    function testResolveAndRedeemTraders() public {
        vm.prank(creator);
        address market = factory.createMarket{value: 10 ether}(
            "Will ETH hit $10k?", block.timestamp + 30 days, 10 ether, Factory.MarketCategory.CRYPTO
        );

        ITruceMarket marketContract = ITruceMarket(market);

        // Trading
        vm.prank(trader1);
        marketContract.buyShares{value: 10 ether}(ITruceMarket.Outcome.Yes);

        vm.prank(trader2);
        marketContract.buyShares{value: 10 ether}(ITruceMarket.Outcome.No);

        // Fast forward and resolve
        vm.warp(block.timestamp + 31 days);
        vm.prank(creator);
        marketContract.resolveMarket(ITruceMarket.Outcome.Yes);

        // Finalize
        vm.warp(block.timestamp + 2 days);
        marketContract.finalizeResolution();

        // Trader1 (YES holder) redeems
        uint256 balanceBefore = trader1.balance;
        vm.prank(trader1);
        uint256 payout = marketContract.redeemWinnings();

        assertGt(payout, 0);
        assertEq(trader1.balance - balanceBefore, payout);
    }

    function testRedeemLPTokensAfterResolution() public {
        vm.prank(creator);
        address market = factory.createMarket{value: 10 ether}(
            "Will ETH hit $10k?", block.timestamp + 30 days, 10 ether, Factory.MarketCategory.CRYPTO
        );

        TruceMarket marketContract = TruceMarket(payable(market));

        // Trading
        vm.prank(trader1);
        marketContract.buyShares{value: 10 ether}(ITruceMarket.Outcome.Yes);

        vm.prank(trader2);
        marketContract.buyShares{value: 10 ether}(ITruceMarket.Outcome.No);

        // Fast forward and resolve
        vm.warp(block.timestamp + 31 days);
        vm.prank(creator);
        marketContract.resolveMarket(ITruceMarket.Outcome.Yes);

        // Finalize
        vm.warp(block.timestamp + 2 days);
        marketContract.finalizeResolution();

        // Winners redeem
        vm.prank(trader1);
        marketContract.redeemWinnings();

        // Creator (LP) redeems LP tokens
        uint256 creatorLPBalance = marketContract.balanceOf(creator);
        assertGt(creatorLPBalance, 0);

        uint256 balanceBefore = creator.balance;
        vm.prank(creator);
        uint256 lpPayout = marketContract.redeemLPTokens();

        assertGt(lpPayout, 0);
        assertEq(creator.balance - balanceBefore, lpPayout);
        assertEq(marketContract.balanceOf(creator), 0); // LP tokens burned
    }

    // ============ CAP GROWTH TESTS (NO MAX CAP) ============

    function testMarketGrowsUnlimited() public {
        vm.prank(creator);
        address market = factory.createMarket{value: 1 ether}(
            "Will ETH hit $10k?", block.timestamp + 30 days, 1 ether, Factory.MarketCategory.CRYPTO
        );

        TruceMarket marketContract = TruceMarket(payable(market));

        // Initial cap
        uint256 initialCap = marketContract.getCurrentCap();
        assertEq(initialCap, 1 ether);

        // Buy shares to trigger growth (80% utilization)
        vm.prank(trader1);
        marketContract.buyShares{value: 0.8 ether}(ITruceMarket.Outcome.Yes);

        // Cap should have doubled
        uint256 newCap = marketContract.getCurrentCap();
        assertEq(newCap, 2 ether);

        // Continue growing - no max cap!
        vm.prank(whale);
        marketContract.buyShares{value: 1.6 ether}(ITruceMarket.Outcome.No);

        uint256 cap3 = marketContract.getCurrentCap();
        assertEq(cap3, 4 ether);

        // Keep growing
        vm.prank(whale);
        marketContract.buyShares{value: 3.2 ether}(ITruceMarket.Outcome.Yes);

        uint256 cap4 = marketContract.getCurrentCap();
        assertEq(cap4, 8 ether);

        // Market can grow indefinitely!
    }

    function testLargeMarketSupported() public {
        vm.prank(creator);
        address market = factory.createMarket{value: 100 ether}(
            "Will ETH hit $10k?", block.timestamp + 30 days, 100 ether, Factory.MarketCategory.CRYPTO
        );

        TruceMarket marketContract = TruceMarket(payable(market));

        // Whale can add massive liquidity
        vm.prank(whale);
        marketContract.addLiquidity{value: 1000 ether}();

        // Total LP tokens should reflect both contributions
        uint256 totalSupply = marketContract.totalSupply();
        assertGt(totalSupply, 100 ether);
    }

    // ============ EDGE CASES ============

    function testCannotRemoveLiquidityAfterResolution() public {
        vm.prank(creator);
        address market = factory.createMarket{value: 10 ether}(
            "Will ETH hit $10k?", block.timestamp + 30 days, 10 ether, Factory.MarketCategory.CRYPTO
        );

        TruceMarket marketContract = TruceMarket(payable(market));

        // Resolve market
        vm.warp(block.timestamp + 31 days);
        vm.prank(creator);
        marketContract.resolveMarket(ITruceMarket.Outcome.Yes);

        vm.warp(block.timestamp + 2 days);
        marketContract.finalizeResolution();

        // Cannot remove liquidity after resolved
        uint256 creatorLPBalance = marketContract.balanceOf(creator);
        vm.prank(creator);
        vm.expectRevert("Market not active");
        marketContract.removeLiquidity(creatorLPBalance);
    }

    function testMinimumDepositEnforced() public {
        vm.prank(creator);
        address market = factory.createMarket{value: 10 ether}(
            "Will ETH hit $10k?", block.timestamp + 30 days, 10 ether, Factory.MarketCategory.CRYPTO
        );

        TruceMarket marketContract = TruceMarket(payable(market));

        // Try to add less than minimum
        vm.prank(lp1);
        vm.expectRevert("Minimum 0.001 ETH");
        marketContract.addLiquidity{value: 0.0001 ether}();
    }
}
