// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract FemiToken is ERC20("FemiToken", "FMT") {
  error OnlyOwnerCanCallThisFucntion();
  error MaxSupplyLimitReached();
  error CannotClaimYet();

  uint8 public constant DECIMALS = 6;
  uint128 public constant MAX_SUPPLY = 10_000_000;
  address public immutable i_owner;
  uint256 public faucetClaimAmount = 100;
  uint256 public constant FAUCET_CLAIM_DELAY = 24 hours;

  mapping(address user => uint256 lastTimeClaimed) public lastClaimedAt;

  constructor() {
    i_owner = msg.sender;
  }

  modifier onlyOwner() {
    if (msg.sender != i_owner) revert OnlyOwnerCanCallThisFucntion();

    _;
  }

  modifier onlyValidMint(uint256 _amount) {
    if (_amount + totalSupply() > MAX_SUPPLY) revert MaxSupplyLimitReached();

    _;
  }

  function decimals() public pure override returns (uint8) {
        return DECIMALS;
  }

  function mint(address _to, uint256 _amount) external onlyOwner onlyValidMint(_amount) {
    _mint(_to, _amount);
  }

  function requestToken() external onlyValidMint(faucetClaimAmount) {
    if (lastClaimedAt[msg.sender] != 0 && block.timestamp < lastClaimedAt[msg.sender] + FAUCET_CLAIM_DELAY) revert CannotClaimYet();

    lastClaimedAt[msg.sender] = block.timestamp;
    _mint(msg.sender, faucetClaimAmount);
  }

  function setFaucetClaimAmount(uint256 _amount) external onlyOwner {
    faucetClaimAmount = _amount;
  }

  function getUserLastClaimTime(address _user) external view returns (uint256) {
    return lastClaimedAt[_user];
  }

  function getUserTimeSinceLastClaim(address _user) external view returns (uint256) {
    uint256 timeSinceLastClaim = block.timestamp - lastClaimedAt[_user];

    return timeSinceLastClaim;
  }

}