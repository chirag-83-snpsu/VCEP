'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  S06_STORAGE_KEY,
  OPENING_BANK_DEBIT,
  OPENING_CAPITAL_CREDIT,
  ERROR_AMOUNT_INR,
  TARGET_TRIAL_BALANCE_TOTAL,
  DRAFT_TRIAL_BALANCE_TOTAL,
  TARGET_REVENUE,
  TARGET_TOTAL_EXPENSES,
  TARGET_NET_PROFIT,
  TARGET_ASSETS,
  TARGET_LIABILITIES,
  TARGET_EQUITY,
  INITIAL_S06_STATE,
  INITIAL_CORRECTION_JOURNAL,
  S06_RUBRIC,
  calculateFinancialStatements,
  countWords,
  loadSession06State,
  saveSession06State,
  type Session06WorkstationState,
  type CorrectionJournalEntry,
  type CloseChecklistItem,
} from './session-06-ledger-data.ts';
import { evaluateSession06 } from '../../../lib/review-engine/session-rules/session-06.ts';
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
  Lock,
  Eye,
  FileSpreadsheet,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Session06LedgerJourneyProps {
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
            <span>{whyOpen ? 'Hide close principle' : 'Why this matters'}</span>
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

export function Session06LedgerJourney({
  onUpdateDraft,
}: Session06LedgerJourneyProps) {
  const [state, setState] = useState<Session06WorkstationState>(INITIAL_S06_STATE);
  const [reviewReport, setReviewReport] = useState<SessionReviewReport | null>(null);
  const [activeLedgerTab, setActiveLedgerTab] = useState<string>('bank');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string>('S06-T01');

  const WIZARD_STEPS = [
    { id: 'S06-T01' as const, num: 1, label: 'TASK 01: Post to the Ledger', short: '1. Ledger' },
    { id: 'S06-T02' as const, num: 2, label: 'TASK 02: Correct the Posting Error', short: '2. Correct' },
    { id: 'S06-T03' as const, num: 3, label: 'TASK 03: Prepare Closing Statements', short: '3. Close' },
    { id: 'S06-T04' as const, num: 4, label: 'TASK 04: Complete Close Review', short: '4. Review' },
  ];

  const currentStepIdx = useMemo(() => {
    return Math.max(0, WIZARD_STEPS.findIndex((s) => s.id === activeTaskId));
  }, [activeTaskId]);

  // Hydrate from persistence on mount
  useEffect(() => {
    const loaded = loadSession06State();
    setState(loaded);
    if (onUpdateDraft) {
      onUpdateDraft('concept:explain', loaded.undetectedErrors);
      onUpdateDraft('team:contribution', loaded.governance.contributionSummary);
      onUpdateDraft('team:judgement', loaded.governance.professionalBoundary);
    }
  }, []);

  // Update state helper with auto-persistence and draft sync
  const updateState = (updater: (prev: Session06WorkstationState) => Session06WorkstationState) => {
    setState((prev) => {
      const next = updater(prev);
      saveSession06State(next);

      if (onUpdateDraft) {
        onUpdateDraft('concept:explain', next.undetectedErrors);
        onUpdateDraft('team:contribution', next.governance.contributionSummary);
        onUpdateDraft('team:judgement', next.governance.professionalBoundary);
      }

      return next;
    });
  };

  // Financial calculations based on correction application
  const fin = useMemo(() => {
    return calculateFinancialStatements(state.correctionJournal.isApplied);
  }, [state.correctionJournal.isApplied]);

  // Validation warnings on correction journal
  const journalWarning = useMemo(() => {
    const debit = (state.correctionJournal.debitAccount || '').toLowerCase();
    const credit = (state.correctionJournal.creditAccount || '').toLowerCase();
    if (debit.includes('bank') || credit.includes('bank') || debit.includes('cash') || credit.includes('cash')) {
      return 'Critical Governance Error: Do NOT modify Bank cash! Cash was already correctly posted in A05.';
    }
    if (!state.correctionJournal.isApplied) {
      return 'Warning: Uncorrected error active! Service Revenue and Receivables remain overstated by ₹35,000.';
    }
    return null;
  }, [state.correctionJournal]);

  // Handlers
  const handleToggleCorrection = (applied: boolean) => {
    updateState((prev) => ({
      ...prev,
      correctionJournal: {
        ...prev.correctionJournal,
        isApplied: applied,
      },
    }));
  };

  const handleToggleChecklist = (id: string) => {
    updateState((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item) =>
        item.id === id ? { ...item, verified: !item.verified } : item
      ),
    }));
  };

  const handleResetToApprovedState = () => {
    if (window.confirm('Reset Month-End Close workbench to audit-approved state?')) {
      updateState((prev) => ({
        ...prev,
        correctionJournal: INITIAL_CORRECTION_JOURNAL,
        checklist: prev.checklist.map((c) => ({ ...c, verified: true })),
      }));
    }
  };

  const handleRunReview = () => {
    const draft: Record<string, string> = {
      'concept:explain': state.undetectedErrors,
      'work-prompt:0': state.undetectedErrors,
      'team:contribution': state.governance.contributionSummary,
      'team:judgement': state.governance.professionalBoundary,
    };
    const report = evaluateSession06({
      sessionId: 6,
      draft,
      workstationData: state,
    });
    setReviewReport(report);
  };

  const handleCopyCloseJSON = () => {
    const jsonStr = JSON.stringify(
      {
        session: 'VCEP-S06-Ledger-and-Month-End-Close',
        studentId: state.governance.studentId,
        fileVersion: state.governance.fileVersion,
        errorAmount: ERROR_AMOUNT_INR,
        correctionApplied: state.correctionJournal.isApplied,
        correctionJournal: state.correctionJournal,
        closingTrialBalance: {
          totalDebits: fin.totalDebits,
          totalCredits: fin.totalCredits,
          balanced: fin.isTrialBalanceEqual,
          rows: fin.trialBalanceRows,
        },
        financialStatements: {
          revenue: fin.revenue,
          expenses: fin.totalExpenses,
          netProfit: fin.netProfit,
          totalAssets: fin.totalAssets,
          totalLiabilities: fin.totalLiabilities,
          totalEquity: fin.totalEquity,
          equationBalanced: fin.equationBalanced,
        },
        undetectedErrors: state.undetectedErrors,
        checklist: state.checklist,
        governance: state.governance,
      },
      null,
      2
    );

    navigator.clipboard.writeText(jsonStr).then(() => {
      setCopiedNotification('Month-End Close package copied to clipboard!');
      setTimeout(() => setCopiedNotification(null), 3500);
    });
  };

  return (
    <div className="vcep-s06-workstation bg-slate-50 min-h-screen text-slate-800 pb-20">
      {/* Session Hero Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-900/40 px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Case A Month-End Close
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <AlertOctagon className="w-3.5 h-3.5" />
                ₹35,000 Misclassification Audit
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                <Scale className="w-3.5 h-3.5" />
                Closing TB: ₹2,18,000
              </span>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>Auto-saved to LocalStation:</span>
              <span className="font-mono text-emerald-400 font-semibold">{state.lastSaved || 'Synchronized'}</span>
            </div>
          </div>

          <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2">
              Close the Books with Confidence
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Step into the shoes of a Senior General Ledger Accountant. Investigate a deliberate ₹35,000 revenue
              misposting on an existing receivable collection, verify why an agreeing trial balance masks errors,
              execute a non-cash correction journal, and produce auditable month-end financial statements.
            </p>
          </div>

          {/* Quick Jump Links */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap gap-3">
            <a
              href="#vcep-area-investigate"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              1. Investigate the Ledger Error
            </a>
            <a
              href="#vcep-area-close"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
            >
              <CheckSquare className="w-4 h-4 text-white" />
              2. Complete the Month-End Close
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="#s06-t01"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 transition-colors"
            >
              <span>Task 01: Post to Ledger</span>
            </a>
            <a
              href="#s06-t02"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 transition-colors"
            >
              <span>Task 02: Correct Error</span>
            </a>
            <a
              href="#s06-t03"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 transition-colors"
            >
              <span>Task 03: Closing Statements</span>
            </a>
            <a
              href="#s06-t04"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 transition-colors"
            >
              <span>Task 04: Close Review</span>
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

      {/* Toast Notification */}
      {copiedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-500/50 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{copiedNotification}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-12">
        {/* ========================================================================= */}
        {/* HEADING 1: Investigate the Ledger Error                                   */}
        {/* ========================================================================= */}
        <section id="vcep-area-investigate" className="scroll-mt-24 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-amber-600">Part 01</span>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <AlertOctagon className="w-6 h-6 text-amber-600" />
                  Investigate the Ledger Error
                </h2>
              </div>
              <div className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-500" />
                <span>Audit Finding: Bank posting was correct; Revenue was overstated by ₹35,000.</span>
              </div>
            </div>
          </div>

          {/* TASK 01: Post to the Ledger (S06-T01) */}
          <TaskCard
            taskId="S06-T01"
            taskNumber="TASK 01"
            title="Post to the Ledger"
            instruction="Audit Case A general ledger accounts and inspect debit and credit entries leading to unadjusted balances."
            learningTakeaway="General ledgers organize chronological journal entries into distinct account balances for period-end closing."
            whyMatters="The general ledger classifies commercial transactions into individual account balances. Reviewing each T-account allows auditors to trace the origin of every balance back to authentic source vouchers before closing the period."
            statusText="8 Accounts Verified"
            isActive={activeTaskId === 'S06-T01'}
            onSelectTask={() => setActiveTaskId('S06-T01')}
          >
            <div className="space-y-6">
              {/* Audit Discovery Briefing Card */}
              <div className="bg-slate-50 rounded-xl p-5 border border-amber-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      Audit Discovery: Doc A05 Collection Misclassified as New Revenue
                    </h4>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-semibold">
                    Deliberate ₹35,000 Error
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-rose-50/70 p-4 rounded-lg border border-rose-200/80 space-y-2">
                    <div className="font-bold text-rose-900 uppercase tracking-wide flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Erroneous Draft Ledger Posting
                    </div>
                    <p className="text-rose-950 leading-relaxed">
                      On Sep 10, Apex Retail transferred ₹35,000 against Tax Invoice `INV-2026-101` (Doc A01).
                      The draft clerk entered: <code className="bg-rose-200/70 px-1.5 py-0.5 rounded font-mono font-semibold">Dr Bank ₹35,000 | Cr Service Revenue ₹35,000</code>.
                    </p>
                    <div className="text-[11px] text-rose-800 font-semibold">
                      Consequence: Service Revenue is overstated at ₹1,35,000; Trade Receivables remains un-credited at ₹60,000.
                    </div>
                  </div>

                  <div className="bg-emerald-50/70 p-4 rounded-lg border border-emerald-200/80 space-y-2">
                    <div className="font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Audit-Approved Correction Entry
                    </div>
                    <p className="text-emerald-950 leading-relaxed">
                      Bank cash is already correctly debited with ₹35,000. Reversal entry must:
                      <code className="bg-emerald-200/70 px-1.5 py-0.5 rounded font-mono font-semibold">Dr Service Revenue ₹35,000 | Cr Accounts Receivable ₹35,000</code>.
                    </p>
                    <div className="text-[11px] text-emerald-800 font-semibold">
                      Crucial Rule: Bank Cash is 100% UNCHANGED. Cash was already posted correctly.
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Posted Ledger Explorer (8 T-Accounts) */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                    <h4 className="font-semibold text-sm sm:text-base">
                      General Ledger T-Accounts Explorer (Case A Postings)
                    </h4>
                  </div>
                  <span className="text-xs text-slate-300">
                    Select an account to audit individual postings & ending balances
                  </span>
                </div>

                {/* Account Selector Tabs */}
                <div className="bg-slate-100 p-2 border-b border-slate-200 flex gap-2 overflow-x-auto scrollbar-thin">
                  {[
                    { id: 'bank', name: 'Bank (Cash)' },
                    { id: 'ar', name: 'Trade Receivables' },
                    { id: 'revenue', name: 'Service Revenue' },
                    { id: 'expenses', name: 'Operating Expenses' },
                    { id: 'wages_pay', name: 'Wages Payable' },
                    { id: 'cust_adv', name: 'Customer Advances' },
                    { id: 'equipment', name: 'Equipment Asset' },
                    { id: 'capital', name: 'Owner Capital' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveLedgerTab(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        activeLedgerTab === tab.id
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200/70'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>

                {/* T-Account Inspector Pane */}
                <div className="p-6">
                  {activeLedgerTab === 'bank' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div>
                          <h4 className="font-bold text-slate-900 text-base">Account: Bank (Current Asset)</h4>
                          <p className="text-xs text-slate-500">Corporate checking account at State Bank</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Reconciled Ending Balance</span>
                          <div className="text-lg font-mono font-bold text-emerald-700">₹1,41,500 Dr</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <div className="font-bold text-slate-700 uppercase mb-2 border-b pb-1">Debits (Inflows)</div>
                          <div className="space-y-1">
                            <div className="flex justify-between"><span>Sep 01 · Opening Capital</span><span>₹1,00,000</span></div>
                            <div className="flex justify-between"><span>Sep 04 · A02 Cash Service</span><span>₹40,000</span></div>
                            <div className="flex justify-between text-indigo-700 font-semibold"><span>Sep 10 · A05 Collection</span><span>₹35,000</span></div>
                            <div className="flex justify-between"><span>Sep 24 · A09 Customer Advance</span><span>₹15,000</span></div>
                          </div>
                          <div className="border-t mt-3 pt-1 flex justify-between font-bold text-slate-900">
                            <span>Total Debits</span><span>₹1,90,000</span>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <div className="font-bold text-slate-700 uppercase mb-2 border-b pb-1">Credits (Outflows)</div>
                          <div className="space-y-1">
                            <div className="flex justify-between"><span>Sep 05 · A03 Rent</span><span>₹12,000</span></div>
                            <div className="flex justify-between"><span>Sep 06 · A04 Software</span><span>₹6,000</span></div>
                            <div className="flex justify-between"><span>Sep 12 · A06 Contractor</span><span>₹18,000</span></div>
                            <div className="flex justify-between"><span>Sep 22 · A08 Wage Payment</span><span>₹4,000</span></div>
                            <div className="flex justify-between"><span>Sep 26 · A10 Advance Refund</span><span>₹3,000</span></div>
                            <div className="flex justify-between"><span>Sep 28 · A11 Bank Charges</span><span>₹500</span></div>
                            <div className="flex justify-between"><span>Sep 29 · A12 Equipment</span><span>₹5,000</span></div>
                          </div>
                          <div className="border-t mt-3 pt-1 flex justify-between font-bold text-slate-900">
                            <span>Total Credits</span><span>₹48,500</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500 bg-indigo-50/60 p-2.5 rounded-lg border border-indigo-100">
                        <strong>Audit Proof:</strong> Bank debits (₹1,90,000) − Bank credits (₹48,500) = ₹1,41,500 Debit balance. Cash is 100% correct and must NOT be changed.
                      </div>
                    </div>
                  )}

                  {activeLedgerTab === 'ar' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div>
                          <h4 className="font-bold text-slate-900 text-base">Account: Trade Receivables (Current Asset)</h4>
                          <p className="text-xs text-slate-500">Commercial customer credit ledger (Apex Retail)</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Corrected Ending Balance</span>
                          <div className="text-lg font-mono font-bold text-emerald-700">₹25,000 Dr</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <div className="font-bold text-slate-700 uppercase mb-2 border-b pb-1">Debits (Invoices Issued)</div>
                          <div className="flex justify-between"><span>Sep 02 · A01 Invoice INV-101</span><span>₹60,000</span></div>
                          <div className="border-t mt-3 pt-1 flex justify-between font-bold text-slate-900">
                            <span>Total Debits</span><span>₹60,000</span>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <div className="font-bold text-slate-700 uppercase mb-2 border-b pb-1">Credits (Collections)</div>
                          {state.correctionJournal.isApplied ? (
                            <div className="flex justify-between text-emerald-700 font-semibold">
                              <span>Sep 10 · A05 Correction (Relieved)</span><span>₹35,000</span>
                            </div>
                          ) : (
                            <div className="text-rose-600 italic">None (Omitted in Draft Ledger!)</div>
                          )}
                          <div className="border-t mt-3 pt-1 flex justify-between font-bold text-slate-900">
                            <span>Total Credits</span><span>{state.correctionJournal.isApplied ? '₹35,000' : '₹0'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeLedgerTab === 'revenue' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div>
                          <h4 className="font-bold text-slate-900 text-base">Account: Service Revenue (Revenue)</h4>
                          <p className="text-xs text-slate-500">Earned commercial service revenue for September</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Corrected Revenue</span>
                          <div className="text-lg font-mono font-bold text-emerald-700">₹1,00,000 Cr</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <div className="font-bold text-slate-700 uppercase mb-2 border-b pb-1">Debits (Reversals)</div>
                          {state.correctionJournal.isApplied ? (
                            <div className="flex justify-between text-emerald-700 font-semibold">
                              <span>Sep 30 · Correction Journal Reversal</span><span>₹35,000</span>
                            </div>
                          ) : (
                            <div className="text-slate-400 italic">None</div>
                          )}
                          <div className="border-t mt-3 pt-1 flex justify-between font-bold text-slate-900">
                            <span>Total Debits</span><span>{state.correctionJournal.isApplied ? '₹35,000' : '₹0'}</span>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <div className="font-bold text-slate-700 uppercase mb-2 border-b pb-1">Credits (Revenue Recorded)</div>
                          <div className="space-y-1">
                            <div className="flex justify-between"><span>Sep 02 · A01 Credit Service</span><span>₹60,000</span></div>
                            <div className="flex justify-between"><span>Sep 04 · A02 Cash Service</span><span>₹40,000</span></div>
                            {!state.correctionJournal.isApplied && (
                              <div className="flex justify-between text-rose-600 font-semibold">
                                <span>Sep 10 · A05 Misposted Collection</span><span>₹35,000</span>
                              </div>
                            )}
                          </div>
                          <div className="border-t mt-3 pt-1 flex justify-between font-bold text-slate-900">
                            <span>Total Credits</span><span>{state.correctionJournal.isApplied ? '₹1,00,000' : '₹1,35,000'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeLedgerTab === 'expenses' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div>
                          <h4 className="font-bold text-slate-900 text-base">Operating Expenses (Combined Schedule)</h4>
                          <p className="text-xs text-slate-500">Rent, software, contractor, wages, and bank charges</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Total Expenses</span>
                          <div className="text-lg font-mono font-bold text-slate-900">₹46,500 Dr</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs font-mono">
                        <div className="p-3 bg-slate-50 rounded-lg border">
                          <div className="text-slate-500">Rent Expense</div>
                          <div className="font-bold text-slate-900 mt-1">₹12,000</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border">
                          <div className="text-slate-500">Software Expense</div>
                          <div className="font-bold text-slate-900 mt-1">₹6,000</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border">
                          <div className="text-slate-500">Contractor Expense</div>
                          <div className="font-bold text-slate-900 mt-1">₹18,000</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border">
                          <div className="text-slate-500">Wage Expense</div>
                          <div className="font-bold text-slate-900 mt-1">₹10,000</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border">
                          <div className="text-slate-500">Bank Charges</div>
                          <div className="font-bold text-slate-900 mt-1">₹500</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {['wages_pay', 'cust_adv', 'equipment', 'capital'].includes(activeLedgerTab) && (
                    <div className="p-4 bg-slate-50 rounded-lg border text-xs space-y-2">
                      <div className="font-bold text-slate-800">
                        {activeLedgerTab === 'wages_pay' && 'Wages Payable (Liability): Balance ₹6,000 Cr (A07 Accrual ₹10,000 Cr − A08 Disbursement ₹4,000 Dr)'}
                        {activeLedgerTab === 'cust_adv' && 'Customer Advances (Liability): Balance ₹12,000 Cr (A09 Retainer ₹15,000 Cr − A10 Refund ₹3,000 Dr)'}
                        {activeLedgerTab === 'equipment' && 'Equipment Asset (Capitalized): Balance ₹5,000 Dr (A12 Test Laptop Purchase)'}
                        {activeLedgerTab === 'capital' && 'Owner Capital (Equity): Balance ₹1,00,000 Cr (Opening Founder Equity)'}
                      </div>
                      <p className="text-slate-600">
                        These balance sheet balances are reconciled directly against source vouchers and verified in month-end close.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TaskCard>

          {/* TASK 02: Correct the Posting Error (S06-T02) */}
          <TaskCard
            taskId="S06-T02"
            taskNumber="TASK 02"
            title="Correct the Posting Error"
            instruction="Repair the deliberate ₹35,000 posting error where customer collection was misclassified as revenue instead of receivables."
            learningTakeaway="Correct posting errors by reversing excess revenue and relieving receivables—bank cash remains 100% unchanged."
            whyMatters="Posting a customer collection to revenue doubles reported income and leaves an artificial asset on the books. The correction journal must reverse the excess revenue and relieve receivables without touching bank cash, which was already posted correctly."
            statusText={state.correctionJournal.isApplied ? 'Correction Active (₹35k Reversal)' : 'Uncorrected Error Active'}
            isActive={activeTaskId === 'S06-T02'}
            onSelectTask={() => setActiveTaskId('S06-T02')}
          >
            <div className="space-y-6">
              {/* Correction Journal Workbench */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-indigo-600" />
                    <h4 className="font-bold text-sm sm:text-base text-slate-900">
                      Non-Cash Correction Journal Entry
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleCorrection(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        state.correctionJournal.isApplied
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Apply Correction Journal (Audit Approved)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleCorrection(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        !state.correctionJournal.isApplied
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <AlertOctagon className="w-3.5 h-3.5" />
                      View Uncorrected Error State
                    </button>
                  </div>
                </div>

                {journalWarning && (
                  <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 font-medium">
                    <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>{journalWarning}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Debit Account (Dr)</label>
                    <input
                      type="text"
                      value={state.correctionJournal.debitAccount}
                      onChange={(e) =>
                        updateState((prev) => ({
                          ...prev,
                          correctionJournal: { ...prev.correctionJournal, debitAccount: e.target.value },
                        }))
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-semibold bg-white"
                    />
                    <span className="text-[10px] text-slate-500">Reverses premature revenue</span>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Credit Account (Cr)</label>
                    <input
                      type="text"
                      value={state.correctionJournal.creditAccount}
                      onChange={(e) =>
                        updateState((prev) => ({
                          ...prev,
                          correctionJournal: { ...prev.correctionJournal, creditAccount: e.target.value },
                        }))
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-semibold bg-white"
                    />
                    <span className="text-[10px] text-slate-500">Relieves Trade Receivables</span>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Correction Amount (INR)</label>
                    <input
                      type="number"
                      value={state.correctionJournal.amount}
                      onChange={(e) =>
                        updateState((prev) => ({
                          ...prev,
                          correctionJournal: { ...prev.correctionJournal, amount: Number(e.target.value) },
                        }))
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono font-bold bg-white"
                    />
                    <span className="text-[10px] text-slate-500">Must equal ₹35,000</span>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Source Voucher Reference</label>
                    <input
                      type="text"
                      value={state.correctionJournal.sourceDoc}
                      onChange={(e) =>
                        updateState((prev) => ({
                          ...prev,
                          correctionJournal: { ...prev.correctionJournal, sourceDoc: e.target.value },
                        }))
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono bg-white"
                    />
                    <span className="text-[10px] text-slate-500">Audit citation: Doc A05</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-xs">
                    Auditor Narrative & Cash Invariance Explanation
                  </label>
                  <textarea
                    rows={2}
                    value={state.correctionJournal.explanation}
                    onChange={(e) =>
                      updateState((prev) => ({
                        ...prev,
                        correctionJournal: { ...prev.correctionJournal, explanation: e.target.value },
                      }))
                    }
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>
              </div>
            </div>
          </TaskCard>
        </section>

        {/* ========================================================================= */}
        {/* HEADING 2: Complete the Month-End Close                                   */}
        {/* ========================================================================= */}
        <section id="vcep-area-close" className="scroll-mt-24 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-600">Part 02</span>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <CheckSquare className="w-6 h-6 text-emerald-600" />
                  Complete the Month-End Close
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetToApprovedState}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Approved State
                </button>
                <button
                  type="button"
                  onClick={handleCopyCloseJSON}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Export Close Package JSON
                </button>
              </div>
            </div>
          </div>

          {/* TASK 03: Prepare Closing Statements (S06-T03) */}
          <TaskCard
            taskId="S06-T03"
            taskNumber="TASK 03"
            title="Prepare Closing Statements"
            instruction="Generate the closing trial balance (₹2,18,000), compute September net profit, and verify the balance sheet equation."
            learningTakeaway="A balanced trial balance proves double-entry equality before computing net profit and the balance sheet."
            whyMatters="A reconciled trial balance proves mathematical equality across accounts. From here, financial statements are drafted to report accurate operational performance (net profit) and financial position (assets = liabilities + equity) to management and stakeholders."
            statusText={fin.isTargetBalance ? 'Balanced (₹2,18,000)' : 'Uncorrected (₹2,53,000)'}
            isActive={activeTaskId === 'S06-T03'}
            onSelectTask={() => setActiveTaskId('S06-T03')}
          >
            <div className="space-y-6">
              {/* Real-time Closing Trial Balance Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-emerald-400" />
                    <h4 className="font-semibold text-sm sm:text-base">
                      Closing Trial Balance as of September 30, 2026
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold ${
                        fin.isTargetBalance
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {fin.isTargetBalance ? 'Reconciled Target: ₹2,18,000' : 'Uncorrected Balance: ₹2,53,000'}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200 text-[11px] tracking-wider">
                        <th className="py-3 px-4">Account Title</th>
                        <th className="py-3 px-3 w-28">Classification</th>
                        <th className="py-3 px-4 w-36 text-right">Debit Balance (₹)</th>
                        <th className="py-3 px-4 w-36 text-right">Credit Balance (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {fin.trialBalanceRows.map((row) => (
                        <tr key={row.account} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                            <span>{row.account}</span>
                            {row.account === 'Trade Receivables' && !state.correctionJournal.isApplied && (
                              <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-mono font-bold">
                                Overstated (+₹35k)
                              </span>
                            )}
                            {row.account === 'Service Revenue' && !state.correctionJournal.isApplied && (
                              <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-mono font-bold">
                                Overstated (+₹35k)
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500">{row.type}</td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-800">
                            {row.debit > 0 ? `₹${row.debit.toLocaleString('en-IN')}` : '—'}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-800">
                            {row.credit > 0 ? `₹${row.credit.toLocaleString('en-IN')}` : '—'}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-100/80 font-bold border-t-2 border-slate-300 text-xs">
                        <td colSpan={2} className="py-3 px-4 uppercase text-slate-700">
                          Trial Balance Cross-Foot Totals
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-950 text-sm">
                          ₹{fin.totalDebits.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-950 text-sm">
                          ₹{fin.totalCredits.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Statements: Dual Cards (Income Statement & Balance Sheet Equation) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Income Statement */}
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-bold text-slate-900 text-sm">September Income Statement</h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-700">P&L Summary</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-dashed border-slate-200">
                      <span className="text-slate-600">Service Revenue</span>
                      <span className="font-mono font-bold text-slate-900">₹{fin.revenue.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-dashed border-slate-200">
                      <span className="text-slate-600">Operating Expenses (Combined)</span>
                      <span className="font-mono font-bold text-rose-700">(₹{fin.totalExpenses.toLocaleString('en-IN')})</span>
                    </div>
                    <div className="flex justify-between py-2 pt-3 border-t-2 border-slate-300 font-bold text-sm">
                      <span className="text-slate-900">September Net Profit</span>
                      <span className="font-mono text-emerald-700">₹{fin.netProfit.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Corrected profit is ₹53,500. Without the correction journal, profit was falsely reported as ₹88,500.
                  </p>
                </div>

                {/* Accounting Equation */}
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <Scale className="w-5 h-5 text-emerald-600" />
                      <h4 className="font-bold text-slate-900 text-sm">Balance Sheet Identity Proof</h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-700">Assets = Liab + Equity</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-dashed border-slate-200">
                      <span className="text-slate-600">Total Assets (Bank + AR + Equip)</span>
                      <span className="font-mono font-bold text-slate-900">₹{fin.totalAssets.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-dashed border-slate-200">
                      <span className="text-slate-600">Total Liabilities (Wages Pay + Cust Adv)</span>
                      <span className="font-mono font-bold text-slate-900">₹{fin.totalLiabilities.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-dashed border-slate-200">
                      <span className="text-slate-600">Total Equity (Capital + Net Profit)</span>
                      <span className="font-mono font-bold text-slate-900">₹{fin.totalEquity.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between py-2 pt-3 border-t-2 border-slate-300 font-bold text-sm">
                      <span className="text-slate-900">Liabilities + Equity</span>
                      <span className="font-mono text-emerald-700">₹{(fin.totalLiabilities + fin.totalEquity).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Perfect accounting identity: ₹1,71,500 Assets = ₹18,000 Liabilities + ₹1,53,500 Equity (Δ = ₹0).
                  </p>
                </div>
              </div>
            </div>
          </TaskCard>

          {/* TASK 04: Complete Close Review (S06-T04) */}
          <TaskCard
            taskId="S06-T04"
            taskNumber="TASK 04"
            title="Complete Close Review"
            instruction="Document undetectable error classes, complete the 4 month-end control gates, and execute portfolio sign-off."
            learningTakeaway="Understand error types a trial balance cannot detect, sign off internal controls, and document governance."
            whyMatters="Statutory audits require documentation demonstrating that accountants understand trial balance limitations. Control gate sign-offs provide evidence of supervisory review across cash, receivables, accruals, and synthetic vouchers."
            statusText={`${state.checklist.filter((c) => c.verified).length}/4 Controls Signed`}
            isActive={activeTaskId === 'S06-T04'}
            onSelectTask={() => setActiveTaskId('S06-T04')}
          >
            <div className="space-y-6">
              {/* Undetectable Errors Deep-Dive */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-indigo-600" />
                    <h4 className="font-bold text-sm text-slate-900">
                      Professional Judgment: Why a Balanced Trial Balance Does Not Prove Accuracy
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {countWords(state.undetectedErrors)} words
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Explain why debits equaling credits does not guarantee that financial statements are free of error.
                  Document at least two error classes that a trial balance cannot detect (e.g. Error of Principle,
                  Error of Omission, Error of Commission, or Compensating Errors).
                </p>
                <textarea
                  rows={4}
                  value={state.undetectedErrors}
                  onChange={(e) => updateState((prev) => ({ ...prev, undetectedErrors: e.target.value }))}
                  placeholder="Detail at least two undetectable errors with specific commercial examples..."
                  className="w-full text-xs font-sans p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                />
              </div>

              {/* Month-End Reviewer Checklist */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-bold text-base text-slate-900">
                      Month-End Review Sign-Off Checklist (4 Control Gates)
                    </h4>
                  </div>
                  <span className="text-xs font-mono text-emerald-700 font-semibold">
                    {state.checklist.filter((c) => c.verified).length}/4 Controls Signed Off
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {state.checklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleChecklist(item.id)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                        item.verified
                          ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={item.verified}
                        onChange={() => {}}
                        className="mt-1 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 pointer-events-none"
                      />
                      <div className="space-y-0.5">
                        <div className="font-bold text-xs">{item.title}</div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Portfolio Governance & Autonomous Boundary Sign-off */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-bold text-base text-slate-900">
                      Portfolio Governance & Close Sign-Off
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
                      className="w-full text-xs font-mono p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                      className="w-full text-xs font-mono p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-[10px] text-slate-500">Must match pattern: StudentID_S06_v01</span>
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
                      placeholder="Detail your specific month-end close duties, ledger entries verified, and trial balance calculations..."
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Peer Review & Close Sign-Off Correction</span>
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
                      placeholder="Note any colleague entries reviewed or peer feedback received (e.g. verifying cash invariance)..."
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                      placeholder="State your professional boundary: e.g. refusing to treat balanced trial balance totals as proof of accuracy..."
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Validation Action */}
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
                    Evaluates Overview, Learn, Case, Correction Journal, Trial Balance (₹218k), Net Profit (₹53.5k), and Governance.
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
                    {S06_RUBRIC.map((r) => (
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
            {currentStepIdx === WIZARD_STEPS.length - 1 ? 'Close Review Complete ✓' : 'Save & Continue →'}
          </button>
        </footer>
      </div>
    </div>
  );
}
