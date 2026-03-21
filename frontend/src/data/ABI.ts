export const TOKEN_ABI = [
  "function DECIMALS() view returns (uint8)",
  "function FAUCET_CLAIM_DELAY() view returns (uint256)",
  "function MAX_SUPPLY() view returns (uint128)",

  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 value) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",

  "function decimals() pure returns (uint8)",

  "function faucetClaimAmount() view returns (uint256)",

  "function getUserLastClaimTime(address _user) view returns (uint256)",
  "function getUserTimeSinceLastClaim(address _user) view returns (uint256)",

  "function i_owner() view returns (address)",

  "function lastClaimedAt(address user) view returns (uint256 lastTimeClaimed)",

  "function mint(address _to, uint256 _amount)",

  "function name() view returns (string)",
  "function symbol() view returns (string)",

  "function requestToken()",

  "function setFaucetClaimAmount(uint256 _amount)",

  "function totalSupply() view returns (uint256)",

  "function transfer(address to, uint256 value) returns (bool)",
  "function transferFrom(address from, address to, uint256 value) returns (bool)",

  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];