'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  S17_STORAGE_KEY,
  CASE_F_AS_OF_DATE,
  CASE_F_INVOICES,
  CASE_F_LIQUIDITY_SUMMARY,
  CASE_G_CRM_SUMMARY,
  NO_JOIN_KEY_SAFEGUARD,
  DISCOVERY_PRINCIPLES,
  INTERVIEW_DIALOGUE_TURNS,
  INITIAL_DISCOVERY_QUESTIONS,
  MAX_PROBLEM_STATEMENT_WORDS,
  DEFAULT_PROBLEM_STATEMENT,
  INITIAL_DATA_PERMISSIONS,
  INITIAL_ASSUMPTIONS,
  DEFAULT_NEXT_DISCOVERY_ACTION,
  S17_RUBRIC,
  loadSession17State,
  saveSession17State,
  clearSession17State,
  type Session17State,
  type DiscoveryQuestion,
  type DataPermissionCheck,
  type InvalidatingAssumption,
} from './session-17-discovery-data.ts';
import { evaluateSession17 } from '../../../lib/review-engine/session-rules/session-17.ts';
import type { SessionReviewReport } from '../../../lib/review-engine/types.ts';
import {
  Compass,
  FileText,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Table,
  Check,
  HelpCircle,
  Database,
  Layers,
  UserCheck,
  Target,
  MessageSquare,
  Lock,
  ListOrdered,
  Building,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

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

interface Session17DiscoveryJourneyProps {
  onUpdateDraft?: (key: string, value: string) => void;
}

export function Session17DiscoveryJourney({ onUpdateDraft }: Session17DiscoveryJourneyProps) {
  const [state, setState] = useState<Session17State>(() => loadSession17State());
  const [activeTaskId, setActiveTaskId] = useState<string>('S17-T01');
  const [reviewReport, setReviewReport] = useState<SessionReviewReport | null>(null);

  // Initial mount sync
  useEffect(() => {
    const loaded = loadSession17State();
    setState(loaded);
    if (onUpdateDraft) {
      onUpdateDraft('concept:explain', 'Discovery separates client symptoms (requesting an AI dashboard) from root operational causes (imminent ₹20k payroll deficit). A 5-element problem statement specifies Persona, Problem, Evidence, Consequence, and Success Metric while respecting strict dataset boundaries.');
      onUpdateDraft('work-prompt:0', 'Documented 8 discovery questions covering user personas, high-stakes decisions, verified data sources, system join limitations, aging rules, dispute quarantine, scope boundaries, and measurable success metrics.');
      onUpdateDraft('work-prompt:1', loaded.problemStatement);
      onUpdateDraft('work-prompt:2', 'Documented 3 critical invalidating assumptions and defined next discovery action.');
      onUpdateDraft('team:contribution', 'Conducted structured discovery interview with simulated founder, mapped Case F and G datasets separately, drafted 80-word problem statement, and verified data permissions.');
      onUpdateDraft('team:judgement', loaded.governance.decisionOwnerName);
      onUpdateDraft('problem:statement', loaded.problemStatement);
      onUpdateDraft('next:action', loaded.nextDiscoveryAction);
    }
  }, []);

  // Update state helper with auto-persistence and draft sync
  const updateState = (updater: (prev: Session17State) => Session17State) => {
    setState((prev) => {
      const next = updater(prev);
      saveSession17State(next);
      if (onUpdateDraft) {
        onUpdateDraft('concept:explain', 'Discovery separates client symptoms (requesting an AI dashboard) from root operational causes (imminent ₹20k payroll deficit). A 5-element problem statement specifies Persona, Problem, Evidence, Consequence, and Success Metric while respecting strict dataset boundaries.');
        onUpdateDraft('work-prompt:0', 'Documented 8 discovery questions covering user personas, high-stakes decisions, verified data sources, system join limitations, aging rules, dispute quarantine, scope boundaries, and measurable success metrics.');
        onUpdateDraft('work-prompt:1', next.problemStatement);
        onUpdateDraft('work-prompt:2', 'Documented 3 critical invalidating assumptions and defined next discovery action.');
        onUpdateDraft('team:contribution', 'Conducted structured discovery interview with simulated founder, mapped Case F and G datasets separately, drafted 80-word problem statement, and verified data permissions.');
        onUpdateDraft('team:judgement', next.governance.decisionOwnerName);
        onUpdateDraft('problem:statement', next.problemStatement);
        onUpdateDraft('next:action', next.nextDiscoveryAction);
      }
      return next;
    });
  };

  // Question update handler
  const handleUpdateQuestion = (id: string, field: 'stakeholderAnswer' | 'evidenceRequired', val: string) => {
    updateState((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === id ? { ...q, [field]: val } : q)),
    }));
  };

  // Problem statement handler
  const handleProblemStatementChange = (val: string) => {
    updateState((prev) => ({ ...prev, problemStatement: val }));
  };

  // Permission toggle handler
  const handleTogglePermission = (id: string) => {
    updateState((prev) => ({
      ...prev,
      permissions: prev.permissions.map((p) => (p.id === id ? { ...p, isCompliant: !p.isCompliant } : p)),
    }));
  };

  // Assumption update handler
  const handleUpdateAssumption = (id: number, field: keyof InvalidatingAssumption, val: string) => {
    updateState((prev) => ({
      ...prev,
      assumptions: prev.assumptions.map((a) => (a.id === id ? { ...a, [field]: val } : a)),
    }));
  };

  // Next action handler
  const handleNextActionChange = (val: string) => {
    updateState((prev) => ({ ...prev, nextDiscoveryAction: val }));
  };

  // Governance handler
  const handleGovernanceChange = (field: keyof Session17State['governance'], val: string) => {
    updateState((prev) => ({
      ...prev,
      governance: {
        ...prev.governance,
        [field]: val,
      },
    }));
  };

  const handleReset = () => {
    clearSession17State();
    const fresh = loadSession17State();
    setState(fresh);
    setReviewReport(null);
  };

  const handleRunReview = () => {
    const ctx = {
      sessionId: 17,
      draft: {
        'concept:explain': 'Discovery separates client symptoms (requesting an AI dashboard) from root operational causes (imminent ₹20k payroll deficit). A 5-element problem statement specifies Persona, Problem, Evidence, Consequence, and Success Metric while respecting strict dataset boundaries.',
        'work-prompt:0': 'Documented 8 discovery questions covering user personas, high-stakes decisions, verified data sources, system join limitations, aging rules, dispute quarantine, scope boundaries, and measurable success metrics.',
        'work-prompt:1': state.problemStatement,
        'work-prompt:2': 'Documented 3 critical invalidating assumptions and defined next discovery action.',
        'team:contribution': 'Conducted structured discovery interview with simulated founder, mapped Case F and G datasets separately, drafted 80-word problem statement, and verified data permissions.',
        'team:judgement': state.governance.decisionOwnerName,
        'problem:statement': state.problemStatement,
        'next:action': state.nextDiscoveryAction,
      },
      workstationData: {
        questions: state.questions,
        problemStatement: state.problemStatement,
        permissions: state.permissions,
        assumptions: state.assumptions,
        nextDiscoveryAction: state.nextDiscoveryAction,
        governance: state.governance,
        fileVersion: state.governance.fileVersion || 'StudentID_S17_v01.xlsx',
      },
    };
    const report = evaluateSession17(ctx);
    setReviewReport(report);
  };

  // Word count check
  const problemStatementWords = useMemo(() => {
    return state.problemStatement.trim().split(/\s+/).filter(Boolean).length;
  }, [state.problemStatement]);

  const isProblemStatementWordCountValid = problemStatementWords > 0 && problemStatementWords <= MAX_PROBLEM_STATEMENT_WORDS + 5;

  // 5-Element Framework detection
  const elementDetection = useMemo(() => {
    const lower = state.problemStatement.toLowerCase();
    return {
      hasPersona: lower.includes('managing director') || lower.includes('founder') || lower.includes('collections lead'),
      hasProblem: lower.includes('visibility') || lower.includes('deficit') || lower.includes('receivables'),
      hasEvidence: lower.includes('1,00,000') || lower.includes('100,000') || lower.includes('4 invoices') || lower.includes('20,000'),
      hasConsequence: lower.includes('payroll') || lower.includes('prioritize') || lower.includes('debt') || lower.includes('default'),
      hasSuccess: lower.includes('zero variance') || lower.includes('reconcil') || lower.includes('10 working days') || lower.includes('surplus'),
    };
  }, [state.problemStatement]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* ==================================================== */}
      {/* EXECUTIVE MISSION BANNER */}
      {/* ==================================================== */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
              <span>Session 17 · Professional Workplace Experience</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Discover the Problem Before Building.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              The founder of Vayentra Labs requests an AI dashboard to solve poor cash visibility. Your mission: uncover the underlying operational bottleneck (an impending ₹20,000 payroll deficit), document the strict dataset boundaries between Case F receivables and Case G leads, and author a disciplined 80-word business problem statement.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <a
              href="#vcep-area-client"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold shadow-md transition-colors"
            >
              <span>1. Listen to Client Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#vcep-area-brief"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-200 border border-teal-500/30 text-sm font-semibold transition-colors"
            >
              <span>2. Write Discovery Brief</span>
              <FileText className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 4 Cardinal Principles of Challenge Discovery */}
        <div className="mt-8 pt-6 border-t border-indigo-900/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DISCOVERY_PRINCIPLES.map((principle) => (
            <div
              key={principle.principleNum}
              className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/60 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">
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
      {/* HEADING 1: LISTEN TO THE CLIENT CHALLENGE */}
      {/* ==================================================== */}
      <section id="vcep-area-client" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 text-xs font-bold tracking-widest uppercase">
            <MessageSquare className="w-4 h-4" />
            <span>Natural Heading 01</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            Listen to the Client Challenge
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Simulate the founder discovery interview, separate subjective complaints from validated ledger records, and inspect source boundaries.
          </p>
        </div>

        {/* TASK 01: PREPARE DISCOVERY QUESTIONS */}
        <TaskCard
          taskId="S17-T01"
          taskNumber="TASK 01"
          title="Task 01 — Prepare Discovery Questions"
          instruction="Formulate eight targeted discovery questions covering users, decisions, verified data sources, and measurable success metrics before proposing technical solutions."
          whyMatters="Clients frequently request surface solutions (e.g., an AI executive dashboard) while concealing root operational problems. Structuring discovery questions across 5 dimensions uncovers actual operational constraints and prevents expensive rework."
          statusText="8 / 8 Documented"
          outputBadge="Output: 8 Discovery Questions"
          isActive={activeTaskId === 'S17-T01'}
          onSelectTask={() => setActiveTaskId('S17-T01')}
        >
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-teal-700" />
                <span className="text-xs font-bold text-slate-800">
                  Discovery Question Matrix (5 Operational Dimensions)
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Spans Users, Decisions, Evidence, Permissions, Success
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.questions.map((q) => (
                <div
                  key={q.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2.5 transition-shadow hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200">
                      {q.dimension} · {q.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {q.id}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-900 leading-snug">
                    {q.question}
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-200 text-xs">
                    <div>
                      <span className="font-semibold text-slate-900">Client Finding: </span>
                      <span className="text-slate-700">{q.stakeholderAnswer}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-600">Evidence Needed: </span>
                      <span className="text-slate-500">{q.evidenceRequired}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TaskCard>

        {/* TASK 02: RECORD THE INTERVIEW & VALIDATE FACTS */}
        <TaskCard
          taskId="S17-T02"
          taskNumber="TASK 02"
          title="Task 02 — Record the Interview & Validate Facts"
          instruction="Analyze the 4-turn discovery interview to separate subjective founder statements from measured ledger facts, and inspect Case F and Case G source datasets under strict no-join boundary rules."
          whyMatters="Commercial founders often report symptoms ('poor cash visibility') rather than root causes (impending ₹20k payroll deficit). Rigorous ledger reconciliation prevents premature data joins between non-relational systems like sales inquiries and billing invoices."
          statusText="Verified Facts & Boundaries"
          outputBadge="Output: Interview Record & Boundary Map"
          isActive={activeTaskId === 'S17-T02'}
          onSelectTask={() => setActiveTaskId('S17-T02')}
        >
          <div className="space-y-6">
            {/* Interview Simulator */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-teal-700" />
                  <span className="text-xs font-bold text-slate-800">
                    Client Discovery Interview Simulator (Vayentra Labs Founder)
                  </span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                  4 Dialogue Turns
                </span>
              </div>

              <div className="space-y-4">
                {INTERVIEW_DIALOGUE_TURNS.map((turn) => (
                  <div
                    key={turn.turnId}
                    className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-xs"
                  >
                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                        Turn 0{turn.turnId} · {turn.topic}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Founder vs Ledger Reality
                      </span>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Founder Statement */}
                      <div className="space-y-1.5 p-3 rounded-lg bg-amber-50/70 border border-amber-200/80">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900">
                          <Building className="w-4 h-4 shrink-0 text-amber-700" />
                          <span>Founder Statement (Subjective Complaint)</span>
                        </div>
                        <p className="text-slate-800 italic leading-relaxed">
                          "{turn.founderStatement}"
                        </p>
                      </div>

                      {/* Validated Source Fact */}
                      <div className="space-y-1.5 p-3 rounded-lg bg-teal-50/70 border border-teal-200/80">
                        <div className="flex items-center gap-1.5 font-bold text-teal-900">
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                          <span>Validated Financial Reality (Measured Fact)</span>
                        </div>
                        <p className="text-slate-800 leading-relaxed">
                          {turn.validatedSourceFact}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-100 text-[11px] text-slate-600">
                      <strong className="text-slate-900">Discovery Takeaway:</strong> {turn.analyticalFinding}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Source Datasets & Boundary Safeguard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              {/* Panel 1: Case F Receivables */}
              <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Database className="w-4 h-4 text-teal-700" />
                      <span>Case F Receivables & Liquidity Ledger</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      As of <strong>{CASE_F_AS_OF_DATE}</strong>. Control Total: ₹1,00,000 across 4 invoices.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-rose-100 text-rose-800 border border-rose-200">
                    ₹20k Deficit!
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Bank Cash</span>
                    <div className="text-sm font-mono font-bold text-slate-900">₹25,000</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">7-Day Outflows</span>
                    <div className="text-sm font-mono font-bold text-rose-600">₹45,000</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                    <span className="text-[10px] text-rose-600 uppercase font-bold">Net Deficit</span>
                    <div className="text-sm font-mono font-bold text-rose-700">-₹20,000</div>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 font-semibold text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-2.5">ID</th>
                        <th className="py-2 px-2.5">Customer</th>
                        <th className="py-2 px-2.5">Due Date</th>
                        <th className="py-2 px-2.5 text-right">Amount (₹)</th>
                        <th className="py-2 px-2.5">Overdue</th>
                        <th className="py-2 px-2.5">Status Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {CASE_F_INVOICES.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/60">
                          <td className="py-2 px-2.5 font-mono font-bold text-slate-900">{inv.id}</td>
                          <td className="py-2 px-2.5 font-medium text-slate-800">{inv.customer}</td>
                          <td className="py-2 px-2.5 font-mono text-[11px] text-slate-600">{inv.dueDate}</td>
                          <td className="py-2 px-2.5 text-right font-mono font-bold text-slate-900">
                            ₹{inv.amountINR.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2 px-2.5">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                inv.overdueDays === 0
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-rose-100 text-rose-800 border border-rose-200'
                              }`}
                            >
                              {inv.overdueDays === 0 ? 'Current' : `${inv.overdueDays}d Overdue`}
                            </span>
                          </td>
                          <td className="py-2 px-2.5 text-[11px] text-slate-500 max-w-[140px] truncate" title={inv.statusNote}>
                            {inv.statusNote}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Panel 2: Case G CRM Release */}
              <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Database className="w-4 h-4 text-teal-700" />
                      <span>Case G CRM Inquiries Release</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      As of <strong>31 October 2026</strong>. 8 distinct commercial sales inquiries.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-200 text-slate-800">
                    8 Leads Total
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] text-emerald-700 uppercase font-bold">Closed Won</span>
                    <div className="text-sm font-mono font-bold text-emerald-800">3 Leads</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Closed Lost</span>
                    <div className="text-sm font-mono font-bold text-slate-700">2 Leads</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200">
                    <span className="text-[10px] text-teal-700 uppercase font-bold">Open Active</span>
                    <div className="text-sm font-mono font-bold text-teal-800">3 Leads</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-white border border-slate-200 text-xs space-y-2 text-slate-700 leading-relaxed">
                  <div>
                    <strong>Active Open Leads:</strong> L06 (Confirm requirements, Due 28 Oct · 3d overdue), L07 (Review proposal, Due 30 Oct · 1d overdue), L08 (Schedule call, Due 03 Nov).
                  </div>
                  <div>
                    <strong>Curriculum Constraint:</strong> Inquiries have <strong>no customer ID or billing relation</strong> to Asha, Beacon, Cedar, or Delta.
                  </div>
                </div>

                {/* Strict Boundary Alert */}
                <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <div>
                    <strong>{NO_JOIN_KEY_SAFEGUARD}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TaskCard>
      </section>

      {/* ==================================================== */}
      {/* HEADING 2: WRITE THE DISCOVERY BRIEF */}
      {/* ==================================================== */}
      <section id="vcep-area-brief" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 text-xs font-bold tracking-widest uppercase">
            <FileText className="w-4 h-4" />
            <span>Natural Heading 02</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            Write the Discovery Brief
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Formulate the 8 structured discovery questions, author the 80-word business problem statement, and verify data permissions.
          </p>
        </div>

        {/* TASK 03: DEFINE THE BUSINESS PROBLEM */}
        <TaskCard
          taskId="S17-T03"
          taskNumber="TASK 03"
          title="Task 03 — Define the Business Problem"
          instruction="Synthesize interview discoveries into an actionable, executive-ready problem statement under 80 words containing all 5 architectural elements: Persona, Problem, Evidence, Consequence, and Success Metric."
          whyMatters="A disciplined problem statement aligns cross-functional stakeholders on the quantified business pain, prevents scope creep, and establishes an objective criteria for project success."
          statusText={`${problemStatementWords} / ${MAX_PROBLEM_STATEMENT_WORDS} Words`}
          outputBadge="Output: ≤80-Word Problem Statement"
          isActive={activeTaskId === 'S17-T03'}
          onSelectTask={() => setActiveTaskId('S17-T03')}
        >
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-700" />
                <span className="text-xs font-bold text-slate-800">
                  5-Element Architectural Problem Formulation
                </span>
              </div>
              <span
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                  isProblemStatementWordCountValid
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                }`}
              >
                {problemStatementWords} / {MAX_PROBLEM_STATEMENT_WORDS} Words {isProblemStatementWordCountValid ? '✓' : '(Exceeds Limit!)'}
              </span>
            </div>

            {/* 5 Architecture Elements Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div
                className={`p-2 rounded-lg border transition-colors ${
                  elementDetection.hasPersona
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="font-bold text-[11px]">1. Persona</div>
                <div className="text-[10px]">MD & Collections</div>
              </div>
              <div
                className={`p-2 rounded-lg border transition-colors ${
                  elementDetection.hasProblem
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="font-bold text-[11px]">2. Problem</div>
                <div className="text-[10px]">Visibility & Deficit</div>
              </div>
              <div
                className={`p-2 rounded-lg border transition-colors ${
                  elementDetection.hasEvidence
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="font-bold text-[11px]">3. Evidence</div>
                <div className="text-[10px]">₹1,00k / ₹20k Deficit</div>
              </div>
              <div
                className={`p-2 rounded-lg border transition-colors ${
                  elementDetection.hasConsequence
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="font-bold text-[11px]">4. Consequence</div>
                <div className="text-[10px]">Payroll Default Risk</div>
              </div>
              <div
                className={`p-2 rounded-lg border transition-colors ${
                  elementDetection.hasSuccess
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="font-bold text-[11px]">5. Success</div>
                <div className="text-[10px]">Zero Variance / 10d</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Executive Problem Statement (Target ≤80 words):
              </label>
              <textarea
                rows={4}
                value={state.problemStatement}
                onChange={(e) => handleProblemStatementChange(e.target.value)}
                className={`w-full text-xs rounded-xl border p-3 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none leading-relaxed font-sans ${
                  isProblemStatementWordCountValid
                    ? 'border-slate-300 bg-white'
                    : 'border-rose-400 bg-rose-50/30'
                }`}
              />
            </div>
          </div>
        </TaskCard>

        {/* TASK 04: CHECK ASSUMPTIONS & VERIFY GOVERNANCE */}
        <TaskCard
          taskId="S17-T04"
          taskNumber="TASK 04"
          title="Task 04 — Check Assumptions & Verify Governance"
          instruction="Verify data compliance permissions, document 3 invalidating assumptions with empirical mitigations, record the next discovery action, and formalize deliverable sign-off."
          whyMatters="Unverified assumptions in data pipelines and credit management lead to project failure. Documenting invalidation triggers, data access safeguards, and named accountability ensures institutional governance."
          statusText={`${state.permissions.filter((p) => p.isCompliant).length} / ${state.permissions.length} Permissions`}
          outputBadge="Output: Deliverable Governance & Review"
          isActive={activeTaskId === 'S17-T04'}
          onSelectTask={() => setActiveTaskId('S17-T04')}
        >
          <div className="space-y-6">
            {/* Data Permission & Boundary Compliance */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-teal-700" />
                  <span className="text-xs font-bold text-slate-800">
                    Data Permission & Boundary Compliance Checklist
                  </span>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {state.permissions.filter((p) => p.isCompliant).length} / {state.permissions.length} Verified
                </span>
              </div>

              <div className="space-y-2">
                {state.permissions.map((perm) => (
                  <label
                    key={perm.id}
                    onClick={() => handleTogglePermission(perm.id)}
                    className={`p-3 rounded-lg border flex items-start gap-3 cursor-pointer transition-colors ${
                      perm.isCompliant
                        ? 'border-emerald-300 bg-emerald-50/50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={perm.isCompliant}
                      onChange={() => handleTogglePermission(perm.id)}
                      className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <div className="text-xs">
                      <strong className="block text-slate-900 font-bold">
                        {perm.title}
                      </strong>
                      <span className="text-slate-600">
                        {perm.description}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 3 Invalidating Assumptions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <ShieldAlert className="w-4 h-4 text-teal-700" />
                <span className="text-xs font-bold text-slate-800">
                  Three Assumptions That Could Invalidate the Solution
                </span>
              </div>

              <div className="space-y-3">
                {state.assumptions.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 p-4 space-y-2 bg-slate-50/40 text-xs shadow-xs"
                  >
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>{item.assumptionText}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                        Risk 0{item.id}
                      </span>
                    </div>
                    <div className="text-rose-700">
                      <strong>Invalidation Trigger:</strong> {item.invalidationTrigger}
                    </div>
                    <div className="text-slate-600">
                      <strong>Evidence Mitigation:</strong> {item.evidenceMitigation}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Next Discovery Action Prior to Model Build:
                </label>
                <textarea
                  rows={2}
                  value={state.nextDiscoveryAction}
                  onChange={(e) => handleNextActionChange(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 bg-white p-3 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none leading-relaxed font-sans"
                />
              </div>
            </div>

            {/* Deliverable Governance & Named Review Roles */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <UserCheck className="w-4 h-4 text-teal-700" />
                <span className="text-xs font-bold text-slate-800">
                  Deliverable Governance & Named Review Roles
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Preparer Name & Title
                  </label>
                  <input
                    type="text"
                    value={state.governance.preparerName}
                    onChange={(e) => handleGovernanceChange('preparerName', e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Senior Reviewer Name
                  </label>
                  <input
                    type="text"
                    value={state.governance.reviewerName}
                    onChange={(e) => handleGovernanceChange('reviewerName', e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Commercial Decision Owner
                  </label>
                  <input
                    type="text"
                    value={state.governance.decisionOwnerName}
                    onChange={(e) => handleGovernanceChange('decisionOwnerName', e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Portfolio Handover & Formative Review Drawer */}
            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-teal-400" />
                    <h4 className="text-base font-bold text-white">
                      Portfolio Handover & Formative Review
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    Official deliverable file: <code className="text-teal-300 font-mono font-semibold">{state.governance.fileVersion}</code> containing discovery interview record, 8 questions, 80-word problem statement, and risk assumptions.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReset}
                    type="button"
                    className="text-xs font-medium px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reset Inputs</span>
                  </button>
                  <button
                    onClick={handleRunReview}
                    type="button"
                    className="text-xs font-bold px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white shadow-md transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-200" />
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
                {S17_RUBRIC.map((crit) => (
                  <div key={crit.id} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60 space-y-1">
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
          </div>
        </TaskCard>
      </section>
    </div>
  );
}
