'use client';

import React from 'react';
import { Scale, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

export type ReconciliationProps = {
  rawCount: number;
  rawAmount: number;
  approvedCount: number;
  approvedAmount: number;
  quarantineCount: number;
  quarantineAmount: number;
  customerBreakdown?: { name: string; amount: number; count: number }[];
  currencySymbol?: string;
};

export function ReconciliationCard({
  rawCount,
  rawAmount,
  approvedCount,
  approvedAmount,
  quarantineCount,
  quarantineAmount,
  customerBreakdown = [],
  currencySymbol = '₹',
}: ReconciliationProps) {
  const accountedCount = approvedCount + quarantineCount;
  const countVariance = rawCount - accountedCount;

  const accountedAmount = approvedAmount + quarantineAmount;
  const amountVariance = rawAmount - accountedAmount;

  const isBalanced = countVariance === 0 && amountVariance === 0;

  const formatMoney = (val: number) => {
    return `${currencySymbol}${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className={`vcep-recon-card ${isBalanced ? 'is-balanced' : 'has-variance'}`}>
      <div className="vcep-recon-header">
        <div className="vcep-recon-title-area">
          <div className="vcep-recon-icon-badge">
            <Scale size={20} aria-hidden="true" />
          </div>
          <div>
            <h3 className="vcep-recon-title">Independent Reconciliation & Exposure Control</h3>
            <p className="vcep-recon-subtitle">
              Three-way cross-foot balance: Raw Inflow vs Approved Clean vs Quarantined Suspense
            </p>
          </div>
        </div>

        <div className="vcep-recon-status-badge">
          {isBalanced ? (
            <span className="vcep-status-pill pill-balanced">
              <CheckCircle2 size={14} aria-hidden="true" />
              <span>BALANCED (0 VARIANCE)</span>
            </span>
          ) : (
            <span className="vcep-status-pill pill-warning">
              <AlertTriangle size={14} aria-hidden="true" />
              <span>UNRECONCILED VARIANCE</span>
            </span>
          )}
        </div>
      </div>

      <div className="vcep-recon-metrics-grid">
        <div className="vcep-recon-metric metric-raw">
          <div className="metric-label">1. Raw Source Inflow</div>
          <div className="metric-value">{formatMoney(rawAmount)}</div>
          <div className="metric-sub">{rawCount} Source Records</div>
          <div className="metric-tag">Immutable Archive</div>
        </div>

        <div className="vcep-recon-operator">=</div>

        <div className="vcep-recon-metric metric-approved">
          <div className="metric-label">2. Approved Clean (Active)</div>
          <div className="metric-value">{formatMoney(approvedAmount)}</div>
          <div className="metric-sub">{approvedCount} Validated Records</div>
          <div className="metric-tag">Decision Total</div>
        </div>

        <div className="vcep-recon-operator">+</div>

        <div className="vcep-recon-metric metric-quarantine">
          <div className="metric-label">3. Quarantined (Suspense)</div>
          <div className="metric-value">{formatMoney(quarantineAmount)}</div>
          <div className="metric-sub">{quarantineCount} Flagged Records</div>
          <div className="metric-tag">Documented Exposure</div>
        </div>
      </div>

      <div className="vcep-recon-equation-banner">
        <div className="vcep-recon-equation-text">
          <strong>Mathematical Proof:</strong>{' '}
          <code>
            {formatMoney(rawAmount)} (Raw) = {formatMoney(approvedAmount)} (Approved) + {formatMoney(quarantineAmount)} (Exceptions)
          </code>
        </div>
        {!isBalanced && (
          <div className="vcep-recon-variance-note">
            <span>Variance: {countVariance !== 0 ? `${countVariance} records ` : ''}{amountVariance !== 0 ? `${formatMoney(amountVariance)} unreconciled` : ''}</span>
          </div>
        )}
      </div>

      {customerBreakdown.length > 0 && (
        <div className="vcep-recon-breakdown">
          <div className="vcep-breakdown-title">
            <span>Approved Clean Customer Subtotals (=SUMIFS)</span>
          </div>
          <div className="vcep-breakdown-chips">
            {customerBreakdown.map((cust) => (
              <div key={cust.name} className="vcep-breakdown-chip">
                <span className="chip-customer">{cust.name}</span>
                <span className="chip-amount">{formatMoney(cust.amount)}</span>
                <span className="chip-count">({cust.count} {cust.count === 1 ? 'receipt' : 'receipts'})</span>
              </div>
            ))}
            <div className="vcep-breakdown-chip is-total">
              <span className="chip-customer">Total Approved</span>
              <span className="chip-amount">{formatMoney(approvedAmount)}</span>
              <span className="chip-count">({approvedCount} receipts)</span>
            </div>
          </div>
        </div>
      )}

      <div className="vcep-recon-footer-note">
        <HelpCircle size={14} aria-hidden="true" />
        <span>
          <strong>Corporate Accounting Governance:</strong> Never force balance by zeroing blank amounts (e.g. R05) or silently deleting duplicate rows without an exception log. An audit trail proves where every rupee went.
        </span>
      </div>
    </div>
  );
}
