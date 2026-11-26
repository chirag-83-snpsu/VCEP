'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  S05_STORAGE_KEY,
  OPENING_BANK_DEBIT,
  OPENING_CAPITAL_CREDIT,
  TARGET_JOURNAL_TOTAL,
  CHART_OF_ACCOUNTS,
  CASE_A_VOUCHERS,
  INITIAL_JOURNAL_ROWS,
  INITIAL_S05_STATE,
  S05_RUBRIC,
  countWords,
  loadSession05State,
  saveSession05State,
  type Session05WorkstationState,
  type JournalRowState,
  type SourceVoucher,
} from './session-05-accounting-data.ts';
import { evaluateSession05 } from '../../../lib/review-engine/session-rules/session-05.ts';
import type { SessionReviewReport } from '../../../lib/review-engine/types.ts';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  RotateCcw,
  Scale,
  Sparkles,
  ArrowRight,
  BookOpen,
  DollarSign,
  Receipt,
  FileCheck,
  ShieldAlert,
  ClipboardList,
  Info,
  Layers,
  CheckSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Session05AccountingJourneyProps {
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

export function Session05AccountingJourney({
  onUpdateDraft,
}: Session05AccountingJourneyProps) {
  const [state, setState] = useState<Session05WorkstationState>(INITIAL_S05_STATE);
  const [reviewReport, setReviewReport] = useState<SessionReviewReport | null>(null);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string>('S05-T01');

  const WIZARD_STEPS = [
    { id: 'S05-T01' as const, num: 1, label: 'TASK 01: Review Source Records', short: '1. Source' },
    { id: 'S05-T02' as const, num: 2, label: 'TASK 02: Classify Transactions', short: '2. Classify' },
    { id: 'S05-T03' as const, num: 3, label: 'TASK 03: Record Journal Entries', short: '3. Journal' },
    { id: 'S05-T04' as const, num: 4, label: 'TASK 04: Resolve Evidence Exceptions', short: '4. Exceptions' },
  ];

  const currentStepIdx = useMemo(() => {
    return Math.max(0, WIZARD_STEPS.findIndex((s) => s.id === activeTaskId));
  }, [activeTaskId]);

  // Hydrate from persistence on mount
  useEffect(() => {
    const loaded = loadSession05State();
    setState(loaded);
    if (onUpdateDraft) {
      onUpdateDraft('concept:explain', loaded.exceptionsNotes);
      onUpdateDraft('team:contribution', loaded.governance.contributionSummary);
      onUpdateDraft('team:judgement', loaded.governance.professionalBoundary);
    }
  }, []);

  // Update state helper with auto-persistence
  const updateState = (updater: (prev: Session05WorkstationState) => Session05WorkstationState) => {
    setState((prev) => {
      const next = updater(prev);
      saveSession05State(next);

      // Sync with parent draft
      if (onUpdateDraft) {
        onUpdateDraft('concept:explain', next.exceptionsNotes);
        onUpdateDraft('team:contribution', next.governance.contributionSummary);
        onUpdateDraft('team:judgement', next.governance.professionalBoundary);
      }

      return next;
    });
  };

  // Active selected voucher
  const currentVoucher: SourceVoucher = useMemo(() => {
    return CASE_A_VOUCHERS.find((v) => v.docId === state.selectedVoucherId) || CASE_A_VOUCHERS[0];
  }, [state.selectedVoucherId]);

  // Compute live journal totals
  const journalMetrics = useMemo(() => {
    let totalDebit = 0;
    let totalCredit = 0;

    state.rows.forEach((row) => {
      const val = Number(row.amount) || 0;
      if (row.debitAccount && row.debitAccount.trim() !== '') {
        totalDebit += val;
      }
      if (row.creditAccount && row.creditAccount.trim() !== '') {
        totalCredit += val;
      }
    });

    const isBalanced = totalDebit === totalCredit && totalDebit > 0;
    const isTargetMatched = totalDebit === TARGET_JOURNAL_TOTAL && totalCredit === TARGET_JOURNAL_TOTAL;
    const variance = Math.abs(totalDebit - totalCredit);

    return {
      totalDebit,
      totalCredit,
      isBalanced,
      isTargetMatched,
      variance,
    };
  }, [state.rows]);

  // Live validation errors
  const rowIssues = useMemo(() => {
    const issues: Record<string, string> = {};

    state.rows.forEach((row) => {
      if (row.docId === 'A05') {
        if (row.creditAccount.toLowerCase().includes('revenue')) {
          issues[row.id] = 'Double Counting Error: A05 is collection of AR, not new revenue!';
        }
      }
      if (row.docId === 'A09') {
        if (row.creditAccount.toLowerCase().includes('revenue') && !row.creditAccount.toLowerCase().includes('unearned')) {
          issues[row.id] = 'Revenue Timing Error: A09 customer advance is a LIABILITY (Unearned Revenue).';
        }
      }
      if (row.docId === 'A12') {
        if (row.debitAccount.toLowerCase().includes('expense')) {
          issues[row.id] = 'Capitalization Error: Equipment must be capitalized as an Asset, not expensed.';
        }
      }
      if (row.docId === 'A08') {
        if (row.debitAccount.toLowerCase().includes('expense')) {
          issues[row.id] = 'Double Expense Error: A08 settles Wages Payable liability; expense was recognized in A07.';
        }
      }
    });

    return issues;
  }, [state.rows]);

  // Row update handlers
  const handleUpdateRow = (id: string, field: keyof JournalRowState, value: any) => {
    updateState((prev) => ({
      ...prev,
      rows: prev.rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    }));
  };

  const handleResetToApprovedEntries = () => {
    if (window.confirm('Reset journal rows back to canonical Case A approved entries?')) {
      updateState((prev) => ({
        ...prev,
        rows: INITIAL_JOURNAL_ROWS,
      }));
    }
  };

  const handleRunReview = () => {
    const draft: Record<string, string> = {
      'concept:explain': state.exceptionsNotes,
      'team:contribution': state.governance.contributionSummary,
      'team:judgement': state.governance.professionalBoundary,
    };
    const report = evaluateSession05({
      sessionId: 5,
      draft,
      workstationData: state,
    });
    setReviewReport(report);
  };

  const handleCopyJournalJSON = () => {
    const jsonStr = JSON.stringify(
      {
        session: 'VCEP-S05-Accounting-Transactions',
        case: 'Case A September Release',
        studentId: state.governance.studentId,
        fileVersion: state.governance.fileVersion,
        openingBankDebit: OPENING_BANK_DEBIT,
        openingCapitalCredit: OPENING_CAPITAL_CREDIT,
        targetJournalSum: TARGET_JOURNAL_TOTAL,
        totalDebit: journalMetrics.totalDebit,
        totalCredit: journalMetrics.totalCredit,
        balanced: journalMetrics.isBalanced,
        journalEntries: state.rows,
        exceptionsNotes: state.exceptionsNotes,
        governance: state.governance,
      },
      null,
      2
    );

    navigator.clipboard.writeText(jsonStr).then(() => {
      setCopiedNotification('Journal payload copied to clipboard!');
      setTimeout(() => setCopiedNotification(null), 3500);
    });
  };

  return (
    <div className="vcep-s05-workstation bg-slate-50 min-h-screen text-slate-800 pb-20">
      {/* Session Hero Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-900/40 px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Case A September Accounting Release
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700">
                <Receipt className="w-3.5 h-3.5" />
                12 Commercial Events
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                <Scale className="w-3.5 h-3.5" />
                Target Balance: ₹2,08,500
              </span>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>Auto-saved to LocalStation:</span>
              <span className="font-mono text-emerald-400 font-semibold">{state.lastSaved || 'Synchronized'}</span>
            </div>
          </div>

          <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2">
              Work as an Accounts Executive
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Transform messy commercial evidence into an audit-ready general journal. Inspect 12 source vouchers,
              apply accrual timing rules, protect unearned revenue liabilities, capitalize equipment assets, and verify
              the double-entry balance before submitting to portfolio governance.
            </p>
          </div>

          {/* Quick Jump Links */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap gap-3">
            <a
              href="#vcep-area-transactions"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              1. Read the Source Transactions
            </a>
            <a
              href="#vcep-area-journal"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
            >
              <Scale className="w-4 h-4 text-white" />
              2. Prepare the Journal
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="#s05-t01"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 transition-colors"
            >
              <span>Task 01: Source Records</span>
            </a>
            <a
              href="#s05-t02"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 transition-colors"
            >
              <span>Task 02: Classify Traps</span>
            </a>
            <a
              href="#s05-t03"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 transition-colors"
            >
              <span>Task 03: Journal Register</span>
            </a>
            <a
              href="#s05-t04"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 transition-colors"
            >
              <span>Task 04: Exceptions & Sign-off</span>
            </a>
          </div>
        </div>

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
      </section>

      {/* Copy notification toast */}
      {copiedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-500/50 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{copiedNotification}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-12">
        {/* ========================================================================= */}
        {/* HEADING 1: Read the Source Transactions                                   */}
        {/* ========================================================================= */}
        <section id="vcep-area-transactions" className="scroll-mt-24 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-indigo-600">Part 01</span>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Receipt className="w-6 h-6 text-indigo-600" />
                  Read the Source Transactions
                </h2>
              </div>
              <div className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-500" />
                <span>Scope Note: Indirect tax (GST) and depreciation are intentionally excluded.</span>
              </div>
            </div>
          </div>

          {/* TASK 01: Review Source Records (S05-T01) */}
          <TaskCard
            taskId="S05-T01"
            taskNumber="TASK 01"
            title="Review Source Records"
            instruction="Inspect Case A September vouchers (A01 to A12) to verify opening bank deposit and starting equity."
            learningTakeaway="Every ledger entry begins with an authentic source record—invoice, voucher, or bank credit memo."
            whyMatters="Professional accountants never record transactions from verbal summaries or informal chats. Every ledger entry must be substantiated by an authentic source document (tax invoice, payment voucher, bank credit memo) establishing date, counterparty, and monetary consideration."
            statusText="12 Vouchers Verified"
            isActive={activeTaskId === 'S05-T01'}
            onSelectTask={() => setActiveTaskId('S05-T01')}
          >
            <div className="space-y-6">
              {/* Opening Balance Equation Callout */}
              <div className="bg-slate-50 rounded-xl p-5 border border-indigo-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm mb-1">
                    <Scale className="w-4 h-4 text-indigo-600" />
                    Case A Opening Balance (1 September)
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The business begins September with ₹1,00,000 corporate bank deposit provided by founder equity.
                    Fundamental accounting identity: <strong className="text-slate-900">Assets (Bank ₹1,00,000) = Capital (Equity ₹1,00,000)</strong>.
                    All 12 subsequent events build upon this opening financial foundation.
                  </p>
                </div>
                <div className="bg-indigo-50/70 rounded-lg p-3 text-center border border-indigo-100">
                  <div className="text-[11px] font-semibold uppercase text-indigo-600 tracking-wider">Opening Equality</div>
                  <div className="text-base font-mono font-bold text-indigo-950 mt-0.5">
                    Bank Dr ₹1,00,000 = Capital Cr ₹1,00,000
                  </div>
                  <div className="text-[10px] text-indigo-700/80 mt-1">Starting Retained Position</div>
                </div>
              </div>

              {/* Evidence Dossier: Browsable Case A Vouchers */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-900 text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-semibold text-sm sm:text-base">
                      Case A Evidence Dossier — 12 Synthetic Commercial Records
                    </h3>
                  </div>
                  <span className="text-xs text-indigo-200 font-mono">
                    Click any voucher code below to inspect source documents
                  </span>
                </div>

                {/* Voucher Selector Strip */}
                <div className="bg-slate-100 p-2 border-b border-slate-200 overflow-x-auto flex gap-1.5 scrollbar-thin">
                  {CASE_A_VOUCHERS.map((v) => {
                    const isSelected = v.docId === state.selectedVoucherId;
                    return (
                      <button
                        key={v.docId}
                        type="button"
                        onClick={() => updateState((prev) => ({ ...prev, selectedVoucherId: v.docId }))}
                        className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                            : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200/60'
                        }`}
                      >
                        <span className="font-mono">{v.docId}</span>
                        <span className="text-[10px] opacity-75">({v.date})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Voucher Details Card */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-xs font-bold uppercase text-indigo-600 font-mono tracking-wider">
                          Voucher {currentVoucher.docId} • {currentVoucher.voucherNumber}
                        </span>
                        <h4 className="text-lg font-bold text-slate-900">{currentVoucher.documentType}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 uppercase font-semibold">Document Amount</span>
                        <div className="text-xl font-bold font-mono text-emerald-700">
                          ₹{currentVoucher.amountINR.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="text-slate-400 font-medium">Counterparty</div>
                        <div className="text-slate-800 font-semibold mt-0.5">{currentVoucher.counterparty}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="text-slate-400 font-medium">Release Date</div>
                        <div className="text-slate-800 font-semibold mt-0.5">{currentVoucher.date}, 2026</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Event Description & Commercial Context
                      </div>
                      <p className="text-sm text-slate-800 bg-indigo-50/40 p-3.5 rounded-lg border border-indigo-100/60 leading-relaxed">
                        {currentVoucher.sourceEvent}
                      </p>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Source Document Excerpt (Auditable Evidence)
                      </div>
                      <div className="p-3.5 rounded-lg bg-slate-900 text-slate-200 font-mono text-xs border border-slate-800 leading-relaxed">
                        "{currentVoucher.excerpt}"
                      </div>
                    </div>
                  </div>

                  {/* Accounting Executive Guidance for Selected Voucher */}
                  <div className="bg-amber-50/60 rounded-xl p-5 border border-amber-200/70 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-2">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        Accounts Executive Standard
                      </div>
                      <p className="text-xs text-amber-950 leading-relaxed mb-4">
                        {currentVoucher.accountingNote}
                      </p>
                    </div>

                    <div className="border-t border-amber-200/60 pt-3">
                      <div className="text-[11px] font-semibold text-amber-800 mb-1">Audit Status</div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-100 text-amber-900 text-xs font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                        {currentVoucher.evidenceStatus}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TaskCard>

          {/* TASK 02: Classify Transactions (S05-T02) */}
          <TaskCard
            taskId="S05-T02"
            taskNumber="TASK 02"
            title="Classify Transactions"
            instruction="Classify transactions using double-entry rules, avoiding common revenue and capital asset traps."
            learningTakeaway="Correctly classify debits and credits while avoiding unearned revenue and asset capitalization traps."
            whyMatters="Misclassifying transactions distorts financial statements: treating customer deposits as revenue inflates income prematurely, while expensing productive equipment understates assets and misrepresents company valuation to investors and tax authorities."
            statusText="4 Traps Guarded"
            isActive={activeTaskId === 'S05-T02'}
            onSelectTask={() => setActiveTaskId('S05-T02')}
          >
            <div className="space-y-6">
              {/* 4 Critical Accounting Traps & Rules */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-rose-200/70 shadow-sm">
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-xs mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    Trap 1: A05 Receivable Collection
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Collecting ₹35,000 from Apex Retail settles an existing asset. <strong>Do NOT recognize revenue again</strong>.
                    Dr Bank, Cr Accounts Receivable.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-indigo-200/70 shadow-sm">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs mb-1">
                    <Scale className="w-4 h-4" />
                    Trap 2: A09 Customer Advance
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Zenith's ₹15,000 advance is for October work. It is an <strong>Unearned Revenue Liability</strong>,
                    not current September income. Dr Bank, Cr Unearned Revenue.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-amber-200/70 shadow-sm">
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-xs mb-1">
                    <ShieldAlert className="w-4 h-4" />
                    Trap 3: A12 Equipment Purchase
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The ₹5,000 test laptop provides multi-period benefit. <strong>Capitalize as Equipment Asset</strong>,
                    not an operating expense. Dr Equipment Asset, Cr Bank.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-emerald-200/70 shadow-sm">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs mb-1">
                    <CheckSquare className="w-4 h-4" />
                    Trap 4: A07 & A08 Accruals
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    A07 accrues ₹10,000 wage expense (Cr Wages Payable). A08 disburses ₹4,000 to settle liability.
                    <strong>Do not expense wages twice</strong>.
                  </p>
                </div>
              </div>

              {/* Chart of Accounts Reference Matrix */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    Approved Chart of Accounts Classification Reference
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">12 Standard Accounts</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
                    <div className="font-bold text-emerald-800 text-[11px] mb-1">ASSETS (Dr Normal)</div>
                    <ul className="text-[11px] text-slate-600 space-y-0.5 list-disc list-inside">
                      <li>1010 Bank Account</li>
                      <li>1020 Accounts Receivable</li>
                      <li>1510 Equipment Asset</li>
                    </ul>
                  </div>

                  <div className="p-2.5 rounded-lg bg-rose-50/60 border border-rose-100">
                    <div className="font-bold text-rose-800 text-[11px] mb-1">LIABILITIES (Cr Normal)</div>
                    <ul className="text-[11px] text-slate-600 space-y-0.5 list-disc list-inside">
                      <li>2010 Accounts Payable</li>
                      <li>2020 Wages Payable</li>
                      <li>2030 Unearned Revenue</li>
                    </ul>
                  </div>

                  <div className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100">
                    <div className="font-bold text-indigo-800 text-[11px] mb-1">EQUITY (Cr Normal)</div>
                    <ul className="text-[11px] text-slate-600 space-y-0.5 list-disc list-inside">
                      <li>3010 Capital Account</li>
                    </ul>
                  </div>

                  <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100">
                    <div className="font-bold text-blue-800 text-[11px] mb-1">REVENUE (Cr Normal)</div>
                    <ul className="text-[11px] text-slate-600 space-y-0.5 list-disc list-inside">
                      <li>4010 Service Revenue</li>
                    </ul>
                  </div>

                  <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-100">
                    <div className="font-bold text-amber-800 text-[11px] mb-1">EXPENSES (Dr Normal)</div>
                    <ul className="text-[11px] text-slate-600 space-y-0.5 list-disc list-inside">
                      <li>5010 Rent Expense</li>
                      <li>5020 Wages Expense</li>
                      <li>5030 Hosting Expense</li>
                      <li>5040 Office Expense</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TaskCard>
        </section>

        {/* ========================================================================= */}
        {/* HEADING 2: Prepare the Journal                                            */}
        {/* ========================================================================= */}
        <section id="vcep-area-journal" className="scroll-mt-24 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-600">Part 02</span>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Scale className="w-6 h-6 text-emerald-600" />
                  Prepare the Journal
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetToApprovedEntries}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Approved Rows
                </button>
                <button
                  type="button"
                  onClick={handleCopyJournalJSON}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Export Journal JSON
                </button>
              </div>
            </div>
          </div>

          {/* TASK 03: Record Journal Entries (S05-T03) */}
          <TaskCard
            taskId="S05-T03"
            taskNumber="TASK 03"
            title="Record Journal Entries"
            instruction="Post 12 September transactions into the general journal, maintaining balanced cross-foot totals of ₹2,08,500."
            learningTakeaway="Ensure total debits equal total credits for every journal entry, maintaining ₹2,08,500 balance."
            whyMatters="The general journal is the book of original entry. Double-entry equality ensures mathematical and conceptual integrity before posting to ledgers and trial balance."
            statusText={
              journalMetrics.isBalanced && journalMetrics.isTargetMatched
                ? 'Balanced (₹2,08,500)'
                : journalMetrics.isBalanced
                ? `Balanced at ₹${journalMetrics.totalDebit.toLocaleString('en-IN')}`
                : `Variance: ₹${journalMetrics.variance.toLocaleString('en-IN')}`
            }
            isActive={activeTaskId === 'S05-T03'}
            onSelectTask={() => setActiveTaskId('S05-T03')}
          >
            <div className="space-y-6">
              {/* Real-time Double-Entry Balance Gauge */}
              <div
                className={`rounded-xl p-5 border transition-all ${
                  journalMetrics.isBalanced && journalMetrics.isTargetMatched
                    ? 'bg-emerald-50/80 border-emerald-300 shadow-sm'
                    : journalMetrics.isBalanced
                    ? 'bg-amber-50/80 border-amber-300 shadow-sm'
                    : 'bg-rose-50/80 border-rose-300 shadow-sm'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {journalMetrics.isBalanced && journalMetrics.isTargetMatched ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Balanced & Reconciled (₹2,08,500)
                        </span>
                      ) : journalMetrics.isBalanced ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-600 text-white">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Balanced at ₹{journalMetrics.totalDebit.toLocaleString('en-IN')} (Target: ₹2,08,500)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Out of Balance! Variance: ₹{journalMetrics.variance.toLocaleString('en-IN')}
                        </span>
                      )}
                      <span className="text-xs text-slate-600 font-medium">Double-Entry Cross-Foot Metric</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Total of all debit entries across the 12 events must exactly match total credit entries (₹2,08,500).
                    </p>
                  </div>

                  {/* Gauge Numbers */}
                  <div className="flex items-center gap-4 text-center">
                    <div className="bg-white/90 px-4 py-2 rounded-lg border border-slate-200">
                      <div className="text-[10px] uppercase font-bold text-slate-500">Total Debits</div>
                      <div className="text-lg font-mono font-bold text-slate-900">
                        ₹{journalMetrics.totalDebit.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="text-slate-400 font-bold text-xl">=</div>
                    <div className="bg-white/90 px-4 py-2 rounded-lg border border-slate-200">
                      <div className="text-[10px] uppercase font-bold text-slate-500">Total Credits</div>
                      <div className="text-lg font-mono font-bold text-slate-900">
                        ₹{journalMetrics.totalCredit.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 12-Event Journal Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-semibold text-sm sm:text-base">
                      General Journal Register (September 2026)
                    </h3>
                  </div>
                  <span className="text-xs text-slate-300">
                    12 Synchronized Commercial Transactions
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200 text-[11px] tracking-wider">
                        <th className="py-3 px-3 w-16">Doc</th>
                        <th className="py-3 px-3 w-20">Date</th>
                        <th className="py-3 px-4 min-w-[200px]">Commercial Event</th>
                        <th className="py-3 px-4 min-w-[210px]">Debit Account (Dr)</th>
                        <th className="py-3 px-4 min-w-[210px]">Credit Account (Cr)</th>
                        <th className="py-3 px-3 w-28 text-right">Amount (₹)</th>
                        <th className="py-3 px-4 min-w-[180px]">Audit Evidence Reference</th>
                        <th className="py-3 px-3 w-24 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {state.rows.map((row) => {
                        const issue = rowIssues[row.id];
                        return (
                          <React.Fragment key={row.id}>
                            <tr className={`hover:bg-slate-50/80 transition-colors ${issue ? 'bg-rose-50/40' : ''}`}>
                              {/* Doc ID */}
                              <td className="py-3 px-3 font-mono font-bold text-indigo-700">
                                {row.docId}
                              </td>

                              {/* Date */}
                              <td className="py-3 px-3 text-slate-600 font-medium whitespace-nowrap">
                                {row.date}
                              </td>

                              {/* Event */}
                              <td className="py-3 px-4 text-slate-800 font-medium">
                                {row.sourceEvent}
                              </td>

                              {/* Debit Account */}
                              <td className="py-2 px-3">
                                <select
                                  value={row.debitAccount}
                                  onChange={(e) => handleUpdateRow(row.id, 'debitAccount', e.target.value)}
                                  className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-md py-1.5 px-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                >
                                  <option value="">-- Select Debit Account --</option>
                                  {CHART_OF_ACCOUNTS.map((acc) => (
                                    <option key={acc.code} value={acc.name}>
                                      {acc.code} • {acc.name} ({acc.type})
                                    </option>
                                  ))}
                                </select>
                              </td>

                              {/* Credit Account */}
                              <td className="py-2 px-3">
                                <select
                                  value={row.creditAccount}
                                  onChange={(e) => handleUpdateRow(row.id, 'creditAccount', e.target.value)}
                                  className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-md py-1.5 px-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                >
                                  <option value="">-- Select Credit Account --</option>
                                  {CHART_OF_ACCOUNTS.map((acc) => (
                                    <option key={acc.code} value={acc.name}>
                                      {acc.code} • {acc.name} ({acc.type})
                                    </option>
                                  ))}
                                </select>
                              </td>

                              {/* Amount */}
                              <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                                ₹{Number(row.amount).toLocaleString('en-IN')}
                              </td>

                              {/* Evidence Reference */}
                              <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                                {row.evidenceType}
                              </td>

                              {/* Status */}
                              <td className="py-3 px-3 text-center">
                                {issue ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                                    <AlertTriangle className="w-3 h-3" />
                                    Flagged
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Verified
                                  </span>
                                )}
                              </td>
                            </tr>

                            {/* Inline Error Warning Bar if trap triggered */}
                            {issue && (
                              <tr className="bg-rose-50 border-t-0">
                                <td colSpan={8} className="py-1.5 px-4 text-rose-700 font-medium text-xs flex items-center gap-2">
                                  <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
                                  <span>{issue}</span>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TaskCard>

          {/* TASK 04: Resolve Evidence Exceptions (S05-T04) */}
          <TaskCard
            taskId="S05-T04"
            taskNumber="TASK 04"
            title="Resolve Evidence Exceptions"
            instruction="Document accounting rationale for accruals, advances, and capitalization, then complete individual sign-off."
            learningTakeaway="Document non-routine accounting treatments (advances, capitalization) for statutory audit verification."
            whyMatters="Statutory auditors require explicit documentation for non-routine accounting treatments (such as deferring revenue on customer advances or capitalizing technology hardware) to verify compliance with revenue recognition standards (IFRS 15 / Ind AS 115)."
            statusText={countWords(state.exceptionsNotes) >= 20 ? 'Exceptions Documented' : 'Rationale Incomplete'}
            isActive={activeTaskId === 'S05-T04'}
            onSelectTask={() => setActiveTaskId('S05-T04')}
          >
            <div className="space-y-6">
              {/* Exceptions & Rationale Note */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-indigo-600" />
                    <h4 className="font-bold text-sm text-slate-900">
                      Accounting Rationale & Exceptions Documentation
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {countWords(state.exceptionsNotes)} words
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Provide formal accounting reasoning for non-routine transactions: explain why customer advance (A09) is
                  recorded as a liability rather than revenue, why equipment (A12) is capitalized instead of expensed, and
                  how receivable collection (A05) is handled under accrual principles.
                </p>
                <textarea
                  rows={4}
                  value={state.exceptionsNotes}
                  onChange={(e) => updateState((prev) => ({ ...prev, exceptionsNotes: e.target.value }))}
                  placeholder="Record commercial accounting reasoning, citation of doc IDs, and accrual timing logic..."
                  className="w-full text-xs font-sans p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                />
              </div>

              {/* Portfolio Governance & Autonomous Boundary Sign-off */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-bold text-base text-slate-900">
                      Portfolio Governance & Audit Trail
                    </h4>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    Rubric Standard: 10 Points Target
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Student Professional Identifier
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
                      className="w-full text-xs font-mono p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Approved File Versioning Standard
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
                      className="w-full text-xs font-mono p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500">Must match pattern: StudentID_S05_v01</span>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Attributable Individual Contribution</span>
                      <span className="font-mono text-slate-400">
                        {countWords(state.governance.contributionSummary)} words
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={state.governance.contributionSummary}
                      onChange={(e) =>
                        updateState((prev) => ({
                          ...prev,
                          governance: { ...prev.governance, contributionSummary: e.target.value },
                        }))
                      }
                      placeholder="Detail your specific entries verified, reconciliation checks performed, and ledger balancing calculations..."
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Peer Review & Audit Correction</span>
                      <span className="font-mono text-slate-400">
                        {countWords(state.governance.peerCorrection)} words
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={state.governance.peerCorrection}
                      onChange={(e) =>
                        updateState((prev) => ({
                          ...prev,
                          governance: { ...prev.governance, peerCorrection: e.target.value },
                        }))
                      }
                      placeholder="Note any colleague entries reviewed or corrections made (e.g. correcting customer advance from revenue to liability)..."
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Autonomous Work Boundary Declaration</span>
                      <span className="font-mono text-slate-400">
                        {countWords(state.governance.professionalBoundary)} words
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={state.governance.professionalBoundary}
                      onChange={(e) =>
                        updateState((prev) => ({
                          ...prev,
                          governance: { ...prev.governance, professionalBoundary: e.target.value },
                        }))
                      }
                      placeholder="State your professional boundary: e.g. prepared independently from source documents without external answers..."
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Evaluation Action */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handleRunReview}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Validate With Review Engine
                  </button>

                  <div className="text-xs text-slate-500">
                    Evaluates Overview, Concept Explanations, 12 Case A Rows, Double-Entry Balance, and Governance.
                  </div>
                </div>

                {/* Live Review Report Modal / Drawer */}
                {reviewReport && (
                  <div className="mt-6 p-5 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        {reviewReport.hasErrors ? (
                          <AlertTriangle className="w-5 h-5 text-amber-400" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        )}
                        <span className="font-bold text-sm">{reviewReport.overallSummary}</span>
                      </div>
                      <div className="text-xs font-mono text-slate-300">
                        Checks Passed: <span className="text-emerald-400 font-bold">{reviewReport.passedChecks}</span> / {reviewReport.totalChecks} ({reviewReport.overallStatus})
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      {Object.entries(reviewReport.stages).map(([stageName, stageData]) => (
                        <div
                          key={stageName}
                          className={`p-3 rounded-lg border ${
                            stageData.status === 'reviewed'
                              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                              : stageData.status === 'in_progress'
                              ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                              : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                          }`}
                        >
                          <div className="font-bold uppercase text-[10px] tracking-wider mb-1">
                            {stageName}: {stageData.title}
                          </div>
                          <div className="text-xs">
                            {stageData.passedCount}/{stageData.totalCount} passed
                          </div>
                          <div className="text-[10px] mt-1 font-mono font-semibold">{stageData.status}</div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Detailed Verification Findings
                      </div>
                      <div className="space-y-1 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                        {Object.values(reviewReport.stages).flatMap((st) => st.checks).map((chk) => (
                          <div
                            key={chk.id}
                            className="flex items-start justify-between gap-2 p-2 rounded bg-slate-800/60 text-[11px]"
                          >
                            <div className="flex items-center gap-2">
                              {chk.passed ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                              ) : (
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                              )}
                              <span className={chk.passed ? 'text-slate-200' : 'text-amber-200'}>
                                {chk.title}
                              </span>
                            </div>
                            <span className="font-mono text-[10px] text-slate-400 whitespace-nowrap">
                              {chk.studentValue || (chk.passed ? 'Verified' : 'Pending')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 10-Point Drive 3.0 Assessment Rubric */}
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                    Approved Drive 3.0 Assessment Rubric (10 Marks Total)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {S05_RUBRIC.map((r) => (
                      <div key={r.name} className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                          <span>{r.name}</span>
                          <span className="font-mono text-indigo-700">{r.points} pts</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{r.evidence}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
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
            {currentStepIdx === WIZARD_STEPS.length - 1 ? 'Journal Complete ✓' : 'Save & Continue →'}
          </button>
        </footer>
      </div>
    </div>
  );
}
