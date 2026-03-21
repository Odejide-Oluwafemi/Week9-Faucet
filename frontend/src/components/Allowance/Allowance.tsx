import React, { useState } from 'react';
import './Allowance.css';

interface AllowanceProps {
  handleApprove: (spender: string, amount: string) => void;
  handleTransferFrom: (from: string, to: string, amount: string) => void;
  handleCheckAllowance: (owner: string, spender: string) => Promise<string>;
  loading: boolean;
}

const Allowance: React.FC<AllowanceProps> = ({
  handleApprove,
  handleTransferFrom,
  handleCheckAllowance,
  loading,
}) => {
  const [approveTo, setApproveTo] = useState('');
  const [approveAmount, setApproveAmount] = useState('');
  
  const [checkOwner, setCheckOwner] = useState('');
  const [checkSpender, setCheckSpender] = useState('');
  const [allowanceResult, setAllowanceResult] = useState<string | null>(null);
  const [allowanceLoading, setAllowanceLoading] = useState(false);

  const [transferFromFrom, setTransferFromFrom] = useState('');
  const [transferFromTo, setTransferFromTo] = useState('');
  const [transferFromAmount, setTransferFromAmount] = useState('');

  const onApprove = () => {
    if (!approveTo || !approveAmount) return;
    handleApprove(approveTo, approveAmount);
    setApproveTo('');
    setApproveAmount('');
  };

  const onCheckAllowance = async () => {
    if (!checkOwner || !checkSpender) return;
    setAllowanceLoading(true);
    try {
      const result = await handleCheckAllowance(checkOwner, checkSpender);
      setAllowanceResult(result);
    } finally {
      setAllowanceLoading(false);
    }
  };

  const onTransferFrom = () => {
    if (!transferFromFrom || !transferFromTo || !transferFromAmount) return;
    handleTransferFrom(transferFromFrom, transferFromTo, transferFromAmount);
    setTransferFromFrom('');
    setTransferFromTo('');
    setTransferFromAmount('');
  };

  return (
    <div className="allowance-container">
      <h3 className="allowance-title">Manage Approvals & Transfers</h3>

      {/* Approve Section */}
      <div className="allowance-section">
        <h4 className="section-heading">Approve Spender</h4>
        <p className="section-description">
          Allow another address to spend tokens on your behalf.
        </p>
        <div className="allowance-form">
          <input
            type="text"
            placeholder="Spender Address"
            className="allowance-input"
            value={approveTo}
            onChange={(e) => setApproveTo(e.target.value)}
          />
          <input
            type="number"
            placeholder="Approval Amount"
            className="allowance-input"
            value={approveAmount}
            onChange={(e) => setApproveAmount(e.target.value)}
          />
          <button
            className="allowance-btn approve-btn"
            onClick={onApprove}
            disabled={loading || !approveTo || !approveAmount}
          >
            {loading ? 'Approving...' : 'Approve'}
          </button>
        </div>
      </div>

      {/* Check Allowance Section */}
      <div className="allowance-section">
        <h4 className="section-heading">Check Allowance</h4>
        <p className="section-description">
          View the approved amount for a spender.
        </p>
        <div className="allowance-form">
          <input
            type="text"
            placeholder="Owner Address"
            className="allowance-input"
            value={checkOwner}
            onChange={(e) => setCheckOwner(e.target.value)}
          />
          <input
            type="text"
            placeholder="Spender Address"
            className="allowance-input"
            value={checkSpender}
            onChange={(e) => setCheckSpender(e.target.value)}
          />
          <button
            className="allowance-btn check-btn"
            onClick={onCheckAllowance}
            disabled={allowanceLoading || !checkOwner || !checkSpender}
          >
            {allowanceLoading ? 'Checking...' : 'Check'}
          </button>
        </div>
        {allowanceResult !== null && (
          <div className="allowance-result">
            <p className="result-label">Allowance:</p>
            <p className="result-value">{allowanceResult} FMT</p>
          </div>
        )}
      </div>

      {/* TransferFrom Section */}
      <div className="allowance-section">
        <h4 className="section-heading">Transfer From (as Spender)</h4>
        <p className="section-description">
          Transfer tokens from an approved owner's account using your spender approval.
        </p>
        <div className="allowance-form">
          <input
            type="text"
            placeholder="From Address (Owner)"
            className="allowance-input"
            value={transferFromFrom}
            onChange={(e) => setTransferFromFrom(e.target.value)}
          />
          <input
            type="text"
            placeholder="To Address (Recipient)"
            className="allowance-input"
            value={transferFromTo}
            onChange={(e) => setTransferFromTo(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            className="allowance-input"
            value={transferFromAmount}
            onChange={(e) => setTransferFromAmount(e.target.value)}
          />
          <button
            className="allowance-btn transfer-btn"
            onClick={onTransferFrom}
            disabled={loading || !transferFromFrom || !transferFromTo || !transferFromAmount}
          >
            {loading ? 'Transferring...' : 'Transfer From'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Allowance;
