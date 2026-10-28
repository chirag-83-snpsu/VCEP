'use client';

import React, { useState, useEffect } from 'react';
import { EvidenceHandoverCard } from './components/evidence-handover-card';
import { Clock, DollarSign, AlertCircle, CheckCircle2, ShieldAlert, ArrowRight, FileText } from 'lucide-react';

const STORAGE_KEY = 'vcep:s12:drive-v3:student-workstation';

export type ReceivablesInvoice = {
  id: string;
  customer: string;
  dueDate: string;
  outstanding: number;
  daysOverdue: number;
  bucket: 'Current' | '1–30 Days' | '31–60 Days' | '61–90 Days' | '>90 Days';
  disputedAmount: number;
  undisputedAmount: number;
  collectionPriority: 'Priority 1 (Targeted)' | 'Priority 2 (Targeted)' | 'Follow-up' | 'High Credit Risk';
};

export type Session12State = {
  invoices: ReceivablesInvoice[];
  customerEmail: string;
  checkedIndices: number[];
  timestamp?: string;
};

const initialInvoices: ReceivablesInvoice[] = [
  {
    id: 'F01',
    customer: 'Asha',
    dueDate: '2026-10-31',
    outstanding: 10000,
    daysOverdue: 0,
    bucket: 'Current',
    disputedAmount: 0,
    undisputedAmount: 10000,
    collectionPriority: 'Priority 1 (Targeted)',
  },
  {
    id: 'F02',
    customer: 'Beacon',
    dueDate: '2026-10-16',
    outstanding: 20000,
    daysOverdue: 15,
    bucket: '1–30 Days',
    disputedAmount: 5000,
    undisputedAmount: 15000,
    collectionPriority: 'Priority 2 (Targeted)',
  },
  {
    id: 'F03',
    customer: 'Cedar',
    dueDate: '2026-09-16',
    outstanding: 30000,
    daysOverdue: 45,
    bucket: '31–60 Days',
    disputedAmount: 0,
    undisputedAmount: 30000,
    collectionPriority: 'Follow-up',
  },
  {
    id: 'F04',
    customer: 'Delta',
    dueDate: '2026-08-17',
    outstanding: 40000,
    daysOverdue: 75,
    bucket: '61–90 Days',
    disputedAmount: 0,
    undisputedAmount: 40000,
    collectionPriority: 'High Credit Risk',
  },
];

const defaultEmail =
  'Subject: Settlement of Undisputed Balance — Invoice F02 (Beacon)\n\nDear Accounts Team,\n\nWe acknowledge your billing query regarding the ₹5,000 variance on Invoice F02. While our operations lead reviews the service deliverables for that specific portion, we request the immediate electronic remittance of the undisputed balance of ₹15,000 by 14:00 tomorrow.\n\nSeparating the undisputed settlement protects your credit account from hold status while our teams resolve the remaining ₹5,000 line item.';

export function Session12Workstation() {
  const [invoices, setInvoices] = useState<ReceivablesInvoice[]>(initialInvoices);
  const [customerEmail, setCustomerEmail] = useState<string>(defaultEmail);
  const [checkedIndices, setCheckedIndices] = useState<number[]>([]);
  const [draftTimestamp, setDraftTimestamp] = useState<string>('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.invoices) setInvoices(parsed.invoices);
        if (parsed.customerEmail) setCustomerEmail(parsed.customerEmail);
        if (parsed.checkedIndices) setCheckedIndices(parsed.checkedIndices);
        if (parsed.timestamp) setDraftTimestamp(parsed.timestamp);
      }
    } catch {}
  }, []);

  const saveState = (
    inv: ReceivablesInvoice[],
    email: string,
    checks: number[]
  ) => {
    const timestamp = new Date().toLocaleTimeString();
    setDraftTimestamp(timestamp);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          invoices: inv,
          customerEmail: email,
          checkedIndices: checks,
          timestamp,
        })
      );
    } catch {}
  };

  const handleToggleCheck = (index: number) => {
    const next = checkedIndices.includes(index)
      ? checkedIndices.filter((i) => i !== index)
      : [...checkedIndices, index];
    setCheckedIndices(next);
    saveState(invoices, customerEmail, next);
  };

  const handleReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setInvoices(initialInvoices);
    setCustomerEmail(defaultEmail);
    setCheckedIndices([]);
    setDraftTimestamp('');
  };

  // Cash flow figures
  const openingBank = 25000;
  const unavoidableOutflows = 45000;
  const immediateDeficit = openingBank - unavoidableOutflows; // -20,000

  // Targeted collections (Asha ₹10k + undisputed Beacon ₹15k)
  const targetedCollections = 25000;
  const projectedClosingBank = openingBank + targetedCollections - unavoidableOutflows; // +5,000 surplus

  const rubric = [
    { name: 'Execution', points: 4, evidence: 'Aging schedule accurately buckets all 4 invoices; 7-day cash forecast closes the ₹20,000 deficit.' },
    { name: 'Reasoning', points: 2, evidence: 'Explains why invoices due today are Current, not overdue; isolates disputed balance from confirmed inflows.' },
    { name: 'Communication', points: 2, evidence: 'Professional email to customer Beacon requesting immediate settlement of the undisputed ₹15,000.' },
    { name: 'Professional Process', points: 2, evidence: 'Refuses to count promises or disputed amounts as cleared cash; establishes achievable collection priorities.' },
  ];

  const checklist = [
    'I calculated Days Overdue using the payment due date: Max(0, 31 Oct - Due Date).',
    'I classified Invoice F01 (due 31 Oct) as Current, not overdue.',
    'I categorized all 4 invoices into aging buckets (Current, 1–30, 31–60, 61–90 days).',
    'I identified the immediate ₹20,000 liquidity deficit (₹25,000 opening bank - ₹45,000 unavoidable outflows).',
    'I formulated a collection strategy targeting Asha (₹10,000) and undisputed Beacon (₹15,000) to produce a ₹5,000 surplus.',
    'I excluded the ₹5,000 disputed amount and Delta’s ₹40,000 high-risk invoice from short-term cash commitments.',
  ];

  return (
    <div className="vcep-workstation-root">
      {/* 1. Header & Principles */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 04 · INTERACTIVE CREDIT & CASH WORKSTATION</span>
          <h3>Receivables Aging Schedule & 7-Day Cash Deficit Planner</h3>
          <p>
            Case F as of 31 October 2026: Outstanding trade receivables total ₹1,00,000 across 4 customer accounts. Opening bank balance is ₹25,000, while mandatory 7-day outflows total ₹45,000. Prioritize collections to prevent liquidity insolvency.
          </p>
        </div>

        <div className="vcep-data-principles-banner">
          <div className="principle-item">
            <span className="principle-num">1</span>
            <strong>Days Overdue Formula:</strong> Days Overdue = Max(0, As-of Date − Due Date). An invoice due today has 0 days overdue and is classified as Current.
          </div>
          <div className="principle-item">
            <span className="principle-num">2</span>
            <strong>Aging Buckets & Risk:</strong> Debts in 61–90 days (Delta ₹40k) carry high default risk; never rely on high-aging debtors to fund immediate payroll.
          </div>
          <div className="principle-item">
            <span className="principle-num">3</span>
            <strong>Dispute Isolation:</strong> Isolate Beacon's ₹5,000 dispute into suspense while aggressively collecting the undisputed ₹15,000 balance.
          </div>
        </div>
      </div>

      {/* 2. Aging Schedule Table */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
            <Clock size={18} /> Customer Receivables Aging Schedule (As of 31 October 2026)
          </h4>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(23, 36, 92, 0.15)', textAlign: 'left', color: '#17245C' }}>
                  <th style={{ padding: '8px 10px' }}>ID</th>
                  <th style={{ padding: '8px 10px' }}>Customer</th>
                  <th style={{ padding: '8px 10px' }}>Due Date</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Days Overdue</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Aging Bucket</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Total (INR)</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Disputed</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Undisputed</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Collection Strategy</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>{inv.id}</td>
                    <td style={{ padding: '8px 10px', fontWeight: 600 }}>{inv.customer}</td>
                    <td style={{ padding: '8px 10px' }}>{inv.dueDate}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: inv.daysOverdue > 30 ? 700 : 400, color: inv.daysOverdue > 30 ? '#b91c1c' : '#111827' }}>
                      {inv.daysOverdue} days
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: 600,
                          background: inv.bucket === 'Current' ? '#dcfce7' : inv.bucket === '1–30 Days' ? '#e0f2fe' : inv.bucket === '31–60 Days' ? '#fef3c7' : '#fee2e2',
                          color: inv.bucket === 'Current' ? '#15803d' : inv.bucket === '1–30 Days' ? '#0369a1' : inv.bucket === '31–60 Days' ? '#92400e' : '#b91c1c',
                        }}
                      >
                        {inv.bucket}
                      </span>
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                      ₹{inv.outstanding.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', color: inv.disputedAmount > 0 ? '#b91c1c' : '#9ca3af' }}>
                      {inv.disputedAmount > 0 ? `₹${inv.disputedAmount.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#0F766E' }}>
                      ₹{inv.undisputedAmount.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: 600,
                          background: inv.collectionPriority.includes('Priority') ? '#ccfbf1' : '#f3f4f6',
                          color: inv.collectionPriority.includes('Priority') ? '#0f766e' : '#4b5563',
                        }}
                      >
                        {inv.collectionPriority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. Seven-Day Cash Deficit & Action Planner */}
      <div className="vcep-workstation-section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {/* Cash Deficit Bridge */}
          <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
              <DollarSign size={18} /> 7-Day Liquidity Deficit & Closing Cash Projection
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <span>Opening Bank Balance (31 Oct):</span>
                <strong style={{ color: '#17245C' }}>₹{openingBank.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(0,0,0,0.06)', color: '#b91c1c' }}>
                <span>Less: Mandatory 7-Day Outflows (Payroll/Rent):</span>
                <strong>- ₹{unavoidableOutflows.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '2px solid rgba(0,0,0,0.1)', background: '#fef2f2', paddingLeft: '6px', paddingRight: '6px', borderRadius: '4px' }}>
                <span style={{ fontWeight: 600, color: '#b91c1c' }}>Net Cash Deficit before collections:</span>
                <strong style={{ color: '#b91c1c' }}>- ₹{Math.abs(immediateDeficit).toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(0,0,0,0.06)', color: '#15803d' }}>
                <span>Add: Priority Collections (Asha ₹10k + Beacon ₹15k):</span>
                <strong>+ ₹{targetedCollections.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#ecfdf5', borderRadius: '6px', border: '1px solid #bbf7d0', marginTop: '6px' }}>
                <span style={{ fontWeight: 700, color: '#15803d' }}>Projected Closing Bank Balance:</span>
                <strong style={{ fontSize: '1.1rem', color: '#15803d' }}>+ ₹{projectedClosingBank.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '10px 0 0', fontStyle: 'italic' }}>
              ✓ By collecting Asha (₹10,000) and the undisputed ₹15,000 from Beacon, the company covers the ₹20,000 deficit and finishes with a ₹5,000 safety reserve without relying on disputed funds or defaulting on payroll.
            </p>
          </div>

          {/* Customer Dispute Email Drafter */}
          <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 8px' }}>
              <FileText size={18} /> Dispute Resolution & Undisputed Collection Email
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 10px' }}>
              Draft an email to Beacon requesting immediate payment of the undisputed ₹15,000 while quarantining the disputed ₹5,000 for review.
            </p>
            <textarea
              rows={8}
              value={customerEmail}
              onChange={(e) => {
                setCustomerEmail(e.target.value);
                saveState(invoices, e.target.value, checkedIndices);
              }}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '0.8rem',
                fontFamily: 'inherit',
                lineHeight: 1.4,
              }}
            />
          </div>
        </div>
      </div>

      {/* 4. Evidence Handover & Checklist */}
      <div className="vcep-workstation-section">
        <EvidenceHandoverCard
          sessionId={12}
          sessionTitle="Receivables and Working Capital"
          deliverableName="Receivables Aging Schedule & 7-Day Cash Action Plan"
          rubric={rubric}
          checklistItems={checklist}
          checkedIndices={checkedIndices}
          onToggleChecklist={handleToggleCheck}
          draftTimestamp={draftTimestamp}
          onClearDraft={handleReset}
        />
      </div>
    </div>
  );
}
