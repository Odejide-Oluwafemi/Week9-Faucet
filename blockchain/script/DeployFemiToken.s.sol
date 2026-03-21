// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import {Script} from "forge-std/Script.sol";
import {FemiToken} from "../src/FemiToken.sol";

contract DeployFemiToken is Script {
  address public owner = makeAddr("Odejide Oluwafemi");

  function run() external returns (FemiToken, address) {
    vm.broadcast(owner);
    FemiToken token = new FemiToken();

    return (token, owner);
  }
}