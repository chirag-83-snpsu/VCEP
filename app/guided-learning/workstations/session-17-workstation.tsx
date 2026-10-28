'use client';

import React, { useState, useEffect } from 'react';
import { EvidenceHandoverCard } from './components/evidence-handover-card';
import { Compass, HelpCircle, FileText, ShieldAlert, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'vcep:s17:drive-v3:student-workstation';

export type DiscoveryQuestion = {
  id: string;
  category: string;
  question: string;
  stakeholderAnswer: string;
  evidenceRequired: string;
};

export type Session17State = {
  questions: DiscoveryQuestion[];
  problemStatement: string;
  assumptions: string[];
  checkedIndices: number[];
  timestamp?: string;
};

const initialQuestions: DiscoveryQuestion[] = [
  {
    id: 'q1',
    category: 'Target User Persona',
    question: 'Who will use this financial model daily to make operational decisions?',
    stakeholderAnswer: 'The Managing Director (for weekly liquidity sign-off) and the Collections Lead (for daily debtor calls).',
    evidenceRequired: 'Role accountability matrix and sign-off workflow.',
  },
  {
    id: 'q2',
    category: 'High-Stakes Decision',
    question: 'Which critical management decision is currently blocked by lack of visibility?',
    stakeholderAnswer: 'Deciding which client to contact first to cover a ₹20,000 cash deficit before Friday payroll without taking emergency debt.',
    evidenceRequired: '7-day cash obligations breakdown (₹45,000 unavoidable outflows).',
  },
  {
    id: 'q3',
    category: 'Available Data Sources',
    question: 'What source ledgers are verified and authorized for this capstone?',
    stakeholderAnswer: 'Case F Receivables Ledger (4 invoices totaling ₹1,00,000) and opening bank balance of ₹25,000.',
    evidenceRequired: 'Case F version 1 ledger records.',
  },
  {
    id: 'q4',
    category: 'System Join Limitation',
    question: 'Can we connect the CRM sales leads (Case G) to accounting invoices (Case F)?',
    stakeholderAnswer: 'No primary key or common customer ID exists between Case F and Case G. They must remain separate datasets.',
    evidenceRequired: 'Explicit project scope exclusion log.',
  },
  {
    id: 'q5',
    category: 'Aging Calculation Rules',
    question: 'How should overdue days and aging buckets be determined?',
    stakeholderAnswer: 'Days Overdue = Max(0, 31 Oct - Due Date). Invoices due on 31 Oct are classified as Current, not overdue.',
    evidenceRequired: 'Standardized aging schedule formula test.',
  },
  {
    id: 'q6',
    category: 'Dispute Quarantine',
    question: 'How should Beacon Logistics’ ₹5,000 disputed balance be handled?',
    stakeholderAnswer: 'Isolate the ₹5,000 in suspense. Do not count it as confirmed cash until operations signs off on deliverables.',
    evidenceRequired: 'Separate line item on cash forecast.',
  },
  {
    id: 'q7',
    category: 'Scope Boundaries',
    question: 'Are automated SMS gateways or payment gateway integrations included in scope?',
    stakeholderAnswer: 'Strictly excluded. Version 1 is a verified spreadsheet workbook and decision memo only.',
    evidenceRequired: 'Out-of-scope charter boundary agreement.',
  },
  {
    id: 'q8',
    category: 'Measurable Success Metric',
    question: 'What test proves the project has succeeded on Demo Day?',
    stakeholderAnswer: 'All 4 Case F invoices accounted for with zero variance, and 7-day cash forecast demonstrates closing surplus.',
    evidenceRequired: 'Zero-variance reconciliation proof on Case F control total.',
  },
];

const defaultProblemStatement =
  'The Managing Director of Vayentra Labs lacks visibility into ₹1,00,000 across 4 outstanding client invoices, creating a ₹20,000 liquidity deficit against upcoming payroll obligations. Because sales leads and invoice ledgers lack verified data keys, collections teams cannot prioritize debtors. We will construct a 7-day cash deficit model and receivables aging schedule that reconciles to Case F with zero variance within 10 working days.';

const initialAssumptions = [
  '1. Immutable Data Baseline: Case F version 1 numbers (₹1,00,000 receivables, ₹25,000 bank, ₹45,000 outflows) remain frozen throughout the project.',
  '2. No Join Key: Case F accounting invoices and Case G CRM inquiries must never be merged into a single table.',
  '3. Resource Cap: Student time is capped at 6 additional individual hours over a 10-working-day delivery timeline.',
];

export function Session17Workstation() {
  const [state, setState] = useState<Session17State>({
    questions: initialQuestions,
    problemStatement: defaultProblemStatement,
    assumptions: initialAssumptions,
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

  const saveState = (updated: Session17State) => {
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
      questions: initialQuestions,
      problemStatement: defaultProblemStatement,
      assumptions: initialAssumptions,
      checkedIndices: [],
    });
    setDraftTimestamp('');
  };

  // Word count check
  const words = state.problemStatement.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const isProblemStatementValid = wordCount > 0 && wordCount <= 85;

  const rubric = [
    { name: 'Execution', points: 4, evidence: '8 discovery questions and answers complete; problem statement strictly <= 80 words.' },
    { name: 'Reasoning', points: 2, evidence: 'Distinguishes between client symptoms ("we need a dashboard") and business root causes (liquidity deficit).' },
    { name: 'Communication', points: 2, evidence: 'Problem statement clearly states Persona, Problem, Evidence, Consequence, and Success Metric.' },
    { name: 'Professional Process', points: 2, evidence: 'Explicitly documents data boundaries, including the absence of a join key between Case F and Case G.' },
  ];

  const checklist = [
    'I conducted the discovery interview covering all 8 operational dimensions.',
    'I identified the core decision: averting the ₹20,000 payroll deficit before Friday.',
    'I acknowledged that Case F invoices cannot be joined to Case G sales leads.',
    'I drafted an 80-word business problem statement following the 5-element framework.',
    'I documented 3 critical project assumptions and verified the 6-hour student time cap.',
    'I established the zero-variance Case F control total (₹1,00,000) as the project success benchmark.',
  ];

  return (
    <div className="vcep-workstation-root">
      {/* 1. Header & Principles */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 04 · CAPSTONE DISCOVERY STUDIO</span>
          <h3>Client Discovery Interview & Business Problem Formulation</h3>
          <p>
            Capstone Discovery for Vayentra Labs: Interview the business founder, separate symptoms from root causes, translate complaints into a measurable problem statement, and establish project boundaries.
          </p>
        </div>

        <div className="vcep-data-principles-banner">
          <div className="principle-item">
            <span className="principle-num">1</span>
            <strong>Symptoms vs Root Causes:</strong> A client asks for "a dashboard" (symptom/tool); discovery reveals they need a cash prioritization model to prevent payroll default (root cause).
          </div>
          <div className="principle-item">
            <span className="principle-num">2</span>
            <strong>Data Boundary Integrity:</strong> Never assume datasets can be joined without verified foreign keys. Case F and Case G remain strictly separate.
          </div>
          <div className="principle-item">
            <span className="principle-num">3</span>
            <strong>The 5-Element Problem Statement:</strong> Persona → Measurable Problem → Root Cause Evidence → Business Consequence → Success Metric.
          </div>
        </div>
      </div>

      {/* 2. Eight Discovery Questions & Findings Matrix */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
            <Compass size={18} /> The Eight Structured Discovery Questions & Findings
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {state.questions.map((q) => (
              <div key={q.id} style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: '6px', padding: '10px', background: '#fafafa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F766E', textTransform: 'uppercase' }}>
                    {q.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>ID: {q.id}</span>
                </div>
                <div style={{ fontWeight: 600, color: '#17245C', fontSize: '0.85rem', marginBottom: '4px' }}>
                  {q.question}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#374151', lineHeight: 1.4 }}>
                  <strong>Client Finding:</strong> {q.stakeholderAnswer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. 80-Word Business Problem Statement */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: 0 }}>
              <FileText size={18} /> 80-Word Business Problem Statement
            </h4>
            <span
              style={{
                fontSize: '0.8rem',
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: 600,
                background: isProblemStatementValid ? '#ecfdf5' : '#fee2e2',
                color: isProblemStatementValid ? '#15803d' : '#b91c1c',
              }}
            >
              {wordCount} / 80 words {isProblemStatementValid ? '✓' : '(Exceeds Limit!)'}
            </span>
          </div>

          <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 10px' }}>
            Ensure your statement includes all 5 elements: <strong>User Persona</strong>, <strong>Measurable Problem</strong>, <strong>Root Cause Evidence</strong>, <strong>Business Consequence</strong>, and <strong>Quantifiable Success Metric</strong>.
          </p>

          <textarea
            rows={5}
            value={state.problemStatement}
            onChange={(e) => saveState({ ...state, problemStatement: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${isProblemStatementValid ? '#d1d5db' : '#ef4444'}`,
              fontSize: '0.85rem',
              fontFamily: 'inherit',
              lineHeight: 1.5,
            }}
          />
        </div>
      </div>

      {/* 4. Assumptions & Scope Exclusions Log */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
            <ShieldAlert size={18} /> Project Assumptions & Explicit Boundary Exclusions
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {state.assumptions.map((a, idx) => (
              <div key={idx} style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', fontSize: '0.85rem', color: '#17245C', border: '1px solid #e2e8f0' }}>
                {a}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Evidence Handover & Checklist */}
      <div className="vcep-workstation-section">
        <EvidenceHandoverCard
          sessionId={17}
          sessionTitle="Industry Challenge Discovery"
          deliverableName="Capstone Discovery Brief & Business Problem Statement"
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
