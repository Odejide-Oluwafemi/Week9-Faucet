import React, { useState } from 'react';
import './TokenInfo.css';
import type { TokenDetails } from '../../types';

const isValidAddress = (addr: string) => /^0x[0-9a-fA-F]{40}$/.test(addr);

interface TokenInfoProps {
  tokenDetails: TokenDetails;
  getBalanceOf: (address: string) => Promise<string>;
}

const TokenInfo: React.FC<TokenInfoProps> = ({ tokenDetails, getBalanceOf }) => {
  const [lookupAddress, setLookupAddress] = useState('');
  const [lookupBalance, setLookupBalance] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);

  const lookupError = lookupAddress !== '' && !isValidAddress(lookupAddress) ? 'Invalid Ethereum address' : '';

  const handleLookup = async () => {
    if (!isValidAddress(lookupAddress)) return;
    setIsLookingUp(true);
    const balance = await getBalanceOf(lookupAddress);
    setLookupBalance(balance);
    setIsLookingUp(false);
  };

  return (
    <div className="info-container">
      <div className="info-grid-token">
        <div className="info-item-token">
          <span className="info-label-token">Name</span>
          <span className="info-value-token">{tokenDetails.name}</span>
        </div>
        <div className="info-item-token">
          <span className="info-label-token">Symbol</span>
          <span className="info-value-token">{tokenDetails.symbol}</span>
        </div>
        <div className="info-item-token">
          <span className="info-label-token">Decimals</span>
          <span className="info-value-token">{tokenDetails.decimals}</span>
        </div>
        <div className="info-item-token full-width">
          <span className="info-label-token">Current Supply</span>
          <span className="info-value-token">{tokenDetails.currentSupply} FMT</span>
        </div>
        <div className="info-item-token full-width">
          <span className="info-label-token">Max Supply</span>
          <span className="info-value-token">{tokenDetails.maxSupply} FMT</span>
        </div>
      </div>

      <div className="balance-lookup">
        <h3 className="lookup-title">Check Balance of Address</h3>
        <div className="lookup-form">
          <input
            type="text"
            placeholder="Enter address"
            className={`lookup-input${lookupError ? ' input-error' : ''}`}
            value={lookupAddress}
            onChange={(e) => setLookupAddress(e.target.value)}
          />
          <button className="lookup-btn" onClick={handleLookup} disabled={isLookingUp || !isValidAddress(lookupAddress)}>
            {isLookingUp ? 'Checking...' : 'Check'}
          </button>
        </div>
        {lookupError && <span className="field-error-msg">{lookupError}</span>}
        {lookupBalance && (
          <div className="lookup-result">
            Balance: <span className="balance-value">{lookupBalance} FMT</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenInfo;
