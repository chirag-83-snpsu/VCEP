'use client';

import React, { useState, useEffect } from 'react';
import { EvidenceHandoverCard } from './components/evidence-handover-card';
import { Lock, ShieldAlert, Clock, MessageSquare, AlertCircle, CheckCircle2, Award, BookOpen } from 'lucide-react';

const STORAGE_KEY = 'vcep:s22:drive-v3:student-workstation';

export type VivaQuestion = {
  id: string;
  category: string;
  examinerQuestion: string;
  keyTechnicalConcept: string;
  candidateDefense: string;
};

export type Session22State = {
  vivaQuestions: VivaQuestion[];
  improvementPlan: string[];
  checkedIndices: number[];
  timestamp?: string;
};

const initialVivaQuestions: VivaQuestion[] = [
  {
    id: 'V1',
    category: 'Accounting Principles & Ind AS',
    examinerQuestion: 'Why did you classify advance customer payments as liabilities rather than revenue?',
    keyTechnicalConcept: 'Ind AS 115 Revenue Recognition & Performance Obligations',
    candidateDefense:
      'Under Ind AS 115, cash received prior to delivery represents an unfulfilled performance obligation. Revenue can only be recognized upon satisfaction of delivery and customer acceptance. Until then, advance payments must remain classified as a current liability to prevent misleading revenue inflation.',
  },
  {
    id: 'V2',
    category: 'Bank Reconciliation & Timing Bridges',
    examinerQuestion: 'How did you reconcile the ₹4,000 variance between the bank statement and company cash book?',
    keyTechnicalConcept: 'Timing Bridge (Uncredited vs Unpresented Cheques)',
    candidateDefense:
      'The ₹4,000 variance is entirely due to timing differences: ₹6,000 in cheques deposited but not yet cleared by the bank, and ₹10,000 in issued cheques not yet presented for payment. Applying the timing bridge: ₹87,200 bank balance + ₹6,000 uncredited - ₹10,000 unpresented reconciles exactly to the ₹83,200 adjusted cash book balance with ₹0 unexplained variance.',
  },
  {
    id: 'V3',
    category: 'Sales Operations & Funnel Analytics',
    examinerQuestion: 'Why is it deceptive to report only the Closed-Lead Win Rate in sales operations?',
    keyTechnicalConcept: 'Denominator Transparency (All-Lead vs Closed-Lead)',
    candidateDefense:
      'Closed-Lead Win Rate (3 won ÷ 5 closed = 60.0%) measures closing efficiency on decided deals, but it excludes 3 open inquiries. Reporting 60% alone conceals stalled leads in the pipeline. The All-Lead Win Rate (3 won ÷ 8 total = 37.5%) provides full visibility into marketing acquisition reach and stalled deal volume.',
  },
  {
    id: 'V4',
    category: 'Commercial Unit Economics',
    examinerQuestion: 'Why does accepting 30 seats at a 10% discount produce zero incremental profit?',
    keyTechnicalConcept: 'Break-Even Shifts & Capacity Exhaustion',
    candidateDefense:
      'At standard price ₹10,000 and ₹4,000 variable cost, unit contribution is ₹6,000. At 25 seats, total contribution is ₹1,50,000, yielding ₹30,000 profit over ₹1,20,000 fixed costs. Discounting to ₹9,000 reduces unit contribution to ₹5,000. At 30 seats, total contribution remains ₹1,50,000, generating identical ₹30,000 profit (₹0 incremental gain) while exhausting 100% operational capacity with zero buffer.',
  },
  {
    id: 'V5',
    category: 'Professional Ethics & Governance',
    examinerQuestion: 'What would you do if an executive asked you to remove an unverified ₹5,000 suspense item to balance the books?',
    keyTechnicalConcept: 'Audit Integrity & Fraud Prevention (ICAI Code of Ethics)',
    candidateDefense:
      'I would respectfully refuse and retain the ₹5,000 in an isolated suspense account. Falsifying or concealing unverified items violates professional accounting ethics and internal control standards. I would document the dispute details and escalate through approved management channels until verified source vouchers are obtained.',
  },
];

const initialImprovementPlan = [
  'Day 1–10: Re-run independent Excel cleaning drills focusing on nested XLOOKUP and dynamic spill formulas.',
  'Day 11–20: Deepen statutory GST knowledge, specifically input tax credit (ITC) reconciliation under Rule 36(4).',
  'Day 21–30: Practice verbal articulation of financial tradeoffs and sensitivity modeling under interview time constraints.',
];

export function Session22Workstation() {
  const [state, setState] = useState<Session22State>({
    vivaQuestions: initialVivaQuestions,
    improvementPlan: initialImprovementPlan,
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

  const saveState = (updated: Session22State) => {
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
      vivaQuestions: initialVivaQuestions,
      improvementPlan: initialImprovementPlan,
      checkedIndices: [],
    });
    setDraftTimestamp('');
  };

  const rubric = [
    { name: 'Execution', points: 4, evidence: 'Completed timed Exit B assessment independently; all 5 viva defenses structured and accurate.' },
    { name: 'Reasoning', points: 2, evidence: 'Demonstrates deep conceptual mastery of Ind AS, BRS bridges, unit economics, and audit integrity.' },
    { name: 'Communication', points: 2, evidence: 'Articulates technical arguments with precision, professional vocabulary, and confidence.' },
    { name: 'Professional Process', points: 2, evidence: 'Complies strictly with controlled examination conditions (zero AI) and formulates 30-day action plan.' },
  ];

  const checklist = [
    'I completed the 60-minute unseen practical assessment independently without AI.',
    'I defended the accounting rationale for classifying advances as liabilities.',
    'I explained the ₹4,000 BRS timing bridge with exact uncredited/unpresented amounts.',
    'I articulated the distinction between All-Lead and Closed-Lead win rates.',
    'I proved mathematically why the 30-seat discount yields ₹0 incremental profit.',
    'I defended professional accounting ethics regarding unresolved suspense items.',
    'I formulated a concrete 30-day post-assessment skill enhancement plan.',
  ];

  return (
    <div className="vcep-workstation-root">
      {/* 1. Controlled Assessment Security Banner */}
      <div className="vcep-workstation-section">
        <div style={{ background: '#1e1b4b', border: '1px solid #312e81', borderRadius: '10px', padding: '16px 20px', color: '#fff', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lock size={22} style={{ color: '#E5AF2E' }} />
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#E5AF2E', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  CONTROLLED ASSESSMENT · FORMAL EXAMINATION
                </span>
                <h3 style={{ margin: '2px 0 0', color: '#fff', fontSize: '1.25rem' }}>
                  Exit Assessment B & Technical Viva Voce Defense
                </h3>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: '6px' }}>
              <Clock size={16} style={{ color: '#E5AF2E' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>60 MIN TIMED · ZERO AI</span>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
            This module represents your independent summative assessment. All generative AI tools, automated assistance, and external browsing are locked by the platform. You must independently solve the unseen practical task and defend your technical reasoning before the faculty panel.
          </p>
        </div>

        <div className="vcep-data-principles-banner">
          <div className="principle-item">
            <span className="principle-num">1</span>
            <strong>Independent Execution:</strong> Official certification requires proof of individual competency without external assistance.
          </div>
          <div className="principle-item">
            <span className="principle-num">2</span>
            <strong>Technical Defensibility:</strong> Being able to execute a spreadsheet is insufficient; you must defend every formula and business judgment under cross-examination.
          </div>
          <div className="principle-item">
            <span className="principle-num">3</span>
            <strong>Uncompromising Ethics:</strong> A corporate accountant's highest duty is transparency. Concealing discrepancies destroys professional credibility.
          </div>
        </div>
      </div>

      {/* 2. Five Technical Viva Voce Scenarios */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
            <MessageSquare size={18} /> Five Core Technical Viva Voce Defense Scenarios
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {state.vivaQuestions.map((q) => (
              <div
                key={q.id}
                style={{
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '8px',
                  padding: '14px',
                  background: '#fafafa',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F766E', textTransform: 'uppercase' }}>
                    {q.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>
                    Focus: {q.keyTechnicalConcept}
                  </span>
                </div>

                <div style={{ fontSize: '0.9rem', color: '#17245C', fontWeight: 700, marginBottom: '8px' }}>
                  Examiner Question: "{q.examinerQuestion}"
                </div>

                <div style={{ background: '#fff', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
                  <strong style={{ color: '#047857' }}>Model Technical Defense: </strong>
                  {q.candidateDefense}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. 30-Day Post-Feedback Improvement Plan */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
            <BookOpen size={18} /> 30-Day Post-Assessment Competency Improvement Plan
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {state.improvementPlan.map((plan, idx) => (
              <div key={idx} style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#17245C' }}>
                <strong>Milestone {idx + 1}:</strong> {plan}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Evidence Handover & Checklist */}
      <div className="vcep-workstation-section">
        <EvidenceHandoverCard
          sessionId={22}
          sessionTitle="Hiring Simulation and Exit Assessment"
          deliverableName="Exit Assessment B & Technical Interview Defense"
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
