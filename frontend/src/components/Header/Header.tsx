import React from 'react';
import './Header.css';

interface HeaderProps {
  account: string | null;
  networkLabel: string;
  onConnectWallet: () => void;
}

const Header: React.FC<HeaderProps> = ({ account, networkLabel, onConnectWallet }) => {
  const walletLabel = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet';

  return (
    <header className="app-header">
      <div className="logo-block">
        <p className="logo-eyebrow">Web3Bridge</p>
        <h1>Femi Token DApp</h1>
      </div>
      <div className="header-actions">
        <span className="network-pill">
          <span className="network-dot" />
          {networkLabel}
        </span>
        <button className="connect-wallet-btn" onClick={onConnectWallet}>
          {walletLabel}
        </button>
      </div>
    </header>
  );
};

export default Header;
