'use client';

import React, { useState, useEffect } from 'react';
import { EvidenceHandoverCard } from './components/evidence-handover-card';
import { Scale, CheckCircle2, AlertOctagon, FileText, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

const STORAGE_KEY = 'vcep:s08:drive-v3:student-workstation';

export type BRSState = {
  unadjustedBook: number;
  bankCharges: number;
  interestEarned: number;
  unpresentedCheque: number;
  depositInTransit: number;
  actualStatement: number;
  journalEntries: { id: string; dr: string; cr: string; amount: number; narration: string }[];
  exceptionLog: { id: string; item: string; amount: number; source: string; owner: string; targetDate: string }[];
  formulaNotes: string;
  checkedIndices: number[];
  timestamp?: string;
};

const initialBRSState: BRSState = {
  unadjustedBook: 87500,
  bankCharges: 500,
  interestEarned: 200,
  unpresentedCheque: 6000,
  depositInTransit: 10000,
  actualStatement: 83200,
  journalEntries: [
    {
      id: 'j1',
      dr: 'Bank Charges (Expense)',
      cr: 'Bank Account (Asset)',
      amount: 500,
      narration: 'Being monthly account maintenance fees debited by bank recorded in cash book.',
    },
    {
      id: 'j2',
      dr: 'Bank Account (Asset)',
      cr: 'Interest Income (Revenue)',
      amount: 200,
      narration: 'Being interest on savings balance credited directly by bank recorded in cash book.',
    },
  ],
  exceptionLog: [
    {
      id: 'e1',
      item: 'Customer Deposit in Transit',
      amount: 10000,
      source: 'Bank Pay-in Slip #9821',
      owner: 'Collections Lead',
      targetDate: '2026-11-03',
    },
    {
      id: 'e2',
      item: 'Unpresented Cheque to Vendor',
      amount: 6000,
      source: 'Cheque Counterfoil #4401',
      owner: 'Accounts Payable Lead',
      targetDate: '2026-11-04',
    },
  ],
  formulaNotes:
    'Adjusted Cash Book = ₹87,500 (Unadjusted) - ₹500 (Charges) + ₹200 (Interest) = ₹87,200.\nCalculated Statement = ₹87,200 (Adjusted Book) + ₹6,000 (Unpresented) - ₹10,000 (In Transit) = ₹83,200.\nReconciliation Variance = ₹83,200 - ₹83,200 = ₹0 (Zero Unexplained Difference).',
  checkedIndices: [],
};

export function Session08Workstation() {
  const [state, setState] = useState<BRSState>(initialBRSState);
  const [draftTimestamp, setDraftTimestamp] = useState<string>('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(parsed);
        if (parsed.timestamp) setDraftTimestamp(parsed.timestamp);
      }
    } catch {}
  }, []);

  const saveState = (updated: BRSState) => {
    const timestamp = new Date().toLocaleTimeString();
    setDraftTimestamp(timestamp);
    const withTime = { ...updated, timestamp };
    setState(withTime);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(withTime));
    } catch {}
  };

  const handleToggleCheck = (index: number) => {
    const next = state.checkedIndices.includes(index)
      ? state.checkedIndices.filter((i) => i !== index)
      : [...state.checkedIndices, index];
    saveState({ ...state, checkedIndices: next });
  };

  const handleReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setState(initialBRSState);
    setDraftTimestamp('');
  };

  // Mathematical Calculations
  const adjustedCashBook = state.unadjustedBook - state.bankCharges + state.interestEarned;
  const calculatedStatement = adjustedCashBook + state.unpresentedCheque - state.depositInTransit;
  const reconciliationVariance = state.actualStatement - calculatedStatement;
  const isBalanced = reconciliationVariance === 0;

  const rubric = [
    { name: 'Execution', points: 4, evidence: '3-column BRS balances with exact zero unexplained variance to the bank statement (₹83,200).' },
    { name: 'Reasoning', points: 2, evidence: 'Correctly distinguishes permanent ledger adjustments from temporary timing differences.' },
    { name: 'Communication', points: 2, evidence: 'Accurate journal narrations and clear timing exception log with follow-up owners.' },
    { name: 'Professional Process', points: 2, evidence: 'No unexplained plugs used; zero-variance bridge fully documented.' },
  ];

  const checklist = [
    'I identified the unadjusted Cash Book debit balance (₹87,500) and Bank Statement credit balance (₹83,200).',
    'I posted permanent adjustments into the Cash Book: Bank Charges ₹500 (Cr) and Interest Earned ₹200 (Dr).',
    'My adjusted Cash Book balance equals exactly ₹87,200.',
    'I placed timing items on the BRS schedule: Added Unpresented Cheque (₹6,000) and Deducted Deposit in Transit (₹10,000).',
    'My calculated statement balance matches the bank statement: ₹83,200 with exactly ₹0 variance.',
    'I created an Exception Log assigning follow-up owners and clearance target dates for timing items.',
  ];

  return (
    <div className="vcep-workstation-root">
      {/* 1. Header & Principles */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 04 · INTERACTIVE FINANCIAL WORKSTATION</span>
          <h3>Three-Column Bank Reconciliation Statement (BRS)</h3>
          <p>
            Case C October Snapshot: Bridge unadjusted Cash Book (₹87,500 Dr) to Bank Statement (₹83,200 Cr) by separating permanent ledger adjustments from temporary timing differences.
          </p>
        </div>

        <div className="vcep-data-principles-banner">
          <div className="principle-item">
            <span className="principle-num">1</span>
            <strong>Permanent Bank-Only Adjustments:</strong> Update the Cash Book for charges (₹500) and interest (₹200) with journal entries.
          </div>
          <div className="principle-item">
            <span className="principle-num">2</span>
            <strong>Temporary Timing Differences:</strong> Reconcile unpresented cheques (+₹6k) and deposits in transit (-₹10k) on the BRS schedule only.
          </div>
          <div className="principle-item">
            <span className="principle-num">3</span>
            <strong>Zero-Variance Rule:</strong> Never force an unexplained plug. Calculated Statement must equal Actual Statement with ₹0 variance.
          </div>
        </div>
      </div>

      {/* 2. Interactive BRS Schedule Card */}
      <div className="vcep-workstation-section">
        <div className={`vcep-recon-card ${isBalanced ? 'is-balanced' : 'has-variance'}`}>
          <div className="vcep-recon-header">
            <div className="vcep-recon-title-area">
              <div className="vcep-recon-icon-badge">
                <Scale size={20} aria-hidden="true" />
              </div>
              <div>
                <h3 className="vcep-recon-title">Bank Reconciliation Statement (As of 31 October)</h3>
                <p className="vcep-recon-subtitle">
                  Three-column bridge: Cash Book Adjustments → Adjusted Book → Timing Differences → Bank Statement
                </p>
              </div>
            </div>

            <div className="vcep-recon-status-badge">
              {isBalanced ? (
                <span className="vcep-status-pill pill-balanced">
                  <CheckCircle2 size={14} aria-hidden="true" />
                  <span>BALANCED (₹0 VARIANCE)</span>
                </span>
              ) : (
                <span className="vcep-status-pill pill-warning">
                  <AlertOctagon size={14} aria-hidden="true" />
                  <span>UNRECONCILED VARIANCE: ₹{Math.abs(reconciliationVariance).toLocaleString('en-IN')}</span>
                </span>
              )}
            </div>
          </div>

          {/* BRS Table */}
          <div style={{ padding: '16px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(23, 36, 92, 0.15)', textAlign: 'left', color: '#17245C' }}>
                  <th style={{ padding: '10px 12px' }}>Particulars / Transaction Description</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', width: '120px' }}>Classification</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', width: '140px' }}>Amount (INR)</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', width: '160px' }}>Subtotal / Net</th>
                </tr>
              </thead>
              <tbody>
                {/* Part 1: Cash Book Starting Balance */}
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(23, 36, 92, 0.02)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>
                    <strong>Unadjusted Balance as per Cash Book</strong> (Debit / Asset)
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: '#e0f2fe', color: '#0369a1' }}>Starting</span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>₹{state.unadjustedBook.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>₹{state.unadjustedBook.toLocaleString('en-IN')}</td>
                </tr>

                {/* Part 2: Cash Book Adjustments */}
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <td style={{ padding: '10px 12px', paddingLeft: '28px', color: '#dc2626' }}>
                    Less: Bank Charges debited by bank not in cash book
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: '#fee2e2', color: '#b91c1c' }}>Book Adjustment</span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#dc2626' }}>- ₹{state.bankCharges.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}></td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <td style={{ padding: '10px 12px', paddingLeft: '28px', color: '#16a34a' }}>
                    Add: Interest on bank balance credited by bank not in cash book
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: '#dcfce7', color: '#15803d' }}>Book Adjustment</span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#16a34a' }}>+ ₹{state.interestEarned.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#4b5563' }}>- ₹{(state.bankCharges - state.interestEarned).toLocaleString('en-IN')}</td>
                </tr>

                {/* Subtotal: Adjusted Cash Book */}
                <tr style={{ borderBottom: '2px solid rgba(23, 36, 92, 0.2)', background: '#f8fafc' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: '#17245C' }}>
                    Adjusted Balance as per Cash Book
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: '#e0e7ff', color: '#3730a3', fontWeight: 600 }}>Adjusted Book</span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}></td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#17245C' }}>
                    ₹{adjustedCashBook.toLocaleString('en-IN')}
                  </td>
                </tr>

                {/* Part 3: Timing Differences */}
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <td style={{ padding: '10px 12px', paddingLeft: '28px', color: '#16a34a' }}>
                    Add: Cheques issued to suppliers but not yet presented for payment
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: '#fef3c7', color: '#92400e' }}>Timing Diff</span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#16a34a' }}>+ ₹{state.unpresentedCheque.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}></td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <td style={{ padding: '10px 12px', paddingLeft: '28px', color: '#dc2626' }}>
                    Less: Customer deposits paid into bank but not yet credited (In Transit)
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: '#fef3c7', color: '#92400e' }}>Timing Diff</span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#dc2626' }}>- ₹{state.depositInTransit.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#4b5563' }}>- ₹{(state.depositInTransit - state.unpresentedCheque).toLocaleString('en-IN')}</td>
                </tr>

                {/* Final Reconciled Statement Balance */}
                <tr style={{ borderBottom: '2px solid rgba(15, 118, 110, 0.4)', background: 'rgba(15, 118, 110, 0.05)' }}>
                  <td style={{ padding: '12px', fontWeight: 700, color: '#0F766E' }}>
                    Reconciled Balance as per Bank Statement (Credit / Bank's Books)
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: '#ccfbf1', color: '#0f766e', fontWeight: 700 }}>BRS Output</span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}></td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 800, fontSize: '1rem', color: '#0F766E' }}>
                    ₹{calculatedStatement.toLocaleString('en-IN')}
                  </td>
                </tr>

                {/* Target & Verification */}
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: '#fff' }}>
                  <td style={{ padding: '10px 12px', color: '#4b5563', fontStyle: 'italic' }}>
                    Actual Statement Balance (Case C Target Evidence)
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: '#f3f4f6', color: '#4b5563' }}>External Source</span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}></td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#4b5563' }}>
                    ₹{state.actualStatement.toLocaleString('en-IN')}
                  </td>
                </tr>

                {/* Unexplained Variance */}
                <tr style={{ background: isBalanced ? '#ecfdf5' : '#fef2f2', fontWeight: 700 }}>
                  <td style={{ padding: '10px 12px', color: isBalanced ? '#15803d' : '#b91c1c' }}>
                    Unexplained Variance (Reconciliation Audit Check)
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: isBalanced ? '#bbf7d0' : '#fecaca', color: isBalanced ? '#15803d' : '#991b1b' }}>
                      {isBalanced ? 'ZERO VARIANCE' : 'VARIANCE DETECTED'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}></td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: isBalanced ? '#15803d' : '#b91c1c' }}>
                    ₹{reconciliationVariance.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="vcep-recon-equation-banner">
            <div className="vcep-recon-equation-text">
              <strong>BRS Proof:</strong>{' '}
              <code>
                Adjusted Book (₹87,200) + Unpresented Cheques (₹6,000) - Deposit in Transit (₹10,000) = Bank Statement (₹83,200). Variance = ₹0.
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Journal Entries & Timing Exception Log */}
      <div className="vcep-workstation-section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Journal Entries */}
          <div className="v3-panel" style={{ margin: 0 }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
              <FileText size={16} /> Cash Book Adjustment Journal Entries
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {state.journalEntries.map((j, idx) => (
                <div key={j.id} style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', padding: '12px', background: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span>Entry #{idx + 1}</span>
                    <span style={{ color: '#0F766E' }}>₹{j.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#17245C' }}>
                    <div><strong>Dr.</strong> {j.dr} ₹{j.amount.toLocaleString('en-IN')}</div>
                    <div style={{ paddingLeft: '16px' }}><strong>To</strong> {j.cr} ₹{j.amount.toLocaleString('en-IN')}</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '6px', fontStyle: 'italic' }}>
                    ({j.narration})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timing Exception Log */}
          <div className="v3-panel" style={{ margin: 0 }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
              <ShieldCheck size={16} /> Timing Differences Exception Register
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {state.exceptionLog.map((e) => (
                <div key={e.id} style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', padding: '12px', background: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span style={{ color: '#17245C' }}>{e.item}</span>
                    <span style={{ color: '#b45309' }}>₹{e.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#4b5563', lineHeight: 1.5 }}>
                    <div><strong>Source Evidence:</strong> {e.source}</div>
                    <div><strong>Follow-up Owner:</strong> {e.owner}</div>
                    <div><strong>Expected Clearance:</strong> {e.targetDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Evidence Handover & Checklist */}
      <div className="vcep-workstation-section">
        <EvidenceHandoverCard
          sessionId={8}
          sessionTitle="Bank Reconciliation"
          deliverableName="Bank Reconciliation Statement & Timing Exception Report"
          rubric={rubric}
          checklistItems={checklist}
          checkedIndices={state.checkedIndices}
          onToggleChecklist={handleToggleCheck}
          draftTimestamp={draftTimestamp}
          onClearDraft={handleReset}
        />
      </div>
    </div>
  );
}
