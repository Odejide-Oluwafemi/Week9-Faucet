// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import {Test} from "forge-std/Test.sol";
import {DeployFemiToken} from "../script/DeployFemiToken.s.sol";
import {FemiToken} from "../src/FemiToken.sol";

contract FemiTokenTest is Test {
  FemiToken token;
  DeployFemiToken deployToken;


  function setUp() public {
    deployToken = new DeployFemiToken();

    token = deployToken.run();
  
  }

  function test__InitialParametersAreSet() public {
    assertEq(token.name(), "FemiToken");
    assertEq(token.symbol(), "FMT");
  }
}