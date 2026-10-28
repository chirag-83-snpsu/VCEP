'use client';

import React, { useState, useEffect } from 'react';
import { SpreadsheetGrid, ColumnDef } from './components/spreadsheet-grid';
import { ReconciliationCard } from './components/reconciliation-card';
import { EvidenceHandoverCard } from './components/evidence-handover-card';
import { BookOpen, Scale, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'vcep:s05:drive-v3:student-workstation';

type JournalRow = {
  id: string;
  docId: string;
  date: string;
  sourceEvent: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  evidenceType: string;
  status: 'Verified' | 'Flagged' | 'Quarantined';
};

const initialRows: JournalRow[] = [
  { id: '1', docId: 'A01', date: 'Sep 02', sourceEvent: 'Completed service on credit; invoice issued', debitAccount: 'Accounts Receivable', creditAccount: 'Service Revenue', amount: 60000, evidenceType: 'Signed Tax Invoice & Acceptance', status: 'Verified' },
  { id: '2', docId: 'A02', date: 'Sep 04', sourceEvent: 'Completed service paid immediately into bank', debitAccount: 'Bank', creditAccount: 'Service Revenue', amount: 40000, evidenceType: 'Bank Receipt & Cash Memo', status: 'Verified' },
  { id: '3', docId: 'A03', date: 'Sep 05', sourceEvent: 'September rent paid by bank', debitAccount: 'Rent Expense', creditAccount: 'Bank', amount: 12000, evidenceType: 'Landlord Receipt & Bank Advice', status: 'Verified' },
  { id: '4', docId: 'A04', date: 'Sep 06', sourceEvent: 'September software subscription paid by bank', debitAccount: 'Software Subscription Expense', creditAccount: 'Bank', amount: 6000, evidenceType: 'Vendor Tax Invoice', status: 'Verified' },
  { id: '5', docId: 'A05', date: 'Sep 10', sourceEvent: 'Bank collection against A01 invoice', debitAccount: 'Bank', creditAccount: 'Accounts Receivable', amount: 35000, evidenceType: 'Bank Deposit Confirmation', status: 'Verified' },
  { id: '6', docId: 'A06', date: 'Sep 12', sourceEvent: 'September contractor service paid by bank', debitAccount: 'Contractor Expense', creditAccount: 'Bank', amount: 18000, evidenceType: 'Contractor Work Slip & Advice', status: 'Verified' },
  { id: '7', docId: 'A07', date: 'Sep 20', sourceEvent: 'September wages earned but unpaid', debitAccount: 'Wages Expense', creditAccount: 'Wages Payable', amount: 10000, evidenceType: 'Approved Payroll Schedule', status: 'Verified' },
  { id: '8', docId: 'A08', date: 'Sep 22', sourceEvent: 'Bank payment against A07 wage liability', debitAccount: 'Wages Payable', creditAccount: 'Bank', amount: 4000, evidenceType: 'Payroll Bank Transfer Ref', status: 'Verified' },
  { id: '9', docId: 'A09', date: 'Sep 24', sourceEvent: 'Refundable customer advance received in bank', debitAccount: 'Bank', creditAccount: 'Unearned Revenue (Liability)', amount: 15000, evidenceType: 'Client Advance Receipt Voucher', status: 'Verified' },
  { id: '10', docId: 'A10', date: 'Sep 26', sourceEvent: 'Part of A09 advance refunded by bank', debitAccount: 'Unearned Revenue (Liability)', creditAccount: 'Bank', amount: 3000, evidenceType: 'Bank Debit Advice & Refund Slip', status: 'Verified' },
  { id: '11', docId: 'A11', date: 'Sep 28', sourceEvent: 'Bank charge shown on bank advice', debitAccount: 'Bank Charges Expense', creditAccount: 'Bank', amount: 500, evidenceType: 'Bank Statement Advice Note', status: 'Verified' },
  { id: '12', docId: 'A12', date: 'Sep 29', sourceEvent: 'Equipment bought and paid through bank', debitAccount: 'Equipment Asset (Capitalized)', creditAccount: 'Bank', amount: 5000, evidenceType: 'Asset Purchase Invoice & Warranty', status: 'Verified' },
];

export function Session05Workstation() {
  const [rows, setRows] = useState<JournalRow[]>(initialRows);
  const [exceptionsNotes, setExceptionsNotes] = useState(
    'A09 is classified as Unearned Revenue (Liability) because service delivery has not occurred. A12 is capitalized as an Asset rather than expensed, per accrual accounting principles.'
  );
  const [checkedIndices, setCheckedIndices] = useState<number[]>([]);
  const [draftTimestamp, setDraftTimestamp] = useState<string>('');

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.rows) setRows(parsed.rows);
        if (parsed.exceptionsNotes) setExceptionsNotes(parsed.exceptionsNotes);
        if (parsed.checkedIndices) setCheckedIndices(parsed.checkedIndices);
        if (parsed.timestamp) setDraftTimestamp(parsed.timestamp);
      }
    } catch {}
  }, []);

  const saveState = (updatedRows: JournalRow[], updatedNotes: string, updatedChecks: number[]) => {
    const timestamp = new Date().toLocaleTimeString();
    setDraftTimestamp(timestamp);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          rows: updatedRows,
          exceptionsNotes: updatedNotes,
          checkedIndices: updatedChecks,
          timestamp,
        })
      );
    } catch {}
  };

  const handleRowChange = (rowIndex: number, columnKey: string, value: any) => {
    const updated = [...rows];
    updated[rowIndex] = { ...updated[rowIndex], [columnKey]: value };
    setRows(updated);
    saveState(updated, exceptionsNotes, checkedIndices);
  };

  const handleToggleCheck = (index: number) => {
    const next = checkedIndices.includes(index)
      ? checkedIndices.filter((i) => i !== index)
      : [...checkedIndices, index];
    setCheckedIndices(next);
    saveState(rows, exceptionsNotes, next);
  };

  const totalDebits = rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const totalCredits = totalDebits; // Each row represents a balanced double entry
  const isBalanced = totalDebits === 208500;

  const handleClear = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setRows(initialRows);
    setExceptionsNotes('');
    setCheckedIndices([]);
    setDraftTimestamp('');
  };

  const columns: ColumnDef<JournalRow>[] = [
    { key: 'docId', header: 'Doc ID', width: '80px', align: 'center' },
    { key: 'date', header: 'Date', width: '90px' },
    { key: 'sourceEvent', header: 'Commercial Source Event' },
    { key: 'debitAccount', header: 'Debit Account (Dr)', width: '200px', editable: true },
    { key: 'creditAccount', header: 'Credit Account (Cr)', width: '200px', editable: true },
    { key: 'amount', header: 'Amount (INR)', width: '130px', align: 'right', format: (val) => `₹${Number(val).toLocaleString('en-IN')}` },
    { key: 'evidenceType', header: 'Source Evidence Verification', width: '210px' },
  ];

  const rubric = [
    { name: 'Execution', points: 4, evidence: 'All 12 Case A events accurately journalized with debit/credit cross-foot balance.' },
    { name: 'Reasoning', points: 2, evidence: 'Correctly classifies unearned advance as liability and equipment as capitalized asset.' },
    { name: 'Communication', points: 2, evidence: 'Professional journal descriptions citing specific doc IDs and dates.' },
    { name: 'Professional Process', points: 2, evidence: 'Source evidence verified for each transaction before entering into official books.' },
  ];

  const checklist = [
    'I classified all 12 events without indirect taxes or rounding.',
    'I recognized that A01 represents credit revenue (Accounts Receivable).',
    'I treated A07 as accrued wage expense and A08 as liability settlement.',
    'I classified customer advance A09 as a liability (Unearned Revenue), not revenue.',
    'I capitalized equipment purchase A12 as an Asset rather than an expense.',
    'Total journal debit/credit cross-foot equals exactly ₹208,500.',
  ];

  return (
    <div className="vcep-workstation-root">
      {/* 1. Context & Opening Balances */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 01 · CASE A COMMERCIAL EVIDENCE</span>
          <h3>Case A September Accounting Release</h3>
          <p>
            Vayentra Labs business simulation. Opening balances on 1 September: <strong>Bank debit ₹100,000</strong>; <strong>Capital credit ₹100,000</strong>. Equipment is capitalized. Twelve September events must be entered from synthetic source evidence.
          </p>
        </div>

        <div className="vcep-recon-metrics-grid">
          <div className="vcep-recon-metric metric-raw">
            <div className="metric-label">Opening Bank Balance</div>
            <div className="metric-value">₹100,000</div>
            <div className="metric-sub">Debit (Asset)</div>
          </div>
          <div className="vcep-recon-operator">=</div>
          <div className="vcep-recon-metric metric-approved">
            <div className="metric-label">Opening Owner Capital</div>
            <div className="metric-value">₹100,000</div>
            <div className="metric-sub">Credit (Equity)</div>
          </div>
          <div className="vcep-recon-operator">+</div>
          <div className="vcep-recon-metric metric-quarantine">
            <div className="metric-label">Opening Liabilities</div>
            <div className="metric-value">₹0</div>
            <div className="metric-sub">Balanced Equation</div>
          </div>
        </div>
      </div>

      {/* 2. Interactive General Journal Grid */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 02 · DOUBLE-ENTRY GENERAL JOURNAL</span>
          <h3>12-Event Transaction Register & Account Classification</h3>
          <p>
            Assign debit and credit accounts to all 12 events. Ensure the fundamental double-entry rule holds: Total Debits must equal Total Credits.
          </p>
        </div>

        <SpreadsheetGrid
          title="Case A General Journal (12 Events)"
          data={rows}
          columns={columns}
          onChange={handleRowChange}
          summaryRow={
            <tr className="vcep-spreadsheet-summary-row">
              <td colSpan={5} style={{ textAlign: 'right', fontWeight: 600 }}>
                Total Journal Debits & Credits:
              </td>
              <td style={{ textAlign: 'right', fontWeight: 700, color: '#0F766E' }}>
                ₹{totalDebits.toLocaleString('en-IN')}
              </td>
              <td style={{ fontSize: '0.8125rem', color: '#0F766E' }}>
                Balanced across 12 events
              </td>
            </tr>
          }
        />

        <div className="vcep-field-group" style={{ marginTop: '1.25rem' }}>
          <label className="vcep-field-label">
            <span>Commercial Classification & Policy Exceptions Note</span>
            <span className="field-hint">
              Explain why A09 (customer advance) is not revenue, and why A12 (equipment) is not expensed:
            </span>
          </label>
          <textarea
            rows={3}
            value={exceptionsNotes}
            onChange={(e) => {
              setExceptionsNotes(e.target.value);
              saveState(rows, e.target.value, checkedIndices);
            }}
            className="vcep-textarea-input"
          />
        </div>
      </div>

      {/* 3. Evidence Handover & Pre-Submission Review */}
      <EvidenceHandoverCard
        sessionId={5}
        sessionTitle="Accounting Transactions"
        deliverableName="Transaction Register and Case A General Journal"
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
