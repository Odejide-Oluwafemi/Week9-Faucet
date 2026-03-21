import React, { useState } from 'react';
import './Mint.css';

const isValidAddress = (addr: string) => /^0x[0-9a-fA-F]{40}$/.test(addr);
const isValidAmount = (amt: string) => {
  const n = Number(amt);
  return amt !== '' && isFinite(n) && n > 0;
};

interface MintProps {
  handleMint: (to: string, amount: string) => void | Promise<void>;
  loading: boolean;
}

const Mint: React.FC<MintProps> = ({ handleMint, loading }) => {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');

  const toError = to !== '' && !isValidAddress(to) ? 'Invalid Ethereum address' : '';
  const amountError = amount !== '' && !isValidAmount(amount) ? 'Amount must be greater than 0' : '';
  const canSubmit = isValidAddress(to) && isValidAmount(amount);

  const onMint = async () => {
    if (!canSubmit) return;
    await handleMint(to, amount);
    setTo('');
    setAmount('');
  };

  return (
    <div className="mint-container">
      <h3 className="mint-title">Mint Tokens (Admin)</h3>
      <p className="mint-description">Only the contract owner can perform this action.</p>
      <div className="mint-form">
        <div className="field-group">
          <input
            type="text"
            placeholder="Recipient Address"
            className={`mint-input${toError ? ' input-error' : ''}`}
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          {toError && <span className="field-error-msg">{toError}</span>}
        </div>
        <div className="field-group">
          <input
            type="number"
            placeholder="Amount"
            className={`mint-input${amountError ? ' input-error' : ''}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
          />
          {amountError && <span className="field-error-msg">{amountError}</span>}
        </div>
        <button className="mint-btn" onClick={onMint} disabled={loading || !canSubmit}>
          {loading ? 'Minting...' : 'Mint'}
        </button>
      </div>
    </div>
  );
};

export default Mint;
