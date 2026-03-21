# Femi Token DApp

A minimal DApp for interacting with the **FMT** ERC-20 token on Lisk Sepolia Testnet — claim from the faucet, transfer, approve, and mint (owner only). Web3Bridge Week9 Assessment

---

## Contract

| | |
|---|---|
| **Address** | 0xA2bFe62dE3DCa989A6b31d3E7309202d29c60178 |
| **Network** | Lisk Sepolia Testnet (chain ID 4202) |
| **Explorer** | [View on Blockscout](https://sepolia-blockscout.lisk.com/address/0xA2bFe62dE3DCa989A6b31d3E7309202d29c60178) |

---

## Stack

- **Frontend** — React, TypeScript, Vite
- **Web3** — ethers v6, Reown AppKit (WalletConnect)
- **Smart Contract** — Solidity, Foundry
- **Chain** — Lisk Sepolia Testnet

---

## Setup

```bash
cp .env.example .env   # fill in VITE_APPKIT_PROJECT_ID
npm install
npm run dev            # http://localhost:5173
```

`.env` variables:

```env
VITE_APPKIT_PROJECT_ID=   # from cloud.reown.com
VITE_TOKEN_CONTRACT_ADDRESS=0xA2bFe62dE3DCa989A6b31d3E7309202d29c60178
VITE_RPC_URL=https://rpc.sepolia-api.lisk.com
```

---

## Deploy (Vercel)

1. Import the repo on [vercel.com](https://vercel.com/new)
2. Set **Root Directory** → `frontend`
3. Framework will be auto-detected as **Vite**
4. Add the following **Environment Variables** in the Vercel dashboard:

| Variable | Value |
|---|---|
| `VITE_APPKIT_PROJECT_ID` | your project ID from [cloud.reown.com](https://cloud.reown.com) |
| `VITE_TOKEN_CONTRACT_ADDRESS` | `0xA2bFe62dE3DCa989A6b31d3E7309202d29c60178` |
| `VITE_RPC_URL` | `https://rpc.sepolia-api.lisk.com` |

5. Click **Deploy** — done.