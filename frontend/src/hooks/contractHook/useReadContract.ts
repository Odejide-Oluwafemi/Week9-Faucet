import { toast } from "react-toastify";
import { useTokenContract } from "../useContracts";
import { useCallback } from "react";
import { useAppKitAccount } from "@reown/appkit/react";

export const useReadFunctions = () => {
  const tokenContract = useTokenContract();
  const { address } = useAppKitAccount();

  const getBalance = useCallback(async (account: string) => {
    if (!tokenContract) return null;
    try {
      const balance = await tokenContract.balanceOf(account);
      return balance.toString();
    } catch (error) {
      toast.error("Failed to fetch balance");
      console.error(error);
      return null;
    }
  }, [tokenContract]);

  const getOwner = useCallback(async () => {
    if (!tokenContract) return null;
    try {
      return await tokenContract.i_owner();
    } catch (error) {
      toast.error("Failed to fetch token owner");
      console.error(error);
      return null;
    }
  }, [tokenContract]);

  const getFaucetClaimAmount = useCallback(async () => {
    if (!tokenContract) return null;
    try {
      const amount = await tokenContract.faucetClaimAmount();
      return amount.toString();
    } catch (error) {
      toast.error("Failed to fetch faucet claim amount");
      console.error(error);
      return null;
    }
  }, [tokenContract]);

  const getFaucetClaimDelay = useCallback(async () => {
    if (!tokenContract) return null;
    try {
      const delay = await tokenContract.FAUCET_CLAIM_DELAY();
      return Number(delay);
    } catch (error) {
      toast.error("Failed to fetch faucet claim delay");
      console.error(error);
      return null;
    }
  }, [tokenContract]);

  const getTokenDetail = useCallback(async () => {
    if (!tokenContract) return null;
    try {
      const [name, symbol, currentSupply, maxSupply, decimal] = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.totalSupply(),
        tokenContract.MAX_SUPPLY(),
        tokenContract.DECIMALS(),
      ]);
      return {
        name,
        symbol,
        currentSupply: currentSupply.toString(),
        maxSupply: maxSupply.toString(),
        decimal,
      };
    } catch (error) {
      toast.error("Failed to fetch token details");
      console.error(error);
      return null;
    }
  }, [tokenContract]);

  const getUserLastClaimTime = useCallback(async () => {
    if (!tokenContract || !address) return null;
    try {
      return await tokenContract.getUserLastClaimTime(address);
    } catch (error) {
      toast.error("Failed to fetch last claim time");
      console.error(error);
      return null;
    }
  }, [tokenContract, address]);

  const getUserTimeSinceLastClaim = useCallback(async () => {
    if (!tokenContract || !address) return null;
    try {
      return await tokenContract.getUserTimeSinceLastClaim(address);
    } catch (error) {
      toast.error("Failed to fetch time since last claim");
      console.error(error);
      return null;
    }
  }, [tokenContract, address]);

  const getAllowance = useCallback(async (owner: string, spender: string) => {
    if (!tokenContract) return null;
    try {
      const result = await tokenContract.allowance(owner, spender);
      return result.toString();
    } catch (error) {
      toast.error("Failed to fetch allowance");
      console.error(error);
      return null;
    }
  }, [tokenContract]);

  return {
    getBalance,
    getOwner,
    getTokenDetail,
    getFaucetClaimAmount,
    getFaucetClaimDelay,
    getAllowance,
    getUserLastClaimTime,
    getUserTimeSinceLastClaim,
  };
};
