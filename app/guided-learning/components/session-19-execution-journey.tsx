'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  FileCheck,
  FileSpreadsheet,
  AlertOctagon,
  RotateCcw,
  Clock,
  Users,
  XCircle,
  Database,
  ArrowRight,
  Eye,
  CheckSquare,
  Target,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import {
  CASE_F_RAW_RECORDS,
  CASE_F_BASELINE_SUMMARY,
  calculateDaysOverdue,
  classifyAgeingBucket,
  INITIAL_QA_CHECKS,
  INITIAL_ACCEPTANCE_TESTS,
  DEFAULT_SESSION_19_STATE,
  S19_RUBRIC,
  getStoredSession19State,
  setStoredSession19State,
  type Session19State,
  type RawInvoiceRecord,
  type AcceptanceTestRecord,
  type QaAuditCheck,
  type AgeingBucket,
} from './session-19-execution-data.ts';
import { evaluateSession19 } from '../../../lib/review-engine/session-rules/session-19.ts';

interface TaskCardProps {
  taskId: string;
  taskNumber: string;
  title: string;
  instruction: string;
  learningTakeaway?: string;
  whyMatters?: string;
  statusText?: string;
  outputBadge?: string;
  isActive?: boolean;
  onSelectTask?: () => void;
  children: React.ReactNode;
}

/**
 * Unified Premium TaskCard Component
 * Implements the VCEP single-task bordered card pattern.
 * Neutral 1px #DCE5E9 border, 16px radius, 3px teal left accent on active task.
 */
function TaskCard({
  taskId,
  taskNumber,
  title,
  instruction,
  learningTakeaway,
  whyMatters,
  statusText,
  outputBadge,
  isActive,
  onSelectTask,
  children,
}: TaskCardProps) {
  const [whyOpen, setWhyOpen] = useState(false);

  return (
    <article
      id={taskId.toLowerCase()}
      data-task-id={taskId}
      onClick={onSelectTask}
      tabIndex={0}
      aria-label={`${taskNumber}: ${title}`}
      style={{
        display: isActive ? 'block' : 'none',
        background: '#ffffff',
        border: '1px solid #DCE5E9',
        borderLeft: isActive ? '3px solid #0F766E' : '1px solid #DCE5E9',
        borderRadius: '16px',
        padding: 'clamp(18px, 2.5vw, 24px)',
        marginBottom: '20px',
        boxShadow: isActive ? '0 4px 16px rgba(15, 118, 110, 0.08)' : '0 2px 8px rgba(0, 0, 0, 0.03)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        outline: 'none',
      }}
    >
      {/* 1-Line Teaching Takeaway Banner */}
      {learningTakeaway && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f0fdfa',
            border: '1px solid #ccfbf1',
            borderRadius: '8px',
            padding: '8px 12px',
            marginBottom: '16px',
            fontSize: '12px',
            color: '#0f766e',
            fontWeight: 600,
          }}
        >
          <Sparkles size={15} color="#0f766e" style={{ flexShrink: 0 }} />
          <span>💡 <strong>What you&apos;ll learn:</strong> {learningTakeaway}</span>
        </div>
      )}

      {/* Task Card Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '10px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#0F766E',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {taskNumber}
            </span>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>·</span>
            <span
              style={{
                fontSize: '11px',
                color: '#64748B',
                fontFamily: 'monospace',
                background: '#F1F5F9',
                padding: '1px 6px',
                borderRadius: '4px',
              }}
            >
              Ref: {taskId}
            </span>
          </div>
          <h3
            style={{
              margin: 0,
              fontSize: 'clamp(16px, 1.5vw, 18px)',
              fontWeight: 700,
              color: '#17245C',
              lineHeight: 1.3,
            }}
          >
            {title}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {outputBadge && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: '#F8FAFC',
                color: '#334155',
                border: '1px solid #E2E8F0',
                borderRadius: '20px',
                padding: '3px 10px',
                fontSize: '11.5px',
                fontWeight: 600,
              }}
            >
              <Target size={12} color="#0F766E" />
              <span>{outputBadge}</span>
            </span>
          )}
          {statusText && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: '#F0FDFA',
                color: '#0F766E',
                border: '1px solid #99F6E4',
                borderRadius: '20px',
                padding: '3px 10px',
                fontSize: '11.5px',
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={13} />
              <span>{statusText}</span>
            </div>
          )}
        </div>
      </div>

      {/* Task Instruction (1-2 sentences) */}
      <p style={{ fontSize: '13.5px', color: '#64748B', margin: '0 0 14px', lineHeight: 1.55 }}>
        {instruction}
      </p>

      {/* Accessible Collapsible Why This Matters */}
      {whyMatters && (
        <div style={{ marginBottom: '18px' }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setWhyOpen(!whyOpen);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              fontSize: '11.5px',
              fontWeight: 600,
              color: '#0F766E',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <HelpCircle size={13} />
            <span>{whyOpen ? 'Hide operational rationale' : 'Why this matters'}</span>
            {whyOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {whyOpen && (
            <div
              style={{
                marginTop: '10px',
                padding: '12px 14px',
                background: '#f8fafc',
                borderRadius: '8px',
                borderLeft: '3px solid #0F766E',
                fontSize: '12.5px',
                color: '#334155',
                lineHeight: 1.6,
              }}
            >
              {whyMatters}
            </div>
          )}
        </div>
      )}

      <div>{children}</div>
    </article>
  );
}

interface Session19ExecutionJourneyProps {
  onUpdateDraft?: (field: string, value: string) => void;
}

export function Session19ExecutionJourney({ onUpdateDraft }: Session19ExecutionJourneyProps) {
  const [state, setState] = useState<Session19State>(getStoredSession19State);
  const [draftTimestamp, setDraftTimestamp] = useState<string>('');
  const [activeTaskId, setActiveTaskId] = useState<string>('S19-T01');

  const WIZARD_STEPS = [
    { id: 'S19-T01' as const, num: 1, label: 'Task 01 — Build Version 1', short: '1. Build v1' },
    { id: 'S19-T02' as const, num: 2, label: 'Task 02 — Run Acceptance Tests', short: '2. Tests' },
    { id: 'S19-T03' as const, num: 3, label: 'Task 03 — Fix and Retest', short: '3. Fix & Retest' },
    { id: 'S19-T04' as const, num: 4, label: 'Task 04 — Prepare the Handover', short: '4. Handover' },
  ];

  const currentStepIdx = useMemo(() => {
    return Math.max(0, WIZARD_STEPS.findIndex((s) => s.id === activeTaskId));
  }, [activeTaskId]);

  useEffect(() => {
    const loaded = getStoredSession19State();
    setState(loaded);
    if (loaded.timestamp) setDraftTimestamp(loaded.timestamp);
  }, []);

  const saveState = (updated: Session19State) => {
    const timestamp = new Date().toLocaleTimeString();
    const withTimestamp = { ...updated, timestamp };
    setState(withTimestamp);
    setDraftTimestamp(timestamp);
    setStoredSession19State(withTimestamp);

    if (onUpdateDraft) {
      onUpdateDraft('work-prompt:0', updated.studentContribution);
      onUpdateDraft('work-prompt:1', updated.reviewerCorrection);
      onUpdateDraft('handover:summary', updated.handoverSummary);
    }
  };

  const handleSetAsOfDate = (newDate: string) => {
    saveState({ ...state, asOfDate: newDate });
  };

  const handleToggleDuplicateSimulation = () => {
    saveState({ ...state, simulatedDuplicate: !state.simulatedDuplicate });
  };

  const handleToggleBlankSimulation = () => {
    saveState({ ...state, simulatedBlank: !state.simulatedBlank });
  };

  const handleToggleCriterion = (testId: string) => {
    const updated = state.acceptanceTests.map((t) =>
      t.id === testId ? { ...t, verdict: (t.verdict === 'PASS' ? 'FAIL' : 'PASS') as 'PASS' | 'FAIL' } : t
    );
    saveState({ ...state, acceptanceTests: updated });
  };

  const handleToggleChecklist = (index: number) => {
    const next = state.checkedIndices.includes(index)
      ? state.checkedIndices.filter((i) => i !== index)
      : [...state.checkedIndices, index];
    saveState({ ...state, checkedIndices: next });
  };

  const handleReset = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('vcep:s19:drive-v3:student-workstation');
      } catch {}
    }
    setState(DEFAULT_SESSION_19_STATE);
    setDraftTimestamp('');
  };

  // Dynamic Invoices Calculation based on active As-Of Date
  const computedInvoices = useMemo(() => {
    return CASE_F_RAW_RECORDS.map((inv) => {
      const daysOverdue = calculateDaysOverdue(inv.dueDate, state.asOfDate);
      const bucket = classifyAgeingBucket(daysOverdue);
      return {
        ...inv,
        daysOverdue,
        bucket,
      };
    });
  }, [state.asOfDate]);

  // Bucket totals calculation
  const bucketTotals = useMemo(() => {
    let current = 0;
    let b1to30 = 0;
    let b31to60 = 0;
    let b61to90 = 0;

    computedInvoices.forEach((inv) => {
      if (inv.bucket === 'Current') current += inv.outstandingInr;
      else if (inv.bucket === '1-30 Days') b1to30 += inv.outstandingInr;
      else if (inv.bucket === '31-60 Days') b31to60 += inv.outstandingInr;
      else b61to90 += inv.outstandingInr;
    });

    const grandTotal = current + b1to30 + b31to60 + b61to90;
    const variance = grandTotal - CASE_F_BASELINE_SUMMARY.totalControlAmount;

    return { current, b1to30, b31to60, b61to90, grandTotal, variance };
  }, [computedInvoices]);

  // Review Engine Report
  const reviewReport = useMemo(() => {
    return evaluateSession19({
      sessionId: 19,
      lesson: { id: 19, title: 'Project Execution and Quality Assurance' },
      draft: {
        'concept:explain': state.studentContribution,
        'work-prompt:0': state.studentContribution,
        'work-prompt:1': state.reviewerCorrection,
        'handover:summary': state.handoverSummary,
      },
      workstationData: state,
    });
  }, [state]);

  const checklistItems = [
    'I ingested Case F version 1 (4 invoices totaling ₹1,00,000) preserving raw source tables.',
    'I tested dynamic date sensitivity: F01 due 31 Oct is Current, and shifts to 1–30d on 1 Nov with ₹0 total variance.',
    'I audited data types, dynamic formula ranges, and verified zero circular dependencies.',
    'I verified that disputed ₹5,000 remains quarantined in suspense and excluded from liquid cash.',
    'I tested edge-case exception triggers for duplicate records and blank amount fields.',
    'I recorded my individual contribution and documented an authentic before/after peer correction.',
  ];

  return (
    <div className="vcep-workstation-root" style={{ color: '#17245C' }}>
      {/* Sticky Horizontal Stepper */}
      <nav
        aria-label="Session Tasks Stepper"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 25,
          background: '#ffffff',
          borderRadius: '12px',
          padding: '8px 12px',
          marginBottom: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflowX: 'auto',
          gap: '6px',
        }}
      >
        {WIZARD_STEPS.map((step) => {
          const isActive = activeTaskId === step.id;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveTaskId(step.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#0f766e' : '#475569',
                background: isActive ? '#f0fdfa' : 'transparent',
                border: isActive ? '1px solid #99f6e4' : '1px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: isActive ? '#0f766e' : '#e2e8f0',
                  color: isActive ? '#ffffff' : '#475569',
                  fontSize: '10px',
                  fontWeight: 700,
                }}
              >
                {step.num}
              </span>
              <span>{step.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ============================================================== */}
      {/* NATURAL HEADING 1: BUILD THE APPROVED SOLUTION                 */}
      {/* ============================================================== */}
      <section id="vcep-area-build" className="vcep-workstation-section" style={{ marginBottom: '32px' }}>
        <div className="vcep-section-title-wrap" style={{ marginBottom: '16px' }}>
          <span className="vcep-eyebrow" style={{ color: '#0F766E', fontWeight: 700, letterSpacing: '0.05em' }}>
            HEADING 1 · PROTOTYPE ENGINEERING & DYNAMIC PARAMETERS
          </span>
          <h2 style={{ fontSize: '1.6rem', color: '#17245C', margin: '4px 0 8px', fontWeight: 800 }}>
            1. Build the Approved Solution
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5, margin: 0, maxWidth: '900px' }}>
            Build the Prototype. Prove It Works. Ingest Case F version 1 into a working receivables model,
            keep raw source records separate and immutable, parameterize the calculation date to refresh ageing buckets dynamically,
            and ensure duplicate records and blank amounts trigger visible exception stops.
          </p>
        </div>

        {/* Capstone Context Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #17245C 0%, #1e3a8a 100%)',
            color: '#ffffff',
            padding: '16px 20px',
            borderRadius: '12px',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(23, 36, 92, 0.12)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#E5AF2E', fontWeight: 700, letterSpacing: '0.05em' }}>
                Capstone Prototype v1.0 · Case F Version 1 Frozen Baseline
              </span>
              <h3 style={{ margin: '4px 0 6px', fontSize: '1.15rem', color: '#ffffff', fontWeight: 700 }}>
                Vayentra Labs Receivables Ageing & Exception Engine
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.4, maxWidth: '800px' }}>
                Four invoices totaling <strong>₹1,00,000</strong> must appear once. Modifying the As-Of Date parameter
                must recalibrate all age buckets while strictly preserving the ₹1,00,000 control total with <strong>₹0 variance</strong>.
                No premature Session 20 credit note or supplier deferral applied.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#cbd5e1', textTransform: 'uppercase' }}>Active Parameter</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#E5AF2E' }}>{state.asOfDate}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#cbd5e1', textTransform: 'uppercase' }}>Control Total</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8' }}>₹1,00,000</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#cbd5e1', textTransform: 'uppercase' }}>Beacon Suspense</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f87171' }}>₹5,000 Isolated</div>
              </div>
            </div>
          </div>
        </div>

        {/* TASK 01: BUILD VERSION 1 */}
        <TaskCard
          taskId="S19-T01"
          taskNumber="TASK 01"
          title="Build Version 1"
          instruction="Ingest Case F receivables records into an immutable table and parameterize the calculation As-Of Date."
          learningTakeaway="Keep source data immutable and use parameterized cells to drive dynamic calculation models."
          whyMatters="Source data immutability ensures financial models can be audited back to verifiable raw records. Parameterizing calculation dates via dynamic formulas (=MAX(0, AsOfDate - DueDate)) allows scenario forecasting without hardcoded date errors. Exception traps protect management from making liquidity decisions on duplicated or corrupted inputs."
          outputBadge="Working Dynamic Ageing Engine + Exception Simulator"
          statusText="Baseline Reconciled · Dynamic Engine Active"
          isActive={activeTaskId === 'S19-T01'}
          onSelectTask={() => setActiveTaskId('S19-T01')}
        >
          {/* Sub-section: Immutable Raw Source Records Table */}
          <div style={{ marginBottom: '24px', background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', fontSize: '1rem', fontWeight: 700 }}>
                <Database size={18} color="#0F766E" /> Raw Source Records (Table_CaseF_Receivables · Immutable)
              </h4>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: '#f1f5f9',
                  color: '#475569',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  border: '1px solid #cbd5e1',
                }}
              >
                🔒 READ-ONLY BASELINE (DO NOT MODIFY RAW DATA)
              </span>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 12px' }}>
              Accounting standard: Source records must remain untouched in a dedicated intake sheet. All calculations must flow unidirectionally from raw records into the dynamic ageing schedule.
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table className="vcep-comparison-table" style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse', background: '#ffffff', borderRadius: '6px' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left', width: '60px' }}>ID</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>Customer Debtor</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', width: '110px' }}>Due Date</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', width: '130px' }}>Outstanding INR</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left', width: '140px' }}>Contact Role</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>Audit Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {CASE_F_RAW_RECORDS.map((inv) => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0F766E' }}>{inv.id}</td>
                      <td style={{ padding: '8px 10px', fontWeight: 600, color: '#17245C' }}>{inv.customer}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', color: '#475569', fontFamily: 'monospace' }}>
                        {inv.dueDate}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#1e293b' }}>
                        ₹{inv.outstandingInr.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '8px 10px', fontSize: '0.75rem', color: '#64748b' }}>{inv.contactRole}</td>
                      <td style={{ padding: '8px 10px', fontSize: '0.75rem', color: '#475569' }}>{inv.notes}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: '#f1f5f9', fontWeight: 700, borderTop: '2px solid #cbd5e1' }}>
                    <td colSpan={3} style={{ padding: '8px 10px', textAlign: 'right', color: '#17245C' }}>
                      Raw Control Total:
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', color: '#0F766E', fontSize: '0.9rem' }}>
                      ₹{CASE_F_BASELINE_SUMMARY.totalControlAmount.toLocaleString('en-IN')}
                    </td>
                    <td colSpan={2} style={{ padding: '8px 10px', fontSize: '0.75rem', color: '#64748b' }}>
                      4 Unique Invoice Records Reconciled
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Sub-section: Dynamic As-Of Date Sensitivity & Aging Engine */}
          <div style={{ marginBottom: '24px', background: '#ffffff', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', fontSize: '1rem', fontWeight: 700 }}>
                  <Calendar size={18} color="#0F766E" /> Dynamic Ageing Model & Boundary Sensitivity Simulator
                </h4>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                  Formula Engine: <code>=MAX(0, AsOfDate - DueDate)</code>. Advance the date to prove boundary bucket shifting.
                </p>
              </div>

              {/* As-Of Date Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#17245C' }}>As-Of Date ($B$1):</span>
                <button
                  type="button"
                  onClick={() => handleSetAsOfDate('2026-10-31')}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: state.asOfDate === '2026-10-31' ? '#0F766E' : '#ffffff',
                    color: state.asOfDate === '2026-10-31' ? '#ffffff' : '#334155',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  31 Oct 2026 (Baseline)
                </button>
                <button
                  type="button"
                  onClick={() => handleSetAsOfDate('2026-11-01')}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: state.asOfDate === '2026-11-01' ? '#17245C' : '#ffffff',
                    color: state.asOfDate === '2026-11-01' ? '#ffffff' : '#334155',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  01 Nov 2026 (+1 Day Shift)
                </button>
              </div>
            </div>

            {/* Bucket Summary KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#15803d', fontWeight: 700 }}>
                  Current (0 Days Overdue)
                </span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#15803d', margin: '4px 0' }}>
                  ₹{bucketTotals.current.toLocaleString('en-IN')}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#166534' }}>
                  {state.asOfDate === '2026-10-31' ? 'F01 Asha (Due Today)' : '0 Invoices (F01 shifted)'}
                </span>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#17245C', fontWeight: 700 }}>
                  1–30 Days Overdue
                </span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#17245C', margin: '4px 0' }}>
                  ₹{bucketTotals.b1to30.toLocaleString('en-IN')}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#475569' }}>
                  {state.asOfDate === '2026-10-31' ? 'F02 Beacon (₹20,000)' : 'F01 (₹10k) + F02 (₹20k)'}
                </span>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#17245C', fontWeight: 700 }}>
                  31–60 Days Overdue
                </span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#17245C', margin: '4px 0' }}>
                  ₹{bucketTotals.b31to60.toLocaleString('en-IN')}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#475569' }}>F03 Cedar (₹30,000)</span>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#17245C', fontWeight: 700 }}>
                  61–90 Days Overdue
                </span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#17245C', margin: '4px 0' }}>
                  ₹{bucketTotals.b61to90.toLocaleString('en-IN')}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#475569' }}>F04 Delta (₹40,000)</span>
              </div>
            </div>

            {/* Dynamic Ageing Schedule Table */}
            <div style={{ overflowX: 'auto', marginBottom: '14px' }}>
              <table className="vcep-comparison-table" style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left', width: '50px' }}>ID</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>Debtor Client</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', width: '100px' }}>Due Date</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', width: '110px' }}>Days Overdue</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left', width: '130px' }}>Ageing Bucket</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', width: '110px' }}>Gross INR</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', width: '110px' }}>Suspense INR</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', width: '110px' }}>Net Collectible</th>
                  </tr>
                </thead>
                <tbody>
                  {computedInvoices.map((inv) => {
                    const isBeacon = inv.id === 'F02';
                    const suspense = isBeacon ? CASE_F_BASELINE_SUMMARY.disputedAmount : 0;
                    const netCollectible = inv.outstandingInr - suspense;

                    return (
                      <tr
                        key={inv.id}
                        style={{
                          borderBottom: '1px solid #e2e8f0',
                          background: inv.id === 'F01' && state.asOfDate === '2026-11-01' ? '#fefce8' : '#ffffff',
                        }}
                      >
                        <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0F766E' }}>{inv.id}</td>
                        <td style={{ padding: '8px 10px', fontWeight: 600, color: '#17245C' }}>
                          {inv.customer}
                          {inv.id === 'F01' && state.asOfDate === '2026-11-01' && (
                            <span style={{ fontSize: '0.7rem', color: '#b45309', marginLeft: '6px', fontWeight: 700 }}>
                              (RECLASSIFIED ON +1 DAY SHIFT)
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'center', fontFamily: 'monospace', color: '#475569' }}>
                          {inv.dueDate}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: inv.daysOverdue === 0 ? '#15803d' : '#b91c1c' }}>
                          {inv.daysOverdue} days
                        </td>
                        <td style={{ padding: '8px 10px' }}>
                          <span
                            style={{
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: inv.bucket === 'Current' ? '#dcfce7' : '#fee2e2',
                              color: inv.bucket === 'Current' ? '#15803d' : '#991b1b',
                            }}
                          >
                            {inv.bucket}
                          </span>
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: '#1e293b' }}>
                          ₹{inv.outstandingInr.toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: suspense > 0 ? '#dc2626' : '#94a3b8' }}>
                          {suspense > 0 ? `₹${suspense.toLocaleString('en-IN')}` : '₹0'}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#0F766E' }}>
                          ₹{netCollectible.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background: '#ecfdf5', fontWeight: 700, borderTop: '2px solid #a7f3d0' }}>
                    <td colSpan={5} style={{ padding: '8px 10px', textAlign: 'right', color: '#065f46' }}>
                      Reconciled Model Totals:
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', color: '#065f46', fontSize: '0.9rem' }}>
                      ₹{bucketTotals.grandTotal.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', color: '#dc2626', fontSize: '0.9rem' }}>
                      ₹{CASE_F_BASELINE_SUMMARY.disputedAmount.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', color: '#0F766E', fontSize: '0.9rem' }}>
                      ₹{CASE_F_BASELINE_SUMMARY.undisputedAmount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Control Total Reconciliation Banner */}
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '6px',
                background: bucketTotals.variance === 0 ? '#ecfdf5' : '#fff1f2',
                border: `1px solid ${bucketTotals.variance === 0 ? '#a7f3d0' : '#fecdd3'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#065f46' }}>
                <CheckCircle2 size={18} color="#059669" />
                <span>
                  <strong>Control Total Invariance Proven:</strong> Across all date shifts, the sum across all ageing buckets equals{' '}
                  <strong>₹{bucketTotals.grandTotal.toLocaleString('en-IN')}</strong> (Reconciled with <strong>₹{bucketTotals.variance} variance</strong> against Case F control total).
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: '#ffffff', padding: '2px 8px', borderRadius: '4px' }}>
                ZERO VARIANCE VERIFIED ✓
              </span>
            </div>
          </div>

          {/* Sub-section: Interactive Exception & Error Injection Simulator */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ marginBottom: '14px' }}>
              <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', fontSize: '1rem', fontWeight: 700 }}>
                <AlertOctagon size={18} color="#0F766E" /> Edge-Case Exception Injection Simulator
              </h4>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                Test model robustness: verify that corrupted source records trigger visible exception alerts instead of silently poisoning sums.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {/* Toggle 1: Duplicate Invoice ID */}
              <div
                style={{
                  background: state.simulatedDuplicate ? '#fff1f2' : '#ffffff',
                  border: `1.5px solid ${state.simulatedDuplicate ? '#f87171' : '#cbd5e1'}`,
                  borderRadius: '8px',
                  padding: '14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#17245C' }}>Test Case 4: Duplicate Invoice ID</strong>
                  <button
                    type="button"
                    onClick={handleToggleDuplicateSimulation}
                    style={{
                      padding: '3px 10px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: state.simulatedDuplicate ? '#b91c1c' : '#ffffff',
                      color: state.simulatedDuplicate ? '#ffffff' : '#475569',
                      border: '1px solid #cbd5e1',
                    }}
                  >
                    {state.simulatedDuplicate ? 'CLEAR INJECTION' : 'INJECT DUPLICATE F02'}
                  </button>
                </div>
                <p style={{ margin: '0 0 8px', fontSize: '0.78rem', color: '#475569', lineHeight: 1.35 }}>
                  Simulate injecting duplicate invoice ID <code>F02</code> into the intake register.
                </p>
                {state.simulatedDuplicate ? (
                  <div style={{ background: '#fee2e2', padding: '8px 10px', borderRadius: '5px', fontSize: '0.75rem', color: '#991b1b', fontWeight: 600 }}>
                    ⚠️ STOP CONDITION TRIGGERED: Duplicate invoice ID 'F02' detected in row 5! Validation halted. Control total protected from silent double-counting.
                  </div>
                ) : (
                  <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600 }}>
                    ✓ Ingestion rule <code>=COUNTIF($A$2:$A$5, A2) &gt; 1</code> active and ready.
                  </div>
                )}
              </div>

              {/* Toggle 2: Missing / Blank Amount */}
              <div
                style={{
                  background: state.simulatedBlank ? '#fffbeb' : '#ffffff',
                  border: `1.5px solid ${state.simulatedBlank ? '#fcd34d' : '#cbd5e1'}`,
                  borderRadius: '8px',
                  padding: '14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#17245C' }}>Test Case 5: Blank Amount Cell</strong>
                  <button
                    type="button"
                    onClick={handleToggleBlankSimulation}
                    style={{
                      padding: '3px 10px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: state.simulatedBlank ? '#b45309' : '#ffffff',
                      color: state.simulatedBlank ? '#ffffff' : '#475569',
                      border: '1px solid #cbd5e1',
                    }}
                  >
                    {state.simulatedBlank ? 'CLEAR INJECTION' : 'INJECT BLANK AMOUNT'}
                  </button>
                </div>
                <p style={{ margin: '0 0 8px', fontSize: '0.78rem', color: '#475569', lineHeight: 1.35 }}>
                  Simulate blank amount in invoice <code>F03</code> to verify that missing amounts trigger alerts.
                </p>
                {state.simulatedBlank ? (
                  <div style={{ background: '#fef3c7', padding: '8px 10px', borderRadius: '5px', fontSize: '0.75rem', color: '#92400e', fontWeight: 600 }}>
                    ⚠️ DATA AUDIT EXCEPTION: Blank amount cell detected in record F03! Calculation paused. Manual human verification required before ledger post.
                  </div>
                ) : (
                  <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600 }}>
                    ✓ Missing value guard <code>=IF(ISBLANK(D3), "ERROR", ...)</code> active.
                  </div>
                )}
              </div>
            </div>
          </div>
        </TaskCard>
      </section>

      {/* ============================================================== */}
      {/* NATURAL HEADING 2: TEST & RECORD EVIDENCE                      */}
      {/* ============================================================== */}
      <section id="vcep-area-test" className="vcep-workstation-section" style={{ marginBottom: '32px' }}>
        <div className="vcep-section-title-wrap" style={{ marginBottom: '16px' }}>
          <span className="vcep-eyebrow" style={{ color: '#0F766E', fontWeight: 700, letterSpacing: '0.05em' }}>
            HEADING 2 · VERIFICATION REGISTER, FORMULA AUDITS & PEER HANDOVER
          </span>
          <h2 style={{ fontSize: '1.6rem', color: '#17245C', margin: '4px 0 8px', fontWeight: 800 }}>
            2. Test & Record Evidence
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5, margin: 0, maxWidth: '900px' }}>
            Execute the five official acceptance tests with clear inputs, expected results, and demonstrated outputs,
            audit Excel formulas for circular references and dynamic ranges, document individual contributions and peer corrections,
            and finalize the reviewer-ready handover.
          </p>
        </div>

        {/* TASK 02: RUN ACCEPTANCE TESTS */}
        <TaskCard
          taskId="S19-T02"
          taskNumber="TASK 02"
          title="Run Acceptance Tests"
          instruction="Execute all five formal acceptance tests against the prototype and record demonstrated outcomes."
          learningTakeaway="Systematically execute test cases to catch formula discrepancies and edge-case exceptions early."
          whyMatters="Formal acceptance tests verify that commercial software and financial models satisfy operational requirements before production deployment. Auditing formula syntax, ranges, and data types prevents circular references and silent computation failures that corrupt balance sheets."
          outputBadge="5 Executed Tests + Formula Audit Matrix"
          statusText={`${state.acceptanceTests.filter((t) => t.verdict === 'PASS').length}/5 Tests PASS`}
          isActive={activeTaskId === 'S19-T02'}
          onSelectTask={() => setActiveTaskId('S19-T02')}
        >
          {/* Sub-section: Five Executed Acceptance Tests Register */}
          <div style={{ marginBottom: '24px', background: '#ffffff', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', fontSize: '1rem', fontWeight: 700 }}>
                  <ShieldCheck size={18} color="#0F766E" /> Five Executed Acceptance Tests Register
                </h4>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                  All five test categories from the approved student workbook executed with objective evidence.
                </p>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F766E' }}>
                {state.acceptanceTests.filter((t) => t.verdict === 'PASS').length} / {state.acceptanceTests.length} Tests Verified PASS
              </span>
            </div>

            <div style={{ overflowX: 'auto', marginBottom: '10px' }}>
              <table className="vcep-comparison-table" style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left', width: '55px' }}>ID</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left', width: '110px' }}>Category</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left', width: '160px' }}>Test Name</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left', width: '160px' }}>Test Input</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>Expected Result</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>Actual Demonstrated Output</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', width: '70px' }}>Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {state.acceptanceTests.map((t) => (
                    <tr key={t.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px 10px', fontWeight: 700, color: '#0F766E' }}>{t.id}</td>
                      <td style={{ padding: '10px 10px' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: '#f1f5f9',
                            color: '#475569',
                          }}
                        >
                          {t.testCategory}
                        </span>
                      </td>
                      <td style={{ padding: '10px 10px', fontWeight: 600, color: '#17245C' }}>{t.name}</td>
                      <td style={{ padding: '10px 10px', fontSize: '0.76rem', color: '#475569' }}>{t.testInput}</td>
                      <td style={{ padding: '10px 10px', fontSize: '0.76rem', color: '#334155' }}>{t.expectedResult}</td>
                      <td style={{ padding: '10px 10px', fontSize: '0.76rem', color: '#065f46', fontWeight: 500 }}>
                        {t.actualDemonstrated}
                      </td>
                      <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleCriterion(t.id)}
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: t.verdict === 'PASS' ? '#15803d' : '#b91c1c',
                            color: '#ffffff',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          {t.verdict}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sub-section: Excel Quality Assurance & Formula Audit Matrix */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', fontSize: '1rem', fontWeight: 700 }}>
              <FileCheck size={18} color="#0F766E" /> Excel Formula Audit Matrix & Technical Controls
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {state.qaChecks.map((check) => (
                <div
                  key={check.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '12px 14px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.75rem', color: '#0F766E' }}>{check.id}</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: '#ecfdf5', color: '#047857' }}>
                      {check.status}
                    </span>
                  </div>
                  <strong style={{ fontSize: '0.85rem', color: '#17245C', display: 'block', marginBottom: '4px' }}>
                    {check.checkName}
                  </strong>
                  <p style={{ margin: '0 0 6px', fontSize: '0.78rem', color: '#475569', lineHeight: 1.35 }}>
                    <strong>Standard:</strong> {check.qualityStandard}
                  </p>
                  <p style={{ margin: '0 0 6px', fontSize: '0.78rem', color: '#334155' }}>
                    <strong>Audit Method:</strong> {check.auditMethod}
                  </p>
                  <div style={{ fontSize: '0.72rem', color: '#0F766E', fontStyle: 'italic' }}>
                    <strong>Formula Audit Evidence:</strong> <code>{check.formulaEvidence}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TaskCard>

        {/* TASK 03: FIX AND RETEST */}
        <TaskCard
          taskId="S19-T03"
          taskNumber="TASK 03"
          title="Fix and Retest"
          instruction="Document individual contributions and log an authentic before/after defect resolution identified during peer review."
          learningTakeaway="Rigorous peer reviews and traceable defect correction logs elevate analytical deliverable quality."
          whyMatters="Documenting individual accountability ensures governance transparency in collaborative enterprise projects. Recording peer review defect corrections provides auditable proof that quality verification actively caught and corrected modeling flaws prior to handover."
          outputBadge="Individual Contribution + Defect Correction Log"
          statusText="Contribution & Defect Logged"
          isActive={activeTaskId === 'S19-T03'}
          onSelectTask={() => setActiveTaskId('S19-T03')}
        >
          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#17245C', marginBottom: '6px' }}>
                  My Specific Deliverable Contribution:
                </label>
                <textarea
                  rows={5}
                  value={state.studentContribution}
                  onChange={(e) => saveState({ ...state, studentContribution: e.target.value })}
                  placeholder="State your exact individual calculation and engineering contributions to the prototype..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    fontFamily: 'inherit',
                    lineHeight: 1.45,
                    color: '#1e293b',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.75rem', color: '#64748b' }}>
                  <span>Detail formula authoring, boundary logic, and suspense isolation.</span>
                  <span>{state.studentContribution.split(/\s+/).filter(Boolean).length} words</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#17245C', marginBottom: '6px' }}>
                  Peer Reviewer Correction (Before vs After):
                </label>
                <textarea
                  rows={5}
                  value={state.reviewerCorrection}
                  onChange={(e) => saveState({ ...state, reviewerCorrection: e.target.value })}
                  placeholder="Document one authentic defect challenged during peer testing and how it was resolved..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    fontFamily: 'inherit',
                    lineHeight: 1.45,
                    color: '#1e293b',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.75rem', color: '#64748b' }}>
                  <span>Must document defect before correction and verified fix after correction.</span>
                  <span>{state.reviewerCorrection.split(/\s+/).filter(Boolean).length} words</span>
                </div>
              </div>
            </div>
          </div>
        </TaskCard>

        {/* TASK 04: PREPARE THE HANDOVER */}
        <TaskCard
          taskId="S19-T04"
          taskNumber="TASK 04"
          title="Prepare the Handover"
          instruction="Draft client refresh instructions, complete the pre-submission checklist, and record deliverable governance sign-offs."
          learningTakeaway="Clear handover documentation empowers commercial stakeholders to maintain financial tools independently."
          whyMatters="Operational handover ensures financial tools can be executed independently by line managers without relying on original authors. Governance sign-offs and structured pre-flight checks enforce professional compliance and prevent unverified files from entering production."
          outputBadge="Operational Runbook + Sign-Off + Rubric Review"
          statusText={`${state.checkedIndices.length}/6 Pre-Flight Items Verified`}
          isActive={activeTaskId === 'S19-T04'}
          onSelectTask={() => setActiveTaskId('S19-T04')}
        >
          {/* Sub-section: Independent Refresh and Handover Result */}
          <div style={{ marginBottom: '20px', background: '#ffffff', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#17245C', marginBottom: '6px' }}>
              Independent Refresh and Handover Instructions:
            </label>
            <textarea
              rows={3}
              value={state.handoverSummary}
              onChange={(e) => saveState({ ...state, handoverSummary: e.target.value })}
              placeholder="State the handover deliverable, how the user refreshes the model via As-Of Date, and confirm no live production writes..."
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                fontFamily: 'inherit',
                lineHeight: 1.45,
                color: '#1e293b',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.75rem', color: '#64748b' }}>
              <span>Recipient instructions: update single date cell; zero production system writes authorized.</span>
              <span>{state.handoverSummary.split(/\s+/).filter(Boolean).length} words</span>
            </div>
          </div>

          {/* Sub-section: Quality Assurance Sign-off & Deliverable Ownership */}
          <div style={{ marginBottom: '20px', background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', fontSize: '1rem', fontWeight: 700 }}>
              <Users size={18} color="#0F766E" /> Quality Assurance Sign-off & Deliverable Ownership
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Preparer (Prototype Modeler):
                </label>
                <input
                  type="text"
                  value={state.governance.preparerName}
                  onChange={(e) =>
                    saveState({
                      ...state,
                      governance: { ...state.governance, preparerName: e.target.value },
                    })
                  }
                  style={{ width: '100%', padding: '6px 10px', fontSize: '0.82rem', borderRadius: '5px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Reviewer (Quality Assurance Lead):
                </label>
                <input
                  type="text"
                  value={state.governance.reviewerName}
                  onChange={(e) =>
                    saveState({
                      ...state,
                      governance: { ...state.governance, reviewerName: e.target.value },
                    })
                  }
                  style={{ width: '100%', padding: '6px 10px', fontSize: '0.82rem', borderRadius: '5px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Decision Owner (MD / Engagement Lead):
                </label>
                <input
                  type="text"
                  value={state.governance.decisionOwnerName}
                  onChange={(e) =>
                    saveState({
                      ...state,
                      governance: { ...state.governance, decisionOwnerName: e.target.value },
                    })
                  }
                  style={{ width: '100%', padding: '6px 10px', fontSize: '0.82rem', borderRadius: '5px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  QA Audit Status:
                </label>
                <select
                  value={state.governance.approvalStatus}
                  onChange={(e) =>
                    saveState({
                      ...state,
                      governance: {
                        ...state.governance,
                        approvalStatus: e.target.value as Session19State['governance']['approvalStatus'],
                      },
                    })
                  }
                  style={{ width: '100%', padding: '6px 10px', fontSize: '0.82rem', borderRadius: '5px', border: '1px solid #cbd5e1' }}
                >
                  <option value="Approved">Verified PASS (Ready for Handover)</option>
                  <option value="Conditional">Conditional Approval</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Draft">Draft Attempt</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sub-section: Student Pre-Submission Verification Checklist */}
          <div style={{ marginBottom: '20px', background: '#ffffff', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <strong style={{ fontSize: '0.85rem', color: '#17245C', display: 'block', marginBottom: '8px' }}>
              Student Pre-Submission Verification Checklist:
            </strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {checklistItems.map((item, idx) => {
                const isChecked = state.checkedIndices.includes(idx);
                return (
                  <label
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      fontSize: '0.8rem',
                      color: isChecked ? '#15803d' : '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleChecklist(idx)}
                      style={{ marginTop: '2px' }}
                    />
                    <span>{item}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Sub-section: Deliverable Metadata & Reset Defaults Bar */}
          <div
            style={{
              marginBottom: '20px',
              padding: '12px 14px',
              borderRadius: '8px',
              background: '#f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              fontSize: '0.8rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileSpreadsheet size={16} color="#0F766E" />
              <span>
                Deliverable File: <strong>{state.governance.fileVersion}</strong>
              </span>
              {draftTimestamp && <span style={{ color: '#64748b' }}>· Autosaved at {draftTimestamp}</span>}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  color: '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <RotateCcw size={12} /> Reset Defaults
              </button>
            </div>
          </div>

          {/* Sub-section: Formative Automatic Review & Rubric Card */}
          <div
            style={{
              padding: '16px',
              background: reviewReport.hasErrors ? '#fff1f2' : '#f0fdf4',
              borderRadius: '10px',
              border: `1.5px solid ${reviewReport.hasErrors ? '#fecdd3' : '#bbf7d0'}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {reviewReport.hasErrors ? <AlertTriangle size={20} color="#b91c1c" /> : <CheckCircle2 size={20} color="#15803d" />}
                <h4 style={{ margin: 0, fontSize: '1rem', color: reviewReport.hasErrors ? '#991b1b' : '#14532d', fontWeight: 700 }}>
                  Automatic Quality Assurance Review: {reviewReport.overallStatus === 'reviewed' ? 'Prototype Verified' : 'Action Required'}
                </h4>
              </div>
              <span
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  background: reviewReport.hasErrors ? '#b91c1c' : '#15803d',
                  color: '#ffffff',
                  padding: '3px 10px',
                  borderRadius: '4px',
                }}
              >
                Estimated Rubric Score: {reviewReport.hasErrors ? '6' : reviewReport.overallStatus === 'reviewed' ? '10' : '8'} / 10 pts
              </span>
            </div>

            <div style={{ fontSize: '0.82rem', color: reviewReport.hasErrors ? '#7f1d1d' : '#166534', lineHeight: 1.4 }}>
              {reviewReport.revisitRecommendations[0] || reviewReport.overallSummary}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '14px' }}>
              {S19_RUBRIC.map((r, i) => (
                <div key={i} style={{ background: '#ffffff', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.75rem' }}>
                  <strong style={{ color: '#17245C', display: 'block', marginBottom: '2px' }}>{r.criterion}</strong>
                  <span style={{ color: '#64748b' }}>{r.description}</span>
                </div>
              ))}
            </div>
          </div>
        </TaskCard>
      </section>

      {/* Sticky Bottom Navigation Footer */}
      <footer
        style={{
          position: 'sticky',
          bottom: 0,
          zIndex: 20,
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          padding: '12px 16px',
          marginTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.03)',
          borderRadius: '0 0 16px 16px',
        }}
      >
        <button
          type="button"
          onClick={() => {
            const prevIdx = Math.max(0, currentStepIdx - 1);
            setActiveTaskId(WIZARD_STEPS[prevIdx].id);
          }}
          disabled={currentStepIdx === 0}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            background: currentStepIdx === 0 ? '#f1f5f9' : '#ffffff',
            color: currentStepIdx === 0 ? '#94a3b8' : '#334155',
            fontSize: '13px',
            fontWeight: 600,
            cursor: currentStepIdx === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          &larr; Previous
        </button>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
          Step {currentStepIdx + 1} of {WIZARD_STEPS.length}
        </div>
        <button
          type="button"
          onClick={() => {
            if (currentStepIdx < WIZARD_STEPS.length - 1) {
              setActiveTaskId(WIZARD_STEPS[currentStepIdx + 1].id);
            }
          }}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            background: '#0f766e',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {currentStepIdx === WIZARD_STEPS.length - 1 ? 'Execution Prototype Complete ✓' : 'Save & Continue →'}
        </button>
      </footer>
    </div>
  );
}
