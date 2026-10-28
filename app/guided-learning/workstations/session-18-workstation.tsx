'use client';

import React, { useState, useEffect } from 'react';
import { EvidenceHandoverCard } from './components/evidence-handover-card';
import { Layers, Calendar, CheckSquare, Clock, Users, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'vcep:s18:drive-v3:student-workstation';

export type SolutionOption = {
  id: string;
  name: string;
  type: string;
  utility: string;
  auditability: string;
  feasibility: string;
  verdict: string;
};

export type WbsTask = {
  id: string;
  task: string;
  owner: string;
  role: string;
  raci: 'R' | 'A' | 'C' | 'I';
  days: string;
  hours: number;
  dependency: string;
};

export type AcceptanceCriterion = {
  id: string;
  criterion: string;
  testMethod: string;
  expectedResult: string;
  passed: boolean;
};

export type Session18State = {
  selectedSolution: string;
  solutionRationale: string;
  tasks: WbsTask[];
  acceptanceCriteria: AcceptanceCriterion[];
  checkedIndices: number[];
  timestamp?: string;
};

const initialTasks: WbsTask[] = [
  {
    id: 'T1',
    task: 'Case F Control Total & Ingestion: Ingest 4 invoices, verify control total equals ₹1,00,000 exactly.',
    owner: 'Priya S.',
    role: 'Financial Modeler',
    raci: 'R',
    days: 'Day 1-2',
    hours: 1.0,
    dependency: 'Case F Frozen Baseline',
  },
  {
    id: 'T2',
    task: 'Aging Engine & Rule Formulation: Build Days Overdue logic with Max(0, 31-Oct - DueDate) and Current bucket.',
    owner: 'Arjun K.',
    role: 'Data Analyst',
    raci: 'R',
    days: 'Day 3-4',
    hours: 1.5,
    dependency: 'T1 Ingestion',
  },
  {
    id: 'T3',
    task: 'Dispute Quarantine & Suspense Account: Isolate Beacon Logistics ₹5,000 disputed sum from operational cash.',
    owner: 'Meera N.',
    role: 'Risk Auditor',
    raci: 'R',
    days: 'Day 5',
    hours: 1.0,
    dependency: 'T2 Aging',
  },
  {
    id: 'T4',
    task: '7-Day Liquidity Forecast Model: Connect ₹25k opening cash, ₹45k outflows, and target collections to solve deficit.',
    owner: 'Priya S.',
    role: 'Financial Modeler',
    raci: 'R',
    days: 'Day 6-7',
    hours: 1.5,
    dependency: 'T2, T3',
  },
  {
    id: 'T5',
    task: 'Quality Acceptance Testing & Executive Brief: Run binary verification of 5 criteria and draft sign-off memo.',
    owner: 'Rahul D.',
    role: 'Engagement Lead',
    raci: 'A',
    days: 'Day 8-10',
    hours: 1.0,
    dependency: 'T4 Liquidity Model',
  },
];

const initialCriteria: AcceptanceCriterion[] = [
  {
    id: 'AC1',
    criterion: 'Case F Control Total Reconciliation',
    testMethod: 'Formula test: SUM(F01:F04) === 1,00,000 INR exactly with ₹0 variance.',
    expectedResult: 'Control total equals ₹1,00,000; status PASS.',
    passed: true,
  },
  {
    id: 'AC2',
    criterion: 'Due-Today Classification Rule',
    testMethod: 'Boundary test: F01 due 2026-10-31 as-of 2026-10-31 must be 0 days overdue.',
    expectedResult: 'Categorized strictly as "Current", not Overdue; status PASS.',
    passed: true,
  },
  {
    id: 'AC3',
    criterion: 'Beacon Logistics Dispute Quarantine',
    testMethod: 'Audit test: Check if disputed ₹5,000 is isolated in suspense row.',
    expectedResult: 'Quarantined in suspense, excluded from available liquidity; status PASS.',
    passed: true,
  },
  {
    id: 'AC4',
    criterion: '7-Day Liquidity Feasibility',
    testMethod: 'Model test: ₹25,000 opening - ₹45,000 outflows + collections >= ₹0.',
    expectedResult: 'Closing cash demonstrates positive balance without debt; status PASS.',
    passed: true,
  },
  {
    id: 'AC5',
    criterion: 'Resource Governance Cap',
    testMethod: 'Resource test: Check that individual student effort <= 6.0 hours over 10 days.',
    expectedResult: 'All members <= 6.0 hours (Max individual = 2.5 hrs, Total squad = 6.0 hrs); status PASS.',
    passed: true,
  },
];

export function Session18Workstation() {
  const [state, setState] = useState<Session18State>({
    selectedSolution: 'option-a',
    solutionRationale:
      'Option A (Dynamic Spreadsheet Workstation) is selected because it enables real-time liquidity scenario simulation and live formula auditing by executive leadership. Option B (Static Slide Presentation) provides only static images, preventing the Managing Director from testing collection timing sensitivity during Friday payroll decisions.',
    tasks: initialTasks,
    acceptanceCriteria: initialCriteria,
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

  const saveState = (updated: Session18State) => {
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
      selectedSolution: 'option-a',
      solutionRationale:
        'Option A (Dynamic Spreadsheet Workstation) is selected because it enables real-time liquidity scenario simulation and live formula auditing by executive leadership.',
      tasks: initialTasks,
      acceptanceCriteria: initialCriteria,
      checkedIndices: [],
    });
    setDraftTimestamp('');
  };

  const handleUpdateTaskHours = (id: string, hours: number) => {
    const updatedTasks = state.tasks.map((t) => (t.id === id ? { ...t, hours: Math.max(0, hours) } : t));
    saveState({ ...state, tasks: updatedTasks });
  };

  // Group hours by owner
  const hoursByOwner = state.tasks.reduce((acc, t) => {
    acc[t.owner] = (acc[t.owner] || 0) + t.hours;
    return acc;
  }, {} as Record<string, number>);

  const totalSquadHours = state.tasks.reduce((sum, t) => sum + t.hours, 0);
  const anyOwnerExceedsCap = Object.values(hoursByOwner).some((h) => h > 6.0);

  const rubric = [
    { name: 'Execution', points: 4, evidence: 'Evaluated 2 architecture options, constructed 10-day WBS with RACI, and verified 5 binary acceptance criteria.' },
    { name: 'Reasoning', points: 2, evidence: 'Justifies spreadsheet selection over static slides based on user utility and auditability.' },
    { name: 'Communication', points: 2, evidence: 'WBS clearly distinguishes Responsible, Accountable, Consulted, and Informed role designations.' },
    { name: 'Professional Process', points: 2, evidence: 'Strictly governs student effort within the 6-hour individual cap and establishes testable pass/fail gates.' },
  ];

  const checklist = [
    'I evaluated Option A (Dynamic Spreadsheet) vs Option B (Static Slide Presentation).',
    'I documented comparative justification on User Utility, Auditability, and Delivery Feasibility.',
    'I built a 10-day Work Breakdown Structure with sequential task dependencies.',
    'I assigned RACI role designations for each task in the project charter.',
    'I verified that no individual squad member exceeds the 6-hour effort cap.',
    'I established 5 testable binary acceptance criteria with explicit pass/fail verification methods.',
  ];

  return (
    <div className="vcep-workstation-root">
      {/* 1. Header & Principles */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 04 · PROJECT CHARTER & ARCHITECTURE STUDIO</span>
          <h3>Solution Design, Work Breakdown Structure (WBS) & Acceptance Gates</h3>
          <p>
            Capstone Planning for Vayentra Labs: Compare delivery architectures, decompose project scope into a 10-day WBS with RACI designations, govern individual workload under the 6-hour cap, and define 5 binary acceptance gates.
          </p>
        </div>

        <div className="vcep-data-principles-banner">
          <div className="principle-item">
            <span className="principle-num">1</span>
            <strong>Dynamic vs Static Architecture:</strong> A commercial model must allow live scenario testing; static presentations force clients to do mental math during cash crunches.
          </div>
          <div className="principle-item">
            <span className="principle-num">2</span>
            <strong>Scope & Effort Governance:</strong> Real projects fail through scope creep. Strict effort estimation (≤ 6 individual hours) ensures quality without student burnout.
          </div>
          <div className="principle-item">
            <span className="principle-num">3</span>
            <strong>Binary Acceptance Criteria:</strong> A criterion is only valid if a third-party reviewer can evaluate it with a clear, objective PASS or FAIL test.
          </div>
        </div>
      </div>

      {/* 2. Solution Architecture Comparison Matrix */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
            <Layers size={18} /> Architectural Option Evaluation: Spreadsheet Model vs Slide Deck
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            {/* Option A */}
            <div
              onClick={() => saveState({ ...state, selectedSolution: 'option-a' })}
              style={{
                border: state.selectedSolution === 'option-a' ? '2px solid #0F766E' : '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '14px',
                background: state.selectedSolution === 'option-a' ? '#f0fdfa' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, color: '#0F766E', fontSize: '0.9rem' }}>OPTION A: Dynamic Spreadsheet</span>
                {state.selectedSolution === 'option-a' && (
                  <span style={{ fontSize: '0.75rem', background: '#0F766E', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                    SELECTED (RECOMMENDED)
                  </span>
                )}
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8rem', color: '#374151', lineHeight: 1.5 }}>
                <li><strong>Utility:</strong> Interactive receivables aging and 7-day cash simulator with live formula recalculations.</li>
                <li><strong>Auditability:</strong> Complete formula transparency (`=SUM()`, `=MAX()`, dedicated suspense row).</li>
                <li><strong>Delivery Feasibility:</strong> 6 hours total squad effort; direct integration with Case F ledger.</li>
              </ul>
            </div>

            {/* Option B */}
            <div
              onClick={() => saveState({ ...state, selectedSolution: 'option-b' })}
              style={{
                border: state.selectedSolution === 'option-b' ? '2px solid #b91c1c' : '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '14px',
                background: state.selectedSolution === 'option-b' ? '#fef2f2' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, color: '#b91c1c', fontSize: '0.9rem' }}>OPTION B: Static Slide Briefing</span>
                {state.selectedSolution === 'option-b' && (
                  <span style={{ fontSize: '0.75rem', background: '#b91c1c', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                    REJECTED
                  </span>
                )}
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8rem', color: '#374151', lineHeight: 1.5 }}>
                <li><strong>Utility:</strong> Static charts; cannot simulate debtor payment delay scenarios or test liquidity gaps.</li>
                <li><strong>Auditability:</strong> Zero cell formula transparency; reviewer cannot verify calculation logic.</li>
                <li><strong>Delivery Feasibility:</strong> High design overhead with minimal operational utility for the Managing Director.</li>
              </ul>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#17245C', marginBottom: '4px' }}>
              Solution Architecture Justification & Trade-off Analysis:
            </label>
            <textarea
              rows={3}
              value={state.solutionRationale}
              onChange={(e) => saveState({ ...state, solutionRationale: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '0.85rem',
                fontFamily: 'inherit',
                lineHeight: 1.4,
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. 10-Day Work Breakdown Structure (WBS) & RACI */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: 0 }}>
              <Calendar size={18} /> 10-Day Work Breakdown Structure (WBS) & RACI Matrix
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#17245C' }}>
                Squad Total: <strong>{totalSquadHours.toFixed(1)} hrs</strong>
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  background: anyOwnerExceedsCap ? '#fee2e2' : '#ecfdf5',
                  color: anyOwnerExceedsCap ? '#b91c1c' : '#15803d',
                }}
              >
                {anyOwnerExceedsCap ? '⚠️ Individual Cap Exceeded (> 6.0 hrs)' : '✓ Effort Within 6.0h Cap'}
              </span>
            </div>
          </div>

          <div style={{ overflowX: 'auto', marginBottom: '12px' }}>
            <table className="vcep-comparison-table" style={{ width: '100%', fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th style={{ width: '45px' }}>ID</th>
                  <th>Work Package & Deliverable</th>
                  <th style={{ width: '120px' }}>Owner</th>
                  <th style={{ width: '60px' }}>RACI</th>
                  <th style={{ width: '80px' }}>Schedule</th>
                  <th style={{ width: '70px' }}>Hours</th>
                  <th style={{ width: '130px' }}>Dependency</th>
                </tr>
              </thead>
              <tbody>
                {state.tasks.map((task) => (
                  <tr key={task.id}>
                    <td style={{ fontWeight: 700, color: '#0F766E' }}>{task.id}</td>
                    <td style={{ color: '#17245C', fontWeight: 500 }}>{task.task}</td>
                    <td>
                      <div><strong>{task.owner}</strong></div>
                      <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>{task.role}</span>
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          width: '24px',
                          height: '24px',
                          lineHeight: '24px',
                          textAlign: 'center',
                          borderRadius: '50%',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          background: task.raci === 'A' ? '#fef3c7' : '#ecfdf5',
                          color: task.raci === 'A' ? '#b45309' : '#047857',
                        }}
                      >
                        {task.raci}
                      </span>
                    </td>
                    <td style={{ whiteSpace: 'nowrap', color: '#4b5563' }}>{task.days}</td>
                    <td>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="10"
                        value={task.hours}
                        onChange={(e) => handleUpdateTaskHours(task.id, parseFloat(e.target.value) || 0)}
                        style={{ width: '55px', padding: '2px 4px', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
                      />
                    </td>
                    <td style={{ fontSize: '0.75rem', color: '#6b7280' }}>{task.dependency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Member Workload Breakdown */}
          <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#17245C' }}>Individual Workload Allocation:</span>
            {Object.entries(hoursByOwner).map(([owner, hours]) => (
              <span key={owner} style={{ fontSize: '0.8rem', color: hours > 6.0 ? '#b91c1c' : '#374151' }}>
                {owner}: <strong>{hours.toFixed(1)} hrs</strong> {hours > 6.0 ? '(Cap Exceeded!)' : '(OK)'}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Five Testable Binary Acceptance Criteria */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
            <ShieldCheck size={18} /> The Five Binary (Pass/Fail) Acceptance Gates
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {state.acceptanceCriteria.map((ac) => (
              <div
                key={ac.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  background: ac.passed ? '#f0fdf4' : '#fff1f2',
                  border: `1px solid ${ac.passed ? '#bbf7d0' : '#fecdd3'}`,
                  borderRadius: '6px',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: '1 1 300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0F766E' }}>{ac.id}</span>
                    <strong style={{ fontSize: '0.85rem', color: '#17245C' }}>{ac.criterion}</strong>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#4b5563', marginBottom: '2px' }}>
                    <strong>Verification Test:</strong> {ac.testMethod}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#15803d' }}>
                    <strong>Expected Benchmark:</strong> {ac.expectedResult}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '4px',
                      background: ac.passed ? '#15803d' : '#b91c1c',
                      color: '#ffffff',
                    }}
                  >
                    {ac.passed ? 'GATE PASSED' : 'GATE FAILED'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Evidence Handover & Checklist */}
      <div className="vcep-workstation-section">
        <EvidenceHandoverCard
          sessionId={18}
          sessionTitle="Solution Design and Project Planning"
          deliverableName="Solution Architecture & 10-Day Project Charter"
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
