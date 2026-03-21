import { useAppKitAccount } from "@reown/appkit/react";
import { useTokenContract } from "../useContracts";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { ErrorDecoder, type DecodedError } from "ethers-decode-error";

// will contain write functions
export const useWriteFunctions = () => {
  const tokenContract = useTokenContract(true);
  const { address } = useAppKitAccount();
  const [isMinting, setIsMinting] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isTransferringFrom, setIsTransferringFrom] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRequestingToken, setIsRequestingToken] = useState(false);
  const errorDecoder = useMemo(() => ErrorDecoder.create(), []);

  const mintToken = useCallback(
    async (account: string, amount: string) => {
      if (!tokenContract) {
        toast.error("token contract not found!");
        return;
      }
      if (!address) {
        toast.error("address is not found!");
        return;
      }
      try {
        // call mint function
        setIsMinting(true);
        // Contract stores amounts as plain integers — pass directly without parseUnits.
        const mintTx = await tokenContract.mint(account, BigInt(amount));
        const reciept = await mintTx.wait();
        return reciept.status === 1;
      } catch (error) {
        console.error(error);
        const decodedError: DecodedError = await errorDecoder.decode(error);
        toast.error(decodedError.reason);
        return false;
      } finally {
        setIsMinting(false);
      }
    },
    [tokenContract, address, errorDecoder]
  );

  const transfer = useCallback(
    async (amount: string, receiver: string) => {
      if (!tokenContract) {
        toast.error("token contract not found!");
        return;
      }
      try {
        // call transfer function
        setIsTransferring(true);
        // Contract stores amounts as plain integers — pass directly without parseUnits.
        const transferTx = await tokenContract.transfer(receiver, BigInt(amount));
        const reciept = await transferTx.wait();
        return reciept.status === 1;
      } catch (error) {
        const decodedError: DecodedError = await errorDecoder.decode(error);
        toast.error(decodedError.reason);
        return false;
      } finally {
        setIsTransferring(false);
      }
    },
    [errorDecoder, tokenContract]
  );

  const transferFrom = useCallback(
    async (owner: string, receiver: string, amount: string, ) => {
      if (!tokenContract) {
        toast.error("token contract not found!");
        return;
      }
      try {
        // call transferFrom function
        setIsTransferringFrom(true);
        // Contract stores amounts as plain integers — pass directly without parseUnits.
        const transferTx = await tokenContract.transferFrom(owner, receiver, BigInt(amount));
        const reciept = await transferTx.wait();
        return reciept.status === 1;
      } catch (error) {
        const decodedError: DecodedError = await errorDecoder.decode(error);
        toast.error(decodedError.reason);
        return false;
      } finally {
        setIsTransferringFrom(false);
      }
    },
    [errorDecoder, tokenContract]
  );

  const approve = useCallback(
    async (spender: string, amount: string, ) => {
      if (!tokenContract) {
        toast.error("token contract not found!");
        return;
      }
      try {
        // call approve function
        setIsApproving(true);
        // Contract stores amounts as plain integers — pass directly without parseUnits.
        const transferTx = await tokenContract.approve(spender, BigInt(amount));
        const reciept = await transferTx.wait();
        return reciept.status === 1;
      } catch (error) {
        const decodedError: DecodedError = await errorDecoder.decode(error);
        toast.error(decodedError.reason);
        return false;
      } finally {
        setIsApproving(false);
      }
    },
    [errorDecoder, tokenContract]
  );

  const requestToken = useCallback(async () => {
    if (!tokenContract) {
      toast.error("token contract not found!");
      return;
    }
    if (!address) {
      toast.error("address is not found!");
      return;
    }
    try {
      setIsRequestingToken(true);
      const requestTx = await tokenContract.requestToken();
      const reciept = await requestTx.wait();
      return reciept.status === 1;
    } catch (error) {
      const decodedError: DecodedError = await errorDecoder.decode(error);
      toast.error(decodedError.reason);
      return false;
    } finally {
      setIsRequestingToken(false);
    }
  }, [address, errorDecoder, tokenContract]);

  return {
    mintToken,
    transfer,
    transferFrom,
    approve,
    requestToken,
    isApproving,
    isMinting,
    isTransferring,
    isTransferringFrom,
    isRequestingToken,
  };
};
