import { useCallback, useMemo } from "react";
import { useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider, Contract, type Eip1193Provider, getAddress } from "ethers";
import { TOKEN_ABI } from "../data/ABI";
import { jsonRpcProvider } from "../data/provider";

const CONTRACT_ADDRESS = getAddress(import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS);

// Read-only — no wallet needed
export const useTokenContract = () =>
  useMemo(() => new Contract(CONTRACT_ADDRESS, TOKEN_ABI, jsonRpcProvider), []);

// Returns an async factory. Call it inside write functions so getSigner()
// is only invoked at the moment the user clicks a button, not on every render.
export const useWriteTokenContract = () => {
  const { walletProvider } = useAppKitProvider<Eip1193Provider>("eip155");
  return useCallback(async () => {
    if (!walletProvider) return null;
    const signer = await new BrowserProvider(walletProvider).getSigner();
    return new Contract(CONTRACT_ADDRESS, TOKEN_ABI, signer);
  }, [walletProvider]);
};

