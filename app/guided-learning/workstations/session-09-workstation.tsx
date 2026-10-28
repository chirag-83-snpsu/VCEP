'use client';

import React, { useState, useEffect } from 'react';
import { EvidenceHandoverCard } from './components/evidence-handover-card';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'vcep:s09:drive-v3:student-workstation';

export type MISData = {
  measure: string;
  july: number;
  august: number;
  september: number;
};

export type Session09State = {
  findings: string[];
  uncertainty: string;
  investigation: string;
  checkedIndices: number[];
  timestamp?: string;
};

const initialSession09State: Session09State = {
  findings: [
    '1. Gross Margin Compression: While September revenue expanded 25.0% MoM to ₹1,50,000, direct delivery costs surged 38.9% to ₹75,000. As a result, Gross Margin contracted by 5.0 percentage points from August (55.0% to 50.0%) and 10.0 percentage points from July (60.0% to 50.0%).',
    '2. Operating Margin Deterioration: Operating profit increased modestly from ₹27,000 to ₹30,000 (+11.1%), but Operating Margin dropped from 22.5% to 20.0% due to cost inflation outpacing top-line sales growth.',
    '3. Cash Flow & Receivables Risk: Outstanding trade receivables surged from ₹30,000 in July to ₹70,000 in September (+133.3%). Receivables now represent 46.7% of monthly billed revenue, locking operating liquidity on customer balance sheets.',
  ],
  uncertainty:
    'Case D reports direct delivery expenses net of tax but does not disclose whether the cost surge was caused by volume discounts offered by sales or unit price inflation charged by third-party suppliers.',
  investigation:
    'Finance Lead to cross-audit September customer contract pricing against vendor supplier invoices by Friday to determine whether contract margins were diluted or operational subcontractor rates escalated.',
  checkedIndices: [],
};

export function Session09Workstation() {
  const [state, setState] = useState<Session09State>(initialSession09State);
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

  const saveState = (updated: Session09State) => {
    const timestamp = new Date().toLocaleTimeString();
    setDraftTimestamp(timestamp);
    const withTime = { ...updated, timestamp };
    setState(withTime);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(withTime));
    } catch {}
  };

  const handleFindingChange = (index: number, val: string) => {
    const next = [...state.findings];
    next[index] = val;
    saveState({ ...state, findings: next });
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
    setState(initialSession09State);
    setDraftTimestamp('');
  };

  // Case D Baseline Data
  const misData = [
    { measure: 'Revenue (Net Billed)', july: 100000, august: 120000, september: 150000 },
    { measure: 'Direct Delivery Cost (COGS)', july: 40000, august: 54000, september: 75000 },
    { measure: 'Gross Profit', july: 60000, august: 66000, september: 75000, isCalculated: true },
    { measure: 'Gross Margin %', july: '60.0%', august: '55.0%', september: '50.0%', isCalculated: true, alert: '-10.0 pp drop' },
    { measure: 'Operating Overhead', july: 35000, august: 39000, september: 45000 },
    { measure: 'Operating Profit', july: 25000, august: 27000, september: 30000, isCalculated: true },
    { measure: 'Operating Margin %', july: '25.0%', august: '22.5%', september: '20.0%', isCalculated: true, alert: '-5.0 pp drop' },
    { measure: 'Closing Trade Receivables', july: 30000, august: 45000, september: 70000, alert: '+133% surge' },
  ];

  const rubric = [
    { name: 'Execution', points: 4, evidence: 'All monthly gross profits, operating profits, margins, and growth rates calculated accurately.' },
    { name: 'Reasoning', points: 2, evidence: 'Distinguishes between % revenue growth and percentage point margin compression with clear evidence.' },
    { name: 'Communication', points: 2, evidence: 'Presents 3 structured findings, 1 material business uncertainty, and 1 actionable investigation.' },
    { name: 'Professional Process', points: 2, evidence: 'Refuses to accept top-line sales growth as proof of health without cash/margin verification.' },
  ];

  const checklist = [
    'I calculated Gross Profit (Revenue - Direct Cost) and Operating Profit (Gross Profit - Overhead) for all 3 months.',
    'I computed Gross Margin % and Operating Margin % for July, August, and September.',
    'I calculated MoM revenue growth (+25.0%) and operating profit growth (+11.1%) from August to September.',
    'I analyzed the 10.0 percentage point compression in Gross Margin between July and September.',
    'I noted that receivables rose from ₹30,000 to ₹70,000 (representing 46.7% of monthly sales).',
    'I documented 3 evidence-backed findings, 1 critical uncertainty, and 1 investigation plan.',
  ];

  return (
    <div className="vcep-workstation-root">
      {/* 1. Brief & Context */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 04 · INTERACTIVE FINANCIAL WORKSTATION</span>
          <h3>Case D Three-Month Financial Intelligence & Performance Studio</h3>
          <p>
            Evaluate revenue growth, cost of goods sold, and receivables across July, August, and September. Learn why revenue growth alone does not guarantee business health.
          </p>
        </div>

        <div className="vcep-data-principles-banner">
          <div className="principle-item">
            <span className="principle-num">1</span>
            <strong>Gross Margin vs Operating Margin:</strong> Gross Margin measures pricing power after direct delivery costs; Operating Margin tests overhead control.
          </div>
          <div className="principle-item">
            <span className="principle-num">2</span>
            <strong>% Growth vs Percentage Points:</strong> A fall from 55% to 50% is a 5 percentage point compression, not a 5% drop.
          </div>
          <div className="principle-item">
            <span className="principle-num">3</span>
            <strong>Receivables vs Cash:</strong> Billed sales tied up in unpaid accounts receivable do not fund payroll or supplier obligations.
          </div>
        </div>
      </div>

      {/* 2. Three-Month Performance Matrix */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
            <TrendingUp size={18} /> Case D Three-Month MIS Performance Matrix (Net of Tax)
          </h4>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(23, 36, 92, 0.15)', textAlign: 'left', color: '#17245C' }}>
                  <th style={{ padding: '10px 12px' }}>Financial Metric</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>July (INR)</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>August (INR)</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>September (INR)</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>August → September Trend</th>
                </tr>
              </thead>
              <tbody>
                {misData.map((row, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid rgba(0,0,0,0.06)',
                      background: row.isCalculated ? 'rgba(23, 36, 92, 0.02)' : '#fff',
                      fontWeight: row.isCalculated ? 600 : 400,
                    }}
                  >
                    <td style={{ padding: '10px 12px', color: '#17245C' }}>
                      {row.measure}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      {typeof row.july === 'number' ? `₹${row.july.toLocaleString('en-IN')}` : row.july}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      {typeof row.august === 'number' ? `₹${row.august.toLocaleString('en-IN')}` : row.august}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      {typeof row.september === 'number' ? `₹${row.september.toLocaleString('en-IN')}` : row.september}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      {row.alert ? (
                        <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: '#fee2e2', color: '#b91c1c', fontWeight: 600 }}>
                          {row.alert}
                        </span>
                      ) : row.measure.includes('Revenue') ? (
                        <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: '#dcfce7', color: '#15803d', fontWeight: 600 }}>
                          +25.0% Growth
                        </span>
                      ) : row.measure.includes('Operating Profit') ? (
                        <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: '#fef3c7', color: '#92400e', fontWeight: 600 }}>
                          +11.1% Growth
                        </span>
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. Findings, Uncertainty & Investigation */}
      <div className="vcep-workstation-section">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="v3-panel" style={{ margin: 0 }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
              <FileText size={16} /> Three Evidence-Backed Management Findings
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {state.findings.map((f, i) => (
                <div key={i}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '4px', display: 'block' }}>
                    Finding #{i + 1}
                  </label>
                  <textarea
                    rows={2}
                    value={f}
                    onChange={(e) => handleFindingChange(i, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      fontSize: '0.85rem',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <div className="v3-panel" style={{ margin: 0 }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 8px' }}>
                <AlertTriangle size={16} /> Critical Business Uncertainty
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 8px' }}>
                Identify one vital piece of information not supplied in Case D that must be verified before accepting management claims.
              </p>
              <textarea
                rows={3}
                value={state.uncertainty}
                onChange={(e) => saveState({ ...state, uncertainty: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div className="v3-panel" style={{ margin: 0 }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 8px' }}>
                <CheckCircle2 size={16} /> Operational Audit Investigation
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 8px' }}>
                State the concrete investigation you will lead, naming the assigned owner and the source records to be inspected.
              </p>
              <textarea
                rows={3}
                value={state.investigation}
                onChange={(e) => saveState({ ...state, investigation: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Evidence Handover & Checklist */}
      <div className="vcep-workstation-section">
        <EvidenceHandoverCard
          sessionId={9}
          sessionTitle="Business Finance and Performance"
          deliverableName="Financial Performance Report & Management Findings"
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
