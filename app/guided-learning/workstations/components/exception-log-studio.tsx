'use client';

import React from 'react';
import { AlertOctagon, ShieldAlert, FileText, CheckCircle } from 'lucide-react';

export type ExceptionItem = {
  id: string;
  sourceId: string;
  rawCustomer: string;
  rawAmount: string | number;
  rawDate: string;
  category: 'Duplicate Entry' | 'Invalid Date' | 'Missing Value' | 'Ambiguous Date Format' | 'Custom';
  riskDescription: string;
  auditAction: string;
  status: 'Quarantined (Suspense)' | 'Under Investigation' | 'Resolved / Excluded' | 'Officer Approved';
  officerNotes?: string;
};

export type ExceptionLogStudioProps = {
  exceptions: ExceptionItem[];
  onChange?: (id: string, field: keyof ExceptionItem, value: string) => void;
  readOnly?: boolean;
};

export function ExceptionLogStudio({
  exceptions,
  onChange,
  readOnly = false,
}: ExceptionLogStudioProps) {
  const getCategoryBadgeClass = (category: ExceptionItem['category']) => {
    switch (category) {
      case 'Duplicate Entry':
        return 'cat-duplicate';
      case 'Invalid Date':
        return 'cat-invalid-date';
      case 'Missing Value':
        return 'cat-missing-val';
      case 'Ambiguous Date Format':
        return 'cat-ambiguous-date';
      default:
        return 'cat-default';
    }
  };

  return (
    <div className="vcep-exception-studio">
      <div className="vcep-studio-header">
        <div className="vcep-studio-title-group">
          <div className="vcep-studio-icon">
            <ShieldAlert size={18} aria-hidden="true" />
          </div>
          <div>
            <h3>Audit Correction & Exception Register</h3>
            <p>
              Professional accounting standard: Never silently delete or zero out anomalies. Document every quarantine decision with an audit trail.
            </p>
          </div>
        </div>
        <div className="vcep-studio-count">
          <span className="vcep-count-badge">{exceptions.length} Quarantined Items</span>
        </div>
      </div>

      <div className="vcep-exception-table-wrapper" tabIndex={0} role="region" aria-label="Exceptions Table">
        <table className="vcep-exception-table">
          <thead>
            <tr>
              <th scope="col" style={{ width: '80px' }}>Source ID</th>
              <th scope="col" style={{ width: '130px' }}>Anomaly Type</th>
              <th scope="col" style={{ width: '140px' }}>Raw Value</th>
              <th scope="col">Financial / Audit Risk</th>
              <th scope="col" style={{ width: '180px' }}>Mandatory Action</th>
              <th scope="col" style={{ width: '160px' }}>Review Status</th>
              <th scope="col">Auditor Verification Note</th>
            </tr>
          </thead>
          <tbody>
            {exceptions.map((item) => (
              <tr key={item.id} className="vcep-exception-row">
                <td className="vcep-cell-id">
                  <strong>{item.sourceId}</strong>
                </td>
                <td>
                  <span className={`vcep-category-pill ${getCategoryBadgeClass(item.category)}`}>
                    {item.category}
                  </span>
                </td>
                <td className="vcep-cell-raw-val">
                  <code>
                    {item.rawDate} | {item.rawCustomer} | {item.rawAmount}
                  </code>
                </td>
                <td className="vcep-cell-risk">
                  <span className="risk-text">{item.riskDescription}</span>
                </td>
                <td className="vcep-cell-action">
                  <span className="action-tag">{item.auditAction}</span>
                </td>
                <td>
                  {readOnly ? (
                    <span className="status-label">{item.status}</span>
                  ) : (
                    <select
                      aria-label={`Status for ${item.sourceId}`}
                      value={item.status}
                      onChange={(e) => onChange?.(item.id, 'status', e.target.value as any)}
                      className="vcep-status-select"
                    >
                      <option value="Quarantined (Suspense)">Quarantined (Suspense)</option>
                      <option value="Under Investigation">Under Investigation</option>
                      <option value="Resolved / Excluded">Resolved / Excluded</option>
                      <option value="Officer Approved">Officer Approved</option>
                    </select>
                  )}
                </td>
                <td>
                  {readOnly ? (
                    <span className="vcep-cell-notes">{item.officerNotes || '—'}</span>
                  ) : (
                    <input
                      type="text"
                      aria-label={`Auditor note for ${item.sourceId}`}
                      value={item.officerNotes || ''}
                      placeholder="Add audit reference or confirmation..."
                      onChange={(e) => onChange?.(item.id, 'officerNotes', e.target.value)}
                      className="vcep-input-notes"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="vcep-exception-governance-bar">
        <div className="vcep-gov-item">
          <FileText size={14} aria-hidden="true" />
          <span><strong>Traceability:</strong> Every excluded row retains its raw line reference to prevent data loss.</span>
        </div>
        <div className="vcep-gov-item">
          <AlertOctagon size={14} aria-hidden="true" />
          <span><strong>Zeroing Prohibition:</strong> Blank amounts are never converted to ₹0 (creates fictitious precision).</span>
        </div>
      </div>
    </div>
  );
}
