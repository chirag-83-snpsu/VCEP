'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  S08_STORAGE_KEY,
  UNADJUSTED_CASHBOOK_INR,
  BANK_CHARGES_INR,
  INTEREST_EARNED_INR,
  ADJUSTED_CASHBOOK_INR,
  UNPRESENTED_CHEQUE_INR,
  DEPOSIT_IN_TRANSIT_INR,
  ACTUAL_STATEMENT_INR,
  CASE_C_CASHBOOK_ROWS,
  CASE_C_STATEMENT_ROWS,
  INITIAL_DISCREPANCIES,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_EXCEPTION_LOG,
  INITIAL_S08_STATE,
  S08_RUBRIC,
  S08_CHECKLIST,
  loadSession08State,
  saveSession08State,
  type Session08WorkstationState,
  type DiscrepancyItem,
  type DiscrepancyClassification,
  type JournalEntry,
  type TimingExceptionItem,
} from './session-08-reconciliation-data.ts';
import { evaluateSession08 } from '../../../lib/review-engine/session-rules/session-08.ts';
import type { SessionReviewReport } from '../../../lib/review-engine/types.ts';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Receipt,
  FileCheck,
  ShieldAlert,
  ClipboardList,
  Info,
  DollarSign,
  Layers,
  CheckSquare,
  AlertOctagon,
  FileText,
  Calculator,
  Calendar,
  Lock,
  Eye,
  Table,
  Filter,
  Ban,
  Check,
  ArrowDownRight,
  ArrowUpRight,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
} from 'lucide-react';

interface Session08ReconciliationJourneyProps {
  onUpdateDraft?: (key: string, value: string) => void;
}

interface TaskCardProps {
  taskId: string;
  taskNumber: string;
  title: string;
  instruction: string;
  learningTakeaway?: string;
  whyMatters?: string;
  statusText?: string;
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
            <span style={{ color: '#cbd5e1' }}>·</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>
              Ref: {taskId}
            </span>
          </div>
          <h3
            style={{
              fontSize: 'clamp(17px, 2vw, 20px)',
              fontWeight: 800,
              color: '#17245C',
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h3>
        </div>

        {statusText && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f0fdfa',
              border: '1px solid #99f6e4',
              padding: '4px 10px',
              borderRadius: '16px',
              fontSize: '11.5px',
              color: '#0F766E',
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={13} />
            <span>{statusText}</span>
          </div>
        )}
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
            <span>{whyOpen ? 'Hide accounting principle' : 'Why this matters'}</span>
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

export function Session08ReconciliationJourney({
  onUpdateDraft,
}: Session08ReconciliationJourneyProps) {
  const [state, setState] = useState<Session08WorkstationState>(INITIAL_S08_STATE);
  const [reviewReport, setReviewReport] = useState<SessionReviewReport | null>(null);
  const [selectedDiscrepancyFilter, setSelectedDiscrepancyFilter] = useState<'all' | 'adjustments' | 'timing'>('all');
  const [matchedCashbookIds, setMatchedCashbookIds] = useState<string[]>(['cb1', 'cb2', 'cb3']);
  const [matchedStatementIds, setMatchedStatementIds] = useState<string[]>(['st1', 'st2', 'st3']);
  const [activeTaskId, setActiveTaskId] = useState<string>('S08-T01');

  const WIZARD_STEPS = [
    { id: 'S08-T01' as const, num: 1, label: 'TASK 01: Match Bank and Books', short: '1. Match' },
    { id: 'S08-T02' as const, num: 2, label: 'TASK 02: Adjust the Cash Book', short: '2. Adjust' },
    { id: 'S08-T03' as const, num: 3, label: 'TASK 03: Reconcile Timing Items', short: '3. Timing' },
    { id: 'S08-T04' as const, num: 4, label: 'TASK 04: Close the Difference', short: '4. Close' },
  ];

  const currentStepIdx = useMemo(() => {
    return Math.max(0, WIZARD_STEPS.findIndex((s) => s.id === activeTaskId));
  }, [activeTaskId]);

  // Hydrate on mount
  useEffect(() => {
    const loaded = loadSession08State();
    setState(loaded);
    if (onUpdateDraft) {
      onUpdateDraft('concept:explain', loaded.peerChallengeNote);
      onUpdateDraft('team:contribution', loaded.governance.contributionSummary);
      onUpdateDraft('team:judgement', loaded.antiPlugPledge);
    }
  }, []);

  // Update state helper with auto-persistence and draft sync
  const updateState = (updater: (prev: Session08WorkstationState) => Session08WorkstationState) => {
    setState((prev) => {
      const next = updater(prev);
      saveSession08State(next);
      if (onUpdateDraft) {
        onUpdateDraft('concept:explain', next.peerChallengeNote);
        onUpdateDraft('team:contribution', next.governance.contributionSummary);
        onUpdateDraft('team:judgement', next.antiPlugPledge);
      }
      return next;
    });
  };

  // Toggle item matching in ledger comparison
  const toggleCashbookMatch = (id: string) => {
    setMatchedCashbookIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleStatementMatch = (id: string) => {
    setMatchedStatementIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Discrepancy Classification Handler
  const handleClassify = (discrepancyId: string, classification: DiscrepancyClassification) => {
    updateState((prev) => ({
      ...prev,
      discrepancies: prev.discrepancies.map((d) =>
        d.id === discrepancyId ? { ...d, userClassification: classification } : d
      ),
    }));
  };

  // Mathematical Calculations
  const adjustedCashBook = useMemo(() => {
    return state.unadjustedBook - state.bankCharges + state.interestEarned;
  }, [state.unadjustedBook, state.bankCharges, state.interestEarned]);

  const calculatedStatement = useMemo(() => {
    return adjustedCashBook + state.unpresentedCheque - state.depositInTransit;
  }, [adjustedCashBook, state.unpresentedCheque, state.depositInTransit]);

  const reconciliationVariance = useMemo(() => {
    return state.actualStatement - calculatedStatement;
  }, [state.actualStatement, calculatedStatement]);

  const isBalanced = reconciliationVariance === 0 && adjustedCashBook === 87200 && calculatedStatement === 83200;

  // Toggle checklist items
  const handleToggleCheck = (index: number) => {
    updateState((prev) => {
      const nextChecked = prev.checkedIndices.includes(index)
        ? prev.checkedIndices.filter((i) => i !== index)
        : [...prev.checkedIndices, index];
      return { ...prev, checkedIndices: nextChecked };
    });
  };

  // Formative Review Evaluation
  const runReviewEvaluation = () => {
    const report = evaluateSession08({
      sessionId: 8,
      draft: {
        'concept:explain': state.peerChallengeNote,
        'team:contribution': state.governance.contributionSummary,
        'team:judgement': state.antiPlugPledge,
      },
      workstationData: {
        unadjustedBook: state.unadjustedBook,
        bankCharges: state.bankCharges,
        interestEarned: state.interestEarned,
        unpresentedCheque: state.unpresentedCheque,
        depositInTransit: state.depositInTransit,
        actualStatement: state.actualStatement,
        exceptionLog: state.exceptionLog,
      },
    });
    setReviewReport(report);
  };

  const handleResetToApproved = () => {
    if (confirm('Reset Session 08 to approved Case C baseline data?')) {
      try {
        localStorage.removeItem(S08_STORAGE_KEY);
      } catch {}
      setState(INITIAL_S08_STATE);
      setMatchedCashbookIds(['cb1', 'cb2', 'cb3']);
      setMatchedStatementIds(['st1', 'st2', 'st3']);
      if (onUpdateDraft) {
        onUpdateDraft('concept:explain', INITIAL_S08_STATE.peerChallengeNote);
        onUpdateDraft('team:contribution', INITIAL_S08_STATE.governance.contributionSummary);
        onUpdateDraft('team:judgement', INITIAL_S08_STATE.antiPlugPledge);
      }
    }
  };

  const filteredDiscrepancies = state.discrepancies.filter((d) => {
    if (selectedDiscrepancyFilter === 'adjustments') return d.correctClassification === 'book_adjustment';
    if (selectedDiscrepancyFilter === 'timing') return d.correctClassification === 'timing_difference';
    return true;
  });

  const countWords = (s: string) => (s ? s.trim().split(/\s+/).filter(Boolean).length : 0);

  return (
    <div className="vcep-session-clean-journey">
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
                padding: '7px 12px',
                borderRadius: '8px',
                border: isActive ? '1px solid #0f766e' : '1px solid transparent',
                background: isActive ? '#0f766e' : '#f8fafc',
                color: isActive ? '#ffffff' : '#475569',
                fontSize: '12px',
                fontWeight: isActive ? 700 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                flex: '1 1 auto',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: isActive ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                  color: isActive ? '#ffffff' : '#64748b',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10.5px',
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

      {/* =========================================================================
          HEADING 1: COMPARE BANK & BOOKS (#vcep-area-compare)
         ========================================================================= */}
      <section id="vcep-area-compare" aria-labelledby="heading-area-compare" className="vcep-journey-stage-block">
        <div className="vcep-journey-section-header">
          <div className="vcep-journey-badge-row">
            <span className="vcep-pill-navy">WORK AREA 01</span>
            <span className="vcep-pill-teal">CASE C OCTOBER FINANCIAL AUDIT</span>
            <span className="vcep-pill-gold">INTERACTIVE COMPARISON</span>
          </div>
          <h2 id="heading-area-compare" className="vcep-journey-title">
            1. Compare Bank &amp; Books
          </h2>
          <p className="vcep-journey-subtitle">
            Match cleared company transactions against commercial bank statements. Isolate timing differences from genuine bank-only events requiring journal entries.
          </p>
        </div>

        {/* TASK 01: Match Bank and Books (S08-T01) */}
        <TaskCard
          taskId="S08-T01"
          taskNumber="TASK 01"
          title="Match Bank and Books"
          instruction="Compare Case C cash book entries against bank statements to tick-match cleared items and isolate differences."
          learningTakeaway="Bank reconciliation begins with line-by-line matching to separate cleared items from unrecorded events."
          whyMatters="Bank reconciliation begins with item-by-item tick-matching. Cleared items establish transactions that both the company and bank already acknowledge, leaving only unrecorded bank events and timing delays to be resolved."
          statusText={`${matchedCashbookIds.length + matchedStatementIds.length} of 12 Lines Matched`}
          isActive={activeTaskId === 'S08-T01'}
          onSelectTask={() => setActiveTaskId('S08-T01')}
        >
          {/* Side-by-Side Financial Workspace */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '12px' }}>
            {/* Left Column: Company Cash Book */}
            <div className="vcep-sheet-card" style={{ border: '1px solid rgba(23, 36, 92, 0.15)', borderRadius: '12px', background: '#ffffff', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', background: 'rgba(23, 36, 92, 0.04)', borderBottom: '1px solid rgba(23, 36, 92, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: '#17245C', textTransform: 'uppercase' }}>COMPANY LEDGER</div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#17245C' }}>Cash Book (Bank Account)</h4>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>Unadjusted Balance</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#17245C' }}>₹87,500 Dr</span>
                </div>
              </div>

              <div style={{ overflowX: 'auto', maxHeight: '380px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
                      <th style={{ padding: '8px 10px', width: '38px', textAlign: 'center' }}>Match</th>
                      <th style={{ padding: '8px 10px' }}>Date</th>
                      <th style={{ padding: '8px 10px' }}>Details / Source</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>Dr (In)</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>Cr (Out)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CASE_C_CASHBOOK_ROWS.map((row) => {
                      const isMatched = matchedCashbookIds.includes(row.id);
                      return (
                        <tr
                          key={row.id}
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            background: row.isDiscrepancy ? 'rgba(239, 68, 68, 0.03)' : isMatched ? 'rgba(15, 118, 110, 0.02)' : 'transparent',
                          }}
                        >
                          <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCashbookMatch(row.id);
                              }}
                              style={{
                                border: 'none',
                                background: isMatched ? '#ccfbf1' : '#f1f5f9',
                                color: isMatched ? '#0f766e' : '#94a3b8',
                                borderRadius: '4px',
                                width: '22px',
                                height: '22px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifySelf: 'center',
                              }}
                              title={isMatched ? 'Matched with bank statement' : 'Click to match'}
                            >
                              {isMatched ? <Check size={13} strokeWidth={3} /> : <span style={{ fontSize: '10px' }}>○</span>}
                            </button>
                          </td>
                          <td style={{ padding: '8px 10px', fontFamily: 'monospace', color: '#64748B' }}>{row.date}</td>
                          <td style={{ padding: '8px 10px' }}>
                            <div style={{ fontWeight: 600, color: '#1e293b' }}>{row.description}</div>
                            <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', background: '#f1f5f9', color: '#64748B', fontFamily: 'monospace' }}>
                              {row.ref}
                            </span>
                            {row.isDiscrepancy && (
                              <span style={{ marginLeft: '6px', fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', background: '#fee2e2', color: '#b91c1c', fontWeight: 600 }}>
                                Timing Discrepancy
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: row.debit ? '#0f766e' : '#cbd5e1' }}>
                            {row.debit ? `₹${row.debit.toLocaleString('en-IN')}` : '—'}
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: row.credit ? '#dc2626' : '#cbd5e1' }}>
                            {row.credit ? `₹${row.credit.toLocaleString('en-IN')}` : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ padding: '10px 16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748B' }}>
                <span>Total Receipts: ₹93,500</span>
                <span>Total Payments: ₹8,000</span>
                <strong style={{ color: '#17245C' }}>Net Debit Balance: ₹87,500</strong>
              </div>
            </div>

            {/* Right Column: Commercial Bank Statement */}
            <div className="vcep-sheet-card" style={{ border: '1px solid rgba(15, 118, 110, 0.2)', borderRadius: '12px', background: '#ffffff', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', background: 'rgba(15, 118, 110, 0.05)', borderBottom: '1px solid rgba(15, 118, 110, 0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: '#0F766E', textTransform: 'uppercase' }}>EXTERNAL EVIDENCE</div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0F766E' }}>Bank Statement (A/C #8812)</h4>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>Reported Credit Balance</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F766E' }}>₹83,200 Cr</span>
                </div>
              </div>

              <div style={{ overflowX: 'auto', maxHeight: '380px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
                      <th style={{ padding: '8px 10px', width: '38px', textAlign: 'center' }}>Match</th>
                      <th style={{ padding: '8px 10px' }}>Date</th>
                      <th style={{ padding: '8px 10px' }}>Transaction / Reference</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>Dr (Out)</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>Cr (In)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CASE_C_STATEMENT_ROWS.map((row) => {
                      const isMatched = matchedStatementIds.includes(row.id);
                      return (
                        <tr
                          key={row.id}
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            background: row.isDiscrepancy ? 'rgba(234, 179, 8, 0.05)' : isMatched ? 'rgba(15, 118, 110, 0.02)' : 'transparent',
                          }}
                        >
                          <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStatementMatch(row.id);
                              }}
                              style={{
                                border: 'none',
                                background: isMatched ? '#ccfbf1' : '#f1f5f9',
                                color: isMatched ? '#0f766e' : '#94a3b8',
                                borderRadius: '4px',
                                width: '22px',
                                height: '22px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifySelf: 'center',
                              }}
                              title={isMatched ? 'Matched with company cash book' : 'Click to match'}
                            >
                              {isMatched ? <Check size={13} strokeWidth={3} /> : <span style={{ fontSize: '10px' }}>○</span>}
                            </button>
                          </td>
                          <td style={{ padding: '8px 10px', fontFamily: 'monospace', color: '#64748B' }}>{row.date}</td>
                          <td style={{ padding: '8px 10px' }}>
                            <div style={{ fontWeight: 600, color: '#1e293b' }}>{row.description}</div>
                            <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', background: '#f1f5f9', color: '#64748B', fontFamily: 'monospace' }}>
                              {row.ref}
                            </span>
                            {row.isDiscrepancy && (
                              <span style={{ marginLeft: '6px', fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', background: '#fef3c7', color: '#92400e', fontWeight: 600 }}>
                                Bank-Only Adjustment
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: row.withdrawals ? '#dc2626' : '#cbd5e1' }}>
                            {row.withdrawals ? `₹${row.withdrawals.toLocaleString('en-IN')}` : '—'}
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: row.deposits ? '#0f766e' : '#cbd5e1' }}>
                            {row.deposits ? `₹${row.deposits.toLocaleString('en-IN')}` : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ padding: '10px 16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748B' }}>
                <span>Total Deposits: ₹83,700</span>
                <span>Total Withdrawals: ₹2,500</span>
                <strong style={{ color: '#0F766E' }}>Statement Credit Balance: ₹83,200</strong>
              </div>
            </div>
          </div>
        </TaskCard>

        {/* TASK 02: Adjust the Cash Book (S08-T02) */}
        <TaskCard
          taskId="S08-T02"
          taskNumber="TASK 02"
          title="Adjust the Cash Book"
          instruction="Post formal double-entry adjustment journals for bank charges (₹500) and interest earned (₹200)."
          learningTakeaway="Adjust cash books for legitimate bank-only charges and interest before preparing the reconciliation."
          whyMatters="Under accounting principles, only permanent bank-only events (such as service charges or interest) receive general ledger entries. Timing items must never be journalized because they will clear naturally through the banking network."
          statusText="2 Adjustment Journals Posted"
          isActive={activeTaskId === 'S08-T02'}
          onSelectTask={() => setActiveTaskId('S08-T02')}
        >
          {/* Discrepancy Classification Engine */}
          <div className="vcep-clean-rules-card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <span className="vcep-eyebrow">AUDIT DISCOVERY</span>
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#17245C', fontWeight: 700 }}>
                  Four Isolated Discrepancies &amp; Classification Engine
                </h4>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748B' }}>
                  Classify each difference between company records and bank statements. Your classification determines whether an item updates the general ledger or reconciles on the BRS schedule only.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className={`v3-tab ${selectedDiscrepancyFilter === 'all' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDiscrepancyFilter('all');
                  }}
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                >
                  All (4)
                </button>
                <button
                  type="button"
                  className={`v3-tab ${selectedDiscrepancyFilter === 'adjustments' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDiscrepancyFilter('adjustments');
                  }}
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                >
                  Book Adjustments (2)
                </button>
                <button
                  type="button"
                  className={`v3-tab ${selectedDiscrepancyFilter === 'timing' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDiscrepancyFilter('timing');
                  }}
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                >
                  Timing Differences (2)
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              {filteredDiscrepancies.map((item) => {
                const isCorrect = item.userClassification === item.correctClassification;
                return (
                  <div
                    key={item.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '14px',
                      background: '#ffffff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: '#f1f5f9', color: '#475569', fontWeight: 600 }}>
                          {item.reportedIn}
                        </span>
                        <strong style={{ fontSize: '1rem', color: item.direction === 'inflow' ? '#0f766e' : '#dc2626' }}>
                          {item.direction === 'inflow' ? '+' : '-'} ₹{item.amount.toLocaleString('en-IN')}
                        </strong>
                      </div>

                      <h5 style={{ margin: '0 0 6px', fontSize: '0.9rem', color: '#17245C', fontWeight: 700 }}>{item.title}</h5>
                      <p style={{ margin: '0 0 8px', fontSize: '0.76rem', color: '#64748B', fontFamily: 'monospace' }}>
                        Ref: {item.sourceReference}
                      </p>
                      <p style={{ margin: '0 0 12px', fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                        {item.explanation}
                      </p>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748B', marginBottom: '6px' }}>CLASSIFICATION:</div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClassify(item.id, 'book_adjustment');
                          }}
                          style={{
                            fontSize: '0.72rem',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: item.userClassification === 'book_adjustment' ? '2px solid #0f766e' : '1px solid #cbd5e1',
                            background: item.userClassification === 'book_adjustment' ? '#ccfbf1' : '#ffffff',
                            color: item.userClassification === 'book_adjustment' ? '#0f766e' : '#475569',
                            fontWeight: item.userClassification === 'book_adjustment' ? 700 : 500,
                            cursor: 'pointer',
                          }}
                        >
                          Book Adjustment
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClassify(item.id, 'timing_difference');
                          }}
                          style={{
                            fontSize: '0.72rem',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: item.userClassification === 'timing_difference' ? '2px solid #b45309' : '1px solid #cbd5e1',
                            background: item.userClassification === 'timing_difference' ? '#fef3c7' : '#ffffff',
                            color: item.userClassification === 'timing_difference' ? '#b45309' : '#475569',
                            fontWeight: item.userClassification === 'timing_difference' ? 700 : 500,
                            cursor: 'pointer',
                          }}
                        >
                          Timing Diff
                        </button>
                      </div>

                      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem' }}>
                        {isCorrect ? (
                          <span style={{ color: '#16a34a', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={12} /> Correct classification
                          </span>
                        ) : (
                          <span style={{ color: '#ea580c', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <AlertTriangle size={12} /> Verify classification rule
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 4 Cardinal Banking Governance Rules */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <div className="vcep-rule-item">
                <div className="rule-header">
                  <span className="rule-badge">RULE 1</span>
                  <strong className="rule-title">Ledger vs Timing Separation</strong>
                </div>
                <p className="rule-desc">
                  Permanent bank-only items update the Cash Book. Timing items (unpresented cheques/in-transit deposits) belong only on the BRS schedule.
                </p>
              </div>
              <div className="vcep-rule-item">
                <div className="rule-header">
                  <span className="rule-badge">RULE 2</span>
                  <strong className="rule-title">No Double-Posting of Timing Items</strong>
                </div>
                <p className="rule-desc">
                  Never journalise timing differences. They clear naturally through the banking network. Journalising them creates fictitious revenue or cash.
                </p>
              </div>
              <div className="vcep-rule-item">
                <div className="rule-header">
                  <span className="rule-badge">RULE 3</span>
                  <strong className="rule-title">Zero Unexplained Variance Standard</strong>
                </div>
                <p className="rule-desc">
                  Never force an unexplained plug balance. The mathematical bridge between Cash Book and Bank Statement must balance with ₹0 variance.
                </p>
              </div>
              <div className="vcep-rule-item">
                <div className="rule-header">
                  <span className="rule-badge">RULE 4</span>
                  <strong className="rule-title">Source Evidence Traceability</strong>
                </div>
                <p className="rule-desc">
                  Every book adjustment requires an audit reference (Bank Advice #S-881, Pay-in Slip #9821, Cheque Counterfoil #4401).
                </p>
              </div>
            </div>
          </div>

          {/* Two-Entry Cash Book Adjustment Journal Component */}
          <div className="vcep-sheet-card" style={{ border: '1px solid rgba(23, 36, 92, 0.15)', borderRadius: '12px', background: '#ffffff', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <FileText size={18} color="#17245C" />
              <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#17245C' }}>
                Two-Entry Cash Book Adjustment Journal
              </h4>
            </div>
            <p style={{ margin: '0 0 12px', fontSize: '0.78rem', color: '#64748B' }}>
              Only genuine bank-only events receive general ledger postings. Timing items clear naturally and are excluded from journals.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {state.journalEntries.map((j, idx) => (
                <div key={j.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#17245C' }}>Entry #{idx + 1} ({j.date})</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F766E' }}>₹{j.amount.toLocaleString('en-IN')}</span>
                  </div>

                  <div style={{ fontSize: '0.82rem', fontFamily: 'monospace', color: '#1e293b', lineHeight: 1.6 }}>
                    <div><strong>Dr.</strong> {j.drAccount} <span style={{ float: 'right' }}>₹{j.amount.toLocaleString('en-IN')}</span></div>
                    <div style={{ paddingLeft: '20px' }}><strong>To</strong> {j.crAccount} <span style={{ float: 'right' }}>₹{j.amount.toLocaleString('en-IN')}</span></div>
                  </div>

                  <div style={{ marginTop: '8px', fontSize: '0.74rem', color: '#64748B', fontStyle: 'italic', borderTop: '1px dashed #cbd5e1', paddingTop: '6px' }}>
                    Narration: {j.narration}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '12px', padding: '8px 12px', borderRadius: '6px', background: '#ecfdf5', border: '1px solid #a7f3d0', fontSize: '0.74rem', color: '#065f46', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} />
              <span>Verified: Timing differences (₹10k &amp; ₹6k) correctly omitted from journal vouchers.</span>
            </div>
          </div>
        </TaskCard>
      </section>

      {/* =========================================================================
          HEADING 2: PREPARE THE RECONCILIATION (#vcep-area-reconcile)
         ========================================================================= */}
      <section id="vcep-area-reconcile" aria-labelledby="heading-area-reconcile" className="vcep-journey-stage-block">
        <div className="vcep-journey-section-header">
          <div className="vcep-journey-badge-row">
            <span className="vcep-pill-navy">WORK AREA 02</span>
            <span className="vcep-pill-teal">PROFESSIONAL DELIVERABLE</span>
            <span className="vcep-pill-gold">AUDITED BRS SCHEDULE</span>
          </div>
          <h2 id="heading-area-reconcile" className="vcep-journey-title">
            2. Prepare the Reconciliation
          </h2>
          <p className="vcep-journey-subtitle">
            Bridge the unadjusted Cash Book (₹87,500) to the Bank Statement (₹83,200). Record double-entry adjustment journals and maintain the timing exception register.
          </p>
        </div>

        {/* TASK 03: Reconcile Timing Items (S08-T03) */}
        <TaskCard
          taskId="S08-T03"
          taskNumber="TASK 03"
          title="Reconcile Timing Items"
          instruction="Reconcile unpresented cheques (₹6,000) and deposits in transit (₹10,000) to bridge book and bank balances."
          learningTakeaway="Bridge deposits in transit and unpresented cheques on the BRS schedule without double posting into ledgers."
          whyMatters="Deposits in transit and unpresented cheques are valid transactions already in company books that the bank clearinghouse has not processed yet. Reconciling them on the BRS schedule bridges the timing gap while tracking clearance dates prevents fraud and duplicate cash entries."
          statusText="2 Timing Items Controlled"
          isActive={activeTaskId === 'S08-T03'}
          onSelectTask={() => setActiveTaskId('S08-T03')}
        >
          {/* Timing Differences Exception Register */}
          <div className="vcep-sheet-card" style={{ border: '1px solid rgba(15, 118, 110, 0.2)', borderRadius: '12px', background: '#ffffff', padding: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <ShieldAlert size={18} color="#0F766E" />
              <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#0F766E' }}>
                Timing Differences Exception Register
              </h4>
            </div>
            <p style={{ margin: '0 0 12px', fontSize: '0.78rem', color: '#64748B' }}>
              Temporary discrepancies tracked with assigned corporate action owners and target banking clearance dates.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '12px' }}>
              {state.exceptionLog.map((e) => (
                <div key={e.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#17245C' }}>{e.item}</span>
                    <strong style={{ fontSize: '0.9rem', color: '#b45309' }}>₹{e.amount.toLocaleString('en-IN')}</strong>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.6 }}>
                    <div><strong>Source Evidence:</strong> {e.source}</div>
                    <div><strong>Action Owner:</strong> {e.owner}</div>
                    <div><strong>Target Clearance:</strong> {e.targetDate}</div>
                  </div>

                  <div style={{ marginTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', background: '#fef3c7', color: '#92400e', fontWeight: 600 }}>
                      Status: {e.status}
                    </span>
                    <span style={{ color: '#059669', fontWeight: 600 }}>BRS Bridge Controlled</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '12px', padding: '8px 12px', borderRadius: '6px', background: '#f0fdf4', border: '1px solid #bbf7d0', fontSize: '0.74rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} />
              <span>Two timing items logged with assigned audit owners and clearance dates.</span>
            </div>
          </div>

          {/* Squad Activity: Controller Challenge & Anti-Plug Pledge */}
          <div className="vcep-clean-rules-card">
            <span className="vcep-eyebrow">PROFESSIONAL DEFENSE &amp; SQUAD CHALLENGE</span>
            <h4 style={{ margin: '0 0 6px', fontSize: '1.05rem', color: '#17245C', fontWeight: 700 }}>
              Senior Finance Controller Challenge: The ₹10,000 Deposit Inquiry
            </h4>
            <p style={{ margin: '0 0 14px', fontSize: '0.8rem', color: '#64748B' }}>
              The Senior Controller asks you: <em>&ldquo;Why don&rsquo;t we post another debit for the ₹10,000 customer deposit into our ledger to make the numbers match?&rdquo;</em> Document your professional defense.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#17245C' }}>
                  YOUR PROFESSIONAL DEFENSE &amp; ACCOUNTING REASONING:
                </label>
                <span style={{ fontSize: '0.72rem', color: countWords(state.peerChallengeNote) >= 15 ? '#0F766E' : '#dc2626', fontWeight: 600 }}>
                  {countWords(state.peerChallengeNote)} words (min 15 required)
                </span>
              </div>
              <textarea
                value={state.peerChallengeNote}
                onChange={(e) => updateState((prev) => ({ ...prev, peerChallengeNote: e.target.value }))}
                rows={4}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  lineHeight: 1.5,
                  color: '#1e293b',
                  fontFamily: 'inherit',
                }}
                placeholder="Explain why timing differences clear naturally and why posting them twice causes duplicate revenue..."
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#17245C' }}>
                  AUTONOMOUS ANTI-PLUG STANDARD (ETHICAL CODE):
                </label>
                <span style={{ fontSize: '0.72rem', color: countWords(state.antiPlugPledge) >= 10 ? '#0F766E' : '#dc2626', fontWeight: 600 }}>
                  {countWords(state.antiPlugPledge)} words (min 10 required)
                </span>
              </div>
              <textarea
                value={state.antiPlugPledge}
                onChange={(e) => updateState((prev) => ({ ...prev, antiPlugPledge: e.target.value }))}
                rows={2}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  lineHeight: 1.5,
                  color: '#1e293b',
                  fontFamily: 'inherit',
                }}
                placeholder="State your commitment to never force unexplained balancing plugs..."
              />
            </div>
          </div>
        </TaskCard>

        {/* TASK 04: Close the Difference (S08-T04) */}
        <TaskCard
          taskId="S08-T04"
          taskNumber="TASK 04"
          title="Close the Difference"
          instruction="Construct the 3-column BRS schedule, prove zero unexplained variance (₹0), and complete portfolio sign-off."
          learningTakeaway="A Bank Reconciliation Statement must achieve zero unexplained variance—never plug unexplained numbers."
          whyMatters="The Bank Reconciliation Statement provides legal and audit proof that Adjusted Book Cash (₹87,200) reconciles to the Bank Statement (₹83,200) via timing differences without forcing unexplained plugs or fictional balancing numbers."
          statusText={isBalanced ? 'Balanced (₹0 Variance)' : 'Pending Reconciliation'}
          isActive={activeTaskId === 'S08-T04'}
          onSelectTask={() => setActiveTaskId('S08-T04')}
        >
          {/* BRS Schedule Card */}
          <div className={`vcep-recon-card ${isBalanced ? 'is-balanced' : 'has-variance'}`} style={{ marginBottom: '24px' }}>
            <div className="vcep-recon-header">
              <div className="vcep-recon-title-area">
                <div className="vcep-recon-icon-badge">
                  <Scale size={22} aria-hidden="true" />
                </div>
                <div>
                  <h4 className="vcep-recon-title" style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
                    Bank Reconciliation Statement (As of 31 October)
                  </h4>
                  <p className="vcep-recon-subtitle">
                    Three-column bridge: Cash Book Starting Balance → Permanent Adjustments → Timing Differences → Bank Statement
                  </p>
                </div>
              </div>

              <div className="vcep-recon-status-badge">
                {isBalanced ? (
                  <span className="vcep-status-pill pill-balanced">
                    <CheckCircle2 size={16} aria-hidden="true" />
                    <span>BALANCED (₹0 VARIANCE)</span>
                  </span>
                ) : (
                  <span className="vcep-status-pill pill-warning">
                    <AlertOctagon size={16} aria-hidden="true" />
                    <span>UNRECONCILED VARIANCE: ₹{Math.abs(reconciliationVariance).toLocaleString('en-IN')}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Interactive BRS Schedule Table */}
            <div style={{ padding: '16px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(23, 36, 92, 0.15)', textAlign: 'left', color: '#17245C' }}>
                    <th style={{ padding: '10px 12px' }}>Particulars / Source Reference</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center', width: '130px' }}>Classification</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right', width: '140px' }}>Amount (INR)</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right', width: '160px' }}>Subtotal / Net</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 1. Cash Book Starting Balance */}
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(23, 36, 92, 0.02)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>
                      <strong>Unadjusted Balance as per Cash Book</strong> (Debit / Company Asset)
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: '#e0f2fe', color: '#0369a1', fontWeight: 600 }}>
                        Starting
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>₹{state.unadjustedBook.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#17245C' }}>
                      ₹{state.unadjustedBook.toLocaleString('en-IN')}
                    </td>
                  </tr>

                  {/* 2. Permanent Cash Book Adjustments */}
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <td style={{ padding: '10px 12px', paddingLeft: '28px', color: '#dc2626' }}>
                      Less: Bank Service Charges debited by bank not in cash book (Advice #S-881)
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: '#fee2e2', color: '#b91c1c', fontWeight: 600 }}>
                        Book Adjustment
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#dc2626', fontWeight: 600 }}>
                      - ₹{state.bankCharges.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <td style={{ padding: '10px 12px', paddingLeft: '28px', color: '#16a34a' }}>
                      Add: Interest on bank balance credited by bank not in cash book (Memo #INT-OCT)
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: '#dcfce7', color: '#15803d', fontWeight: 600 }}>
                        Book Adjustment
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#16a34a', fontWeight: 600 }}>
                      + ₹{state.interestEarned.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#4b5563', fontSize: '0.85rem' }}>
                      - ₹{(state.bankCharges - state.interestEarned).toLocaleString('en-IN')}
                    </td>
                  </tr>

                  {/* Subtotal: Adjusted Cash Book */}
                  <tr style={{ borderBottom: '2px solid rgba(23, 36, 92, 0.2)', background: '#f8fafc' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#17245C' }}>
                      Adjusted Balance as per Cash Book (True Corporate Cash Position)
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: '#e0e7ff', color: '#3730a3', fontWeight: 700 }}>
                        Adjusted Book
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}></td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 800, fontSize: '0.95rem', color: '#17245C' }}>
                      ₹{adjustedCashBook.toLocaleString('en-IN')}
                    </td>
                  </tr>

                  {/* 3. Temporary Timing Differences */}
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <td style={{ padding: '10px 12px', paddingLeft: '28px', color: '#16a34a' }}>
                      Add: Cheques issued to suppliers but not yet presented for payment (Cheque #4401)
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: '#fef3c7', color: '#92400e', fontWeight: 600 }}>
                        Timing Diff
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#16a34a', fontWeight: 600 }}>
                      + ₹{state.unpresentedCheque.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <td style={{ padding: '10px 12px', paddingLeft: '28px', color: '#dc2626' }}>
                      Less: Customer deposits paid into bank but not yet credited (Pay-in Slip #9821 - In Transit)
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: '#fef3c7', color: '#92400e', fontWeight: 600 }}>
                        Timing Diff
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#dc2626', fontWeight: 600 }}>
                      - ₹{state.depositInTransit.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#4b5563', fontSize: '0.85rem' }}>
                      - ₹{(state.depositInTransit - state.unpresentedCheque).toLocaleString('en-IN')}
                    </td>
                  </tr>

                  {/* 4. Calculated Statement Balance */}
                  <tr style={{ borderBottom: '2px solid rgba(15, 118, 110, 0.4)', background: 'rgba(15, 118, 110, 0.05)' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#0F766E' }}>
                      Calculated Balance as per Bank Statement (Reconciled Credit Position)
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: '#ccfbf1', color: '#0f766e', fontWeight: 700 }}>
                        BRS Output
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}></td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 800, fontSize: '1rem', color: '#0F766E' }}>
                      ₹{calculatedStatement.toLocaleString('en-IN')}
                    </td>
                  </tr>

                  {/* 5. Actual Target Statement Balance */}
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: '#ffffff' }}>
                    <td style={{ padding: '10px 12px', color: '#4b5563', fontStyle: 'italic' }}>
                      Actual Statement Balance (Case C External Bank Statement)
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: '#f1f5f9', color: '#475569' }}>
                        Target
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}></td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#475569', fontWeight: 600 }}>
                      ₹{state.actualStatement.toLocaleString('en-IN')}
                    </td>
                  </tr>

                  {/* 6. Zero Unexplained Variance Proof */}
                  <tr style={{ background: isBalanced ? '#ecfdf5' : '#fef2f2', fontWeight: 700 }}>
                    <td style={{ padding: '12px', color: isBalanced ? '#15803d' : '#b91c1c' }}>
                      Unexplained Variance (Reconciliation Audit Check)
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: isBalanced ? '#bbf7d0' : '#fecaca',
                          color: isBalanced ? '#15803d' : '#991b1b',
                          fontWeight: 700,
                        }}
                      >
                        {isBalanced ? 'ZERO VARIANCE' : 'VARIANCE DETECTED'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}></td>
                    <td style={{ padding: '12px', textAlign: 'right', color: isBalanced ? '#15803d' : '#b91c1c', fontSize: '1rem', fontWeight: 800 }}>
                      ₹{reconciliationVariance.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="vcep-recon-equation-banner">
              <div className="vcep-recon-equation-text">
                <strong>Mathematical Zero-Variance Proof:</strong>{' '}
                <code>
                  Adjusted Book (₹87,200) + Unpresented Cheques (₹6,000) - Deposit in Transit (₹10,000) = Bank Statement (₹83,200). Unexplained Variance = ₹0.00.
                </code>
              </div>
            </div>
          </div>

          {/* Pre-Submission Verification Checklist */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '0.85rem', color: '#17245C', fontWeight: 700 }}>
              Pre-Submission Verification Checklist:
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
              {S08_CHECKLIST.map((item, idx) => {
                const isChecked = state.checkedIndices.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleCheck(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      background: isChecked ? '#f0fdf4' : '#f8fafc',
                      border: isChecked ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      color: isChecked ? '#166534' : '#475569',
                    }}
                  >
                    <CheckSquare size={15} color={isChecked ? '#16a34a' : '#94a3b8'} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span>{item}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Evidence Handover & Portfolio Governance */}
          <div className="vcep-clean-rules-card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
              <div>
                <span className="vcep-eyebrow">PORTFOLIO EVIDENCE &amp; AUDIT SIGN-OFF</span>
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#17245C', fontWeight: 700 }}>
                  Bank Reconciliation Artifact: {state.governance.fileVersion}
                </h4>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="vcep-btn-primary"
                  onClick={runReviewEvaluation}
                  style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Sparkles size={14} />
                  <span>Run Formative Review</span>
                </button>
                <button
                  type="button"
                  className="v3-outline"
                  onClick={handleResetToApproved}
                  style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <RotateCcw size={14} />
                  <span>Reset Case C Baseline</span>
                </button>
              </div>
            </div>

            {/* Governance Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#17245C', marginBottom: '4px' }}>
                  STUDENT CANDIDATE ID
                </label>
                <input
                  type="text"
                  value={state.governance.studentId}
                  onChange={(e) =>
                    updateState((prev) => ({
                      ...prev,
                      governance: { ...prev.governance, studentId: e.target.value },
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    fontFamily: 'monospace',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#17245C', marginBottom: '4px' }}>
                  WORKING FILE VERSION
                </label>
                <input
                  type="text"
                  value={state.governance.fileVersion}
                  onChange={(e) =>
                    updateState((prev) => ({
                      ...prev,
                      governance: { ...prev.governance, fileVersion: e.target.value },
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    fontFamily: 'monospace',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#17245C' }}>
                  MY INDIVIDUAL CONTRIBUTION SUMMARY:
                </label>
                <span style={{ fontSize: '0.72rem', color: countWords(state.governance.contributionSummary) >= 10 ? '#0F766E' : '#dc2626', fontWeight: 600 }}>
                  {countWords(state.governance.contributionSummary)} words
                </span>
              </div>
              <textarea
                value={state.governance.contributionSummary}
                onChange={(e) =>
                  updateState((prev) => ({
                    ...prev,
                    governance: { ...prev.governance, contributionSummary: e.target.value },
                  }))
                }
                rows={2}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.8rem',
                  lineHeight: 1.45,
                  color: '#1e293b',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#17245C' }}>
                  PEER REVIEW &amp; AUDIT CORRECTION:
                </label>
                <span style={{ fontSize: '0.72rem', color: countWords(state.governance.peerCorrection) >= 10 ? '#0F766E' : '#dc2626', fontWeight: 600 }}>
                  {countWords(state.governance.peerCorrection)} words
                </span>
              </div>
              <textarea
                value={state.governance.peerCorrection}
                onChange={(e) =>
                  updateState((prev) => ({
                    ...prev,
                    governance: { ...prev.governance, peerCorrection: e.target.value },
                  }))
                }
                rows={2}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.8rem',
                  lineHeight: 1.45,
                  color: '#1e293b',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* 10-Point Rubric Table */}
          <div>
            <h4 style={{ margin: '0 0 10px', fontSize: '0.85rem', color: '#17245C', fontWeight: 700 }}>
              Approved 10-Point Evaluation Rubric (10 Marks Total):
            </h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                    <th style={{ padding: '8px 12px' }}>Criterion</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center', width: '80px' }}>Points</th>
                    <th style={{ padding: '8px 12px' }}>Evidence Expected from Candidate</th>
                  </tr>
                </thead>
                <tbody>
                  {S08_RUBRIC.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 600, color: '#17245C' }}>{r.name}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, color: '#0F766E' }}>{r.points} pts</td>
                      <td style={{ padding: '8px 12px', color: '#475569' }}>{r.evidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Formative Review Modal / Drawer */}
          {reviewReport && (
            <div
              style={{
                marginTop: '20px',
                border: '2px solid #0f766e',
                borderRadius: '12px',
                padding: '20px',
                background: '#f0fdfa',
                boxShadow: '0 4px 12px rgba(15, 118, 110, 0.1)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={20} color="#0f766e" />
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f766e', fontWeight: 700 }}>
                    Formative Review Report · Session 08
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setReviewReport(null)}
                  style={{ border: 'none', background: 'transparent', fontSize: '0.85rem', color: '#64748B', cursor: 'pointer' }}
                >
                  ✕ Close
                </button>
              </div>

              <p style={{ margin: '0 0 16px', fontSize: '0.86rem', color: '#134e4a', fontWeight: 600 }}>
                {reviewReport.overallSummary}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                {Object.entries(reviewReport.stages).map(([stageName, stageResult]) => (
                  <div
                    key={stageName}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #ccfbf1',
                      borderRadius: '8px',
                      padding: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '0.82rem', color: '#17245C' }}>{stageResult.title}</strong>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: stageResult.status === 'reviewed' ? '#dcfce7' : '#fee2e2',
                          color: stageResult.status === 'reviewed' ? '#15803d' : '#b91c1c',
                          fontWeight: 700,
                        }}
                      >
                        {stageResult.status.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.76rem', color: '#475569' }}>
                      {stageResult.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TaskCard>
      </section>

      {/* Sticky Footer Navigation Bar */}
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
          {currentStepIdx === WIZARD_STEPS.length - 1 ? 'Reconciliation Complete ✓' : 'Save & Continue →'}
        </button>
      </footer>
    </div>
  );
}
