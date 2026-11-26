'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  S07_STORAGE_KEY,
  RAW_TOTAL_VOLUME_INR,
  TARGET_CLEAN_TOTAL_INR,
  TARGET_EXCEPTIONS_TOTAL_INR,
  TARGET_ASHA_TOTAL_INR,
  TARGET_BEACON_TOTAL_INR,
  CASE_B_RAW_RECEIPTS,
  INITIAL_CLEAN_ROWS,
  INITIAL_EXCEPTIONS,
  INITIAL_S07_STATE,
  S07_RUBRIC,
  countWords,
  loadSession07State,
  saveSession07State,
  type Session07WorkstationState,
  type RawReceiptItem,
  type CleanReceiptItem,
  type ExceptionItem,
} from './session-07-cleaning-data.ts';
import { evaluateSession07 } from '../../../lib/review-engine/session-rules/session-07.ts';
import type { SessionReviewReport } from '../../../lib/review-engine/types.ts';
import {
  FileSpreadsheet,
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
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Session07CleaningJourneyProps {
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
            <span>{whyOpen ? 'Hide data cleaning principle' : 'Why this matters'}</span>
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

export function Session07CleaningJourney({
  onUpdateDraft,
}: Session07CleaningJourneyProps) {
  const [state, setState] = useState<Session07WorkstationState>(INITIAL_S07_STATE);
  const [reviewReport, setReviewReport] = useState<SessionReviewReport | null>(null);
  const [activeTableView, setActiveTableView] = useState<'split' | 'clean' | 'exceptions'>('split');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string>('S07-T01');

  const WIZARD_STEPS = [
    { id: 'S07-T01' as const, num: 1, label: 'TASK 01: Inspect Raw Receipts', short: '1. Inspect' },
    { id: 'S07-T02' as const, num: 2, label: 'TASK 02: Find Data Issues', short: '2. Defects' },
    { id: 'S07-T03' as const, num: 3, label: 'TASK 03: Clean and Quarantine', short: '3. Clean' },
    { id: 'S07-T04' as const, num: 4, label: 'TASK 04: Verify the Totals', short: '4. Verify' },
  ];

  const currentStepIdx = useMemo(() => {
    return Math.max(0, WIZARD_STEPS.findIndex((s) => s.id === activeTaskId));
  }, [activeTaskId]);

  // Hydrate on mount
  useEffect(() => {
    const loaded = loadSession07State();
    setState(loaded);
    if (onUpdateDraft) {
      onUpdateDraft('concept:explain', loaded.formulaNotes);
      onUpdateDraft('team:contribution', loaded.governance.contributionSummary);
      onUpdateDraft('team:judgement', loaded.governance.professionalBoundary);
    }
  }, []);

  // Update state helper with auto-persistence and draft sync
  const updateState = (updater: (prev: Session07WorkstationState) => Session07WorkstationState) => {
    setState((prev) => {
      const next = updater(prev);
      saveSession07State(next);

      if (onUpdateDraft) {
        onUpdateDraft('concept:explain', next.formulaNotes);
        onUpdateDraft('team:contribution', next.governance.contributionSummary);
        onUpdateDraft('team:judgement', next.governance.professionalBoundary);
      }

      return next;
    });
  };

  // Metrics & Calculations
  const metrics = useMemo(() => {
    const cleanTotal = state.cleanRows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
    const exceptionsTotal = state.exceptions.reduce((sum, e) => {
      const v = Number(e.rawAmount);
      return isNaN(v) ? sum : sum + v;
    }, 0);

    const ashaTotal = state.cleanRows
      .filter((r) => r.customerStandard.toLowerCase() === 'asha')
      .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

    const beaconTotal = state.cleanRows
      .filter((r) => r.customerStandard.toLowerCase() === 'beacon')
      .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

    const ashaCount = state.cleanRows.filter((r) => r.customerStandard.toLowerCase() === 'asha').length;
    const beaconCount = state.cleanRows.filter((r) => r.customerStandard.toLowerCase() === 'beacon').length;

    const reconciledSum = cleanTotal + exceptionsTotal;
    const isReconciled = reconciledSum === RAW_TOTAL_VOLUME_INR;
    const variance = Math.abs(RAW_TOTAL_VOLUME_INR - reconciledSum);

    const isCleanTargetMatched = cleanTotal === TARGET_CLEAN_TOTAL_INR && state.cleanRows.length === 3;
    const isExceptionsTargetMatched = exceptionsTotal === TARGET_EXCEPTIONS_TOTAL_INR && state.exceptions.length === 4;
    const isAshaMatched = ashaTotal === TARGET_ASHA_TOTAL_INR;
    const isBeaconMatched = beaconTotal === TARGET_BEACON_TOTAL_INR;

    return {
      cleanTotal,
      exceptionsTotal,
      ashaTotal,
      beaconTotal,
      ashaCount,
      beaconCount,
      reconciledSum,
      isReconciled,
      variance,
      isCleanTargetMatched,
      isExceptionsTargetMatched,
      isAshaMatched,
      isBeaconMatched,
    };
  }, [state.cleanRows, state.exceptions]);

  // Handlers
  const handleResetToApproved = () => {
    if (window.confirm('Reset dataset to canonical Case B approved Clean and Exceptions tables?')) {
      updateState((prev) => ({
        ...prev,
        cleanRows: INITIAL_CLEAN_ROWS,
        exceptions: INITIAL_EXCEPTIONS,
        formulaNotes: INITIAL_S07_STATE.formulaNotes,
      }));
    }
  };

  const handleRunReview = () => {
    const draft: Record<string, string> = {
      'concept:explain': state.formulaNotes,
      'work:analysis': state.formulaNotes,
      'team:contribution': state.governance.contributionSummary,
      'team:judgement': state.governance.professionalBoundary,
    };
    const report = evaluateSession07({
      sessionId: 7,
      draft,
      workstationData: state,
    });
    setReviewReport(report);
  };

  const handleCopyDatasetJSON = () => {
    const jsonStr = JSON.stringify(
      {
        session: 'VCEP-S07-Excel-and-Data-Cleaning',
        studentId: state.governance.studentId,
        fileVersion: state.governance.fileVersion,
        rawVolumeINR: RAW_TOTAL_VOLUME_INR,
        cleanTotalINR: metrics.cleanTotal,
        quarantinedTotalINR: metrics.exceptionsTotal,
        reconciliationVarianceINR: metrics.variance,
        reconciled: metrics.isReconciled,
        cleanDataset: state.cleanRows,
        exceptionsRegister: state.exceptions,
        customerTotals: {
          asha: metrics.ashaTotal,
          beacon: metrics.beaconTotal,
        },
        formulaNotes: state.formulaNotes,
        governance: state.governance,
      },
      null,
      2
    );

    navigator.clipboard.writeText(jsonStr).then(() => {
      setCopiedNotification('Cleaned dataset and reconciliation copied to clipboard!');
      setTimeout(() => setCopiedNotification(null), 3500);
    });
  };

  return (
    <div className="vcep-s07-workstation bg-slate-50 min-h-screen text-slate-800 pb-20">
      {/* Session Hero Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-900/40 px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Case B Raw Inflow (7 Rows)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                <Calculator className="w-3.5 h-3.5" />
                Raw Inflow: ₹44,000
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <ShieldAlert className="w-3.5 h-3.5" />
                Zero-Variance Proof: ₹44k = ₹25k + ₹19k
              </span>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>Auto-saved to LocalStation:</span>
              <span className="font-mono text-emerald-400 font-semibold">{state.lastSaved || 'Synchronized'}</span>
            </div>
          </div>

          <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2">
              Turn Messy Data into Reliable Data
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Step into the role of a Financial Data Analyst. Inspect 7 raw commercial receipts contaminated by
              duplicate keys, invalid dates, missing amounts, and casing discrepancies. Never delete raw evidence:
              quarantine exceptions in suspense, standardize customer entities, and compute formula-verified totals.
            </p>
          </div>

          {/* Quick Jump Links */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap gap-3">
            <a
              href="#vcep-area-raw"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              1. Inspect the Raw Receipts
            </a>
            <a
              href="#vcep-area-clean"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
            >
              <Table className="w-4 h-4 text-white" />
              2. Clean, Validate & Report
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="#s07-t01"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 transition-colors"
            >
              <span>Task 01: Raw Receipts</span>
            </a>
            <a
              href="#s07-t02"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 transition-colors"
            >
              <span>Task 02: Data Issues</span>
            </a>
            <a
              href="#s07-t03"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 transition-colors"
            >
              <span>Task 03: Clean & Quarantine</span>
            </a>
            <a
              href="#s07-t04"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 transition-colors"
            >
              <span>Task 04: Verify Totals</span>
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
        {/* HEADING 1: Inspect the Raw Receipts                                       */}
        {/* ========================================================================= */}
        <section id="vcep-area-raw" className="scroll-mt-24 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-amber-600">Part 01</span>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Eye className="w-6 h-6 text-amber-600" />
                  Inspect the Raw Receipts
                </h2>
              </div>
              <div className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-500" />
                <span>Raw Immutability Rule: Raw data is legal evidence and must never be mutated or deleted.</span>
              </div>
            </div>
          </div>

          {/* TASK 01: Inspect Raw Receipts (S07-T01) */}
          <TaskCard
            taskId="S07-T01"
            taskNumber="TASK 01"
            title="Inspect Raw Receipts"
            instruction="Examine seven raw receipt records imported from field operations in the immutable Case B Raw Inflow Grid."
            learningTakeaway="Raw transaction logs are legal audit evidence—never edit, delete, or overwrite original source files."
            whyMatters="In corporate audit and forensic accounting, raw data serves as legal source evidence. Under no circumstances should raw files be edited in-place, overwritten, or rows deleted; all data cleansing must branch into clean working views and quarantine logs."
            statusText="7 Records Verified"
            isActive={activeTaskId === 'S07-T01'}
            onSelectTask={() => setActiveTaskId('S07-T01')}
          >
            <div className="space-y-6">
              {/* Raw Receipts Spreadsheet View */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                    <h4 className="font-semibold text-sm sm:text-base">
                      Case B Raw Inflow Grid (7 Records as Received)
                    </h4>
                  </div>
                  <span className="text-xs text-indigo-200 font-mono">
                    Source: Field Receipts Export • Total Volume: ₹44,000
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200 text-[11px] tracking-wider">
                        <th className="py-3 px-3 w-16 text-center">Row</th>
                        <th className="py-3 px-3 w-20">ID</th>
                        <th className="py-3 px-4 w-32">Received Date</th>
                        <th className="py-3 px-4 w-36">Customer Raw</th>
                        <th className="py-3 px-4 w-32 text-right">Raw Amount (₹)</th>
                        <th className="py-3 px-6 min-w-[240px]">Data Quality Audit Findings</th>
                        <th className="py-3 px-3 w-28 text-center">Action Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {state.rawReceipts.map((row) => (
                        <tr
                          key={row.id}
                          className={`hover:bg-slate-50 transition-colors ${
                            row.flagType === 'valid'
                              ? 'bg-emerald-50/20'
                              : row.flagType === 'duplicate'
                              ? 'bg-amber-50/30'
                              : row.flagType === 'blank_amount'
                              ? 'bg-rose-50/30'
                              : 'bg-indigo-50/10'
                          }`}
                        >
                          <td className="py-3 px-3 text-center font-mono text-slate-400">
                            {row.id}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-slate-900">
                            {row.sourceId}
                          </td>
                          <td className={`py-3 px-4 font-mono ${row.flagType === 'invalid_date' || row.flagType === 'ambiguous_date' ? 'text-rose-700 font-bold' : 'text-slate-700'}`}>
                            {row.receivedDate}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-800">
                            "{row.customerRaw}"
                          </td>
                          <td className={`py-3 px-4 text-right font-mono font-bold ${row.amount === 'blank' ? 'text-rose-600 italic' : 'text-slate-900'}`}>
                            {row.amount === 'blank' ? 'blank' : `₹${Number(row.amount).toLocaleString('en-IN')}`}
                          </td>
                          <td className="py-3 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium ${
                              row.flagType === 'valid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : row.flagType === 'duplicate'
                                ? 'bg-amber-100 text-amber-900'
                                : row.flagType === 'blank_amount'
                                ? 'bg-rose-100 text-rose-800'
                                : row.flagType === 'invalid_date'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-indigo-100 text-indigo-800'
                            }`}>
                              {row.flag}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center font-mono text-[11px]">
                            {row.flagType === 'valid' || row.flagType === 'case_mismatch' ? (
                              <span className="text-emerald-700 font-semibold flex items-center justify-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                Clean
                              </span>
                            ) : (
                              <span className="text-amber-700 font-semibold flex items-center justify-center gap-1">
                                <Ban className="w-3.5 h-3.5" />
                                Quarantine
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-100/90 font-bold border-t-2 border-slate-300 text-xs">
                        <td colSpan={4} className="py-3 px-4 uppercase text-slate-700">
                          Total Raw Receipts Inflow Volume
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-950 text-sm">
                          ₹{RAW_TOTAL_VOLUME_INR.toLocaleString('en-IN')}
                        </td>
                        <td colSpan={2} className="py-3 px-4 text-slate-500 text-[11px] font-normal">
                          7 rows received (6 with numeric amounts = ₹44,000 + 1 blank amount)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TaskCard>

          {/* TASK 02: Find Data Issues (S07-T02) */}
          <TaskCard
            taskId="S07-T02"
            taskNumber="TASK 02"
            title="Find Data Issues"
            instruction="Identify duplicate export keys, invalid dates, ambiguous formats, missing amounts, and casing defects."
            learningTakeaway="Never zero out or discard suspicious records; isolate them in a structured quarantine register."
            whyMatters="Dirty data cascades into financial reporting errors. For example, treating a duplicate receipt as fresh cash overstates revenue, while guessing a blank invoice amount conceals unpaid receivables."
            statusText="4 Issue Types Flagged"
            isActive={activeTaskId === 'S07-T02'}
            onSelectTask={() => setActiveTaskId('S07-T02')}
          >
            <div className="space-y-6">
              {/* 4 Cardinal Data Cleaning Rules */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-amber-200/80 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-xs">
                    <AlertOctagon className="w-4 h-4" />
                    Rule 1: Duplicate vs Deletion
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Collection officer confirms Row 3 is a duplicate export of R02. <strong>Do NOT delete Row 3</strong>:
                    tag as duplicate and exclude from Clean, preserving raw auditability.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-rose-200/80 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                    <ShieldAlert className="w-4 h-4" />
                    Rule 2: Anti-Zeroing Stand
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    R05 has a blank amount. <strong>Replacing with ₹0 creates false certainty</strong> and hides an unpaid
                    invoice. Quarantine in suspense until bank confirms value.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-indigo-200/80 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
                    <Calendar className="w-4 h-4" />
                    Rule 3: ISO Date Validation
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    All approved receipts must adhere to unambiguous <code>YYYY-MM-DD</code>. R04 (Oct 32) is impossible;
                    R06 (`10/11/26`) is format-ambiguous. Both must be quarantined.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-emerald-200/80 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                    <CheckSquare className="w-4 h-4" />
                    Rule 4: Customer Normalization
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Apply master mapping: <code>ASHA</code> and <code> asha </code> normalize to <strong>Asha</strong>;
                    <code>Beacon</code> to <strong>Beacon</strong>. Consolidates customer reporting cleanly.
                  </p>
                </div>
              </div>
            </div>
          </TaskCard>
        </section>

        {/* ========================================================================= */}
        {/* HEADING 2: Clean, Validate & Report                                       */}
        {/* ========================================================================= */}
        <section id="vcep-area-clean" className="scroll-mt-24 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-600">Part 02</span>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Table className="w-6 h-6 text-emerald-600" />
                  Clean, Validate & Report
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetToApproved}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Approved State
                </button>
                <button
                  type="button"
                  onClick={handleCopyDatasetJSON}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Export Clean & Exceptions JSON
                </button>
              </div>
            </div>
          </div>

          {/* TASK 03: Clean and Quarantine (S07-T03) */}
          <TaskCard
            taskId="S07-T03"
            taskNumber="TASK 03"
            title="Clean and Quarantine"
            instruction="Segregate verified records into Clean Approved while routing suspect or unverified records to Quarantine Suspense."
            learningTakeaway="Standardize text and isolate defective records in quarantine without losing any transaction volume."
            whyMatters="Quarantining preserves business continuity: verified customer receipts can immediately flow to the general ledger and receivables matching, while unresolved exceptions are placed in a monitored suspense queue for investigator follow-up."
            statusText="3 Clean · 4 Quarantined"
            isActive={activeTaskId === 'S07-T03'}
            onSelectTask={() => setActiveTaskId('S07-T03')}
          >
            <div className="space-y-6">
              {/* Clean vs Exceptions Views Selector */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveTableView('split')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTableView === 'split' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border'
                  }`}
                >
                  Side-by-Side Dual View (Clean & Exceptions)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTableView('clean')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTableView === 'clean' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border'
                  }`}
                >
                  Clean Approved Only (3 Rows / ₹25,000)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTableView('exceptions')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTableView === 'exceptions' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border'
                  }`}
                >
                  Exceptions Register Only (4 Rows / ₹19,000)
                </button>
              </div>

              {/* Split Table Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Clean Approved Dataset */}
                {(activeTableView === 'split' || activeTableView === 'clean') && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="p-4 bg-emerald-950 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <h4 className="font-semibold text-sm">Clean Approved Working Table</h4>
                        </div>
                        <span className="text-xs font-mono bg-emerald-800/60 px-2 py-0.5 rounded text-emerald-200">
                          3 Rows • ₹{metrics.cleanTotal.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200 text-[11px]">
                              <th className="py-2.5 px-3">Clean ID</th>
                              <th className="py-2.5 px-3">Source ID</th>
                              <th className="py-2.5 px-3">ISO Date</th>
                              <th className="py-2.5 px-3">Customer Standard</th>
                              <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                              <th className="py-2.5 px-3 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-sans">
                            {state.cleanRows.map((row) => (
                              <tr key={row.id} className="hover:bg-slate-50">
                                <td className="py-2.5 px-3 font-mono font-bold text-indigo-700">{row.cleanId}</td>
                                <td className="py-2.5 px-3 font-mono text-slate-500">{row.sourceId}</td>
                                <td className="py-2.5 px-3 font-mono text-slate-700">{row.isoDate}</td>
                                <td className="py-2.5 px-3 font-semibold text-slate-900">{row.customerStandard}</td>
                                <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                                  ₹{Number(row.amount).toLocaleString('en-IN')}
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                    <Check className="w-3 h-3" />
                                    {row.rowStatus}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-600 flex justify-between items-center">
                      <span>Filtered for validated ISO dates and standardized customer keys.</span>
                      <span className="font-bold text-slate-900">Total: ₹{metrics.cleanTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}

                {/* Quarantined Suspense Register */}
                {(activeTableView === 'split' || activeTableView === 'exceptions') && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="p-4 bg-amber-950 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="w-5 h-5 text-amber-400" />
                          <h4 className="font-semibold text-sm">Quarantine Exceptions Register</h4>
                        </div>
                        <span className="text-xs font-mono bg-amber-800/60 px-2 py-0.5 rounded text-amber-200">
                          4 Rows • ₹{metrics.exceptionsTotal.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200 text-[11px]">
                              <th className="py-2.5 px-3">Source ID</th>
                              <th className="py-2.5 px-3">Customer</th>
                              <th className="py-2.5 px-3 text-right">Raw Amt (₹)</th>
                              <th className="py-2.5 px-3">Audit Category</th>
                              <th className="py-2.5 px-3">Audit Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-sans">
                            {state.exceptions.map((ex) => (
                              <tr key={ex.id} className="hover:bg-slate-50">
                                <td className="py-2.5 px-3 font-mono font-bold text-rose-700">{ex.sourceId}</td>
                                <td className="py-2.5 px-3 text-slate-700">{ex.rawCustomer}</td>
                                <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                                  {ex.rawAmount === 'blank' ? 'blank' : `₹${Number(ex.rawAmount).toLocaleString('en-IN')}`}
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-800">
                                    {ex.category}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-slate-600 text-[11px]">{ex.auditAction}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-600 flex justify-between items-center">
                      <span>Preserved in quarantine without artificial zeroing or in-place deletion.</span>
                      <span className="font-bold text-slate-900">Total: ₹{metrics.exceptionsTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TaskCard>

          {/* TASK 04: Verify the Totals (S07-T04) */}
          <TaskCard
            taskId="S07-T04"
            taskNumber="TASK 04"
            title="Verify the Totals"
            instruction="Execute mathematical reconciliation proof (₹44k = ₹25k + ₹19k) and compute formula-driven customer subtotals."
            learningTakeaway="Clean volume plus quarantined volume must equal raw volume exactly—zero data lost in transit."
            whyMatters="Reconciliation guarantees that no monetary value disappeared or was duplicated during transformation. Live formulas (=SUMIFS, =COUNTIF) ensure audit traceability so external reviewers can independently recalculate results."
            statusText={
              metrics.isReconciled && metrics.isCleanTargetMatched && metrics.isExceptionsTargetMatched
                ? 'Reconciled (₹44k = ₹25k + ₹19k)'
                : 'Pending Reconciliation'
            }
            isActive={activeTaskId === 'S07-T04'}
            onSelectTask={() => setActiveTaskId('S07-T04')}
          >
            <div className="space-y-6">
              {/* Mathematical Reconciliation Proof Gauge ($44k = $25k + $19k) */}
              <div
                className={`rounded-xl p-5 border transition-all ${
                  metrics.isReconciled && metrics.isCleanTargetMatched && metrics.isExceptionsTargetMatched
                    ? 'bg-emerald-50/80 border-emerald-300 shadow-sm'
                    : metrics.isReconciled
                    ? 'bg-amber-50/80 border-amber-300 shadow-sm'
                    : 'bg-rose-50/80 border-rose-300 shadow-sm'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {metrics.isReconciled && metrics.isCleanTargetMatched && metrics.isExceptionsTargetMatched ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Zero-Variance Reconciled (₹44,000 = ₹25,000 + ₹19,000)
                        </span>
                      ) : metrics.isReconciled ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-600 text-white">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Reconciled at ₹{metrics.reconciledSum.toLocaleString('en-IN')} (Target: ₹44k = ₹25k + ₹19k)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Reconciliation Variance: ₹{metrics.variance.toLocaleString('en-IN')}!
                        </span>
                      )}
                      <span className="text-xs text-slate-600 font-medium">Reconciliation Equation Proof</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Total Raw Inflow (₹44,000) must equal Clean Approved (₹25,000) + Quarantined Suspense (₹19,000).
                    </p>
                  </div>

                  {/* Formula Numbers */}
                  <div className="flex items-center gap-3 text-center">
                    <div className="bg-white/90 px-3.5 py-2 rounded-lg border border-slate-200">
                      <div className="text-[10px] uppercase font-bold text-slate-500">Raw Inflow</div>
                      <div className="text-base font-mono font-bold text-slate-900">
                        ₹{RAW_TOTAL_VOLUME_INR.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="text-slate-400 font-bold text-lg">=</div>
                    <div className="bg-white/90 px-3.5 py-2 rounded-lg border border-slate-200">
                      <div className="text-[10px] uppercase font-bold text-emerald-700">Clean Approved</div>
                      <div className="text-base font-mono font-bold text-emerald-700">
                        ₹{metrics.cleanTotal.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="text-slate-400 font-bold text-lg">+</div>
                    <div className="bg-white/90 px-3.5 py-2 rounded-lg border border-slate-200">
                      <div className="text-[10px] uppercase font-bold text-amber-700">Quarantined</div>
                      <div className="text-base font-mono font-bold text-amber-700">
                        ₹{metrics.exceptionsTotal.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formula Evidence & Customer Subtotals Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Asha Total Card */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold uppercase text-indigo-700 font-mono">Customer Subtotal</span>
                    <span className="text-xs font-mono text-slate-500">{metrics.ashaCount} receipts</span>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Customer: Asha</div>
                    <div className="text-2xl font-mono font-bold text-slate-900 mt-0.5">
                      ₹{metrics.ashaTotal.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="bg-indigo-50/70 p-2.5 rounded-lg border border-indigo-100 text-[11px] font-mono text-indigo-950">
                    <code>=SUMIFS(Clean[Amount], Clean[Customer], "Asha")</code>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    R01 (₹12,000) + R03 (₹5,000) normalized from raw 'ASHA' and ' asha '.
                  </p>
                </div>

                {/* Beacon Total Card */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold uppercase text-indigo-700 font-mono">Customer Subtotal</span>
                    <span className="text-xs font-mono text-slate-500">{metrics.beaconCount} receipt</span>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Customer: Beacon</div>
                    <div className="text-2xl font-mono font-bold text-slate-900 mt-0.5">
                      ₹{metrics.beaconTotal.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="bg-indigo-50/70 p-2.5 rounded-lg border border-indigo-100 text-[11px] font-mono text-indigo-950">
                    <code>=SUMIFS(Clean[Amount], Clean[Customer], "Beacon")</code>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Row 2 (R02 ₹8,000). Row 3 excluded as duplicate export confirmed by officer.
                  </p>
                </div>

                {/* Excluded Control Card */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold uppercase text-amber-700 font-mono">Control Count</span>
                    <span className="text-xs font-mono text-amber-700 font-bold">4 Quarantined</span>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Total Excluded Rows</div>
                    <div className="text-2xl font-mono font-bold text-amber-900 mt-0.5">
                      {state.exceptions.length} Rows
                    </div>
                  </div>
                  <div className="bg-amber-50/70 p-2.5 rounded-lg border border-amber-100 text-[11px] font-mono text-amber-950">
                    <code>=COUNTIF(Exceptions[Status], "*")</code>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    R02 duplicate (₹8k), R04 (₹7k), R05 (blank), R06 (₹4k) held in suspense.
                  </p>
                </div>
              </div>

              {/* Formula Notes & Correction Log */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-indigo-600" />
                    <h4 className="font-bold text-sm text-slate-900">
                      Data Cleaning Method, Formulas & Correction Log
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {countWords(state.formulaNotes)} words
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Document your data cleaning method: explain why suspect rows are quarantined rather than deleted,
                  confirm the zero-variance proof ($44k = $25k + $19k), describe customer normalization formulas,
                  and state your anti-zeroing policy for R05.
                </p>
                <textarea
                  rows={4}
                  value={state.formulaNotes}
                  onChange={(e) => updateState((prev) => ({ ...prev, formulaNotes: e.target.value }))}
                  placeholder="Record formula evidence, duplicate handling logic, and quarantine rationale..."
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
                    <span className="text-[10px] text-slate-500">Must match pattern: StudentID_S07_v01</span>
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
                      placeholder="Detail your personal role: formula verification, customer standardisation, duplicate confirmation..."
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                      placeholder="Note any colleague entries reviewed or peer feedback received (e.g. testing formula recalculation)..."
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Autonomous Anti-Zeroing Stand</span>
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
                      placeholder="State your professional boundary: e.g. refusing to replace blank amount in R05 with ₹0 to avoid masking an unpaid invoice..."
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
                    Evaluates Overview, Learn, Case B Raw Inflow, Clean Rows (₹25k), Exceptions (₹19k), SUMIFS, and Governance.
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
                    {S07_RUBRIC.map((r) => (
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
            {currentStepIdx === WIZARD_STEPS.length - 1 ? 'Data Cleansing Complete ✓' : 'Save & Continue →'}
          </button>
        </footer>
      </div>
    </div>
  );
}
