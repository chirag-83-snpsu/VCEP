'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  S16_STORAGE_KEY,
  BASELINE_PRICE,
  VARIABLE_COST_PER_SEAT,
  FIXED_COSTS,
  BASELINE_DEMAND,
  MAX_CAPACITY,
  CANONICAL_METRICS,
  COMMERCIAL_DECISION_PRINCIPLES,
  COMMERCIAL_SCENARIOS,
  MAX_MEMO_WORD_COUNT,
  DEFAULT_DECISION_MEMO,
  DEFAULT_EVIDENCE_REQUIREMENTS,
  S16_RUBRIC,
  loadSession16State,
  saveSession16State,
  clearSession16State,
  type Session16State,
  type CommercialScenario,
} from './session-16-decision-data.ts';
import { evaluateSession16 } from '../../../lib/review-engine/session-rules/session-16.ts';
import type { SessionReviewReport } from '../../../lib/review-engine/types.ts';
import {
  Scale,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  FileText,
  Table,
  Check,
  CheckCircle2,
  HelpCircle,
  Sliders,
  ShieldAlert,
  UserCheck,
  Target,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Session16DecisionJourneyProps {
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

export function Session16DecisionJourney({ onUpdateDraft }: Session16DecisionJourneyProps) {
  const [state, setState] = useState<Session16State>(() => loadSession16State());
  const [reviewReport, setReviewReport] = useState<SessionReviewReport | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string>('S16-T01');

  const WIZARD_STEPS = [
    { id: 'S16-T01' as const, num: 1, label: 'TASK 01: Pricing Proposal', short: '1. Pricing Proposal' },
    { id: 'S16-T02' as const, num: 2, label: 'TASK 02: Contribution & Break-Even', short: '2. Contribution' },
    { id: 'S16-T03' as const, num: 3, label: 'TASK 03: Capacity & Sensitivity', short: '3. Sensitivity' },
    { id: 'S16-T04' as const, num: 4, label: 'TASK 04: Commercial Verdict', short: '4. Commercial Verdict' },
  ];

  const currentStepIdx = useMemo(() => {
    return Math.max(0, WIZARD_STEPS.findIndex((s) => s.id === activeTaskId));
  }, [activeTaskId]);

  // Initial mount sync
  useEffect(() => {
    const loaded = loadSession16State();
    setState(loaded);
    if (onUpdateDraft) {
      onUpdateDraft(
        'concept:explain',
        `Unit Contribution = ₹${BASELINE_PRICE - VARIABLE_COST_PER_SEAT} baseline vs ₹${CANONICAL_METRICS.proposedUnitContribution} discounted. Break-even volume rises from 20 to 24 seats.`
      );
      onUpdateDraft(
        'work-prompt:0',
        `Baseline 25 seats: ₹${CANONICAL_METRICS.baseRevenue.toLocaleString('en-IN')} revenue, ₹${CANONICAL_METRICS.baseOperatingProfit.toLocaleString('en-IN')} profit. Proposed 30 seats @ 10% disc: ₹${CANONICAL_METRICS.proposedRevenue.toLocaleString('en-IN')} revenue, ₹${CANONICAL_METRICS.proposedOperatingProfit.toLocaleString('en-IN')} profit (Zero Incremental Gain).`
      );
      onUpdateDraft('work-prompt:1', loaded.decisionMemo);
      onUpdateDraft('work-prompt:2', loaded.evidenceRequirements);
      onUpdateDraft(
        'team:contribution',
        `Calculated break-even volumes (20 vs 24 seats), proved 30 seats required to match baseline profit, and formulated a tiered counter-proposal.`
      );
      onUpdateDraft('team:judgement', loaded.governance.decisionOwnerName);
    }
  }, []);

  // Update state helper with auto-persistence and draft sync
  const updateState = (updater: (prev: Session16State) => Session16State) => {
    setState((prev) => {
      const next = updater(prev);
      saveSession16State(next);
      if (onUpdateDraft) {
        onUpdateDraft(
          'concept:explain',
          `Unit Contribution = ₹${BASELINE_PRICE - VARIABLE_COST_PER_SEAT} baseline vs ₹${CANONICAL_METRICS.proposedUnitContribution} discounted. Break-even volume rises from 20 to 24 seats.`
        );
        onUpdateDraft(
          'work-prompt:0',
          `Baseline 25 seats: ₹${CANONICAL_METRICS.baseRevenue.toLocaleString('en-IN')} revenue, ₹${CANONICAL_METRICS.baseOperatingProfit.toLocaleString('en-IN')} profit. Proposed 30 seats @ 10% disc: ₹${CANONICAL_METRICS.proposedRevenue.toLocaleString('en-IN')} revenue, ₹${CANONICAL_METRICS.proposedOperatingProfit.toLocaleString('en-IN')} profit (Zero Incremental Gain).`
        );
        onUpdateDraft('work-prompt:1', next.decisionMemo);
        onUpdateDraft('work-prompt:2', next.evidenceRequirements);
        onUpdateDraft(
          'team:contribution',
          `Calculated break-even volumes (20 vs 24 seats), proved 30 seats required to match baseline profit, and formulated a tiered counter-proposal.`
        );
        onUpdateDraft('team:judgement', next.governance.decisionOwnerName);
      }
      return next;
    });
  };

  // Slider change handlers
  const handleDiscountSliderChange = (pct: number) => {
    updateState((prev) => ({
      ...prev,
      sliderDiscountPct: pct,
    }));
  };

  const handleVolumeSliderChange = (vol: number) => {
    updateState((prev) => ({
      ...prev,
      sliderVolume: vol,
    }));
  };

  const handleScenarioSelect = (scenario: CommercialScenario) => {
    updateState((prev) => ({
      ...prev,
      activeScenarioId: scenario.id,
      sliderDiscountPct: scenario.discountPct,
      sliderVolume: scenario.demand,
      extraFixedCost: scenario.extraFixedCost,
    }));
  };

  const handleMinSeatsChange = (val: string) => {
    updateState((prev) => ({ ...prev, enteredMinSeats: val }));
  };

  const handleRecommendationChange = (rec: 'REJECT' | 'CONDITIONAL' | 'COUNTER') => {
    updateState((prev) => ({ ...prev, decisionRecommendation: rec }));
  };

  const handleMemoChange = (val: string) => {
    updateState((prev) => ({ ...prev, decisionMemo: val }));
  };

  const handleEvidenceChange = (val: string) => {
    updateState((prev) => ({ ...prev, evidenceRequirements: val }));
  };

  const handleGovernanceChange = (field: keyof Session16State['governance'], val: string) => {
    updateState((prev) => ({
      ...prev,
      governance: {
        ...prev.governance,
        [field]: val,
      },
    }));
  };

  const handleReset = () => {
    if (window.confirm('Reset all Session 16 scenario model inputs and decision memo to default?')) {
      clearSession16State();
      const fresh = loadSession16State();
      setState(fresh);
      setReviewReport(null);
    }
  };

  const handleRunReview = () => {
    const ctx = {
      sessionId: 16,
      stageId: 'Work',
      draft: {
        'concept:explain': `Unit Contribution = ₹${BASELINE_PRICE - VARIABLE_COST_PER_SEAT} baseline vs ₹${CANONICAL_METRICS.proposedUnitContribution} discounted. Break-even volume rises from 20 to 24 seats.`,
        'work-prompt:0': `Baseline 25 seats: ₹${CANONICAL_METRICS.baseRevenue.toLocaleString('en-IN')} revenue, ₹${CANONICAL_METRICS.baseOperatingProfit.toLocaleString('en-IN')} profit. Proposed 30 seats @ 10% disc: ₹${CANONICAL_METRICS.proposedRevenue.toLocaleString('en-IN')} revenue, ₹${CANONICAL_METRICS.proposedOperatingProfit.toLocaleString('en-IN')} profit (Zero Incremental Gain).`,
        'work-prompt:1': state.decisionMemo,
        'work-prompt:2': state.evidenceRequirements,
        'team:contribution': `Calculated break-even volumes (20 vs 24 seats), proved 30 seats required to match baseline profit, and formulated a tiered counter-proposal.`,
        'team:judgement': state.governance.decisionOwnerName,
        'min:seats': state.enteredMinSeats,
      },
      workstationData: {
        activeScenarioId: state.activeScenarioId,
        sliderDiscountPct: state.sliderDiscountPct,
        sliderVolume: state.sliderVolume,
        extraFixedCost: state.extraFixedCost,
        enteredMinSeats: state.enteredMinSeats,
        decisionRecommendation: state.decisionRecommendation,
        decisionMemo: state.decisionMemo,
        evidenceRequirements: state.evidenceRequirements,
        governance: state.governance,
        fileVersion: state.governance.fileVersion || 'StudentID_S16_v01.xlsx',
      },
    };
    const report = evaluateSession16(ctx);
    setReviewReport(report);
  };

  // Dynamic simulation computations
  const simPrice = useMemo(() => {
    return BASELINE_PRICE * (1 - state.sliderDiscountPct / 100);
  }, [state.sliderDiscountPct]);

  const simUnitContribution = useMemo(() => {
    return simPrice - VARIABLE_COST_PER_SEAT;
  }, [simPrice]);

  const simRevenue = useMemo(() => {
    return state.sliderVolume * simPrice;
  }, [state.sliderVolume, simPrice]);

  const simTotalVC = useMemo(() => {
    return state.sliderVolume * VARIABLE_COST_PER_SEAT;
  }, [state.sliderVolume]);

  const simTotalContribution = useMemo(() => {
    return state.sliderVolume * simUnitContribution;
  }, [state.sliderVolume, simUnitContribution]);

  const simTotalFixedCost = useMemo(() => {
    return FIXED_COSTS + (state.extraFixedCost || 0);
  }, [state.extraFixedCost]);

  const simProfit = useMemo(() => {
    return simTotalContribution - simTotalFixedCost;
  }, [simTotalContribution, simTotalFixedCost]);

  const simBreakEven = useMemo(() => {
    return simUnitContribution > 0 ? Math.ceil(simTotalFixedCost / simUnitContribution) : 0;
  }, [simTotalFixedCost, simUnitContribution]);

  const simCapacityUtil = useMemo(() => {
    return (state.sliderVolume / MAX_CAPACITY) * 100;
  }, [state.sliderVolume]);

  const incrementalProfit = useMemo(() => {
    return simProfit - CANONICAL_METRICS.baseOperatingProfit;
  }, [simProfit]);

  const incrementalRevenue = useMemo(() => {
    return simRevenue - CANONICAL_METRICS.baseRevenue;
  }, [simRevenue]);

  // Word count tracker
  const memoWordCount = useMemo(() => {
    return state.decisionMemo.trim().split(/\s+/).filter(Boolean).length;
  }, [state.decisionMemo]);

  const isMemoWordCountValid = memoWordCount > 0 && memoWordCount <= MAX_MEMO_WORD_COUNT;

  // Min seats validation
  const isMinSeatsAccurate = useMemo(() => {
    const val = parseInt(state.enteredMinSeats.replace(/[^0-9]/g, ''), 10);
    return val === 30 || state.enteredMinSeats.includes('30');
  }, [state.enteredMinSeats]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
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
              <span>Session 16 · Professional Workplace Experience</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Make the Decision with Numbers.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Sales proposes a 10% volume discount across all seats, claiming billed revenue will expand from ₹2,50,000 to ₹2,70,000 (+₹20,000). Management requires an objective commercial evaluation. Calculate unit contribution, evaluate break-even volume shifts, and prove why operating at 100% capacity for ₹0 incremental profit violates commercial discipline.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <a
              href="#vcep-area-proposal"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md transition-colors"
            >
              <span>1. Understand Pricing Proposal</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#vcep-area-decide"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-200 border border-indigo-500/30 text-sm font-semibold transition-colors"
            >
              <span>2. Compare Scenarios & Decide</span>
              <Sliders className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 4 Cardinal Principles of Commercial Decisions */}
        <div className="mt-8 pt-6 border-t border-indigo-900/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COMMERCIAL_DECISION_PRINCIPLES.map((principle) => (
            <div
              key={principle.principleNum}
              className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/60 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                  RULE 0{principle.principleNum}
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                  {principle.badge}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-slate-100">{principle.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{principle.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* HEADING 1: UNDERSTAND THE PRICING PROPOSAL */}
      {/* ==================================================== */}
      <section id="vcep-area-proposal" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-widest uppercase">
            <Scale className="w-4 h-4" />
            <span>Natural Heading 01</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            Understand the Pricing Proposal
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Inspect the approved policy baseline versus the corporate client proposal. Evaluate unit contribution, fixed overhead allocation, and capacity limits.
          </p>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TASK 01: UNDERSTAND THE PROPOSAL */}
        {/* ---------------------------------------------------- */}
        <TaskCard
          taskId="S16-T01"
          taskNumber="TASK 01"
          title="Task 01 — Understand the Proposal"
          instruction="Inspect baseline parameters and compare 25 seats at full price against 30 seats with discount."
          learningTakeaway="Evaluate volume discount proposals on incremental gross contribution, not total top-line revenue."
          whyMatters="Rigorous pricing begins with clear baseline inventory. Confusing fixed overhead with variable costs or ignoring physical delivery limits leads to fatal commercial commitments."
          statusText="Approved Case Ground Truth"
          outputBadge="Output: Baseline Parameter Inventory"
          isActive={activeTaskId === 'S16-T01'}
          onSelectTask={() => setActiveTaskId('S16-T01')}
        >
          {/* Essential Parameter Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 p-3.5 space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Standard Price</div>
              <div className="text-lg font-mono font-bold text-slate-900 dark:text-slate-100">₹10,000</div>
              <div className="text-[11px] text-slate-400">Net price per seat</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 p-3.5 space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Variable Cost</div>
              <div className="text-lg font-mono font-bold text-slate-900 dark:text-slate-100">₹4,000</div>
              <div className="text-[11px] text-slate-400">Direct delivery per seat</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 p-3.5 space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Fixed Overhead</div>
              <div className="text-lg font-mono font-bold text-slate-900 dark:text-slate-100">₹1,20,000</div>
              <div className="text-[11px] text-slate-400">Total cohort cost</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 p-3.5 space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Baseline Demand</div>
              <div className="text-lg font-mono font-bold text-indigo-600 dark:text-indigo-400">25 seats</div>
              <div className="text-[11px] text-slate-400">83.3% capacity use</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 p-3.5 space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Maximum Capacity</div>
              <div className="text-lg font-mono font-bold text-amber-600 dark:text-amber-400">30 seats</div>
              <div className="text-[11px] text-slate-400">Strict physical limit</div>
            </div>
          </div>

          {/* Curriculum Boundary Callout */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5" />
            <div>
              <strong>Classroom Case Boundary:</strong> Tax and collection cash-timing are ignored strictly within this scenario model. All analysis focuses on economic contribution and break-even viability.
            </div>
          </div>
        </TaskCard>

        {/* ---------------------------------------------------- */}
        {/* TASK 02: CALCULATE CONTRIBUTION */}
        {/* ---------------------------------------------------- */}
        <TaskCard
          taskId="S16-T02"
          taskNumber="TASK 02"
          title="Task 02 — Calculate Contribution & Break-Even"
          instruction="Calculate unit contribution, break-even seats, and projected operating profits across baseline and discounted scenarios."
          learningTakeaway="Price cuts decrease unit contribution margins, raising the break-even volume required for solvency."
          whyMatters="Top-line revenue expansion is an illusion if unit contribution is compressed. The break-even volume shift from 20 to 24 seats increases operational downside vulnerability by 20%."
          statusText="20 vs 24 Break-Even Seats"
          outputBadge="Output: Comparative Pricing Matrix"
          isActive={activeTaskId === 'S16-T02'}
          onSelectTask={() => setActiveTaskId('S16-T02')}
        >
          {/* Side-by-Side Comparative Commercial Matrix Table */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Table className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Side-by-Side Commercial Evaluation Matrix</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Exact comparison between approved baseline policy and proposed 10% volume discount.
                </p>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                Baseline (25) vs Discounted (30)
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Commercial Measure</th>
                    <th className="py-2.5 px-3 text-right">Baseline Policy (25 Seats)</th>
                    <th className="py-2.5 px-3 text-right">Discount Proposal (30 Seats @ 10%)</th>
                    <th className="py-2.5 px-3 text-center">Variance / Commercial Reality</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-medium">Unit Selling Price</td>
                    <td className="py-2.5 px-3 text-right font-mono">₹{BASELINE_PRICE.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-rose-600 font-semibold">₹{CANONICAL_METRICS.proposedPrice.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-rose-600">-₹1,000 (-10.0%)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-medium">Variable Cost per Seat</td>
                    <td className="py-2.5 px-3 text-right font-mono">₹{VARIABLE_COST_PER_SEAT.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right font-mono">₹{VARIABLE_COST_PER_SEAT.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-center text-slate-400 font-mono">₹0 (Unchanged)</td>
                  </tr>
                  <tr className="bg-indigo-50/40 dark:bg-indigo-950/20 font-semibold">
                    <td className="py-2.5 px-3 text-indigo-950 dark:text-indigo-200">Unit Contribution (Price − VC)</td>
                    <td className="py-2.5 px-3 text-right font-mono text-indigo-900 dark:text-indigo-300">₹{CANONICAL_METRICS.baseUnitContribution.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-rose-600 font-bold">₹{CANONICAL_METRICS.proposedUnitContribution.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-rose-600 font-bold">-₹1,000 (-16.7% compressed margin)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-medium">Expected Volume (Seats)</td>
                    <td className="py-2.5 px-3 text-right font-mono">25 seats</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-slate-100">30 seats</td>
                    <td className="py-2.5 px-3 text-center font-mono text-emerald-600 font-semibold">+5 seats (+20.0%)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-medium">Break-Even Seats (FC ÷ Unit Contribution)</td>
                    <td className="py-2.5 px-3 text-right font-mono text-indigo-600 font-bold">20 seats</td>
                    <td className="py-2.5 px-3 text-right font-mono text-rose-600 font-bold">24 seats</td>
                    <td className="py-2.5 px-3 text-center font-mono text-rose-600 font-bold">+4 seats (+20.0% higher operational risk)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-medium">Billed Revenue</td>
                    <td className="py-2.5 px-3 text-right font-mono">₹{CANONICAL_METRICS.baseRevenue.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-600 font-bold">₹{CANONICAL_METRICS.proposedRevenue.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-emerald-600 font-semibold">+₹20,000 (+8.0% top-line illusion)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-medium">Total Variable Costs (Seats × ₹4k)</td>
                    <td className="py-2.5 px-3 text-right font-mono">₹{CANONICAL_METRICS.baseTotalVC.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-rose-600 font-semibold">₹{CANONICAL_METRICS.proposedTotalVC.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-rose-600">+₹20,000 (+20.0% cost surge)</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 font-semibold">
                    <td className="py-2.5 px-3">Total Contribution</td>
                    <td className="py-2.5 px-3 text-right font-mono">₹{CANONICAL_METRICS.baseTotalContribution.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right font-mono">₹{CANONICAL_METRICS.proposedTotalContribution.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-amber-600 font-bold">₹0 (Zero Contribution Expansion!)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-medium">Fixed Overhead</td>
                    <td className="py-2.5 px-3 text-right font-mono">₹{FIXED_COSTS.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right font-mono">₹{FIXED_COSTS.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-center text-slate-400 font-mono">₹0 (Unchanged)</td>
                  </tr>
                  <tr className="bg-amber-100/50 dark:bg-amber-950/40 font-bold border-t-2 border-b-2 border-amber-300 dark:border-amber-800">
                    <td className="py-3 px-3 text-amber-950 dark:text-amber-100 text-sm">Net Operating Profit</td>
                    <td className="py-3 px-3 text-right font-mono text-base text-slate-900 dark:text-slate-100">₹{CANONICAL_METRICS.baseOperatingProfit.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-mono text-base text-amber-700 dark:text-amber-300">₹{CANONICAL_METRICS.proposedOperatingProfit.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-center font-mono text-amber-700 dark:text-amber-300 font-extrabold">₹0 (ZERO INCREMENTAL PROFIT!)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-medium">Capacity Utilization (Max 30 Seats)</td>
                    <td className="py-2.5 px-3 text-right font-mono">83.3% (5 seats buffer)</td>
                    <td className="py-2.5 px-3 text-right font-mono text-rose-600 font-bold">100.0% (0 buffer!)</td>
                    <td className="py-2.5 px-3 text-center font-mono text-rose-600 font-semibold">+16.7 pp (Exhausted Reserve)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-medium">Minimum Seats to Match Baseline Profit</td>
                    <td className="py-2.5 px-3 text-right font-mono">—</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-indigo-600">30 seats</td>
                    <td className="py-2.5 px-3 text-center font-mono text-indigo-600 font-semibold">Requires 100% capacity just to tie!</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>The Commercial Trap Revealed:</strong> Expanding revenue by ₹20,000 adds ₹20,000 in direct variable costs ($5 \times ₹4,000$). Because unit contribution contracted from ₹6,000 to ₹5,000, <strong>all ₹20,000 of top-line revenue is entirely eaten by extra variable costs and price concessions</strong>. You take on 5 extra delivery commitments at 100% capacity for ₹0 additional return!
              </div>
            </div>
          </div>
        </TaskCard>
      </section>

      {/* ==================================================== */}
      {/* HEADING 2: COMPARE SCENARIOS & DECIDE */}
      {/* ==================================================== */}
      <section id="vcep-area-decide" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-widest uppercase">
            <Sliders className="w-4 h-4" />
            <span>Natural Heading 02</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            Compare Scenarios & Decide
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Vary demand and pricing in a safe sensitivity simulator, stress-test downside risks (Independent Practice 04), and issue an executive decision memo.
          </p>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TASK 03: TEST DEMAND AND CAPACITY */}
        {/* ---------------------------------------------------- */}
        <TaskCard
          taskId="S16-T03"
          taskNumber="TASK 03"
          title="Task 03 — Test Demand & Capacity Constraints"
          instruction="Model downside volume sensitivity and verify the minimum 30 seats needed to match baseline profit."
          learningTakeaway="Verify whether customer demand and operational capacity can realistically deliver the required volume."
          whyMatters="Testing downside variations proves whether a proposal is robust against soft demand. The 30-seat requirement consumes 100% of capacity, leaving zero margin for cancellations."
          statusText="30-Seat Equivalence Proof"
          outputBadge="Output: Sensitivity Model & Downside Drill"
          isActive={activeTaskId === 'S16-T03'}
          onSelectTask={() => setActiveTaskId('S16-T03')}
        >
          <div className="space-y-6">
            {/* Preset Scenario Cards */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider">
                Curriculum Simulation Scenarios & Independent Practice 04 Drills
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {COMMERCIAL_SCENARIOS.map((scen) => (
                  <button
                    key={scen.id}
                    onClick={() => handleScenarioSelect(scen)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      state.activeScenarioId === scen.id
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-500/30'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {scen.badge}
                        </span>
                        <span
                          className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                            scen.riskLevel === 'Optimal'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : scen.riskLevel === 'Zero Gain'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : scen.riskLevel === 'Margin Protected'
                              ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {scen.riskLevel}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{scen.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                        {scen.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono">
                      <span>Profit:</span>
                      <strong
                        className={
                          scen.profitOutcome > 30000
                            ? 'text-emerald-600'
                            : scen.profitOutcome === 30000
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        }
                      >
                        ₹{scen.profitOutcome.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Two-Option Sensitivity Simulator */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50/50 dark:bg-slate-900/60 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Interactive Sensitivity Simulator</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Vary discount percentage and contracted volume safely without altering approved baseline parameters.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Baseline Reference: ₹30,000 Profit @ 25 Seats
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Control 1: Discount Slider */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Discount Concession (%):
                    </span>
                    <span className="text-sm font-mono font-bold text-rose-600">
                      {state.sliderDiscountPct}% (Price: ₹{simPrice.toLocaleString('en-IN')})
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={25}
                    step={1}
                    value={state.sliderDiscountPct}
                    onChange={(e) => handleDiscountSliderChange(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>0% (₹10,000)</span>
                    <span>10% (₹9,000)</span>
                    <span>20% (₹8,000)</span>
                    <span>25% (₹7,500)</span>
                  </div>
                </div>

                {/* Control 2: Volume Slider */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Contracted Volume (Seats):
                    </span>
                    <span className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {state.sliderVolume} seats ({simCapacityUtil.toFixed(1)}% Capacity)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={30}
                    step={1}
                    value={state.sliderVolume}
                    onChange={(e) => handleVolumeSliderChange(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>20 seats (BE)</span>
                    <span>25 seats (Base)</span>
                    <span>28 seats (IP 04)</span>
                    <span>30 seats (Max)</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Simulator Output Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Unit Contribution</span>
                  <div className="text-base font-mono font-bold text-slate-900 dark:text-slate-100">
                    ₹{simUnitContribution.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-400">₹{simPrice.toLocaleString('en-IN')} − ₹4k VC</span>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Break-Even Seats</span>
                  <div className="text-base font-mono font-bold text-indigo-600">
                    {simBreakEven} seats
                  </div>
                  <span className="text-[10px] text-slate-400">FC ÷ Unit Contrib (Rounded)</span>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Projected Profit</span>
                  <div
                    className={`text-base font-mono font-bold ${
                      simProfit > 30000
                        ? 'text-emerald-600'
                        : simProfit === 30000
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  >
                    ₹{simProfit.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-400">Total Contrib − Total FC</span>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Variance vs Baseline</span>
                  <div
                    className={`text-base font-mono font-bold ${
                      incrementalProfit > 0
                        ? 'text-emerald-600'
                        : incrementalProfit === 0
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {incrementalProfit >= 0 ? '+' : ''}₹{incrementalProfit.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-400">Vs baseline ₹30,000 profit</span>
                </div>
              </div>

              {/* Dynamic Commercial Evaluation Banner */}
              <div
                className={`p-4 rounded-xl border flex items-center gap-3 ${
                  incrementalProfit > 0
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                    : incrementalProfit === 0
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60'
                    : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60'
                }`}
              >
                {incrementalProfit > 0 ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : incrementalProfit === 0 ? (
                  <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
                )}
                <div className="space-y-0.5">
                  <div
                    className={`text-xs font-bold ${
                      incrementalProfit > 0
                        ? 'text-emerald-900 dark:text-emerald-200'
                        : incrementalProfit === 0
                        ? 'text-amber-900 dark:text-amber-200'
                        : 'text-rose-900 dark:text-rose-200'
                    }`}
                  >
                    {incrementalProfit === 0
                      ? 'Zero Economic Gain (Capacity Trap): You are operating 5 extra seats at 100% capacity for ₹0 additional profit.'
                      : incrementalProfit > 0
                      ? `Margin Expanding Deal: This structure adds +₹${incrementalProfit.toLocaleString('en-IN')} in net operating profit.`
                      : `Value Destroying Concession: Total profit drops -₹${Math.abs(incrementalProfit).toLocaleString('en-IN')} below baseline policy!`}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Revenue is {incrementalRevenue >= 0 ? '+' : ''}₹{incrementalRevenue.toLocaleString('en-IN')} ({incrementalRevenue >= 0 ? '+' : ''}{((incrementalRevenue / CANONICAL_METRICS.baseRevenue) * 100).toFixed(1)}%), but economic profit impact is what governs business survival.
                  </p>
                </div>
              </div>
            </div>

            {/* Minimum Discounted Seats Proof */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Break-Even Equivalence Proof
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Target Profit: ₹30,000
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Minimum Discounted Seats to Match Baseline Profit
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calculate the exact number of discounted seats (@ ₹9,000) needed to generate the baseline profit of ₹30,000.
              </p>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-mono text-xs space-y-1 text-slate-700 dark:text-slate-300">
                <div>Required Contribution = Fixed Overhead (₹1,20,000) + Baseline Profit (₹30,000) = ₹1,50,000</div>
                <div>Discounted Unit Contribution = ₹9,000 − ₹4,000 = ₹5,000</div>
                <div>Seats Needed = ₹1,50,000 ÷ ₹5,000 = <strong>30 seats</strong></div>
              </div>

              <div className="pt-1 flex items-center gap-3">
                <div className="relative w-36">
                  <input
                    type="text"
                    value={state.enteredMinSeats}
                    onChange={(e) => handleMinSeatsChange(e.target.value)}
                    className="w-full text-base font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-slate-100 pr-10 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-2 text-slate-400 font-bold text-xs">seats</span>
                </div>
                {isMinSeatsAccurate ? (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="w-4 h-4" /> 30 Seats Verified (100% Capacity)
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    Expected: 30 seats
                  </span>
                )}
              </div>
            </div>
          </div>
        </TaskCard>

        {/* ---------------------------------------------------- */}
        {/* TASK 04: RECOMMEND A DECISION */}
        {/* ---------------------------------------------------- */}
        <TaskCard
          taskId="S16-T04"
          taskNumber="TASK 04"
          title="Task 04 — Recommend a Commercial Decision"
          instruction="Draft a 130-word executive decision memo recommending a commercial verdict with explicit data conditions."
          learningTakeaway="Commercial recommendations must weigh profit impact against customer delivery capacity and downside risks."
          whyMatters="Strategic finance professionals do not simply reject sales proposals—they propose structured counter-proposals (tiered discounts) and enforce demand verification conditions before contractual sign-off."
          statusText="≤ 130 Words Compliant"
          outputBadge="Output: Executive Decision Memo & Handover"
          isActive={activeTaskId === 'S16-T04'}
          onSelectTask={() => setActiveTaskId('S16-T04')}
        >
          <div className="space-y-6">
            {/* Managerial Decision Recommendation Selector */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Managerial Recommendation
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                  Commercial Verdict on 10% Discount Proposal
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select your formal recommendation to executive leadership based on quantitative proof.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  onClick={() => handleRecommendationChange('COUNTER')}
                  className={`p-3 rounded-lg border flex items-start gap-3 cursor-pointer transition-colors ${
                    state.decisionRecommendation === 'COUNTER'
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="rec"
                    checked={state.decisionRecommendation === 'COUNTER'}
                    onChange={() => handleRecommendationChange('COUNTER')}
                    className="mt-1 text-indigo-600"
                  />
                  <div className="text-xs">
                    <strong className="block text-slate-900 dark:text-slate-100 font-bold">
                      Strategic Counter-Proposal (Recommended)
                    </strong>
                    <span className="text-slate-500 dark:text-slate-400">
                      Tiered pricing: standard ₹10k on baseline 25 seats, 10% discount on incremental seats 26–30 only (+₹5,000 genuine profit).
                    </span>
                  </div>
                </label>

                <label
                  onClick={() => handleRecommendationChange('REJECT')}
                  className={`p-3 rounded-lg border flex items-start gap-3 cursor-pointer transition-colors ${
                    state.decisionRecommendation === 'REJECT'
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="rec"
                    checked={state.decisionRecommendation === 'REJECT'}
                    onChange={() => handleRecommendationChange('REJECT')}
                    className="mt-1 text-indigo-600"
                  />
                  <div className="text-xs">
                    <strong className="block text-slate-900 dark:text-slate-100 font-bold">
                      Direct Rejection
                    </strong>
                    <span className="text-slate-500 dark:text-slate-400">
                      Reject blanket discount outright: 100% capacity exhaustion for ₹0 profit gain with elevated downside risk.
                    </span>
                  </div>
                </label>

                <label
                  onClick={() => handleRecommendationChange('CONDITIONAL')}
                  className={`p-3 rounded-lg border flex items-start gap-3 cursor-pointer transition-colors ${
                    state.decisionRecommendation === 'CONDITIONAL'
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="rec"
                    checked={state.decisionRecommendation === 'CONDITIONAL'}
                    onChange={() => handleRecommendationChange('CONDITIONAL')}
                    className="mt-1 text-indigo-600"
                  />
                  <div className="text-xs">
                    <strong className="block text-slate-900 dark:text-slate-100 font-bold">
                      Conditional Approval with Guarantees
                    </strong>
                    <span className="text-slate-500 dark:text-slate-400">
                      Approve only if client provides 100% non-refundable advance deposits for all 30 seats and multi-cohort commitments.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Executive Decision Memo & Demand Evidence */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Executive Decision Memo & Demand Evidence</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Draft a disciplined executive brief strictly under 130 words articulating assumptions, capacity risks, and required demand verification evidence.
                  </p>
                </div>
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                    isMemoWordCountValid
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {memoWordCount} / {MAX_MEMO_WORD_COUNT} Words {isMemoWordCountValid ? '✓' : '(Exceeds Limit!)'}
                </span>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Executive Recommendation Brief (Max 130 Words)
                  </label>
                  <textarea
                    rows={5}
                    value={state.decisionMemo}
                    onChange={(e) => handleMemoChange(e.target.value)}
                    className={`w-full text-xs rounded-xl border p-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed font-sans ${
                      isMemoWordCountValid
                        ? 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                        : 'border-rose-400 bg-rose-50/20'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Demand Verification Evidence Requirements (Never Assume Unverified Demand)
                  </label>
                  <textarea
                    rows={3}
                    value={state.evidenceRequirements}
                    onChange={(e) => handleEvidenceChange(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Deliverable Governance & Named Review Roles */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Deliverable Governance & Named Review Roles</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Record individual accountability. Commercial decisions require named separation of duties between analysis, review, and executive sign-off.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Preparer Name & Title
                  </label>
                  <input
                    type="text"
                    value={state.governance.preparerName}
                    onChange={(e) => handleGovernanceChange('preparerName', e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Finance Reviewer Name
                  </label>
                  <input
                    type="text"
                    value={state.governance.reviewerName}
                    onChange={(e) => handleGovernanceChange('reviewerName', e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Commercial Decision Owner
                  </label>
                  <input
                    type="text"
                    value={state.governance.decisionOwnerName}
                    onChange={(e) => handleGovernanceChange('decisionOwnerName', e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Portfolio Handover & Formative Review Drawer */}
            <div className="bg-slate-900 text-white rounded-xl p-5 shadow-lg border border-slate-800 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-base font-bold text-white">
                      Portfolio Handover & Formative Review
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    Official deliverable file: <code className="text-indigo-300 font-mono font-semibold">{state.governance.fileVersion}</code> containing comparative matrix, sensitivity model, and conditional decision memo.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReset}
                    className="text-xs font-medium px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reset Inputs</span>
                  </button>
                  <button
                    onClick={handleRunReview}
                    className="text-xs font-bold px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white shadow-md transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                    <span>Run Formative Review</span>
                  </button>
                </div>
              </div>

              {/* Formative Review Drawer Output */}
              {reviewReport && (
                <div className="rounded-xl bg-slate-950 p-5 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
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
                      <span className="font-bold text-sm text-slate-100">
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
                    <div className="space-y-1.5 p-3 rounded-lg bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200">
                      <strong className="block text-amber-300 font-semibold">Recommendations to Address:</strong>
                      <ul className="list-disc list-inside space-y-1">
                        {reviewReport.revisitRecommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Stage-by-Stage Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {Object.entries(reviewReport.stages).map(([stageName, stageData]) => (
                      <div
                        key={stageName}
                        className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1.5"
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
              <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {S16_RUBRIC.map((crit) => (
                  <div key={crit.id} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60 space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-200">
                      <span>{crit.name}</span>
                      <span className="text-indigo-400">{crit.marks} pts</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{crit.description}</p>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">
                      Evidence: {crit.evidenceExpected}
                    </div>
                  </div>
                ))}
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
          {currentStepIdx === WIZARD_STEPS.length - 1 ? 'Commercial Evaluation Complete ✓' : 'Save & Continue →'}
        </button>
      </footer>
    </div>
  );
}
