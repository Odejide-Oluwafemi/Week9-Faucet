import { createContext } from "react";
import type { JsonRpcSigner } from "ethers";
import { jsonRpcProvider } from "../data/provider";

export interface RunnersContextValue {
  signer: JsonRpcSigner | undefined;
  readOnlyProvider: typeof jsonRpcProvider;
}

export const RunnersContext = createContext<RunnersContextValue>({
  signer: undefined,
  readOnlyProvider: jsonRpcProvider,
});
