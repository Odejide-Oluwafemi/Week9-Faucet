import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ViewTabs from "./components/ViewTabs/ViewTabs";
import Faucet from "./components/Faucet/Faucet";
import Transfer from "./components/Transfer/Transfer";
import Mint from "./components/Mint/Mint";
import TokenInfo from "./components/TokenInfo/TokenInfo";
import "./connection.ts";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useReadFunctions } from "./hooks/contractHook/useReadContract.ts";
import { useWriteFunctions } from "./hooks/contractHook/useWriteContract.ts";

import type { Tab, TokenDetails } from "./types";

type ToastTone = "success" | "info" | "warning";

interface ToastItem {
  id: number;
  title: string;
  detail: string;
  tone: ToastTone;
}

const defaultTokenDetails: TokenDetails = {
  name: "-",
  symbol: "-",
  decimals: 18,
  currentSupply: "0",
  maxSupply: "0",
};

const formatCountdown = (seconds: number): string => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const hours = String(Math.floor(safeSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((safeSeconds % 3600) / 60)).padStart(2, "0");
  const secs = String(safeSeconds % 60).padStart(2, "0");
  return `${hours}h ${minutes}m ${secs}s`;
};

const formatTokenValue = (value: string): string => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return value;
  }
  return numeric.toLocaleString(undefined, { maximumFractionDigits: 6 });
};

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("faucet");
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [txCount, setTxCount] = useState(0);

  const [ownerAddress, setOwnerAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState("0");
  const [nextClaimSeconds, setNextClaimSeconds] = useState<number>(0);
  const [lastClaimAt, setLastClaimAt] = useState("-");
  const [faucetClaimAmount, setFaucetClaimAmount] = useState("0");
  const [tokenDetails, setTokenDetails] = useState<TokenDetails>(defaultTokenDetails);

  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const account = isConnected && address ? address : null;

  const {
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
    getUserTimeSinceLastClaim,
  } = useReadFunctions();

  const {
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
  } = useWriteFunctions();

  const isOwner = account?.toLowerCase() === ownerAddress?.toLowerCase();
  const networkLabel = "Lisk Sepolia Testnet";

  const loading = useMemo(
    () =>
      isLoadingBalance ||
      isLoadingDetails ||
      isLoadingFaucetClaimAmount ||
      isLoadingFaucetClaimDelay ||
      isGettingOwner ||
      isGettingAllowance ||
      isLoadingUserLastClaimTime ||
      isLoadingUserTimeSinceLastClaim ||
      isMinting ||
      isTransferring ||
      isTransferringFrom ||
      isApproving ||
      isRequestingToken,
    [
      isLoadingBalance,
      isLoadingDetails,
      isLoadingFaucetClaimAmount,
      isLoadingFaucetClaimDelay,
      isGettingOwner,
      isGettingAllowance,
      isLoadingUserLastClaimTime,
      isLoadingUserTimeSinceLastClaim,
      isMinting,
      isTransferring,
      isTransferringFrom,
      isApproving,
      isRequestingToken,
    ]
  );

  const nextClaim = useMemo(
    () => (nextClaimSeconds > 0 ? formatCountdown(nextClaimSeconds) : "Now"),
    [nextClaimSeconds]
  );

  const pushToast = useCallback(
    (title: string, detail: string, tone: ToastTone = "info") => {
      const id = Date.now() + Math.floor(Math.random() * 10000);
      setToasts((prev) => [...prev, { id, title, detail, tone }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 3400);
    },
    []
  );

  const handleConnectWallet = useCallback(() => {
    void open();
  }, [open]);

  useEffect(() => {
    if (nextClaimSeconds > 0) {
      const interval = setInterval(() => {
        setNextClaimSeconds((prev) => {
          if (prev <= 1) return 0;
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [nextClaimSeconds]);

  const refreshTokenData = useCallback(async () => {
    const [detailResult, ownerResult, faucetAmountResult] = await Promise.all([
      getTokenDetail(),
      getOwner(),
      getFaucetClaimAmount(),
    ]);

    if (detailResult) {
      setTokenDetails({
        name: detailResult.name,
        symbol: detailResult.symbol,
        decimals: detailResult.decimal,
        currentSupply: formatTokenValue(detailResult.currentSupply),
        maxSupply: formatTokenValue(detailResult.maxSupply),
      });
    }

    if (ownerResult) {
      setOwnerAddress(ownerResult);
    }

    if (faucetAmountResult) {
      setFaucetClaimAmount(formatTokenValue(faucetAmountResult));
    }
  }, [getFaucetClaimAmount, getOwner, getTokenDetail]);

  const refreshAccountData = useCallback(async () => {
    if (!account) {
      return;
    }

    const [balanceResult, lastClaimTimestampResult, elapsedSinceClaimResult, faucetDelayResult] = await Promise.all([
      getBalance(account),
      getUserLastClaimTime(),
      getUserTimeSinceLastClaim(),
      getFaucetClaimDelay(),
    ]);

    if (balanceResult !== null && balanceResult !== undefined) {
      setBalance(formatTokenValue(balanceResult));
    }

    if (lastClaimTimestampResult !== null && lastClaimTimestampResult !== undefined) {
      const ts = Number(lastClaimTimestampResult);
      if (ts > 0) {
        setLastClaimAt(new Date(ts * 1000).toLocaleString());
      } else {
        setLastClaimAt("Never");
      }
    }

    if (elapsedSinceClaimResult !== null && elapsedSinceClaimResult !== undefined && faucetDelayResult !== null && faucetDelayResult !== undefined) {
      const elapsedSeconds = Number(elapsedSinceClaimResult);
      const faucetDelaySeconds = Number(faucetDelayResult);
      const remaining = Math.max(0, faucetDelaySeconds - elapsedSeconds);
      setNextClaimSeconds(remaining);
    }
  }, [account, getBalance, getFaucetClaimDelay, getUserLastClaimTime, getUserTimeSinceLastClaim]);

  // Load token metadata on mount — no wallet needed (read-only).
  useEffect(() => {
    const timer = setTimeout(() => {
      void refreshTokenData();
    }, 0);
    return () => clearTimeout(timer);
  }, [refreshTokenData]);

  // Load account-specific data whenever the connected wallet address changes.
  useEffect(() => {
    if (!account) {
      return;
    }
    const timer = setTimeout(() => {
      void refreshAccountData();
    }, 0);
    return () => clearTimeout(timer);
  }, [account, refreshAccountData]);

  const handleRequestTokens = useCallback(async () => {
    if (!account) {
      handleConnectWallet();
      return;
    }

    const success = await requestToken();
    if (success) {
      setTxCount((prev) => prev + 1);
      pushToast("Faucet Claim Sent", `Received ${faucetClaimAmount} ${tokenDetails.symbol}.`, "success");
      await refreshAccountData();
      await refreshTokenData();
    }
  }, [account, faucetClaimAmount, handleConnectWallet, pushToast, refreshAccountData, refreshTokenData, requestToken, tokenDetails.symbol]);

  const handleTransfer = useCallback(async (to: string, amount: string) => {
    const success = await transfer(amount, to);
    if (success) {
      setTxCount((prev) => prev + 1);
      pushToast(
        "Transfer Confirmed",
        `${amount} ${tokenDetails.symbol} sent to ${to.slice(0, 6)}...${to.slice(-4)}.`,
        "success"
      );
      await refreshAccountData();
      await refreshTokenData();
    }
  }, [pushToast, refreshAccountData, refreshTokenData, tokenDetails.symbol, transfer]);

  const handleMint = useCallback(async (to: string, amount: string) => {
    const success = await mintToken(to, amount);
    if (success) {
      setTxCount((prev) => prev + 1);
      pushToast(
        "Mint Completed",
        `${amount} ${tokenDetails.symbol} minted to ${to.slice(0, 6)}...${to.slice(-4)}.`,
        "success"
      );
      await refreshTokenData();
      await refreshAccountData();
    }
  }, [mintToken, pushToast, refreshAccountData, refreshTokenData, tokenDetails.symbol]);

  const getBalanceOf = useCallback(async (addressToCheck: string): Promise<string> => {
    const queriedBalance = await getBalance(addressToCheck);
    if (!queriedBalance) {
      return "0";
    }
    return formatTokenValue(queriedBalance);
  }, [getBalance]);

  const handleApprove = useCallback(async (spender: string, amount: string) => {
    const success = await approve(spender, amount);
    if (success) {
      setTxCount((prev) => prev + 1);
      pushToast(
        "Approval Confirmed",
        `Approved ${amount} ${tokenDetails.symbol} for ${spender.slice(0, 6)}...${spender.slice(-4)}.`,
        "success"
      );
      await refreshAccountData();
    }
  }, [approve, pushToast, refreshAccountData, tokenDetails.symbol]);

  const handleCheckAllowance = useCallback(async (owner: string, spender: string): Promise<string> => {
    const allowance = await getAllowance(owner, spender);
    if (!allowance) {
      return "0";
    }
    return formatTokenValue(allowance);
  }, [getAllowance]);

  const handleTransferFrom = useCallback(async (from: string, to: string, amount: string) => {
    const success = await transferFrom(from, to, amount);
    if (success) {
      setTxCount((prev) => prev + 1);
      pushToast(
        "TransferFrom Confirmed",
        `${amount} ${tokenDetails.symbol} transferred from ${from.slice(0, 6)}...${from.slice(-4)} to ${to.slice(0, 6)}...${to.slice(-4)}.`,
        "success"
      );
      await refreshAccountData();
      await refreshTokenData();
    }
  }, [pushToast, refreshAccountData, refreshTokenData, tokenDetails.symbol, transferFrom]);

  const shortAddress = account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : "No wallet connected";

  const renderContent = () => {
    if (!account && activeTab !== "faucet" && activeTab !== "info") {
      return (
        <div className="empty-state">
          <h3>Wallet Needed For This View</h3>
          <p>
            Connect your wallet to unlock transfer and mint tools.
          </p>
          <button className="empty-state-btn" onClick={handleConnectWallet}>
            Connect Wallet
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case "faucet":
        return (
          <Faucet
            account={account}
            balance={balance}
            nextClaim={nextClaim}
            lastClaimAt={lastClaimAt}
            requestTokens={handleRequestTokens}
            onConnectWallet={handleConnectWallet}
            loading={loading}
            faucetClaimAmount={faucetClaimAmount}
          />
        );
      case "transfer":
        return (
          <Transfer
            handleTransfer={handleTransfer}
            handleApprove={handleApprove}
            handleCheckAllowance={handleCheckAllowance}
            handleTransferFrom={handleTransferFrom}
            loading={loading}
          />
        );
      case "mint":
        return isOwner ? (
          <Mint handleMint={handleMint} loading={loading} />
        ) : (
          <p className="access-warning">
            Only the contract owner can access mint controls.
          </p>
        );
      case "info":
        return (
          <TokenInfo tokenDetails={tokenDetails} getBalanceOf={getBalanceOf} />
        );
      default:
        return (
          <Faucet
            account={account}
            balance={balance}
            nextClaim={nextClaim}
            lastClaimAt={lastClaimAt}
            requestTokens={handleRequestTokens}
            onConnectWallet={handleConnectWallet}
            loading={loading}
            faucetClaimAmount={faucetClaimAmount}
          />
        );
    }
  };

  return (
    <div className="app-shell">
      <div className="ambient-shape ambient-shape-a" />
      <div className="ambient-shape ambient-shape-b" />
      <div className="ambient-shape ambient-shape-c" />
      <div className="ambient-grid" />
      <Header
        account={account}
        networkLabel={networkLabel}
        onConnectWallet={handleConnectWallet}
      />
      <main className="main-content">
        <section className="hero-panel">
          <p className="hero-kicker">Week 9 DApp Interface</p>
          <h2>Interact with Token</h2>
          <p className="hero-description">
            Claim faucet rewards, transfer test tokens, inspect token metadata,
            and mint as owner from one control surface.
          </p>
          <div className="hero-metrics">
            <div className="metric-pill">
              <span>Wallet</span>
              <strong>{shortAddress}</strong>
            </div>
            <div className="metric-pill">
              <span>Your FMT</span>
              <strong>{balance}</strong>
            </div>
            <div className="metric-pill">
              <span>Tx Sent Today</span>
              <strong>{txCount}</strong>
            </div>
            <div className={`metric-pill ${isOwner ? "owner-pill" : ""}`}>
              <span>Role</span>
              <strong>{isOwner ? "Owner" : "Participant"}</strong>
            </div>
          </div>
        </section>
        <ViewTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOwner={Boolean(isOwner)}
        />
        <div className="content-card">
          {loading && (
            <div className="busy-strip">
              <span />
            </div>
          )}
          {renderContent()}
        </div>
      </main>
      <div className="toast-stack" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => (
          <article key={toast.id} className={`toast-card toast-${toast.tone}`}>
            <strong>{toast.title}</strong>
            <p>{toast.detail}</p>
          </article>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default App;
