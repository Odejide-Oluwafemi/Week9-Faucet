// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract FemiToken is ERC20("FemiToken", "FMT") {
  error OnlyOwnerCanCallThisFucntion();
  error MaxSupplyLimitReached();

  uint8 public constant DECIMALS = 6;
  uint128 public constant MAX_SUPPLY = 10_000_000;
  address public immutable i_owner;

  constructor() {
    i_owner = msg.sender;
  }

  modifier onlyOwner() {
    if (msg.sender != i_owner) revert OnlyOwnerCanCallThisFucntion();

    _;
  }

  function decimals() public pure override returns (uint8) {
        return DECIMALS;
  }
  function mint(address _to, uint256 _amount) external onlyOwner {
    if (_amount + totalSupply() > MAX_SUPPLY) revert MaxSupplyLimitReached();

    _mint(_to, _amount);
  }
}