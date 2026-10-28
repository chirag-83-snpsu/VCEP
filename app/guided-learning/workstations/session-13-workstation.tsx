'use client';

import React, { useState, useEffect } from 'react';
import { EvidenceHandoverCard } from './components/evidence-handover-card';
import { ShieldCheck, Lock, FileCode, CheckCircle2, AlertOctagon, Terminal } from 'lucide-react';

const STORAGE_KEY = 'vcep:s13:drive-v3:student-workstation';

export type RedactionItem = {
  id: string;
  category: string;
  rawSample: string;
  sanitizedLabel: string;
  reason: string;
};

export type VerificationLogItem = {
  id: string;
  claim: string;
  sourceDoc: string;
  calculatedValue: string;
  auditVerdict: 'Verified Accurate' | 'Requires Revision' | 'Hallucination Excluded';
};

export type Session13State = {
  redactions: RedactionItem[];
  promptTemplate: string;
  verificationLogs: VerificationLogItem[];
  checkedIndices: number[];
  timestamp?: string;
};

const initialRedactions: RedactionItem[] = [
  {
    id: 'r1',
    category: 'Client & Counterparty Names',
    rawSample: 'Asha Enterprises, Beacon Logistics',
    sanitizedLabel: 'Customer A, Customer B',
    reason: 'Under India DPDP Act 2023 and enterprise NDA rules, proprietary client lists must never be disclosed to third-party public AI providers.',
  },
  {
    id: 'r2',
    category: 'Banking Credentials & Account #s',
    rawSample: 'HDFC A/c #5010049281, IFSC HDFC0000128',
    sanitizedLabel: '[REDACTED_OPERATIONAL_ACCOUNT]',
    reason: 'Live treasury coordinates create cyber fraud exposure and violate banking data privacy protocols.',
  },
  {
    id: 'r3',
    category: 'Unit Pricing & Subcontractor Rates',
    rawSample: '₹75,000 direct delivery expense to vendor',
    sanitizedLabel: 'Direct delivery expense (Index: 100)',
    reason: 'Vendor cost breakdowns represent trade secrets and must not train public foundational models.',
  },
];

const defaultPrompt =
  'Act as a Senior Financial Analyst. You are given strictly the following anonymized 3-month performance data for a professional services firm:\n- July: Revenue ₹1,00,000; Direct Costs ₹40,000; Overheads ₹35,000; Receivables ₹30,000\n- August: Revenue ₹1,20,000; Direct Costs ₹54,000; Overheads ₹39,000; Receivables ₹45,000\n- September: Revenue ₹1,50,000; Direct Costs ₹75,000; Overheads ₹45,000; Receivables ₹70,000\n\nTask: Draft a 120-word executive briefing on gross margin and operating margin movement.\nConstraints:\n1. Base your briefing strictly on the numbers above; do not invent causes or assume payment dates.\n2. Calculate exact percentage point changes for margins.\n3. Explicitly state any data limitations.';

const initialLogs: VerificationLogItem[] = [
  {
    id: 'v1',
    claim: 'September Gross Margin compressed by 10.0 percentage points compared to July.',
    sourceDoc: 'Case D MIS Release (July & September Direct Delivery Costs)',
    calculatedValue: 'July: 60.0% → September: 50.0% (-10.0 pp)',
    auditVerdict: 'Verified Accurate',
  },
  {
    id: 'v2',
    claim: 'Receivables expanded by 133.3% from July to September.',
    sourceDoc: 'Case D Closing Receivables line item',
    calculatedValue: '(₹70,000 - ₹30,000) ÷ ₹30,000 = +133.3%',
    auditVerdict: 'Verified Accurate',
  },
  {
    id: 'v3',
    claim: 'Operating profit fell by 15% in September.',
    sourceDoc: 'Case D Operating Profit recalculation',
    calculatedValue: 'Aug ₹27k → Sep ₹30k (+11.1% increase, not decrease!)',
    auditVerdict: 'Hallucination Excluded',
  },
];

export function Session13Workstation() {
  const [state, setState] = useState<Session13State>({
    redactions: initialRedactions,
    promptTemplate: defaultPrompt,
    verificationLogs: initialLogs,
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

  const saveState = (updated: Session13State) => {
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
      redactions: initialRedactions,
      promptTemplate: defaultPrompt,
      verificationLogs: initialLogs,
      checkedIndices: [],
    });
    setDraftTimestamp('');
  };

  const rubric = [
    { name: 'Execution', points: 4, evidence: 'Data minimization plan complete; structured prompt enforces explicit data boundaries.' },
    { name: 'Reasoning', points: 2, evidence: 'Explains why public AI models must never receive raw banking or client identity details.' },
    { name: 'Communication', points: 2, evidence: 'Precise prompt syntax and clear verification audit log citing Case D source records.' },
    { name: 'Professional Process', points: 2, evidence: 'Maintains independent human recalculation of all financial assertions.' },
  ];

  const checklist = [
    'I identified 3 categories of confidential corporate data to sanitize under DPDP standards.',
    'I replaced real company and customer names with standard synthetic labels.',
    'My structured prompt defines persona, exact data inputs, explicit task, and constraints.',
    'I explicitly instructed the model not to invent causes or assume payment dates.',
    'I conducted human line-by-line verification on the output using Case D source data.',
    'I logged an audit trail identifying accurate claims versus excluded hallucinations.',
  ];

  return (
    <div className="vcep-workstation-root">
      {/* 1. Header & Principles */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 04 · ENTERPRISE AI COMPLIANCE STUDIO</span>
          <h3>Data Minimization, Boundary Prompting & Human Verification</h3>
          <p>
            Enterprise AI policy for commerce professionals: sanitize sensitive client data under DPDP standards, structure high-precision prompts with strict boundaries, and maintain a rigorous human audit log.
          </p>
        </div>

        <div className="vcep-data-principles-banner">
          <div className="principle-item">
            <span className="principle-num">1</span>
            <strong>Data Minimization:</strong> Never upload customer identities, bank details, or private contracts to public AI tools.
          </div>
          <div className="principle-item">
            <span className="principle-num">2</span>
            <strong>Constrained Boundary Prompting:</strong> Enforce strict rules: specify allowed numbers, forbid hallucinated deductions, and request uncertainty disclosures.
          </div>
          <div className="principle-item">
            <span className="principle-num">3</span>
            <strong>Human Ownership:</strong> Fluency is not evidence of mathematical fact. A licensed human accountant remains legally accountable for all numbers.
          </div>
        </div>
      </div>

      {/* 2. Data Minimization & Redaction Plan */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
            <Lock size={18} /> Enterprise Data Minimization & Redaction Schedule
          </h4>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(23, 36, 92, 0.15)', textAlign: 'left', color: '#17245C' }}>
                  <th style={{ padding: '8px 10px' }}>Confidential Category</th>
                  <th style={{ padding: '8px 10px' }}>Raw Source Sample</th>
                  <th style={{ padding: '8px 10px' }}>Sanitized Public Label</th>
                  <th style={{ padding: '8px 10px' }}>Regulatory & Risk Justification</th>
                </tr>
              </thead>
              <tbody>
                {state.redactions.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: '#17245C' }}>{r.category}</td>
                    <td style={{ padding: '8px 10px', color: '#b91c1c', fontFamily: 'monospace' }}>{r.rawSample}</td>
                    <td style={{ padding: '8px 10px', color: '#0F766E', fontWeight: 600, fontFamily: 'monospace' }}>{r.sanitizedLabel}</td>
                    <td style={{ padding: '8px 10px', color: '#4b5563', fontSize: '0.8rem' }}>{r.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. Structured Boundary Prompt Builder */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 8px' }}>
            <Terminal size={18} /> Constrained Enterprise Prompt Template
          </h4>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 10px' }}>
            Notice the 4 architecture elements: <strong>Role Definition</strong>, <strong>Anonymized Data Input</strong>, <strong>Explicit Task</strong>, and <strong>Negative Boundary Constraints</strong>.
          </p>
          <textarea
            rows={8}
            value={state.promptTemplate}
            onChange={(e) => saveState({ ...state, promptTemplate: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              lineHeight: 1.4,
              background: '#f8fafc',
            }}
          />
        </div>
      </div>

      {/* 4. Human Verification & Audit Log */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
            <ShieldCheck size={18} /> Human Verification Audit Trail (Line-by-Line Fact Checking)
          </h4>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(23, 36, 92, 0.15)', textAlign: 'left', color: '#17245C' }}>
                  <th style={{ padding: '8px 10px' }}>AI-Generated Assertion</th>
                  <th style={{ padding: '8px 10px' }}>Case D Source Document</th>
                  <th style={{ padding: '8px 10px' }}>Human Recalculation</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Audit Verdict</th>
                </tr>
              </thead>
              <tbody>
                {state.verificationLogs.map((l) => (
                  <tr key={l.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <td style={{ padding: '8px 10px', color: '#17245C' }}>{l.claim}</td>
                    <td style={{ padding: '8px 10px', color: '#4b5563' }}>{l.sourceDoc}</td>
                    <td style={{ padding: '8px 10px', fontFamily: 'monospace', color: '#111827' }}>{l.calculatedValue}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: 600,
                          background: l.auditVerdict === 'Verified Accurate' ? '#dcfce7' : '#fee2e2',
                          color: l.auditVerdict === 'Verified Accurate' ? '#15803d' : '#b91c1c',
                        }}
                      >
                        {l.auditVerdict}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. Evidence Handover & Checklist */}
      <div className="vcep-workstation-section">
        <EvidenceHandoverCard
          sessionId={13}
          sessionTitle="AI for Commerce Professionals"
          deliverableName="AI Data Protection Plan & Audited Management Brief"
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
