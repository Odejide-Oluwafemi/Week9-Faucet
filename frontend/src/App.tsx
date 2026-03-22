import { useCallback, useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
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

const defaultTokenDetails: TokenDetails = {
  name: "-",
  symbol: "-",
  decimals: 18,
  currentSupply: "0",
  maxSupply: "0",
};

const formatCountdown = (seconds: number): string => {
  const s = Math.max(0, Math.floor(seconds));
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}h ${mm}m ${ss}s`;
};

const formatTokenValue = (value: string): string => {
  const n = Number(value);
  return Number.isNaN(n) ? value : n.toLocaleString(undefined, { maximumFractionDigits: 6 });
};

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("faucet");
  const [txCount, setTxCount] = useState(0);
  const [ownerAddress, setOwnerAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState("0");
  const [nextClaimSeconds, setNextClaimSeconds] = useState(0);
  const [lastClaimAt, setLastClaimAt] = useState("-");
  const [faucetClaimAmount, setFaucetClaimAmount] = useState("0");
  const [tokenDetails, setTokenDetails] = useState<TokenDetails>(defaultTokenDetails);

  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  // Debounce account clearing to survive brief mid-tx isConnected flickers
  const [account, setAccount] = useState<string | null>(null);
  const disconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (disconnectTimerRef.current) clearTimeout(disconnectTimerRef.current);
    if (isConnected && address) {
      const t = setTimeout(() => setAccount(address), 0);
      return () => clearTimeout(t);
    }
    disconnectTimerRef.current = setTimeout(() => {
      setAccount(null);
      disconnectTimerRef.current = null;
    }, 500);
    return () => {
      if (disconnectTimerRef.current) clearTimeout(disconnectTimerRef.current);
    };
  }, [address, isConnected]);

  const { getBalance, getOwner, getTokenDetail, getFaucetClaimAmount, getFaucetClaimDelay, getAllowance, getUserLastClaimTime, getUserTimeSinceLastClaim } = useReadFunctions();
  const { mintToken, transfer, transferFrom, approve, requestToken, isApproving, isMinting, isTransferring, isTransferringFrom, isRequestingToken } = useWriteFunctions();

  const isOwner = account?.toLowerCase() === ownerAddress?.toLowerCase();
  const loading = isMinting || isTransferring || isTransferringFrom || isApproving || isRequestingToken;
  const nextClaim = nextClaimSeconds > 0 ? formatCountdown(nextClaimSeconds) : "Now";

  const handleConnectWallet = () => void open();

  // Countdown ticker
  useEffect(() => {
    if (nextClaimSeconds <= 0) return undefined;
    const interval = setInterval(() => {
      setNextClaimSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [nextClaimSeconds]);

  const refreshTokenData = useCallback(async () => {
    const [detail, owner, faucetAmount] = await Promise.all([
      getTokenDetail(),
      getOwner(),
      getFaucetClaimAmount(),
    ]);
    if (detail) {
      setTokenDetails({
        name: detail.name,
        symbol: detail.symbol,
        decimals: detail.decimal,
        currentSupply: formatTokenValue(detail.currentSupply),
        maxSupply: formatTokenValue(detail.maxSupply),
      });
    }
    if (owner) setOwnerAddress(owner);
    if (faucetAmount) setFaucetClaimAmount(formatTokenValue(faucetAmount));
  }, [getFaucetClaimAmount, getOwner, getTokenDetail]);

  const refreshAccountData = useCallback(async () => {
    if (!account) return;
    const [bal, lastClaimTime, timeSinceClaim, faucetDelay] = await Promise.all([
      getBalance(account),
      getUserLastClaimTime(),
      getUserTimeSinceLastClaim(),
      getFaucetClaimDelay(),
    ]);
    if (bal != null) setBalance(formatTokenValue(bal));
    if (lastClaimTime != null) {
      const ts = Number(lastClaimTime);
      setLastClaimAt(ts > 0 ? new Date(ts * 1000).toLocaleString() : "Never");
    }
    if (timeSinceClaim != null && faucetDelay != null) {
      setNextClaimSeconds(Math.max(0, Number(faucetDelay) - Number(timeSinceClaim)));
    }
  }, [account, getBalance, getFaucetClaimDelay, getUserLastClaimTime, getUserTimeSinceLastClaim]);

  // Load token metadata once on mount
  useEffect(() => {
    const t = setTimeout(() => void refreshTokenData(), 0);
    return () => clearTimeout(t);
  }, [refreshTokenData]);

  // Load account data when wallet connects/changes
  useEffect(() => {
    if (!account) return;
    const t = setTimeout(() => void refreshAccountData(), 0);
    return () => clearTimeout(t);
  }, [account, refreshAccountData]);

  const handleRequestTokens = async () => {
    if (!account) { handleConnectWallet(); return; }
    const success = await requestToken();
    if (success) {
      setTxCount((n) => n + 1);
      toast.success(`Received ${faucetClaimAmount} ${tokenDetails.symbol} from faucet.`);
      await refreshAccountData();
      await refreshTokenData();
    }
  };

  const handleTransfer = async (to: string, amount: string) => {
    const success = await transfer(amount, to);
    if (success) {
      setTxCount((n) => n + 1);
      toast.success(`${amount} ${tokenDetails.symbol} sent to ${to.slice(0, 6)}...${to.slice(-4)}.`);
      await refreshAccountData();
      await refreshTokenData();
    }
  };

  const handleMint = async (to: string, amount: string) => {
    const success = await mintToken(to, amount);
    if (success) {
      setTxCount((n) => n + 1);
      toast.success(`${amount} ${tokenDetails.symbol} minted to ${to.slice(0, 6)}...${to.slice(-4)}.`);
      await refreshTokenData();
      await refreshAccountData();
    }
  };

  const getBalanceOf = async (addressToCheck: string): Promise<string> => {
    const result = await getBalance(addressToCheck);
    return result ? formatTokenValue(result) : "0";
  };

  const handleApprove = async (spender: string, amount: string) => {
    const success = await approve(spender, amount);
    if (success) {
      setTxCount((n) => n + 1);
      toast.success(`Approved ${amount} ${tokenDetails.symbol} for ${spender.slice(0, 6)}...${spender.slice(-4)}.`);
      await refreshAccountData();
    }
  };

  const handleCheckAllowance = async (owner: string, spender: string): Promise<string> => {
    const result = await getAllowance(owner, spender);
    return result ? formatTokenValue(result) : "0";
  };

  const handleTransferFrom = async (from: string, to: string, amount: string) => {
    const success = await transferFrom(from, to, amount);
    if (success) {
      setTxCount((n) => n + 1);
      toast.success(`${amount} ${tokenDetails.symbol} transferred from ${from.slice(0, 6)}...${from.slice(-4)}.`);
      await refreshAccountData();
      await refreshTokenData();
    }
  };

  const shortAddress = account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : "No wallet connected";

  const renderContent = () => {
    if (!account && activeTab !== "faucet" && activeTab !== "info") {
      return (
        <div className="empty-state">
          <h3>Wallet Needed For This View</h3>
          <p>Connect your wallet to unlock transfer and mint tools.</p>
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
            requesting={isRequestingToken}
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
            isTransferring={isTransferring}
            isApproving={isApproving}
            isTransferringFrom={isTransferringFrom}
          />
        );
      case "mint":
        return isOwner ? (
          <Mint handleMint={handleMint} loading={loading} />
        ) : (
          <p className="access-warning">Only the contract owner can access mint controls.</p>
        );
      case "info":
        return <TokenInfo tokenDetails={tokenDetails} getBalanceOf={getBalanceOf} />;
      default:
        return null;
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
        networkLabel="Lisk Sepolia Testnet"
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
              <span>Tx Sent in this session</span>
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
          {loading && <div className="busy-strip"><span /></div>}
          {renderContent()}
        </div>
      </main>
      <ToastContainer position="bottom-right" theme="dark" />
      <Footer />
    </div>
  );
}

export default App;
