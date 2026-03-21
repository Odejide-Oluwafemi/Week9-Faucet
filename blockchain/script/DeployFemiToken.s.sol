// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import {Script} from "forge-std/Script.sol";
import {FemiToken} from "../src/FemiToken.sol";

contract DeployFemiToken is Script {
  function run() external returns (FemiToken) {
    vm.startBroadcast();

    FemiToken token = new FemiToken();

    vm.stopBroadcast();

    return token;
  
  }
}