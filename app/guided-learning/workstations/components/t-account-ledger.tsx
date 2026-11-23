'use client';

import React from 'react';
import { BookOpen, Scale, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export type JournalEntry = {
  id: string;
  docId: string;
  date: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  evidenceStatus: 'Verified' | 'Missing Source Evidence' | 'Quarantined';
};

export type TAccountItem = {
  accountName: string;
  accountType: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  debits: { date: string; ref: string; amount: number }[];
  credits: { date: string; ref: string; amount: number }[];
};

export type TAccountLedgerProps = {
  accounts: TAccountItem[];
  trialBalanceEntries: { account: string; debit: number; credit: number }[];
  currencySymbol?: string;
};

export function TAccountLedger({
  accounts,
  trialBalanceEntries,
  currencySymbol = '₹',
}: TAccountLedgerProps) {
  const totalDebits = trialBalanceEntries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredits = trialBalanceEntries.reduce((sum, e) => sum + e.credit, 0);
  const variance = totalDebits - totalCredits;
  const isBalanced = variance === 0;

  const formatMoney = (val: number) => `${currencySymbol}${val.toLocaleString('en-IN')}`;

  return (
    <div className="vcep-t-account-ledger">
      <div className="vcep-ledger-header">
        <div className="vcep-ledger-title">
          <BookOpen size={18} aria-hidden="true" />
          <div>
            <h4>General Ledger T-Accounts & Trial Balance Close</h4>
            <p>Every transaction maintains the fundamental accounting identity: Assets = Liabilities + Equity.</p>
          </div>
        </div>

        <div className="vcep-ledger-status">
          {isBalanced ? (
            <span className="vcep-status-pill pill-balanced">
              <CheckCircle2 size={13} aria-hidden="true" />
              <span>TRIAL BALANCE BALANCED (₹0 VARIANCE)</span>
            </span>
          ) : (
            <span className="vcep-status-pill pill-warning">
              <AlertTriangle size={13} aria-hidden="true" />
              <span>UNBALANCED: {formatMoney(Math.abs(variance))}</span>
            </span>
          )}
        </div>
      </div>

      {/* Grid of Visual T-Accounts */}
      <div className="vcep-t-accounts-grid">
        {accounts.map((acc) => {
          const accDebitsTotal = acc.debits.reduce((sum, d) => sum + d.amount, 0);
          const accCreditsTotal = acc.credits.reduce((sum, c) => sum + c.amount, 0);
          const netBalance =
            acc.accountType === 'Asset' || acc.accountType === 'Expense'
              ? accDebitsTotal - accCreditsTotal
              : accCreditsTotal - accDebitsTotal;

          return (
            <div key={acc.accountName} className="vcep-t-card">
              <div className="t-card-header">
                <span className="t-card-name">{acc.accountName}</span>
                <span className={`t-card-type type-${acc.accountType.toLowerCase()}`}>{acc.accountType}</span>
              </div>

              <div className="t-card-t-shape">
                {/* Left Side: DEBITS */}
                <div className="t-column t-col-debit">
                  <div className="t-col-header">DEBIT (Dr)</div>
                  <div className="t-entries-list">
                    {acc.debits.length === 0 ? (
                      <div className="t-empty">—</div>
                    ) : (
                      acc.debits.map((d, i) => (
                        <div key={i} className="t-entry-row">
                          <span className="t-ref">{d.ref}</span>
                          <span className="t-val">{formatMoney(d.amount)}</span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="t-col-sum">Dr Total: {formatMoney(accDebitsTotal)}</div>
                </div>

                {/* Right Side: CREDITS */}
                <div className="t-column t-col-credit">
                  <div className="t-col-header">CREDIT (Cr)</div>
                  <div className="t-entries-list">
                    {acc.credits.length === 0 ? (
                      <div className="t-empty">—</div>
                    ) : (
                      acc.credits.map((c, i) => (
                        <div key={i} className="t-entry-row">
                          <span className="t-ref">{c.ref}</span>
                          <span className="t-val">{formatMoney(c.amount)}</span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="t-col-sum">Cr Total: {formatMoney(accCreditsTotal)}</div>
                </div>
              </div>

              <div className="t-card-footer">
                <span className="t-balance-label">Closing Net Balance:</span>
                <span className="t-balance-val">{formatMoney(netBalance)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trial Balance Schedule */}
      <div className="vcep-tb-schedule">
        <div className="vcep-tb-header">
          <Scale size={16} aria-hidden="true" />
          <h5>Trial Balance Verification Schedule</h5>
        </div>

        <div className="vcep-tb-table-wrap">
          <table className="vcep-tb-table">
            <thead>
              <tr>
                <th scope="col">General Ledger Account</th>
                <th scope="col" style={{ width: '180px', textAlign: 'right' }}>Debit (Dr)</th>
                <th scope="col" style={{ width: '180px', textAlign: 'right' }}>Credit (Cr)</th>
              </tr>
            </thead>
            <tbody>
              {trialBalanceEntries.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.account}</td>
                  <td style={{ textAlign: 'right' }}>{row.debit > 0 ? formatMoney(row.debit) : '—'}</td>
                  <td style={{ textAlign: 'right' }}>{row.credit > 0 ? formatMoney(row.credit) : '—'}</td>
                </tr>
              ))}
              <tr className="vcep-tb-total-row">
                <td><strong>Closing Reconciled Total</strong></td>
                <td style={{ textAlign: 'right' }}><strong>{formatMoney(totalDebits)}</strong></td>
                <td style={{ textAlign: 'right' }}><strong>{formatMoney(totalCredits)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
