// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import {Test} from "forge-std/Test.sol";
import {DeployFemiToken} from "../script/DeployFemiToken.s.sol";
import {FemiToken} from "../src/FemiToken.sol";

contract FemiTokenTest is Test {
  address public owner;
  address public youngAncient = makeAddr("Young Ancient");

  FemiToken token;
  DeployFemiToken deployToken;

  string public constant NAME = "FemiToken";
  string public constant SYMBOL = "FMT";
  uint8 public constant DECIMALS = 6;
  uint128 public constant MAX_SUPPLY = 10_000_000;

  function setUp() public {
    deployToken = new DeployFemiToken();

    (token, owner) = deployToken.run();
  }

  function test__InitialParametersAreSet() public {
    assertEq(token.name(), NAME);
    assertEq(token.symbol(), SYMBOL);
    assertEq(token.decimals(), DECIMALS);
    assertEq(token.totalSupply(), 0);
    assertEq(token.balanceOf(owner), 0);
    assertEq(token.i_owner(), owner);
  }

  function test__ItMintsWhenTotalSupplyIsNotAboveMaxSupplyLimit() public {
    uint256 _amount = MAX_SUPPLY;

    vm.prank(owner);
    token.mint(youngAncient, _amount);

    assertEq(token.balanceOf(youngAncient), _amount);
    assertEq(token.totalSupply(), _amount);
  }
  
  function test__ItMintsWhenTotalSupplyIsNotAboveMaxSupplyLimit() public {
    uint256 _amount = MAX_SUPPLY;

    vm.prank(owner);
    token.mint(youngAncient, _amount);

    assertEq(token.balanceOf(youngAncient), _amount);
    assertEq(token.totalSupply(), _amount);
  }
}