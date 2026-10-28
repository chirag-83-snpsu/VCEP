'use client';

import React, { useState, useEffect } from 'react';
import { EvidenceHandoverCard } from './components/evidence-handover-card';
import { ShieldCheck, CheckCircle2, AlertTriangle, Calendar, Layers, FileCheck, RefreshCw } from 'lucide-react';

const STORAGE_KEY = 'vcep:s19:drive-v3:student-workstation';

export type AsOfDateOption = '2026-10-31' | '2026-11-01';

export type QaAuditCheck = {
  id: string;
  checkName: string;
  standard: string;
  method: string;
  status: 'VERIFIED PASS' | 'FLAGGED';
};

export type AcceptanceTestItem = {
  id: string;
  name: string;
  input: string;
  expected: string;
  actual: string;
  verdict: 'PASS' | 'FAIL';
};

export type Session19State = {
  asOfDate: AsOfDateOption;
  qaChecks: QaAuditCheck[];
  acceptanceTests: AcceptanceTestItem[];
  studentContribution: string;
  reviewerCorrection: string;
  checkedIndices: number[];
  timestamp?: string;
};

const initialQaChecks: QaAuditCheck[] = [
  {
    id: 'QA-01',
    checkName: 'Data Types & ISO Formatting',
    standard: 'Dates must strictly follow YYYY-MM-DD; currency in numeric INR with no text symbols in sum ranges.',
    method: 'Checked all 4 invoice records; cells formatted as Date and Number.',
    status: 'VERIFIED PASS',
  },
  {
    id: 'QA-02',
    checkName: 'Formula Dynamic Ranges',
    standard: 'Control total formulas must reference dynamic ranges or table headers without hardcoded sums.',
    method: 'Formula verified: =SUM(Table_Receivables[Outstanding INR]).',
    status: 'VERIFIED PASS',
  },
  {
    id: 'QA-03',
    checkName: 'Circular Reference Audit',
    standard: 'Zero circular dependencies between cash flow model and receivables aging schedule.',
    method: 'Excel iteration calculation disabled; 0 circular references found.',
    status: 'VERIFIED PASS',
  },
  {
    id: 'QA-04',
    checkName: 'Duplicate Record & Blank Detector',
    standard: 'Duplicate invoice IDs or blank amount fields must halt calculation and surface visual alert.',
    method: 'Tested with injected duplicate ID F02; conditional format flagged conflict.',
    status: 'VERIFIED PASS',
  },
];

const initialAcceptanceTests: AcceptanceTestItem[] = [
  {
    id: 'AT-01',
    name: 'Control Total Reconciliation',
    input: 'Case F version 1 invoices F01 through F04.',
    expected: 'Total equals ₹1,00,000 exactly with ₹0 variance.',
    actual: '₹1,00,000 control total reconciled (0 variance).',
    verdict: 'PASS',
  },
  {
    id: 'AT-02',
    name: 'Due-Today Boundary Rule',
    input: 'Invoice F01 due 2026-10-31 as-of 2026-10-31.',
    expected: 'Classified strictly as "Current" (0 days overdue).',
    actual: 'Categorized in Current bucket; 0 days overdue.',
    verdict: 'PASS',
  },
  {
    id: 'AT-03',
    name: 'Dispute Suspense Isolation',
    input: 'Beacon Logistics F02 (₹20,000 total with ₹5,000 disputed).',
    expected: '₹5,000 quarantined in suspense row, excluded from cash forecast.',
    actual: '₹5,000 isolated in suspense; net ₹15k available.',
    verdict: 'PASS',
  },
  {
    id: 'AT-04',
    name: 'As-Of Date Sensitivity',
    input: 'Shift as-of date from 2026-10-31 to 2026-11-01.',
    expected: 'F01 shifts to 1–30 Days Overdue; total remains ₹1,00,000.',
    actual: 'Bucket recalculated dynamically with 0 variance.',
    verdict: 'PASS',
  },
  {
    id: 'AT-05',
    name: '7-Day Liquidity Forecast Feasibility',
    input: '₹25,000 opening cash - ₹45,000 outflows + collections.',
    expected: 'Demonstrates positive closing surplus without emergency debt.',
    actual: 'Closing surplus of +₹5,000 achieved with targeted recovery.',
    verdict: 'PASS',
  },
];

export function Session19Workstation() {
  const [state, setState] = useState<Session19State>({
    asOfDate: '2026-10-31',
    qaChecks: initialQaChecks,
    acceptanceTests: initialAcceptanceTests,
    studentContribution:
      'Constructed the dynamic aging engine using MAX(0, AsOfDate - DueDate) and built the automated suspense account quarantine for the ₹5,000 disputed Beacon balance.',
    reviewerCorrection:
      'During peer audit, the reviewer noted that shifting as-of date to 1 November had left F01 in Current due to hardcoded date logic. Corrected the reference to dynamic input cell $B$2.',
    checkedIndices: [],
  });
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

  const saveState = (updated: Session19State) => {
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
    setState({
      asOfDate: '2026-10-31',
      qaChecks: initialQaChecks,
      acceptanceTests: initialAcceptanceTests,
      studentContribution: 'Constructed dynamic aging logic and dispute quarantine.',
      reviewerCorrection: 'Updated hardcoded date cells to dynamic parameter references.',
      checkedIndices: [],
    });
    setDraftTimestamp('');
  };

  // Sensitivity calculation based on asOfDate
  const is31Oct = state.asOfDate === '2026-10-31';
  const f01Bucket = is31Oct ? 'Current (0 Days)' : '1–30 Days Overdue (1 Day)';
  const currentTotal = is31Oct ? 10000 : 0;
  const overdue1to30Total = is31Oct ? 20000 : 30000;
  const overdue31to60Total = 30000;
  const overdue60PlusTotal = 40000;
  const grandTotal = currentTotal + overdue1to30Total + overdue31to60Total + overdue60PlusTotal;

  const rubric = [
    { name: 'Execution', points: 4, evidence: 'Executed all 5 acceptance tests with verifiable evidence; Excel QA audit complete.' },
    { name: 'Reasoning', points: 2, evidence: 'Explains date boundary behavior and dynamic bucket shifting without control total variance.' },
    { name: 'Communication', points: 2, evidence: 'Clear test register documenting inputs, expected results, actual outputs, and verdicts.' },
    { name: 'Professional Process', points: 2, evidence: 'Maintains individual contribution log and documents explicit before-and-after peer correction.' },
  ];

  const checklist = [
    'I ingested Case F version 1 (4 invoices totaling ₹1,00,000) with ₹0 variance.',
    'I audited data types, formula ranges, and verified zero circular references.',
    'I tested date boundary sensitivity: F01 shifts dynamically on 1 November.',
    'I verified that disputed ₹5,000 remains quarantined in suspense.',
    'I executed all 5 binary acceptance tests, recording PASS verdicts.',
    'I documented my individual contribution and one peer-reviewed correction.',
  ];

  return (
    <div className="vcep-workstation-root">
      {/* 1. Header & Principles */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 04 · QUALITY ASSURANCE & TESTING STUDIO</span>
          <h3>Execute Acceptance Tests, Audit Formulas & Enforce Edge Controls</h3>
          <p>
            Capstone Quality Assurance for Vayentra Labs: Ingest Case F version 1, test edge-case date boundaries, audit formulas for circular dependencies, and verify that the model calculates with zero unexplained variance.
          </p>
        </div>

        <div className="vcep-data-principles-banner">
          <div className="principle-item">
            <span className="principle-num">1</span>
            <strong>Dynamic Boundary Parameters:</strong> Never hardcode the calculation date. Changing the as-of parameter must dynamically refresh aging buckets while preserving control totals.
          </div>
          <div className="principle-item">
            <span className="principle-num">2</span>
            <strong>Zero Circular Dependencies:</strong> Financial schedules must flow unidirectionally (Source Ledgers → Aging Model → Cash Forecast); circular cell links break model integrity.
          </div>
          <div className="principle-item">
            <span className="principle-num">3</span>
            <strong>Documented Peer Corrections:</strong> Professional audit requires retaining evidence of what was challenged during peer review and how the correction was verified.
          </div>
        </div>
      </div>

      {/* 2. Dynamic As-Of Date Sensitivity Simulator */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: 0 }}>
              <Calendar size={18} /> As-Of Date Boundary Sensitivity Tester
            </h4>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563' }}>Simulation As-Of Date:</span>
              <button
                type="button"
                onClick={() => saveState({ ...state, asOfDate: '2026-10-31' })}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  background: state.asOfDate === '2026-10-31' ? '#0F766E' : '#fff',
                  color: state.asOfDate === '2026-10-31' ? '#fff' : '#374151',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                31 Oct 2026 (Baseline)
              </button>
              <button
                type="button"
                onClick={() => saveState({ ...state, asOfDate: '2026-11-01' })}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  background: state.asOfDate === '2026-11-01' ? '#17245C' : '#fff',
                  color: state.asOfDate === '2026-11-01' ? '#fff' : '#374151',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                01 Nov 2026 (+1 Day Shift)
              </button>
            </div>
          </div>

          <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 12px' }}>
            Observe how invoice <strong>F01 (Asha Technologies, due 31 Oct)</strong> behaves when the calculation date advances by 1 day.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '14px' }}>
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Current (Due Today)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F766E' }}>₹{currentTotal.toLocaleString('en-IN')}</div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{is31Oct ? 'F01 (₹10,000)' : '0 Invoices'}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>1–30 Days Overdue</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#17245C' }}>₹{overdue1to30Total.toLocaleString('en-IN')}</div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{is31Oct ? 'F02 (₹20k)' : 'F01 (₹10k) + F02 (₹20k)'}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>31–60 Days Overdue</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#17245C' }}>₹{overdue31to60Total.toLocaleString('en-IN')}</div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>F03 (₹30k)</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>61+ Days Overdue</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#17245C' }}>₹{overdue60PlusTotal.toLocaleString('en-IN')}</div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>F04 (₹40k)</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ecfdf5', padding: '10px 14px', borderRadius: '6px', border: '1px solid #a7f3d0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#065f46', fontSize: '0.85rem' }}>
              <CheckCircle2 size={18} />
              <strong>Control Total Invariance:</strong> Sum across all aging buckets equals <strong>₹{grandTotal.toLocaleString('en-IN')}</strong> (₹0 variance against Case F).
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857', background: '#fff', padding: '2px 8px', borderRadius: '4px' }}>
              RECONCILED ✓
            </span>
          </div>
        </div>
      </div>

      {/* 3. Excel QA Audit Checklist */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
            <FileCheck size={18} /> Excel Quality Assurance & Formula Audit Matrix
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {state.qaChecks.map((check) => (
              <div
                key={check.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: '1 1 300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0F766E' }}>{check.id}</span>
                    <strong style={{ fontSize: '0.85rem', color: '#17245C' }}>{check.checkName}</strong>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#4b5563', marginBottom: '2px' }}>
                    <strong>Quality Standard:</strong> {check.standard}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#047857' }}>
                    <strong>Audit Method:</strong> {check.method}
                  </div>
                </div>

                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '4px', background: '#ecfdf5', color: '#047857' }}>
                  {check.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Five Acceptance Tests Register */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
            <ShieldCheck size={18} /> Five Binary Acceptance Tests Execution Register
          </h4>

          <div style={{ overflowX: 'auto' }}>
            <table className="vcep-comparison-table" style={{ width: '100%', fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Test ID</th>
                  <th>Acceptance Criterion</th>
                  <th>Test Input</th>
                  <th>Expected Result</th>
                  <th>Actual Demonstrated Output</th>
                  <th style={{ width: '70px', textAlign: 'center' }}>Verdict</th>
                </tr>
              </thead>
              <tbody>
                {state.acceptanceTests.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 700, color: '#0F766E' }}>{t.id}</td>
                    <td style={{ fontWeight: 600, color: '#17245C' }}>{t.name}</td>
                    <td style={{ color: '#4b5563' }}>{t.input}</td>
                    <td style={{ color: '#374151' }}>{t.expected}</td>
                    <td style={{ color: '#15803d', fontWeight: 500 }}>{t.actual}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#15803d', color: '#fff', padding: '2px 8px', borderRadius: '4px' }}>
                        {t.verdict}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. Individual Contribution & Peer Correction Log */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
            <Layers size={18} /> Individual Squad Contribution & Peer-Review Correction Log
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#17245C', marginBottom: '4px' }}>
                My Specific Deliverable Contribution:
              </label>
              <textarea
                rows={3}
                value={state.studentContribution}
                onChange={(e) => saveState({ ...state, studentContribution: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.85rem', fontFamily: 'inherit' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#17245C', marginBottom: '4px' }}>
                Peer Reviewer Correction (Before vs After):
              </label>
              <textarea
                rows={3}
                value={state.reviewerCorrection}
                onChange={(e) => saveState({ ...state, reviewerCorrection: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.85rem', fontFamily: 'inherit' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 6. Evidence Handover & Checklist */}
      <div className="vcep-workstation-section">
        <EvidenceHandoverCard
          sessionId={19}
          sessionTitle="Project Execution and Quality Assurance"
          deliverableName="Audited Model v1.0 & Quality Test Log"
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
