import { toast } from "react-toastify";
import { useTokenContract } from "../useContracts";
import { useCallback, useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";

// will contain read functions
export const useReadFunctions = () => {
  const tokenContract = useTokenContract();
  const { address } = useAppKitAccount();
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isGettingOwner, setIsGettingOwner] = useState(false);
  const [isGettingAllowance, setIsGettingAllowance] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isLoadingFaucetClaimAmount, setIsLoadingFaucetClaimAmount] = useState(false);
  const [isLoadingFaucetClaimDelay, setIsLoadingFaucetClaimDelay] = useState(false);
  const [isLoadingUserLastClaimTime, setIsLoadingUserLastClaimTime] = useState(false);
  const [isLoadingUserTimeSinceLastClaim, setIsLoadingUserTimeSinceLastClaim] = useState(false);

  const getBalance = useCallback(async (account: string) => {
    if (!tokenContract) {
      toast.error("token contract not found!");
      return;
    }
    try {
      setIsLoadingBalance(true);
      const balance = await tokenContract.balanceOf(account);
      // Contract mints plain integers without decimal scaling, so display raw value.
      return balance.toString();
    } catch (error) {
      toast.error("Failed to fetch balance");
      console.error(error);
      return null;
    } finally {
      setIsLoadingBalance(false);
    }
  }, [tokenContract]);

  const getOwner = useCallback(async () => {
    if (!tokenContract) {
      toast.error("token contract not found!");
      return;
    }
    try {
      setIsGettingOwner(true);
      const owner = await tokenContract.i_owner();
      return owner;
    } catch (error) {
      toast.error("Failed to fetch token owner");
      console.error(error);
      return null;
    } finally {
      setIsGettingOwner(false);
    }
  }, [tokenContract]);

  const getFaucetClaimAmount = useCallback(async () => {
    if (!tokenContract) {
      toast.error("token contract not found!");
      return;
    }
    try {
      setIsLoadingFaucetClaimAmount(true);
      const amount = await tokenContract.faucetClaimAmount();
      // faucetClaimAmount is stored as a plain integer in the contract.
      return amount.toString();
    } catch (error) {
      toast.error("Failed to fetch faucet claim amount");
      console.error(error);
      return null;
    } finally {
      setIsLoadingFaucetClaimAmount(false);
    }
  }, [tokenContract]);

  const getFaucetClaimDelay = useCallback(async () => {
    if (!tokenContract) {
      toast.error("token contract not found!");
      return;
    }
    try {
      setIsLoadingFaucetClaimDelay(true);
      const delay = await tokenContract.FAUCET_CLAIM_DELAY();
      return Number(delay);
    } catch (error) {
      toast.error("Failed to fetch faucet claim delay");
      console.error(error);
      return null;
    } finally {
      setIsLoadingFaucetClaimDelay(false);
    }
  }, [tokenContract]);

  const getTokenDetail = useCallback(async () => {
    if (!tokenContract) {
      toast.error("token contract not found!");
      return;
    }
    try {
      setIsLoadingDetails(true);

      const name = await tokenContract.name();
      const symbol = await tokenContract.symbol();
      const currentSupply = await tokenContract.totalSupply();
      const maxSupply = await tokenContract.MAX_SUPPLY();
      const decimal = await tokenContract.DECIMALS();

      // Contract stores amounts as plain integers (not multiplied by 10^decimals),
      // so we must NOT apply formatUnits — just convert BigInt to string directly.
      return {
        name,
        symbol,
        currentSupply: currentSupply.toString(),
        maxSupply: maxSupply.toString(),
        decimal
      };
    } catch (error) {
      toast.error("Failed to fetch token detail");
      console.error(error);
      return null;
    } finally {
      setIsLoadingDetails(false);
    }
  }, [tokenContract]);

  const getUserLastClaimTime = useCallback(
    async() => {
      if (!tokenContract) {
      toast.error("token contract not found!");
      return;
    }
    if (!address) {
      toast.error("address is not found!");
      return;
    }
    try {
      setIsLoadingUserLastClaimTime(true);
      const lastClaimTime = await tokenContract.getUserLastClaimTime(address);
      return lastClaimTime;
    }
    catch (error) {
      toast.error("Failed to fetch token detail");
      console.error(error);
      return null;
    } finally {
      setIsLoadingUserLastClaimTime(false);
    }
  }, [tokenContract, address]);

  const getUserTimeSinceLastClaim = useCallback(
    async() => {
      if (!tokenContract) {
      toast.error("token contract not found!");
      return;
    }
    if (!address) {
      toast.error("address is not found!");
      return;
    }
    try {
      setIsLoadingUserTimeSinceLastClaim(true);
      const lastClaimTime = await tokenContract.getUserTimeSinceLastClaim(address);
      return lastClaimTime;
    }
    catch (error) {
      toast.error("Failed to fetch token detail");
      console.error(error);
      return null;
    } finally {
      setIsLoadingUserTimeSinceLastClaim(false);
    }
  }, [tokenContract, address]);

    const getAllowance = useCallback(async (account: string, spender: string) => {
    if (!tokenContract) {
      toast.error("token contract not found!");
      return;
    }
    if (!address) {
      toast.error("address is not found!");
      return;
    }
    try {
      setIsGettingAllowance(true);
      const balance = await tokenContract.allowance(account, spender);
      // Contract stores amounts as plain integers — display raw value.
      return balance.toString();
    } catch (error) {
      toast.error("Failed to fetch balance");
      console.error(error);
      return null;
    } finally {
      setIsGettingAllowance(false);
    }
  }, [tokenContract, address]);

  return {
    getBalance,
    getOwner,
    getTokenDetail,
    getFaucetClaimAmount,
    getFaucetClaimDelay,
    getAllowance,
    isLoadingBalance,
    isLoadingDetails,
    isLoadingFaucetClaimAmount,
    isLoadingFaucetClaimDelay,
    isGettingOwner,
    isGettingAllowance,
    isLoadingUserLastClaimTime,
    isLoadingUserTimeSinceLastClaim,
    getUserLastClaimTime,
    getUserTimeSinceLastClaim
  };
};
