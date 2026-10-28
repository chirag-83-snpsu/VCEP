'use client';

import React, { useState, useEffect } from 'react';
import { EvidenceHandoverCard } from './components/evidence-handover-card';
import { AlertTriangle, CheckCircle2, ShieldAlert, FileText, Bug, Play, RefreshCw, XCircle } from 'lucide-react';

const STORAGE_KEY = 'vcep:s14:drive-v3:student-workstation';

export type ClaimAuditItem = {
  id: string;
  claimNum: number;
  aiStatement: string;
  sourceFact: string;
  recalculation: string;
  verdict: 'FALSE' | 'MISLEADING' | 'ACCURATE';
  correction: string;
};

export type Session14State = {
  audits: ClaimAuditItem[];
  memoText: string;
  simulatedInput: 'valid' | 'missing_revenue' | 'invalid_format';
  checkedIndices: number[];
  timestamp?: string;
};

const initialAudits: ClaimAuditItem[] = [
  {
    id: 'c1',
    claimNum: 1,
    aiStatement: 'September revenue grew 30% over August.',
    sourceFact: 'Case D August Rev = ₹1,20,000; September Rev = ₹1,50,000.',
    recalculation: '(₹1,50,000 - ₹1,20,000) ÷ ₹1,20,000 = 25.0%.',
    verdict: 'FALSE',
    correction: 'September revenue grew by 25.0% over August, representing a ₹30,000 top-line expansion.',
  },
  {
    id: 'c2',
    claimNum: 2,
    aiStatement: 'Operating profit margin improved to 25%.',
    sourceFact: 'Case D September Op Profit = ₹30,000; Revenue = ₹1,50,000.',
    recalculation: '₹30,000 ÷ ₹1,50,000 = 20.0% (fell 2.5 pp from August 22.5%).',
    verdict: 'FALSE',
    correction: 'Operating profit margin contracted from 22.5% to 20.0% due to direct cost inflation.',
  },
  {
    id: 'c3',
    claimNum: 3,
    aiStatement: 'Receivables of ₹70,000 prove customers are paying on time.',
    sourceFact: 'Case D Receivables rose from ₹30,000 in July to ₹70,000 in September (+133%).',
    recalculation: 'Receivables now represent 46.7% of monthly sales.',
    verdict: 'MISLEADING',
    correction: 'High receivables indicate uncollected customer balances, locking operational cash on customer ledgers.',
  },
  {
    id: 'c4',
    claimNum: 4,
    aiStatement: 'Offer every customer a 20% discount to maximize profits.',
    sourceFact: 'Case D Operating Margin is currently 20.0%.',
    recalculation: 'A 20% discount reduces revenue by 20%, completely wiping out operating profits.',
    verdict: 'FALSE',
    correction: 'Reject universal discounts; protect gross margin and audit subcontractor delivery costs.',
  },
];

const defaultCorrectedMemo =
  'September revenue grew 25.0% to ₹1,50,000 (not 30.0%), while direct delivery costs surged 38.9% to ₹75,000. Consequently, operating profit margin contracted from 22.5% in August to 20.0% in September. Trade receivables expanded to ₹70,000, locking 46.7% of monthly sales in uncollected customer accounts. Recommendation: Reject proposed blanket 20% discounts, which would eliminate all operating profit. Operations Lead to audit direct supplier costs by Friday; Collections Lead to enforce payment terms on accounts overdue >30 days.';

export function Session14Workstation() {
  const [state, setState] = useState<Session14State>({
    audits: initialAudits,
    memoText: defaultCorrectedMemo,
    simulatedInput: 'valid',
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

  const saveState = (updated: Session14State) => {
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
      audits: initialAudits,
      memoText: defaultCorrectedMemo,
      simulatedInput: 'valid',
      checkedIndices: [],
    });
    setDraftTimestamp('');
  };

  // Word count check
  const words = state.memoText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const isMemoValid = wordCount > 0 && wordCount <= 120;

  // Workflow test status
  const isHalted = state.simulatedInput !== 'valid';

  const rubric = [
    { name: 'Execution', points: 4, evidence: 'All 4 AI claims audited against Case D with exact recalculations; corrected memo within 120 words.' },
    { name: 'Reasoning', points: 2, evidence: 'Explains why 20% discount wipes out operating margin and why receivables indicate unpaid debt.' },
    { name: 'Communication', points: 2, evidence: 'Clear claim audit register and professional executive memo citing verified figures.' },
    { name: 'Professional Process', points: 2, evidence: 'Demonstrates automated validation checkpoint that halts workflow on corrupt input.' },
  ];

  const checklist = [
    'I audited Claim 1 and proved that September revenue growth was 25.0%, not 30.0%.',
    'I audited Claim 2 and showed that operating margin contracted to 20.0%, not improved to 25.0%.',
    'I exposed Claim 3 as misleading, explaining that ₹70,000 receivables represent delayed collections.',
    'I disproved Claim 4, demonstrating that a 20% discount destroys operating profitability.',
    'I drafted a corrected 120-word executive memo replacing hallucinations with verified facts.',
    'I tested the automated checkpoint, confirming the workflow halts on missing or corrupt inputs.',
  ];

  return (
    <div className="vcep-workstation-root">
      {/* 1. Header & Principles */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 04 · AI VERIFICATION & WORKFLOW AUDIT STUDIO</span>
          <h3>Audit AI Hallucinations & Build Automated Checkpoints</h3>
          <p>
            An unverified AI draft made four confident business claims based on Case D. Audit each statement, calculate the factual numbers, draft a corrected memo, and test automated fault-injection checkpoints.
          </p>
        </div>

        <div className="vcep-data-principles-banner">
          <div className="principle-item">
            <span className="principle-num">1</span>
            <strong>Never Trust Linguistic Confidence:</strong> Fluent summaries often contain subtle, catastrophic calculation errors.
          </div>
          <div className="principle-item">
            <span className="principle-num">2</span>
            <strong>Explicit Recalculation:</strong> Disprove flawed assertions using exact mathematical formulas rather than subjective disagreement.
          </div>
          <div className="principle-item">
            <span className="principle-num">3</span>
            <strong>Fail-Closed Automation:</strong> An automated workflow must stop visibly on invalid data; it must never produce confident reports on corrupt inputs.
          </div>
        </div>
      </div>

      {/* 2. Four AI Claims Audit Register */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
            <AlertTriangle size={18} /> The Four AI Claims Audit Register
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {state.audits.map((a) => (
              <div
                key={a.id}
                style={{
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  background: a.verdict === 'FALSE' ? '#fef2f2' : '#fffbeb',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, color: '#17245C', fontSize: '0.9rem' }}>
                    Claim #{a.claimNum}: &ldquo;{a.aiStatement}&rdquo;
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: 700,
                      background: a.verdict === 'FALSE' ? '#fee2e2' : '#fef3c7',
                      color: a.verdict === 'FALSE' ? '#b91c1c' : '#b45309',
                    }}
                  >
                    VERDICT: {a.verdict}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#4b5563', lineHeight: 1.5 }}>
                  <div><strong>Case D Evidence:</strong> {a.sourceFact}</div>
                  <div><strong>Mathematical Recalculation:</strong> <code style={{ color: '#0F766E' }}>{a.recalculation}</code></div>
                  <div style={{ marginTop: '4px', color: '#15803d' }}>
                    <strong>Factual Correction:</strong> {a.correction}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Automated Checkpoint / Fault Injection Simulator */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: 0 }}>
              <Bug size={18} /> Automated Checkpoint & Fault-Injection Simulator
            </h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => saveState({ ...state, simulatedInput: 'valid' })}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  background: state.simulatedInput === 'valid' ? '#dcfce7' : '#fff',
                  color: state.simulatedInput === 'valid' ? '#15803d' : '#374151',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                Normal Input (₹1,50,000)
              </button>
              <button
                type="button"
                onClick={() => saveState({ ...state, simulatedInput: 'missing_revenue' })}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  background: state.simulatedInput === 'missing_revenue' ? '#fee2e2' : '#fff',
                  color: state.simulatedInput === 'missing_revenue' ? '#b91c1c' : '#374151',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                Inject Fault (Blank Revenue)
              </button>
            </div>
          </div>

          <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 12px' }}>
            A production AI workflow must fail-closed: if input data is missing or corrupted, the automated pipeline must abort before generating unverified text.
          </p>

          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${isHalted ? '#f87171' : '#86efac'}`,
              background: isHalted ? '#fef2f2' : '#f0fdf4',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {isHalted ? (
              <XCircle size={24} style={{ color: '#b91c1c', flexShrink: 0 }} />
            ) : (
              <CheckCircle2 size={24} style={{ color: '#15803d', flexShrink: 0 }} />
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isHalted ? '#991b1b' : '#166534' }}>
                {isHalted
                  ? 'WORKFLOW HALTED: Critical Input Failure Detected'
                  : 'CHECKPOINT PASSED: Valid Dataset Ingested'}
              </div>
              <div style={{ fontSize: '0.8rem', color: isHalted ? '#b91c1c' : '#15803d' }}>
                {isHalted
                  ? 'Condition triggered: =IF(OR(ISBLANK(B4), NOT(ISNUMBER(B4))), "HALT", "PROCEED") → Automated draft generation prevented to avoid publishing hallucinated 0% growth.'
                  : 'Condition verified: September revenue is numeric (₹1,50,000) and complete. Proceeding to constrained prompt formatting.'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Corrected Executive Memo Builder */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: 0 }}>
              <FileText size={18} /> Corrected 120-Word Executive Memo
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

          <textarea
            rows={5}
            value={state.memoText}
            onChange={(e) => saveState({ ...state, memoText: e.target.value })}
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
          sessionId={14}
          sessionTitle="AI Verification and Automation"
          deliverableName="AI Claim Audit Register & Corrected Executive Brief"
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
