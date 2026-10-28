'use client';

import React, { useState, useEffect } from 'react';
import { EvidenceHandoverCard } from './components/evidence-handover-card';
import { Award, Briefcase, FileText, CheckCircle2, AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'vcep:s21:drive-v3:student-workstation';

export type PortfolioArtifact = {
  id: string;
  session: string;
  title: string;
  evidenceType: string;
  verificationHash: string;
};

export type ResumeBullet = {
  id: string;
  domain: string;
  xAccomplished: string;
  yMeasured: string;
  zMethod: string;
  fullText: string;
  status: 'AUTHENTIC' | 'INFLATED';
};

export type Session21State = {
  bullets: ResumeBullet[];
  portfolio: PortfolioArtifact[];
  summaryText: string;
  checkedIndices: number[];
  timestamp?: string;
};

const initialBullets: ResumeBullet[] = [
  {
    id: 'B1',
    domain: 'Financial Modeling & Reconciliation',
    xAccomplished: 'Engineered dynamic 4-account receivables aging model',
    yMeasured: 'reconciling ₹1,00,000 in ledger invoices with zero unexplained variance',
    zMethod: 'by applying ISO date boundary rules and dynamic spreadsheet ranges',
    fullText: 'Engineered dynamic 4-account receivables aging model reconciling ₹1,00,000 in ledger invoices with zero variance, automating date boundary logic across 4 aging buckets.',
    status: 'AUTHENTIC',
  },
  {
    id: 'B2',
    domain: 'Liquidity Planning & Risk Mitigation',
    xAccomplished: 'Formulated 7-day cash flow scenario averting Friday payroll default',
    yMeasured: 'shrinking net deficit by ₹8,000 (from ₹20,000 to ₹12,000)',
    zMethod: 'by negotiating a non-critical vendor payment deferral without incurring debt',
    fullText: 'Formulated 7-day cash flow scenario identifying a ₹20,000 payroll deficit, negotiating an ₹8,000 vendor deferral to contain immediate shortfall without external debt.',
    status: 'AUTHENTIC',
  },
  {
    id: 'B3',
    domain: 'AI Governance & Compliance',
    xAccomplished: 'Audited enterprise AI financial models under DPDP standards',
    yMeasured: 'disproving 4 hallucinatory commercial claims including a 5% margin discrepancy',
    zMethod: 'by constructing automated fail-closed fault injection checkpoints in Excel',
    fullText: 'Audited enterprise AI commercial models under DPDP standards, catching a 5% revenue calculation error and building automated fail-closed spreadsheet controls.',
    status: 'AUTHENTIC',
  },
];

const initialPortfolio: PortfolioArtifact[] = [
  {
    id: 'VCEP-ART-S07',
    session: 'Session 07',
    title: 'Cleaned Transaction Ledger & Variance Bridge',
    evidenceType: 'Excel Workbook (₹44,000 = ₹25,000 + ₹19,000)',
    verificationHash: 'SHA-S07-44K-BALANCED',
  },
  {
    id: 'VCEP-ART-S08',
    session: 'Session 08',
    title: 'Three-Column Bank Reconciliation Statement',
    evidenceType: 'BRS Model (₹87,200 Bank ↔ ₹83,200 Adjusted Cash)',
    verificationHash: 'SHA-S08-BRS-VERIFIED',
  },
  {
    id: 'VCEP-ART-S10',
    session: 'Session 10',
    title: 'Executive MIS Financial Dashboard',
    evidenceType: 'Dynamic KPI Matrix (₹1,50,000 Rev / 20.0% Op Margin)',
    verificationHash: 'SHA-S10-MIS-VERIFIED',
  },
  {
    id: 'VCEP-ART-S11',
    session: 'Session 11',
    title: 'GST Tax Invoice & GSTR-2B Matching Register',
    evidenceType: 'Tax Audit Schedule (Matched ₹20,000 ITC / Flagged Non-Compliant)',
    verificationHash: 'SHA-S11-GST-MATCHED',
  },
  {
    id: 'VCEP-ART-S14',
    session: 'Session 14',
    title: 'AI Verification Register & Fail-Closed Fault Checkpoint',
    evidenceType: 'Claim Audit Memo & Automated Halt Formula',
    verificationHash: 'SHA-S14-AIV-HALT-OK',
  },
  {
    id: 'VCEP-ART-S18',
    session: 'Session 18',
    title: 'Solution Architecture & 10-Day Project Charter',
    evidenceType: 'WBS & RACI Matrix (≤ 6.0 Hrs Individual Effort Cap)',
    verificationHash: 'SHA-S18-WBS-PASSED',
  },
];

const defaultSummary =
  'Finance and commerce professional with hands-on simulation experience in financial modeling, statutory GST compliance, and enterprise AI auditing. Independently reconciled ₹1,00,000 receivables schedules with zero variance, structured bank reconciliations with timing bridges, and governed project scope within disciplined deadlines. Adept at translating complex financial records into executive management memos, maintaining strict audit trails, and applying DPDP data minimization standards.';

export function Session21Workstation() {
  const [state, setState] = useState<Session21State>({
    bullets: initialBullets,
    portfolio: initialPortfolio,
    summaryText: defaultSummary,
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

  const saveState = (updated: Session21State) => {
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
      bullets: initialBullets,
      portfolio: initialPortfolio,
      summaryText: defaultSummary,
      checkedIndices: [],
    });
    setDraftTimestamp('');
  };

  // Word count check
  const words = state.summaryText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const isSummaryValid = wordCount > 0 && wordCount <= 95;

  const rubric = [
    { name: 'Execution', points: 4, evidence: 'Drafted 3 XYZ resume bullets, compiled 6-artifact portfolio index, and wrote 90-word summary.' },
    { name: 'Reasoning', points: 2, evidence: 'Applies Google XYZ framework (Accomplished [X] as measured by [Y] by doing [Z]) without inflation.' },
    { name: 'Communication', points: 2, evidence: 'High-impact action verbs, precise numerical metrics, and professional corporate tone.' },
    { name: 'Professional Process', points: 2, evidence: 'Every single resume claim directly links to an authentic VCEP project artifact ID.' },
  ];

  const checklist = [
    'I avoided generic self-descriptions like "quick learner" or "hard worker".',
    'I drafted 3 technical resume bullets using the Google XYZ formula.',
    'I checked all numerical metrics against authentic VCEP project records.',
    'I indexed 6 verifiable deliverables with unique artifact IDs and hashes.',
    'I drafted a concise 90-word professional executive summary for LinkedIn/resume.',
    'I identified one target skill gap and formulated an actionable practice goal.',
  ];

  return (
    <div className="vcep-workstation-root">
      {/* 1. Header & Principles */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 04 · RESUME & PROFESSIONAL PORTFOLIO STUDIO</span>
          <h3>Translate Capstone Deliverables into Verified XYZ Resume Bullets</h3>
          <p>
            Career Readiness for Vayentra Commerce Graduates: Convert simulation achievements into evidence-backed resume bullet points using the Google XYZ formula. Eliminate inflated claims and assemble a verifiable portfolio index.
          </p>
        </div>

        <div className="vcep-data-principles-banner">
          <div className="principle-item">
            <span className="principle-num">1</span>
            <strong>The Google XYZ Formula:</strong> Accomplished [X] as measured by [Y] by doing [Z]. State the business outcome, quantify the scale, and specify your technical method.
          </div>
          <div className="principle-item">
            <span className="principle-num">2</span>
            <strong>Anti-Inflation Principle:</strong> Never claim to have "boosted company profit 40%" when your work was a simulation. Frame authentic capability: *"Engineered a 4-account financial model reconciling ₹1,00,000"*.
          </div>
          <div className="principle-item">
            <span className="principle-num">3</span>
            <strong>Verifiable Deliverable IDs:</strong> A corporate recruiter can verify your claims because every bullet point corresponds to an authentic, auditable student artifact.
          </div>
        </div>
      </div>

      {/* 2. Google XYZ Resume Bullets Studio */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
            <Award size={18} /> High-Impact Resume Bullets (Google XYZ Framework)
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {state.bullets.map((b) => (
              <div
                key={b.id}
                style={{
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  background: '#fafafa',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F766E', textTransform: 'uppercase' }}>
                    {b.domain}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857', background: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
                    VERIFIED AUTHENTIC ✓
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#17245C', fontWeight: 600, lineHeight: 1.4, marginBottom: '8px' }}>
                  "{b.fullText}"
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '0.75rem', color: '#4b5563', background: '#fff', padding: '8px', borderRadius: '6px' }}>
                  <div><strong>X (Accomplished):</strong> {b.xAccomplished}</div>
                  <div><strong>Y (Measured):</strong> {b.yMeasured}</div>
                  <div><strong>Z (By Doing):</strong> {b.zMethod}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. 6-Artifact Verifiable Portfolio Index */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
            <Briefcase size={18} /> Six-Artifact Verifiable Professional Portfolio Index
          </h4>

          <div style={{ overflowX: 'auto' }}>
            <table className="vcep-comparison-table" style={{ width: '100%', fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th style={{ width: '110px' }}>Artifact ID</th>
                  <th style={{ width: '90px' }}>Session</th>
                  <th>Deliverable Title</th>
                  <th>Verification Evidence</th>
                  <th style={{ width: '170px' }}>Verification Hash</th>
                </tr>
              </thead>
              <tbody>
                {state.portfolio.map((art) => (
                  <tr key={art.id}>
                    <td style={{ fontWeight: 700, color: '#0F766E' }}>{art.id}</td>
                    <td style={{ color: '#6b7280' }}>{art.session}</td>
                    <td style={{ color: '#17245C', fontWeight: 600 }}>{art.title}</td>
                    <td style={{ color: '#374151' }}>{art.evidenceType}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#047857' }}>{art.verificationHash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. 90-Word Executive Summary */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: 0 }}>
              <FileText size={18} /> 90-Word Professional Career Summary
            </h4>
            <span
              style={{
                fontSize: '0.8rem',
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: 600,
                background: isSummaryValid ? '#ecfdf5' : '#fee2e2',
                color: isSummaryValid ? '#15803d' : '#b91c1c',
              }}
            >
              {wordCount} / 90 words {isSummaryValid ? '✓' : '(Exceeds Limit!)'}
            </span>
          </div>

          <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 10px' }}>
            A concise professional summary suitable for your LinkedIn About section or resume header. Emphasize your verifiable capabilities.
          </p>

          <textarea
            rows={4}
            value={state.summaryText}
            onChange={(e) => saveState({ ...state, summaryText: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${isSummaryValid ? '#d1d5db' : '#ef4444'}`,
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
          sessionId={21}
          sessionTitle="Resume and Portfolio Development"
          deliverableName="Professional Resume Bullets & Portfolio Index"
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
