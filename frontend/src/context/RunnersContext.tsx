import {
  useEffect,
  useRef,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { BrowserProvider, type Eip1193Provider, type JsonRpcSigner } from "ethers";
import { jsonRpcProvider } from "../data/provider";
import { RunnersContext } from "./runnersContextDef.ts";

export const RunnersProvider = ({ children }: { children: ReactNode }) => {
  const [signer, setSigner] = useState<JsonRpcSigner | undefined>();
  const { walletProvider } = useAppKitProvider<Eip1193Provider>("eip155");
  const { address, isConnected } = useAppKitAccount();

  // Keep a stable ref so the signer effect can always read the latest provider
  // without listing it as a reactive dependency (prevents mid-tx flickering).
  const walletProviderRef = useRef<Eip1193Provider | undefined>(undefined);
  useEffect(() => {
    walletProviderRef.current = walletProvider;
  }, [walletProvider]);

  // Re-derive the signer only when the connected address changes, not on every
  // walletProvider reference change. This prevents mid-transaction disconnects
  // caused by WalletConnect session refreshes that briefly null the provider.
  useEffect(() => {
    if (!isConnected || !address) {
      const t = setTimeout(() => setSigner(undefined), 0);
      return () => clearTimeout(t);
    }
    const wp = walletProviderRef.current;
    if (!wp) return;

    let cancelled = false;
    const browserProvider = new BrowserProvider(wp);
    void browserProvider.getSigner().then((newSigner) => {
      if (!cancelled) setSigner(newSigner);
    });
    return () => {
      cancelled = true;
    };
  }, [address, isConnected]);

  const value = useMemo(
    () => ({ signer, readOnlyProvider: jsonRpcProvider }),
    [signer]
  );

  return (
    <RunnersContext.Provider value={value}>{children}</RunnersContext.Provider>
  );
};
