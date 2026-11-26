'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  S14_STORAGE_KEY,
  CASE_D_DATA,
  CASE_D_CLAIMS,
  MAX_MEMO_WORD_COUNT,
  DEFAULT_CORRECTED_MEMO,
  WORKFLOW_STAGES,
  WORKFLOW_SCENARIOS,
  S14_RUBRIC,
  countWords,
  loadSession14State,
  saveSession14State,
  clearSession14State,
  type Session14State,
  type ScenarioId,
  type AuditVerdict,
  type ClaimAuditItem,
} from './session-14-ai-data.ts';
import { evaluateSession14 } from '../../../lib/review-engine/session-rules/session-14.ts';
import type { SessionReviewReport } from '../../../lib/review-engine/types.ts';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  RotateCcw,
  Sparkles,
  ArrowRight,
  FileText,
  Table,
  Sliders,
  Check,
  X,
  Play,
  CheckSquare,
  Lock,
  Workflow,
  Calculator,
  Layers,
  StopCircle,
  HelpCircle,
  Clock,
  UserCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Session14AIJourneyProps {
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
            <span>{whyOpen ? 'Hide verification rule' : 'Why this matters'}</span>
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

export function Session14AIJourney({ onUpdateDraft }: Session14AIJourneyProps) {
  const [state, setState] = useState<Session14State>(() => loadSession14State());
  const [reviewReport, setReviewReport] = useState<SessionReviewReport | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string>('S14-T01');

  const WIZARD_STEPS = [
    { id: 'S14-T01' as const, num: 1, label: 'Task 01: Audit Four AI Claims', short: '1. Audit Claims' },
    { id: 'S14-T02' as const, num: 2, label: 'Task 02: Correct the Management Memo', short: '2. Correct Memo' },
    { id: 'S14-T03' as const, num: 3, label: 'Task 03: Build Validation Checks', short: '3. Validation Gates' },
    { id: 'S14-T04' as const, num: 4, label: 'Task 04: Test the Approval Flow', short: '4. Approval Flow' },
  ];

  const currentStepIdx = useMemo(() => {
    return Math.max(0, WIZARD_STEPS.findIndex((s) => s.id === activeTaskId));
  }, [activeTaskId]);

  // Initial mount sync
  useEffect(() => {
    const loaded = loadSession14State();
    setState(loaded);
    if (onUpdateDraft) {
      onUpdateDraft('concept:explain', loaded.correctedMemoText);
      onUpdateDraft('team:contribution', loaded.governance.autonomousDecisionStatement);
      onUpdateDraft('team:judgement', loaded.governance.decisionOwnerName);
    }
  }, []);

  // Update state helper with auto-persistence and draft sync
  const updateState = (updater: (prev: Session14State) => Session14State) => {
    setState((prev) => {
      const next = updater(prev);
      saveSession14State(next);
      if (onUpdateDraft) {
        onUpdateDraft('concept:explain', next.correctedMemoText);
        onUpdateDraft('team:contribution', next.governance.autonomousDecisionStatement);
        onUpdateDraft('team:judgement', next.governance.decisionOwnerName);
      }
      return next;
    });
  };

  // 1. Audit Register handlers
  const handleVerdictChange = (claimId: string, verdict: AuditVerdict) => {
    updateState((prev) => ({
      ...prev,
      claimAudits: {
        ...prev.claimAudits,
        [claimId]: {
          ...prev.claimAudits[claimId],
          userVerdict: verdict,
          isAudited: true,
        },
      },
    }));
  };

  const handleRecalcChange = (claimId: string, val: string) => {
    updateState((prev) => ({
      ...prev,
      claimAudits: {
        ...prev.claimAudits,
        [claimId]: {
          ...prev.claimAudits[claimId],
          userRecalculation: val,
          isAudited: true,
        },
      },
    }));
  };

  const handleCorrectionChange = (claimId: string, val: string) => {
    updateState((prev) => ({
      ...prev,
      claimAudits: {
        ...prev.claimAudits,
        [claimId]: {
          ...prev.claimAudits[claimId],
          userCorrection: val,
          isAudited: true,
        },
      },
    }));
  };

  const handleAutoFillAudits = () => {
    const autoAudits: Record<string, any> = {};
    for (const c of CASE_D_CLAIMS) {
      autoAudits[c.id] = {
        userVerdict: c.correctVerdict,
        userRecalculation: c.canonicalRecalculation,
        userCorrection: c.canonicalCorrection,
        isAudited: true,
      };
    }
    updateState((prev) => ({
      ...prev,
      claimAudits: autoAudits,
    }));
  };

  // 2. Memo Handler
  const handleMemoChange = (val: string) => {
    updateState((prev) => ({
      ...prev,
      correctedMemoText: val,
    }));
  };

  const handleResetMemo = () => {
    handleMemoChange(DEFAULT_CORRECTED_MEMO);
  };

  // 3. Scenario Simulation Handler
  const handleSelectScenario = (scenarioId: ScenarioId) => {
    updateState((prev) => {
      const isHalted = scenarioId === 'blank_revenue';
      let approvalStatus: 'Pending Review' | 'Rejected' | 'Approved' = 'Pending Review';
      if (scenarioId === 'approved') approvalStatus = 'Approved';
      if (scenarioId === 'rejected') approvalStatus = 'Rejected';

      return {
        ...prev,
        selectedScenario: scenarioId,
        stoppingConditionActive: isHalted,
        governance: {
          ...prev.governance,
          approvalStatus,
        },
      };
    });
  };

  // 4. Governance Handler
  const handleGovernanceChange = (field: string, val: string) => {
    updateState((prev) => ({
      ...prev,
      governance: {
        ...prev.governance,
        [field]: val,
      },
    }));
  };

  // 5. Reset Handler
  const handleReset = () => {
    if (window.confirm('Reset Session 14 audit register and workflow simulator to default state?')) {
      clearSession14State();
      const fresh = loadSession14State();
      setState(fresh);
      setReviewReport(null);
    }
  };

  // 6. Formative Review Runner
  const handleRunReview = () => {
    const ctx = {
      sessionId: 14,
      draft: {
        'concept:explain': state.correctedMemoText,
        'team:contribution': state.governance.autonomousDecisionStatement,
        'team:judgement': state.governance.decisionOwnerName,
      },
      workstationData: {
        claimAudits: state.claimAudits,
        correctedMemoText: state.correctedMemoText,
        selectedScenario: state.selectedScenario,
        stoppingConditionRule: 'IF(OR(ISBLANK(Revenue), NOT(ISNUMBER(Revenue)), Revenue <= 0), "HALT_ERROR", "PASS")',
        governance: state.governance,
        fileVersion: state.fileVersion || 'StudentID_S14_v01.xlsx',
      },
    };
    const report = evaluateSession14(ctx);
    setReviewReport(report);
  };

  // Word count calculation
  const memoWordCount = useMemo(() => {
    return countWords(state.correctedMemoText);
  }, [state.correctedMemoText]);

  const isMemoLengthValid = memoWordCount > 0 && memoWordCount <= MAX_MEMO_WORD_COUNT;

  // Active scenario details
  const activeScenario = useMemo(() => {
    return WORKFLOW_SCENARIOS.find((s) => s.id === state.selectedScenario) || WORKFLOW_SCENARIOS[0];
  }, [state.selectedScenario]);

  const auditedCount = useMemo(() => {
    return Object.values(state.claimAudits).filter((c) => c.isAudited).length;
  }, [state.claimAudits]);

  return (
    <div className="vcep-session-clean-journey w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
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
      {/* ==================================================== */}
      {/* EXECUTIVE MISSION BANNER */}
      {/* ==================================================== */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
              <span>Session 14 · Professional Workplace Experience</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Audit the AI. Control the Workflow.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              When generative AI operates inside automated finance workflows, unverified claims can trigger commercial insolvency. An unverified AI draft claims September revenue grew 30%, margin improved to 25%, ₹70,000 receivables prove on-time payments, and recommends a blanket 20% discount. Audit every claim against Case D, author a verified 120-word memo, configure automated stopping gates for missing data, and enforce explicit human sign-off.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <a
              href="#vcep-area-audit"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md transition-colors"
            >
              <Calculator className="w-4 h-4" />
              <span>1. Challenge AI Report</span>
            </a>
            <a
              href="#vcep-area-workflow"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 shadow-md transition-colors"
            >
              <Workflow className="w-4 h-4" />
              <span>2. Build Verified Workflow</span>
            </a>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* HEADING 1: CHALLENGE THE AI REPORT (#vcep-area-audit) */}
      {/* ==================================================== */}
      <section id="vcep-area-audit" className="vcep-journey-stage-block space-y-8 scroll-mt-20">
        <div className="vcep-journey-section-header border-b border-slate-200 pb-4">
          <div className="vcep-journey-badge-row flex items-center gap-2 text-indigo-600 text-xs font-bold tracking-widest uppercase">
            <Calculator className="w-4 h-4" />
            <span className="vcep-pill-navy">WORK AREA 01</span>
            <span className="vcep-pill-teal">CLAIM-BY-CLAIM AUDIT</span>
            <span className="vcep-pill-gold">REVISED 120-WORD MEMO</span>
          </div>
          <h2 className="vcep-journey-title text-2xl font-bold text-slate-900 mt-1">
            1. Challenge the AI Report
          </h2>
          <p className="vcep-journey-subtitle text-sm text-slate-600 mt-1">
            Inspect verified Case D management accounts, audit all four ungrounded AI claims individually, recalculate true growth, and draft a disciplined 120-word executive memo.
          </p>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TASK 01: AUDIT FOUR AI CLAIMS (S14-T01) */}
        {/* ---------------------------------------------------- */}
        <TaskCard
          taskId="S14-T01"
          taskNumber="Task 01"
          title="Audit Four AI Claims"
          instruction="Audit four AI claims against verified Case D records, calculate correct percentages, and log errors."
          learningTakeaway="Verify every computational claim in AI outputs using primary ledger data."
          whyMatters="AI models frequently generate plausible-sounding false metrics (e.g. 30% growth vs. 25.0% true growth) and dangerous commercial advice. Human accountants must verify every percentage and assertion against primary accounts."
          statusText={`${auditedCount} / 4 Claims Audited`}
          isActive={activeTaskId === 'S14-T01'}
          onSelectTask={() => setActiveTaskId('S14-T01')}
        >
          {/* Case D MIS Financial Ground Truth Table */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 space-y-3 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  Case D: Three-Month MIS Financial Ground Truth
                </h4>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
                Source Range: CaseD!B2:D6 (Net of Tax, INR)
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Measure</th>
                    <th className="py-2.5 px-3 text-right">July (₹)</th>
                    <th className="py-2.5 px-3 text-right">August (₹)</th>
                    <th className="py-2.5 px-3 text-right">September (₹)</th>
                    <th className="py-2.5 px-3 text-right">Q1 Total / Trend</th>
                    <th className="py-2.5 px-3">Operational Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {CASE_D_DATA.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {row.measure}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">₹{row.julyINR.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 text-right font-mono">₹{row.augustINR.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-indigo-700">
                        ₹{row.septemberINR.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold">
                        ₹{row.q1TotalINR.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-500">
                        {row.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Crucial Audit Fact:</strong> Case D contains recognized expenses and closing balances only. <strong>Collection dates and underlying causes of cost surges are NOT supplied</strong>. Generating assertions about prompt customer payment behavior is an ungrounded hallucination.
              </span>
            </div>
          </div>

          {/* Four-Claim Audit Register */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-600">
                Connect each ungrounded claim to its primary source, exact recalculation formula, and factual correction:
              </span>
              <button
                type="button"
                onClick={handleAutoFillAudits}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors shrink-0"
              >
                Populate Standard Audit
              </button>
            </div>

            <div className="space-y-4">
              {CASE_D_CLAIMS.map((claim) => {
                const audit = state.claimAudits[claim.id] || {
                  userVerdict: claim.correctVerdict,
                  userRecalculation: claim.canonicalRecalculation,
                  userCorrection: claim.canonicalCorrection,
                  isAudited: true,
                };

                return (
                  <div
                    key={claim.id}
                    className="rounded-xl border border-slate-200 p-4 sm:p-5 bg-slate-50/50 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          Claim 0{claim.claimNum}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {claim.topic}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">
                        Source: {claim.sourceReference}
                      </span>
                    </div>

                    {/* AI Statement Callout */}
                    <div className="p-3 rounded-lg bg-rose-50/70 border border-rose-200 text-xs">
                      <span className="font-bold text-rose-800 block mb-0.5">
                        Raw AI Assertion:
                      </span>
                      <span className="italic text-slate-800">
                        &ldquo;{claim.aiStatement}&rdquo;
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                      {/* Recalculation (5 cols) */}
                      <div className="md:col-span-5 space-y-1">
                        <label className="font-bold text-slate-700 block">
                          Source Recalculation &amp; Formula
                        </label>
                        <textarea
                          rows={2}
                          value={audit.userRecalculation}
                          onChange={(e) => handleRecalcChange(claim.id, e.target.value)}
                          className="w-full text-xs rounded-lg border border-slate-300 bg-white p-2 font-mono text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                        />
                      </div>

                      {/* Verdict (3 cols) */}
                      <div className="md:col-span-3 space-y-1">
                        <label className="font-bold text-slate-700 block">
                          Audit Verdict
                        </label>
                        <select
                          value={audit.userVerdict}
                          onChange={(e) => handleVerdictChange(claim.id, e.target.value as AuditVerdict)}
                          className="w-full text-xs rounded-lg border border-slate-300 bg-white p-2 font-semibold text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                        >
                          <option value="FALSE">FALSE (Calculation Error)</option>
                          <option value="MISLEADING">MISLEADING (Hallucination)</option>
                          <option value="FATAL_RECOMMENDATION">FATAL_RECOMMENDATION</option>
                          <option value="ACCURATE">ACCURATE</option>
                        </select>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {claim.guidanceNotes}
                        </p>
                      </div>

                      {/* Factual Correction (4 cols) */}
                      <div className="md:col-span-4 space-y-1">
                        <label className="font-bold text-slate-700 block">
                          Factual Correction
                        </label>
                        <textarea
                          rows={2}
                          value={audit.userCorrection}
                          onChange={(e) => handleCorrectionChange(claim.id, e.target.value)}
                          className="w-full text-xs rounded-lg border border-slate-300 bg-white p-2 text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TaskCard>

        {/* ---------------------------------------------------- */}
        {/* TASK 02: CORRECT THE MANAGEMENT MEMO (S14-T02) */}
        {/* ---------------------------------------------------- */}
        <TaskCard
          taskId="S14-T02"
          taskNumber="Task 02"
          title="Correct the Management Memo"
          instruction="Draft a 120-word executive brief with verified metrics, uncertainty disclosures, and cost controls."
          learningTakeaway="Management briefs must communicate verified numbers and reject loss-making commercial proposals."
          whyMatters="Executive decision-makers rely on concise, factual commentary. A professional memo must highlight true margin movement (-2.5 pp to 20.0%), disclose data limitations (absence of payment logs), and explicitly reject harmful commercial recommendations."
          statusText={`${memoWordCount} / ${MAX_MEMO_WORD_COUNT} Words`}
          isActive={activeTaskId === 'S14-T02'}
          onSelectTask={() => setActiveTaskId('S14-T02')}
        >
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-600">
                Author supported commentary (≤ 120 words). Do not merely rewrite unverified numbers:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetMemo}
                  className="text-xs font-semibold px-2.5 py-1 rounded border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Reset to Canonical Memo
                </button>
                <span
                  className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                    isMemoLengthValid
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-rose-50 text-rose-700 border-rose-300'
                  }`}
                >
                  {memoWordCount} / {MAX_MEMO_WORD_COUNT} Words {isMemoLengthValid ? '✓' : '(Limit Exceeded!)'}
                </span>
              </div>
            </div>

            <textarea
              rows={5}
              value={state.correctedMemoText}
              onChange={(e) => handleMemoChange(e.target.value)}
              placeholder="Write verified executive commentary here (max 120 words)..."
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 bg-white p-4 text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none leading-relaxed"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5 p-2 rounded bg-slate-50 border border-slate-200">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Growth: +25.0% MoM cited</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded bg-slate-50 border border-slate-200">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Margin: 20.0% decay cited</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded bg-slate-50 border border-slate-200">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Receivables: ₹70k &amp; no timestamps</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded bg-slate-50 border border-slate-200">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Strategy: Reject 20% discount</span>
              </div>
            </div>
          </div>
        </TaskCard>
      </section>

      {/* ==================================================== */}
      {/* HEADING 2: BUILD A VERIFIED WORKFLOW (#vcep-area-workflow) */}
      {/* ==================================================== */}
      <section id="vcep-area-workflow" className="vcep-journey-stage-block space-y-8 scroll-mt-20">
        <div className="vcep-journey-section-header border-b border-slate-200 pb-4">
          <div className="vcep-journey-badge-row flex items-center gap-2 text-indigo-600 text-xs font-bold tracking-widest uppercase">
            <Workflow className="w-4 h-4" />
            <span className="vcep-pill-navy">WORK AREA 02</span>
            <span className="vcep-pill-teal">VALIDATION GATE &amp; STOPPING RULES</span>
            <span className="vcep-pill-gold">SIMULATION DRILL</span>
          </div>
          <h2 className="vcep-journey-title text-2xl font-bold text-slate-900 mt-1">
            2. Build a Verified Workflow
          </h2>
          <p className="vcep-journey-subtitle text-sm text-slate-600 mt-1">
            Configure an automated 5-stage pipeline with stopping conditions on invalid data. Run normal, fault-injection, restore, rejection, and explicit approval scenarios.
          </p>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TASK 03: BUILD VALIDATION CHECKS (S14-T03) */}
        {/* ---------------------------------------------------- */}
        <TaskCard
          taskId="S14-T03"
          taskNumber="Task 03"
          title="Build Validation Checks"
          instruction="Configure automated validation gates and stopping rules to halt workflows when revenue is missing."
          learningTakeaway="Automated pipelines must halt immediately when required financial inputs are missing or invalid."
          whyMatters="Uncontrolled automation feeds corrupted or missing inputs directly into generative models, producing confidently hallucinated summaries. Stopping rules ensure bad data is quarantined before narrative generation."
          statusText="Validation Gate Active"
          isActive={activeTaskId === 'S14-T03'}
          onSelectTask={() => setActiveTaskId('S14-T03')}
        >
          <div className="space-y-6">
            {/* 5-Stage Controlled Workflow Pipeline */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  5-Stage Controlled Automation Architecture
                </span>
                <span className="text-xs font-mono text-slate-500">
                  Pipeline Mode: <strong className="text-teal-700">{activeScenario.name.split(':')[0]}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {WORKFLOW_STAGES.map((stg) => {
                  const isHaltedStage = state.stoppingConditionActive && stg.stageNum >= 2;

                  return (
                    <div
                      key={stg.id}
                      className={`rounded-xl p-4 border transition-all ${
                        stg.stageNum === 2 && state.stoppingConditionActive
                          ? 'bg-rose-50 border-rose-400 shadow-md ring-2 ring-rose-500/30'
                          : isHaltedStage
                          ? 'bg-slate-100 border-slate-200 opacity-60'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                        <span>STAGE 0{stg.stageNum}</span>
                        {stg.stageNum === 2 && state.stoppingConditionActive ? (
                          <span className="text-rose-600 flex items-center gap-1">
                            <StopCircle className="w-3.5 h-3.5" /> HALTED
                          </span>
                        ) : (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> ACTIVE
                          </span>
                        )}
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 mt-2">
                        {stg.name}
                      </h5>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {stg.purpose}
                      </p>
                      <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                        Owner: {stg.ownerRole}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stopping Condition Box */}
            <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-indigo-400">
                <span className="font-bold">AUTOMATED STOPPING CONDITION SPECIFICATION</span>
                <span className="text-[11px] text-slate-400">Gate: Stage 02 (Validation Gate)</span>
              </div>
              <code className="text-amber-300 block">
                =IF(OR(ISBLANK(Revenue), NOT(ISNUMBER(Revenue)), Revenue &lt;= 0), &quot;HALT_VALIDATION_ERROR&quot;, &quot;PROCEED_TO_DRAFT&quot;)
              </code>
              <p className="text-[11px] text-slate-400 font-sans">
                <strong>Behavior:</strong> If September revenue is blank, missing, or corrupted, the automated pipeline halts visibly, records an alert, and refuses to generate a downstream summary.
              </p>
            </div>
          </div>
        </TaskCard>

        {/* ---------------------------------------------------- */}
        {/* TASK 04: TEST THE APPROVAL FLOW (S14-T04) */}
        {/* ---------------------------------------------------- */}
        <TaskCard
          taskId="S14-T04"
          taskNumber="Task 04"
          title="Test the Approval Flow"
          instruction="Test five workflow scenarios, log human sign-off, and complete formative governance review."
          learningTakeaway="Enterprise automation requires human review gates and fail-safe fault injection testing."
          whyMatters="Commercial liability demands that automated AI pipelines never release output externally without explicit, attributed human authorization. Rejection paths and fault-injection drills verify system resilience."
          statusText={state.governance.approvalStatus}
          isActive={activeTaskId === 'S14-T04'}
          onSelectTask={() => setActiveTaskId('S14-T04')}
        >
          {/* Scenario Simulation Drill */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Multi-Scenario Simulation Drill
              </span>
              <span className="text-xs text-slate-500">Select scenario to execute drill:</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {WORKFLOW_SCENARIOS.map((sc) => {
                const isSelected = state.selectedScenario === sc.id;

                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => handleSelectScenario(sc.id)}
                    className={`text-xs font-bold p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? sc.id === 'blank_revenue'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                          : 'bg-teal-700 text-white border-teal-700 shadow-md'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-[10px] opacity-80 uppercase tracking-wider">
                      {sc.id.replace('_', ' ')}
                    </div>
                    <div className="mt-1 leading-snug">{sc.name.split(':')[1] || sc.name}</div>
                  </button>
                );
              })}
            </div>

            {/* Active Scenario Card */}
            <div
              className={`rounded-xl p-5 border transition-all ${
                activeScenario.id === 'blank_revenue'
                  ? 'bg-rose-50/70 border-rose-300'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    Simulation State
                  </span>
                  <h5 className="text-sm font-bold text-slate-900">
                    {activeScenario.name}
                  </h5>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                    activeScenario.expectedValidationGateStatus === 'HALTED_BLOCKED'
                      ? 'bg-rose-100 text-rose-700 border-rose-300'
                      : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                  }`}
                >
                  Validation Gate: {activeScenario.expectedValidationGateStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-slate-500 block">
                    Injected Input:
                  </span>
                  <span className="font-mono text-slate-800">
                    September Rev ={' '}
                    {activeScenario.injectedState.septemberRevenueINR !== null
                      ? `₹${activeScenario.injectedState.septemberRevenueINR.toLocaleString('en-IN')}`
                      : '[BLANK / MISSING CELL]'}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-500 block">
                    Workflow Outcome:
                  </span>
                  <span className="font-semibold text-slate-800">
                    {activeScenario.expectedWorkflowOutcome}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-500 block">
                    Governance Action:
                  </span>
                  <span className="text-slate-700">
                    {activeScenario.actionPrompt}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Deliverable Governance & Human Sign-off Form */}
          <div className="space-y-4 mb-8 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Deliverable Governance &amp; Explicit Human Sign-Off
                </h4>
                <p className="text-xs text-slate-500">
                  No automated pipeline may distribute output externally. Record named roles and an explicit sign-off statement for official assessment.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Preparer Name &amp; Role
                </label>
                <input
                  type="text"
                  value={state.governance.preparerName}
                  onChange={(e) => handleGovernanceChange('preparerName', e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Quality Reviewer Name
                </label>
                <input
                  type="text"
                  value={state.governance.reviewerName}
                  onChange={(e) => handleGovernanceChange('reviewerName', e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Decision Owner / Signatory
                </label>
                <input
                  type="text"
                  value={state.governance.decisionOwnerName}
                  onChange={(e) => handleGovernanceChange('decisionOwnerName', e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1 md:col-span-3">
                <label className="text-xs font-bold text-slate-700">
                  Autonomous Human Managerial Judgment Statement
                </label>
                <textarea
                  rows={2}
                  value={state.governance.autonomousDecisionStatement}
                  onChange={(e) => handleGovernanceChange('autonomousDecisionStatement', e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Portfolio Handover & Formative Review Controls */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-lg border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-base font-bold text-white">
                    Portfolio Handover &amp; Formative Evaluation
                  </h4>
                </div>
                <p className="text-xs text-slate-400">
                  Official deliverable file: <code className="text-indigo-300 font-mono font-semibold">{state.fileVersion}</code> containing Claim Register, 120-Word Memo, and Simulation Test Log.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset Workbench</span>
                </button>
                <button
                  type="button"
                  onClick={handleRunReview}
                  className="text-xs font-bold px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white shadow-md transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-200" />
                  <span>Run Formative Review</span>
                </button>
              </div>
            </div>

            {/* Formative Review Output Drawer */}
            {reviewReport && (
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        reviewReport.overallStatus === 'reviewed'
                          ? 'bg-emerald-500'
                          : reviewReport.overallStatus === 'needs_revision'
                          ? 'bg-rose-500'
                          : 'bg-amber-500'
                      }`}
                    ></span>
                    <span className="font-bold text-xs text-slate-100">
                      Review Status: {reviewReport.overallStatus.toUpperCase().replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    Passed {reviewReport.passedChecks} of {reviewReport.totalChecks} Checks ({Math.round((reviewReport.passedChecks / reviewReport.totalChecks) * 100)}%)
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {reviewReport.overallSummary}
                </p>

                {reviewReport.revisitRecommendations.length > 0 && (
                  <div className="space-y-1 p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200">
                    <strong className="block text-amber-300 font-semibold">Recommendations to Address:</strong>
                    <ul className="list-disc list-inside space-y-0.5">
                      {reviewReport.revisitRecommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Stage-by-Stage Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1.5">
                  {Object.entries(reviewReport.stages).map(([stageName, stageData]) => (
                    <div
                      key={stageName}
                      className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{stageData.title}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            stageData.status === 'reviewed'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : stageData.status === 'needs_revision'
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {stageData.passedCount} / {stageData.totalCount}
                        </span>
                      </div>
                      <div className="space-y-1 text-slate-400">
                        {stageData.checks.map((chk) => (
                          <div key={chk.id} className="flex items-center gap-1.5 text-[11px]">
                            {chk.passed ? (
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                            ) : (
                              <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                            )}
                            <span className={chk.passed ? 'text-slate-300' : 'text-amber-300'}>
                              {chk.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Educational Rubric Preview */}
            <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              {S14_RUBRIC.map((crit) => (
                <div key={crit.id} className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/60 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-200">
                    <span>{crit.name}</span>
                    <span className="text-teal-400">{crit.marks} pts</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{crit.description}</p>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    Evidence: {crit.evidenceExpected}
                  </div>
                </div>
              ))}
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
          {currentStepIdx === WIZARD_STEPS.length - 1 ? 'AI Automation Complete ✓' : 'Save & Continue →'}
        </button>
      </footer>
    </div>
  );
}
