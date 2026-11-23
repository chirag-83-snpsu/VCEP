'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Layers,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Users,
  CheckSquare,
  FileSpreadsheet,
  AlertOctagon,
  ArrowRight,
  Info,
  CheckCircle2,
  XCircle,
  Save,
  RotateCcw,
  Target,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import {
  CASE_F_INVOICES,
  CASE_F_LIQUIDITY_SUMMARY,
  CAPSTONE_CONSTRAINTS,
  SOLUTION_OPTIONS,
  INITIAL_SCOPE_ITEMS,
  INITIAL_WBS_TASKS,
  INITIAL_ACCEPTANCE_CRITERIA,
  INITIAL_RISK_REGISTER,
  DEFAULT_SESSION_18_STATE,
  S18_RUBRIC,
  getStoredSession18State,
  setStoredSession18State,
  type Session18State,
  type SolutionOption,
  type ScopeItem,
  type WbsTask,
  type AcceptanceCriterion,
  type RiskItem,
} from './session-18-planning-data.ts';
import { evaluateSession18 } from '../../../lib/review-engine/session-rules/session-18.ts';

interface TaskCardProps {
  taskId: string;
  taskNumber: string;
  title: string;
  instruction: string;
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
        background: '#ffffff',
        border: '1px solid #DCE5E9',
        borderLeft: isActive ? '3px solid #0F766E' : '1px solid #DCE5E9',
        borderRadius: '16px',
        padding: 'clamp(18px, 2.5vw, 24px)',
        marginBottom: '28px',
        boxShadow: isActive ? '0 4px 16px rgba(15, 118, 110, 0.08)' : '0 2px 8px rgba(0, 0, 0, 0.03)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        outline: 'none',
      }}
    >
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

interface Session18PlanningJourneyProps {
  onUpdateDraft?: (field: string, value: string) => void;
}

export function Session18PlanningJourney({ onUpdateDraft }: Session18PlanningJourneyProps) {
  const [state, setState] = useState<Session18State>(getStoredSession18State);
  const [activeTaskId, setActiveTaskId] = useState<string>('S18-T01');
  const [draftTimestamp, setDraftTimestamp] = useState<string>('');

  useEffect(() => {
    const loaded = getStoredSession18State();
    setState(loaded);
    if (loaded.timestamp) setDraftTimestamp(loaded.timestamp);
  }, []);

  const saveState = (updated: Session18State) => {
    const timestamp = new Date().toLocaleTimeString();
    const withTimestamp = { ...updated, timestamp };
    setState(withTimestamp);
    setDraftTimestamp(timestamp);
    setStoredSession18State(withTimestamp);

    if (onUpdateDraft) {
      onUpdateDraft('solution:rationale', updated.solutionRationale);
      onUpdateDraft('handover:notes', updated.handoverNotes);
    }
  };

  const handleSelectSolution = (solId: 'option-a' | 'option-b') => {
    saveState({ ...state, selectedSolution: solId });
  };

  const handleToggleScopeItem = (itemId: string) => {
    const updated = state.scopeItems.map((item) =>
      item.id === itemId ? { ...item, isIncluded: !item.isIncluded } : item
    );
    saveState({ ...state, scopeItems: updated });
  };

  const handleUpdateTaskHours = (taskId: string, hours: number) => {
    const updated = state.tasks.map((t) =>
      t.id === taskId ? { ...t, hours: Math.max(0, hours) } : t
    );
    saveState({ ...state, tasks: updated });
  };

  const handleToggleCriterion = (critId: string) => {
    const updated = state.acceptanceCriteria.map((c) =>
      c.id === critId ? { ...c, passed: !c.passed } : c
    );
    saveState({ ...state, acceptanceCriteria: updated });
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
        localStorage.removeItem('vcep:s18:drive-v3:student-workstation');
      } catch {}
    }
    setState(DEFAULT_SESSION_18_STATE);
    setDraftTimestamp('');
  };

  // Calculations
  const hoursByOwner = useMemo(() => {
    return state.tasks.reduce((acc, t) => {
      acc[t.owner] = (acc[t.owner] || 0) + t.hours;
      return acc;
    }, {} as Record<string, number>);
  }, [state.tasks]);

  const totalSquadHours = useMemo(() => {
    return state.tasks.reduce((sum, t) => sum + t.hours, 0);
  }, [state.tasks]);

  const maxIndividualHours = useMemo(() => {
    return Math.max(0, ...Object.values(hoursByOwner));
  }, [hoursByOwner]);

  const anyOwnerExceedsCap = maxIndividualHours > CAPSTONE_CONSTRAINTS.maxStudentHours;

  // Review Engine
  const reviewReport = useMemo(() => {
    return evaluateSession18({
      sessionId: 18,
      lesson: { id: 18, title: 'Solution Design and Project Planning' },
      draft: {
        'concept:explain': state.solutionRationale,
        'work-prompt:0': state.solutionRationale,
        'work-prompt:1': `${state.tasks.length} tasks scheduled across 10 days`,
        'work-prompt:2': state.handoverNotes,
        'solution:rationale': state.solutionRationale,
        'handover:notes': state.handoverNotes,
      },
      workstationData: state,
    });
  }, [state]);

  const checklistItems = [
    'I evaluated Option A (Dynamic Spreadsheet) vs Option B (Static Slide Presentation) on accuracy, updateability, and effort.',
    'I enforced strict scope boundaries, isolating Must-Haves from Nice-to-Haves and explicit Out-of-Scope exclusions.',
    'I defined 5 binary (PASS/FAIL) acceptance test gates covering Case F control total, due-today rule, dispute quarantine, and liquidity.',
    'I built a 10-day Work Breakdown Structure with RACI role assignments, dependencies, and individual effort <= 6.0 hours.',
    'I logged project delivery risks and confirmed a strictly read-only client handover with zero live production system writes.',
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12" style={{ color: '#17245C' }}>
      {/* ==================================================== */}
      {/* EXECUTIVE MISSION BANNER */}
      {/* ==================================================== */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
              <span>Session 18 · Professional Workplace Experience</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Choose a Solution. Plan the Delivery.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Design a feasible solution for the Vayentra Labs founder to resolve the ₹20,000 liquidity deficit. Compare dynamic spreadsheets against slide presentations, enforce strict scope boundaries, formulate five binary acceptance test gates, and schedule a 10-day WBS capped at 6.0 individual hours.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <a
              href="#vcep-area-solution"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold shadow-md transition-colors"
            >
              <span>1. Select Feasible Solution</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#vcep-area-plan"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-200 border border-teal-500/30 text-sm font-semibold transition-colors"
            >
              <span>2. Plan Tasks & Tests</span>
              <Calendar className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Capstone Grounding & Case F Brief Banner */}
        <div className="mt-8 pt-6 border-t border-indigo-900/60 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Timeframe Constraint</span>
            <div className="text-base font-bold text-amber-300 mt-1">10 Working Days</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Strict deadline following Session 17 discovery</p>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Individual Effort Cap</span>
            <div className="text-base font-bold text-teal-300 mt-1">≤ 6.0h / Student</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Protects cohort workload and prevents burnout</p>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Case F Control Total</span>
            <div className="text-base font-bold text-sky-300 mt-1">₹1,00,000 (4 Invoices)</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Resolves immediate ₹20,000 payroll deficit</p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* NATURAL HEADING 1: SELECT THE FEASIBLE SOLUTION                 */}
      {/* ============================================================== */}
      <section id="vcep-area-solution" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 text-xs font-bold tracking-widest uppercase">
            <Layers className="w-4 h-4" />
            <span>Natural Heading 01</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            Select the Feasible Solution
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Compare delivery architectures for the Vayentra Labs capstone challenge, justify your selection against accuracy, updateability, and effort limits, and enforce strict scope boundaries.
          </p>
        </div>

        {/* TASK 01: COMPARE SOLUTIONS */}
        <TaskCard
          taskId="S18-T01"
          taskNumber="TASK 01"
          title="Task 01 — Compare Solutions"
          instruction="Evaluate Option A (dynamic spreadsheet) against Option B (slide-only deck) on accuracy, updateability, and delivery feasibility within 6 student hours."
          whyMatters="Selecting an inappropriate delivery format leads to capstone failure. Dynamic spreadsheets provide live formula auditability and instant As-Of date refresh that static presentation decks cannot deliver."
          statusText={state.selectedSolution === 'option-a' ? 'Option A Selected' : 'Option B Selected'}
          outputBadge="Output: Architecture Justification"
          isActive={activeTaskId === 'S18-T01'}
          onSelectTask={() => setActiveTaskId('S18-T01')}
        >
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-700" />
                <span className="text-xs font-bold text-slate-800">
                  Architectural Options Comparison: Spreadsheet vs Slide Deck
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Click a card below to select and justify your architectural approach
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {SOLUTION_OPTIONS.map((opt) => {
                const isSelected = state.selectedSolution === opt.id;
                const isOptA = opt.id === 'option-a';
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectSolution(opt.id)}
                    className={`rounded-xl p-4 transition-all cursor-pointer border ${
                      isSelected
                        ? isOptA
                          ? 'border-teal-600 bg-teal-50/50 shadow-sm'
                          : 'border-rose-600 bg-rose-50/50 shadow-sm'
                        : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            isOptA
                              ? 'bg-teal-100 text-teal-800 border border-teal-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {opt.format}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">
                          {opt.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">{opt.subtitle}</p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap ${
                          isSelected
                            ? isOptA
                              ? 'bg-teal-700 text-white'
                              : 'bg-rose-700 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isSelected ? (isOptA ? 'SELECTED (APPROVED)' : 'SELECTED (REJECTED)') : 'CLICK TO SELECT'}
                      </span>
                    </div>

                    {/* Dimension Breakdown */}
                    <div className="space-y-2 text-xs text-slate-700">
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                        <strong className="text-teal-800 block text-[11px]">1. Accuracy & Mathematical Integrity:</strong>
                        <p className="text-slate-600 text-[11.5px] mt-0.5 leading-relaxed">{opt.accuracy}</p>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                        <strong className="text-teal-800 block text-[11px]">2. Updateability & As-Of Date Refresh:</strong>
                        <p className="text-slate-600 text-[11.5px] mt-0.5 leading-relaxed">{opt.updateability}</p>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                        <strong className="text-teal-800 block text-[11px]">3. Delivery Feasibility (≤ 6h Cap):</strong>
                        <p className="text-slate-600 text-[11.5px] mt-0.5 leading-relaxed">{opt.effortAndFeasibility}</p>
                      </div>
                    </div>

                    <div
                      className={`mt-3 p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                        isOptA ? 'bg-teal-100 text-teal-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isOptA ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                      <span>{opt.verdict}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rationale Editor */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-slate-800 block">
                Solution Architecture Justification & Trade-off Analysis:
              </label>
              <textarea
                rows={3}
                value={state.solutionRationale}
                onChange={(e) => saveState({ ...state, solutionRationale: e.target.value })}
                placeholder="Explain why Option A is selected over Option B on user utility, formula auditability, and delivery feasibility within 6 hours..."
                className="w-full text-xs rounded-xl border border-slate-300 bg-white p-3 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none leading-relaxed font-sans"
              />
              <div className="flex justify-between items-center text-[11px] text-slate-500 pt-0.5">
                <span>Highlight how live formulas and date parameterization assist the Managing Director during weekly cash reviews.</span>
                <span className="font-mono">{state.solutionRationale.split(/\s+/).filter(Boolean).length} words</span>
              </div>
            </div>
          </div>
        </TaskCard>

        {/* TASK 02: DEFINE THE SCOPE */}
        <TaskCard
          taskId="S18-T02"
          taskNumber="TASK 02"
          title="Task 02 — Define the Scope"
          instruction="Select mandatory capstone deliverables while enforcing strict scope exclusions against live ERP writes, automated debtor messaging, and cross-dataset joins."
          whyMatters="Uncontrolled scope creep is the leading cause of delivery failure. Explicitly bounding the project to a read-only spreadsheet model protects student effort under the 6-hour ceiling."
          statusText={`${state.scopeItems.filter((i) => i.isIncluded).length} / ${state.scopeItems.length} Features Scoped`}
          outputBadge="Output: Scope Boundaries & Exclusions"
          isActive={activeTaskId === 'S18-T02'}
          onSelectTask={() => setActiveTaskId('S18-T02')}
        >
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-teal-700" />
                <span className="text-xs font-bold text-slate-800">
                  Scope Discipline: Must-Haves, Nice-to-Haves & Prohibitions
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Must-Have
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                  Nice-to-Have
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                  Exclusion
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {state.scopeItems.map((item) => {
                const isMust = item.category === 'must-have';
                const isNice = item.category === 'nice-to-have';
                const isExclusion = item.category === 'exclusion';

                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleScopeItem(item.id)}
                    className={`rounded-xl p-3.5 border transition-all cursor-pointer ${
                      item.isIncluded
                        ? isExclusion
                          ? 'border-rose-400 bg-rose-50/70'
                          : isMust
                          ? 'border-emerald-400 bg-emerald-50/60'
                          : 'border-amber-400 bg-amber-50/60'
                        : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={item.isIncluded}
                          onChange={() => {}}
                          className="rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                        />
                        <strong className="text-xs font-bold text-slate-900 leading-snug">{item.title}</strong>
                      </div>
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 ${
                          isMust
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : isNice
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {item.category}
                      </span>
                    </div>

                    <p className="text-[11.5px] text-slate-600 mb-1.5 leading-relaxed">
                      {item.description}
                    </p>
                    <div className={`text-[10.5px] font-medium ${isExclusion ? 'text-rose-700' : 'text-teal-800'}`}>
                      <strong>Rule:</strong> {item.rationale}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scope Warning Banner */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertOctagon className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
              <div>
                <strong>Strict Scope Exclusions Enforced:</strong> Live production ERP database writes, automated external
                messaging to debtors, and joining Case F with Case G leads are strictly out-of-scope for the capstone.
              </div>
            </div>
          </div>
        </TaskCard>
      </section>

      {/* ============================================================== */}
      {/* NATURAL HEADING 2: PLAN TASKS & ACCEPTANCE TESTS               */}
      {/* ============================================================== */}
      <section id="vcep-area-plan" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 text-xs font-bold tracking-widest uppercase">
            <Calendar className="w-4 h-4" />
            <span>Natural Heading 02</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            Plan Tasks & Acceptance Tests
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Decompose the capstone into a 10-working-day Work Breakdown Structure (WBS) with RACI role governance,
            strictly cap individual student workload at ≤ 6.0 hours, formulate 5 binary acceptance test gates,
            and establish a read-only handover protocol.
          </p>
        </div>

        {/* TASK 03: SET ACCEPTANCE TESTS */}
        <TaskCard
          taskId="S18-T03"
          taskNumber="TASK 03"
          title="Task 03 — Set Acceptance Tests"
          instruction="Formulate five unambiguous, testable acceptance gates covering control total reconciliation, due-today boundary logic, dispute quarantine, and liquidity feasibility."
          whyMatters="Vague acceptance criteria lead to dispute on Demo Day. Defining objective mathematical formulas (=SUM, =MAX) guarantees transparent quality assurance before client sign-off."
          statusText={`${state.acceptanceCriteria.filter((c) => c.passed).length} / ${state.acceptanceCriteria.length} Gates Verified`}
          outputBadge="Output: 5 Binary Acceptance Gates"
          isActive={activeTaskId === 'S18-T03'}
          onSelectTask={() => setActiveTaskId('S18-T03')}
        >
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <span className="text-xs font-bold text-slate-800">
                  The Five Binary (Pass/Fail) Acceptance Gates
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Click any gate to toggle verification state
              </span>
            </div>

            <div className="space-y-2.5">
              {state.acceptanceCriteria.map((ac) => (
                <div
                  key={ac.id}
                  onClick={() => handleToggleCriterion(ac.id)}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border gap-3 cursor-pointer transition-all ${
                    ac.passed
                      ? 'border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50/70'
                      : 'border-rose-300 bg-rose-50/50 hover:bg-rose-50/70'
                  }`}
                >
                  <div className="space-y-1 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          ac.passed
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {ac.id}
                      </span>
                      <strong className="text-xs font-bold text-slate-900">{ac.criterion}</strong>
                    </div>
                    <div className="text-[11.5px] text-slate-600">
                      <strong>Verification Test Method:</strong> {ac.testMethod}
                    </div>
                    <div className={`text-[11.5px] font-medium ${ac.passed ? 'text-emerald-800' : 'text-rose-800'}`}>
                      <strong>Expected Benchmark:</strong> {ac.expectedResult}
                    </div>
                    <div className="text-[10.5px] text-slate-500 italic">
                      Formula / Audit Evidence: {ac.verificationEvidence}
                    </div>
                  </div>

                  <div className="shrink-0">
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                        ac.passed
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-rose-600 text-white shadow-2xs'
                      }`}
                    >
                      {ac.passed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>GATE PASSED</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>GATE FAILED</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TaskCard>

        {/* TASK 04: PLAN TEN WORKING DAYS */}
        <TaskCard
          taskId="S18-T04"
          taskNumber="TASK 04"
          title="Task 04 — Plan Ten Working Days"
          instruction="Decompose the capstone into a 10-day WBS with RACI ownership, verify that no student exceeds 6.0 hours, and document deliverable governance and handover protocols."
          whyMatters="Without clear task dependencies, RACI role accountability, and workload caps, student teams miss delivery deadlines and violate corporate governance standards."
          statusText={`Total: ${totalSquadHours.toFixed(1)}h | Max: ${maxIndividualHours.toFixed(1)}h`}
          outputBadge="Output: 10-Day WBS & Handover Charter"
          isActive={activeTaskId === 'S18-T04'}
          onSelectTask={() => setActiveTaskId('S18-T04')}
        >
          <div className="space-y-6">
            {/* 10-Day WBS Table */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-700" />
                  <span className="text-xs font-bold text-slate-800">
                    10-Day Work Breakdown Structure (WBS) & RACI Matrix
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-700">
                    Squad Total: <strong className="font-mono text-slate-900">{totalSquadHours.toFixed(1)} hrs</strong>
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                      anyOwnerExceedsCap
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {anyOwnerExceedsCap ? (
                      <>
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        <span>Cap Exceeded (&gt; 6.0h)</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Effort OK (Max: {maxIndividualHours.toFixed(1)}h)</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 font-semibold text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 w-10">ID</th>
                      <th className="py-2.5 px-3">Work Package & Deliverable</th>
                      <th className="py-2.5 px-3 w-36">Owner & Role</th>
                      <th className="py-2.5 px-3 text-center w-14">RACI</th>
                      <th className="py-2.5 px-3 w-24">Schedule</th>
                      <th className="py-2.5 px-3 text-center w-20">Hours</th>
                      <th className="py-2.5 px-3 w-36">Dependency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {state.tasks.map((task) => (
                      <tr key={task.id} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3 font-mono font-bold text-teal-800">{task.id}</td>
                        <td className="py-2.5 px-3">
                          <strong className="text-slate-900 block">{task.task}</strong>
                          <span className="text-[11px] text-slate-500">{task.deliverable}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-900">{task.owner}</div>
                          <span className="text-[10px] text-slate-500">{task.role}</span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`inline-block w-6 h-6 leading-6 text-center rounded-full font-bold text-[11px] ${
                              task.raci === 'A'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-teal-100 text-teal-800 border border-teal-200'
                            }`}
                          >
                            {task.raci}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 font-medium whitespace-nowrap">{task.schedule}</td>
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max="10"
                            value={task.hours}
                            onChange={(e) => handleUpdateTaskHours(task.id, parseFloat(e.target.value) || 0)}
                            className="w-14 px-1.5 py-1 text-xs rounded border border-slate-300 text-center font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-500">{task.dependency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Individual Student Workload Allocations Bar */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block mb-1">
                    Individual Student Workload Allocations:
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(hoursByOwner).map(([owner, hours]) => {
                      const exceeds = hours > CAPSTONE_CONSTRAINTS.maxStudentHours;
                      return (
                        <span key={owner} className={`text-[11.5px] ${exceeds ? 'text-rose-700 font-bold' : 'text-slate-700'}`}>
                          {owner}: <strong>{hours.toFixed(1)}h</strong>{' '}
                          {exceeds ? (
                            <span className="text-rose-600 font-bold">(Exceeds 6h Cap!)</span>
                          ) : (
                            <span className="text-emerald-700 font-semibold">(OK)</span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 shrink-0">
                  Constraint: ≤ 6.0 individual hours over 10 working days
                </span>
              </div>
            </div>

            {/* Risk Register */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <AlertTriangle className="w-4 h-4 text-teal-700" />
                <span className="text-xs font-bold text-slate-800">
                  Project Risk Register & Mitigation Strategy
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 font-semibold text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3 w-10">ID</th>
                      <th className="py-2 px-3 w-48">Identified Risk</th>
                      <th className="py-2 px-3 text-center w-20">Impact</th>
                      <th className="py-2 px-3 text-center w-20">Probability</th>
                      <th className="py-2 px-3">Mitigation Strategy</th>
                      <th className="py-2 px-3 w-40">Risk Owner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {state.risks.map((risk) => (
                      <tr key={risk.id} className="hover:bg-slate-50/60">
                        <td className="py-2 px-3 font-mono font-bold text-teal-800">{risk.id}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">{risk.title}</td>
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded ${
                              risk.impact === 'Critical'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {risk.impact}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center text-slate-500 text-[11px]">{risk.probability}</td>
                        <td className="py-2 px-3 text-[11.5px] text-slate-600 leading-relaxed">{risk.mitigation}</td>
                        <td className="py-2 px-3 text-[11px] text-slate-500">{risk.owner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Read-Only Handover Protocol Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                Client Handover Protocol & Read-Only Governance Agreement:
              </label>
              <textarea
                rows={3}
                value={state.handoverNotes}
                onChange={(e) => saveState({ ...state, handoverNotes: e.target.value })}
                placeholder="State the handover deliverable, recipient roles, and confirm that NO direct production database writes are authorized..."
                className="w-full text-xs rounded-xl border border-slate-300 bg-white p-3 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none leading-relaxed font-sans"
              />
              <div className="flex justify-between items-center text-[11px] text-slate-500 pt-0.5">
                <span>Must explicitly prohibit production system writes and automated external debtor communications.</span>
                <span className="font-mono">{state.handoverNotes.split(/\s+/).filter(Boolean).length} words</span>
              </div>
            </div>

            {/* Project Governance Sign-off */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <Users className="w-4 h-4 text-teal-700" />
                <span className="text-xs font-bold text-slate-800">
                  Project Governance Sign-off & Deliverable Ownership
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Preparer (Project Modeler):
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
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Reviewer (Risk & Audit Lead):
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
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Decision Owner (MD / Proxy):
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
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Project Approval Status:
                  </label>
                  <select
                    value={state.governance.approvalStatus}
                    onChange={(e) =>
                      saveState({
                        ...state,
                        governance: {
                          ...state.governance,
                          approvalStatus: e.target.value as Session18State['governance']['approvalStatus'],
                        },
                      })
                    }
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="Approved">Approved for Delivery</option>
                    <option value="Conditional">Conditional Approval</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Draft">Draft Proposal</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Self-Review Checklist */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <strong className="text-slate-900 block font-bold">
                Student Pre-Submission Verification Checklist:
              </strong>
              <div className="space-y-1.5">
                {checklistItems.map((item, idx) => {
                  const isChecked = state.checkedIndices.includes(idx);
                  return (
                    <label
                      key={idx}
                      className={`flex items-start gap-2.5 cursor-pointer transition-colors ${
                        isChecked ? 'text-emerald-900 font-medium' : 'text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleChecklist(idx)}
                        className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-[11.5px] leading-relaxed">{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Deliverable Metadata & Reset Defaults Bar */}
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-teal-700" />
                <span className="text-slate-800">
                  Deliverable Artifact: <strong className="font-mono text-teal-800">{state.governance.fileVersion}</strong>
                </span>
                {draftTimestamp && <span className="text-slate-500 text-[11px]">· Autosaved at {draftTimestamp}</span>}
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset Defaults</span>
              </button>
            </div>

            {/* Formative Review & Rubric Card */}
            <div
              className={`p-4 rounded-xl border text-xs space-y-3 ${
                reviewReport.hasErrors
                  ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                  : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-current/15">
                <div className="flex items-center gap-2">
                  {reviewReport.hasErrors ? (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  <h4 className="font-bold text-sm">
                    Automatic Project Charter Review: {reviewReport.overallStatus === 'reviewed' ? 'Approved for Handover' : 'Action Required'}
                  </h4>
                </div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full text-white ${
                    reviewReport.hasErrors ? 'bg-rose-700' : 'bg-emerald-700'
                  }`}
                >
                  Estimated Rubric Score: {reviewReport.hasErrors ? '6' : reviewReport.overallStatus === 'reviewed' ? '10' : '8'} / 10 pts
                </span>
              </div>

              <p className="text-[11.5px] leading-relaxed">
                {reviewReport.revisitRecommendations[0] || reviewReport.overallSummary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
                {S18_RUBRIC.map((r, i) => (
                  <div key={i} className="bg-white/80 p-2.5 rounded-lg border border-slate-200/80 shadow-2xs space-y-0.5">
                    <strong className="text-slate-900 block text-[11px]">{r.criterion}</strong>
                    <span className="text-[10px] text-slate-500 leading-snug block">{r.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TaskCard>
      </section>
    </div>
  );
}
