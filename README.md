# Femi Token DApp

A minimal DApp for interacting with the **FMT** ERC-20 token on Lisk Sepolia Testnet — claim from the faucet, transfer, approve, and mint (owner only). Web3Bridge Week9 Assessment

---

## Contract

| | |
|---|---|
| **Address** | 0xA2bFe62dE3DCa989A6b31d3E7309202d29c60178 |
| **Network** | Lisk Sepolia Testnet (chain ID 4202) |
| **Explorer** | [View on Blockscout](https://sepolia-blockscout.lisk.com/address/0xA2bFe62dE3DCa989A6b31d3E7309202d29c60178) |
| **Live Link** | https://femitoken-dapp.vercel.app/ |

---

## Stack

- **Frontend** — React, TypeScript, Vite
- **Web3** — ethers v6, Reown AppKit (WalletConnect)
- **Smart Contract** — Solidity, Foundry
- **Chain** — Lisk Sepolia Testnet

---

## Setup

```bash
# fill in VITE_APPKIT_PROJECT_ID in frontend/.env
npm install
npm run dev           
```

`.env` variables:

```env
VITE_APPKIT_PROJECT_ID=   # from cloud.reown.com
VITE_TOKEN_CONTRACT_ADDRESS=0xA2bFe62dE3DCa989A6b31d3E7309202d29c60178
VITE_RPC_URL=https://rpc.sepolia-api.lisk.com
```
