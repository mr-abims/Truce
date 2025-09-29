// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/Truce.sol";
import "../src/ITruce.sol";
import "../src/TruceFactory.sol";
import {ITruceFactory, ITruceFactory as Factory} from "../src/ITruceFactory.sol";

contract TruceTest is Test {
    TruceFactory public factory;

    address public owner;
    address public creator;
    address public trader1;
    address public trader2;
    address public trader3;
    address public whale;

    uint256 constant INITIAL_BALANCE = 100 ether;

    function setUp() public {
        owner = makeAddr("owner");
        creator = makeAddr("creator");
        trader1 = makeAddr("trader1");
        trader2 = makeAddr("trader2");
        trader3 = makeAddr("trader3");
        whale = makeAddr("whale");

        // Deploy contract
        factory = new TruceFactory();

        // Fund accounts
        vm.deal(creator, INITIAL_BALANCE);
        vm.deal(trader1, INITIAL_BALANCE);
        vm.deal(trader2, INITIAL_BALANCE);
        vm.deal(trader3, INITIAL_BALANCE);
        vm.deal(whale, 10000 ether);
    }

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
        address market2 = factory.createMarket{value: 10 ether}(
            "Manchester United will win the Champions League",
            block.timestamp + 30 days,
            10 ether,
            Factory.MarketCategory.SPORTS
        );
        // Verify market is tracked
        assertTrue(factory.isValidMarket(market2));
        assertEq(factory.getMarketCount(), 2);
    }

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
        vm.prank(trader3);
        marketContract.buyShares{value: 3 ether}(ITruceMarket.Outcome.Yes);
        (uint256 yesShares1, uint256 noShares1) = marketContract.getUserShares(trader1);
        (uint256 yesShares2, uint256 noShares2) = marketContract.getUserShares(trader2);
        (uint256 yesShares3, uint256 noShares3) = marketContract.getUserShares(trader3);

        // Trader1: Bought YES with 1 ETH - should get less than 1 ETH worth due to slippage
        assertGt(yesShares1, 0);
        assertLt(yesShares1, 1 ether); 
        assertEq(noShares1, 0);

        
        assertEq(yesShares2, 0);
        assertGt(noShares2, 0);
        assertLt(noShares2, 0.5 ether); 

        assertGt(yesShares3, 0);
        assertLt(yesShares3, 3 ether); 
        assertEq(noShares3, 0);

    }


    function testRedeemWinnings() public {
        testUserBuyShares();

        address market = factory.getAllMarkets()[0];
        ITruceMarket marketContract = ITruceMarket(market);

        (uint256 trader1Yes,) = marketContract.getUserShares(trader1);
        (uint256 trader2Yes, uint256 trader2No) = marketContract.getUserShares(trader2);
        (uint256 trader3Yes,) = marketContract.getUserShares(trader3);

        vm.warp(block.timestamp + 31 days);

        // Creator resolves market to YES (trader1 and trader3 win)
        vm.prank(creator);
        marketContract.resolveMarket(ITruceMarket.Outcome.Yes);

        // Record ETH balances before redemption
        uint256 trader1EthBefore = trader1.balance;
        uint256 trader2EthBefore = trader2.balance;
        uint256 trader3EthBefore = trader3.balance;

        // Winners redeem their winnings
        vm.prank(trader1);
        uint256 trader1Winnings = marketContract.redeemWinnings();

        vm.prank(trader3);
        uint256 trader3Winnings = marketContract.redeemWinnings();

        // Verify winners got winnings
        assertGt(trader1Winnings, 0);
        assertGt(trader3Winnings, 0);

        // Verify ETH balances increased
        assertEq(trader1.balance, trader1EthBefore + trader1Winnings);
        assertEq(trader3.balance, trader3EthBefore + trader3Winnings);

        // Verify trader3 got more winnings (had more YES shares)
        assertGt(trader3Winnings, trader1Winnings);

        // Verify loser (trader2) gets nothing when trying to redeem
        vm.prank(trader2);
        vm.expectRevert("No winning shares");
        marketContract.redeemWinnings();

        // Verify trader2's balance unchanged
        assertEq(trader2.balance, trader2EthBefore);

        // Verify shares were cleared for winners
        (uint256 trader1YesAfter,) = marketContract.getUserShares(trader1);
        (uint256 trader3YesAfter,) = marketContract.getUserShares(trader3);
        assertEq(trader1YesAfter, 0);
        assertEq(trader3YesAfter, 0);
    }
}
