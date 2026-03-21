import React, { useState } from 'react';
import './Transfer.css';

const isValidAddress = (addr: string) => /^0x[0-9a-fA-F]{40}$/.test(addr);
const isValidAmount = (amt: string) => {
  const n = Number(amt);
  return amt !== '' && isFinite(n) && n > 0;
};

interface TransferProps {
  handleTransfer: (to: string, amount: string) => void | Promise<void>;
  handleApprove: (spender: string, amount: string) => void | Promise<void>;
  handleCheckAllowance: (owner: string, spender: string) => Promise<string>;
  handleTransferFrom: (from: string, to: string, amount: string) => void | Promise<void>;
  isTransferring: boolean;
  isApproving: boolean;
  isTransferringFrom: boolean;
}

const Transfer: React.FC<TransferProps> = ({
  handleTransfer,
  handleApprove,
  handleCheckAllowance,
  handleTransferFrom,
  isTransferring,
  isApproving,
  isTransferringFrom,
}) => {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');

  const [approveTo, setApproveTo] = useState('');
  const [approveAmount, setApproveAmount] = useState('');

  const [checkOwner, setCheckOwner] = useState('');
  const [checkSpender, setCheckSpender] = useState('');
  const [allowanceResult, setAllowanceResult] = useState<string | null>(null);
  const [allowanceLoading, setAllowanceLoading] = useState(false);

  const [transferFromFrom, setTransferFromFrom] = useState('');
  const [transferFromTo, setTransferFromTo] = useState('');
  const [transferFromAmount, setTransferFromAmount] = useState('');

  // Validation errors — only shown when field has a value
  const toError = to !== '' && !isValidAddress(to) ? 'Invalid Ethereum address' : '';
  const amountError = amount !== '' && !isValidAmount(amount) ? 'Amount must be greater than 0' : '';
  const approveToError = approveTo !== '' && !isValidAddress(approveTo) ? 'Invalid Ethereum address' : '';
  const approveAmountError = approveAmount !== '' && !isValidAmount(approveAmount) ? 'Amount must be greater than 0' : '';
  const checkOwnerError = checkOwner !== '' && !isValidAddress(checkOwner) ? 'Invalid Ethereum address' : '';
  const checkSpenderError = checkSpender !== '' && !isValidAddress(checkSpender) ? 'Invalid Ethereum address' : '';
  const tfFromError = transferFromFrom !== '' && !isValidAddress(transferFromFrom) ? 'Invalid Ethereum address' : '';
  const tfToError = transferFromTo !== '' && !isValidAddress(transferFromTo) ? 'Invalid Ethereum address' : '';
  const tfAmountError = transferFromAmount !== '' && !isValidAmount(transferFromAmount) ? 'Amount must be greater than 0' : '';

  const onTransfer = async () => {
    if (!isValidAddress(to) || !isValidAmount(amount)) return;
    await handleTransfer(to, amount);
    setTo('');
    setAmount('');
  };

  const onApprove = async () => {
    if (!isValidAddress(approveTo) || !isValidAmount(approveAmount)) return;
    await handleApprove(approveTo, approveAmount);
    setApproveTo('');
    setApproveAmount('');
  };

  const onCheckAllowance = async () => {
    if (!isValidAddress(checkOwner) || !isValidAddress(checkSpender)) return;
    setAllowanceLoading(true);
    try {
      const result = await handleCheckAllowance(checkOwner, checkSpender);
      setAllowanceResult(result);
    } finally {
      setAllowanceLoading(false);
    }
  };

  const onTransferFrom = async () => {
    if (!isValidAddress(transferFromFrom) || !isValidAddress(transferFromTo) || !isValidAmount(transferFromAmount)) return;
    await handleTransferFrom(transferFromFrom, transferFromTo, transferFromAmount);
    setTransferFromFrom('');
    setTransferFromTo('');
    setTransferFromAmount('');
  };

  return (
    <div className="transfer-container">

      {/* Transfer */}
      <div className="ti-section">
        <h3 className="ti-section-heading">Transfer Tokens</h3>
        <p className="ti-section-description">Send your FMT tokens directly to another address.</p>
        <div className="transfer-form">
          <div className="field-group">
            <input
              type="text"
              placeholder="Recipient Address"
              className={`transfer-input${toError ? ' input-error' : ''}`}
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
            {toError && <span className="field-error-msg">{toError}</span>}
          </div>
          <div className="field-group">
            <input
              type="number"
              placeholder="Amount"
              className={`transfer-input${amountError ? ' input-error' : ''}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
            />
            {amountError && <span className="field-error-msg">{amountError}</span>}
          </div>
          <button className="transfer-btn" onClick={onTransfer} disabled={isTransferring || !isValidAddress(to) || !isValidAmount(amount)}>
            {isTransferring ? 'Sending...' : 'Send Tokens'}
          </button>
        </div>
      </div>

      {/* Approve */}
      <div className="ti-section">
        <h3 className="ti-section-heading">Approve Spender</h3>
        <p className="ti-section-description">Allow another address to spend tokens on your behalf.</p>
        <div className="transfer-form">
          <div className="field-group">
            <input
              type="text"
              placeholder="Spender Address"
              className={`transfer-input${approveToError ? ' input-error' : ''}`}
              value={approveTo}
              onChange={(e) => setApproveTo(e.target.value)}
            />
            {approveToError && <span className="field-error-msg">{approveToError}</span>}
          </div>
          <div className="field-group">
            <input
              type="number"
              placeholder="Approval Amount"
              className={`transfer-input${approveAmountError ? ' input-error' : ''}`}
              value={approveAmount}
              onChange={(e) => setApproveAmount(e.target.value)}
              min="0"
            />
            {approveAmountError && <span className="field-error-msg">{approveAmountError}</span>}
          </div>
          <button className="transfer-btn" onClick={onApprove} disabled={isApproving || !isValidAddress(approveTo) || !isValidAmount(approveAmount)}>
            {isApproving ? 'Approving...' : 'Approve'}
          </button>
        </div>
      </div>

      {/* Check Allowance */}
      <div className="ti-section">
        <h3 className="ti-section-heading">Check Allowance</h3>
        <p className="ti-section-description">View the approved spending amount between an owner and spender.</p>
        <div className="transfer-form">
          <div className="field-group">
            <input
              type="text"
              placeholder="Owner Address"
              className={`transfer-input${checkOwnerError ? ' input-error' : ''}`}
              value={checkOwner}
              onChange={(e) => setCheckOwner(e.target.value)}
            />
            {checkOwnerError && <span className="field-error-msg">{checkOwnerError}</span>}
          </div>
          <div className="field-group">
            <input
              type="text"
              placeholder="Spender Address"
              className={`transfer-input${checkSpenderError ? ' input-error' : ''}`}
              value={checkSpender}
              onChange={(e) => setCheckSpender(e.target.value)}
            />
            {checkSpenderError && <span className="field-error-msg">{checkSpenderError}</span>}
          </div>
          <button className="transfer-btn" onClick={onCheckAllowance} disabled={allowanceLoading || !isValidAddress(checkOwner) || !isValidAddress(checkSpender)}>
            {allowanceLoading ? 'Checking...' : 'Check Allowance'}
          </button>
        </div>
        {allowanceResult !== null && (
          <div className="ti-allowance-result">
            <p className="ti-result-label">Allowance</p>
            <p className="ti-result-value">{allowanceResult} FMT</p>
          </div>
        )}
      </div>

      {/* Transfer From */}
      <div className="ti-section">
        <h3 className="ti-section-heading">Transfer From</h3>
        <p className="ti-section-description">Transfer tokens from an approved owner's account using your spender approval.</p>
        <div className="transfer-form">
          <div className="field-group">
            <input
              type="text"
              placeholder="From Address (Owner)"
              className={`transfer-input${tfFromError ? ' input-error' : ''}`}
              value={transferFromFrom}
              onChange={(e) => setTransferFromFrom(e.target.value)}
            />
            {tfFromError && <span className="field-error-msg">{tfFromError}</span>}
          </div>
          <div className="field-group">
            <input
              type="text"
              placeholder="To Address (Recipient)"
              className={`transfer-input${tfToError ? ' input-error' : ''}`}
              value={transferFromTo}
              onChange={(e) => setTransferFromTo(e.target.value)}
            />
            {tfToError && <span className="field-error-msg">{tfToError}</span>}
          </div>
          <div className="field-group">
            <input
              type="number"
              placeholder="Amount"
              className={`transfer-input${tfAmountError ? ' input-error' : ''}`}
              value={transferFromAmount}
              onChange={(e) => setTransferFromAmount(e.target.value)}
              min="0"
            />
            {tfAmountError && <span className="field-error-msg">{tfAmountError}</span>}
          </div>
          <button className="transfer-btn" onClick={onTransferFrom} disabled={isTransferringFrom || !isValidAddress(transferFromFrom) || !isValidAddress(transferFromTo) || !isValidAmount(transferFromAmount)}>
            {isTransferringFrom ? 'Transferring...' : 'Transfer From'}
          </button>
        </div>
      </div>

    </div>
  );
};

export default Transfer;
