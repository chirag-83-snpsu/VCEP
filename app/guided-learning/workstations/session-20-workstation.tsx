'use client';

import React, { useState, useEffect } from 'react';
import { EvidenceHandoverCard } from './components/evidence-handover-card';
import { GitBranch, ShieldAlert, ArrowRight, CheckCircle2, FileText, AlertCircle, TrendingDown, DollarSign } from 'lucide-react';

const STORAGE_KEY = 'vcep:s20:drive-v3:student-workstation';

export type ModelVersion = 'v1.0' | 'v2.0';

export type ChangeLogEntry = {
  id: string;
  authority: string;
  description: string;
  ledgerImpact: string;
  cashImpact: string;
  retestStatus: 'VERIFIED' | 'PENDING';
};

export type Session20State = {
  selectedVersion: ModelVersion;
  changeLog: ChangeLogEntry[];
  executiveMemo: string;
  checkedIndices: number[];
  timestamp?: string;
};

const initialChangeLog: ChangeLogEntry[] = [
  {
    id: 'CR-01',
    authority: 'Managing Director (31 Oct)',
    description: 'Approved ₹5,000 credit note against Beacon Logistics invoice F02 for disputed SLA shortfall.',
    ledgerImpact: 'F02 reduced from ₹20,000 to ₹15,000; total receivables reduce from ₹1,00,000 to ₹95,000.',
    cashImpact: '₹0 bank cash impact. Credit notes extinguish outstanding debt; they do not collect cash.',
    retestStatus: 'VERIFIED',
  },
  {
    id: 'CR-02',
    authority: 'Finance Lead (31 Oct)',
    description: 'Rescheduled ₹8,000 non-critical supplier payment from 03 Nov to 10 Nov (beyond the 7-day window).',
    ledgerImpact: '7-day mandatory cash outflows reduce from ₹45,000 to ₹37,000.',
    cashImpact: 'Deficit shrinks by ₹8,000 (from ₹20,000 to ₹12,000), protecting Friday payroll without debt.',
    retestStatus: 'VERIFIED',
  },
];

const defaultExecutiveMemo =
  'To Managing Director: Model v2.0 successfully incorporates two approved changes as of 31 October. First, a ₹5,000 credit note issued to Beacon Logistics resolves invoice F02 dispute, reducing gross receivables to ₹95,000 while injecting ₹0 new bank cash. Second, rescheduling ₹8,000 in non-critical supplier payments beyond the 7-day window compresses mandatory outflows from ₹45,000 to ₹37,000. Against our ₹25,000 opening cash, the immediate payroll deficit drops from ₹20,000 to ₹12,000. By prioritizing prompt collection of Asha Technologies (₹10,000), our remaining Friday liquidity shortfall is contained to ₹2,000 without emergency debt.';

export function Session20Workstation() {
  const [state, setState] = useState<Session20State>({
    selectedVersion: 'v2.0',
    changeLog: initialChangeLog,
    executiveMemo: defaultExecutiveMemo,
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

  const saveState = (updated: Session20State) => {
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
      selectedVersion: 'v2.0',
      changeLog: initialChangeLog,
      executiveMemo: defaultExecutiveMemo,
      checkedIndices: [],
    });
    setDraftTimestamp('');
  };

  const isV2 = state.selectedVersion === 'v2.0';
  const grossReceivables = isV2 ? 95000 : 100000;
  const f02Amount = isV2 ? 15000 : 20000;
  const bankCash = 25000;
  const sevenDayOutflows = isV2 ? 37000 : 45000;
  const cashDeficit = sevenDayOutflows - bankCash; // 20000 in v1, 12000 in v2

  // Word count check
  const words = state.executiveMemo.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const isMemoValid = wordCount > 0 && wordCount <= 130;

  const rubric = [
    { name: 'Execution', points: 4, evidence: 'Updated Model v2.0 accurately reflecting ₹5k credit note and ₹8k deferral; change log complete.' },
    { name: 'Reasoning', points: 2, evidence: 'Distinguishes between receivables adjustments (credit notes) and actual bank cash receipts.' },
    { name: 'Communication', points: 2, evidence: 'Concise executive memo (<= 120 words) detailing deficit reduction from ₹20,000 to ₹12,000.' },
    { name: 'Professional Process', points: 2, evidence: 'Maintains version discipline (Model v1.0 preserved) with verified Change Control Board sign-offs.' },
  ];

  const checklist = [
    'I preserved Model v1.0 as an immutable baseline workbook before applying changes.',
    'I created Model v2.0 reflecting the approved ₹5,000 credit note on F02 (Beacon).',
    'I verified that total receivables reduce from ₹1,00,000 to ₹95,000.',
    'I confirmed that credit notes do not generate bank cash; opening cash remains ₹25,000.',
    'I updated 7-day outflows from ₹45,000 to ₹37,000 following the ₹8,000 deferral.',
    'I calculated the revised liquidity deficit (₹12,000 vs ₹20,000 baseline).',
    'I documented the Change Control Board log and drafted the executive briefing memo.',
  ];

  return (
    <div className="vcep-workstation-root">
      {/* 1. Header & Principles */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 04 · CHANGE CONTROL & MANAGEMENT REVIEW STUDIO</span>
          <h3>Assess Approved Scope Changes, Branch Model v2.0 & Maintain Audit Log</h3>
          <p>
            Management Review for Vayentra Labs: Evaluate two approved business modifications as of 31 October: a ₹5,000 credit note against Beacon F02 and an ₹8,000 supplier deferral. Maintain version discipline and audit liquidity impact.
          </p>
        </div>

        <div className="vcep-data-principles-banner">
          <div className="principle-item">
            <span className="principle-num">1</span>
            <strong>Credit Notes vs Cash Receipts:</strong> A credit note reduces receivables; it injects zero bank cash. Mistaking a credit note for revenue or cash is a critical accounting error.
          </div>
          <div className="principle-item">
            <span className="principle-num">2</span>
            <strong>Timing Deferral Economics:</strong> Rescheduling payments alters 7-day cash flow timing, reducing immediate liquidity strain without altering total liabilities.
          </div>
          <div className="principle-item">
            <span className="principle-num">3</span>
            <strong>Version Control Discipline:</strong> Never overwrite baseline files (`Model_v1.0.xlsx`). Always branch to a new version (`Model_v2.0.xlsx`) and log authority in the Change Register.
          </div>
        </div>
      </div>

      {/* 2. Model Version Branching Engine */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: 0 }}>
              <GitBranch size={18} /> Model Version Comparison Engine
            </h4>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => saveState({ ...state, selectedVersion: 'v1.0' })}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  background: state.selectedVersion === 'v1.0' ? '#17245C' : '#fff',
                  color: state.selectedVersion === 'v1.0' ? '#fff' : '#374151',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Model v1.0 (Baseline Frozen)
              </button>
              <button
                type="button"
                onClick={() => saveState({ ...state, selectedVersion: 'v2.0' })}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #0F766E',
                  background: state.selectedVersion === 'v2.0' ? '#0F766E' : '#fff',
                  color: state.selectedVersion === 'v2.0' ? '#fff' : '#374151',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Model v2.0 (Approved Changes Applied)
              </button>
            </div>
          </div>

          {/* Metric Comparison Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Gross Receivables</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#17245C', margin: '4px 0' }}>
                ₹{grossReceivables.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.75rem', color: isV2 ? '#047857' : '#6b7280' }}>
                {isV2 ? '₹5k credit applied on F02 (Beacon)' : '4 Invoices (F01–F04)'}
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Opening Bank Cash</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F766E', margin: '4px 0' }}>
                ₹{bankCash.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#0F766E', fontWeight: 600 }}>
                Unchanged (Credit note ≠ Cash)
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>7-Day Cash Outflows</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#b45309', margin: '4px 0' }}>
                ₹{sevenDayOutflows.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.75rem', color: isV2 ? '#047857' : '#6b7280' }}>
                {isV2 ? '₹8k supplier outflow deferred' : '₹45k mandatory outflows'}
              </div>
            </div>

            <div style={{ background: isV2 ? '#ecfdf5' : '#fef2f2', padding: '12px', borderRadius: '8px', border: `1px solid ${isV2 ? '#a7f3d0' : '#fecdd3'}` }}>
              <div style={{ fontSize: '0.75rem', color: isV2 ? '#047857' : '#991b1b', textTransform: 'uppercase' }}>Immediate Cash Deficit</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: isV2 ? '#047857' : '#991b1b', margin: '4px 0' }}>
                -₹{cashDeficit.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.75rem', color: isV2 ? '#047857' : '#991b1b', fontWeight: 600 }}>
                {isV2 ? 'Deficit shrunk by ₹8,000 ✓' : 'Emergency debt risk!'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fffbeb', padding: '10px 14px', borderRadius: '6px', border: '1px solid #fde68a', fontSize: '0.85rem', color: '#92400e' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>
              <strong>Audit Verification:</strong> Version 2.0 demonstrates that deferring ₹8,000 in vendor outflows directly shrinks the Friday liquidity gap from ₹20,000 to ₹12,000, allowing Vayentra Labs to avoid bridge loan interest.
            </span>
          </div>
        </div>
      </div>

      {/* 3. Change Control Board Register */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
            <ShieldAlert size={18} /> Official Change Control Board (CCB) Log
          </h4>

          <div style={{ overflowX: 'auto' }}>
            <table className="vcep-comparison-table" style={{ width: '100%', fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th style={{ width: '65px' }}>Change ID</th>
                  <th style={{ width: '130px' }}>Authority</th>
                  <th>Description & Reason</th>
                  <th>Ledger Adjustment</th>
                  <th>Cash Impact</th>
                  <th style={{ width: '80px', textAlign: 'center' }}>Retest</th>
                </tr>
              </thead>
              <tbody>
                {state.changeLog.map((cr) => (
                  <tr key={cr.id}>
                    <td style={{ fontWeight: 700, color: '#0F766E' }}>{cr.id}</td>
                    <td style={{ fontWeight: 600, color: '#17245C' }}>{cr.authority}</td>
                    <td style={{ color: '#374151' }}>{cr.description}</td>
                    <td style={{ color: '#17245C', fontWeight: 500 }}>{cr.ledgerImpact}</td>
                    <td style={{ color: '#047857', fontWeight: 500 }}>{cr.cashImpact}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '4px' }}>
                        {cr.retestStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Corrected Executive Briefing Memo */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: 0 }}>
              <FileText size={18} /> Executive Management Briefing Memo (Model v2.0)
            </h4>
            <span
              style={{
                fontSize: '0.8rem',
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: 600,
                background: isMemoValid ? '#ecfdf5' : '#fee2e2',
                color: isMemoValid ? '#15803d' : '#b91c1c',
              }}
            >
              {wordCount} / 120 words {isMemoValid ? '✓' : '(Exceeds Limit!)'}
            </span>
          </div>

          <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 10px' }}>
            Summarize the two approved changes, clarify why cash is unchanged by the credit note, and detail how the liquidity deficit is contained.
          </p>

          <textarea
            rows={5}
            value={state.executiveMemo}
            onChange={(e) => saveState({ ...state, executiveMemo: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${isMemoValid ? '#d1d5db' : '#ef4444'}`,
              fontSize: '0.85rem',
              fontFamily: 'inherit',
              lineHeight: 1.5,
            }}
          />
        </div>
      </div>

      {/* 5. Evidence Handover & Checklist */}
      <div className="vcep-workstation-section">
        <EvidenceHandoverCard
          sessionId={20}
          sessionTitle="Management Review and Change Control"
          deliverableName="Revised Model v2.0 & Change Control Log"
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
