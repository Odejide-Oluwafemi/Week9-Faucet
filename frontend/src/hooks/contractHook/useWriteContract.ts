import { useWriteTokenContract } from "../useContracts";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { ErrorDecoder, type DecodedError } from "ethers-decode-error";

export const useWriteFunctions = () => {
  const getContract = useWriteTokenContract();
  const [isMinting, setIsMinting] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isTransferringFrom, setIsTransferringFrom] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRequestingToken, setIsRequestingToken] = useState(false);
  const errorDecoder = useMemo(() => ErrorDecoder.create(), []);

  const mintToken = useCallback(
    async (account: string, amount: string) => {
      const contract = await getContract();
      if (!contract) { toast.error("Wallet not connected"); return; }
      try {
        setIsMinting(true);
        const tx = await contract.mint(account, BigInt(amount));
        const receipt = await tx.wait();
        return receipt.status === 1;
      } catch (error) {
        const decodedError: DecodedError = await errorDecoder.decode(error);
        toast.error(decodedError.reason);
        return false;
      } finally {
        setIsMinting(false);
      }
    },
    [getContract, errorDecoder]
  );

  const transfer = useCallback(
    async (amount: string, receiver: string) => {
      const contract = await getContract();
      if (!contract) { toast.error("Wallet not connected"); return; }
      try {
        setIsTransferring(true);
        const tx = await contract.transfer(receiver, BigInt(amount));
        const receipt = await tx.wait();
        return receipt.status === 1;
      } catch (error) {
        const decodedError: DecodedError = await errorDecoder.decode(error);
        toast.error(decodedError.reason);
        return false;
      } finally {
        setIsTransferring(false);
      }
    },
    [getContract, errorDecoder]
  );

  const transferFrom = useCallback(
    async (owner: string, receiver: string, amount: string) => {
      const contract = await getContract();
      if (!contract) { toast.error("Wallet not connected"); return; }
      try {
        setIsTransferringFrom(true);
        const tx = await contract.transferFrom(owner, receiver, BigInt(amount));
        const receipt = await tx.wait();
        return receipt.status === 1;
      } catch (error) {
        const decodedError: DecodedError = await errorDecoder.decode(error);
        toast.error(decodedError.reason);
        return false;
      } finally {
        setIsTransferringFrom(false);
      }
    },
    [getContract, errorDecoder]
  );

  const approve = useCallback(
    async (spender: string, amount: string) => {
      const contract = await getContract();
      if (!contract) { toast.error("Wallet not connected"); return; }
      try {
        setIsApproving(true);
        const tx = await contract.approve(spender, BigInt(amount));
        const receipt = await tx.wait();
        return receipt.status === 1;
      } catch (error) {
        const decodedError: DecodedError = await errorDecoder.decode(error);
        toast.error(decodedError.reason);
        return false;
      } finally {
        setIsApproving(false);
      }
    },
    [getContract, errorDecoder]
  );

  const requestToken = useCallback(async () => {
    const contract = await getContract();
    if (!contract) { toast.error("Wallet not connected"); return; }
    try {
      setIsRequestingToken(true);
      const tx = await contract.requestToken();
      const receipt = await tx.wait();
      return receipt.status === 1;
    } catch (error) {
      const decodedError: DecodedError = await errorDecoder.decode(error);
      toast.error(decodedError.reason);
      return false;
    } finally {
      setIsRequestingToken(false);
    }
  }, [getContract, errorDecoder]);

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
