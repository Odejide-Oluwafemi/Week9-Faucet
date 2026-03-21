import { JsonRpcProvider } from "ethers";

// Uses VITE_RPC_URL from .env, falls back to public Lisk Sepolia RPC.
export const jsonRpcProvider = new JsonRpcProvider(
  import.meta.env.VITE_RPC_URL ?? "https://rpc.sepolia-api.lisk.com"
);

