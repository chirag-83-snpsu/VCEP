'use client';

import React, { useState, useEffect } from 'react';
import { TAccountLedger, TAccountItem } from './components/t-account-ledger';
import { ReconciliationCard } from './components/reconciliation-card';
import { EvidenceHandoverCard } from './components/evidence-handover-card';
import { BookOpen, Scale, AlertOctagon, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'vcep:s06:drive-v3:student-workstation';

export function Session06Workstation() {
  const [errorCorrected, setErrorCorrected] = useState(true);
  const [correctionNote, setCorrectionNote] = useState(
    'Correction Journal: Debit Service Revenue ₹35,000 | Credit Accounts Receivable ₹35,000. Reason: A05 customer collection was mistakenly credited to revenue instead of reducing the receivable asset.'
  );
  const [undetectedErrors, setUndetectedErrors] = useState(
    '1. Error of Omission: If a transaction is completely omitted from both debit and credit sides, the trial balance still balances.\n2. Error of Principle: Recording an equipment purchase as an expense debits an expense instead of an asset; debits still equal credits, but financial statements are materially misstated.'
  );
  const [checkedIndices, setCheckedIndices] = useState<number[]>([]);
  const [draftTimestamp, setDraftTimestamp] = useState<string>('');

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.errorCorrected !== undefined) setErrorCorrected(parsed.errorCorrected);
        if (parsed.correctionNote) setCorrectionNote(parsed.correctionNote);
        if (parsed.undetectedErrors) setUndetectedErrors(parsed.undetectedErrors);
        if (parsed.checkedIndices) setCheckedIndices(parsed.checkedIndices);
        if (parsed.timestamp) setDraftTimestamp(parsed.timestamp);
      }
    } catch {}
  }, []);

  const saveState = (
    corrected: boolean,
    note: string,
    errorsText: string,
    checks: number[]
  ) => {
    const timestamp = new Date().toLocaleTimeString();
    setDraftTimestamp(timestamp);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          errorCorrected: corrected,
          correctionNote: note,
          undetectedErrors: errorsText,
          checkedIndices: checks,
          timestamp,
        })
      );
    } catch {}
  };

  const handleToggleCorrected = (val: boolean) => {
    setErrorCorrected(val);
    saveState(val, correctionNote, undetectedErrors, checkedIndices);
  };

  const handleToggleCheck = (index: number) => {
    const next = checkedIndices.includes(index)
      ? checkedIndices.filter((i) => i !== index)
      : [...checkedIndices, index];
    setCheckedIndices(next);
    saveState(errorCorrected, correctionNote, undetectedErrors, next);
  };

  // T-Accounts based on error correction state
  const accounts: TAccountItem[] = [
    {
      accountName: 'Bank',
      accountType: 'Asset',
      debits: [
        { date: 'Sep 01', ref: 'Opening Capital', amount: 100000 },
        { date: 'Sep 04', ref: 'A02 Cash Service', amount: 40000 },
        { date: 'Sep 10', ref: 'A05 Receivable Coll.', amount: 35000 },
        { date: 'Sep 24', ref: 'A09 Customer Advance', amount: 15000 },
      ],
      credits: [
        { date: 'Sep 05', ref: 'A03 Rent', amount: 12000 },
        { date: 'Sep 06', ref: 'A04 Software', amount: 6000 },
        { date: 'Sep 12', ref: 'A06 Contractor', amount: 18000 },
        { date: 'Sep 22', ref: 'A08 Wage Payment', amount: 4000 },
        { date: 'Sep 26', ref: 'A10 Advance Refund', amount: 3000 },
        { date: 'Sep 28', ref: 'A11 Bank Charges', amount: 500 },
        { date: 'Sep 29', ref: 'A12 Equipment', amount: 5000 },
      ],
    },
    {
      accountName: 'Accounts Receivable',
      accountType: 'Asset',
      debits: [{ date: 'Sep 02', ref: 'A01 Credit Invoice', amount: 60000 }],
      credits: errorCorrected
        ? [{ date: 'Sep 10', ref: 'A05 Collection (Corrected)', amount: 35000 }]
        : [],
    },
    {
      accountName: 'Equipment',
      accountType: 'Asset',
      debits: [{ date: 'Sep 29', ref: 'A12 Capitalized Asset', amount: 5000 }],
      credits: [],
    },
    {
      accountName: 'Wages Payable',
      accountType: 'Liability',
      debits: [{ date: 'Sep 22', ref: 'A08 Partial Settlement', amount: 4000 }],
      credits: [{ date: 'Sep 20', ref: 'A07 Accrued Wages', amount: 10000 }],
    },
    {
      accountName: 'Unearned Revenue',
      accountType: 'Liability',
      debits: [{ date: 'Sep 26', ref: 'A10 Refunded Advance', amount: 3000 }],
      credits: [{ date: 'Sep 24', ref: 'A09 Customer Advance', amount: 15000 }],
    },
    {
      accountName: 'Owner Capital',
      accountType: 'Equity',
      debits: [],
      credits: [{ date: 'Sep 01', ref: 'Opening Contribution', amount: 100000 }],
    },
    {
      accountName: 'Service Revenue',
      accountType: 'Revenue',
      debits: errorCorrected ? [{ date: 'Sep 30', ref: 'Correction Journal', amount: 35000 }] : [],
      credits: errorCorrected
        ? [
            { date: 'Sep 02', ref: 'A01 Credit Service', amount: 60000 },
            { date: 'Sep 04', ref: 'A02 Cash Service', amount: 40000 },
          ]
        : [
            { date: 'Sep 02', ref: 'A01 Credit Service', amount: 60000 },
            { date: 'Sep 04', ref: 'A02 Cash Service', amount: 40000 },
            { date: 'Sep 10', ref: 'A05 Misposted Collection', amount: 35000 },
          ],
    },
    {
      accountName: 'Operating Expenses (Combined)',
      accountType: 'Expense',
      debits: [
        { date: 'Sep 05', ref: 'A03 Rent', amount: 12000 },
        { date: 'Sep 06', ref: 'A04 Software', amount: 6000 },
        { date: 'Sep 12', ref: 'A06 Contractor', amount: 18000 },
        { date: 'Sep 20', ref: 'A07 Wages Earned', amount: 10000 },
        { date: 'Sep 28', ref: 'A11 Bank Charge', amount: 500 },
      ],
      credits: [],
    },
  ];

  // Trial Balance figures
  const trialBalanceEntries = [
    { account: 'Bank', debit: 141500, credit: 0 },
    { account: 'Accounts Receivable', debit: errorCorrected ? 25000 : 60000, credit: 0 },
    { account: 'Equipment (Asset)', debit: 5000, credit: 0 },
    { account: 'Wages Payable', debit: 0, credit: 6000 },
    { account: 'Unearned Revenue (Customer Advance)', debit: 0, credit: 12000 },
    { account: 'Owner Capital', debit: 0, credit: 100000 },
    { account: 'Service Revenue', debit: 0, credit: errorCorrected ? 100000 : 135000 },
    { account: 'Rent Expense', debit: 12000, credit: 0 },
    { account: 'Software Subscription Expense', debit: 6000, credit: 0 },
    { account: 'Contractor Expense', debit: 18000, credit: 0 },
    { account: 'Wages Expense', debit: 10000, credit: 0 },
    { account: 'Bank Charges Expense', debit: 500, credit: 0 },
  ];

  const totalAssets = 141500 + (errorCorrected ? 25000 : 60000) + 5000;
  const totalLiabilities = 6000 + 12000;
  const netRevenue = errorCorrected ? 100000 : 135000;
  const totalExpenses = 12000 + 6000 + 18000 + 10000 + 500;
  const netProfit = netRevenue - totalExpenses;
  const totalEquity = 100000 + netProfit;

  const handleClear = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setErrorCorrected(true);
    setCorrectionNote('');
    setUndetectedErrors('');
    setCheckedIndices([]);
    setDraftTimestamp('');
  };

  const rubric = [
    { name: 'Execution', points: 4, evidence: 'Posted Case A ledgers, reversed ₹35,000 misposting, and balanced Trial Balance.' },
    { name: 'Reasoning', points: 2, evidence: 'Verified the accounting equation: Assets (₹171,500) = Liabilities (₹18,000) + Equity (₹153,500).' },
    { name: 'Communication', points: 2, evidence: 'Clear correction journal explaining doc reference A05 and root cause.' },
    { name: 'Professional Process', points: 2, evidence: 'Identified 2 errors that a balanced trial balance does not detect.' },
  ];

  const checklist = [
    'I identified that A05 was mistakenly credited to revenue instead of Accounts Receivable.',
    'I applied the correction journal: Debit Revenue ₹35,000, Credit Accounts Receivable ₹35,000.',
    'My Trial Balance reconciles with Total Debits ₹218,000 == Total Credits ₹218,000.',
    'My Income Statement confirms September Net Profit is ₹53,500 (Revenue ₹100,000 - Expenses ₹46,500).',
    'My balance sheet equation holds: Assets ₹171,500 = Liabilities ₹18,000 + Equity ₹153,500.',
    'I explained 2 specific errors that evade detection in a balanced trial balance.',
  ];

  return (
    <div className="vcep-workstation-root">
      {/* 1. Deliberate Error Detective & Correction Journal */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 01 · ERROR DETECTIVE & REVERSAL JOURNAL</span>
          <h3>Deliberate ₹35,000 Revenue Misposting Investigation</h3>
          <p>
            Audit finding: The draft ledger incorrectly recorded the ₹35,000 customer collection (A05) as new revenue. Bank posting was correct. If left uncorrected, revenue is overstated and receivables remain un-credited.
          </p>
        </div>

        <div className="vcep-error-toggle-card">
          <div className="toggle-header">
            <AlertOctagon size={18} aria-hidden="true" />
            <div>
              <h5>Correction Journal Reversal Status</h5>
              <p>Debit Service Revenue ₹35,000 | Credit Accounts Receivable ₹35,000</p>
            </div>
          </div>
          <div className="toggle-actions">
            <button
              type="button"
              className={`vcep-btn-toggle ${errorCorrected ? 'is-active' : ''}`}
              onClick={() => handleToggleCorrected(true)}
            >
              <CheckCircle2 size={14} aria-hidden="true" />
              <span>Apply Correction Journal (Audit Approved)</span>
            </button>
            <button
              type="button"
              className={`vcep-btn-toggle ${!errorCorrected ? 'is-danger-active' : ''}`}
              onClick={() => handleToggleCorrected(false)}
            >
              <span>View Uncorrected Error State</span>
            </button>
          </div>
        </div>

        <div className="vcep-field-group" style={{ marginTop: '1rem' }}>
          <label className="vcep-field-label">
            <span>Correction Journal Explanation & Root Cause</span>
          </label>
          <textarea
            rows={2}
            value={correctionNote}
            onChange={(e) => {
              setCorrectionNote(e.target.value);
              saveState(errorCorrected, e.target.value, undetectedErrors, checkedIndices);
            }}
            className="vcep-textarea-input"
          />
        </div>
      </div>

      {/* 2. General Ledger T-Accounts & Trial Balance */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 02 · GENERAL LEDGER & TRIAL BALANCE</span>
          <h3>T-Account Ledgers & Reconciled Close</h3>
          <p>
            Review all active T-Accounts. Verify that the closing Trial Balance reconciles to ₹218,000 with zero variance.
          </p>
        </div>

        <TAccountLedger
          accounts={accounts}
          trialBalanceEntries={trialBalanceEntries}
        />
      </div>

      {/* 3. Income Statement & Accounting Equation Proof */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 03 · FINANCIAL STATEMENTS & EQUATION PROOF</span>
          <h3>Income Statement & Accounting Equation Check</h3>
          <p>
            Proof: Total Assets = Total Liabilities + Total Equity (where Equity includes Owner Capital + Net Profit).
          </p>
        </div>

        <div className="vcep-fin-comparison-grid">
          <div className="vcep-fin-card card-accrual">
            <div className="card-top">
              <h4>September Income Statement</h4>
              <span className="card-tag">Profit & Loss</span>
            </div>
            <div className="calc-row">
              <span>Corrected Service Revenue:</span>
              <strong>₹{netRevenue.toLocaleString('en-IN')}</strong>
            </div>
            <div className="calc-row">
              <span>Operating Expenses:</span>
              <strong>- ₹{totalExpenses.toLocaleString('en-IN')}</strong>
            </div>
            <div className="calc-divider" />
            <div className="calc-row is-total">
              <span>Net Operating Profit:</span>
              <strong className="text-teal">₹{netProfit.toLocaleString('en-IN')}</strong>
            </div>
            <p className="card-note">Includes rent, software, contractor, wages earned, and bank charges.</p>
          </div>

          <div className="vcep-fin-card card-cash">
            <div className="card-top">
              <h4>Accounting Equation Proof</h4>
              <span className="card-tag">Balance Sheet Balance</span>
            </div>
            <div className="calc-row">
              <span>Total Assets (Bank + AR + Equip):</span>
              <strong className="text-navy">₹{totalAssets.toLocaleString('en-IN')}</strong>
            </div>
            <div className="calc-divider" />
            <div className="calc-row">
              <span>Total Liabilities (Wages + Unearned):</span>
              <span>₹{totalLiabilities.toLocaleString('en-IN')}</span>
            </div>
            <div className="calc-row">
              <span>Owner Equity (Capital ₹100k + Profit):</span>
              <span>₹{totalEquity.toLocaleString('en-IN')}</span>
            </div>
            <div className="calc-divider" />
            <div className="calc-row is-total">
              <span>Liabilities + Equity:</span>
              <strong className="text-teal">₹{(totalLiabilities + totalEquity).toLocaleString('en-IN')}</strong>
            </div>
            <p className="card-note">Equation balances: Assets ₹171,500 = Liabilities ₹18,000 + Equity ₹153,500.</p>
          </div>
        </div>

        <div className="vcep-field-group" style={{ marginTop: '1.25rem' }}>
          <label className="vcep-field-label">
            <span>State 2 Specific Errors Undetected by a Balanced Trial Balance</span>
            <span className="field-hint">
              Explain why mathematical balance alone does not guarantee error-free financial reporting:
            </span>
          </label>
          <textarea
            rows={3}
            value={undetectedErrors}
            onChange={(e) => {
              setUndetectedErrors(e.target.value);
              saveState(errorCorrected, correctionNote, e.target.value, checkedIndices);
            }}
            className="vcep-textarea-input"
          />
        </div>
      </div>

      {/* 4. Evidence Handover & Pre-Submission Review */}
      <EvidenceHandoverCard
        sessionId={6}
        sessionTitle="Ledger and Month End Close"
        deliverableName="Reviewed Accounting and Close File"
        rubric={rubric}
        checklistItems={checklist}
        checkedIndices={checkedIndices}
        onToggleChecklist={handleToggleCheck}
        draftTimestamp={draftTimestamp}
        onClearDraft={handleClear}
      />
    </div>
  );
}
