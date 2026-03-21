import React from 'react';
import './Faucet.css';

interface FaucetProps {
  account: string | null;
  balance: string;
  nextClaim: string;
  lastClaimAt: string;
  faucetClaimAmount: string;
  requestTokens: () => void | Promise<void>;
  onConnectWallet: () => void;
  loading: boolean;
  requesting: boolean;
}

const Faucet: React.FC<FaucetProps> = ({ account, balance, nextClaim, lastClaimAt, faucetClaimAmount, requestTokens, onConnectWallet, loading, requesting }) => {
  return (
    <>
      <h2 className="faucet-title">Claim Tokens</h2>
      <p className="faucet-description">
        {faucetClaimAmount && faucetClaimAmount !== '0'
          ? `Get your daily dose of ${faucetClaimAmount} FMT tokens here. Connect your wallet to get started.`
          : 'Connect your wallet to claim your daily FMT tokens.'}
      </p>

      <div className="info-grid">
        <div className="info-item">
          <span className="info-label">Your Balance</span>
          <span className="info-value">{account ? balance : '-'} FMT</span>
        </div>
        <div className="info-item">
          <span className="info-label">Next Claim</span>
          <span className="info-value">{account ? nextClaim : '-'}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Last Claim</span>
          <span className="info-value">{account ? lastClaimAt : '-'}</span>
        </div>
      </div>

      {account ? (
        <button className="request-btn" onClick={requestTokens} disabled={loading || nextClaim !== 'Now'}>
          {requesting
            ? 'Requesting...'
            : faucetClaimAmount && faucetClaimAmount !== '0'
              ? `Request ${faucetClaimAmount} FMT`
              : 'Request Tokens'}
        </button>
      ) : (
        <button className="request-btn" onClick={onConnectWallet}>Connect Wallet to Claim</button>
      )}

      {account && (
        <div className="account-info">
          <span className="info-label">Connected as: </span>
          <span className="account-address">{account}</span>
        </div>
      )}
    </>
  );
};

export default Faucet;
