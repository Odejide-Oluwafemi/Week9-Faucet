import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { BrowserProvider, type Eip1193Provider, type JsonRpcSigner } from "ethers";
import { jsonRpcProvider } from "../data/provider";
import { RunnersContext } from "./runnersContext";

export const RunnersProvider = ({ children }: { children: ReactNode }) => {
  const [signer, setSigner] = useState<JsonRpcSigner | undefined>();
  const { walletProvider } = useAppKitProvider<Eip1193Provider>("eip155");
  const { address, isConnected } = useAppKitAccount();

  useEffect(() => {
    if (!isConnected || !address) {
      const t = setTimeout(() => setSigner(undefined), 0);
      return () => clearTimeout(t);
    }
    // walletProvider may arrive in a separate render from address/isConnected.
    // If it isn't ready yet (or briefly null mid-tx), hold the current signer.
    if (!walletProvider) return;

    let cancelled = false;
    const browserProvider = new BrowserProvider(walletProvider);
    void browserProvider.getSigner().then((s) => {
      if (!cancelled) setSigner(s);
    });
    return () => {
      cancelled = true;
    };
  }, [address, isConnected, walletProvider]);

  const value = useMemo(
    () => ({ signer, readOnlyProvider: jsonRpcProvider }),
    [signer]
  );

  return (
    <RunnersContext.Provider value={value}>{children}</RunnersContext.Provider>
  );
};

