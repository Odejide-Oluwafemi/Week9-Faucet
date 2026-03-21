import { useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider, type Eip1193Provider, JsonRpcSigner } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { jsonRpcProvider } from "../data/provider";

const useRunners = () => {
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const { walletProvider } = useAppKitProvider<Eip1193Provider>("eip155");

  const provider = useMemo(
    () => (walletProvider ? new BrowserProvider(walletProvider) : null),
    [walletProvider]
  );

  useEffect(() => {
    if (!provider) {
      setSigner(undefined);
      return;
    }
    let cancelled = false;
    void provider.getSigner().then((newSigner) => {
      if (!cancelled) setSigner(newSigner);
    });
    return () => {
      cancelled = true;
    };
  }, [provider]);
  return { provider, signer, readOnlyProvider: jsonRpcProvider };
};

export default useRunners;
